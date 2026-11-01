# Dalanwas website — redesign

## How to update content
Almost everything you change regularly lives in **js/data.js**:
- `notices` — the notice board on the home page
- `events` — events page, calendar, countdown (use `repeat: "yearly"` for fixed-date events like 26 January)
- `greetings` — festival banner shown between two dates
- `gallery` / `videos` — photos (put the file in `images/` and a small copy in `images/thumbs/`) and YouTube videos
- `pride`, `sarpanch`, `students`, `reviews`

Every text has an English (`en`) and Hindi (`hi`) version.

**After any change, open `sw.js` and change `CACHE_VERSION` (e.g. "dv-v1" → "dv-v2")**
so phones that installed the app get the new version.

## Going live
Test by opening the `redesign` folder with a local server, e.g. `python3 -m http.server`
inside it, then visit http://localhost:8000. When happy, move these files to the root
of the repository (replacing the old pages) and keep the `CNAME` file.

## Still needed
- `images/upi-qr.png` — your real UPI QR code (it shows automatically once added)
- A photo of Pila Johad (currently shows a coloured placeholder)
