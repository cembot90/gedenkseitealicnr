/*
  Datenanbindung für Gedenkbuch und Kerzen.
  Sicherheitsprinzip:
  - Besucher können Einträge nur ANLEGEN, nie ändern oder löschen (erzwungen in firestore.rules).
  - Neue Gedenkbuch-Einträge haben approved:false und sind unsichtbar, bis die Familie sie freigibt.
  - Gelesen werden nur freigegebene Einträge (die Abfrage filtert, die Regeln erzwingen es zusätzlich).
  - App Check sorgt dafür, dass nur diese Webseite schreiben darf, nicht beliebige Skripte.
  - Die Ausgabe erfolgt in app.js ausschließlich über textContent, eingeschleuster Code wird nie ausgeführt.
*/
const cfg = window.FIREBASE_CONFIG || {};
const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

function ready(store) {
  window.MemorialStore = store;
  window.dispatchEvent(new Event("memorial-store-ready"));
}

if (!cfg.apiKey) {
  /* ---------- Vorschaumodus ohne Datenbank ---------- */
  const candles = [{ name: "Familie" }, { name: "Cem" }, { name: "" }];
  const entries = [
    { name: "[Beispiel] Ayşe", relation: "Nichte", message: "Dayı, deine Geschichten am Teetisch werden mir immer fehlen. Danke für jedes Lachen.", date: new Date(2026, 9, 20) },
    { name: "[Beispiel] Thomas", relation: "Nachbar", message: "Ein Mensch, der immer zuerst gefragt hat, wie es dem anderen geht. Wir vermissen ihn.", date: new Date(2026, 9, 18) }
  ];
  const cl = new Set(), el = new Set();
  ready({
    demo: true,
    onCandles(cb) { cl.add(cb); cb([...candles]); },
    onEntries(cb) { el.add(cb); cb([...entries]); },
    async addCandle(name) { candles.unshift({ name }); cl.forEach(cb => cb([...candles])); },
    async addEntry() { await new Promise(r => setTimeout(r, 600)); /* in der Vorschau nicht gespeichert, wie später: erst nach Freigabe sichtbar */ }
  });
} else {
  /* ---------- Live mit Firebase ---------- */
  const [{ initializeApp }, fs, ac] = await Promise.all([
    import(`${SDK}/firebase-app.js`),
    import(`${SDK}/firebase-firestore.js`),
    window.APPCHECK_SITE_KEY ? import(`${SDK}/firebase-app-check.js`) : Promise.resolve(null)
  ]);
  const { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } = fs;

  const app = initializeApp(cfg);
  if (ac) ac.initializeAppCheck(app, { provider: new ac.ReCaptchaV3Provider(window.APPCHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
  const db = getFirestore(app);
  const guestbook = collection(db, "guestbook");
  const candles = collection(db, "candles");
  const clean = (s, n) => String(s || "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, n);

  ready({
    demo: false,
    onCandles(cb) {
      onSnapshot(query(candles, orderBy("createdAt", "desc"), limit(300)),
        snap => cb(snap.docs.map(d => ({ name: clean(d.data().name, 40) }))),
        err => { console.error(err); cb([]); });
    },
    onEntries(cb) {
      onSnapshot(query(guestbook, where("approved", "==", true), orderBy("createdAt", "desc"), limit(200)),
        snap => cb(snap.docs.map(d => {
          const x = d.data();
          return { name: clean(x.name, 60), relation: clean(x.relation, 60), message: clean(x.message, 1500), date: x.createdAt?.toDate?.() || null };
        })),
        err => { console.error(err); cb([]); });
    },
    async addCandle(name) {
      await addDoc(candles, { name: clean(name, 40), createdAt: serverTimestamp() });
    },
    async addEntry({ name, relation, message, lang }) {
      await addDoc(guestbook, {
        name: clean(name, 60), relation: clean(relation, 60), message: clean(message, 1500),
        lang: lang === "tr" ? "tr" : "de", approved: false, createdAt: serverTimestamp()
      });
    }
  });
}
