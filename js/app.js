/* Dalanwas — site behaviour. Content lives in js/data.js */
(() => {
  "use strict";
  const D = window.DV || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} }
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- language ---------- */
  let lang = store.get("dv-lang") === "hi" ? "hi" : "en";
  const L = (en, hi) => (lang === "hi" ? hi : en);
  const pick = (o) => (o ? (o[lang] ?? o.en) : "");
  const locale = () => (lang === "hi" ? "hi-IN" : "en-IN");
  const renderers = [];
  const onLang = (fn) => { renderers.push(fn); fn(); };

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    store.set("dv-lang", l);
    $$("[data-ph-en]").forEach(el => el.placeholder = el.dataset[l === "hi" ? "phHi" : "phEn"]);
    $$(".lang-btn").forEach(b => b.textContent = l === "hi" ? "EN" : "हिं");
    $$(".lang-btn").forEach(b => b.setAttribute("aria-label", l === "hi" ? "Switch to English" : "हिंदी में देखें"));
    renderers.forEach(fn => fn());
  }

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    const m = $('meta[name="theme-color"]');
    if (m) m.content = t === "dark" ? "#0A1222" : "#1F3A68";
  }
  const sysDark = matchMedia("(prefers-color-scheme: dark)");
  applyTheme(store.get("dv-theme") || (sysDark.matches ? "dark" : "light"));
  sysDark.addEventListener?.("change", e => { if (!store.get("dv-theme")) applyTheme(e.matches ? "dark" : "light"); });

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.append(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------- dates & events ---------- */
  const parseD = (s, time) => { const [y, m, d] = s.split("-").map(Number); const [h, mi] = (time || "09:00").split(":").map(Number); return new Date(y, m - 1, d, h, mi); };
  const today0 = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const fmt = (d, o) => d.toLocaleDateString(locale(), o);

  function occurrences() {
    const out = [];
    const thisYear = new Date().getFullYear();
    (D.events || []).forEach(e => {
      const base = parseD(e.date, e.time);
      if (e.repeat === "yearly") {
        for (let y = base.getFullYear(); y <= thisYear + 1; y++) {
          const d = new Date(base); d.setFullYear(y);
          out.push({ ...e, when: d, key: e.id + "-" + y });
        }
      } else out.push({ ...e, when: base, key: e.id });
    });
    return out.sort((a, b) => a.when - b.when);
  }
  const upcoming = () => { const t = today0(); return occurrences().filter(o => o.when >= t); };
  const past = () => { const t = today0(); return occurrences().filter(o => o.when < t).reverse(); };

  const catName = (c) => ({
    cultural: ["Cultural", "सांस्कृतिक"], religious: ["Religious", "धार्मिक"], government: ["Government", "सरकारी"],
    sports: ["Sports", "खेल"], library: ["Library", "पुस्तकालय"], panchayat: ["Panchayat", "पंचायत"],
    village: ["Village", "गांव"], health: ["Health", "स्वास्थ्य"], heritage: ["Heritage", "विरासत"], events: ["Events", "कार्यक्रम"], all: ["All", "सभी"]
  }[c] || [c, c]);
  const catLabel = (c) => L(...catName(c));

  function icsFor(o) {
    const p = (n) => String(n).padStart(2, "0");
    const d = o.when, end = new Date(d.getTime() + (o.time ? 3 : 10) * 3600e3);
    const stamp = (x) => o.time
      ? `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`
      : `${x.getFullYear()}${p(x.getMonth() + 1)}${p(x.getDate())}`;
    const nextDay = new Date(d); nextDay.setDate(d.getDate() + 1);
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Dalanwas//Events//EN", "BEGIN:VEVENT",
      `UID:${o.key}@dalanwas.in`,
      o.time ? `DTSTART;TZID=Asia/Kolkata:${stamp(d)}` : `DTSTART;VALUE=DATE:${stamp(d)}`,
      o.time ? `DTEND;TZID=Asia/Kolkata:${stamp(end)}` : `DTEND;VALUE=DATE:${stamp(nextDay)}`,
      `SUMMARY:${pick(o).t}`, `DESCRIPTION:${pick(o).d}`, `LOCATION:${pick(o).p}, Dalanwas, Haryana`,
      "END:VEVENT", "END:VCALENDAR"
    ];
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(lines.join("\r\n"));
  }
  function waShare(text, url) { return "https://wa.me/?text=" + encodeURIComponent(text + (url ? "\n" + url : "")); }
  const siteUrl = (path) => new URL(path, location.href).href;

  function eventCard(o) {
    const t = today0(), isToday = sameDay(o.when, t), isPast = o.when < t;
    const tx = pick(o);
    const timeStr = o.time ? o.when.toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" }) : "";
    const shareText = `${tx.t} — ${fmt(o.when, { day: "numeric", month: "long", year: "numeric" })}, ${tx.p}, Dalanwas`;
    const set = "ev-" + o.key, cap = `data-cap-en="${esc(o.en.t)}" data-cap-hi="${esc(o.hi.t)}"`;
    const extra = (o.more || []).map(m => `<span hidden data-lb="${esc(m)}" data-lb-set="${esc(set)}" ${cap}></span>`).join("");
    const media = o.img ? `<button class="ev__img" data-lb="${esc(o.img)}" data-lb-set="${esc(set)}" ${cap} aria-label="${L("View photo", "फोटो देखें")}: ${esc(tx.t)}"><img loading="lazy" src="${thumb(o.img)}" alt=""></button>${extra}` : "";
    const more = o.link ? `<a class="btn btn--sm btn--neel" href="${esc(o.link)}">${esc(tx.link || L("Details", "विवरण"))}</a>` : (o.img && tx.link ? `<button class="btn btn--sm btn--neel" data-lb-open="${esc(set)}">${esc(tx.link)}</button>` : "");
    return `<article class="ev ${o.img ? "has-img" : ""} ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""}" id="${esc(o.key)}">
      <div class="ev__date"><b>${o.when.getDate()}</b><span>${esc(fmt(o.when, { month: "short" }))} ${o.when.getFullYear()}</span></div>
      <div>
        <div class="ev__meta"><span class="tag tag--${o.cat}">${esc(catLabel(o.cat))}</span>${isToday ? `<strong>${L("Today", "आज")}</strong>` : ""}</div>
        <h3>${esc(tx.t)}</h3>
        <p>${esc(tx.d)}</p>
        <div class="ev__meta"><span>📍 ${esc(tx.p)}</span>${timeStr ? `<span>🕒 ${esc(timeStr)}</span>` : ""}</div>
        ${isPast ? (more ? `<div class="ev__actions">${more}</div>` : "") : `<div class="ev__actions">${more}
          <a class="btn btn--sm btn--ghost" download="${esc(o.key)}.ics" href="${icsFor(o)}">${L("Add to calendar", "कैलेंडर में जोड़ें")}</a>
          <a class="btn btn--sm btn--ghost" target="_blank" rel="noopener" href="${waShare(shareText, siteUrl("events.html#" + o.key))}">${L("Share on WhatsApp", "व्हाट्सऐप पर भेजें")}</a>
        </div>`}
      </div>${media}
    </article>`;
  }

  /* ---------- header bits ---------- */
  function clock() {
    const t = $("#tbTime"), d = $("#tbDate");
    const tick = () => {
      const n = new Date();
      if (t) t.textContent = n.toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" });
      if (d) d.textContent = n.toLocaleDateString(locale(), { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    };
    onLang(tick); setInterval(tick, 15000);
  }

  function greeting() {
    const el = $("#greeting"); if (!el) return;
    const t = today0();
    const g = (D.greetings || []).find(g => parseD(g.from, "00:00") <= t && t <= parseD(g.to, "23:59"));
    if (!g) { el.remove(); return; }
    el.hidden = false;
    onLang(() => el.textContent = pick(g));
  }

  /* ---------- weather ---------- */
  const WX = (c) => {
    if (c === 0) return ["☀️", "Clear", "साफ़"];
    if (c <= 2) return ["🌤️", "Partly cloudy", "आंशिक बादल"];
    if (c === 3) return ["☁️", "Cloudy", "बादल"];
    if (c <= 48) return ["🌫️", "Fog", "कोहरा"];
    if (c <= 57) return ["🌦️", "Drizzle", "बूंदाबांदी"];
    if (c <= 67) return ["🌧️", "Rain", "बारिश"];
    if (c <= 77) return ["🌨️", "Snow", "बर्फ़"];
    if (c <= 82) return ["🌧️", "Showers", "बौछारें"];
    return ["⛈️", "Thunderstorm", "आंधी-तूफ़ान"];
  };
  let wxData = null;
  async function weather() {
    const tb = $("#tbWeather"), box = $("#weather");
    if (!tb && !box) return;
    const KEY = "dv-wx";
    try {
      const cached = JSON.parse(store.get(KEY) || "null");
      if (cached && Date.now() - cached.at < 30 * 60e3) wxData = cached.data;
    } catch {}
    if (!wxData) {
      try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=28.28&longitude=76.15&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=4");
        if (!r.ok) throw 0;
        wxData = await r.json();
        store.set(KEY, JSON.stringify({ at: Date.now(), data: wxData }));
      } catch {
        if (tb) tb.textContent = "";
        if (box) box.innerHTML = `<p class="muted">${L("Weather is unavailable right now. Check your internet connection.", "मौसम की जानकारी अभी उपलब्ध नहीं है। इंटरनेट कनेक्शन जांचें।")}</p>`;
        return;
      }
    }
    onLang(() => {
      const c = wxData.current, w = WX(c.weather_code);
      if (tb) tb.textContent = `${w[0]} ${Math.round(c.temperature_2m)}°C ${L(w[1], w[2])}`;
      if (!box) return;
      const d = wxData.daily;
      box.innerHTML = `<div class="weather-now"><span style="font-size:2.6rem">${w[0]}</span>
        <div><div class="weather-now__temp">${Math.round(c.temperature_2m)}°</div><div>${L(w[1], w[2])}</div></div>
        <div class="muted" style="margin-left:auto;text-align:right;font-size:.9rem">${L("Humidity", "नमी")} ${c.relative_humidity_2m}%<br>${L("Wind", "हवा")} ${Math.round(c.wind_speed_10m)} km/h</div></div>
        <div class="weather-days">${d.time.map((t, i) => {
          const dd = parseD(t), ww = WX(d.weather_code[i]);
          return `<div><span>${i === 0 ? L("Today", "आज") : esc(fmt(dd, { weekday: "short" }))}</span><b aria-label="${L(ww[1], ww[2])}">${ww[0]}</b>${Math.round(d.temperature_2m_max[i])}° / ${Math.round(d.temperature_2m_min[i])}°<br><span class="rain">💧 ${d.precipitation_probability_max[i] ?? 0}%</span></div>`;
        }).join("")}</div>`;
    });
  }

  /* ---------- notices ---------- */
  function notices() {
    const el = $("#notices"); if (!el) return;
    onLang(() => {
      const soon = upcoming().filter(o => o.when - today0() < 14 * 864e5).map(o => ({
        soon: true, today: sameDay(o.when, today0()), url: o.link || ("events.html#" + o.key), tag: o.cat,
        text: `${pick(o).t} — ${sameDay(o.when, today0()) ? L("today", "आज") : fmt(o.when, { day: "numeric", month: "long" })}, ${pick(o).p}`
      }));
      const items = soon.concat((D.notices || []).map(n => ({ text: pick(n), tag: n.tag, url: n.url, date: n.date })));
      el.innerHTML = items.slice(0, +(el.dataset.limit || 6)).map(n => `<li><span class="pin ${n.soon ? "is-soon" : ""}" aria-hidden="true"></span>
        <div>${n.url ? `<a href="${esc(n.url)}">${esc(n.text)}</a>` : esc(n.text)}</div>
        <span class="when"><span class="tag tag--${esc(n.tag)}">${esc(catLabel(n.tag))}</span>${n.soon ? " · " + (n.today ? L("Today", "आज") : L("Coming up", "आगामी")) : ""}</span></li>`).join("");
    });
  }

  /* ---------- next event + countdown ---------- */
  function nextEvent() {
    const el = $("#nextEvent"); if (!el) return;
    let timer;
    onLang(() => {
      clearInterval(timer);
      const n = upcoming()[0];
      if (!n) { el.innerHTML = `<div><h2>${L("No upcoming events yet", "अभी कोई आगामी कार्यक्रम नहीं")}</h2><p>${L("New events will appear here as soon as they are announced.", "नए कार्यक्रम घोषित होते ही यहां दिखेंगे।")}</p></div>`; return; }
      const tx = pick(n);
      const isToday = sameDay(n.when, today0());
      el.innerHTML = `<div><p>${L("Next in Dalanwas", "डालनवास में अगला कार्यक्रम")}</p><h2>${esc(tx.t)}</h2>
        <p>${esc(fmt(n.when, { weekday: "long", day: "numeric", month: "long", year: "numeric" }))} · ${esc(tx.p)}</p>
        <p class="ne__more"><a href="events.html#${esc(n.key)}">${L("See all events", "सभी कार्यक्रम देखें")}</a></p></div>
        ${isToday ? `<div class="today-badge">${L("Happening today", "आज हो रहा है")}</div>` : `<div class="countdown" role="timer" aria-live="off"></div>`}`;
      if (isToday) return;
      const cd = $(".countdown", el);
      const tick = () => {
        let s = Math.max(0, Math.floor((n.when - Date.now()) / 1000));
        const parts = [[Math.floor(s / 86400), L("days", "दिन")], [Math.floor(s % 86400 / 3600), L("hours", "घंटे")], [Math.floor(s % 3600 / 60), L("min", "मिनट")], [s % 60, L("sec", "सेकंड")]];
        cd.innerHTML = parts.map(([v, l]) => `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`).join("");
      };
      tick(); timer = setInterval(tick, 1000);
    });
  }

  /* ---------- events page ---------- */
  function eventsPage() {
    const up = $("#evUpcoming"); if (!up) return;
    const pastEl = $("#evPast"), chips = $("#evFilters");
    let cat = "all";
    const cats = ["all", ...new Set((D.events || []).map(e => e.cat))];
    const draw = () => {
      chips.innerHTML = cats.map(c => `<button class="chip" data-c="${c}" aria-pressed="${c === cat}">${esc(catLabel(c))}</button>`).join("");
      const f = (o) => cat === "all" || o.cat === cat;
      const u = upcoming().filter(f), p = past().filter(f).slice(0, 8);
      up.innerHTML = u.length ? u.map(eventCard).join("") : `<div class="empty">${L("No upcoming events in this category. Try “All”.", "इस श्रेणी में कोई आगामी कार्यक्रम नहीं। “सभी” चुनें।")}</div>`;
      pastEl.innerHTML = p.length ? p.map(eventCard).join("") : `<div class="empty">${L("Nothing here yet.", "अभी कुछ नहीं।")}</div>`;
      if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t && !draw.done) { draw.done = true; setTimeout(() => t.scrollIntoView({ block: "center" }), 60); } }
    };
    chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; cat = b.dataset.c; draw(); });
    onLang(draw);
    calendar();
  }

  function calendar() {
    const el = $("#cal"); if (!el) return;
    let view = new Date(); view.setDate(1);
    let sel = null;
    const occ = occurrences();
    const draw = () => {
      const y = view.getFullYear(), m = view.getMonth();
      const first = new Date(y, m, 1), startDow = (first.getDay() + 6) % 7; // Monday first
      const days = new Date(y, m + 1, 0).getDate();
      const dows = [...Array(7)].map((_, i) => fmt(new Date(2024, 0, 1 + i), { weekday: "narrow" }));
      let cells = "";
      for (let i = 0; i < startDow; i++) cells += `<span class="cal__day is-other" aria-hidden="true"></span>`;
      for (let d = 1; d <= days; d++) {
        const dt = new Date(y, m, d), has = occ.some(o => sameDay(o.when, dt));
        const label = fmt(dt, { day: "numeric", month: "long" }) + (has ? ", " + L("has events", "कार्यक्रम है") : "");
        cells += `<button class="cal__day ${has ? "has-ev" : ""} ${sameDay(dt, new Date()) ? "is-today" : ""}" data-d="${d}" aria-label="${esc(label)}" aria-pressed="${sel && sameDay(sel, dt)}">${d}</button>`;
      }
      el.innerHTML = `<div class="cal__head"><button class="icon-btn" data-nav="-1" aria-label="${L("Previous month", "पिछला महीना")}">‹</button>
        <h3>${esc(fmt(first, { month: "long", year: "numeric" }))}</h3>
        <button class="icon-btn" data-nav="1" aria-label="${L("Next month", "अगला महीना")}">›</button></div>
        <div class="cal__grid">${dows.map(d => `<span class="cal__dow">${d}</span>`).join("")}${cells}</div>
        <div class="cal__out" aria-live="polite">${sel ? (occ.filter(o => sameDay(o.when, sel)).map(o => `<a href="#${esc(o.key)}">${esc(pick(o).t)}</a>`).join("") || L("No events on this day.", "इस दिन कोई कार्यक्रम नहीं।")) : `<span class="muted">${L("Pick a day with a yellow dot to see its events.", "पीले बिंदु वाले दिन को चुनें।")}</span>`}</div>`;
    };
    el.addEventListener("click", e => {
      const n = e.target.closest("[data-nav]");
      if (n) { view.setMonth(view.getMonth() + +n.dataset.nav); sel = null; draw(); return; }
      const d = e.target.closest(".cal__day[data-d]");
      if (d) { sel = new Date(view.getFullYear(), view.getMonth(), +d.dataset.d); draw(); }
    });
    onLang(draw);
  }

  /* ---------- gallery + lightbox ---------- */
  let lbItems = [], lbIdx = 0;
  const img = (src) => "images/" + src;
  const thumb = (src) => "images/thumbs/" + src;

  function lightboxInit() {
    if ($("#lightbox")) return;
    const lb = document.createElement("div");
    lb.id = "lightbox"; lb.className = "lightbox"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
    lb.innerHTML = `<div class="lightbox__bar"><span id="lbCount"></span><div style="display:flex;gap:.5rem">
      <button class="lb-btn" id="lbShare" aria-label="Share">⤴</button><button class="lb-btn" id="lbClose" aria-label="Close">✕</button></div></div>
      <div class="lightbox__stage"><img id="lbImg" alt=""><button class="lb-btn lb-prev" aria-label="Previous">‹</button><button class="lb-btn lb-next" aria-label="Next">›</button></div>
      <div class="lightbox__cap" id="lbCap"></div>`;
    document.body.append(lb);
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; lbItems.opener?.focus(); };
    $("#lbClose").onclick = close;
    $(".lb-prev", lb).onclick = () => lbShow(lbIdx - 1);
    $(".lb-next", lb).onclick = () => lbShow(lbIdx + 1);
    lb.addEventListener("click", e => { if (e.target.classList.contains("lightbox__stage")) close(); });
    $("#lbShare").onclick = async () => {
      const it = lbItems[lbIdx], url = siteUrl(img(it.src));
      if (navigator.share) { try { await navigator.share({ title: pick(it), url }); } catch {} }
      else { await navigator.clipboard?.writeText(url); toast(L("Link copied", "लिंक कॉपी हो गया")); }
    };
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") lbShow(lbIdx + 1);
      if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    });
    let x0 = null;
    lb.addEventListener("touchstart", e => x0 = e.touches[0].clientX, { passive: true });
    lb.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) lbShow(lbIdx + (dx < 0 ? 1 : -1)); x0 = null; });
  }
  function lbShow(i) {
    lbIdx = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIdx];
    $("#lbImg").src = img(it.src); $("#lbImg").alt = pick(it);
    $("#lbCap").textContent = pick(it);
    $("#lbCount").textContent = `${lbIdx + 1} / ${lbItems.length}`;
    [lbIdx + 1, lbIdx - 1].forEach(j => { const n = lbItems[(j + lbItems.length) % lbItems.length]; if (n) new Image().src = img(n.src); });
  }
  function lbOpen(items, i, opener) {
    lightboxInit(); lbItems = items; lbItems.opener = opener;
    $("#lightbox").classList.add("open"); document.body.style.overflow = "hidden";
    lbShow(i); $("#lbClose").focus();
  }

  function galleries() {
    $$("[data-gallery]").forEach(el => {
      const fixed = el.dataset.cat, limit = +(el.dataset.limit || 0), style = el.dataset.gallery;
      const filterEl = el.dataset.filters ? $(el.dataset.filters) : null;
      let cat = fixed || "all";
      const all = (D.gallery || []);
      const draw = () => {
        let items = all.filter(g => cat === "all" || cat.split(" ").includes(g.cat));
        if (limit) items = items.slice(0, limit);
        el._items = items;
        if (filterEl) {
          const cats = ["all", ...new Set(all.map(g => g.cat))];
          filterEl.innerHTML = cats.map(c => `<button class="chip" data-c="${c}" aria-pressed="${c === cat}">${esc(catLabel(c))} <span class="muted">${c === "all" ? all.length : all.filter(g => g.cat === c).length}</span></button>`).join("");
        }
        if (style === "marquee") {
          const one = items.map((g, i) => `<button data-i="${i}" aria-label="${esc(pick(g))}"><img loading="lazy" src="${thumb(g.src)}" alt="${esc(pick(g))}"></button>`).join("");
          el.innerHTML = one + one.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ');
          return;
        }
        el.innerHTML = items.map((g, i) => style === "strip"
          ? `<button data-i="${i}" aria-label="${esc(pick(g))}"><img loading="lazy" src="${thumb(g.src)}" alt="${esc(pick(g))}"></button>`
          : `<figure><button data-i="${i}" aria-label="${L("Open photo", "फोटो खोलें")}: ${esc(pick(g))}"><img loading="lazy" src="${thumb(g.src)}" alt="${esc(pick(g))}"></button><figcaption>${esc(pick(g))}</figcaption></figure>`).join("");
      };
      el.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) lbOpen(el._items, +b.dataset.i, b); });
      filterEl?.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; cat = b.dataset.c; draw(); });
      onLang(draw);
    });
    $$("[data-videos]").forEach(el => {
      const c = el.dataset.videos;
      const draw = () => {
        const vids = (D.videos || []).filter(v => c === "all" || v.cat.split(" ").includes(c));
        el.innerHTML = vids.map(v => `<div><div class="yt"><button data-id="${esc(v.id)}" aria-label="${L("Play video", "वीडियो चलाएं")}: ${esc(pick(v))}">
          <img loading="lazy" src="https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg" alt=""><span class="play"></span></button></div><div class="yt-cap">${esc(pick(v))}</div></div>`).join("");
      };
      el.addEventListener("click", e => {
        const b = e.target.closest("[data-id]"); if (!b) return;
        b.parentElement.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      });
      onLang(draw);
    });
  }

  function lbLinks() {
    document.addEventListener("click", e => {
      const opener = e.target.closest("[data-lb-open]");
      const b = opener ? $(`[data-lb-set="${opener.dataset.lbOpen}"]`) : e.target.closest("[data-lb]"); if (!b) return;
      e.preventDefault();
      const set = $$(`[data-lb-set="${b.dataset.lbSet}"]`);
      const items = set.map(x => ({ src: x.dataset.lb, en: x.dataset.capEn || "", hi: x.dataset.capHi || x.dataset.capEn || "" }));
      lbOpen(items, Math.max(0, set.indexOf(b)), b);
    });
  }

  /* ---------- exam results ---------- */
  function results() {
    const el = $("#resultsList"); if (!el) return;
    const place = (n) => L(["", "1st", "2nd", "3rd", "4th", "5th"][n], ["", "प्रथम", "द्वितीय", "तृतीय", "चतुर्थ", "पंचम"][n]);
    const prize = (amt) => L("Memento + diary", "स्मृति चिन्ह + डायरी") + (amt ? ` + ₹${amt.toLocaleString("en-IN")}` : "");
    onLang(() => {
      el.innerHTML = (D.results || []).map(r => {
        const tx = pick(r), set = "res-" + r.id;
        const imgs = [r.photo, ...(r.sheets || [])];
        return `<article class="result" id="${esc(r.id)}">
          <div class="result__intro">
            <figure class="result__photo"><button data-lb="${esc(r.photo)}" data-lb-set="${set}" data-cap-en="${esc(r.en.t)}" data-cap-hi="${esc(r.hi.t)}" aria-label="${L("View photo", "फोटो देखें")}"><img loading="lazy" src="${thumb(r.photo)}" alt="${esc(tx.t)}"></button>
              <figcaption>${L("Prize distribution at Colonel Peerdan Lamba Manch", "कर्नल पीरदान लांबा मंच पर पुरस्कार वितरण")}</figcaption></figure>
            <div>
              <p class="result__date">${esc(fmt(parseD(r.date), { day: "numeric", month: "long", year: "numeric" }))}</p>
              <h3 class="result__title">${esc(tx.t)}</h3>
              <p>${esc(tx.d)}</p>
              <div class="result__sheets">${(r.sheets || []).map((sh, i) => `<button data-lb="${esc(sh)}" data-lb-set="${set}" data-cap-en="Official result sheet ${i + 1}" data-cap-hi="आधिकारिक परिणाम पत्र ${i + 1}"><img loading="lazy" src="${thumb(sh)}" alt=""><span>${L("Result sheet", "परिणाम पत्र")} ${i + 1}</span></button>`).join("")}</div>
            </div>
          </div>
          <div class="result__groups">${r.groups.map(g => `<div class="result__group">
            <h4>${esc(pick(g))}</h4>
            <div class="table-wrap"><table class="rtable">
              <thead><tr><th>${L("Place", "स्थान")}</th><th>${L("Name", "नाम")}</th><th>${L("Father", "पिता")}</th><th>${L("Grandfather", "दादा")}</th><th>${L("Prize", "इनाम")}</th></tr></thead>
              <tbody>${g.rows.map(([n, f, gf, pl, amt]) => `<tr class="p${pl}"><td><span class="place">${place(pl)}</span></td><td><b>${esc(n)}</b></td><td>${esc(f)}</td><td>${esc(gf)}</td><td>${esc(prize(amt))}</td></tr>`).join("")}</tbody>
            </table></div></div>`).join("")}</div>
        </article>`;
      }).join("");
    });
  }

  /* ---------- header, hero slideshow, home tiles ---------- */
  function headerScroll() {
    const h = $("[data-header]"); if (!h) return;
    const on = () => h.classList.toggle("scrolled", scrollY > 24);
    on(); addEventListener("scroll", on, { passive: true });
  }
  function slideshow() {
    const hero = $("[data-hero]"); if (!hero) return;
    const slides = $$(".hero__slide", hero), dots = $(".hero__dots", hero);
    if (slides.length < 2) return;
    let i = 0, t;
    const load = (s) => { if (s.dataset.src) { s.src = s.dataset.src; s.removeAttribute("data-src"); } };
    const show = (n) => {
      i = (n + slides.length) % slides.length; load(slides[i]); load(slides[(i + 1) % slides.length]);
      slides.forEach((s, k) => s.classList.toggle("is-on", k === i));
      $$("button", dots).forEach((d, k) => d.setAttribute("aria-selected", k === i));
    };
    dots.innerHTML = slides.map((_, k) => `<button role="tab" aria-label="Photo ${k + 1}" aria-selected="${k === 0}"></button>`).join("");
    dots.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; show($$("button", dots).indexOf(b)); restart(); });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const restart = () => { clearInterval(t); if (!reduce) t = setInterval(() => show(i + 1), 6500); };
    setTimeout(() => load(slides[1]), 1500);
    restart();
  }
  function tiles() {
    const el = $("#tileResult"); if (!el) return;
    onLang(() => {
      const r = (D.results || [])[0]; if (!r) { el.remove(); return; }
      const n = r.groups.reduce((a, g) => a + g.rows.length, 0);
      el.style.backgroundImage = `url('${thumb(r.photo)}')`;
      el.innerHTML = `<span class="tile__tag tile__tag--new">${L("New · results", "नया · परिणाम")}</span>
        <h3>${esc(pick(r).t)}</h3>
        <p>${L(`${n} winners in ${r.groups.length} groups. See the full list and photos.`, `${r.groups.length} वर्गों में ${n} विजेता। पूरी सूची और फोटो देखें।`)}</p>`;
    });
  }

  /* ---------- people, sarpanch, students, reviews ---------- */
  const initials = (n) => n.replace(/^(Sh\.|Smt\.|Col|Lt Col|Ch\.)\s*/g, "").split(/\s+/).filter(w => /^[A-Z]/.test(w) && !/^(S\/O|D\/O|W\/O)$/.test(w)).slice(0, 2).map(w => w[0]).join("");
  function people() {
    const p = $("#pride");
    if (p) onLang(() => p.innerHTML = (D.pride || []).map(x => `<div class="person"><span class="avatar" aria-hidden="true">${initials(x.name)}</span><div><b>${esc(x.name)}</b><span>${esc(pick(x))}</span></div></div>`).join(""));
    const s = $("#sarpanch");
    if (s) s.innerHTML = (D.sarpanch || []).map(([n, t], i, a) => `<li class="${i === a.length - 1 ? "current" : ""}"><span class="nm">${esc(n)}</span><span class="term">${esc(t)}</span></li>`).join("");
    const r = $("#reviews");
    if (r) onLang(() => r.innerHTML = (D.reviews || []).map(x => `<blockquote class="quote"><p>${esc(pick(x))}</p><footer><img src="images/${esc(x.img)}" alt="" loading="lazy">${esc(x.name)}</footer></blockquote>`).join(""));
    const w = $("#successWall");
    if (w) {
      const q = $("#successSearch"), sel = $("#successFilter");
      const groups = [...new Set((D.students || []).map(s => s[1]))].sort();
      const draw = () => {
        const hi = (x) => lang === "hi" ? (D.selectionsHi?.[x] || x) : x;
        if (sel) { const v = sel.value; sel.innerHTML = `<option value="">${L("All selections", "सभी चयन")} (${D.students.length})</option>` + groups.map(g => `<option value="${esc(g)}">${esc(hi(g))} (${D.students.filter(s => s[1] === g).length})</option>`).join(""); sel.value = v; }
        const term = (q?.value || "").toLowerCase(), g = sel?.value || "";
        const list = D.students.filter(([n, r]) => (!g || r === g) && (n + " " + r + " " + hi(r)).toLowerCase().includes(term));
        w.innerHTML = list.length ? list.map(([n, r]) => `<div class="person"><span class="avatar" aria-hidden="true">${initials(n)}</span><div><b>${esc(n)}</b><span>${esc(hi(r))}</span></div></div>`).join("")
          : `<div class="empty" style="grid-column:1/-1">${L("No match. Try a different name.", "कोई परिणाम नहीं। दूसरा नाम आज़माएं।")}</div>`;
      };
      q?.addEventListener("input", draw); sel?.addEventListener("change", draw);
      onLang(draw);
    }
  }

  /* ---------- counters ---------- */
  function counters() {
    const els = $$("[data-count]"); if (!els.length) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const run = (el) => {
      const end = +el.dataset.count, dec = (el.dataset.count.split(".")[1] || "").length;
      if (reduce) { el.textContent = end.toLocaleString("en-IN", { minimumFractionDigits: dec }); return; }
      const t0 = performance.now(), dur = 1200;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - k, 3)); el.textContent = v.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .4 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- about page TOC ---------- */
  function toc() {
    const links = $$(".toc a"); if (!links.length) return;
    const map = new Map(links.map(a => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { links.forEach(a => a.classList.remove("active")); map.get(e.target.id)?.classList.add("active"); }
    }), { rootMargin: "-30% 0px -60% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- search palette ---------- */
  function search() {
    const pal = document.createElement("div");
    pal.className = "palette"; pal.setAttribute("role", "dialog"); pal.setAttribute("aria-modal", "true"); pal.setAttribute("aria-label", "Search");
    pal.innerHTML = `<div class="palette__box"><input class="input" type="search" id="palQ" autocomplete="off" aria-controls="palList" data-ph-en="Search pages, events, people…" data-ph-hi="पेज, कार्यक्रम, लोग खोजें…"><ul class="palette__list" id="palList" role="listbox"></ul><div class="palette__hint" id="palHint"></div></div>`;
    document.body.append(pal);
    const q = $("#palQ", pal), list = $("#palList", pal);
    let idx = 0, results = [];
    const index = () => {
      const out = [];
      (D.pages || []).forEach(p => out.push({ t: pick(p), s: L("Page", "पेज"), url: p.url, k: p.k + " " + p.en + " " + p.hi }));
      occurrences().forEach(o => out.push({ t: pick(o).t, s: fmt(o.when, { day: "numeric", month: "short", year: "numeric" }), url: "events.html#" + o.key, k: o.en.t + " " + o.hi.t + " " + o.en.p + " " + o.cat }));
      (D.pride || []).forEach(p => out.push({ t: p.name, s: pick(p), url: "index.html#pride", k: p.en }));
      (D.students || []).forEach(([n, r]) => out.push({ t: n, s: lang === "hi" ? (D.selectionsHi?.[r] || r) : r, url: "library.html#success", k: r }));
      (D.sarpanch || []).forEach(([n, t]) => out.push({ t: n, s: L("Sarpanch", "सरपंच") + " " + t, url: "index.html#sarpanch", k: "sarpanch " + t }));
      (D.notices || []).forEach(n => out.push({ t: pick(n), s: L("Notice", "सूचना"), url: n.url || "index.html#notices-panel", k: n.en + " " + n.hi }));
      return out;
    };
    const draw = () => {
      const term = q.value.trim().toLowerCase();
      const all = index();
      results = term ? all.filter(r => (r.t + " " + r.s + " " + r.k).toLowerCase().includes(term)).slice(0, 12) : all.filter(r => r.s === L("Page", "पेज")).slice(0, 8);
      idx = 0;
      list.innerHTML = results.length ? results.map((r, i) => `<li><a role="option" href="${esc(r.url)}" aria-selected="${i === idx}"><span>${esc(r.t)}</span><small>${esc(r.s)}</small></a></li>`).join("")
        : `<li class="empty" style="margin:.5rem">${L("Nothing found. Try another word, like “library” or “Holi”.", "कुछ नहीं मिला। कोई और शब्द आज़माएं, जैसे “पुस्तकालय”।")}</li>`;
      $("#palHint", pal).textContent = L("↑ ↓ to move, Enter to open, Esc to close", "↑ ↓ से चुनें, Enter से खोलें, Esc से बंद करें");
    };
    const mark = () => $$("a", list).forEach((a, i) => a.setAttribute("aria-selected", i === idx));
    const open = () => { pal.classList.add("open"); q.value = ""; q.placeholder = L(q.dataset.phEn, q.dataset.phHi); draw(); q.focus(); };
    const close = () => pal.classList.remove("open");
    q.addEventListener("input", draw);
    q.addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { idx = Math.min(results.length - 1, idx + 1); mark(); e.preventDefault(); }
      if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); mark(); e.preventDefault(); }
      if (e.key === "Enter" && results[idx]) { location.href = results[idx].url; close(); }
    });
    list.addEventListener("click", () => close());
    pal.addEventListener("click", e => { if (e.target === pal) close(); });
    document.addEventListener("keydown", e => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName))) { e.preventDefault(); open(); }
      if (e.key === "Escape") close();
    });
    $$("[data-search]").forEach(b => b.addEventListener("click", open));
    renderers.push(() => pal.classList.contains("open") && draw());
  }

  /* ---------- drawer ---------- */
  function drawer() {
    const d = $("#drawer"); if (!d) return;
    const open = () => { d.classList.add("open"); $("a", d)?.focus(); };
    const close = () => d.classList.remove("open");
    $$("[data-drawer]").forEach(b => b.addEventListener("click", open));
    $(".drawer__scrim", d)?.addEventListener("click", close);
    document.addEventListener("keydown", e => e.key === "Escape" && close());
  }

  /* ---------- misc ---------- */
  function misc() {
    $$("[data-copy]").forEach(b => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); toast(L("Copied: ", "कॉपी हुआ: ") + b.dataset.copy); }
      catch { toast(b.dataset.copy); }
    }));
    $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
    $$(".lang-btn").forEach(b => b.addEventListener("click", () => setLang(lang === "hi" ? "en" : "hi")));
    $$(".theme-btn").forEach(b => b.addEventListener("click", () => {
      const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(t); store.set("dv-theme", t);
    }));
    const page = (location.pathname.split("/").pop() || "index.html");
    $$(".nav a, .tabbar a, .drawer a").forEach(a => { if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page"); });
    // contact form: send language with message
    const f = $("#contactForm");
    if (f) f.addEventListener("submit", () => { const l = $('[name="_language"]', f); if (l) l.value = lang; });
  }

  /* ---------- PWA ---------- */
  function pwa() {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
    }
    let deferred;
    const btns = $$("[data-install]");
    addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; btns.forEach(b => b.hidden = false); });
    btns.forEach(b => b.addEventListener("click", async () => {
      if (deferred) { deferred.prompt(); await deferred.userChoice; deferred = null; btns.forEach(x => x.hidden = true); }
      else if (/iphone|ipad/i.test(navigator.userAgent)) toast(L("Tap Share, then “Add to Home Screen”", "शेयर दबाएं, फिर “Add to Home Screen” चुनें"));
    }));
    addEventListener("appinstalled", () => { btns.forEach(b => b.hidden = true); toast(L("Dalanwas app installed", "डालनवास ऐप इंस्टॉल हो गया")); });
    // iOS has no install prompt: show the button with instructions
    if (/iphone|ipad/i.test(navigator.userAgent) && !navigator.standalone) btns.forEach(b => b.hidden = false);
  }

  /* ---------- start ---------- */
  document.documentElement.lang = lang;
  document.addEventListener("DOMContentLoaded", () => {
    misc(); setLang(lang);
    clock(); greeting(); weather(); notices(); nextEvent(); eventsPage();
    headerScroll(); slideshow(); tiles(); galleries(); lbLinks(); results(); people(); counters(); toc(); search(); drawer(); pwa();
  });
})();
