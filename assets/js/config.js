/*
  Firebase-Konfiguration (aus der Firebase-Konsole: Projekteinstellungen > Allgemein > Web-App).
  Diese Werte sind KEIN Geheimnis: sie stehen bei jeder Firebase-Webseite öffentlich im Code.
  Geschützt wird die Datenbank über die Regeln in firestore.rules und über App Check.

  Solange apiKey leer ist, läuft die Seite im Vorschaumodus (nichts wird gespeichert).
*/
window.FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};

/* reCAPTCHA-v3-Websiteschlüssel für Firebase App Check (siehe README). Leer = App Check aus. */
window.APPCHECK_SITE_KEY = "";
