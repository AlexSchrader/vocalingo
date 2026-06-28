// Unit 9 — たべもの・まいにち ("Food & Everyday") — A1 thematic
// Everyday food words plus the core polite verbs (the ～ます forms the learner has
// been SEEING in example sentences since Unit 1 — now they're learnable items in
// their own right: たべます = "eat", いきます = "go"). Meanings are kept to a
// single headword where possible so choice cards stay clean; the "to ～" form is
// in accept[]. Examples reuse only known nouns + particles. No new grammar — the
// verbs are taught as vocabulary, not conjugation. lang/unit/lesson in index.js.
export const UNIT9 = {
  id: "ja-u9",
  lang: "ja",
  title: "たべもの・まいにち",
  order: 9,
  stage: "a1",
  lessons: [
    // Lesson 1: food
    {
      id: "ja-u9l1",
      unit: 9,
      lesson: 1,
      title: "Food",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name everyday foods: たまご やさい にく おちゃ おかし; say what you eat for breakfast.",
      items: [
        { id: "ja-u9l1-tamago", type: "vocab", front: "たまご", reading: "tamago", meaning: "egg", example: { jp: "たまごをたべます。", en: "I eat an egg." }, accept: ["eggs"] },
        { id: "ja-u9l1-yasai",  type: "vocab", front: "やさい", reading: "yasai", meaning: "vegetables", example: { jp: "やさいがすきです。", en: "I like vegetables." }, accept: ["vegetable", "veggies"] },
        { id: "ja-u9l1-niku",   type: "vocab", front: "にく", reading: "niku", meaning: "meat", example: { jp: "にくをたべます。", en: "I eat meat." }, accept: [] },
        { id: "ja-u9l1-ocha",   type: "vocab", front: "おちゃ", reading: "ocha", meaning: "tea", example: { jp: "おちゃをのみます。", en: "I drink tea." }, accept: ["green tea"] },
        { id: "ja-u9l1-okashi", type: "vocab", front: "おかし", reading: "okashi", meaning: "sweets", example: { jp: "おかしがすきです。", en: "I like sweets." }, accept: ["candy", "snacks", "snack"] },
        { id: "ja-u9l1-asagohan", type: "vocab", front: "あさごはん", reading: "asagohan", meaning: "breakfast", example: { jp: "あさごはんをたべます。", en: "I eat breakfast." }, accept: ["morning meal"] },
      ],
    },
    // Lesson 2: meals & taste
    {
      id: "ja-u9l2",
      unit: 9,
      lesson: 2,
      title: "Meals & taste",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name meals (ひるごはん ばんごはん) and describe taste: あまい (sweet), からい (spicy).",
      items: [
        { id: "ja-u9l2-hirugohan", type: "vocab", front: "ひるごはん", reading: "hirugohan", meaning: "lunch", example: { jp: "ひるごはんをたべます。", en: "I eat lunch." }, accept: ["midday meal"] },
        { id: "ja-u9l2-bangohan",  type: "vocab", front: "ばんごはん", reading: "bangohan", meaning: "dinner", example: { jp: "ばんごはんはなんですか。", en: "What's for dinner?" }, accept: ["supper", "evening meal"] },
        { id: "ja-u9l2-ryori", type: "vocab", front: "りょうり", reading: "ryōri", meaning: "cooking", example: { jp: "にほんりょうりがすきです。", en: "I like Japanese food." }, accept: ["dish", "cuisine", "cooked food"] },
        { id: "ja-u9l2-aji",   type: "vocab", front: "あじ", reading: "aji", meaning: "flavor", example: { jp: "このあじがすきです。", en: "I like this flavor." }, accept: ["taste", "flavour"] },
        { id: "ja-u9l2-amai",  type: "vocab", front: "あまい", reading: "amai", meaning: "sweet", example: { jp: "これはあまいです。", en: "This is sweet." }, accept: ["sweet-tasting"] },
        { id: "ja-u9l2-karai", type: "vocab", front: "からい", reading: "karai", meaning: "spicy", example: { jp: "カレーはからいです。", en: "Curry is spicy." }, accept: ["hot", "hot (spicy)"] },
      ],
    },
    // Lesson 3: everyday verbs (1) — the ～ます forms as vocabulary
    {
      id: "ja-u9l3",
      unit: 9,
      lesson: 3,
      title: "Everyday verbs 1",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Use the core daily verbs: おきます ねます たべます のみます みます します.",
      items: [
        { id: "ja-u9l3-okimasu", type: "vocab", front: "おきます", reading: "okimasu", meaning: "wake up", example: { jp: "あさおきます。", en: "I wake up in the morning." }, accept: ["get up", "to wake up", "wake"] },
        { id: "ja-u9l3-nemasu",  type: "vocab", front: "ねます", reading: "nemasu", meaning: "sleep", example: { jp: "よるねます。", en: "I sleep at night." }, accept: ["go to bed", "to sleep"] },
        { id: "ja-u9l3-tabemasu", type: "vocab", front: "たべます", reading: "tabemasu", meaning: "eat", example: { jp: "ごはんをたべます。", en: "I eat a meal." }, accept: ["to eat", "eats"] },
        { id: "ja-u9l3-nomimasu", type: "vocab", front: "のみます", reading: "nomimasu", meaning: "drink", example: { jp: "みずをのみます。", en: "I drink water." }, accept: ["to drink", "drinks"] },
        { id: "ja-u9l3-mimasu",  type: "vocab", front: "みます", reading: "mimasu", meaning: "see", example: { jp: "テレビをみます。", en: "I watch TV." }, accept: ["watch", "to see", "look"] },
        { id: "ja-u9l3-shimasu", type: "vocab", front: "します", reading: "shimasu", meaning: "do", example: { jp: "テニスをします。", en: "I play tennis." }, accept: ["to do", "play (a sport)"] },
      ],
    },
    // Lesson 4: everyday verbs (2)
    {
      id: "ja-u9l4",
      unit: 9,
      lesson: 4,
      title: "Everyday verbs 2",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Use more daily verbs: いきます きます かえります かいます はなします ききます.",
      items: [
        { id: "ja-u9l4-ikimasu", type: "vocab", front: "いきます", reading: "ikimasu", meaning: "go", example: { jp: "がっこうにいきます。", en: "I go to school." }, accept: ["to go", "goes"] },
        { id: "ja-u9l4-kimasu",  type: "vocab", front: "きます", reading: "kimasu", meaning: "come", example: { jp: "ともだちがきます。", en: "A friend is coming." }, accept: ["to come", "comes"] },
        { id: "ja-u9l4-kaerimasu", type: "vocab", front: "かえります", reading: "kaerimasu", meaning: "return", example: { jp: "にほんにかえります。", en: "I return to Japan." }, accept: ["go home", "go back", "to return"] },
        { id: "ja-u9l4-kaimasu", type: "vocab", front: "かいます", reading: "kaimasu", meaning: "buy", example: { jp: "パンをかいます。", en: "I buy bread." }, accept: ["to buy", "buys", "purchase"] },
        { id: "ja-u9l4-hanashimasu", type: "vocab", front: "はなします", reading: "hanashimasu", meaning: "speak", example: { jp: "えいごをはなします。", en: "I speak English." }, accept: ["talk", "to speak", "say"] },
        { id: "ja-u9l4-kikimasu", type: "vocab", front: "ききます", reading: "kikimasu", meaning: "listen", example: { jp: "おんがくをききます。", en: "I listen to music." }, accept: ["hear", "to listen", "ask"] },
      ],
    },
    // Lesson 5: daily-life nouns
    {
      id: "ja-u9l5",
      unit: 9,
      lesson: 5,
      title: "Daily life",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Talk about your routine: しごと まいにち じかん べんきょう かいもの おんがく.",
      items: [
        { id: "ja-u9l5-shigoto", type: "vocab", front: "しごと", reading: "shigoto", meaning: "work", example: { jp: "しごとがすきです。", en: "I like my work." }, accept: ["job", "my job"] },
        { id: "ja-u9l5-mainichi", type: "vocab", front: "まいにち", reading: "mainichi", meaning: "every day", example: { jp: "まいにちべんきょうします。", en: "I study every day." }, accept: ["daily", "everyday"] },
        { id: "ja-u9l5-jikan",   type: "vocab", front: "じかん", reading: "jikan", meaning: "time", example: { jp: "じかんがあります。", en: "I have time." }, accept: ["hours", "an hour", "free time"] },
        { id: "ja-u9l5-benkyo",  type: "vocab", front: "べんきょう", reading: "benkyō", meaning: "study", example: { jp: "べんきょうをします。", en: "I study." }, accept: ["studying", "studies"] },
        { id: "ja-u9l5-kaimono", type: "vocab", front: "かいもの", reading: "kaimono", meaning: "shopping", example: { jp: "かいものをします。", en: "I do the shopping." }, accept: ["errands"] },
        { id: "ja-u9l5-ongaku",  type: "vocab", front: "おんがく", reading: "ongaku", meaning: "music", example: { jp: "おんがくがすきです。", en: "I like music." }, accept: [] },
      ],
    },
  ],
};
