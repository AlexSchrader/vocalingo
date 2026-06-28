// Unit 7 — かず・じかん ("Numbers & Time") — first A1 thematic unit
// With both kana scripts done (Units 1-6), the curriculum shifts from learning
// shapes to learning words. This is the first A1-stage unit: native vocab written
// in kana, example sentences built only from grammar the learner already has
// (は/を/が/に/で/の + です/ます, plus the fixed question frames なんですか /
// どこですか / なんじですか). No new card kinds — these are vocab items.
// Theme: count 0-10,000, tell the time, and name parts of the day.
// lang/unit/lesson stamped in index.js.
export const UNIT7 = {
  id: "ja-u7",
  lang: "ja",
  title: "かず・じかん",
  order: 7,
  stage: "a1",
  lessons: [
    // Lesson 1: numbers 0-5
    {
      id: "ja-u7l1",
      unit: 7,
      lesson: 1,
      title: "Numbers 1–5",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Count from zero to five in Japanese: ぜろ いち に さん よん ご.",
      items: [
        { id: "ja-u7l1-ichi", type: "vocab", front: "いち", reading: "ichi", meaning: "one",   example: { jp: "いち、に、さん。",     en: "One, two, three." },   accept: ["1"] },
        { id: "ja-u7l1-ni",   type: "vocab", front: "に",   reading: "ni",   meaning: "two",   example: { jp: "に、さん、よん。",     en: "Two, three, four." },  accept: ["2"] },
        { id: "ja-u7l1-san",  type: "vocab", front: "さん", reading: "san",  meaning: "three", example: { jp: "さん、よん、ご。",     en: "Three, four, five." }, accept: ["3"] },
        { id: "ja-u7l1-yon",  type: "vocab", front: "よん", reading: "yon",  meaning: "four",  example: { jp: "よん、ご、ろく。",     en: "Four, five, six." },   accept: ["4", "shi"] },
        { id: "ja-u7l1-go",   type: "vocab", front: "ご",   reading: "go",   meaning: "five",  example: { jp: "ご、ろく、なな。",     en: "Five, six, seven." },  accept: ["5"] },
        { id: "ja-u7l1-zero", type: "vocab", front: "ぜろ", reading: "zero", meaning: "zero",  example: { jp: "ぜろ、いち、に。",     en: "Zero, one, two." },    accept: ["0", "rei", "nought"] },
      ],
    },
    // Lesson 2: numbers 6-10
    {
      id: "ja-u7l2",
      unit: 7,
      lesson: 2,
      title: "Numbers 6–10",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Count from six to ten: ろく なな はち きゅう じゅう.",
      items: [
        { id: "ja-u7l2-roku", type: "vocab", front: "ろく",   reading: "roku", meaning: "six",   example: { jp: "ろく、なな、はち。",   en: "Six, seven, eight." },   accept: ["6"] },
        { id: "ja-u7l2-nana", type: "vocab", front: "なな",   reading: "nana", meaning: "seven", example: { jp: "なな、はち、きゅう。", en: "Seven, eight, nine." },  accept: ["7", "shichi"] },
        { id: "ja-u7l2-hachi", type: "vocab", front: "はち",  reading: "hachi", meaning: "eight", example: { jp: "はち、きゅう、じゅう。", en: "Eight, nine, ten." },  accept: ["8"] },
        { id: "ja-u7l2-kyu",  type: "vocab", front: "きゅう", reading: "kyū",  meaning: "nine",  example: { jp: "なな、はち、きゅう。", en: "Seven, eight, nine." },  accept: ["9", "ku"] },
        { id: "ja-u7l2-ju",   type: "vocab", front: "じゅう", reading: "jū",   meaning: "ten",   example: { jp: "はち、きゅう、じゅう。", en: "Eight, nine, ten." },  accept: ["10"] },
        { id: "ja-u7l2-kazu", type: "vocab", front: "かず",   reading: "kazu", meaning: "number", example: { jp: "すきなかずはなんですか。", en: "What's your favorite number?" }, accept: ["count", "numbers"] },
      ],
    },
    // Lesson 3: bigger numbers + money (えん)
    {
      id: "ja-u7l3",
      unit: 7,
      lesson: 3,
      title: "Bigger numbers",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read tens, hundreds, thousands and prices in yen (えん).",
      items: [
        { id: "ja-u7l3-juichi", type: "vocab", front: "じゅういち", reading: "jūichi", meaning: "eleven", example: { jp: "じゅう、じゅういち、じゅうに。", en: "Ten, eleven, twelve." }, accept: ["11"] },
        { id: "ja-u7l3-niju",   type: "vocab", front: "にじゅう",   reading: "nijū",   meaning: "twenty", example: { jp: "じゅう、にじゅう、さんじゅう。", en: "Ten, twenty, thirty." }, accept: ["20"] },
        { id: "ja-u7l3-hyaku",  type: "vocab", front: "ひゃく",     reading: "hyaku",  meaning: "hundred", example: { jp: "これはひゃくえんです。", en: "This is 100 yen." }, accept: ["100", "one hundred"] },
        { id: "ja-u7l3-sen",    type: "vocab", front: "せん",       reading: "sen",    meaning: "thousand", example: { jp: "せんえんです。", en: "It's 1,000 yen." }, accept: ["1000", "one thousand"] },
        { id: "ja-u7l3-man",    type: "vocab", front: "まん",       reading: "man",    meaning: "ten thousand", example: { jp: "いちまんえんです。", en: "It's 10,000 yen." }, accept: ["10000", "10,000"] },
        { id: "ja-u7l3-en",     type: "vocab", front: "えん",       reading: "en",     meaning: "yen", example: { jp: "ごひゃくえんです。", en: "It's 500 yen." }, accept: ["yen (currency)", "japanese yen"] },
      ],
    },
    // Lesson 4: telling the time
    {
      id: "ja-u7l4",
      unit: 7,
      lesson: 4,
      title: "Telling time",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Tell the time with じ (o'clock), ふん (minutes), はん (half past), ごぜん/ごご (a.m./p.m.).",
      items: [
        { id: "ja-u7l4-ji",    type: "vocab", front: "じ",     reading: "ji",    meaning: "o'clock", example: { jp: "いま、さんじです。", en: "It's 3 o'clock now." }, accept: ["hour", "hours"] },
        { id: "ja-u7l4-fun",   type: "vocab", front: "ふん",   reading: "fun",   meaning: "minute", example: { jp: "ごふんです。", en: "It's five minutes." }, accept: ["minutes", "pun"] },
        { id: "ja-u7l4-ima",   type: "vocab", front: "いま",   reading: "ima",   meaning: "now",    example: { jp: "いま、なんじですか。", en: "What time is it now?" }, accept: ["right now"] },
        { id: "ja-u7l4-han",   type: "vocab", front: "はん",   reading: "han",   meaning: "half past", example: { jp: "しちじはんです。", en: "It's half past seven." }, accept: ["half", "thirty (minutes)"] },
        { id: "ja-u7l4-gozen", type: "vocab", front: "ごぜん", reading: "gozen", meaning: "a.m.",   example: { jp: "ごぜんくじです。", en: "It's 9 a.m." }, accept: ["morning", "am"] },
        { id: "ja-u7l4-gogo",  type: "vocab", front: "ごご",   reading: "gogo",  meaning: "p.m.",   example: { jp: "ごごさんじです。", en: "It's 3 p.m." }, accept: ["afternoon", "pm"] },
      ],
    },
    // Lesson 5: days & parts of the day
    {
      id: "ja-u7l5",
      unit: 7,
      lesson: 5,
      title: "Today & the day",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Say きょう/あした/きのう and name parts of the day (あさ ひる ばん).",
      items: [
        { id: "ja-u7l5-kyo",    type: "vocab", front: "きょう", reading: "kyō",    meaning: "today",     example: { jp: "きょうはやすみです。", en: "Today is a day off." }, accept: [] },
        { id: "ja-u7l5-ashita", type: "vocab", front: "あした", reading: "ashita", meaning: "tomorrow",  example: { jp: "あした、がっこうにいきます。", en: "Tomorrow I go to school." }, accept: [] },
        { id: "ja-u7l5-kino",   type: "vocab", front: "きのう", reading: "kinō",   meaning: "yesterday", example: { jp: "きのうと きょう。", en: "Yesterday and today." }, accept: [] },
        { id: "ja-u7l5-asa",    type: "vocab", front: "あさ",   reading: "asa",    meaning: "morning",   example: { jp: "あさ、コーヒーをのみます。", en: "In the morning I drink coffee." }, accept: ["the morning"] },
        { id: "ja-u7l5-hiru",   type: "vocab", front: "ひる",   reading: "hiru",   meaning: "noon",      example: { jp: "ひるにたべます。", en: "I eat at noon." }, accept: ["midday", "daytime", "lunchtime"] },
        { id: "ja-u7l5-ban",    type: "vocab", front: "ばん",   reading: "ban",    meaning: "evening",   example: { jp: "こんばんは。", en: "Good evening." }, accept: ["night"] },
      ],
    },
  ],
};
