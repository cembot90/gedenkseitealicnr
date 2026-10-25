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

  // Erstes Jahresgedenken (14.09.2026)
  anniversary: {
    eyebrow: { de: "Erstes Jahresgedenken", tr: "Birinci yıl anması" },
    title: { de: "Ein Jahr ohne dich", tr: "Sensiz bir yıl" },
    paragraphs: {
      de: [
        "Ein Jahr ist vergangen, seit unser lieber Vater, Onkel und Bruder Ali Çinar von uns gegangen ist. Die Zeit hat den Schmerz leiser werden lassen, doch die Lücke, die er hinterlassen hat, bleibt.",
        "Wir vermissen seinen unermüdlichen Fleiß, seine Wärme und die stille Fürsorge, mit der er sein Leben seiner Familie gewidmet hat."
      ],
      tr: [
        "Sevgili babamız, dayımız ve kardeşimiz Ali Çinar'ın aramızdan ayrılışının üzerinden bir yıl geçti. Zaman acımızı biraz dindirdi, ama ardında bıraktığı boşluk hâlâ yerinde duruyor.",
        "Yorulmak bilmeyen emeğini, sıcaklığını ve hayatını ailesine adadığı o sessiz şefkatini özlüyoruz."
      ]
    },
    invitation: {
      de: "Zu seinem ersten Jahresgedenken laden wir alle Verwandten, Freunde und Bekannten herzlich ein, gemeinsam an ihn zu denken.",
      tr: "Birinci yıl anmasında onu birlikte anmak için tüm akrabalarımızı, dostlarımızı ve tanıdıklarımızı içtenlikle davet ediyoruz."
    },
    date: { de: "[Datum, Uhrzeit]", tr: "[Tarih, saat]" },
    place: { de: "[Ort]", tr: "[Yer]" },
    reflection: {
      de: "Er selbst sagte: „Ömrümü yaşayamadan gittim.“ Sein Leben empfand er als unvollständig. Für uns aber war es reich an Liebe, die bis heute in uns weiterlebt.",
      tr: "Kendisi „Ömrümü yaşayamadan gittim“ demişti. Hayatını yarım kalmış saydı. Bizim içinse sevgiyle doluydu ve o sevgi bugün hâlâ içimizde yaşıyor."
    },
    blessing: {
      de: "Möge sein Weg vom Licht begleitet sein, möge sein Kreis ewig bestehen.",
      tr: "Yolu ışıkla aydınlansın, cemi daim olsun."
    },
    closing: { de: "In Liebe und Dankbarkeit", tr: "Sevgi ve minnetle" },
    signature: { de: "Die Familie Çinar", tr: "Çinar Ailesi" }
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

  // Gedenkrede zum ersten Jahrestag. Die Zeitmarken (t, in Sekunden) sind geschätzt
  // und werden an die fertigen Suno-Aufnahmen angepasst.
  speeches: [
    {
      id: "rede-tr",
      lang: "tr",
      src: "audio/rede-tr.mp3",
      title: { de: "Gedenkrede zum ersten Jahrestag (Türkisch)", tr: "Birinci yıl anma konuşması (Türkçe)" },
      by: { de: "Die Familie Çinar", tr: "Çinar Ailesi" },
      segments: [
        { t: 0, text: "Sevgili ailem, sevgili dostlar,", translation: "Liebe Familie, liebe Freunde," },
        { t: 3, text: "bir yıl önce vedalaştık.", translation: "vor einem Jahr haben wir Abschied genommen." },
        { t: 6, text: "O gün dilimiz tutulmuştu, söylemek istediğimiz pek çok şey söylenmeden kaldı.", translation: "Damals waren wir sprachlos, und vieles, was wir sagen wollten, blieb ungesagt." },
        { t: 12, text: "Bugün yeniden bir aradayız, yalnızca yasla değil, minnetle de.", translation: "Heute stehen wir wieder zusammen, nicht nur in Trauer, sondern auch in Dankbarkeit." },
        { t: 18, text: "Ali Çinar çok söze ihtiyaç duymayan bir insandı.", translation: "Ali Çinar war ein Mensch, der nicht viele Worte brauchte." },
        { t: 22, text: "Sevgisini yaptıklarıyla gösterirdi: alın teriyle, güvenilirliğiyle, gelen herkese açık olan kapısıyla.", translation: "Er zeigte seine Liebe durch das, was er tat: durch harte Arbeit, durch Verlässlichkeit, durch ein offenes Haus für jeden, der kam." },
        { t: 29, text: "Kendini nadiren düşünür, bizi ise hep düşünürdü.", translation: "Er hat selten an sich gedacht und immer an uns." },
        { t: 33, text: "Bir keresinde şöyle demişti: „Ömrümü yaşayamadan gittim.“", translation: "Er hat einmal gesagt: „Ömrümü yaşayamadan gittim.“" },
        { t: 38, text: "Bu söz yüreğimizi yakıyor.", translation: "Dieser Satz tut weh." },
        { t: 41, text: "Ama bugün etrafımıza baktığımızda, onun neler yarattığını görüyoruz.", translation: "Aber wenn wir uns heute hier umsehen, dann sehen wir, was er geschaffen hat." },
        { t: 45, text: "Çocuklarını, kardeşlerini, ailesini görüyoruz.", translation: "Wir sehen seine Kinder, seine Geschwister, seine Familie." },
        { t: 48, text: "Bize kazandırdığı değerleri görüyoruz.", translation: "Wir sehen die Werte, die er uns mitgegeben hat." },
        { t: 51, text: "Belki kendi ömrünü tam yaşayamadı, ama onu bize armağan etti.", translation: "Vielleicht hat er sein eigenes Leben nicht ganz gelebt, aber er hat es uns geschenkt." },
        { t: 57, text: "Memleketi Erzincan onu geri aldı.", translation: "Seine Heimat Erzincan hat ihn zurückbekommen." },
        { t: 61, text: "Biz ise onu her sohbette, her anıda, onu hatırlatan her kahkahada yanımızda taşıyoruz.", translation: "Wir aber tragen ihn mit uns, in jedem Gespräch, in jeder Erinnerung, in jedem Lachen, das an ihn erinnert." },
        { t: 68, text: "Sevgili Ali, canım babam: Seni unutmayacağız.", translation: "Lieber Ali, lieber Baba: Wir vergessen dich nicht." },
        { t: 72, text: "Devr-i Daim. Işıklar yoldaşın olsun.", translation: "Devr-i Daim. Işıklar yoldaşın olsun." }
      ]
    },
    {
      id: "rede-de",
      lang: "de",
      src: "audio/rede-de.mp3",
      title: { de: "Gedenkrede zum ersten Jahrestag (Deutsch)", tr: "Birinci yıl anma konuşması (Almanca)" },
      by: { de: "Die Familie Çinar", tr: "Çinar Ailesi" },
      segments: [
        { t: 0, text: "Liebe Familie, liebe Freunde,", translation: "Sevgili ailem, sevgili dostlar," },
        { t: 3, text: "vor einem Jahr haben wir Abschied genommen.", translation: "bir yıl önce vedalaştık." },
        { t: 7, text: "Damals waren wir sprachlos, und vieles, was wir sagen wollten, blieb ungesagt.", translation: "O gün dilimiz tutulmuştu, söylemek istediğimiz pek çok şey söylenmeden kaldı." },
        { t: 13, text: "Heute stehen wir wieder zusammen, nicht nur in Trauer, sondern auch in Dankbarkeit.", translation: "Bugün yeniden bir aradayız, yalnızca yasla değil, minnetle de." },
        { t: 20, text: "Ali Çinar war ein Mensch, der nicht viele Worte brauchte.", translation: "Ali Çinar çok söze ihtiyaç duymayan bir insandı." },
        { t: 25, text: "Er zeigte seine Liebe durch das, was er tat: durch harte Arbeit, durch Verlässlichkeit, durch ein offenes Haus für jeden, der kam.", translation: "Sevgisini yaptıklarıyla gösterirdi: alın teriyle, güvenilirliğiyle, gelen herkese açık olan kapısıyla." },
        { t: 36, text: "Er hat selten an sich gedacht und immer an uns.", translation: "Kendini nadiren düşünür, bizi ise hep düşünürdü." },
        { t: 42, text: "Er hat einmal gesagt: „Ömrümü yaşayamadan gittim.“", translation: "Bir keresinde şöyle demişti: „Ömrümü yaşayamadan gittim.“" },
        { t: 46, text: "Ich bin gegangen, ohne mein Leben gelebt zu haben.", translation: "Ömrümü yaşayamadan gittim." },
        { t: 51, text: "Dieser Satz tut weh.", translation: "Bu söz yüreğimizi yakıyor." },
        { t: 54, text: "Aber wenn wir uns heute hier umsehen, dann sehen wir, was er geschaffen hat.", translation: "Ama bugün etrafımıza baktığımızda, onun neler yarattığını görüyoruz." },
        { t: 61, text: "Wir sehen seine Kinder, seine Geschwister, seine Familie.", translation: "Çocuklarını, kardeşlerini, ailesini görüyoruz." },
        { t: 65, text: "Wir sehen die Werte, die er uns mitgegeben hat.", translation: "Bize kazandırdığı değerleri görüyoruz." },
        { t: 70, text: "Vielleicht hat er sein eigenes Leben nicht ganz gelebt, aber er hat es uns geschenkt.", translation: "Belki kendi ömrünü tam yaşayamadı, ama onu bize armağan etti." },
        { t: 78, text: "Seine Heimat Erzincan hat ihn zurückbekommen.", translation: "Memleketi Erzincan onu geri aldı." },
        { t: 82, text: "Wir aber tragen ihn mit uns, in jedem Gespräch, in jeder Erinnerung, in jedem Lachen, das an ihn erinnert.", translation: "Biz ise onu her sohbette, her anıda, onu hatırlatan her kahkahada yanımızda taşıyoruz." },
        { t: 91, text: "Lieber Ali, lieber Baba: Wir vergessen dich nicht.", translation: "Sevgili Ali, canım babam: Seni unutmayacağız." },
        { t: 96, text: "Devr-i Daim. Işıklar yoldaşın olsun.", translation: "Devr-i Daim. Işıklar yoldaşın olsun." }
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
    navYear: "Jahrestag", navLife: "Leben", navMemories: "Erinnerungen", navWords: "Worte", navGallery: "Bilder", navBook: "Gedenkbuch",
    inMemory: "In liebendem Gedenken an", inviteLabel: "Einladung", whenLabel: "Wann", whereLabel: "Wo", speechLink: "Gedenkrede anhören",
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
    navYear: "Yıl dönümü", navLife: "Hayatı", navMemories: "Anılar", navWords: "Sözler", navGallery: "Fotoğraflar", navBook: "Anı Defteri",
    inMemory: "Sevgiyle anıyoruz", inviteLabel: "Davet", whenLabel: "Ne zaman", whereLabel: "Nerede", speechLink: "Anma konuşmasını dinle",
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
