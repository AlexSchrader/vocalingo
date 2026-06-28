// Unit 10 — まち・ばしょ ("Town & Places") — A1 thematic
// Places around town, parts of a home, position words (right/left/above/below),
// and a first set of describing words (near/far, big/small, new/old). Together
// with Units 7-9 this rounds out a usable A1 vocabulary: the learner can say where
// they're going, where something is, and what it's like — all with the grammar
// they already have (に / で / の / が + です/ます, どこですか, があります).
// lang/unit/lesson stamped in index.js.
export const UNIT10 = {
  id: "ja-u10",
  lang: "ja",
  title: "まち・ばしょ",
  order: 10,
  stage: "a1",
  lessons: [
    // Lesson 1: places in town
    {
      id: "ja-u10l1",
      unit: 10,
      lesson: 1,
      title: "Around town",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name places in town: えき みせ びょういん ぎんこう ゆうびんきょく としょかん.",
      items: [
        { id: "ja-u10l1-eki",   type: "vocab", front: "えき", reading: "eki", meaning: "station", example: { jp: "えきにいきます。", en: "I go to the station." }, accept: ["train station", "the station"] },
        { id: "ja-u10l1-mise",  type: "vocab", front: "みせ", reading: "mise", meaning: "shop", example: { jp: "みせはどこですか。", en: "Where is the shop?" }, accept: ["store", "the shop"] },
        { id: "ja-u10l1-byoin", type: "vocab", front: "びょういん", reading: "byōin", meaning: "hospital", example: { jp: "びょういんにいきます。", en: "I go to the hospital." }, accept: ["the hospital"] },
        { id: "ja-u10l1-ginko", type: "vocab", front: "ぎんこう", reading: "ginkō", meaning: "bank", example: { jp: "ぎんこうはどこですか。", en: "Where is the bank?" }, accept: ["the bank"] },
        { id: "ja-u10l1-yubinkyoku", type: "vocab", front: "ゆうびんきょく", reading: "yūbinkyoku", meaning: "post office", example: { jp: "ゆうびんきょくにいきます。", en: "I go to the post office." }, accept: ["the post office"] },
        { id: "ja-u10l1-toshokan", type: "vocab", front: "としょかん", reading: "toshokan", meaning: "library", example: { jp: "としょかんでべんきょうします。", en: "I study at the library." }, accept: ["the library"] },
      ],
    },
    // Lesson 2: more places
    {
      id: "ja-u10l2",
      unit: 10,
      lesson: 2,
      title: "Out and about",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name more places: こうえん えいがかん きっさてん びじゅつかん おてら じんじゃ.",
      items: [
        { id: "ja-u10l2-koen",  type: "vocab", front: "こうえん", reading: "kōen", meaning: "park", example: { jp: "こうえんにいきます。", en: "I go to the park." }, accept: ["the park"] },
        { id: "ja-u10l2-eigakan", type: "vocab", front: "えいがかん", reading: "eigakan", meaning: "cinema", example: { jp: "えいがかんでみます。", en: "I watch a film at the cinema." }, accept: ["movie theater", "movie theatre", "the cinema"] },
        { id: "ja-u10l2-kissaten", type: "vocab", front: "きっさてん", reading: "kissaten", meaning: "café", example: { jp: "きっさてんでのみます。", en: "I drink coffee at the café." }, accept: ["cafe", "coffee shop", "tearoom"] },
        { id: "ja-u10l2-bijutsukan", type: "vocab", front: "びじゅつかん", reading: "bijutsukan", meaning: "art museum", example: { jp: "びじゅつかんにいきます。", en: "I go to the art museum." }, accept: ["art gallery", "the art museum"] },
        { id: "ja-u10l2-otera", type: "vocab", front: "おてら", reading: "otera", meaning: "temple", example: { jp: "おてらはしずかです。", en: "The temple is quiet." }, accept: ["buddhist temple", "the temple"] },
        { id: "ja-u10l2-jinja", type: "vocab", front: "じんじゃ", reading: "jinja", meaning: "shrine", example: { jp: "じんじゃにいきます。", en: "I go to the shrine." }, accept: ["shinto shrine", "the shrine"] },
      ],
    },
    // Lesson 3: home
    {
      id: "ja-u10l3",
      unit: 10,
      lesson: 3,
      title: "At home",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name parts of a home: いえ うち へや にわ まど げんかん.",
      items: [
        { id: "ja-u10l3-ie",    type: "vocab", front: "いえ", reading: "ie", meaning: "house", example: { jp: "いえにかえります。", en: "I return home." }, accept: ["home", "the house"] },
        { id: "ja-u10l3-uchi",  type: "vocab", front: "うち", reading: "uchi", meaning: "home", example: { jp: "うちでねます。", en: "I sleep at home." }, accept: ["my home", "my place", "house"] },
        { id: "ja-u10l3-heya",  type: "vocab", front: "へや", reading: "heya", meaning: "room", example: { jp: "へやはしずかです。", en: "The room is quiet." }, accept: ["a room", "the room"] },
        { id: "ja-u10l3-niwa",  type: "vocab", front: "にわ", reading: "niwa", meaning: "garden", example: { jp: "にわにはながあります。", en: "There are flowers in the garden." }, accept: ["yard", "the garden"] },
        { id: "ja-u10l3-mado",  type: "vocab", front: "まど", reading: "mado", meaning: "window", example: { jp: "まどがあります。", en: "There is a window." }, accept: ["windows"] },
        { id: "ja-u10l3-genkan", type: "vocab", front: "げんかん", reading: "genkan", meaning: "entrance", example: { jp: "げんかんにくつがあります。", en: "There are shoes at the entrance." }, accept: ["doorway", "foyer", "entryway"] },
      ],
    },
    // Lesson 4: position & direction
    {
      id: "ja-u10l4",
      unit: 10,
      lesson: 4,
      title: "Where is it?",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Say where things are: みぎ ひだり うえ した まえ うしろ.",
      items: [
        { id: "ja-u10l4-migi",   type: "vocab", front: "みぎ", reading: "migi", meaning: "right", example: { jp: "みせのみぎです。", en: "It's to the right of the shop." }, accept: ["right side", "the right"] },
        { id: "ja-u10l4-hidari", type: "vocab", front: "ひだり", reading: "hidari", meaning: "left", example: { jp: "えきのひだりです。", en: "It's to the left of the station." }, accept: ["left side", "the left"] },
        { id: "ja-u10l4-ue",     type: "vocab", front: "うえ", reading: "ue", meaning: "above", example: { jp: "テーブルのうえにあります。", en: "It's on the table." }, accept: ["on top", "up", "on", "top"] },
        { id: "ja-u10l4-shita",  type: "vocab", front: "した", reading: "shita", meaning: "below", example: { jp: "したにあります。", en: "It's below." }, accept: ["under", "down", "underneath", "bottom"] },
        { id: "ja-u10l4-mae",    type: "vocab", front: "まえ", reading: "mae", meaning: "front", example: { jp: "えきのまえです。", en: "It's in front of the station." }, accept: ["in front", "before", "the front"] },
        { id: "ja-u10l4-ushiro", type: "vocab", front: "うしろ", reading: "ushiro", meaning: "behind", example: { jp: "いえのうしろです。", en: "It's behind the house." }, accept: ["back", "rear", "at the back"] },
      ],
    },
    // Lesson 5: describing words
    {
      id: "ja-u10l5",
      unit: 10,
      lesson: 5,
      title: "Describing places",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Describe places with ちかい とおい おおきい ちいさい あたらしい ふるい.",
      items: [
        { id: "ja-u10l5-chikai", type: "vocab", front: "ちかい", reading: "chikai", meaning: "near", example: { jp: "えきはちかいです。", en: "The station is near." }, accept: ["close", "nearby"] },
        { id: "ja-u10l5-toi",    type: "vocab", front: "とおい", reading: "tōi", meaning: "far", example: { jp: "がっこうはとおいです。", en: "The school is far." }, accept: ["distant", "far away"] },
        { id: "ja-u10l5-okii",   type: "vocab", front: "おおきい", reading: "ōkii", meaning: "big", example: { jp: "おおきいいえです。", en: "It's a big house." }, accept: ["large", "big (size)"] },
        { id: "ja-u10l5-chiisai", type: "vocab", front: "ちいさい", reading: "chiisai", meaning: "small", example: { jp: "ちいさいみせです。", en: "It's a small shop." }, accept: ["little", "tiny"] },
        { id: "ja-u10l5-atarashii", type: "vocab", front: "あたらしい", reading: "atarashii", meaning: "new", example: { jp: "あたらしいくつです。", en: "They're new shoes." }, accept: ["brand new"] },
        { id: "ja-u10l5-furui",  type: "vocab", front: "ふるい", reading: "furui", meaning: "old", example: { jp: "ふるいおてらです。", en: "It's an old temple." }, accept: ["aged", "old (thing)"] },
      ],
    },
  ],
};
