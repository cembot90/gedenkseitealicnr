/*
  INHALTE DER GEDENKSEITE
  Alles, was auf der Seite steht, wird hier gepflegt.
  Texte in eckigen Klammern [ ... ] sind Platzhalter und werden durch eure Inhalte ersetzt.

  Reden (speeches): "segments" sind Zeitmarken in Sekunden. Während die Audiodatei läuft,
  wird der passende Satz hervorgehoben und die Übersetzung darunter gezeigt.
*/
window.MEMORIAL = {
  person: {
    name: "Ali Çinar",
    nickname: { de: "Vater, Onkel, Bruder", tr: "Baba, dayı, kardeş" },
    born: "01.02.1966",
    died: "14.09.2025",
    places: { de: "Erzincan · Deutschland · Erzincan", tr: "Erzincan · Almanya · Erzincan" },
    portrait: "images/portrait.jpg",
    portraitPosition: "50% 28%",
    quote: {
      de: "„Ömrümü yaşayamadan gittim.“ Seine eigenen Worte. Und doch hat er uns so viel Liebe hinterlassen.",
      tr: "„Ömrümü yaşayamadan gittim.“ Kendi sözleri. Yine de bize ne çok sevgi bıraktı."
    },
    quoteSource: { de: "Ali Çinar", tr: "Ali Çinar" }
  },

  music: {
    src: "audio/hintergrund.mp3",
    title: { de: "Musik für Ali", tr: "Ali için müzik" },
    volume: 0.35,      // normale Lautstärke
    duckVolume: 0.06   // Lautstärke, während eine Rede läuft
  },

  intro: {
    de: "Er hat sein Leben mit unermüdlichem Fleiß, tiefer Liebe und großer Hingabe seiner Familie geschenkt. Was bleibt, ist seine Wärme, seine Fürsorge und sein Lächeln, wenn er die Kleinsten im Arm hielt.",
    tr: "Hayatını yorulmak bilmeyen bir emekle, derin bir sevgiyle ve büyük bir adanmışlıkla ailesine verdi. Geriye sıcaklığı, şefkati ve en küçükleri kucağına aldığında yüzüne yayılan o gülümseme kaldı."
  },

  timeline: [
    { year: "1966", title: { de: "Erzincan", tr: "Erzincan" },
      text: { de: "Am 1. Februar 1966 in Erzincan geboren. [Kindheit, Familie, erste Erinnerungen.]", tr: "1 Şubat 1966'da Erzincan'da doğdu. [Çocukluğu, ailesi, ilk anılar.]" } },
    { year: "[Jahr]", title: { de: "Ein neues Zuhause", tr: "Yeni bir yuva" },
      text: { de: "[Der Weg nach Deutschland: wann, wohin, mit wem.]", tr: "[Almanya'ya geliş: ne zaman, nereye, kiminle.]" } },
    { year: "[Jahr]", title: { de: "Familie", tr: "Aile" },
      text: { de: "[Hochzeit, Kinder, Enkel.] Für seine Familie hat er gearbeitet, gesorgt und gelebt.", tr: "[Evlilik, çocuklar, torunlar.] Ailesi için çalıştı, onlar için yaşadı." } },
    { year: "[Jahr]", title: { de: "Fleiß und Herz", tr: "Emek ve gönül" },
      text: { de: "[Beruf, worauf er stolz war, was ihm wichtig war.]", tr: "[Mesleği, gurur duyduğu şeyler, onun için önemli olanlar.]" } },
    { year: "2025", title: { de: "Hakka yürüdü", tr: "Hakka yürüdü" },
      text: { de: "Nach einer langen und schweren Zeit ist er am 14. September 2025 von uns gegangen. In seiner Heimat Erzincan hat er seine letzte Ruhe gefunden.", tr: "Uzun ve zor bir dönemin ardından 14 Eylül 2025'te Hakka yürüdü. Memleketi Erzincan'da toprağa verildi." } }
  ],

  // Fröhliche Erinnerungen: hier wird die Seite farbig.
  // color: "amber" | "sea" | "rose" | "sky" | "olive"   image: optionales Foto
  memories: [
    { color: "amber", icon: "sun", image: "images/garten-sonnenuntergang.jpg",
      title: { de: "Zwei Prinzessinnen im Abendlicht", tr: "Akşam güneşinde iki prenses" },
      text: { de: "Sonnenuntergang, frisches Gras und zwei Kleine auf dem Arm. Genau so wollen wir ihn in Erinnerung behalten. [Was war das für ein Tag?]", tr: "Gün batımı, taze çimen ve kucağında iki minik. Onu tam da böyle hatırlamak istiyoruz. [O gün neydi?]" } },
    { color: "sea", icon: "star", image: "images/einschulung.jpg",
      title: { de: "Der große Schultag", tr: "Okulun ilk günü" },
      text: { de: "Die Schultüte fest im Arm, die Hand von Ali auf der Schulter. Stolz kann man nicht besser zeigen. [Wer ist auf dem Bild?]", tr: "Okul hediyesi sımsıkı kucakta, Ali'nin eli omzunda. Gurur ancak böyle gösterilir. [Fotoğrafta kimler var?]" } },
    { color: "rose", icon: "heart", image: "images/mit-dem-baby.jpg",
      title: { de: "Ganz behutsam", tr: "Usulca, şefkatle" },
      text: { de: "Ein Neugeborenes im Arm und dieser ruhige, warme Blick. [Ein Satz von euch dazu.]", tr: "Kucağında yeni doğmuş bir bebek ve o sakin, sıcak bakış. [Sizden bir cümle.]" } },
    { color: "sky", icon: "wave", image: "images/auf-dem-sofa.jpg",
      title: { de: "Sofa, Tee und Kinderlachen", tr: "Kanepe, çay ve çocuk kahkahası" },
      text: { de: "[Eine lustige oder warme Geschichte aus dem Familienalltag mit ihm.]", tr: "[Onunla aile hayatından komik ya da sıcak bir hikâye.]" } }
  ],

  // Reden, z. B. mit Suno erstellt. lang = Sprache der Aufnahme.
  speeches: [
    {
      id: "rede-tr",
      lang: "tr",
      src: "audio/rede-tr.mp3",
      title: { de: "Abschiedsworte auf Türkisch", tr: "Türkçe veda sözleri" },
      by: { de: "[Name, Beziehung]", tr: "[İsim, yakınlık]" },
      segments: [
        { t: 0,  text: "[Erster Satz der Rede im Original]", translation: "[Übersetzung ins Deutsche]" },
        { t: 8,  text: "[Zweiter Satz]", translation: "[Übersetzung]" },
        { t: 16, text: "[Dritter Satz]", translation: "[Übersetzung]" }
      ]
    },
    {
      id: "rede-de",
      lang: "de",
      src: "audio/rede-de.mp3",
      title: { de: "Abschiedsworte auf Deutsch", tr: "Almanca veda sözleri" },
      by: { de: "[Name, Beziehung]", tr: "[İsim, yakınlık]" },
      segments: [
        { t: 0,  text: "[Erster Satz der Rede im Original]", translation: "[Türkçe çevirisi]" },
        { t: 8,  text: "[Zweiter Satz]", translation: "[Çeviri]" },
        { t: 16, text: "[Dritter Satz]", translation: "[Çeviri]" }
      ]
    }
  ],

  gallery: [
    { src: "images/garten-sonnenuntergang.jpg", caption: { de: "Im Garten bei Sonnenuntergang", tr: "Bahçede gün batımı" } },
    { video: "video/erinnerung.mp4", src: "video/erinnerung-poster.jpg", caption: { de: "Ein kleiner Moment", tr: "Küçük bir an" } },
    { src: "images/einschulung.jpg", caption: { de: "Einschulung", tr: "Okulun ilk günü" } },
    { src: "images/mit-der-kleinen.jpg", caption: { de: "Gemeinsam gemütlich", tr: "Birlikte, huzurla" } },
    { src: "images/auf-dem-sofa.jpg", caption: { de: "Mit den Kleinsten", tr: "En küçüklerle" } },
    { src: "images/mit-dem-baby.jpg", caption: { de: "Willkommen auf der Welt", tr: "Dünyaya hoş geldin" } }
  ],

  family: { de: "Devr-i Daim. Işıklar yoldaşın olsun. Die Familie Çinar", tr: "Devr-i Daim. Işıklar yoldaşın olsun. Çinar Ailesi" }
};

