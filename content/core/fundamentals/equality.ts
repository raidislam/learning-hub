import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Strict equality (`===`) ও loose equality (`==`) এর algorithm ধাপে ধাপে ব্যাখ্যা করতে পারবেন।",
    "`'' == 0`, `'0' == false`, `null == 0`, `[] == ![]` এর মতো ফল কেন আসে — coercion এর নিয়ম থেকে নিজে বের করতে পারবেন।",
    "`NaN`, `+0/-0` এর ক্ষেত্রে `===` ও `Object.is` এর পার্থক্য এবং `includes` বনাম `indexOf` এর আচরণ জানবেন।",
    "Object ও array যে reference দিয়ে তুলনা হয় তা বুঝে value দিয়ে তুলনার নির্ভরযোগ্য উপায় (structural/deep equal) লিখতে পারবেন।",
    "কেন প্রায় সব team `===` বাধ্যতামূলক করে এবং একমাত্র গ্রহণযোগ্য `x == null` idiom কখন ব্যবহার করবেন — তা ব্যাখ্যা করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "‘দুটি জিনিস সমান’ — এর আসলে কতগুলো মানে আছে" },
    {
      type: "p",
      text: "প্রোগ্রামিং এ ‘সমান’ একটি একক ধারণা নয়। দুটি মান কি **একই object** (identity)? নাকি দুটি আলাদা object যাদের **ভেতরের তথ্য একই** (structural/value equality)? নাকি দুটি ভিন্ন type এর মান যেগুলো রূপান্তর করলে মিলে যায় (coercive equality)? JavaScript এ তিনটিই আছে, কিন্তু আলাদা আলাদা operator/কৌশলে। `===` ও `Object.is` identity-সদৃশ (primitive এ value, object এ reference), `==` coercion সহ তুলনা করে, আর value দিয়ে object তুলনা করতে হলে আপনাকে নিজে (বা library দিয়ে) লিখতে হয়।",
    },
    { type: "h3", text: "Strict equality `===` এর algorithm" },
    {
      type: "p",
      text: "`a === b` এর নিয়ম খুব সরল — কোনো রূপান্তর হয় না:",
    },
    {
      type: "ol",
      items: [
        "`a` ও `b` এর **type আলাদা** হলে ফল `false` (`5 === '5'` → `false`)।",
        "দুটিই **Number** হলে: কোনো একটি `NaN` হলে `false` (এমনকি `NaN === NaN`ও `false`); নইলে সংখ্যামান সমান হলে `true` — **`+0 === -0` ও `true`**।",
        "দুটিই **String** হলে: অক্ষরগুলো (UTF-16 code unit) হুবহু একই ক্রমে থাকলে `true`।",
        "`undefined`, `null`, `boolean`, `bigint`, `symbol` — একই type ও একই মান হলে `true`।",
        "দুটিই **object** (array, function, Date ইত্যাদি সহ) হলে: শুধু তখনই `true` যখন দুটি **একই object এর reference** — ভেতরের কনটেন্ট যতই এক হোক।",
      ],
    },
    {
      type: "p",
      text: "এটি **predictable**: ফল শুধু ‘type একই কি না’ আর ‘মান একই কি না’ — এর ওপর নির্ভর করে। পাঠকও কোড দেখে বুঝে যান কী ঘটবে।",
    },
    { type: "h3", text: "Loose equality `==` এর algorithm — সাদা ভাষায় ধাপগুলো" },
    {
      type: "p",
      text: "`a == b` তে engine ECMAScript spec এর ‘IsLooselyEqual’ নিয়ম অনুসরণ করে। সংক্ষেপে (মূল ক্ষেত্রগুলো):",
    },
    {
      type: "ol",
      items: [
        "**Type একই হলে** — সরাসরি `===` এর মতো তুলনা (ধাপ ১)।",
        "**`null` ও `undefined`** — একে অপরের সাথে `true`, কিন্তু **অন্য কোনো মানের সাথেই নয়** (`null == 0` → `false`, `null == false` → `false`, `undefined == ''` → `false`)।",
        "**Number বনাম String** — string কে `ToNumber` দিয়ে সংখ্যা বানিয়ে আবার তুলনা (`5 == '5'` → `5 == 5`)।",
        "**Boolean বনাম যেকোনো কিছু** — boolean কে আগে `ToNumber` (`true → 1`, `false → 0`) করে আবার তুলনা। (অর্থাৎ boolean কখনো সরাসরি তুলনায় যায় না।)",
        "**Object বনাম primitive (string/number/bigint/symbol)** — object কে `ToPrimitive` (`Symbol.toPrimitive`, নইলে `valueOf`/`toString`) দিয়ে primitive বানিয়ে আবার তুলনা।",
        "**Object বনাম object** — আর কোনো রূপান্তর নেই; reference এক হলে `true`।",
        "বাকি সব ক্ষেত্রে `false`। (BigInt বনাম Number/String এর জন্য আলাদা গাণিতিক নিয়ম আছে — এখানে বিস্তারিত নয়।)",
      ],
    },
    {
      type: "p",
      text: "মনে রাখুন, ধাপগুলো **recursive** — রূপান্তরের পর ফলাফল আবার একই algorithm এ ঢোকে। নিচের visual এ `'0' == false` ও `[] == ![]` ধাপে ধাপে দেখানো হয়েছে।",
    },
    { type: "h3", text: "চমকপ্রদ table এবং এর পেছনের যুক্তি" },
    {
      type: "compare",
      headers: ["Expression", "ফল", "কেন"],
      rows: [
        ["`'' == 0`", "`true`", "string → `ToNumber('')` = `0`; তারপর `0 == 0`"],
        ["`'0' == false`", "`true`", "`false → 0`; তারপর `'0' == 0` → `0 == 0`"],
        ["`null == 0`", "`false`", "`null` শুধু `undefined` এর সমান; কোনো সংখ্যায় রূপান্তর হয় না"],
        ["`null == undefined`", "`true`", "বিশেষ নিয়ম"],
        ["`'' == '0'`", "`false`", "দুটিই string — type একই, তাই strict তুলনা; অক্ষর আলাদা"],
        ["`[] == ![]`", "`true`", "`![]` = `false` → `0`; `[]` → `ToPrimitive` = `''` → `0`; `0 == 0`"],
        ["`'true' == true`", "`false`", "`true → 1`; `'true' → NaN`; `NaN == 1` মিথ্যা"],
        ["`NaN == NaN`", "`false`", "`NaN` নিজেও নিজের সমান নয়"],
        ["`[1] == 1`", "`true`", "`[1]` → `'1'` → `1`"],
      ],
    },
    {
      type: "p",
      text: "লক্ষ্য করুন: `'' == 0` সত্য, `0 == '0'` সত্য, কিন্তু `'' == '0'` মিথ্যা। অর্থাৎ `==` **transitive নয়** (a==b আর b==c হলেও a==c নাও হতে পারে)। এটিই `==` কে যুক্তি দিয়ে বোঝা কঠিন করে তোলে।",
    },
    { type: "h3", text: "কেন প্রায় সব team `===` বাধ্যতামূলক করে" },
    {
      type: "ul",
      items: [
        "**Predictability** — `===` এ ফল জানতে শুধু দুটি মান ও তাদের type জানলেই চলে; `==` এ পুরো coercion table মাথায় রাখতে হয়।",
        "**Intent স্পষ্ট** — `a === b` মানে ‘type ও মান দুটিই এক’। `==` লিখলে পাঠক ভাবেন: লেখক কি ইচ্ছা করে coercion চেয়েছেন, নাকি ভুলে লিখেছেন?",
        "**Bug কম** — form input (সবসময় string) ও API data (type অনিশ্চিত) এ `==` নীরবে ভুল সত্য/মিথ্যা দিতে পারে।",
        "**Tooling** — ESLint এর `eqeqeq` rule এ `==` ধরা পড়ে; অনেক team এটি error হিসেবে রাখে।",
      ],
    },
    { type: "h3", text: "একমাত্র গ্রহণযোগ্য ব্যতিক্রম: `x == null`" },
    {
      type: "p",
      text: "`x == null` ঠিক `x === null || x === undefined` এর সমান — কারণ ওপরের ধাপ ২ অনুযায়ী `null` কেবল `null` ও `undefined` এর সাথে loose-equal। অনেক team (এবং ESLint এর `eqeqeq` এর `'null': 'ignore'` option) এই একটিমাত্র idiom কে অনুমতি দেয়। তবে এটি **ঐচ্ছিক সুবিধা**: আপনি পুরো `x === null || x === undefined` লিখতে পারেন, অথবা আধুনিক কোডে `x ?? fallback` ও `x?.y` তো আছেই। যাই করুন, **টিমের কনভেনশন মানুন** — সবার কাছে এটি পরিচিত নয়।",
    },
    { type: "h3", text: "`NaN`, `+0/-0` ও `Object.is`" },
    {
      type: "p",
      text: "`Object.is(a, b)` হলো spec এর **SameValue** অ্যালগরিদম, যা `===` এর মতো কিন্তু দুটি জায়গায় আলাদা: `Object.is(NaN, NaN)` → `true` (যেখানে `NaN === NaN` → `false`), এবং `Object.is(0, -0)` → `false` (যেখানে `0 === -0` → `true`)। কোনো মান `NaN` কিনা জানতে `Number.isNaN(x)` ব্যবহার করুন (সরাসরি `x === NaN` সবসময় `false`)। একই ধরনের সূক্ষ্মতা `Array` এর methods এ: `indexOf` ও `lastIndexOf` strict equality ব্যবহার করে (`[NaN].indexOf(NaN)` → `-1`), কিন্তু `includes` **SameValueZero** (NaN কে সমান ধরে, `+0/-0` ও সমান) ব্যবহার করে — `[NaN].includes(NaN)` → `true`। `Map` key ও `Set` ও SameValueZero ব্যবহার করে।",
    },
    { type: "h3", text: "Object ও array: identity বনাম value" },
    {
      type: "p",
      text: "`[1, 2] === [1, 2]` হয় `false`, কারণ প্রতিটি array literal আলাদা object তৈরি করে — দুটি আলাদা **reference**। `const a = [1, 2]; const b = a;` এ `a === b` সত্য, কারণ একই object এর দুটি নাম। কাজেই object এর কনটেন্ট তুলনা করতে হলে নিজে লিখতে হয়:",
    },
    {
      type: "ul",
      items: [
        "**ছোট ও সরল data** — `a.length === b.length && a.every((v, i) => v === b[i])`।",
        "**`JSON.stringify(a) === JSON.stringify(b)`** — দ্রুত, কিন্তু ভঙ্গুর: key এর ক্রম আলাদা হলে `false` দেয়; `undefined`, function, `Symbol` বাদ পড়ে (`{a: undefined}` ও `{}` এক হয়ে যায়); `NaN` ও `Infinity` হয়ে যায় `null`; `Date` হয়ে যায় string; circular reference এ error। শুধু ‘জানা গঠনের plain data’ এ ব্যবহার করুন।",
        "**নিজের/library এর deep-equal** — recursion দিয়ে key ও value তুলনা (নিচের real-world উদাহরণ)। `Map`, `Set`, `Date`, `RegExp` এর মতো type এ আলাদা যত্ন লাগে — প্রোডাকশনে সাধারণত যাচাইকৃত library (যেমন lodash এর `isEqual`) ব্যবহার হয়।",
      ],
    },
    {
      type: "code",
      caption: "শুধু Node.js এ চলে (Playground এ নয়): built-in deep-compare এর জন্য `node:util`",
      code: "import { isDeepStrictEqual } from \"node:util\";\n\nconsole.log(isDeepStrictEqual({ a: [1, 2] }, { a: [1, 2] })); // true\n// Browser এ এই module নেই; সেখানে নিজের helper বা library লাগে।",
    },
    { type: "h3", text: "`localeCompare` (সংক্ষেপে)" },
    {
      type: "p",
      text: "string এ `<`/`>` তুলনা code unit ক্রমে হয় — ফলে `'a' > 'B'` হয় `true` (ছোট হাতের অক্ষরের code বড় হাতের চেয়ে বেশি) এবং অ-ইংরেজি অক্ষর (যেমন বাংলা, accent সহ অক্ষর) ভাষার নিয়মে সাজে না। ভাষা-সংবেদনশীল ক্রম বা সমতার জন্য `a.localeCompare(b)` (ঋণাত্মক, `0` বা ধনাত্মক সংখ্যা ফেরত দেয়) অথবা `Intl.Collator` ব্যবহার করুন। `'a'.localeCompare('A', undefined, { sensitivity: 'base' })` → `0` (case উপেক্ষা)। ক্রম ফল locale ও ICU data এর ওপর নির্ভর করতে পারে — তাই exact ক্রম environment ভেদে সামান্য আলাদা হতে পারে।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "১) ‘`==` শুধু value দেখে, `===` type ও value দেখে’ — মোটামুটি ঠিক, কিন্তু `==` এর ভেতরের রূপান্তরের ধাপ (`ToNumber`, `ToPrimitive`) না জানলে ফল অনুমান করা যায় না। ২) ‘`[] == false` মানে `[]` falsy’ — না; `[]` truthy, কিন্তু `==` আলাদা নিয়ম (`ToNumber`) মানে। ৩) ‘`===` দিয়ে object এর কনটেন্ট মেলে’ — মেলে না, শুধু reference। ৪) ‘`null == undefined` তাই `null == 0`ও সত্য হওয়া উচিত’ — না, `null` শুধু `undefined` এর সাথে। ৫) ‘`x == true` দিয়ে x truthy কিনা দেখা যায়’ — যায় না (`2 == true` হলো `false`)।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security note: `==` ও secret তুলনা",
      text: "Authentication/authorization এ `==` ব্যবহার বিপজ্জনক: user এর পাঠানো input এর type (string/number/array/object) আপনার নিয়ন্ত্রণে থাকে না, আর `==` coercion এর কারণে অপ্রত্যাশিত মান ‘সমান’ বিবেচিত হতে পারে (যেমন `0 == ''`, `[] == ''`)। সবসময় `===` এবং আগে input এর type যাচাই করুন। এছাড়া password hash, token বা HMAC তুলনায় সাধারণ `===` এ ‘timing attack’ এর তাত্ত্বিক ঝুঁকি থাকে (সমান-দৈর্ঘ্যের প্রথম অমিল পর্যন্ত তুলনা থামে); server-side এ constant-time তুলনা ব্যবহার করুন — Node.js এ `crypto.timingSafeEqual` (সমান-দৈর্ঘ্যের `Buffer` লাগে)।",
    },
    {
      type: "code",
      caption: "শুধু Node.js (server) এ — Browser এ নয়",
      code: "import { timingSafeEqual } from \"node:crypto\";\n\nfunction safeEqual(a, b) {\n  const ba = Buffer.from(a);\n  const bb = Buffer.from(b);\n  if (ba.length !== bb.length) return false;   // দৈর্ঘ্য আলাদা হলে আগেই false\n  return timingSafeEqual(ba, bb);\n}",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "`==`/`===`/`Object.is` এর আচরণ spec দ্বারা নির্ধারিত — Browser ও Node.js এ একই। একটি Browser-only legacy অদ্ভুততা: `document.all` (পুরোনো ওয়েবের compatibility বস্তু) `== null` তে `true` দেয় কিন্তু `=== undefined` নয় — আজকের কোডে এর ওপর নির্ভর করার কিছু নেই; শুধু জেনে রাখুন। `node:util` এর `isDeepStrictEqual` শুধু Node.js এ আছে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন একটি **বিমানবন্দরের ইমিগ্রেশন** কাউন্টারে দুই ধরনের কর্মকর্তা আছেন, আর আপনাকে প্রশ্ন করা হচ্ছে: ‘এই যাত্রী কি টিকিটে লেখা ব্যক্তিই?’",
    },
    {
      type: "p",
      text: "**`===` কর্মকর্তা** কড়া: পাসপোর্ট (type) ও পাসপোর্টের নম্বর (মান) দুটিই টিকিটের সাথে হুবহু মিলতে হবে। ভিন্ন ধরনের নথি (যেমন জাতীয় পরিচয়পত্র দেখালে) সে সরাসরি বলে ‘মেলে না’ — কোনো অনুমান বা রূপান্তর করে না। আর দুজন যমজ ভাই এলে সেও আলাদা ব্যক্তিই ধরে — যেমন দুটি আলাদা array যাদের ভেতরের জিনিস এক, তবু `===` এ আলাদা (**identity**)।",
    },
    {
      type: "p",
      text: "**`==` কর্মকর্তা** ‘সহায়ক’: আপনি পাসপোর্টের বদলে একটি ছবি দেখালে সে নিজে সেটি অনুবাদ করে, ভাষা বদলে, তারপর মেলায়। অনেক সময় ঠিক করে, কিন্তু কখনো কখনো অতি-সহায়ক হয়ে এমন ব্যক্তিকেও মিলিয়ে দেয় যে আসলে আলাদা (`'' == 0`)। আবার তার ‘অনুবাদ’ এর নিয়ম এত জটিল যে আপনি আগে থেকে বলতে পারবেন না সে কাকে মিলিয়ে দেবে। কেবল একটি বিশেষ নিয়ম সবাই জানে: ‘নথি নেই’ আর ‘নথি অজানা’ — এ দুটিকে সে একই ধরে (`null == undefined`) — আর এই একটিই সুবিধা অনেক টিম সচেতনভাবে নেয়।",
    },
    {
      type: "ul",
      items: [
        "**`Object.is`** হলো সবচেয়ে সূক্ষ্ম কর্মকর্তা — যে ‘+০’ ও ‘−০’ কেও আলাদা ব্যক্তি ধরে, আবার ‘অজানা সংখ্যা’ (`NaN`) দুজনকে একই ধরে।",
        "**Deep-equal** হলো ‘ডিএনএ পরীক্ষা’ — দুজন আলাদা ব্যক্তি হলেও ভেতরের তথ্য (জিন) মেলে কি না তা দেখে; এর জন্য আলাদা যন্ত্র (নিজের লেখা function) লাগে, ইমিগ্রেশন কাউন্টারে থাকে না।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Loose equality: `'0' == false` কীভাবে `true` হয়",
      nodes: [
        { id: "start", label: "a == b", sub: "'0' == false" },
        { id: "same", label: "Type একই?", sub: "হলে strict তুলনা" },
        { id: "nullish", label: "null / undefined?", sub: "শুধু একে অপরের সমান" },
        { id: "bool", label: "Boolean?", sub: "ToNumber(boolean)" },
        { id: "str", label: "String ↔ Number?", sub: "ToNumber(string)" },
        { id: "result", label: "ফল", sub: "" },
      ],
      steps: [
        {
          active: ["start"],
          items: { start: ["'0' == false"] },
          note: "দুটি operand: string `'0'` ও boolean `false`। engine আগে দেখে type এক কি না।",
        },
        {
          active: ["same", "nullish"],
          items: { start: ["'0' == false"], same: ["string ≠ boolean → না"], nullish: ["কোনোটিই null/undefined নয় → না"] },
          note: "Type আলাদা (string বনাম boolean), আর কোনোটিই `null`/`undefined` নয় — তাই এই দুই নিয়ম প্রযোজ্য নয়।",
        },
        {
          active: ["bool"],
          items: { bool: ["false → 0", "এখন: '0' == 0"] },
          note: "একটি operand boolean, তাই সেটি `ToNumber` হয়: `false` → `0`। তুলনা এখন `'0' == 0` — algorithm আবার শুরু।",
        },
        {
          active: ["str"],
          items: { bool: ["false → 0", "এখন: '0' == 0"], str: ["'0' → 0", "এখন: 0 == 0"] },
          note: "এবার string বনাম number, তাই string কে `ToNumber`: `'0'` → `0`। তুলনা এখন `0 == 0`।",
        },
        {
          active: ["same", "result"],
          items: { same: ["number = number → হ্যাঁ"], result: ["0 === 0 → true"] },
          output: "true",
          note: "এখন type একই (number), তাই strict তুলনা: `0 === 0` → `true`। ফল `true` — যদিও `'0'` string আসলে truthy! (`==` truthiness দেখে না, সংখ্যায় রূপান্তর দেখে।)",
        },
      ],
      caption: "ধাপগুলো recursive: প্রতিটি রূপান্তরের পর একই algorithm আবার চলে।",
    },
    {
      kind: "flow-steps",
      title: "`[] == ![]` কেন `true` — তিন ধাপের রূপান্তর",
      nodes: [
        { id: "expr", label: "Expression", sub: "[] == ![]" },
        { id: "not", label: "ধাপ ১: !", sub: "ডান পাশ আগে হিসাব" },
        { id: "boolnum", label: "ধাপ ২: boolean → number", sub: "ToNumber" },
        { id: "prim", label: "ধাপ ৩: object → primitive", sub: "ToPrimitive" },
        { id: "final", label: "চূড়ান্ত তুলনা", sub: "" },
      ],
      steps: [
        {
          active: ["expr", "not"],
          items: { expr: ["[] == ![]"], not: ["![] → false", "([] truthy, তাই ! দিলে false)"] },
          note: "`!` এর precedence `==` এর চেয়ে বেশি, তাই আগে `![]` হিসাব হয়। `[]` একটি object, সেটি truthy; `!` দিলে `false`। এখন তুলনা `[] == false`।",
        },
        {
          active: ["boolnum"],
          items: { boolnum: ["false → 0", "এখন: [] == 0"] },
          note: "একটি operand boolean — তাই `false` → `0`। তুলনা এখন `[] == 0` (object বনাম number)।",
        },
        {
          active: ["prim"],
          items: { prim: ["[] → '' (ToPrimitive)", "এখন: '' == 0"] },
          note: "Object বনাম number — object কে `ToPrimitive`। `[]` এর `valueOf` object ই ফেরত দেয় (primitive নয়), তাই `toString()` ডাকা হয়, যা খালি array এর জন্য `''` দেয়। তুলনা এখন `'' == 0`।",
        },
        {
          active: ["final"],
          items: { final: ["'' → 0", "0 == 0 → true"] },
          output: "true",
          note: "string বনাম number: `''` → `ToNumber('')` = `0`। `0 == 0` → `true`। অর্থাৎ **একটি truthy object এর সাথে তার নিজের negation এর `==` সত্য** — `==` এর অ-বোধগম্যতার সবচেয়ে বিখ্যাত উদাহরণ।",
        },
      ],
      caption: "এই কারণেই কোড review এ `==` এ প্রশ্ন ওঠে।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "=== বনাম ==, NaN ও Object.is",
      description: "মৌলিক তুলনা: strict ও loose এর প্রথম পার্থক্য, `null`/`undefined`, `NaN`, এবং `+0/-0`।",
      code: `console.log(5 === 5, 5 === "5", 5 == "5");
console.log(null == undefined, null === undefined);

console.log(NaN === NaN, NaN == NaN);
console.log(Number.isNaN(NaN), Object.is(NaN, NaN));

console.log(0 === -0, Object.is(0, -0));`,
    },
    {
      level: "intermediate",
      title: "চমকপ্রদ table — প্রতিটির পেছনের রূপান্তর",
      description: "প্রতিটি লাইনের ফল অনুমান করুন, তারপর concept এর algorithm দিয়ে মিলিয়ে দেখুন। শেষে transitivity ভাঙার প্রমাণ।",
      code: `console.log("'' == 0       ->", "" == 0);
console.log("'0' == false  ->", "0" == false);
console.log("null == 0     ->", null == 0);
console.log("null == false ->", null == false);
console.log("[] == ![]     ->", [] == ![]);
console.log("[1] == 1      ->", [1] == 1);
console.log("'true' == true->", "true" == true);

// transitivity ভাঙে
console.log("'' == 0:", "" == 0, "| 0 == '0':", 0 == "0", "| '' == '0':", "" == "0");

// custom object: ToPrimitive
const price = { valueOf() { return 42; } };
console.log(price == 42, price === 42);`,
    },
    {
      level: "real-world",
      title: "x == null idiom, includes বনাম indexOf, deepEqual",
      description: "বাস্তবে যেখানে তুলনা কাজে লাগে: ‘অনুপস্থিত’ যাচাই, NaN সহ array খোঁজা, এবং object কে value দিয়ে তুলনা করা একটি ছোট deep-equal function।",
      code: `// ১) একমাত্র গ্রহণযোগ্য == : null অথবা undefined
function isMissing(x) {
  return x == null;
}
console.log(isMissing(null), isMissing(undefined), isMissing(0), isMissing(""));

// ২) includes (SameValueZero) বনাম indexOf (strict)
const arr = [1, NaN, 3];
console.log(arr.indexOf(NaN), arr.includes(NaN));

// ৩) structural equality
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}

const x = { id: 1, tags: ["a", "b"], meta: { ok: true } };
const y = { meta: { ok: true }, tags: ["a", "b"], id: 1 };
console.log(x === y, deepEqual(x, y));
console.log(deepEqual({ a: undefined }, { b: undefined }));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log(1 == "1", 1 === "1");
`,
    },
    {
      label: "Reference identity",
      code: `const a = [1, 2];
const b = [1, 2];
const c = a;

console.log(a === b);   // আলাদা object
console.log(a === c);   // একই object এর দুটি নাম

c.push(3);
console.log(a);         // a ও বদলে গেছে
console.log({} === {}, [] === []);

function sameRef(x, y) { return x === y; }
const user = { name: "Rina" };
console.log(sameRef(user, user), sameRef(user, { name: "Rina" }));`,
    },
    {
      label: "Object.is ও Array এর methods",
      code: `console.log(Object.is(NaN, NaN), NaN === NaN);
console.log(Object.is(0, -0), 0 === -0);
console.log(Object.is(5, 5), Object.is("a", "a"), Object.is({}, {}));

const arr = [0, NaN];
console.log(arr.indexOf(NaN), arr.includes(NaN));
console.log([-0].includes(0), [-0].indexOf(0));

const m = new Map([[NaN, "found"]]);
console.log(m.get(NaN));`,
    },
    {
      label: "ToPrimitive: object == primitive",
      code: `const a = { valueOf() { return 7; } };
const b = { toString() { return "hello"; } };
const c = { [Symbol.toPrimitive](hint) { return hint === "number" ? 1 : "one"; } };

console.log(a == 7, a == "7");
console.log(b == "hello");
console.log(c == 1, c == "one");

console.log([1, 2] == "1,2");
console.log({} == "[object Object]");
console.log(new Date(0) == new Date(0));`,
    },
    {
      label: "JSON.stringify এর সীমাবদ্ধতা",
      code: `console.log(JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 }));
console.log(JSON.stringify({ a: undefined }) === JSON.stringify({}));
console.log(JSON.stringify({ n: NaN }));
console.log(JSON.stringify([1, undefined, function () {}]));

// নিরাপদ বিকল্প: sort করা key দিয়ে
const sameKeys = (x, y) => JSON.stringify(Object.entries(x).sort()) === JSON.stringify(Object.entries(y).sort());
console.log(sameKeys({ a: 1, b: 2 }, { b: 2, a: 1 }));`,
    },
    {
      label: "localeCompare",
      code: `console.log("a" < "B", "a".localeCompare("B") < 0);
console.log(["b", "a", "C"].sort());
console.log(["b", "a", "C"].sort((x, y) => x.localeCompare(y)));
console.log("a".localeCompare("A", undefined, { sensitivity: "base" }));
console.log("a".localeCompare("a"));`,
    },
  ],

  debugging: [
    {
      title: "খালি input কে `0` ভাবা",
      bad: `const qty = "";   // form এর খালি ঘর
if (qty == 0) {
  console.log("quantity is zero");
} else {
  console.log("quantity is not zero");
}`,
      why: "`'' == 0` হলো `true`, কারণ `ToNumber('')` = `0`। তাই কেউ কিছুই লেখেনি, অথচ কোড ‘quantity শূন্য’ ধরে নিল। form value সবসময় string, তাই আগে স্পষ্টভাবে রূপান্তর ও যাচাই করুন, এবং `===` ব্যবহার করুন।",
      fix: `const qty = "";
if (qty === "") {
  console.log("quantity is empty");
} else if (Number(qty) === 0) {
  console.log("quantity is zero");
} else {
  console.log("quantity is not zero");
}`,
    },
    {
      title: "`=== NaN` দিয়ে NaN যাচাই",
      bad: `const n = Number("abc");
console.log(n === NaN);`,
      why: "`NaN` কোনো কিছুর সমান নয়, নিজেরও নয় — `NaN === NaN` সবসময় `false`। তাই এই যাচাই কখনোই `true` দেয় না এবং আপনি ভুল করে ‘সংখ্যাটি বৈধ’ ভাববেন।",
      fix: `const n = Number("abc");
console.log(Number.isNaN(n));   // বা Object.is(n, NaN)`,
    },
    {
      title: "Array কে `===` দিয়ে তুলনা",
      bad: `const expected = [1, 2, 3];
const actual = [1, 2, 3];
console.log(actual === expected);`,
      why: "`===` object এ শুধু **reference** তুলনা করে। `actual` ও `expected` দুটি আলাদা array object, ভেতরের মান একই হলেও ফল `false`। (টেস্ট লেখার সময় এই ভুল খুব হয়।)",
      fix: `const expected = [1, 2, 3];
const actual = [1, 2, 3];
const sameArray = actual.length === expected.length && actual.every((v, i) => v === expected[i]);
console.log(sameArray);`,
    },
    {
      title: "`x == true` দিয়ে truthiness যাচাই",
      bad: `const flag = 2;
if (flag == true) {
  console.log("enabled");
} else {
  console.log("disabled");
}`,
      why: "`true` আগে `1` এ রূপান্তরিত হয়, তাই `2 == true` হলো `2 == 1` → `false`। অথচ `2` একটি truthy মান। boolean এর সাথে `==` কখনো truthiness যাচাই করে না। truthiness চাইলে সরাসরি `if (flag)` বা `Boolean(flag)` লিখুন।",
      fix: `const flag = 2;
if (flag) {
  console.log("enabled");
} else {
  console.log("disabled");
}`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "== ও === এর ফল",
      prompt: "`___` এর জায়গায় operator বসান: প্রথমটিতে loose equality, দ্বিতীয়টিতে strict equality — যাতে `true false` print হয়।",
      starter: `console.log(5 ___ "5", 5 ___ "5");`,
      expected: "true false",
      hints: ["loose equality এ string কে number এ রূপান্তর করা হয়।", "strict equality তে type আলাদা হলেই `false`।"],
      solution: `console.log(5 == "5", 5 === "5");`,
    },
    {
      level: "beginner",
      title: "NaN সঠিকভাবে যাচাই",
      prompt: "`value` আসলে `NaN` কিনা জানতে কোডটি ঠিক করুন, যেন `true` print হয়।",
      starter: `const value = Number("abc");
console.log(value === NaN);`,
      expected: "true",
      hints: ["`NaN` কোনো কিছুর সমান নয়।", "`Number.isNaN(...)` ব্যবহার করুন।"],
      solution: `const value = Number("abc");
console.log(Number.isNaN(value));`,
    },
    {
      level: "beginner",
      title: "`x == null` idiom",
      prompt: "`isMissing(x)` function এ `x` শুধু `null` বা `undefined` হলে `true` ফেরত দিন; `0` ও `''` এর জন্য `false`। `==` ব্যবহার করে এক লাইনে লিখুন।",
      starter: `function isMissing(x) {
  return false; // TODO
}
console.log(isMissing(null), isMissing(undefined), isMissing(0), isMissing(""));`,
      expected: "true true false false",
      hints: ["`null` loose equality তে শুধু `undefined` ও `null` এর সমান।"],
      solution: `function isMissing(x) {
  return x == null;
}
console.log(isMissing(null), isMissing(undefined), isMissing(0), isMissing(""));`,
    },
    {
      level: "intermediate",
      title: "দুটি array কি value তে সমান?",
      prompt: "`sameArray(a, b)` লিখুন যা দুটি (এক-স্তরের) array এর দৈর্ঘ্য ও প্রতিটি element `===` দিয়ে তুলনা করে।",
      starter: `function sameArray(a, b) {
  return a === b; // TODO: value দিয়ে তুলনা করুন
}
console.log(sameArray([1, 2, 3], [1, 2, 3]), sameArray([1, 2, 3], [1, 2, 4]));`,
      expected: "true false",
      hints: ["আগে `length` মেলান।", "`a.every((v, i) => v === b[i])`"],
      solution: `function sameArray(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
console.log(sameArray([1, 2, 3], [1, 2, 3]), sameArray([1, 2, 3], [1, 2, 4]));`,
      explanation: "`===` দুটি array এর reference তুলনা করে, তাই সরাসরি ব্যবহার করলে `false` আসে। দৈর্ঘ্য মিলিয়ে প্রতিটি element তুলনা করলেই value-equality পাওয়া যায়। (nested হলে recursion লাগে।)",
    },
    {
      level: "intermediate",
      title: "NaN সহ array: indexOf বনাম includes",
      prompt: "`arr = [1, NaN, 3]`। এক লাইনে print করুন `arr.indexOf(NaN)`, `arr.includes(NaN)` এবং `NaN` এর index (`findIndex` ও `Number.isNaN` দিয়ে) — আউটপুট `-1 true 1`।",
      starter: `const arr = [1, NaN, 3];
console.log(arr.indexOf(NaN));
// TODO: includes ও findIndex যোগ করে এক লাইনে print করুন`,
      expected: "-1 true 1",
      hints: ["`indexOf` strict equality ব্যবহার করে, তাই NaN খুঁজে পায় না।", "`arr.findIndex(Number.isNaN)`"],
      solution: `const arr = [1, NaN, 3];
console.log(arr.indexOf(NaN), arr.includes(NaN), arr.findIndex(Number.isNaN));`,
      explanation: "`indexOf` strict equality ব্যবহার করে (`NaN !== NaN`) তাই `-1`। `includes` SameValueZero ব্যবহার করে, তাই `true`। `findIndex` এ predicate দিয়ে `Number.isNaN` কাজে লাগালে সঠিক index `1` পাওয়া যায়।",
    },
    {
      level: "challenge",
      title: "নিজের deepEqual লিখুন",
      prompt:
        "`deepEqual(a, b)` লিখুন যা nested object/array কে value দিয়ে তুলনা করে। শর্ত: key এর ক্রম গুরুত্বহীন; `NaN` নিজের সমান ধরা হবে; `{ a: undefined }` ও `{ b: undefined }` সমান নয়; array ও object আলাদা। ছয়টি পরীক্ষা চালিয়ে ফল print করুন।",
      starter: `function deepEqual(a, b) {
  return a === b; // TODO
}

console.log(deepEqual({ a: 1, b: [1, 2, { c: 3 }] }, { b: [1, 2, { c: 3 }], a: 1 }));
console.log(deepEqual({ a: 1 }, { a: 2 }));
console.log(deepEqual([1, 2], [1, 2, 3]));
console.log(deepEqual(NaN, NaN));
console.log(deepEqual({ a: undefined }, { b: undefined }));
console.log(deepEqual([], {}));`,
      expected: "true\nfalse\nfalse\ntrue\nfalse\nfalse",
      hints: [
        "শুরুতে `Object.is(a, b)` দিয়ে primitive ও একই reference সামলান (NaN ও এখানে সত্য দেয়)।",
        "কোনোটি object না হলে বা `null` হলে `false`; `Array.isArray(a) !== Array.isArray(b)` হলেও `false`।",
        "`Object.keys` এর দৈর্ঘ্য মেলান, তারপর প্রতিটি key এর জন্য `Object.hasOwn(b, k)` ও recursion।",
      ],
      solution: `function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}

console.log(deepEqual({ a: 1, b: [1, 2, { c: 3 }] }, { b: [1, 2, { c: 3 }], a: 1 }));
console.log(deepEqual({ a: 1 }, { a: 2 }));
console.log(deepEqual([1, 2], [1, 2, 3]));
console.log(deepEqual(NaN, NaN));
console.log(deepEqual({ a: undefined }, { b: undefined }));
console.log(deepEqual([], {}));`,
      explanation: "`Object.is` primitive ও NaN কে সামলায়। এরপর দুটিই object না হলে `false`। key সংখ্যা সমান হলে প্রতিটি key `b` এর নিজস্ব কি না (`Object.hasOwn`) দেখে recursion — তাই `{a: undefined}` ও `{b: undefined}` আলাদা ধরা পড়ে। এই সংস্করণ `Date`, `Map`, `Set` কে বিশেষভাবে সামলায় না — প্রোডাকশনে যাচাইকৃত library ভালো।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`console.log([] == ![])` কী print করবে?",
        options: ["`false`", "`true`", "TypeError", "`undefined`"],
        answer: 1,
        explanation:
          "`![]` হলো `false` (`[]` truthy)। তুলনা হয়ে যায় `[] == false` → `false` কে `0` → `[] == 0` → `[]` এর `ToPrimitive` = `''` → `'' == 0` → `0 == 0` → `true`। `false` ভাবলে ‘truthy object কখনো তার negation এর সমান হতে পারে না’ — ভাবা হচ্ছে, যা `==` এ খাটে না। TypeError বা `undefined` এখানে আসার কোনো পথ নেই।",
      },
      {
        question: "`console.log(null == 0, null >= 0)` কী print করবে?",
        options: ["`true true`", "`false false`", "`false true`", "`true false`"],
        answer: 2,
        explanation:
          "`null == 0` → `false`, কারণ `==` এ `null` শুধু `undefined` এর সমান। কিন্তু `>=` তুলনা `==` নিয়ম মানে না; সেখানে `null` কে `ToNumber` করে `0` ধরা হয়, তাই `null >= 0` → `true`। এই অসঙ্গতিই এক আশ্চর্য ‘গোপন’ বিষয়: `null` এর সাথে `==` ও `>=` আলাদা নিয়মে চলে।",
      },
      {
        question: "`console.log(Object.is(NaN, NaN), NaN === NaN, [NaN].includes(NaN))` কী print করবে?",
        options: ["`true false true`", "`true true true`", "`false false false`", "`false true false`"],
        answer: 0,
        explanation:
          "`Object.is` (SameValue) `NaN` কে নিজের সমান ধরে → `true`। `===` এ `NaN` নিজেরও সমান নয় → `false`। `includes` SameValueZero ব্যবহার করে, যা `NaN` কে সমান ধরে → `true`। অন্য অপশনগুলোতে হয় `===` এর আচরণ সব জায়গায় ধরা হয়েছে, নয়তো `NaN` কে সাধারণ সংখ্যার মতো ধরা হয়েছে।",
      },
      {
        question: "কোনটির ফল `false`?",
        options: ["`null == undefined`", "`'' == 0`", "`'1' == true`", "`'0' == ''`"],
        answer: 3,
        explanation:
          "`'0' == ''` — দুটিই string, তাই type একই এবং strict তুলনা হয়; অক্ষর আলাদা, ফল `false`। `null == undefined` বিশেষ নিয়মে `true`। `'' == 0` → `0 == 0` → `true`। `'1' == true` → `true → 1`, `'1' → 1` → `true`। এখানে লক্ষ্য রাখুন, `'' == 0` ও `0 == '0'` সত্য হলেও `'' == '0'` মিথ্যা — `==` transitive নয়।",
      },
      {
        question: "`x == null` কখন `true` হয়?",
        options: ["`x` শুধু `null` হলে", "`x` `null` বা `undefined` হলে", "`x` `null`, `undefined`, `0` বা `''` হলে", "`x` যেকোনো falsy হলে"],
        answer: 1,
        explanation:
          "Loose equality তে `null` কেবল `null` ও `undefined` এর সমান, অন্য কিছুর নয়। তাই `x == null` ≡ `x === null || x === undefined`। ‘শুধু null’ ভাবলে `undefined` বাদ পড়ে; `0`, `''` বা সব falsy ধরলে ভুল — `null == 0` ও `null == ''` উভয়ই `false`।",
      },
    ],
    coding: [
      {
        title: "=== বনাম Object.is",
        prompt: "`compare(a, b)` লিখুন যা `a === b` ও `Object.is(a, b)` এর ফল একটি string এ (`'<strict> <is>'`) ফেরত দেয়। `NaN, NaN` ও `0, -0` এর জন্য print করুন।",
        starter: `function compare(a, b) {
  // TODO
}
console.log(compare(NaN, NaN));
console.log(compare(0, -0));`,
        expected: "false true\ntrue false",
        solution: `function compare(a, b) {
  return (a === b) + " " + Object.is(a, b);
}
console.log(compare(NaN, NaN));
console.log(compare(0, -0));`,
      },
      {
        title: "ভাষা-সংবেদনশীল sort",
        prompt: "`['b', 'a', 'C']` কে `localeCompare` দিয়ে সাজিয়ে print করুন, যাতে case গুরুত্ব না পেয়ে `[ 'a', 'b', 'C' ]` আসে (সাধারণ `sort()` দেয় `[ 'C', 'a', 'b' ]`)।",
        starter: `const letters = ["b", "a", "C"];
// TODO
console.log(letters);`,
        expected: "[ 'a', 'b', 'C' ]",
        solution: `const letters = ["b", "a", "C"];
letters.sort((x, y) => x.localeCompare(y));
console.log(letters);`,
      },
    ],
  },

  interview: [
    {
      q: "`==` ও `===` এর পার্থক্য কী? কেন `===` ব্যবহার করা উচিত?",
      a: "`===` কোনো type রূপান্তর ছাড়াই তুলনা করে: type আলাদা হলে `false`, নইলে মান (object এ reference) মেলানো হয়। `==` type আলাদা হলে আগে একটি নির্দিষ্ট algorithm এ রূপান্তর করে — string কে number, boolean কে number, object কে `ToPrimitive` — তারপর তুলনা করে।\n\n`===` বেছে নেওয়ার কারণ **predictability** ও **intent এর স্পষ্টতা**। `==` এ `'' == 0`, `'0' == false`, `[] == ![]` সবই `true`, অথচ `'' == '0'` `false` — অর্থাৎ transitivity ও ভাঙে। form/API data এর type অনিশ্চিত, তাই নীরব coercion bug তৈরি করে। ESLint এর `eqeqeq` rule এ তাই `==` নিষিদ্ধ করা হয়, শুধু `x == null` কে অনেক সময় ব্যতিক্রম রাখা হয়।",
    },
    {
      q: "Loose equality এর algorithm ধাপে ধাপে বলুন।",
      a: "১) type একই হলে strict equality। ২) `null` ও `undefined` পরস্পরের সমান, অন্য কিছুর নয়। ৩) number বনাম string হলে string কে `ToNumber`। ৪) boolean থাকলে সেটিকে `ToNumber` (`true → 1`, `false → 0`) করে আবার তুলনা। ৫) object বনাম string/number/symbol হলে object কে `ToPrimitive` (`Symbol.toPrimitive`, নইলে `valueOf`/`toString`) করে আবার তুলনা। ৬) object বনাম object হলে reference এক কিনা। ৭) বাকি সব `false`।\n\nধাপগুলো recursive — প্রতিটি রূপান্তরের পর আবার ধাপ ১ থেকে শুরু। উদাহরণ: `'0' == false` → `'0' == 0` → `0 == 0` → `true`। এই ধাপগুলো মুখে বলে দেখাতে পারা ইন্টারভিউয়ে সবচেয়ে ভালো উত্তর।",
    },
    {
      q: "`NaN === NaN` কেন `false`? `NaN` কীভাবে নিরাপদে যাচাই করবেন?",
      a: "IEEE 754 floating-point মান অনুযায়ী `NaN` (Not a Number) কোনো মানের সাথেই সমান নয়, নিজের সাথেও নয় — কারণ ‘অকার্যকর গাণিতিক ফল’ দুটি আলাদা উৎস থেকে আসতে পারে এবং তারা এক নয়। JavaScript এ এটি `===` ও `==` উভয়েই `false`।\n\nনিরাপদ যাচাই: `Number.isNaN(x)` (শুধু সত্যিকারের `NaN` এ `true`), অথবা `Object.is(x, NaN)`। গ্লোবাল `isNaN(x)` এড়িয়ে চলুন — সেটি আগে `x` কে সংখ্যায় রূপান্তর করে, তাই `isNaN('abc')` হয় `true`। Array তে `NaN` খুঁজতে `indexOf` কাজ করে না (strict), `includes` করে।",
    },
    {
      q: "`Object.is` ও `===` এর পার্থক্য কী? কখন `Object.is` দরকার?",
      a: "দুটি জায়গায় পার্থক্য: `Object.is(NaN, NaN)` → `true` (যেখানে `NaN === NaN` → `false`), এবং `Object.is(0, -0)` → `false` (যেখানে `0 === -0` → `true`)। বাকি সব ক্ষেত্রে (string, boolean, object reference ইত্যাদি) ফল এক।\n\nবাস্তবে এর প্রয়োজন কম। React এর মতো library state পরিবর্তন ধরতে `Object.is` ব্যবহার করে। গাণিতিক কোডে `+0`/`-0` আলাদা করতে হলে (যেমন দিক বোঝানো) বা `NaN` কে ‘সমান’ ধরতে চাইলে কাজে লাগে। সাধারণ কোডে `===` ই যথেষ্ট। এছাড়া Array এর `includes`, `Map` ও `Set` ‘SameValueZero’ ব্যবহার করে, যা `Object.is` এর মতো তবে `+0` ও `-0` কে সমান ধরে।",
    },
    {
      q: "দুটি object বা array কে value দিয়ে কীভাবে তুলনা করবেন?",
      a: "`===` শুধু reference দেখে, তাই দুটি আলাদা তৈরি করা object এ সবসময় `false`। বিকল্পগুলো: (১) ছোট flat array তে দৈর্ঘ্য ও `every` দিয়ে element তুলনা। (২) `JSON.stringify(a) === JSON.stringify(b)` — সহজ, কিন্তু key এর ক্রম আলাদা হলে ভুল, `undefined`/function বাদ পড়ে, `NaN` হয় `null`, `Date` হয় string, circular reference এ error — তাই কেবল জানা গঠনের plain data এ। (৩) নিজের recursive `deepEqual` অথবা lodash `isEqual` — `Map`, `Set`, `Date`, প্রোটোটাইপ ইত্যাদি সামলাতে যাচাইকৃত library ভালো। Node.js এ `util.isDeepStrictEqual`।\n\nটেস্টিং framework এ (`toEqual` বনাম `toBe`) এই পার্থক্যটিই কাজ করে: `toBe` identity, `toEqual` structural।",
    },
    {
      q: "`x == null` কেন গ্রহণযোগ্য ব্যতিক্রম, এবং `if (x == true)` কেন ভুল?",
      a: "`x == null` ঠিক `x === null || x === undefined` এর সমান, কারণ loose equality তে `null` কেবল `null` ও `undefined` এর সাথে সমান। এটি সংক্ষিপ্ত ও নির্ভরযোগ্য, তাই অনেক team `eqeqeq` rule এ এটি ছাড় দেয় — তবে আধুনিক কোডে `??` ও `?.` অনেক সময় আরও স্পষ্ট বিকল্প, এবং টিমের কনভেনশন মানা জরুরি।\n\n`x == true` ভুল কারণ `true` আগে `1` হয়ে যায়: `2 == true` হলো `2 == 1` → `false`, যদিও `2` truthy। `'yes' == true`ও `false`। boolean এর সাথে `==` কখনো truthiness বোঝায় না। truthiness চাইলে সরাসরি `if (x)` বা `Boolean(x)`; নির্দিষ্ট boolean চাইলে `x === true`।",
    },
  ],

  summary: {
    takeaways: [
      "`===` কোনো রূপান্তর করে না: type আলাদা হলে `false`; object এ শুধু reference তুলনা।",
      "`==` একটি recursive algorithm চালায়: null/undefined বিশেষ নিয়ম, string/boolean → number, object → `ToPrimitive`; তাই `'' == 0`, `'0' == false`, `[] == ![]` সব `true` কিন্তু `'' == '0'` `false` (non-transitive)।",
      "`NaN` কোনো কিছুর সমান নয় — `Number.isNaN` বা `Object.is` ব্যবহার করুন; `includes` NaN পায়, `indexOf` পায় না।",
      "`Object.is` ≈ `===`, তবে `NaN` সমান ও `+0` ≠ `-0`।",
      "Object/array কে value দিয়ে তুলনা করতে নিজের/library এর deep-equal লাগে; `JSON.stringify` ভঙ্গুর।",
      "ডিফল্ট `===`; একমাত্র সাধারণ ব্যতিক্রম `x == null`; `x == true` কখনো নয়; secret তুলনায় constant-time (Node: `crypto.timingSafeEqual`)।",
    ],
    syntax: `a === b            // strict: type ও মান
a !== b
x == null          // null বা undefined (একমাত্র গ্রহণযোগ্য ==)
Number.isNaN(x)    // NaN যাচাই
Object.is(a, b)    // SameValue: NaN সমান, +0 ≠ -0
arr.includes(x)    // SameValueZero
a.localeCompare(b) // ভাষা-সংবেদনশীল তুলনা`,
    whenToUse: [
      "সবসময় ডিফল্ট: `===` ও `!==`।",
      "‘null বা undefined’ যাচাই: `x == null` (টিম কনভেনশন মানলে) বা স্পষ্ট `x === null || x === undefined`।",
      "`NaN` যাচাই: `Number.isNaN`।",
      "Object এর কনটেন্ট তুলনা: নিজের/library `deepEqual`; plain data তে সতর্কভাবে `JSON.stringify`।",
      "ভাষা-সংবেদনশীল string সাজানো/তুলনা: `localeCompare` বা `Intl.Collator`।",
    ],
    next: ["Truthy ও Falsy", "Type Conversion ও Coercion", "Primitive বনাম Reference Types", "Objects ও Immutability"],
  },

  compatibility:
    "`==`, `===`, `Number.isNaN`, `localeCompare` সব browser ও Node.js এ আছে। `Object.is` ES2015, `Array.prototype.includes` ES2016, `Object.hasOwn` ES2022 (Node 16.9+, আধুনিক browser)। তুলনার আচরণ spec দ্বারা নির্ধারিত — Browser ও Node.js এ একই। `localeCompare` ও `Intl.Collator` এর ক্রম ICU/locale data এর ওপর নির্ভর করে, তাই environment ভেদে সামান্য ভিন্ন হতে পারে। `node:util` এর `isDeepStrictEqual` ও `node:crypto` এর `timingSafeEqual` শুধু Node.js এ; Browser এ নেই। এই Playground browser-like Web Worker এ চলে।",
};
