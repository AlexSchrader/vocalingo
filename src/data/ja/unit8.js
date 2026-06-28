// Unit 8 — かぞく ("Family") — A1 thematic
// Names for family members and people. Japanese splits family words into a humble
// set for your OWN family (ちち = my father) and an honorific set for someone
// else's (おとうさん = (your) father) — this unit teaches both, with the
// distinction carried in the meanings (and a hint on the first of each pair).
// Example sentences stay inside known grammar: X は Y です / X が すきです /
// X は おげんきですか. lang/unit/lesson stamped in index.js.
export const UNIT8 = {
  id: "ja-u8",
  lang: "ja",
  title: "かぞく",
  order: 8,
  stage: "a1",
  lessons: [
    // Lesson 1: your own family (humble forms)
    {
      id: "ja-u8l1",
      unit: 8,
      lesson: 1,
      title: "My family",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name your own family with the humble words: ちち はは りょうしん そふ そぼ.",
      items: [
        { id: "ja-u8l1-chichi", type: "vocab", front: "ちち", reading: "chichi", meaning: "my father", example: { jp: "ちちはせんせいです。", en: "My father is a teacher." }, accept: ["father", "dad", "my dad"], hint: "ちち is YOUR OWN father (humble). For someone else's father you say おとうさん — that pair comes back in Lesson 3." },
        { id: "ja-u8l1-haha",   type: "vocab", front: "はは", reading: "haha", meaning: "my mother", example: { jp: "ははがすきです。", en: "I love my mother." }, accept: ["mother", "mom", "mum", "my mom"] },
        { id: "ja-u8l1-ryoshin", type: "vocab", front: "りょうしん", reading: "ryōshin", meaning: "my parents", example: { jp: "こちらはりょうしんです。", en: "These are my parents." }, accept: ["parents", "both parents"] },
        { id: "ja-u8l1-sofu",   type: "vocab", front: "そふ", reading: "sofu", meaning: "my grandfather", example: { jp: "そふはげんきです。", en: "My grandfather is well." }, accept: ["grandfather", "grandpa"] },
        { id: "ja-u8l1-sobo",   type: "vocab", front: "そぼ", reading: "sobo", meaning: "my grandmother", example: { jp: "そぼがすきです。", en: "I love my grandmother." }, accept: ["grandmother", "grandma"] },
        { id: "ja-u8l1-oya",    type: "vocab", front: "おや", reading: "oya", meaning: "parent", example: { jp: "おやとこどもです。", en: "A parent and a child." }, accept: ["a parent", "parents"] },
      ],
    },
    // Lesson 2: siblings & children
    {
      id: "ja-u8l2",
      unit: 8,
      lesson: 2,
      title: "Brothers, sisters, kids",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Name siblings and children: あに あね おとうと いもうと あかちゃん まご.",
      items: [
        { id: "ja-u8l2-ani",    type: "vocab", front: "あに", reading: "ani", meaning: "my older brother", example: { jp: "あにはせんせいです。", en: "My older brother is a teacher." }, accept: ["older brother", "big brother", "elder brother"] },
        { id: "ja-u8l2-ane",    type: "vocab", front: "あね", reading: "ane", meaning: "my older sister", example: { jp: "あねがすきです。", en: "I like my older sister." }, accept: ["older sister", "big sister", "elder sister"] },
        { id: "ja-u8l2-otouto", type: "vocab", front: "おとうと", reading: "otōto", meaning: "my younger brother", example: { jp: "おとうとはこどもです。", en: "My younger brother is a child." }, accept: ["younger brother", "little brother"] },
        { id: "ja-u8l2-imouto", type: "vocab", front: "いもうと", reading: "imōto", meaning: "my younger sister", example: { jp: "いもうとがすきです。", en: "I love my little sister." }, accept: ["younger sister", "little sister"] },
        { id: "ja-u8l2-akachan", type: "vocab", front: "あかちゃん", reading: "akachan", meaning: "baby", example: { jp: "あかちゃんがすきです。", en: "I like babies." }, accept: ["a baby", "babies", "infant"] },
        { id: "ja-u8l2-mago",   type: "vocab", front: "まご", reading: "mago", meaning: "grandchild", example: { jp: "これはまごです。", en: "This is my grandchild." }, accept: ["grandchildren"] },
      ],
    },
    // Lesson 3: someone else's family (honorific forms)
    {
      id: "ja-u8l3",
      unit: 8,
      lesson: 3,
      title: "Someone's family (polite)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Use the polite family words for other people's relatives: おとうさん おかあさん おにいさん おねえさん.",
      items: [
        { id: "ja-u8l3-otousan", type: "vocab", front: "おとうさん", reading: "otōsan", meaning: "father (someone's)", example: { jp: "おとうさんはおげんきですか。", en: "Is your father well?" }, accept: ["father", "your father", "dad"], hint: "おとうさん is the polite word for SOMEONE ELSE's father (or how a child addresses their own dad). Your own father, humbly, is ちち (Lesson 1)." },
        { id: "ja-u8l3-okaasan", type: "vocab", front: "おかあさん", reading: "okāsan", meaning: "mother (someone's)", example: { jp: "おかあさんはせんせいですか。", en: "Is your mother a teacher?" }, accept: ["mother", "your mother", "mom", "mum"] },
        { id: "ja-u8l3-oniisan", type: "vocab", front: "おにいさん", reading: "oniisan", meaning: "older brother (someone's)", example: { jp: "おにいさんはせんせいですか。", en: "Is your older brother a teacher?" }, accept: ["older brother", "your older brother"] },
        { id: "ja-u8l3-oneesan", type: "vocab", front: "おねえさん", reading: "onēsan", meaning: "older sister (someone's)", example: { jp: "おねえさんはおげんきですか。", en: "Is your older sister well?" }, accept: ["older sister", "your older sister"] },
        { id: "ja-u8l3-ojiisan", type: "vocab", front: "おじいさん", reading: "ojiisan", meaning: "old man", example: { jp: "おじいさんはげんきですか。", en: "Is the old man well?" }, accept: ["grandfather", "grandpa", "elderly man"] },
        { id: "ja-u8l3-obaasan", type: "vocab", front: "おばあさん", reading: "obāsan", meaning: "old woman", example: { jp: "おばあさんがすきです。", en: "I like the old lady." }, accept: ["grandmother", "grandma", "elderly woman"] },
      ],
    },
    // Lesson 4: people
    {
      id: "ja-u8l4",
      unit: 8,
      lesson: 4,
      title: "People",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Talk about people: おとこ おんな おとな みんな, and ask だれ (who?).",
      items: [
        { id: "ja-u8l4-otoko", type: "vocab", front: "おとこ", reading: "otoko", meaning: "man", example: { jp: "あのひとはおとこです。", en: "That person is a man." }, accept: ["male", "a man"] },
        { id: "ja-u8l4-onna",  type: "vocab", front: "おんな", reading: "onna", meaning: "woman", example: { jp: "このひとはおんなです。", en: "This person is a woman." }, accept: ["female", "a woman"] },
        { id: "ja-u8l4-otona", type: "vocab", front: "おとな", reading: "otona", meaning: "adult", example: { jp: "おとなとこども。", en: "Adults and children." }, accept: ["a grown-up", "grown-up", "adults"] },
        { id: "ja-u8l4-okyaku", type: "vocab", front: "おきゃくさん", reading: "okyakusan", meaning: "guest", example: { jp: "おきゃくさんです。", en: "It's a guest." }, accept: ["customer", "visitor", "the customer"] },
        { id: "ja-u8l4-minna", type: "vocab", front: "みんな", reading: "minna", meaning: "everyone", example: { jp: "みんなともだちです。", en: "Everyone is a friend." }, accept: ["everybody", "all"] },
        { id: "ja-u8l4-dare",  type: "vocab", front: "だれ", reading: "dare", meaning: "who", example: { jp: "あのひとはだれですか。", en: "Who is that person?" }, accept: ["who?"] },
      ],
    },
    // Lesson 5: you & others (pronouns)
    {
      id: "ja-u8l5",
      unit: 8,
      lesson: 5,
      title: "He, she, you",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Refer to people with かれ かのじょ あなた じぶん, and count people (ひとり).",
      items: [
        { id: "ja-u8l5-kare",   type: "vocab", front: "かれ", reading: "kare", meaning: "he", example: { jp: "かれはせんせいです。", en: "He is a teacher." }, accept: ["him", "boyfriend"] },
        { id: "ja-u8l5-kanojo", type: "vocab", front: "かのじょ", reading: "kanojo", meaning: "she", example: { jp: "かのじょはともだちです。", en: "She is a friend." }, accept: ["her", "girlfriend"] },
        { id: "ja-u8l5-anata",  type: "vocab", front: "あなた", reading: "anata", meaning: "you", example: { jp: "あなたはだれですか。", en: "Who are you?" }, accept: [] },
        { id: "ja-u8l5-jibun",  type: "vocab", front: "じぶん", reading: "jibun", meaning: "oneself", example: { jp: "じぶんでします。", en: "I'll do it myself." }, accept: ["myself", "self", "by oneself"] },
        { id: "ja-u8l5-minasan", type: "vocab", front: "みなさん", reading: "minasan", meaning: "everyone (polite)", example: { jp: "みなさん、こんにちは。", en: "Hello, everyone." }, accept: ["everybody", "all of you"] },
        { id: "ja-u8l5-hitori", type: "vocab", front: "ひとり", reading: "hitori", meaning: "one person", example: { jp: "ひとりですか。", en: "Are you alone?" }, accept: ["alone", "by myself", "one (person)"] },
      ],
    },
  ],
};
