/*
  INHALTE DER GEDENKSEITE
  Alles, was auf der Seite steht, wird hier gepflegt.
  Texte in eckigen Klammern [ ... ] sind Platzhalter und werden durch eure Inhalte ersetzt.

  Reden (speeches): "segments" sind Zeitmarken in Sekunden. Während die Audiodatei läuft,
  wird der passende Satz hervorgehoben und die Übersetzung darunter gezeigt.
*/
window.MEMORIAL = {
  person: {
    name: "Ali Çınar",
    nickname: { de: "Vater, Onkel, Bruder", tr: "Baba, dayı, amca, kardeş" },
    born: "01.02.1966",
    died: "14.09.2025",
    places: { de: "Erzincan · Deutschland · Erzincan", tr: "Erzincan · Almanya · Erzincan" },
    portrait: "images/portrait.jpg",
    portraitPosition: "50% 28%",
    quote: {
      de: "„Ömrümü yaşayamadan gittim.“ Seine eigenen Worte. Und doch hat er uns so viel Liebe hinterlassen.",
      tr: "„Ömrümü yaşayamadan gittim.“ Kendi sözleri. Yine de bize ne çok sevgi bıraktı."
    },
    quoteSource: { de: "Ali Çınar", tr: "Ali Çınar" },
    // Seine eigenen Worte: leuchten beim Scrollen Wort für Wort auf
    words: "Ömrümü yaşayamadan gittim.",
    wordsMeaning: { de: "„Ich bin gegangen, ohne mein Leben gelebt zu haben.“ Das hat er selbst gesagt.", tr: "Bu sözleri kendisi söylemişti." },
    wordsAfter: { de: "Und doch hat er uns so viel Liebe hinterlassen.", tr: "Yine de bize ne çok sevgi bıraktı." }
  },

  music: {
    src: "audio/trauerlied.m4a",   // „Ali Çınar, Ali'miz“, startet beim Betreten der Seite
    title: { de: "Trauerlied abspielen", tr: "Ağıtı çal" },
    volume: 0.55       // Lautstärke des Trauerlieds
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
        "Ein Jahr ist vergangen, seit unser lieber Vater, Onkel und Bruder Ali Çınar von uns gegangen ist. Die Zeit hat den Schmerz leiser werden lassen, doch die Lücke, die er hinterlassen hat, bleibt.",
        "Wir vermissen seinen unermüdlichen Fleiß, seine Wärme und die stille Fürsorge, mit der er sein Leben seiner Familie gewidmet hat."
      ],
      tr: [
        "Sevgili babamız, dayımız, amcamız ve kardeşimiz Ali Çınar'ın aramızdan ayrılışının üzerinden bir yıl geçti. Zaman acımızı biraz dindirdi, ama ardında bıraktığı boşluk hâlâ yerinde duruyor.",
        "Yorulmak bilmeyen emeğini, sıcaklığını ve hayatını ailesine adadığı o sessiz şefkatini özlüyoruz."
      ]
    },
    reflection: {
      de: "Er selbst sagte: „Ömrümü yaşayamadan gittim.“ Sein Leben empfand er als unvollständig. Für uns aber war es reich an Liebe, die bis heute in uns weiterlebt.",
      tr: "Kendisi „Ömrümü yaşayamadan gittim“ demişti. Hayatını yarım kalmış saydı. Bizim içinse sevgiyle doluydu ve o sevgi bugün hâlâ içimizde yaşıyor."
    },
    blessing: {
      de: "Möge sein Weg vom Licht begleitet sein, möge sein Kreis ewig bestehen.",
      tr: "Yolu ışıkla aydınlansın, cemi daim olsun."
    },
    closing: { de: "In Liebe und Dankbarkeit", tr: "Sevgi ve minnetle" },
    signature: { de: "Die Familie Çınar", tr: "Çınar Ailesi" }
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
      text: { de: "Auf einer Hochzeit in Frankfurt, die wir gemeinsam mit den Kleinen besucht haben. Die Sonne ging unter, und er hielt beide Babys im Arm, als wäre es das Selbstverständlichste der Welt. Genau so wollen wir ihn in Erinnerung behalten.", tr: "Minikler ile birlikte gittiğimiz Frankfurt'taki bir düğünde. Güneş batarken iki bebeği birden kucağına almıştı, sanki dünyanın en doğal şeyiymiş gibi. Onu tam da böyle hatırlamak istiyoruz." } },
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

  // Gedenkrede: eine Karte mit Umschalter DE | TR.
  // Zeitmarken (t, in Sekunden) aus den Textspuren der Suno-Aufnahmen.
  speeches: [
    {
      id: "gedenkrede",
      title: { de: "Wir vergessen dich nicht", tr: "Seni unutmayacağız" },
      by: { de: "Gedenkrede zum ersten Jahrestag", tr: "Birinci yıl anma konuşması" },
      versions: {
        de: {
          src: "audio/rede-de.m4a",
          segments: [
            { t: 1.9, text: "Liebe Familie, liebe Freunde,", translation: "Sevgili ailem, sevgili dostlar," },
            { t: 6.1, text: "vor einem Jahr haben wir Abschied genommen.", translation: "bir yıl önce vedalaştık." },
            { t: 9.9, text: "Damals waren wir sprachlos, und vieles, was wir sagen wollten, blieb ungesagt.", translation: "O gün dilimiz tutulmuştu, söylemek istediğimiz pek çok şey söylenmeden kaldı." },
            { t: 16.8, text: "Heute stehen wir wieder zusammen, nicht nur in Trauer, sondern auch in Dankbarkeit.", translation: "Bugün yeniden bir aradayız, yalnızca yasla değil, minnetle de." },
            { t: 28.7, text: "Ali Çınar war ein Mensch, der nicht viele Worte brauchte.", translation: "Ali Çınar çok söze ihtiyaç duymayan bir insandı." },
            { t: 33.6, text: "Er zeigte seine Liebe durch das, was er tat: durch harte Arbeit, durch Verlässlichkeit, durch ein offenes Haus für jeden, der kam.", translation: "Sevgisini yaptıklarıyla gösterirdi: alın teriyle, güvenilirliğiyle, gelen herkese açık olan kapısıyla." },
            { t: 44.8, text: "Er hat selten an sich gedacht und immer an uns.", translation: "Kendini nadiren düşünür, bizi ise hep düşünürdü." },
            { t: 53.9, text: "Er hat einmal gesagt: „Ömrümü yaşayamadan gittim.“", translation: "Bir keresinde şöyle demişti: „Ömrümü yaşayamadan gittim.“" },
            { t: 58.9, text: "Ich bin gegangen, ohne mein Leben gelebt zu haben.", translation: "Ömrümü yaşayamadan gittim." },
            { t: 63.9, text: "Dieser Satz tut weh.", translation: "Bu söz yüreğimizi yakıyor." },
            { t: 65.9, text: "Aber wenn wir uns heute hier umsehen, dann sehen wir, was er geschaffen hat.", translation: "Ama bugün etrafımıza baktığımızda, onun neler yarattığını görüyoruz." },
            { t: 73.5, text: "Wir sehen seine Kinder, seine Geschwister, seine Familie.", translation: "Çocuklarını, kardeşlerini, ailesini görüyoruz." },
            { t: 79.2, text: "Wir sehen die Werte, die er uns mitgegeben hat.", translation: "Bize kazandırdığı değerleri görüyoruz." },
            { t: 83.9, text: "Vielleicht hat er sein eigenes Leben nicht ganz gelebt, aber er hat es uns geschenkt.", translation: "Belki kendi ömrünü tam yaşayamadı, ama onu bize armağan etti." },
            { t: 102.0, text: "Seine Heimat Erzincan hat ihn zurückbekommen.", translation: "Memleketi Erzincan onu geri aldı." },
            { t: 108.4, text: "Wir aber tragen ihn mit uns, in jedem Gespräch, in jeder Erinnerung, in jedem Lachen, das an ihn erinnert.", translation: "Biz ise onu her sohbette, her anıda, onu hatırlatan her kahkahada yanımızda taşıyoruz." },
            { t: 129.0, text: "Lieber Ali, lieber Baba: Wir vergessen dich nicht.", translation: "Sevgili Ali, canım babam: Seni unutmayacağız." },
            { t: 139.7, text: "Devr-i Daim. Işıklar yoldaşın olsun.", translation: "Devr-i Daim. Işıklar yoldaşın olsun." }
          ]
        },
        tr: {
          src: "audio/rede-tr.m4a",
          segments: [
            { t: 2.0, text: "Sevgili ailemiz, değerli dostlar, canlar,", translation: "Liebe Familie, liebe Freunde, ihr Lieben," },
            { t: 9.0, text: "Bir yıl önce Ali Çınar'ı son yolculuğuna uğurladık.", translation: "Vor einem Jahr haben wir Ali Çınar auf seinem letzten Weg begleitet." },
            { t: 15.8, text: "O gün dilimiz tutulmuştu.", translation: "An jenem Tag fehlten uns die Worte." },
            { t: 19.3, text: "Söylemek istediğimiz nice söz yüreğimizde kaldı.", translation: "Vieles, was wir sagen wollten, blieb in unseren Herzen." },
            { t: 26.6, text: "Bugün yeniden bir aradayız, yalnızca hüzünle değil, minnetle de.", translation: "Heute sind wir wieder zusammen, nicht nur in Trauer, sondern auch in Dankbarkeit." },
            { t: 39.4, text: "Ali Çınar az konuşan, çok yapan bir insandı.", translation: "Ali Çınar war ein Mensch, der wenig sprach und viel tat." },
            { t: 45.9, text: "Sevgisini sözle değil, emeğiyle gösterdi.", translation: "Seine Liebe zeigte er nicht mit Worten, sondern mit seiner Arbeit." },
            { t: 54.2, text: "Alın teriyle, sözünün eri oluşuyla,", translation: "Mit dem Schweiß seiner Stirn, mit seiner Verlässlichkeit," },
            { t: 59.7, text: "kapısını gelen herkese açık tutan cömertliğiyle.", translation: "mit der Großzügigkeit, die seine Tür für jeden offen hielt." },
            { t: 66.6, text: "Kendini hep en sona koydu, önce bizi düşündü.", translation: "Sich selbst stellte er immer zuletzt, zuerst dachte er an uns." },
            { t: 75.3, text: "Bir gün şöyle demişti: „Ömrümü yaşayamadan gittim.“", translation: "Eines Tages sagte er: „Ich bin gegangen, ohne mein Leben gelebt zu haben.“" },
            { t: 81.2, text: "Bu söz hepimizin yüreğini yakıyor.", translation: "Dieser Satz brennt in unser aller Herzen." },
            { t: 87.4, text: "Ama bugün etrafımıza baktığımızda, geride neler bıraktığını görüyoruz.", translation: "Doch wenn wir uns heute umsehen, sehen wir, was er hinterlassen hat." },
            { t: 95.5, text: "Evlatlarını, kardeşlerini, koca bir aileyi görüyoruz.", translation: "Wir sehen seine Kinder, seine Geschwister, eine große Familie." },
            { t: 103.8, text: "Bize öğrettiği değerleri görüyoruz.", translation: "Wir sehen die Werte, die er uns mitgegeben hat." },
            { t: 109.9, text: "Belki kendi ömrünü doyasıya yaşayamadı,", translation: "Vielleicht konnte er sein eigenes Leben nicht in vollen Zügen leben," },
            { t: 117.0, text: "ama o ömrü bize armağan etti.", translation: "aber er hat es uns geschenkt." },
            { t: 126.5, text: "Doğduğu topraklar, Erzincan, onu bağrına bastı.", translation: "Erzincan, die Erde, in der er geboren wurde, hat ihn in ihre Arme geschlossen." },
            { t: 132.2, text: "Biz ise onu her sohbetimizde, her hatıramızda,", translation: "Wir aber tragen ihn in jedem Gespräch, in jeder Erinnerung" },
            { t: 146.3, text: "onu hatırlatan her gülüşte yanımızda taşıyoruz.", translation: "und in jedem Lachen, das an ihn erinnert, mit uns." },
            { t: 156.1, text: "Ali'miz, babamız, kardeşimiz,", translation: "Unser Ali, unser Vater, unser Bruder," },
            { t: 167.2, text: "seni hiç unutmayacağız.", translation: "wir werden dich niemals vergessen." },
            { t: 174.2, text: "Devr-i daim olsun.", translation: "Devr-i Daim." },
            { t: 179.1, text: "Işıklar yoldaşın olsun.", translation: "Mögen die Lichter dich begleiten." }
          ]
        }
      }
    }
  ],

  gallery: [
    { src: "images/garten-sonnenuntergang.jpg", caption: { de: "Auf der Hochzeit in Frankfurt", tr: "Frankfurt'taki düğünde" } },
    { video: "video/erinnerung.mp4", src: "video/erinnerung-poster.jpg", caption: { de: "Ein kleiner Moment", tr: "Küçük bir an" } },
    { src: "images/einschulung.jpg", caption: { de: "Einschulung", tr: "Okulun ilk günü" } },
    { src: "images/mit-der-kleinen.jpg", caption: { de: "Gemeinsam gemütlich", tr: "Birlikte, huzurla" } },
    { src: "images/auf-dem-sofa.jpg", caption: { de: "Mit den Kleinsten", tr: "En küçüklerle" } },
    { src: "images/mit-dem-baby.jpg", caption: { de: "Willkommen auf der Welt", tr: "Dünyaya hoş geldin" } }
  ],

  family: { de: "Devr-i Daim. Işıklar yoldaşın olsun. Die Familie Çınar", tr: "Devr-i Daim. Işıklar yoldaşın olsun. Çınar Ailesi" }
};

