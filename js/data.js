/* =====================================================================
   DALANWAS WEBSITE — CONTENT FILE
   ---------------------------------------------------------------------
   Edit this one file to update notices, events, gallery, people, etc.
   Every text has an English (en) and Hindi (hi) version.
   Dates are written as "YYYY-MM-DD". Times (optional) as "HH:MM".
   After editing, bump CACHE_VERSION in sw.js so phones get the update.
   ===================================================================== */

window.DV = {

  /* Festival greeting banner — shown only between "from" and "to". */
  greetings: [
    { from: "2026-02-25", to: "2026-03-06", en: "Happy Holi to everyone — spreading colours across Dalanwas!", hi: "सभी को होली की हार्दिक शुभकामनाएं — डालनवास में खुशियों के रंग!" }
    // Example: { from: "2026-11-05", to: "2026-11-10", en: "Happy Diwali!", hi: "दीपावली की शुभकामनाएं!" },
  ],

  /* Notice board. Upcoming events in the next 14 days are added automatically. */
  notices: [
    { tag: "panchayat", en: "Gram Sabha meeting — watch this board for the date and agenda.", hi: "ग्राम सभा बैठक — तिथि और एजेंडा के लिए यह सूचना पट देखें।" },
    { tag: "library", en: "Library is open for students every day, 9 AM to 11 PM.", hi: "पुस्तकालय छात्रों के लिए प्रतिदिन सुबह 9 से रात 11 बजे तक खुला है।", url: "library.html" },
    { tag: "library", en: "New books have arrived at Baba Sawanth Nath Library.", hi: "बाबा सावंतनाथ पुस्तकालय में नई पुस्तकें आई हैं।", url: "library.html" },
    { tag: "health", en: "Blood donation camp — register at the library.", hi: "रक्तदान शिविर — पुस्तकालय में पंजीकरण करें।" },
    { tag: "village", en: "Clean village drive every Sunday. Everyone is welcome.", hi: "हर रविवार स्वच्छ गांव अभियान। सभी आमंत्रित हैं।" }
  ],

  /* Events. repeat: "yearly" makes a fixed-date event come back every year. */
  events: [
    { id: "republic-day", date: "2026-01-26", time: "08:00", repeat: "yearly", cat: "government", img: "republicday.jpg",
      en: { t: "Republic Day celebration", d: "Flag hoisting, cultural programmes and speeches at Panchayat Bhawan.", p: "Village ground" },
      hi: { t: "गणतंत्र दिवस समारोह", d: "पंचायत भवन में ध्वजारोहण, सांस्कृतिक कार्यक्रम और भाषण।", p: "गांव का मैदान" } },
    { id: "sports-meet", date: "2026-08-15", time: "08:00", repeat: "yearly", cat: "sports", img: "sportsday.jpg",
      en: { t: "Annual sports meet", d: "Volleyball, kabaddi and athletics competitions for youth.", p: "School playground" },
      hi: { t: "वार्षिक खेल प्रतियोगिता", d: "युवाओं के लिए वॉलीबॉल, कबड्डी और एथलेटिक्स प्रतियोगिताएं।", p: "स्कूल खेल मैदान" } },
    { id: "swachh", date: "2025-10-02", time: "08:00", repeat: "yearly", cat: "government", img: "cleanindia.jpg",
      en: { t: "Swachh Bharat Abhiyan", d: "Cleanliness drive across village streets.", p: "Main chowk" },
      hi: { t: "स्वच्छ भारत अभियान", d: "गांव की गलियों में सफाई अभियान।", p: "मुख्य चौक" } },
    { id: "jagran-2026", date: "2026-09-18", cat: "religious", img: "sawanthnathtemple.jpg",
      en: { t: "Baba Sawanth Nath Jagran", d: "Night-long jagran and bhandara.", p: "Baba Sawanth Nath Mandir" },
      hi: { t: "बाबा सावंतनाथ जागरण", d: "रात्रि जागरण और भंडारा।", p: "बाबा सावंतनाथ मंदिर" } },
    { id: "baba-bhaiya-2026", date: "2026-03-01", cat: "religious", img: "bababhaiya.jpg",
      en: { t: "Baba Bhaiya programme", d: "Jagran and kirtan.", p: "Baba Bhaiya Mandir" },
      hi: { t: "बाबा भैया कार्यक्रम", d: "जागरण और कीर्तन।", p: "बाबा भैया मंदिर" } },
    { id: "holika-2026", date: "2026-03-03", cat: "cultural", img: "holikadahan.jpg",
      en: { t: "Holika Dahan", d: "Holika Dahan at several places in the village.", p: "Across the village" },
      hi: { t: "होलिका दहन", d: "गांव में कई स्थानों पर होलिका दहन।", p: "पूरे गांव में" } },
    { id: "dadi-sati-2026", date: "2026-03-04", cat: "religious", img: "dadisati.jpg",
      en: { t: "Dadi Sati Holi Mela", d: "Jagran and mela on Dulendi.", p: "Dadi Sati Mandir" },
      hi: { t: "दादी सती होली मेला", d: "दुलेंडी पर जागरण और मेला।", p: "दादी सती मंदिर" } },
    { id: "holi-milan-2026", date: "2026-03-03", cat: "library", img: "library3.jpg",
      en: { t: "Holi Milan Samaroh", d: "Community members come together to celebrate the festival of colours.", p: "Baba Sawanth Nath Library" },
      hi: { t: "होली मिलन समारोह", d: "रंगों के त्योहार पर सभी ग्रामवासियों का मिलन।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "mock-1", date: "2026-03-23", cat: "library", img: "library1.jpg",
      en: { t: "Competition practice exam", d: "Practice exam for government job aspirants to check preparation and exam strategy.", p: "Baba Sawanth Nath Library" },
      hi: { t: "प्रतियोगी अभ्यास परीक्षा", d: "सरकारी नौकरी की तैयारी कर रहे छात्रों के लिए अभ्यास परीक्षा।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "mock-2", date: "2026-04-14", cat: "library", img: "library1.jpg",
      en: { t: "Competition practice exam", d: "Practice exam for government job aspirants to check preparation and exam strategy.", p: "Baba Sawanth Nath Library" },
      hi: { t: "प्रतियोगी अभ्यास परीक्षा", d: "सरकारी नौकरी की तैयारी कर रहे छात्रों के लिए अभ्यास परीक्षा।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "yoga-2026", date: "2026-06-01", time: "06:00", cat: "library", img: "library3.jpg",
      en: { t: "Yoga and wellness session", d: "Morning yoga and meditation for focus, discipline and mental health.", p: "Baba Sawanth Nath Library" },
      hi: { t: "योग एवं स्वास्थ्य सत्र", d: "एकाग्रता, अनुशासन और मानसिक स्वास्थ्य के लिए सुबह योग और ध्यान।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "speech-jun-2026", date: "2026-06-05", cat: "library", img: "library4.jpg",
      en: { t: "Speech competition", d: "Builds confidence, creativity and public speaking.", p: "Baba Sawanth Nath Library" },
      hi: { t: "भाषण प्रतियोगिता", d: "आत्मविश्वास, रचनात्मकता और बोलने की कला को बढ़ावा।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "gk-2026", date: "2026-11-01", cat: "library", img: "library1.jpg",
      en: { t: "Haryana GK competition exam", d: "Tests knowledge of Haryana's history, culture, geography, politics and current affairs.", p: "Baba Sawanth Nath Library" },
      hi: { t: "हरियाणा सामान्य ज्ञान परीक्षा", d: "हरियाणा के इतिहास, संस्कृति, भूगोल, राजनीति और समसामयिक विषयों की परीक्षा।", p: "बाबा सावंतनाथ पुस्तकालय" } },
    { id: "speech-dec-2026", date: "2026-12-25", cat: "library", img: "library4.jpg",
      en: { t: "Speech competition", d: "Builds confidence, creativity and public speaking.", p: "Baba Sawanth Nath Library" },
      hi: { t: "भाषण प्रतियोगिता", d: "आत्मविश्वास, रचनात्मकता और बोलने की कला को बढ़ावा।", p: "बाबा सावंतनाथ पुस्तकालय" } }
  ],

  /* Photo gallery. cat: village | heritage | library | events */
  gallery: [
    { src: "village1.jpg", cat: "village", en: "Village view", hi: "गांव का दृश्य" },
    { src: "village2.jpg", cat: "village", en: "Village road", hi: "गांव की सड़क" },
    { src: "village3.jpg", cat: "heritage", en: "Temple area", hi: "मंदिर परिसर" },
    { src: "village4.jpg", cat: "events", en: "Community event", hi: "सामुदायिक कार्यक्रम" },
    { src: "village5.jpg", cat: "village", en: "School building", hi: "विद्यालय भवन" },
    { src: "village6.jpg", cat: "library", en: "Library", hi: "पुस्तकालय" },
    { src: "village7.jpg", cat: "events", en: "Festival", hi: "त्योहार" },
    { src: "village8.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "village9.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "village10.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "village11.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "babasawanthnathji.jpg", cat: "heritage", en: "Baba Sawanth Nath Ji", hi: "बाबा सावंतनाथ जी" },
    { src: "village12.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "village13.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "village14.jpg", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { src: "sawanthnathtemple.jpg", cat: "heritage", en: "Baba Sawanth Nath Temple", hi: "बाबा सावंतनाथ मंदिर" },
    { src: "sawanthnathold.jpg", cat: "heritage", en: "Baba Sawanth Nath Temple, old view", hi: "बाबा सावंतनाथ मंदिर, पुराना दृश्य" },
    { src: "dadisati.jpg", cat: "heritage", en: "Dadi Sati Temple", hi: "दादी सती मंदिर" },
    { src: "bababhaiya.jpg", cat: "heritage", en: "Baba Bhaiya Mandir", hi: "बाबा भैया मंदिर" },
    { src: "madhogarh-fort.jpg", cat: "heritage", en: "Madhogarh Fort", hi: "माधोगढ़ किला" },
    { src: "library1.jpg", cat: "library", en: "Library front", hi: "पुस्तकालय का मुख्य भाग" },
    { src: "library2.jpg", cat: "library", en: "Aerial view", hi: "ऊपर से दृश्य" },
    { src: "library3.jpg", cat: "library", en: "Yoga Day celebration", hi: "योग दिवस समारोह" },
    { src: "library4.jpg", cat: "library", en: "Community event", hi: "सामुदायिक कार्यक्रम" },
    { src: "library5.jpg", cat: "library", en: "Study area", hi: "अध्ययन कक्ष" },
    { src: "library6.jpg", cat: "library", en: "Library", hi: "पुस्तकालय" },
    { src: "republicday.jpg", cat: "events", en: "Republic Day", hi: "गणतंत्र दिवस" },
    { src: "sportsday.jpg", cat: "events", en: "Sports day", hi: "खेल दिवस" },
    { src: "cleanindia.jpg", cat: "events", en: "Swachh Bharat drive", hi: "स्वच्छ भारत अभियान" },
    { src: "holikadahan.jpg", cat: "events", en: "Holika Dahan", hi: "होलिका दहन" }
  ],

  /* YouTube videos (the part after youtube.com/watch?v= ) */
  videos: [
    { id: "UuQWqhg6DdA", cat: "village", en: "Dalanwas village", hi: "गांव डालनवास" },
    { id: "jIokX36WDWQ", cat: "library", en: "Baba Sawanth Nath Library", hi: "बाबा सावंतनाथ पुस्तकालय" },
    { id: "FwQaMi8NYYs", cat: "library", en: "Library activities", hi: "पुस्तकालय की गतिविधियां" },
    { id: "i-z9K5UxZz8", cat: "village", en: "Village life", hi: "गांव का जीवन" },
    { id: "RtrVuH-iA5E", cat: "events", en: "Event highlights", hi: "कार्यक्रम की झलकियां" },
    { id: "ziYVdqIGS54", cat: "events", en: "Event highlights", hi: "कार्यक्रम की झलकियां" },
    { id: "a2fwuKVMA_c", cat: "events", en: "Event highlights", hi: "कार्यक्रम की झलकियां" }
  ],

  /* Pride of Dalanwas */
  pride: [
    { name: "Col Peerdan Lamba", en: "Village's first military officer", hi: "गांव के पहले सैन्य अधिकारी" },
    { name: "Sh. Sombir (Col)", en: "Sena Medal", hi: "सेना मेडल" },
    { name: "Lt Col Umesh Lamba", en: "Sena Medal, twice", hi: "दो बार सेना मेडल" },
    { name: "Sh. Sree Chand", en: "Jai Hind", hi: "जय हिंद" },
    { name: "Sh. Pankaj Lamba", en: "IPS officer", hi: "आईपीएस अधिकारी" },
    { name: "Sh. Piryvart Lamba S/O VedPrakash", en: "Lieutenant", hi: "लेफ्टिनेंट" }
  ],

  /* Sarpanch history, oldest first */
  sarpanch: [
    ["Sh. Ramjilal S/O Sh. Uday Ram", "—"],
    ["Sh. Mamchand S/O Sh. Dhigram", "1961 – 1963"],
    ["Smt. Shanti Chaudhary W/O Sh. Ishwar Singh", "1963 – 1964"],
    ["Sh. Mamchand S/O Sh. Dhigram", "1965 – 1968"],
    ["Sh. Ramsaroop S/O Sh. Singh Ram", "1969 – 1972"],
    ["Sh. Nand Lal S/O Sh. Bhola Ram", "1973 – 1976"],
    ["Sh. Bihari Ram S/O Sh. Hari Ram", "1977"],
    ["Sh. Nand Lal S/O Sh. Bhola Ram", "1977 – 1978"],
    ["Sh. Mamchand S/O Sh. Dhig Ram", "1978 – 1980"],
    ["Sh. Madha Ram S/O Sh. Jhalam Ram", "1981"],
    ["Sh. Mamchand S/O Sh. Dhig Ram", "1981"],
    ["Sh. Chand Ram S/O Sh. Nobat Ram", "1983 – 1988"],
    ["Sh. Kirpal Singh S/O Sh. Ghoga Ram", "1988 – 1991"],
    ["Sh. Surender Singh S/O Sh. Ramkumar", "1992 – 1994"],
    ["Sh. Mahipal Singh S/O Sh. Shisram", "1995 – 2000"],
    ["Smt. Sawitri Devi W/O Sh. Sardara Ram", "2000 – 2005"],
    ["Sh. Mahasingh S/O Sh. Prabhati Ram", "2005 – 2010"],
    ["Sh. Ombir Singh S/O Sh. Nand Ram", "2010 – 2015"],
    ["Smt. Suman Devi W/O Sh. Ajit Singh", "2016 – 2021"],
    ["Smt. Sunita Devi W/O Sh. Ombir Singh", "2022 – present"]
  ],

  /* Library student success wall: [name, selection] */
  students: [
    ["Devender S/O Naresh Kumar", "Indian Air Force"],
    ["Sageeta D/O Suresh Kumar", "Delhi Police"],
    ["Nisha D/O Sombir Singh", "Haryana Police"],
    ["Akash S/O Anand Kumar", "Clerk, Haryana"],
    ["Rohit S/O Raghubir Singh", "Haryana Police"],
    ["Mukesh S/O Raghubir Singh", "Haryana Police"],
    ["Sushant S/O Dharmbir Singh", "Haryana Gram Sachiv"],
    ["Jyoti D/O Anand Dahiya", "Haryana Police"],
    ["Jasvinder S/O Vijay Singh", "Haryana Police"],
    ["Ravi Lamba S/O Dharambir Singh", "Haryana Police"],
    ["Joginder Singh S/O Maniram Singh", "Haryana Gram Sachiv"],
    ["Anoop Rhoila S/O Prathivi Singh", "Haryana Gram Sachiv"],
    ["Vikas S/O Sunil Malik", "Indian Army"],
    ["Karanvir S/O Rajesh", "Haryana Group D"],
    ["Yashvir S/O Naresh Kumar", "Admission, AIIMS Jammu"],
    ["Amit Kumar S/O Anil Kumar", "Indian Air Force"],
    ["Ankit Kumar S/O Jaipal Singh", "CRPF"],
    ["Mandeep Singh S/O Chandarpal Singh", "ASO"],
    ["Chetan S/O Surender Singh", "NDA"],
    ["Rajkumari W/O Sushil Sharma", "NET"],
    ["Sachin S/O Sukhbir Singh", "Indian Air Force"],
    ["Nitin S/O Chotu Ram", "Indian Air Force"],
    ["Mamtesh S/O Parash Singh", "NET, JRF"]
  ],

  /* Hindi names for selections on the success wall */
  selectionsHi: {
    "Indian Air Force": "भारतीय वायुसेना", "Delhi Police": "दिल्ली पुलिस", "Haryana Police": "हरियाणा पुलिस",
    "Clerk, Haryana": "क्लर्क, हरियाणा", "Haryana Gram Sachiv": "हरियाणा ग्राम सचिव", "Indian Army": "भारतीय सेना",
    "Haryana Group D": "हरियाणा ग्रुप डी", "Admission, AIIMS Jammu": "प्रवेश, एम्स जम्मू", "CRPF": "सीआरपीएफ",
    "ASO": "एएसओ", "NDA": "एनडीए", "NET": "नेट", "NET, JRF": "नेट, जेआरएफ"
  },

  /* What people say about the library */
  reviews: [
    { name: "Ch. Dharambir Singh (MP)", img: "review1.jpg",
      en: "Baba Sawanth Nath Library is playing a remarkable role in promoting education and competitive exam preparation in the region. The disciplined environment, quality study resources and dedication toward students reflect a strong commitment to academic excellence.",
      hi: "बाबा सावंतनाथ पुस्तकालय क्षेत्र में शिक्षा और प्रतियोगी परीक्षाओं की तैयारी को बढ़ावा देने में उल्लेखनीय भूमिका निभा रहा है। अनुशासित वातावरण, अच्छी अध्ययन सामग्री और छात्रों के प्रति समर्पण सराहनीय है।" },
    { name: "Kanwar Singh Yadav (MLA)", img: "review2.jpg",
      en: "Best community library in the region. Events like mock exams and yoga sessions are extremely helpful for students.",
      hi: "क्षेत्र का सबसे अच्छा सामुदायिक पुस्तकालय। मॉक परीक्षा और योग सत्र जैसे कार्यक्रम छात्रों के लिए बहुत उपयोगी हैं।" },
    { name: "Pankaj Lamba (IPS)", img: "review3.jpg",
      en: "Very disciplined and positive atmosphere. I highly recommend this library for competitive exam aspirants.",
      hi: "बहुत अनुशासित और सकारात्मक वातावरण। प्रतियोगी परीक्षा की तैयारी करने वालों के लिए मैं इस पुस्तकालय की सिफारिश करता हूं।" }
  ],

  /* Pages and sections for site search */
  pages: [
    { url: "index.html", en: "Home", hi: "होम", k: "welcome dalanwas mahendragarh haryana" },
    { url: "index.html#about", en: "About Dalanwas", hi: "डालनवास के बारे में", k: "census population literacy satnali tehsil road" },
    { url: "index.html#admin", en: "Administrative information", hi: "प्रशासनिक जानकारी", k: "pin code 123024 gram panchayat sarpanch sunita devi votes district" },
    { url: "index.html#weather", en: "Weather forecast", hi: "मौसम पूर्वानुमान", k: "rain temperature mausam" },
    { url: "index.html#sarpanch", en: "List of village sarpanch", hi: "गांव के सरपंचों की सूची", k: "sarpanch history panchayat" },
    { url: "index.html#pride", en: "Pride of Dalanwas", hi: "डालनवास का गौरव", k: "army colonel ips sena medal officer" },
    { url: "about.html", en: "Village history", hi: "गांव का इतिहास", k: "history samvat 1454 daluram pitampura chandaliya" },
    { url: "about.html#heritage", en: "Spiritual heritage", hi: "धार्मिक विरासत", k: "baba sawanth nath samadhi temple" },
    { url: "about.html#places", en: "Places to see", hi: "दर्शनीय स्थल", k: "madhogarh fort pila johad dadi sati temple" },
    { url: "about.html#festivals", en: "Festivals and melas", hi: "त्योहार और मेले", k: "jagran bhandara dadi sati mela holi dulendi" },
    { url: "events.html", en: "Events and calendar", hi: "कार्यक्रम और कैलेंडर", k: "events calendar countdown programme" },
    { url: "library.html", en: "Baba Sawanth Nath Library", hi: "बाबा सावंतनाथ पुस्तकालय", k: "library books students exam study" },
    { url: "library.html#reports", en: "Library reports (PDF)", hi: "पुस्तकालय रिपोर्ट (पीडीएफ)", k: "report pdf 2023 2024 2025 chosala" },
    { url: "library.html#success", en: "Student success wall", hi: "छात्र सफलता दीवार", k: "selected police army air force gram sachiv" },
    { url: "library.html#donate", en: "Support the library", hi: "पुस्तकालय को सहयोग दें", k: "donate upi donation" },
    { url: "gallery.html", en: "Photo and video gallery", hi: "फोटो और वीडियो गैलरी", k: "photos videos pictures" },
    { url: "contact.html", en: "Contact", hi: "संपर्क", k: "phone email whatsapp message map address" }
  ]
};
