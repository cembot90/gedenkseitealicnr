/* Gedenkseite: Darstellung, Sprache, Audio. Alle Texte werden über textContent gesetzt (kein HTML aus Daten). */
(() => {
  "use strict";
  const M = window.MEMORIAL, UI = window.UI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  let lang = store.get("lang") || ((navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "de");
  const t = (key, ...a) => { const v = UI[lang][key]; return typeof v === "function" ? v(...a) : v; };
  const L = (obj) => (obj && typeof obj === "object") ? (obj[lang] ?? obj.de ?? "") : (obj ?? "");

  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    wave: '<path d="M2 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M2 17c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
    leaf: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19 14 10"/>'
  };
  const svgIcon = (name) => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.innerHTML = ICONS[name] || ICONS.star; return s; };

  /* ---------- Rendering ---------- */
  function renderStatic() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

    const p = M.person;
    $("#heroName").textContent = p.name;
    $("#heroNick").textContent = L(p.nickname);
    $("#born").textContent = p.born;
    $("#died").textContent = p.died;
    $("#places").textContent = L(p.places);
    $("#quote").textContent = L(p.quote);
    $("#quoteSource").textContent = L(p.quoteSource);
    $("#intro").textContent = L(M.intro);
    $("#footName").textContent = p.name;
    $("#footFamily").textContent = L(M.family);
    document.title = (lang === "tr" ? "Anısına: " : "In Erinnerung an ") + p.name;
    const img = $(".portrait__img");
    if (p.portrait) { img.style.backgroundImage = `url("${encodeURI(p.portrait)}")`; img.style.backgroundPosition = p.portraitPosition || "center"; img.classList.remove("is-empty"); } else img.classList.add("is-empty");

    // Erstes Jahresgedenken
    const A = M.anniversary;
    if (A) {
      $("#annEyebrow").textContent = L(A.eyebrow);
      $("#annTitle").textContent = L(A.title);
      const body = $("#annBody"); body.replaceChildren(...(A.paragraphs[lang] || A.paragraphs.de).map(x => el("p", null, x)));
      $("#annReflection").textContent = L(A.reflection);
      $("#annBlessing").textContent = L(A.blessing);
      $("#annClosing").textContent = L(A.closing);
      $("#annSignature").textContent = L(A.signature);
    } else $("#jahrestag").hidden = true;

    // Lebensweg
    const tl = $("#timeline"); tl.replaceChildren();
    M.timeline.forEach(item => {
      const li = el("li", "tl reveal");
      li.append(el("div", "tl__year", item.year));
      const b = el("div", "tl__body"); b.append(el("h3", null, L(item.title)), el("p", null, L(item.text)));
      li.append(b); tl.append(li);
    });

    // Erinnerungen
    const mg = $("#memories"); mg.replaceChildren();
    M.memories.forEach((m, i) => {
      const c = el("article", `mem mem--${m.color} reveal`); c.style.transitionDelay = `${i * 120}ms`;
      if (m.image) {
        const fig = el("div", "mem__img"); const im = el("img"); im.src = m.image; im.alt = L(m.title); im.loading = "lazy"; im.decoding = "async";
        fig.append(im); c.append(fig); c.classList.add("has-img");
        fig.addEventListener("click", () => openLightbox(m.image, L(m.title)));
      }
      const ic = el("div", "mem__icon"); ic.append(svgIcon(m.icon));
      c.append(ic, el("h3", null, L(m.title)), el("p", null, L(m.text)));
      mg.append(c);
    });

    renderSpeeches();

    // Galerie
    const g = $("#gallery"); g.replaceChildren();
    const ratios = ["4/5", "1/1", "3/4", "4/3", "4/5", "1/1"];
    M.gallery.forEach((ph, i) => {
      const f = el("figure", "photo reveal");
      if (ph.src) {
        const im = el("img"); im.src = ph.src; im.alt = L(ph.caption); im.loading = "lazy"; im.decoding = "async";
        f.tabIndex = 0; f.append(im, el("figcaption", null, L(ph.caption)));
        if (ph.video) { f.classList.add("photo--video"); const pb = el("span", "photo__play"); pb.setAttribute("aria-hidden", "true"); f.append(pb); }
        const open = () => openLightbox(ph.src, L(ph.caption), ph.video);
        f.addEventListener("click", open); f.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
      } else {
        f.classList.add("photo--empty"); f.style.setProperty("--ar", ratios[i % ratios.length]); f.textContent = t("photoSoon");
      }
      g.append(f);
    });

    updateMusicLabel();
    renderCandles(lastCandles);
    renderEntries(lastEntries);
    observeReveals();
  }

  /* ---------- Reden mit mitlaufendem Text ---------- */
  const players = [];
  function renderSpeeches() {
    players.forEach(p => { p.audio.pause(); });
    players.length = 0;
    const box = $("#speeches"); box.replaceChildren();
    M.speeches.forEach(sp => {
      const card = el("article", "speech reveal show-tr");
      const head = el("div", "speech__head");
      const btn = el("button", "play"); btn.type = "button"; btn.setAttribute("aria-label", L(sp.title));
      btn.innerHTML = '<svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
      const meta = el("div"); meta.append(el("h3", "speech__title", L(sp.title)), el("p", "speech__by", L(sp.by)));
      head.append(btn, meta, el("span", "badge", sp.lang.toUpperCase()));

      const bar = el("div", "speech__bar"); const fill = el("i"); bar.append(fill);
      const time = el("div", "speech__time"); const cur = el("span", null, "0:00"); const dur = el("span", null, "–"); time.append(cur, dur);
      const tog = el("label", "trtoggle"); const cb = el("input"); cb.type = "checkbox"; cb.checked = true;
      tog.append(cb, document.createTextNode(t("showTranslation")));
      cb.addEventListener("change", () => card.classList.toggle("show-tr", cb.checked));
      // Übersetzung nur sinnvoll, wenn Aufnahme nicht in der gewählten Sprache ist; trotzdem immer umschaltbar
      if (sp.lang === lang) { cb.checked = false; card.classList.remove("show-tr"); }

      const text = el("div", "speech__text");
      const segEls = sp.segments.map(s => {
        const d = el("div", "seg"); d.append(el("p", "seg__orig", s.text), el("p", "seg__tr", s.translation)); text.append(d);
        return d;
      });

      const audio = new Audio(); audio.preload = "none"; audio.src = sp.src;
      const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "–";
      let curIdx = -1;
      audio.addEventListener("loadedmetadata", () => { dur.textContent = fmt(audio.duration); });
      audio.addEventListener("timeupdate", () => {
        cur.textContent = fmt(audio.currentTime);
        if (audio.duration) fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        let idx = -1; sp.segments.forEach((s, i) => { if (audio.currentTime >= s.t) idx = i; });
        if (idx !== curIdx) {
          segEls.forEach((e, i) => e.classList.toggle("is-current", i === idx)); curIdx = idx;
          const e = segEls[idx]; if (e) text.scrollTo({ top: e.offsetTop - text.clientHeight / 3, behavior: "smooth" });
        }
      });
      audio.addEventListener("play", () => { card.classList.add("is-playing"); players.forEach(o => { if (o.audio !== audio) o.audio.pause(); }); duck(true, !!sp.isMusic); });
      audio.addEventListener("pause", () => { card.classList.remove("is-playing"); if (!players.some(o => !o.audio.paused)) duck(false); });
      audio.addEventListener("ended", () => { segEls.forEach(e => e.classList.remove("is-current")); curIdx = -1; fill.style.width = "0"; });
      audio.addEventListener("error", () => { card.classList.add("is-missing"); });

      btn.addEventListener("click", () => {
        if (card.classList.contains("is-missing")) { toast(t("audioMissing")); return; }
        audio.paused ? audio.play().catch(() => { card.classList.add("is-missing"); toast(t("audioMissing")); }) : audio.pause();
      });
      bar.addEventListener("click", e => { if (!audio.duration) return; const r = bar.getBoundingClientRect(); audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration; });
      segEls.forEach((e, i) => e.addEventListener("click", () => {
        if (card.classList.contains("is-missing")) return;
        audio.currentTime = sp.segments[i].t; if (audio.paused) audio.play().catch(() => {});
      }));

      card.append(head, bar, time, tog, text); box.append(card);
      players.push({ audio, card });
    });
  }

  /* ---------- Hintergrundmusik mit Absenken während Reden ---------- */
  const music = $("#bgMusic"); const musicBtn = $("#musicBtn");
  music.src = M.music.src; music.volume = M.music.volume;
  let musicWanted = false, musicMissing = false, fadeTimer = null, resumeAfterSpeech = false;
  const volumeWorks = (() => { const a = new Audio(); a.volume = 0.5; return a.volume === 0.5; })(); // iOS ignoriert volume
  function fadeTo(target, ms = 900) {
    clearInterval(fadeTimer);
    const start = music.volume, steps = 30, d = (target - start) / steps; let i = 0;
    fadeTimer = setInterval(() => { i++; music.volume = Math.min(1, Math.max(0, start + d * i)); if (i >= steps) clearInterval(fadeTimer); }, ms / steps);
  }
  let duckedHard = false;
  function duck(on, hard = false) {
    if (!musicWanted) return;
    if (on && (hard || !volumeWorks)) { duckedHard = true; resumeAfterSpeech = !music.paused; clearInterval(fadeTimer); music.pause(); }
    else if (on) fadeTo(M.music.duckVolume);
    else if (duckedHard) { duckedHard = false; if (resumeAfterSpeech) { music.volume = 0; music.play().then(() => fadeTo(M.music.volume, 1600)).catch(() => {}); } }
    else fadeTo(M.music.volume);
  }
  function updateMusicLabel() {
    $("#musicLabel").textContent = musicWanted ? t("musicOn") : L(M.music.title);
    musicBtn.setAttribute("aria-pressed", String(musicWanted));
    musicBtn.setAttribute("aria-label", musicWanted ? t("musicOn") : t("musicOff"));
  }
  musicBtn.addEventListener("click", async () => {
    if (musicMissing) { toast(t("audioMissing")); return; }
    if (musicWanted) { musicWanted = false; fadeTo(0, 600); setTimeout(() => { if (!musicWanted) music.pause(); }, 650); }
    else {
      musicWanted = true; music.volume = 0;
      try { await music.play(); fadeTo(players.some(p => !p.audio.paused) ? M.music.duckVolume : M.music.volume, 1600); }
      catch { musicWanted = false; musicMissing = true; toast(t("audioMissing")); }
    }
    store.set("music", musicWanted ? "1" : "0");
    updateMusicLabel();
  });
  music.addEventListener("error", () => { musicMissing = true; musicWanted = false; updateMusicLabel(); });

  /* ---------- Kerzen ---------- */
  let lastCandles = null;
  function renderCandles(list) {
    lastCandles = list;
    const f = $("#candles"); f.replaceChildren();
    if (!list) { $("#candleCount").textContent = ""; return; }
    $("#candleCount").textContent = t("candlesCount", list.length);
    list.slice(0, 120).forEach(c => {
      const w = el("div", "cwrap"); const cd = el("span", "candle"); cd.append(el("span", "flame"));
      w.append(cd, el("span", "cname", c.name || "")); f.append(w);
    });
  }
  const dlg = $("#candleDialog");
  $$("[data-action='candle']").forEach(b => b.addEventListener("click", () => {
    if (typeof dlg.showModal === "function") { dlg.querySelector("input").value = ""; dlg.showModal(); }
  }));
  dlg.addEventListener("close", async () => {
    if (dlg.returnValue !== "ok") return;
    const name = dlg.querySelector("input").value.trim().slice(0, 40);
    try { await window.MemorialStore?.addCandle(name); toast(t("candleThanks")); document.getElementById("kerzen").scrollIntoView({ behavior: "smooth" }); }
    catch (e) { console.error(e); toast(t(e && e.code === "rejected" ? "fRejected" : "fError") + (e && e.code && e.code !== "rejected" ? ` (${e.code})` : "")); }
  });

  /* ---------- Gedenkbuch ---------- */
  let lastEntries = null;
  function renderEntries(list) {
    lastEntries = list;
    const box = $("#entries"); box.replaceChildren();
    if (!list) return;
    if (!list.length) { box.append(el("p", "empty", t("noEntries"))); return; }
    const df = new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "de-DE", { day: "numeric", month: "long", year: "numeric" });
    list.forEach(e => {
      const a = el("article", "entry");
      a.append(el("p", "entry__msg", e.message));
      const meta = el("div", "entry__meta");
      meta.append(el("span", "entry__name", e.name || (lang === "tr" ? "İsimsiz" : "Anonym")));
      if (e.relation) meta.append(el("span", null, e.relation));
      if (e.date) meta.append(el("span", "entry__date", df.format(e.date)));
      a.append(meta); box.append(a);
    });
  }
  const form = $("#bookForm"), status = $("#formStatus"), msg = form.elements.message;
  msg.addEventListener("input", () => { $("#msgCount").textContent = msg.value.length; });
  let lastSubmit = 0;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("is-error");
    if (form.elements.website.value) return; // Bot
    const data = {
      name: form.elements.name.value.trim().slice(0, 60),
      relation: form.elements.relation.value.trim().slice(0, 60),
      message: msg.value.trim().slice(0, 1500),
      lang
    };
    if (data.message.length < 2) { status.textContent = t("fTooShort"); status.classList.add("is-error"); return; }
    if (!form.elements.consent.checked) { status.textContent = t("fNoConsent"); status.classList.add("is-error"); return; }
    if (Date.now() - lastSubmit < 30000) { status.textContent = t("fRejected"); status.classList.add("is-error"); return; } // Doppelklick/Spam bremsen
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = t("fSending");
    try {
      await window.MemorialStore.addEntry(data);
      lastSubmit = Date.now(); form.reset(); $("#msgCount").textContent = "0";
      status.textContent = t("fThanks");
    } catch (err) { console.error(err); status.textContent = t(err && err.code === "rejected" ? "fRejected" : "fError") + (err && err.code && err.code !== "rejected" ? ` (${err.code})` : ""); status.classList.add("is-error"); }
    finally { btn.disabled = false; btn.textContent = t("fSubmit"); }
  });

  /* ---------- Store anbinden ---------- */
  function bindStore() {
    const S = window.MemorialStore; if (!S) return;
    $("#demoNote").hidden = !S.demo;
    S.onCandles(renderCandles);
    S.onEntries(renderEntries);
  }
  if (window.MemorialStore) bindStore(); else window.addEventListener("memorial-store-ready", bindStore, { once: true });

  /* ---------- Kleinigkeiten ---------- */
  const lb = $("#lightbox");
  const lbVid = lb.querySelector("video"), lbImg = lb.querySelector("img");
  function openLightbox(src, cap, video) {
    lb.querySelector(".lightbox__cap").textContent = cap;
    if (video) { lbImg.hidden = true; lbVid.hidden = false; lbVid.poster = src; lbVid.src = video; duck(true); lbVid.play().catch(() => {}); }
    else { lbVid.hidden = true; lbImg.hidden = false; lbImg.src = src; lbImg.alt = cap; }
    lb.showModal();
  }
  lb.addEventListener("close", () => { if (!lbVid.hidden) { lbVid.pause(); lbVid.removeAttribute("src"); lbVid.load(); if (!players.some(o => !o.audio.paused)) duck(false); } });
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lightbox__close")) lb.close(); });

  let toastT; function toast(s) { const n = $("#toast"); n.textContent = s; n.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove("is-on"), 3200); }

  $$(".lang button").forEach(b => b.addEventListener("click", () => { if (b.dataset.lang === lang) return; lang = b.dataset.lang; store.set("lang", lang); renderStatic(); }));

  const topbar = $(".topbar");
  const onScroll = () => topbar.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(n => n.classList.add("is-in")); return; }
    io = io || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $$(".reveal:not(.is-in)").forEach(n => io.observe(n));
  }
  // Farbe "erblüht", wenn die fröhlichen Erinnerungen ins Bild kommen
  const memSec = $("#erinnerungen");
  new IntersectionObserver(es => es.forEach(e => memSec.classList.toggle("is-bloom", e.isIntersecting)), { threshold: .25 }).observe(memSec);
  // aktive Navigation
  const navLinks = $$(".nav a");

  /* ---------- Silberstaub im Hintergrund ---------- */
  function dust() {
    const c = $("#dust"); if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = c.getContext("2d"); let w, h, ps;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); w = c.width = innerWidth * d; h = c.height = innerHeight * d; ps = Array.from({ length: Math.round(innerWidth / 22) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: (Math.random() * 1.4 + .3) * d, v: (Math.random() * .25 + .05) * d, a: Math.random() * .5 + .1, p: Math.random() * 6.28 })); };
    size(); addEventListener("resize", size);
    (function loop(ts) {
      x.clearRect(0, 0, w, h);
      for (const p of ps) { p.y -= p.v; p.x += Math.sin(ts / 3000 + p.p) * .15; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        x.globalAlpha = p.a * (.6 + .4 * Math.sin(ts / 1500 + p.p)); x.fillStyle = "#dfe3e8"; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.28); x.fill(); }
      requestAnimationFrame(loop);
    })(0);
  }

  const navObserver = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => navObserver.observe(s));

  renderStatic();
  dust();
})();
