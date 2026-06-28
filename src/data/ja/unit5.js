// Unit 5 — カタカナ part 2
// Completes the base katakana script. Unit 4 covered vowels + k/s/t/n; this unit
// finishes the rest: h / m / y / r / w rows + ン. Same approach as Unit 4 — every
// glyph already has a known sound from the hiragana of Units 1-2, so each hint
// anchors the new katakana to its hiragana twin plus a shape cue. Vocab stays in
// recognizable loanwords; example sentences reuse only grammar from Units 1-3
// (をたべます / がすきです / にいきます / はどこですか …). With this unit the learner
// can read any all-kana Japanese text. lang/unit/lesson stamped in index.js.
export const UNIT5 = {
  id: "ja-u5",
  lang: "ja",
  title: "カタカナ 2",
  order: 5,
  stage: "pre-a1",
  lessons: [
    // Lesson 1: h-row ハ ヒ フ ヘ ホ
    {
      id: "ja-u5l1",
      unit: 5,
      lesson: 1,
      title: "Katakana h-row",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana h-row ハ ヒ フ ヘ ホ; note that ヘ looks identical to hiragana へ.",
      items: [
        { id: "ja-u5l1-ha", type: "kana", front: "ハ", reading: "ha", meaning: null, example: null, hint: "ハ = 'ha', twin of は. Two strokes leaning apart like an open tent — same HA." },
        { id: "ja-u5l1-hi", type: "kana", front: "ヒ", reading: "hi", meaning: null, example: null, hint: "ヒ = 'hi', twin of ひ. A short stroke crossed by a long one that hooks up — same HI." },
        { id: "ja-u5l1-fu", type: "kana", front: "フ", reading: "fu", meaning: null, example: null, hint: "フ = 'fu', twin of ふ. A single bent stroke — like just the top corner of ふ. Same FU." },
        { id: "ja-u5l1-he", type: "kana", front: "ヘ", reading: "he", meaning: null, example: null, hint: "ヘ = 'he', twin of へ — and it's the SAME shape. へ is the one kana that looks identical in hiragana and katakana. Same HE." },
        { id: "ja-u5l1-ho", type: "kana", front: "ホ", reading: "ho", meaning: null, example: null, hint: "ホ = 'ho', twin of ほ. A cross with two short legs at the bottom — same HO." },
        { id: "ja-u5l1-hoteru",   type: "vocab", front: "ホテル",     reading: "hoteru",   meaning: "hotel",   example: { jp: "ホテルにいきます。",     en: "I go to the hotel." },     accept: ["hotels"] },
        { id: "ja-u5l1-hamu",     type: "vocab", front: "ハム",       reading: "hamu",     meaning: "ham",     example: { jp: "ハムをたべます。",       en: "I eat ham." },             accept: [] },
        { id: "ja-u5l1-foku",     type: "vocab", front: "フォーク",   reading: "fōku",     meaning: "fork",    example: { jp: "フォークがあります。",   en: "There is a fork." },       accept: ["forks"] },
        { id: "ja-u5l1-hita",     type: "vocab", front: "ヒーター",   reading: "hītā",     meaning: "heater",  example: { jp: "ヒーターをつけます。",   en: "I turn on the heater." },  accept: ["heaters"] },
        { id: "ja-u5l1-homu",     type: "vocab", front: "ホーム",     reading: "hōmu",     meaning: "platform", example: { jp: "ホームはどこですか。",   en: "Where is the platform?" }, accept: ["the platform", "train platform"] },
        { id: "ja-u5l1-herumetto", type: "vocab", front: "ヘルメット", reading: "herumetto", meaning: "helmet", example: { jp: "ヘルメットがあります。", en: "There is a helmet." },      accept: ["helmets"] },
      ],
    },
    // Lesson 2: m-row マ ミ ム メ モ
    {
      id: "ja-u5l2",
      unit: 5,
      lesson: 2,
      title: "Katakana m-row",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana m-row マ ミ ム メ モ; tell メ apart from ヌ.",
      items: [
        { id: "ja-u5l2-ma", type: "kana", front: "マ", reading: "ma", meaning: null, example: null, hint: "マ = 'ma', twin of ま. A curve crossed by a downward sweep — same MA." },
        { id: "ja-u5l2-mi", type: "kana", front: "ミ", reading: "mi", meaning: null, example: null, hint: "ミ = 'mi', twin of み. Three short strokes stacked — like the number three tipped on its side. Same MI." },
        { id: "ja-u5l2-mu", type: "kana", front: "ム", reading: "mu", meaning: null, example: null, hint: "ム = 'mu', twin of む. A small stroke beside a wide hook — same MU." },
        { id: "ja-u5l2-me", type: "kana", front: "メ", reading: "me", meaning: null, example: null, hint: "メ = 'me', twin of め. Two strokes crossing like an X — same ME. (Look-alike ヌ adds a third sweeping tail; メ has none.)" },
        { id: "ja-u5l2-mo", type: "kana", front: "モ", reading: "mo", meaning: null, example: null, hint: "モ = 'mo', twin of も. A crossbar over a hook — basically も simplified. Same MO." },
        { id: "ja-u5l2-menyu",  type: "vocab", front: "メニュー", reading: "menyū",  meaning: "menu",  example: { jp: "メニューをみます。",     en: "I look at the menu." },   accept: ["menus"] },
        { id: "ja-u5l2-miruku", type: "vocab", front: "ミルク",   reading: "miruku", meaning: "milk",  example: { jp: "ミルクをのみます。",     en: "I drink milk." },         accept: [] },
        { id: "ja-u5l2-masuku", type: "vocab", front: "マスク",   reading: "masuku", meaning: "mask",  example: { jp: "マスクをします。",       en: "I wear a mask." },        accept: ["masks", "face mask"] },
        { id: "ja-u5l2-memo",   type: "vocab", front: "メモ",     reading: "memo",   meaning: "memo",  example: { jp: "メモをかきます。",       en: "I write a memo." },       accept: ["note", "notes", "memos"] },
        { id: "ja-u5l2-kurimu", type: "vocab", front: "クリーム", reading: "kurīmu", meaning: "cream", example: { jp: "クリームがすきです。",   en: "I like cream." },         accept: [] },
        { id: "ja-u5l2-maiku",  type: "vocab", front: "マイク",   reading: "maiku",  meaning: "microphone", example: { jp: "マイクがあります。", en: "There is a microphone." }, accept: ["mic", "mics", "microphones"] },
      ],
    },
    // Lesson 3: y-row ヤ ユ ヨ (short row — like や ゆ よ in hiragana)
    {
      id: "ja-u5l3",
      unit: 5,
      lesson: 3,
      title: "Katakana y-row",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana y-row ヤ ユ ヨ; three glyphs, just like や ゆ よ.",
      items: [
        { id: "ja-u5l3-ya", type: "kana", front: "ヤ", reading: "ya", meaning: null, example: null, hint: "ヤ = 'ya', twin of や. Same YA sound." },
        { id: "ja-u5l3-yu", type: "kana", front: "ユ", reading: "yu", meaning: null, example: null, hint: "ユ = 'yu', twin of ゆ. A small hook sitting on a baseline — same YU." },
        { id: "ja-u5l3-yo", type: "kana", front: "ヨ", reading: "yo", meaning: null, example: null, hint: "ヨ = 'yo', twin of よ. Like a backwards capital E — three bars off a spine. Same YO." },
        { id: "ja-u5l3-taiya",      type: "vocab", front: "タイヤ",       reading: "taiya",      meaning: "tire",   example: { jp: "タイヤがあります。",     en: "There is a tire." },     accept: ["tyre", "tires", "tyres"] },
        { id: "ja-u5l3-yotto",      type: "vocab", front: "ヨット",       reading: "yotto",      meaning: "yacht",  example: { jp: "ヨットがすきです。",     en: "I like yachts." },       accept: ["yachts", "sailboat"] },
        { id: "ja-u5l3-yunifomu",   type: "vocab", front: "ユニフォーム", reading: "yunifōmu",   meaning: "uniform", example: { jp: "ユニフォームをきます。", en: "I wear a uniform." },    accept: ["uniforms"] },
        { id: "ja-u5l3-kureyon",    type: "vocab", front: "クレヨン",     reading: "kureyon",    meaning: "crayon", example: { jp: "クレヨンをつかいます。", en: "I use a crayon." },      accept: ["crayons"] },
        { id: "ja-u5l3-iyahon",     type: "vocab", front: "イヤホン",     reading: "iyahon",     meaning: "earphones", example: { jp: "イヤホンをします。",   en: "I put on earphones." },  accept: ["earphone", "earbuds", "headphones"] },
      ],
    },
    // Lesson 4: r-row ラ リ ル レ ロ
    {
      id: "ja-u5l4",
      unit: 5,
      lesson: 4,
      title: "Katakana r-row",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana r-row ラ リ ル レ ロ; tell the closed box ロ from the open コ.",
      items: [
        { id: "ja-u5l4-ra", type: "kana", front: "ラ", reading: "ra", meaning: null, example: null, hint: "ラ = 'ra', twin of ら. A short top stroke over a hook — same RA." },
        { id: "ja-u5l4-ri", type: "kana", front: "リ", reading: "ri", meaning: null, example: null, hint: "リ = 'ri', twin of り. Two strokes side by side — almost the same as hiragana り. Same RI." },
        { id: "ja-u5l4-ru", type: "kana", front: "ル", reading: "ru", meaning: null, example: null, hint: "ル = 'ru', twin of る. Two strokes, the right one curling up — same RU." },
        { id: "ja-u5l4-re", type: "kana", front: "レ", reading: "re", meaning: null, example: null, hint: "レ = 're', twin of れ. A single check-mark stroke — same RE." },
        { id: "ja-u5l4-ro", type: "kana", front: "ロ", reading: "ro", meaning: null, example: null, hint: "ロ = 'ro', twin of ろ. A closed square. (Compare コ 'ko', which is open on the right — ロ is sealed shut.)" },
        { id: "ja-u5l4-raisu",     type: "vocab", front: "ライス",     reading: "raisu",     meaning: "rice",   example: { jp: "ライスをたべます。",     en: "I eat rice." },          accept: [] },
        { id: "ja-u5l4-remon",     type: "vocab", front: "レモン",     reading: "remon",     meaning: "lemon",  example: { jp: "レモンをたべます。",     en: "I eat a lemon." },       accept: ["lemons"] },
        { id: "ja-u5l4-meron",     type: "vocab", front: "メロン",     reading: "meron",     meaning: "melon",  example: { jp: "メロンがすきです。",     en: "I like melon." },        accept: ["melons"] },
        { id: "ja-u5l4-ruru",      type: "vocab", front: "ルール",     reading: "rūru",      meaning: "rule",   example: { jp: "ルールがあります。",     en: "There is a rule." },     accept: ["rules"] },
        { id: "ja-u5l4-risuto",    type: "vocab", front: "リスト",     reading: "risuto",    meaning: "list",   example: { jp: "リストをみます。",       en: "I look at the list." },  accept: ["lists"] },
        { id: "ja-u5l4-resutoran", type: "vocab", front: "レストラン", reading: "resutoran", meaning: "restaurant", example: { jp: "レストランにいきます。", en: "I go to the restaurant." }, accept: ["restaurants"] },
      ],
    },
    // Lesson 5: w-row ワ ヲ ン — finishes katakana. ヲ is essentially unused in
    // modern writing (the particle を is always hiragana), taught for completeness.
    {
      id: "ja-u5l5",
      unit: 5,
      lesson: 5,
      title: "Katakana ワ ヲ ン",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read ワ ヲ ン and finish the katakana script; tell ン apart from ソ and シ.",
      items: [
        { id: "ja-u5l5-wa", type: "kana", front: "ワ", reading: "wa", meaning: null, example: null, hint: "ワ = 'wa', twin of わ. An open box with a leg — same WA. (Compare ウ 'u', which has a small roof on top; ワ has none.)" },
        { id: "ja-u5l5-wo", type: "kana", front: "ヲ", reading: "wo", meaning: null, example: null, hint: "ヲ = 'wo', the katakana twin of を. You'll almost never see it — the particle を is always written in hiragana — but recognize it. Same O sound." },
        { id: "ja-u5l5-n",  type: "kana", front: "ン", reading: "n",  meaning: null, example: null, hint: "ン = 'n', twin of ん — the only katakana for a lone consonant. A short tick plus a stroke sweeping UP from the bottom-left. (Compare ソ 'so', whose stroke drops down, and シ 'shi', which has two ticks — ン has one.)" },
        { id: "ja-u5l5-wain",      type: "vocab", front: "ワイン",     reading: "wain",      meaning: "wine",  example: { jp: "ワインをのみます。",     en: "I drink wine." },        accept: ["wines"] },
        { id: "ja-u5l5-waishatsu", type: "vocab", front: "ワイシャツ", reading: "waishatsu", meaning: "dress shirt", example: { jp: "ワイシャツをきます。", en: "I wear a dress shirt." }, accept: ["shirt", "shirts", "white shirt"] },
        { id: "ja-u5l5-waffuru",   type: "vocab", front: "ワッフル",   reading: "waffuru",   meaning: "waffle", example: { jp: "ワッフルをたべます。",   en: "I eat a waffle." },      accept: ["waffles"] },
        { id: "ja-u5l5-airon",     type: "vocab", front: "アイロン",   reading: "airon",     meaning: "iron",  example: { jp: "アイロンがあります。",   en: "There is an iron." },    accept: ["clothes iron", "irons"] },
        { id: "ja-u5l5-sain",      type: "vocab", front: "サイン",     reading: "sain",      meaning: "signature", example: { jp: "サインをします。",     en: "I sign (give a signature)." }, accept: ["sign", "autograph"] },
        { id: "ja-u5l5-koin",      type: "vocab", front: "コイン",     reading: "koin",      meaning: "coin",  example: { jp: "コインがあります。",     en: "There is a coin." },     accept: ["coins"] },
      ],
    },
  ],
};
