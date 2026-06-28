// Unit 6 — カタカナ゛゜ (katakana dakuten / handakuten)
// The voiced katakana — same dakuten (゛) and handakuten (゜) trick the learner
// already met for hiragana in Unit 3, now applied to the katakana shapes from
// Units 4-5. No brand-new glyphs: カ + ゛ → ガ, ハ + ゜ → パ. With this unit the
// katakana script is complete, so the loanword vocab can finally use voiced
// sounds (ゲーム, ビール, ピザ), and the example sentences still reuse only the
// grammar from Units 1-3. 5 rows: g / z / d / b (dakuten) + p (handakuten).
// lang/unit/lesson stamped in index.js.
export const UNIT6 = {
  id: "ja-u6",
  lang: "ja",
  title: "カタカナ゛゜",
  order: 6,
  stage: "pre-a1",
  lessons: [
    // Lesson 1: g-row ガ ギ グ ゲ ゴ (voiced カ row)
    {
      id: "ja-u6l1",
      unit: 6,
      lesson: 1,
      title: "Katakana g-row (dakuten)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana g-row ガ ギ グ ゲ ゴ — the か-row katakana plus dakuten, just like が was か + ゛.",
      items: [
        { id: "ja-u6l1-ga", type: "kana", front: "ガ", reading: "ga", meaning: null, example: null, hint: "ガ is カ + ゛ — the same dakuten trick from Unit 3, now on katakana. The two dashes voice KA into GA." },
        { id: "ja-u6l1-gi", type: "kana", front: "ギ", reading: "gi", meaning: null, example: null, hint: "ギ is キ + ゛. KI voices into GI." },
        { id: "ja-u6l1-gu", type: "kana", front: "グ", reading: "gu", meaning: null, example: null, hint: "グ is ク + ゛. KU voices into GU." },
        { id: "ja-u6l1-ge", type: "kana", front: "ゲ", reading: "ge", meaning: null, example: null, hint: "ゲ is ケ + ゛. KE voices into GE." },
        { id: "ja-u6l1-go", type: "kana", front: "ゴ", reading: "go", meaning: null, example: null, hint: "ゴ is コ + ゛. KO voices into GO." },
        { id: "ja-u6l1-gamu",   type: "vocab", front: "ガム",   reading: "gamu",   meaning: "gum",    example: { jp: "ガムをたべます。",       en: "I chew gum." },          accept: ["chewing gum"] },
        { id: "ja-u6l1-gita",   type: "vocab", front: "ギター", reading: "gitā",   meaning: "guitar", example: { jp: "ギターがすきです。",     en: "I like the guitar." },   accept: ["guitars"] },
        { id: "ja-u6l1-gurasu", type: "vocab", front: "グラス", reading: "gurasu", meaning: "glass",  example: { jp: "グラスがあります。",     en: "There is a glass." },    accept: ["drinking glass", "glasses"] },
        { id: "ja-u6l1-gemu",   type: "vocab", front: "ゲーム", reading: "gēmu",   meaning: "game",   example: { jp: "ゲームをします。",       en: "I play a game." },       accept: ["games", "video game"] },
        { id: "ja-u6l1-gorufu", type: "vocab", front: "ゴルフ", reading: "gorufu", meaning: "golf",   example: { jp: "ゴルフをします。",       en: "I play golf." },         accept: [] },
        { id: "ja-u6l1-hanga",  type: "vocab", front: "ハンガー", reading: "hangā", meaning: "hanger", example: { jp: "ハンガーがあります。",   en: "There is a hanger." },   accept: ["clothes hanger", "hangers"] },
      ],
    },
    // Lesson 2: z-row ザ ジ ズ ゼ ゾ (voiced サ row)
    {
      id: "ja-u6l2",
      unit: 6,
      lesson: 2,
      title: "Katakana z-row (dakuten)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana z-row ザ ジ ズ ゼ ゾ; ジ is the katakana 'ji'.",
      items: [
        { id: "ja-u6l2-za", type: "kana", front: "ザ", reading: "za", meaning: null, example: null, hint: "ザ is サ + ゛. SA voices into ZA." },
        { id: "ja-u6l2-ji", type: "kana", front: "ジ", reading: "ji", meaning: null, example: null, hint: "ジ is シ + ゛. SHI voices into JI — the katakana twin of じ." },
        { id: "ja-u6l2-zu", type: "kana", front: "ズ", reading: "zu", meaning: null, example: null, hint: "ズ is ス + ゛. SU voices into ZU." },
        { id: "ja-u6l2-ze", type: "kana", front: "ゼ", reading: "ze", meaning: null, example: null, hint: "ゼ is セ + ゛. SE voices into ZE." },
        { id: "ja-u6l2-zo", type: "kana", front: "ゾ", reading: "zo", meaning: null, example: null, hint: "ゾ is ソ + ゛. SO voices into ZO." },
        { id: "ja-u6l2-piza",   type: "vocab", front: "ピザ",     reading: "piza",   meaning: "pizza", example: { jp: "ピザをたべます。",       en: "I eat pizza." },         accept: ["pizzas"] },
        { id: "ja-u6l2-jusu",   type: "vocab", front: "ジュース", reading: "jūsu",   meaning: "juice", example: { jp: "ジュースをのみます。",   en: "I drink juice." },       accept: [] },
        { id: "ja-u6l2-chizu",  type: "vocab", front: "チーズ",   reading: "chīzu",  meaning: "cheese", example: { jp: "チーズをたべます。",     en: "I eat cheese." },        accept: [] },
        { id: "ja-u6l2-zero",   type: "vocab", front: "ゼロ",     reading: "zero",   meaning: "zero",  example: { jp: "ゼロからはじめます。",   en: "I start from zero." },   accept: ["nought"] },
        { id: "ja-u6l2-rizoto", type: "vocab", front: "リゾート", reading: "rizōto", meaning: "resort", example: { jp: "リゾートにいきます。",   en: "I go to a resort." },    accept: ["resorts"] },
        { id: "ja-u6l2-jinzu",  type: "vocab", front: "ジーンズ", reading: "jīnzu",  meaning: "jeans", example: { jp: "ジーンズがすきです。",   en: "I like jeans." },        accept: ["denim", "jean"] },
      ],
    },
    // Lesson 3: d-row ダ ヂ ヅ デ ド (voiced タ row). ヂ ヅ are essentially unused
    // in modern Japanese (ジ/ズ cover those sounds), taught for completeness.
    {
      id: "ja-u6l3",
      unit: 6,
      lesson: 3,
      title: "Katakana d-row (dakuten)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana d-row ダ デ ド; recognize the rare ヂ ヅ.",
      items: [
        { id: "ja-u6l3-da", type: "kana", front: "ダ", reading: "da", meaning: null, example: null, hint: "ダ is タ + ゛. TA voices into DA." },
        { id: "ja-u6l3-ji", type: "kana", front: "ヂ", reading: "ji", meaning: null, example: null, hint: "ヂ is チ + ゛ — sounds just like ジ (JI). Almost never used today; recognize it, but write the sound with ジ." },
        { id: "ja-u6l3-zu", type: "kana", front: "ヅ", reading: "zu", meaning: null, example: null, hint: "ヅ is ツ + ゛ — sounds just like ズ (ZU). Almost never used today; recognize it, but write the sound with ズ." },
        { id: "ja-u6l3-de", type: "kana", front: "デ", reading: "de", meaning: null, example: null, hint: "デ is テ + ゛. TE voices into DE." },
        { id: "ja-u6l3-do", type: "kana", front: "ド", reading: "do", meaning: null, example: null, hint: "ド is ト + ゛. TO voices into DO." },
        { id: "ja-u6l3-dansu",     type: "vocab", front: "ダンス",     reading: "dansu",     meaning: "dance", example: { jp: "ダンスをします。",       en: "I dance." },            accept: ["dancing", "dances"] },
        { id: "ja-u6l3-saida",     type: "vocab", front: "サイダー",   reading: "saidā",     meaning: "soda", example: { jp: "サイダーをのみます。",   en: "I drink soda." },       accept: ["cider", "lemonade", "soda pop"] },
        { id: "ja-u6l3-depato",    type: "vocab", front: "デパート",   reading: "depāto",    meaning: "department store", example: { jp: "デパートにいきます。", en: "I go to the department store." }, accept: ["department stores"] },
        { id: "ja-u6l3-deto",      type: "vocab", front: "デート",     reading: "dēto",      meaning: "date", example: { jp: "デートをします。",       en: "I go on a date." },     accept: ["dates", "outing"] },
        { id: "ja-u6l3-doa",       type: "vocab", front: "ドア",       reading: "doa",       meaning: "door", example: { jp: "ドアがあります。",       en: "There is a door." },    accept: ["doors"] },
        { id: "ja-u6l3-sandoitchi", type: "vocab", front: "サンドイッチ", reading: "sandoitchi", meaning: "sandwich", example: { jp: "サンドイッチをたべます。", en: "I eat a sandwich." }, accept: ["sandwiches", "sarnie"] },
      ],
    },
    // Lesson 4: b-row バ ビ ブ ベ ボ (voiced ハ row)
    {
      id: "ja-u6l4",
      unit: 6,
      lesson: 4,
      title: "Katakana b-row (dakuten)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana b-row バ ビ ブ ベ ボ — the ハ-row plus dakuten.",
      items: [
        { id: "ja-u6l4-ba", type: "kana", front: "バ", reading: "ba", meaning: null, example: null, hint: "バ is ハ + ゛. HA voices into BA." },
        { id: "ja-u6l4-bi", type: "kana", front: "ビ", reading: "bi", meaning: null, example: null, hint: "ビ is ヒ + ゛. HI voices into BI." },
        { id: "ja-u6l4-bu", type: "kana", front: "ブ", reading: "bu", meaning: null, example: null, hint: "ブ is フ + ゛. FU voices into BU." },
        { id: "ja-u6l4-be", type: "kana", front: "ベ", reading: "be", meaning: null, example: null, hint: "ベ is ヘ + ゛. HE voices into BE. (ヘ and ベ keep the same simple slope.)" },
        { id: "ja-u6l4-bo", type: "kana", front: "ボ", reading: "bo", meaning: null, example: null, hint: "ボ is ホ + ゛. HO voices into BO." },
        { id: "ja-u6l4-basu",    type: "vocab", front: "バス",     reading: "basu",    meaning: "bus",   example: { jp: "バスでいきます。",       en: "I go by bus." },         accept: ["buses"] },
        { id: "ja-u6l4-biru",    type: "vocab", front: "ビール",   reading: "bīru",    meaning: "beer",  example: { jp: "ビールをのみます。",     en: "I drink beer." },        accept: ["beers"] },
        { id: "ja-u6l4-teburu",  type: "vocab", front: "テーブル", reading: "tēburu",  meaning: "table", example: { jp: "テーブルがあります。",   en: "There is a table." },    accept: ["tables"] },
        { id: "ja-u6l4-beddo",   type: "vocab", front: "ベッド",   reading: "beddo",   meaning: "bed",   example: { jp: "ベッドがあります。",     en: "There is a bed." },      accept: ["beds"] },
        { id: "ja-u6l4-botan",   type: "vocab", front: "ボタン",   reading: "botan",   meaning: "button", example: { jp: "ボタンがあります。",    en: "There is a button." },   accept: ["buttons"] },
        { id: "ja-u6l4-biru2",   type: "vocab", front: "ビル",     reading: "biru",    meaning: "building", example: { jp: "たかいビルです。",      en: "It's a tall building." }, accept: ["buildings", "tower block"] },
      ],
    },
    // Lesson 5: p-row パ ピ プ ペ ポ (handakuten — the small circle ゜)
    {
      id: "ja-u6l5",
      unit: 6,
      lesson: 5,
      title: "Katakana p-row (handakuten)",
      cefr: "A1",
      dominantMode: "recall",
      canDo: "Read the katakana p-row パ ピ プ ペ ポ; the small circle ゜ (not dashes) makes the P sound. Katakana is now complete.",
      items: [
        { id: "ja-u6l5-pa", type: "kana", front: "パ", reading: "pa", meaning: null, example: null, hint: "パ is ハ + ゜ — a small circle, not dashes. The circle makes P: HA → PA. (Dashes ゛ would give BA.)" },
        { id: "ja-u6l5-pi", type: "kana", front: "ピ", reading: "pi", meaning: null, example: null, hint: "ピ is ヒ + ゜. HI → PI." },
        { id: "ja-u6l5-pu", type: "kana", front: "プ", reading: "pu", meaning: null, example: null, hint: "プ is フ + ゜. FU → PU." },
        { id: "ja-u6l5-pe", type: "kana", front: "ペ", reading: "pe", meaning: null, example: null, hint: "ペ is ヘ + ゜. HE → PE." },
        { id: "ja-u6l5-po", type: "kana", front: "ポ", reading: "po", meaning: null, example: null, hint: "ポ is ホ + ゜. HO → PO. That completes katakana — you can now read both kana scripts." },
        { id: "ja-u6l5-pan",   type: "vocab", front: "パン",     reading: "pan",   meaning: "bread", example: { jp: "パンをたべます。",       en: "I eat bread." },         accept: [] },
        { id: "ja-u6l5-piano", type: "vocab", front: "ピアノ",   reading: "piano", meaning: "piano", example: { jp: "ピアノがすきです。",     en: "I like the piano." },    accept: ["pianos"] },
        { id: "ja-u6l5-puru",  type: "vocab", front: "プール",   reading: "pūru",  meaning: "pool",  example: { jp: "プールにいきます。",     en: "I go to the pool." },    accept: ["swimming pool", "pools"] },
        { id: "ja-u6l5-pen",   type: "vocab", front: "ペン",     reading: "pen",   meaning: "pen",   example: { jp: "ペンがあります。",       en: "There is a pen." },      accept: ["pens"] },
        { id: "ja-u6l5-posuto", type: "vocab", front: "ポスト",  reading: "posuto", meaning: "mailbox", example: { jp: "ポストはどこですか。",  en: "Where is the mailbox?" }, accept: ["post box", "postbox", "mail box"] },
        { id: "ja-u6l5-supa",  type: "vocab", front: "スーパー", reading: "sūpā",  meaning: "supermarket", example: { jp: "スーパーにいきます。", en: "I go to the supermarket." }, accept: ["grocery store", "supermarkets"] },
      ],
    },
  ],
};
