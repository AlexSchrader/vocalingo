// Unit 11 — かんじ ("Kanji"), first set — A1 / JLPT N5 starter kanji
// The first kanji: numbers 一–十, the day/nature set 日月火水木金土 (also the days
// of the week) + 山川田, and people/position 人大小中上下. These are `type: "kanji"`
// items — a glyph that carries MEANING: recognition/recall test the meaning (the
// reading is shown for reference), production is stroke tracing. Examples reuse
// known grammar and show the kanji in light context. KanjiVG stroke data added
// for all 26. lang/unit/lesson stamped in index.js.
export const UNIT11 = {
  id: "ja-u11",
  lang: "ja",
  title: "かんじ",
  order: 11,
  stage: "a1",
  lessons: [
    // Lesson 1: numbers 一–五
    {
      id: "ja-u11l1",
      unit: 11,
      lesson: 1,
      title: "Kanji 1–5",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the number kanji 一 二 三 四 五.",
      items: [
        { id: "ja-u11l1-1", type: "kanji", front: "一", reading: "ichi", meaning: "one",   example: { jp: "一、二、三。", en: "One, two, three." },  accept: ["1"] },
        { id: "ja-u11l1-2", type: "kanji", front: "二", reading: "ni",   meaning: "two",   example: { jp: "二、三、四。", en: "Two, three, four." },  accept: ["2"] },
        { id: "ja-u11l1-3", type: "kanji", front: "三", reading: "san",  meaning: "three", example: { jp: "三、四、五。", en: "Three, four, five." }, accept: ["3"] },
        { id: "ja-u11l1-4", type: "kanji", front: "四", reading: "yon",  meaning: "four",  example: { jp: "四、五、六。", en: "Four, five, six." },   accept: ["4", "shi"] },
        { id: "ja-u11l1-5", type: "kanji", front: "五", reading: "go",   meaning: "five",  example: { jp: "五、六、七。", en: "Five, six, seven." },  accept: ["5"] },
      ],
    },
    // Lesson 2: numbers 六–十
    {
      id: "ja-u11l2",
      unit: 11,
      lesson: 2,
      title: "Kanji 6–10",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the number kanji 六 七 八 九 十.",
      items: [
        { id: "ja-u11l2-6",  type: "kanji", front: "六", reading: "roku", meaning: "six",   example: { jp: "六、七、八。",     en: "Six, seven, eight." }, accept: ["6"] },
        { id: "ja-u11l2-7",  type: "kanji", front: "七", reading: "nana", meaning: "seven", example: { jp: "七、八、九。",     en: "Seven, eight, nine." }, accept: ["7", "shichi"] },
        { id: "ja-u11l2-8",  type: "kanji", front: "八", reading: "hachi", meaning: "eight", example: { jp: "八、九、十。",    en: "Eight, nine, ten." },   accept: ["8"] },
        { id: "ja-u11l2-9",  type: "kanji", front: "九", reading: "kyū",  meaning: "nine",  example: { jp: "七、八、九。",     en: "Seven, eight, nine." }, accept: ["9", "ku"] },
        { id: "ja-u11l2-10", type: "kanji", front: "十", reading: "jū",   meaning: "ten",   example: { jp: "十、十一、十二。", en: "Ten, eleven, twelve." }, accept: ["10"] },
      ],
    },
    // Lesson 3: days of the week / nature — 日 月 火 水 木
    {
      id: "ja-u11l3",
      unit: 11,
      lesson: 3,
      title: "Sun, moon, nature",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read 日 月 火 水 木 — the first half of the days of the week.",
      items: [
        { id: "ja-u11l3-hi",   type: "kanji", front: "日", reading: "nichi", meaning: "sun",  example: { jp: "きょうはいい日です。", en: "Today is a nice day." }, accept: ["day"] },
        { id: "ja-u11l3-tsuki", type: "kanji", front: "月", reading: "getsu", meaning: "moon", example: { jp: "月をみます。",         en: "I look at the moon." },  accept: ["month"] },
        { id: "ja-u11l3-hicha", type: "kanji", front: "火", reading: "ka",    meaning: "fire", example: { jp: "これは火です。",       en: "This is fire." },        accept: [] },
        { id: "ja-u11l3-mizu", type: "kanji", front: "水", reading: "sui",   meaning: "water", example: { jp: "水をのみます。",       en: "I drink water." },       accept: [] },
        { id: "ja-u11l3-ki",   type: "kanji", front: "木", reading: "moku",  meaning: "tree", example: { jp: "木をみます。",         en: "I look at the tree." },  accept: ["wood"] },
      ],
    },
    // Lesson 4: nature 2 — 金 土 山 川 田
    {
      id: "ja-u11l4",
      unit: 11,
      lesson: 4,
      title: "Gold, earth, land",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read 金 土 山 川 田 — completing the days of the week (金 Fri, 土 Sat).",
      items: [
        { id: "ja-u11l4-kin",  type: "kanji", front: "金", reading: "kin",  meaning: "gold", example: { jp: "金がすきです。",     en: "I like gold." },          accept: ["money"] },
        { id: "ja-u11l4-tsuchi", type: "kanji", front: "土", reading: "do",  meaning: "soil", example: { jp: "これは土です。",     en: "This is soil." },         accept: ["earth", "dirt", "ground"] },
        { id: "ja-u11l4-yama", type: "kanji", front: "山", reading: "yama", meaning: "mountain", example: { jp: "山にいきます。", en: "I go to the mountain." }, accept: ["mountains"] },
        { id: "ja-u11l4-kawa", type: "kanji", front: "川", reading: "kawa", meaning: "river", example: { jp: "川にいきます。",     en: "I go to the river." },    accept: ["rivers"] },
        { id: "ja-u11l4-ta",   type: "kanji", front: "田", reading: "ta",   meaning: "rice field", example: { jp: "田があります。", en: "There is a rice field." }, accept: ["field", "paddy", "rice paddy"] },
      ],
    },
    // Lesson 5: people & position — 人 大 小 中 上 下
    {
      id: "ja-u11l5",
      unit: 11,
      lesson: 5,
      title: "People & position",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read 人 大 小 中 上 下 — person, big/small, and middle/up/down.",
      items: [
        { id: "ja-u11l5-hito", type: "kanji", front: "人", reading: "hito", meaning: "person", example: { jp: "あの人です。",         en: "That's that person." }, accept: ["people"] },
        { id: "ja-u11l5-dai",  type: "kanji", front: "大", reading: "dai",  meaning: "big",    example: { jp: "大きいです。",         en: "It's big." },           accept: ["large"] },
        { id: "ja-u11l5-sho",  type: "kanji", front: "小", reading: "shō",  meaning: "small",  example: { jp: "小さいです。",         en: "It's small." },         accept: ["little"] },
        { id: "ja-u11l5-naka", type: "kanji", front: "中", reading: "naka", meaning: "middle", example: { jp: "いえの中です。",       en: "It's inside the house." }, accept: ["inside", "center"] },
        { id: "ja-u11l5-ue",   type: "kanji", front: "上", reading: "ue",   meaning: "up",     example: { jp: "テーブルの上です。",   en: "It's on the table." },  accept: ["above", "top", "on"] },
        { id: "ja-u11l5-shita", type: "kanji", front: "下", reading: "shita", meaning: "down", example: { jp: "木の下です。",         en: "It's under the tree." }, accept: ["below", "under", "bottom"] },
      ],
    },
  ],
};
