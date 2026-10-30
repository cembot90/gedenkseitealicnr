# Gedenkseite Ali Çınar

Gedenkseite für **Ali Çınar** (01.02.1966 bis 14.09.2025, Erzincan), den verstorbenen Onkel von Cem (Repo-Inhaber, cembot90@gmail.com).

- Repo: `cembot90/gedenkseitealicnr` (privat)
- Hosting: GitHub Pages, `https://cembot90.github.io/gedenkseitealicnr/`
- Gedenkbuch, Lichter, Verwaltungsinhalte: Firebase Firestore, Projekt `alicnr`, ID `alicnr-ccf0a`
- Technischer Aufbau, Firebase-Einrichtung und Sicherheit: siehe `README.md`

## Arbeitsweise

- Antworten an Cem immer auf **Deutsch**.
- **Keine Gedankenstriche** (– oder —) als Satzzeichen, weder in Antworten noch in Seitentexten, Commits oder Kommentaren. Stattdessen Punkt, Komma, Doppelpunkt oder „bis“ (z. B. bei Datumsangaben).
- Ton: würdevoll und warm.

## Inhaltliche Regeln

- Name immer **„Ali Çınar“** mit ı (punktloses i) und Ç. Nie „Cinar“, „Çinar“ oder „Cınar“.
- Alles **zweisprachig Deutsch und Türkisch**. Neue Texte immer in beiden Sprachen anlegen (`{ de: …, tr: … }` in `assets/js/content.js`).
- Auf Türkisch ist Ali für die Familie **„Baba, dayı, amca, kardeş“** (deutsch: „Vater, Onkel, Bruder“).
- Farben: **Grau, Silber, Schwarz**. Farbe nur bei fröhlichen Erinnerungen (Galerie: grau, Bild unter der Maus bzw. in der Mitte farbig). Die dezenten goldenen Akzente (Herz, Licht, App-Symbol „AÇ“, Verwaltung) sind bewusst so entschieden.
- Suno-Reden (`audio/rede-de.m4a`, `audio/rede-tr.m4a`, Sätze mit Zeitmarken in `content.js`) und Hintergrundmusik (`audio/trauerlied.m4a`) sind eingebunden. Rechte (Suno Pro) stehen im Impressum.

## Sicherheit

- Gedenkbuch und Lichter gegen Missbrauch absichern: alles serverseitig in `firestore.rules` (anonyme Anmeldung, 30 Sekunden Pause, Feld- und Längenprüfung, keine Links). Texte nur per `textContent` ausgeben, strikte CSP beibehalten.
- Einträge und Kerzen erscheinen **sofort**. Es wird nur Spam entfernt, keine Vorabprüfung.
- Geteilte Fotos („Fotos mit Ali“) erscheinen erst nach Freigabe; Funktion ist derzeit ausgeschaltet.
- Admin nur `cembot90@gmail.com` mit Google-Anmeldung (bestätigte E-Mail).
- Nach jeder Regeländerung Cem daran erinnern, `firestore.rules` in der Firebase-Konsole zu veröffentlichen (wird nicht automatisch deployt).

## Stand der Verwaltung (`admin.html`)

Vorhanden: Übersicht, Inhalte (Editor DE/TR), Mediathek (Fotos), Freigaben, Gedenkbuch, Lichter, Einstellungen mit Wartungsmodus („Mit Passwort“ oder „Geschlossen“, PBKDF2-Hash in `site/gate`) und „Repo-Stand übernehmen“.

## Technische Hinweise

- Reine statische Seite ohne Build-Schritt. Kein Framework.
- Nach Änderungen an CSS oder JS die Versionsnummer `?v=` in `index.html` (und ggf. `admin.html`) überall erhöhen.
- Inhalte aus der Verwaltung (`site/content`) überschreiben `content.js`. Nach Inhaltsänderungen im Repo Cem darauf hinweisen, in der Verwaltung „Repo-Stand übernehmen“ zu tippen.
- Fotos ohne GPS- und Kameradaten einchecken, Audio und Video ohne Metadaten.
- Alle Seiten `noindex`. Keine Cookies, kein Tracking, Schriften lokal.
