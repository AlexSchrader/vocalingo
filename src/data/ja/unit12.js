// Unit 12 — いろ・てんき ("Colors & Weather") — A1 thematic
// Colors (noun + い-adjective forms), weather, temperature, and the four seasons.
// Vocab-only (no kanji dependency), so it can be authored in parallel with the
// kanji item type. Example sentences stay inside known grammar (は/が/を/の +
// です/ます + すきな…／なんですか) and reuse earlier vocab. Teaches the noun-vs-
// adjective color split (あか "red" / あかい "is red"). lang/unit/lesson in index.js.
export const UNIT12 = {
  id: "ja-u12",
  lang: "ja",
  title: "いろ・てんき",
  order: 12,
  stage: "a1",
  lessons: [
    // Lesson 1: basic colors (nouns)
    {
      id: "ja-u12l1",
      unit: 12,
      lesson: 1,
      title: "Colors",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name basic colors: あか あお きいろ くろ みどり, and ask someone's favorite いろ.",
      items: [
        { id: "ja-u12l1-aka",    type: "vocab", front: "あか",   reading: "aka",    meaning: "red",    example: { jp: "あかがすきです。",       en: "I like red." },          accept: ["the color red"] },
        { id: "ja-u12l1-ao",     type: "vocab", front: "あお",   reading: "ao",     meaning: "blue",   example: { jp: "そらはあおです。",       en: "The sky is blue." },     accept: [] },
        { id: "ja-u12l1-kiiro",  type: "vocab", front: "きいろ", reading: "kiiro",  meaning: "yellow", example: { jp: "バナナはきいろです。",   en: "A banana is yellow." },  accept: [] },
        { id: "ja-u12l1-kuro",   type: "vocab", front: "くろ",   reading: "kuro",   meaning: "black",  example: { jp: "くろのくつです。",       en: "They're black shoes." }, accept: [] },
        { id: "ja-u12l1-midori", type: "vocab", front: "みどり", reading: "midori", meaning: "green",  example: { jp: "みどりがすきです。",     en: "I like green." },        accept: [] },
        { id: "ja-u12l1-iro",    type: "vocab", front: "いろ",   reading: "iro",    meaning: "color",  example: { jp: "すきないろはなんですか。", en: "What's your favorite color?" }, accept: ["colour"] },
      ],
    },
    // Lesson 2: more colors + the い-adjective forms
    {
      id: "ja-u12l2",
      unit: 12,
      lesson: 2,
      title: "Color adjectives",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Use color words as い-adjectives (あかい = is red); add ちゃいろ and ピンク.",
      items: [
        { id: "ja-u12l2-chairo", type: "vocab", front: "ちゃいろ", reading: "chairo", meaning: "brown",  example: { jp: "ちゃいろのかばんです。", en: "It's a brown bag." },  accept: [] },
        { id: "ja-u12l2-pinku",  type: "vocab", front: "ピンク",   reading: "pinku",  meaning: "pink",   example: { jp: "ピンクがすきです。",     en: "I like pink." },       accept: [] },
        { id: "ja-u12l2-akai",   type: "vocab", front: "あかい",   reading: "akai",   meaning: "red (is red)",   example: { jp: "りんごはあかいです。", en: "The apple is red." },   accept: ["red"] },
        { id: "ja-u12l2-aoi",    type: "vocab", front: "あおい",   reading: "aoi",    meaning: "blue (is blue)", example: { jp: "そらはあおいです。",   en: "The sky is blue." },    accept: ["blue"] },
        { id: "ja-u12l2-kuroi",  type: "vocab", front: "くろい",   reading: "kuroi",  meaning: "black (is black)", example: { jp: "くろいねこです。",   en: "It's a black cat." },   accept: ["black"] },
        { id: "ja-u12l2-shiroi", type: "vocab", front: "しろい",   reading: "shiroi", meaning: "white (is white)", example: { jp: "しろいくつです。",   en: "They're white shoes." }, accept: ["white"] },
      ],
    },
    // Lesson 3: weather
    {
      id: "ja-u12l3",
      unit: 12,
      lesson: 3,
      title: "Weather",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Talk about the weather: てんき はれ あめ くもり かぜ にじ.",
      items: [
        { id: "ja-u12l3-tenki",  type: "vocab", front: "てんき", reading: "tenki",  meaning: "weather", example: { jp: "てんきがいいです。",     en: "The weather is good." }, accept: ["the weather"] },
        { id: "ja-u12l3-hare",   type: "vocab", front: "はれ",   reading: "hare",   meaning: "sunny",   example: { jp: "きょうははれです。",     en: "Today is sunny." },      accept: ["clear", "fine weather"] },
        { id: "ja-u12l3-ame",    type: "vocab", front: "あめ",   reading: "ame",    meaning: "rain",    example: { jp: "あしたはあめです。",     en: "Tomorrow it will rain." }, accept: ["rainy"] },
        { id: "ja-u12l3-kumori", type: "vocab", front: "くもり", reading: "kumori", meaning: "cloudy",  example: { jp: "きょうはくもりです。",   en: "Today is cloudy." },     accept: ["overcast"] },
        { id: "ja-u12l3-kaze",   type: "vocab", front: "かぜ",   reading: "kaze",   meaning: "wind",    example: { jp: "かぜがあります。",       en: "It's windy." },          accept: ["a breeze"] },
        { id: "ja-u12l3-niji",   type: "vocab", front: "にじ",   reading: "niji",   meaning: "rainbow", example: { jp: "にじがすきです。",       en: "I like rainbows." },     accept: ["rainbows"] },
      ],
    },
    // Lesson 4: temperature (い-adjectives)
    {
      id: "ja-u12l4",
      unit: 12,
      lesson: 4,
      title: "Hot & cold",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Describe temperature: あつい さむい あたたかい すずしい つめたい ぬるい.",
      items: [
        { id: "ja-u12l4-atsui",     type: "vocab", front: "あつい",     reading: "atsui",     meaning: "hot",     example: { jp: "コーヒーはあついです。", en: "The coffee is hot." },   accept: ["hot (weather)"] },
        { id: "ja-u12l4-samui",     type: "vocab", front: "さむい",     reading: "samui",     meaning: "cold",    example: { jp: "きょうはさむいです。",   en: "Today is cold." },       accept: ["cold (weather)"] },
        { id: "ja-u12l4-atatakai",  type: "vocab", front: "あたたかい", reading: "atatakai",  meaning: "warm",    example: { jp: "あたたかいへやです。",   en: "It's a warm room." },    accept: ["warm (weather)"] },
        { id: "ja-u12l4-suzushii",  type: "vocab", front: "すずしい",   reading: "suzushii",  meaning: "cool",    example: { jp: "すずしいかぜです。",     en: "It's a cool breeze." },  accept: ["cool (weather)"] },
        { id: "ja-u12l4-tsumetai",  type: "vocab", front: "つめたい",   reading: "tsumetai",  meaning: "cold to the touch", example: { jp: "つめたいみずです。", en: "It's cold water." },     accept: ["cold", "chilly"] },
        { id: "ja-u12l4-nurui",     type: "vocab", front: "ぬるい",     reading: "nurui",     meaning: "lukewarm", example: { jp: "おちゃがぬるいです。",   en: "The tea is lukewarm." }, accept: ["tepid"] },
      ],
    },
    // Lesson 5: the four seasons
    {
      id: "ja-u12l5",
      unit: 12,
      lesson: 5,
      title: "Seasons",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name the seasons: はる なつ あき ふゆ, the word きせつ, and つゆ (rainy season).",
      items: [
        { id: "ja-u12l5-haru",   type: "vocab", front: "はる",   reading: "haru",   meaning: "spring", example: { jp: "はるがすきです。",       en: "I like spring." },       accept: [] },
        { id: "ja-u12l5-natsu",  type: "vocab", front: "なつ",   reading: "natsu",  meaning: "summer", example: { jp: "なつはあついです。",     en: "Summer is hot." },       accept: [] },
        { id: "ja-u12l5-aki",    type: "vocab", front: "あき",   reading: "aki",    meaning: "autumn", example: { jp: "あきはすずしいです。",   en: "Autumn is cool." },      accept: ["fall"] },
        { id: "ja-u12l5-fuyu",   type: "vocab", front: "ふゆ",   reading: "fuyu",   meaning: "winter", example: { jp: "ふゆはさむいです。",     en: "Winter is cold." },      accept: [] },
        { id: "ja-u12l5-kisetsu", type: "vocab", front: "きせつ", reading: "kisetsu", meaning: "season", example: { jp: "すきなきせつはなんですか。", en: "What's your favorite season?" }, accept: ["seasons"] },
        { id: "ja-u12l5-tsuyu",  type: "vocab", front: "つゆ",   reading: "tsuyu",  meaning: "rainy season", example: { jp: "つゆはあめです。",     en: "It rains in the rainy season." }, accept: ["the rainy season"] },
      ],
    },
  ],
};