/* Oberflächentexte */
window.UI = {
  de: {
    navYear: "Jahrestag", navLife: "Leben", navMemories: "Erinnerungen", navWords: "Worte", navGallery: "Bilder", navBook: "Gedenkbuch",
    inMemory: "In liebendem Gedenken an", speechLink: "Gedenkrede anhören",
    lightCandle: "Licht anzünden", scroll: "Weiter",
    lifeEyebrow: "Sein Weg", lifeTitle: "Ein Leben voller Wärme",
    memEyebrow: "Was uns zum Lächeln bringt", memTitle: "Fröhliche Erinnerungen",
    wordsEyebrow: "Gesprochen mit Liebe", wordsTitle: "Worte für ihn",
    showTranslation: "Übersetzung zeigen", audioMissing: "Aufnahme folgt",
    galleryEyebrow: "Momente", galleryTitle: "Bilder aus seinem Leben", photoSoon: "Foto folgt",
    candlesEyebrow: "Ein Licht für Ali", candlesTitle: "Lichter", candlesCount: (n) => n === 1 ? "1 Licht brennt" : `${n} Lichter brennen`,
    candleNameLabel: "Ihr Name (optional)", candleConfirm: "Anzünden", cancel: "Abbrechen", candleThanks: "Ihr Licht brennt. Danke.",
    bookEyebrow: "Gedenkbuch", bookTitle: "Teilen Sie eine Erinnerung",
    bookIntro: "Ihr Eintrag erscheint sofort. Bitte bleiben Sie respektvoll, Links sind nicht möglich.",
    fName: "Name", fRelation: "Verbindung (z. B. Neffe, Nachbar, Kollege)", fMessage: "Ihre Worte", fSubmit: "Eintrag senden",
    fConsent: "Ich bin einverstanden, dass mein Eintrag auf dieser Seite veröffentlicht wird. Mehr dazu in der", privacy: "Datenschutzerklärung", imprint: "Impressum", fNoConsent: "Bitte bestätigen Sie die Einwilligung.",
    fSending: "Wird gesendet …", fThanks: "Danke für Ihre Worte.",
    fError: "Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut.", fRejected: "Nicht gespeichert. Bitte warten Sie kurz zwischen zwei Beiträgen und verzichten Sie auf Links.",
    fTooShort: "Bitte schreiben Sie ein paar Worte.",
    noEntries: "Noch keine Einträge. Sie können den ersten schreiben.",
    music: "Musik", musicOn: "Musik pausieren", musicOff: "Musik abspielen",
    demo: "Vorschau: Einträge werden noch nicht gespeichert."
  },
  tr: {
    navYear: "Yıl dönümü", navLife: "Hayatı", navMemories: "Anılar", navWords: "Sözler", navGallery: "Fotoğraflar", navBook: "Anı Defteri",
    inMemory: "Sevgiyle anıyoruz", speechLink: "Anma konuşmasını dinle",
    lightCandle: "Çerağ uyandır", scroll: "Devam",
    lifeEyebrow: "Yolculuğu", lifeTitle: "Sıcaklıkla dolu bir hayat",
    memEyebrow: "Bizi gülümseten", memTitle: "Neşeli anılar",
    wordsEyebrow: "Sevgiyle söylenenler", wordsTitle: "Onun için sözler",
    showTranslation: "Çeviriyi göster", audioMissing: "Kayıt yakında",
    galleryEyebrow: "Anlar", galleryTitle: "Hayatından kareler", photoSoon: "Fotoğraf yakında",
    candlesEyebrow: "Ali için bir ışık", candlesTitle: "Çerağlar", candlesCount: (n) => `${n} çerağ yanıyor`,
    candleNameLabel: "Adınız (isteğe bağlı)", candleConfirm: "Uyandır", cancel: "Vazgeç", candleThanks: "Çerağınız yanıyor. Teşekkürler.",
    bookEyebrow: "Anı Defteri", bookTitle: "Bir anınızı paylaşın",
    bookIntro: "Yazınız hemen yayınlanır. Lütfen saygılı olun, bağlantı eklenemez.",
    fName: "İsim", fRelation: "Yakınlık (ör. yeğen, komşu, iş arkadaşı)", fMessage: "Sözleriniz", fSubmit: "Gönder",
    fConsent: "Yazımın bu sayfada yayınlanmasını kabul ediyorum. Ayrıntılar:", privacy: "Gizlilik bildirimi (Almanca)", imprint: "Künye", fNoConsent: "Lütfen onay kutusunu işaretleyin.",
    fSending: "Gönderiliyor …", fThanks: "Güzel sözleriniz için teşekkürler.",
    fError: "Maalesef olmadı. Lütfen daha sonra tekrar deneyin.", fRejected: "Kaydedilmedi. Lütfen iki yazı arasında biraz bekleyin ve bağlantı eklemeyin.",
    fTooShort: "Lütfen birkaç kelime yazın.",
    noEntries: "Henüz yazı yok. İlk yazan siz olabilirsiniz.",
    music: "Müzik", musicOn: "Müziği durdur", musicOff: "Müziği çal",
    demo: "Önizleme: yazılar henüz kaydedilmiyor."
  }
};
