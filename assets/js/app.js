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
    $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));

    const p = M.person;
    $("#heroName").textContent = p.name;
    $("#heroNick").textContent = L(p.nickname);
    $("#born").textContent = p.born;
    $("#died").textContent = p.died;
    $("#places").textContent = L(p.places);
    $("#intro").textContent = L(M.intro);
    $("#footName").textContent = p.name;
    $("#footFamily").textContent = L(M.family);
    document.title = (lang === "tr" ? "Anısına: " : "In Erinnerung an ") + p.name;
    const img = $(".portrait__img");
    if (p.portrait) { img.style.backgroundImage = `url("${encodeURI(p.portrait)}")`; img.style.backgroundPosition = p.portraitPosition || "center"; }

    // Seine Worte, Wort für Wort
    const line = $("#wordsLine"); line.replaceChildren();
    String(p.words || "").split(" ").forEach((w, i, arr) => { line.append(el("span", null, w)); if (i < arr.length - 1) line.append(document.createTextNode(" ")); });
    $("#wordsMeaning").textContent = L(p.wordsMeaning);
    $("#wordsAfter").textContent = L(p.wordsAfter);

    // Erstes Jahresgedenken
    const A = M.anniversary;
    if (A) {
      $("#annEyebrow").textContent = L(A.eyebrow);
      $("#annTitle").textContent = L(A.title);
      const body = $("#annBody"); body.replaceChildren(...(A.paragraphs[lang] || A.paragraphs.de).map(x => el("p", "glow", x)));
      const r = $("#annReflection"); r.textContent = L(A.reflection); r.classList.add("glow");
      $("#annBlessing").textContent = L(A.blessing);
      $("#annClosing").textContent = L(A.closing);
      $("#annSignature").textContent = L(A.signature);
    } else $("#jahrestag").hidden = true;
    $("#intro").classList.add("glow");

    // Lebensweg
    const tl = $("#timeline"); tl.replaceChildren();
    M.timeline.forEach(item => {
      const li = el("li", "tl");
      li.append(el("div", "tl__year glow", item.year));
      const b = el("div", "tl__body"); b.append(el("h3", null, L(item.title)), el("p", null, L(item.text)));
      li.append(b); tl.append(li);
    });

    // Erinnerungen: Foto bleibt stehen, zoomt und färbt sich, Text gleitet darüber
    const mg = $("#memories"); mg.replaceChildren();
    M.memories.forEach(m => {
      const sc = el("article", `moment moment--${m.color} scene`); sc.dataset.scene = "";
      const st = el("div", "stage");
      st.append(el("div", "moment__glow"));
      if (m.image) {
        const fr = el("div", "moment__frame"); const im = el("img"); im.src = m.image; im.alt = L(m.title); im.loading = "lazy"; im.decoding = "async";
        fr.append(im); fr.addEventListener("click", () => openLightbox(m.image, L(m.title))); st.append(fr);
      }
      const cp = el("div", "moment__copy");
      const ic = el("span", "moment__icon"); ic.append(svgIcon(m.icon));
      cp.append(ic, el("h3", null, L(m.title)), el("p", null, L(m.text)));
      st.append(cp); sc.append(st); mg.append(sc);
    });

    renderSpeeches();

    // Galerie: Band, das beim Scrollen seitlich durchfährt
    const g = $("#gallery"); g.replaceChildren();
    M.gallery.filter(ph => ph.src).forEach(ph => {
      const f = el("figure", "shot"); f.tabIndex = 0;
      const im = el("img"); im.src = ph.src; im.alt = L(ph.caption); im.decoding = "async";
      im.addEventListener("load", () => { measure(); centerShot(); });
      f.append(im, el("figcaption", null, L(ph.caption)));
      if (ph.video) { const pb = el("span", "shot__play"); pb.setAttribute("aria-hidden", "true"); f.append(pb); }
      const open = () => openLightbox(ph.src, L(ph.caption), ph.video);
      f.addEventListener("click", open); f.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
      g.append(f);
    });

    observeGlow();
    collectScenes();
    updateMusicLabel();
    renderCandles(lastCandles);
    renderEntries(lastEntries);
  }

  /* ---------- Reden: eine Karte, Umschalter DE | TR, Text läuft mit ---------- */
  const players = [];
  const speechLang = {}; // gewählte Fassung je Rede, bleibt beim Sprachwechsel der Seite erhalten, wenn bewusst gewählt
  function renderSpeeches() {
    players.forEach(p => { p.audio.pause(); });
    players.length = 0;
    const box = $("#speeches"); box.replaceChildren();
    M.speeches.forEach(sp => {
      const langs = Object.keys(sp.versions);
      let cur = speechLang[sp.id] || (sp.versions[lang] ? lang : langs[0]);

      const card = el("article", "speech");
      const head = el("div", "speech__head");
      const btn = el("button", "play"); btn.type = "button"; btn.setAttribute("aria-label", L(sp.title));
      btn.innerHTML = '<svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
      const meta = el("div"); meta.append(el("h3", "speech__title", L(sp.title)), el("p", "speech__by", L(sp.by)));
      const sw = el("div", "seg-switch speech__lang"); sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Fassung / Dil");
      const swBtns = langs.map(l => { const b = el("button", null, l.toUpperCase()); b.type = "button"; b.dataset.v = l; sw.append(b); return b; });
      head.append(btn, meta, sw);

      const bar = el("div", "speech__bar"); const fill = el("i"); bar.append(fill);
      const time = el("div", "speech__time"); const curT = el("span", null, "0:00"); const dur = el("span", null, "–"); time.append(curT, dur);
      const tog = el("label", "trtoggle"); const cb = el("input"); cb.type = "checkbox";
      tog.append(cb, document.createTextNode(t("showTranslation")));
      cb.addEventListener("change", () => card.classList.toggle("show-tr", cb.checked));
      const text = el("div", "speech__text");

      const audio = new Audio(); audio.preload = "none";
      const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "–";
      let segEls = [], curIdx = -1;

      function load(v) {
        cur = v; const ver = sp.versions[v];
        audio.pause(); audio.src = ver.src; card.classList.remove("is-missing", "is-playing");
        swBtns.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === v)));
        cb.checked = v !== lang; card.classList.toggle("show-tr", cb.checked);
        fill.style.width = "0"; curT.textContent = "0:00"; dur.textContent = "–"; curIdx = -1;
        text.replaceChildren();
        segEls = ver.segments.map((s, i) => {
          const d = el("div", "seg"); d.append(el("p", "seg__orig", s.text), el("p", "seg__tr", s.translation)); text.append(d);
          d.addEventListener("click", () => {
            if (card.classList.contains("is-missing")) return;
            audio.currentTime = ver.segments[i].t; if (audio.paused) audio.play().catch(() => {});
          });
          return d;
        });
      }
      swBtns.forEach(b => b.addEventListener("click", () => { if (b.dataset.v !== cur) { speechLang[sp.id] = b.dataset.v; load(b.dataset.v); } }));

      audio.addEventListener("loadedmetadata", () => { dur.textContent = fmt(audio.duration); });
      audio.addEventListener("timeupdate", () => {
        curT.textContent = fmt(audio.currentTime);
        if (audio.duration) fill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        const segs = sp.versions[cur].segments;
        let idx = -1; segs.forEach((s, i) => { if (audio.currentTime >= s.t) idx = i; });
        if (idx !== curIdx) {
          segEls.forEach((e, i) => e.classList.toggle("is-current", i === idx)); curIdx = idx;
          const e = segEls[idx]; if (e) text.scrollTo({ top: e.offsetTop - text.clientHeight / 3, behavior: "smooth" });
        }
      });
      audio.addEventListener("play", () => { card.classList.add("is-playing"); players.forEach(o => { if (o.audio !== audio) o.audio.pause(); }); stopMusic(); });
      audio.addEventListener("pause", () => { card.classList.remove("is-playing"); });
      audio.addEventListener("ended", () => { segEls.forEach(e => e.classList.remove("is-current")); curIdx = -1; fill.style.width = "0"; });
      audio.addEventListener("error", () => { if (audio.getAttribute("src")) card.classList.add("is-missing"); });

      btn.addEventListener("click", () => {
        userActed = true;
        if (card.classList.contains("is-missing")) { toast(t("audioMissing")); return; }
        audio.paused ? audio.play().catch(() => { card.classList.add("is-missing"); toast(t("audioMissing")); }) : audio.pause();
      });
      bar.addEventListener("click", e => { if (!audio.duration) return; const r = bar.getBoundingClientRect(); audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration; });

      card.append(head, bar, time, tog, text); box.append(card);
      players.push({ audio, card });
      load(cur);
    });
  }

  /* ---------- Trauerlied als Hintergrundmusik ----------
     Startet beim Betreten der Seite. Browser erlauben Ton oft erst nach der ersten Berührung/Taste,
     dann startet es bei der ersten Interaktion. Läuft eine Rede oder ein Video, stoppt die Musik;
     wieder an geht sie nur über den Musik-Knopf. */
  const music = $("#bgMusic"); const musicBtn = $("#musicBtn");
  music.src = M.music.src; music.volume = M.music.volume; music.preload = "auto";
  let musicWanted = false, musicMissing = false, fadeTimer = null, userActed = false;
  function fadeTo(target, ms = 900) {
    clearInterval(fadeTimer);
    const start = music.volume, steps = 30, d = (target - start) / steps; let i = 0;
    fadeTimer = setInterval(() => { i++; music.volume = Math.min(1, Math.max(0, start + d * i)); if (i >= steps) clearInterval(fadeTimer); }, ms / steps);
  }
  async function startMusic() {
    if (musicMissing) return false;
    musicWanted = true; updateMusicLabel();
    music.volume = 0;
    try { await music.play(); fadeTo(M.music.volume, 2000); return true; }
    catch (e) { musicWanted = false; updateMusicLabel(); if (e && e.name !== "NotAllowedError") musicMissing = true; return false; }
  }
  function stopMusic() {
    if (!musicWanted && music.paused) return;
    musicWanted = false; clearInterval(fadeTimer); music.pause(); updateMusicLabel();
  }
  function duck(on) { if (on) stopMusic(); } // Video in der Großansicht
  function updateMusicLabel() {
    $("#musicLabel").textContent = musicWanted ? t("musicOn") : L(M.music.title);
    musicBtn.setAttribute("aria-pressed", String(musicWanted));
    musicBtn.setAttribute("aria-label", musicWanted ? t("musicOn") : t("musicOff"));
  }
  musicBtn.addEventListener("click", async () => {
    userActed = true;
    if (musicMissing) { toast(t("audioMissing")); return; }
    if (musicWanted) { musicWanted = false; fadeTo(0, 600); updateMusicLabel(); setTimeout(() => { if (!musicWanted) music.pause(); }, 650); }
    else { players.forEach(p => p.audio.pause()); await startMusic(); }
  });
  music.addEventListener("error", () => { musicMissing = true; musicWanted = false; updateMusicLabel(); });

  // Beim Betreten starten; falls der Browser blockiert, bei der ersten Interaktion
  startMusic().then(ok => {
    if (ok) return;
    const kick = (e) => {
      if (e.target && e.target.closest && e.target.closest("#musicBtn, .play, .speech__lang")) return; // diese Knöpfe entscheiden selbst
      ["pointerdown", "keydown", "touchend"].forEach(n => removeEventListener(n, kick, true));
      setTimeout(() => {
        const speechRunning = players.some(p => !p.audio.paused);
        if (!userActed && !speechRunning && !musicWanted) startMusic();
      }, 0);
    };
    ["pointerdown", "keydown", "touchend"].forEach(n => addEventListener(n, kick, true));
  });

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
  lb.addEventListener("close", () => { if (!lbVid.hidden) { lbVid.pause(); lbVid.removeAttribute("src"); lbVid.load(); } });
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lightbox__close")) lb.close(); });

  let toastT; function toast(s) { const n = $("#toast"); n.textContent = s; n.classList.add("is-on"); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove("is-on"), 3200); }

  $$(".nav [data-lang]").forEach(b => b.addEventListener("click", () => { if (b.dataset.lang === lang) return; lang = b.dataset.lang; store.set("lang", lang); renderStatic(); }));

  /* ---------- Scroll-Szenen: --p von 0 bis 1 je Szene ---------- */
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = $(".nav");
  const noHover = matchMedia("(hover: none)").matches;
  let scenes = [];
  const mobile = matchMedia("(max-width: 820px)");
  function collectScenes() {
    scenes = $$("[data-scene]").filter(sc => !(mobile.matches && sc.classList.contains("reel")));
    measure(); tick(); centerShot();
  }
  mobile.addEventListener?.("change", () => collectScenes());
  function measure() {
    const tr = $("#gallery");
    if (tr) tr.style.setProperty("--shift", Math.max(0, tr.scrollWidth - innerWidth) + "px");
  }
  function tick() {
    const vh = innerHeight;
    for (const sc of scenes) {
      const r = sc.getBoundingClientRect(), len = r.height - vh;
      let p = len > 0 ? -r.top / len : (r.top < 0 ? 1 : 0);
      p = Math.min(1, Math.max(0, p));
      if (sc._p !== p) { sc._p = p; sc.style.setProperty("--p", p.toFixed(4)); }
    }
    const w = $(".words");
    if (w) {
      const p = reduced ? 1 : (w._p || 0), spans = $$("#wordsLine span"), n = spans.length;
      spans.forEach((sp, i) => sp.classList.toggle("on", p > (i + .5) / n * .6));
      $("#wordsMeaning").classList.toggle("on", p > .66);
      $("#wordsAfter").classList.toggle("on", p > .78);
    }
    nav.classList.toggle("is-on", scrollY > vh * .7);
    if (noHover || mobile.matches) centerShot();
  }
  // Ohne Maus (Handy, Tablet): das Bild in der Mitte des Bands wird farbig
  function centerShot() {
    if (!noHover && !mobile.matches) { $$(".shot.is-center").forEach(s => s.classList.remove("is-center")); return; }
    const shots = $$(".shot"), mid = innerWidth / 2; let best = null, bd = Infinity;
    shots.forEach(sh => { const r = sh.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = sh; } });
    shots.forEach(sh => sh.classList.toggle("is-center", sh === best));
  }
  let shotRaf = 0;
  $("#gallery").addEventListener("scroll", () => { cancelAnimationFrame(shotRaf); shotRaf = requestAnimationFrame(centerShot); }, { passive: true });
  let ticking = false;
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; tick(); }); } }, { passive: true });
  addEventListener("resize", () => { measure(); tick(); });

  /* ---------- Absätze leuchten in der Bildmitte auf ---------- */
  let glowIO;
  function observeGlow() {
    if (reduced || !("IntersectionObserver" in window)) { $$(".glow").forEach(n => n.classList.add("lit")); return; }
    glowIO = glowIO || new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("lit", e.isIntersecting || e.boundingClientRect.top < 0)), { rootMargin: "-38% 0px -38% 0px" });
    $$(".glow").forEach(n => glowIO.observe(n));
  }

  /* ---------- Menü (Handy) ---------- */
  const menu = $("#menu"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("is-open")); }
    else { menu.classList.remove("is-open"); setTimeout(() => { if (menuBtn.getAttribute("aria-expanded") === "false") menu.hidden = true; }, 300); }
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") setMenu(false); });

  /* ---------- Aktiver Menüpunkt ---------- */
  const navLinks = $$(".nav__links a");
  const navObserver = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => navObserver.observe(s));

  renderStatic();
})();