/* Oberflächentexte */
window.UI = {
  de: {
    navLife: "Leben", navMemories: "Erinnerungen", navWords: "Worte", navGallery: "Bilder", navBook: "Gedenkbuch",
    inMemory: "In liebendem Gedenken an",
    lightCandle: "Licht anzünden", scroll: "Weiter",
    lifeEyebrow: "Sein Weg", lifeTitle: "Ein Leben voller Wärme",
    memEyebrow: "Was uns zum Lächeln bringt", memTitle: "Fröhliche Erinnerungen",
    wordsEyebrow: "Gesprochen mit Liebe", wordsTitle: "Worte für ihn",
    showTranslation: "Übersetzung zeigen", audioMissing: "Aufnahme folgt",
    galleryEyebrow: "Momente", galleryTitle: "Bilder aus seinem Leben", photoSoon: "Foto folgt",
    candlesEyebrow: "Ein Licht für Ali", candlesTitle: "Lichter", candlesCount: (n) => n === 1 ? "1 Licht brennt" : `${n} Lichter brennen`,
    candleNameLabel: "Ihr Name (optional)", candleConfirm: "Anzünden", cancel: "Abbrechen", candleThanks: "Ihr Licht brennt. Danke.",
    bookEyebrow: "Gedenkbuch", bookTitle: "Teilen Sie eine Erinnerung",
    bookIntro: "Jeder Eintrag wird von der Familie gelesen und erscheint nach Freigabe.",
    fName: "Name", fRelation: "Verbindung (z. B. Neffe, Nachbar, Kollege)", fMessage: "Ihre Worte", fSubmit: "Eintrag senden",
    fSending: "Wird gesendet …", fThanks: "Danke. Ihr Eintrag erscheint, sobald die Familie ihn freigegeben hat.",
    fError: "Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut.",
    fTooShort: "Bitte schreiben Sie ein paar Worte.",
    noEntries: "Noch keine Einträge. Sie können den ersten schreiben.",
    music: "Musik", musicOn: "Musik pausieren", musicOff: "Musik abspielen",
    demo: "Vorschau: Einträge werden noch nicht gespeichert."
  },
  tr: {
    navLife: "Hayatı", navMemories: "Anılar", navWords: "Sözler", navGallery: "Fotoğraflar", navBook: "Anı Defteri",
    inMemory: "Sevgiyle anıyoruz",
    lightCandle: "Çerağ uyandır", scroll: "Devam",
    lifeEyebrow: "Yolculuğu", lifeTitle: "Sıcaklıkla dolu bir hayat",
    memEyebrow: "Bizi gülümseten", memTitle: "Neşeli anılar",
    wordsEyebrow: "Sevgiyle söylenenler", wordsTitle: "Onun için sözler",
    showTranslation: "Çeviriyi göster", audioMissing: "Kayıt yakında",
    galleryEyebrow: "Anlar", galleryTitle: "Hayatından kareler", photoSoon: "Fotoğraf yakında",
    candlesEyebrow: "Ali için bir ışık", candlesTitle: "Çerağlar", candlesCount: (n) => `${n} çerağ yanıyor`,
    candleNameLabel: "Adınız (isteğe bağlı)", candleConfirm: "Uyandır", cancel: "Vazgeç", candleThanks: "Çerağınız yanıyor. Teşekkürler.",
    bookEyebrow: "Anı Defteri", bookTitle: "Bir anınızı paylaşın",
    bookIntro: "Her yazı aile tarafından okunur ve onaylandıktan sonra yayınlanır.",
    fName: "İsim", fRelation: "Yakınlık (ör. yeğen, komşu, iş arkadaşı)", fMessage: "Sözleriniz", fSubmit: "Gönder",
    fSending: "Gönderiliyor …", fThanks: "Teşekkürler. Yazınız aile onayladıktan sonra görünecek.",
    fError: "Maalesef olmadı. Lütfen daha sonra tekrar deneyin.",
    fTooShort: "Lütfen birkaç kelime yazın.",
    noEntries: "Henüz yazı yok. İlk yazan siz olabilirsiniz.",
    music: "Müzik", musicOn: "Müziği durdur", musicOff: "Müziği çal",
    demo: "Önizleme: yazılar henüz kaydedilmiyor."
  }
};
