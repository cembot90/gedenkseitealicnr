/*
  Wartungsmodus / Passwortschutz (Sichtschutz)
  - Wird in der Verwaltung geschaltet (Firestore: site/gate).
  - Die Seite bleibt verborgen, bis store.js den Zustand gemeldet hat (window.__gate).
  - Passwort nur als PBKDF2-Hash mit Salz gespeichert. Hinweis: Statische Dateien (Fotos, Audio)
    sind bei GitHub Pages technisch weiterhin direkt abrufbar, dies ist kein echter Zugriffsschutz.
*/
(() => {
  "use strict";
  const root = document.documentElement;
  const KEY = "gate-pass";
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
  let resolveOpen, decided = false, cfg = null;
  window.GATE = new Promise(r => { resolveOpen = r; });

  const T = {
    de: { title: "In Erinnerung an Ali Çınar", closed: "Diese Seite wird gerade vorbereitet. Bitte schauen Sie später wieder vorbei.",
          pw: "Diese Seite ist vorerst nur für Familie und Freunde zugänglich.", label: "Passwort", open: "Öffnen", wrong: "Das Passwort stimmt nicht.", checking: "Wird geprüft …" },
    tr: { title: "Ali Çınar'ın anısına", closed: "Bu sayfa şu anda hazırlanıyor. Lütfen daha sonra tekrar uğrayın.",
          pw: "Bu sayfa şimdilik yalnızca aile ve dostlara açık.", label: "Şifre", open: "Aç", wrong: "Şifre doğru değil.", checking: "Kontrol ediliyor …" }
  };
  const lang = () => { const s = store.get("lang"); return s === "tr" || s === "de" ? s : ((navigator.language || "").toLowerCase().startsWith("tr") ? "tr" : "de"); };

  async function derive(pw, salt, iter) {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(pw), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: enc.encode(salt), iterations: iter }, key, 256);
    return btoa(String.fromCharCode(...new Uint8Array(bits)));
  }

  function unlock() {
    decided = true;
    root.classList.remove("is-gated", "is-checking");
    const g = document.getElementById("gate"); if (g) g.hidden = true;
    resolveOpen();
  }

  function show(c) {
    decided = true;
    root.classList.remove("is-checking");
    const t = T[lang()], g = document.getElementById("gate");
    const msg = c.message && typeof c.message === "object" ? (c.message[lang()] || c.message.de || "") : "";
    document.getElementById("gateTitle").textContent = t.title;
    document.getElementById("gateMsg").textContent = msg || (c.mode === "password" ? t.pw : t.closed);
    const form = document.getElementById("gateForm");
    form.hidden = c.mode !== "password";
    document.getElementById("gateLabel").textContent = t.label;
    document.getElementById("gateBtn").textContent = t.open;
    g.hidden = false;
    if (c.mode === "password") setTimeout(() => document.getElementById("gatePw").focus(), 50);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("gateForm"), st = document.getElementById("gateStatus"), btn = document.getElementById("gateBtn");
    let tries = 0;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!cfg || cfg.mode !== "password") return;
      const t = T[lang()], pw = document.getElementById("gatePw").value;
      if (!pw) return;
      btn.disabled = true; st.textContent = t.checking; st.classList.remove("is-error");
      try {
        // nach Fehlversuchen kurz bremsen
        if (tries > 2) await new Promise(r => setTimeout(r, Math.min(8000, 1000 * (tries - 2))));
        const h = await derive(pw, cfg.salt, cfg.iter);
        if (h === cfg.hash) { store.set(KEY, h); st.textContent = ""; unlock(); }
        else { tries++; st.textContent = t.wrong; st.classList.add("is-error"); document.getElementById("gatePw").select(); }
      } catch (err) { console.error(err); st.textContent = t.wrong; st.classList.add("is-error"); }
      finally { btn.disabled = false; }
    });
  });

  // Von store.js aufgerufen: Zustand aus der Verwaltung, isAdmin = in der Verwaltung angemeldet
  window.__gate = (c, isAdmin) => {
    cfg = c;
    const ok = !c || !c.enabled || isAdmin || (c.mode === "password" && c.hash && store.get(KEY) === c.hash);
    if (ok) { if (root.classList.contains("is-gated") || !decided) unlock(); return; }
    // (wieder) verbergen, auch wenn die Seite schon offen war
    root.classList.add("is-gated");
    show(c);
  };

  // Falls die Datenbank nicht antwortet: nach 8 Sekunden öffnen statt alle auszusperren
  setTimeout(() => { if (!decided) unlock(); }, 8000);
})();
