import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Type coercion (implicit conversion) কী, কেন হয় এবং explicit conversion থেকে এর পার্থক্য কোথায় — তা নিজের ভাষায় বলতে পারবেন।",
    "`+` অপারেটর কখন string concatenation আর কখন numeric addition করে — engine এর সিদ্ধান্ত-প্রক্রিয়া ধাপে ধাপে বর্ণনা করতে পারবেন।",
    "`-`, `*`, `/`, তুলনা (`<`, `>=`) এবং `if/&&/||` এ কোন abstract operation (ToNumber, ToString, ToBoolean) চলে তা বলতে পারবেন।",
    "`ToPrimitive` — `valueOf`, `toString`, `Symbol.toPrimitive` এবং hint (`default/number/string`) — এর কাজ বুঝে কাস্টম object কে নিয়ন্ত্রিতভাবে coerce করাতে পারবেন।",
    "`[] + {}`, `'5' - 2`, `'5' + 2`, `true + 1`, `null + 1`, `undefined + 1` এর মতো ক্লাসিক ফল কোনো কোড না চালিয়েই নিয়ম থেকে অনুমান করতে পারবেন।",
    "Coercion সংক্রান্ত bug (ও নিরাপত্তা ঝুঁকি) এড়ানোর কৌশল — explicit conversion, `===`, lint/TypeScript নিয়ম — প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Type coercion কী এবং কেন আছে?" },
    {
      type: "p",
      text: "JavaScript এ অপারেটর ও অনেক built-in function আশা করে নির্দিষ্ট type এর মান: `*` চায় সংখ্যা, `if` চায় boolean, string মেশাতে চাইলে string। কিন্তু আপনি যদি অন্য type এর মান দেন, ভাষা **error না দিয়ে নিজে থেকে মানটিকে প্রয়োজনীয় type এ রূপান্তর করে নেয়**। এই স্বয়ংক্রিয়, অদৃশ্য রূপান্তরকে বলে **type coercion (implicit conversion)**। যেমন `'6' * '7'` তে আপনি কোনো `Number()` লেখেননি, তবু ফল `42`।",
    },
    {
      type: "p",
      text: "এর পেছনে ঐতিহাসিক কারণ আছে: JavaScript কে ১৯৯৫ সালে browser এ ছোট script লেখার জন্য বানানো হয়েছিল, যেখানে form এর সব মান string। ‘ভুল type পেলে ক্র্যাশ’ এর বদলে ‘যথাসাধ্য চালিয়ে যাও’ নীতি নেওয়া হয়েছিল। ফলে ভাষাটি সুবিধাজনক হলেও কিছু অপ্রত্যাশিত ফল দেয়, যেগুলো backward-compatibility এর কারণে আর বদলানো যায় না। আমাদের কাজ — নিয়মগুলো এমনভাবে বোঝা যাতে ‘আশ্চর্য’ ফলও অনুমানযোগ্য হয়ে যায়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Conversion বনাম Coercion",
      text: "আগের **Type Conversion** lesson এ আপনি নিজে `Number(x)` লিখে রূপান্তর করেছেন — সেটি explicit। এই lesson এ রূপান্তর engine নিজে করে — সেটি implicit। ভেতরের algorithm (ToNumber, ToString, ToBoolean) একই; পার্থক্য হলো **কে সিদ্ধান্ত নিচ্ছে** এবং কোডে তা দৃশ্যমান কি না।",
    },
    { type: "h3", text: "Abstract operation: ভেতরের চারটি যন্ত্র" },
    {
      type: "p",
      text: "ECMAScript specification এ রূপান্তরের জন্য কয়েকটি **abstract operation** আছে — এগুলো কোডে ডাকা যায় না, শুধু ভাষার আচরণ বর্ণনা করার জন্য spec এর ভেতরের ‘ফাংশন’। conceptual ভাবে এগুলো চিনে রাখলেই প্রায় সব coercion বোঝা যায়:",
    },
    {
      type: "ul",
      items: [
        "**ToPrimitive(value, hint)** — object কে primitive এ বদলায়। primitive ইনপুট এলে কিছুই করে না। এটি সব object-coercion এর প্রথম ধাপ।",
        "**ToNumber(value)** — সংখ্যায় রূপান্তর (নিয়মগুলো Type Conversion lesson এর `Number()` এর মতোই: `''` → `0`, `null` → `0`, `undefined` → `NaN`, `'12px'` → `NaN`, `true` → `1`)। `Symbol` এ `TypeError`। (BigInt এর জন্য `ToNumeric` নামে সামান্য আলাদা ধাপ আছে যা number বা bigint ফেরত দেয়।)",
        "**ToString(value)** — string এ রূপান্তর: `null` → `'null'`, `undefined` → `'undefined'`, `true` → `'true'`, সংখ্যা → তার দশমিক রূপ। `Symbol` কে implicit ভাবে string করতে গেলে `TypeError`।",
        "**ToBoolean(value)** — মাত্র আটটি falsy মান (`false, 0, -0, 0n, '', null, undefined, NaN`), বাকি সব truthy। এটি কখনো error দেয় না।",
      ],
    },
    { type: "h3", text: "কোন অপারেটর কোন রূপান্তর চালায়" },
    {
      type: "compare",
      headers: ["অপারেটর / context", "যে রূপান্তর চলে", "উদাহরণ ও ফল"],
      rows: [
        ["`a + b`", "দুই পাশেই ToPrimitive; কোনো একদিক string হলে দুটিই ToString ও জোড়া লাগে, নইলে দুটিই ToNumeric ও যোগ", "`'5' + 2` → `'52'`; `true + 1` → `2`"],
        ["`-`, `*`, `/`, `%`, `**`", "দুই পাশেই ToNumeric (সংখ্যা)", "`'5' - 2` → `3`; `'6' * '7'` → `42`"],
        ["unary `+x`, `-x`", "ToNumber", "`+'3'` → `3`; `+''` → `0`"],
        ["`<`, `>`, `<=`, `>=`", "ToPrimitive (hint number); দুটিই string হলে অক্ষরক্রম অনুযায়ী তুলনা, নইলে সংখ্যায়", "`'10' < '9'` → `true`; `10 < '9'` → `false`"],
        ["`if`, `!`, `?:`, `&&`, `||`, `while`", "ToBoolean (শুধু সিদ্ধান্তের জন্য; `&&`/`||` মূল operand ই ফেরত দেয়, boolean নয়)", "`'' || 'default'` → `'default'`"],
        ["Template literal, `String(x)`, property key", "ToString (hint string)", "`String([1,2])` → `'1,2'`"],
        ["`==`", "আলাদা জটিল নিয়ম — **Equality lesson** এ", "এখানে আলোচনা করা হচ্ছে না"],
      ],
    },
    { type: "h3", text: "`+` এর সিদ্ধান্ত: সবচেয়ে গুরুত্বপূর্ণ নিয়ম" },
    {
      type: "p",
      text: "`+` একমাত্র অপারেটর যা দুই কাজ করে — যোগ ও string জোড়া। engine এর ধাপগুলো (সরলীকৃত): **(১)** দুই operand কে `ToPrimitive` (hint `default`) দিয়ে primitive বানাও। **(২)** এখন যদি দুটির **যেকোনো একটি string** হয়, তবে অন্যটিকেও `ToString` করে দুটি জোড়া লাগাও। **(৩)** নইলে দুটিকেই `ToNumeric` করে যোগ করো। মনে রাখার সূত্র: ‘string ‘জেতে’’ — একটি string থাকলেই concatenation।",
    },
    {
      type: "code",
      caption: "`+` এর নিয়ম থেকে ফল অনুমান (Playground এ চালিয়ে মিলিয়ে নিন)",
      code: `console.log("5" + 2);       // "52"  — string আছে → concat
console.log(5 + 2);         // 7
console.log(1 + 2 + "3");   // "33" — বাম থেকে ডানে: (1+2)=3, তারপর 3+"3"
console.log("1" + 2 + 3);   // "123"
console.log(true + 1);      // 2    — string নেই → ToNumeric: true→1
console.log(null + 1);      // 1    — null→0
console.log(undefined + 1); // NaN  — undefined→NaN
console.log([] + {});       // "[object Object]" — [] → "" , {} → "[object Object]"`,
    },
    {
      type: "p",
      text: "`-`, `*`, `/` এ এই দ্বন্দ্ব নেই: এগুলো সবসময় সংখ্যা চায়। তাই `'5' - 2` হলো `3` (string `'5'` কে ToNumber), যদিও `'5' + 2` হলো `'52'`। একই দুই operand, শুধু অপারেটর বদলে সম্পূর্ণ ভিন্ন ফল — এই পার্থক্যই সবচেয়ে বেশি bug এর কারণ।",
    },
    { type: "h3", text: "ToPrimitive: object কীভাবে primitive হয়" },
    {
      type: "p",
      text: "অপারেটর object পেলে ToPrimitive চলে, সাথে একটি **hint** থাকে: `'number'` (যেমন `*`, `-`, `<`), `'string'` (যেমন `String(obj)`, property key হিসেবে ব্যবহার), অথবা `'default'` (যেমন `+`)। এরপর algorithm টি সরল:",
    },
    {
      type: "ol",
      items: [
        "object এ **`[Symbol.toPrimitive](hint)`** method থাকলে সেটি ডাকা হয় — hint টি argument হিসেবে যায়। এটি primitive ফেরত দিলে কাজ শেষ। (primitive না দিলে `TypeError`।)",
        "না থাকলে **OrdinaryToPrimitive**: hint `'string'` হলে আগে `toString()`, তারপর `valueOf()`; hint `'number'` বা `'default'` হলে আগে `valueOf()`, তারপর `toString()`। যেটি আগে primitive ফেরত দেয় সেটিই ফল।",
        "কোনোটিই primitive না দিলে `TypeError`।",
      ],
    },
    {
      type: "p",
      text: "সাধারণ object এর `valueOf()` নিজেকেই (object) ফেরত দেয় — যা primitive নয় — তাই কাজ করে `toString()`, যা `'[object Object]'` দেয়। array এর `toString()` উপাদান কমা দিয়ে জোড়ে (`[1,2]` → `'1,2'`, `[]` → `''`)। এই দুই তথ্য থেকেই `[] + {}` এর রহস্য পরিষ্কার: `[]` → `''`, `{}` → `'[object Object]'`, দুটি string জোড়া → `'[object Object]'`। (`Date` একটি ব্যতিক্রম: hint `default` এ সে `string` এর মতো আচরণ করে, তাই `date + 1` string concat করে, কিন্তু `date - 1` সংখ্যা।)",
    },
    {
      type: "code",
      caption: "কাস্টম object এ ToPrimitive নিয়ন্ত্রণ (Playground এ আছে)",
      code: `const price = {
  amount: 50,
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return this.amount + " টাকা";
    return this.amount;           // "number" ও "default"
  },
};

console.log(price * 2);          // 100
console.log(price + 10);         // 60   (default hint → number ফেরত)
console.log(String(price));      // "50 টাকা"`,
    },
    { type: "h3", text: "Comparison এ coercion" },
    {
      type: "p",
      text: "`<`, `>`, `<=`, `>=` প্রথমে দুই operand এ ToPrimitive (hint `number`) চালায়। তারপর: **দুটিই string** হলে তুলনা হয় **অক্ষরক্রমে (UTF-16 code unit ধরে ধরে)** — সংখ্যামানে নয়; অন্য সব ক্ষেত্রে দুটিই সংখ্যায় রূপান্তরিত হয়। তাই `'10' < '9'` হলো `true` (কারণ `'1'` < `'9'`), অথচ `10 < '9'` হলো `false` (সংখ্যা তুলনা)। আর `NaN` এর সাথে যেকোনো তুলনা `false`।",
    },
    {
      type: "p",
      text: "একটি বিখ্যাত অসঙ্গতি: `null >= 0` হলো `true`, `null > 0` হলো `false`। কারণ `null` কে তুলনায় ToNumber করলে `0` হয়, তাই `0 >= 0` সত্য ও `0 > 0` মিথ্যা। অথচ `null == 0` হলো `false` — কারণ `==` এর নিজস্ব আলাদা নিয়ম আছে (সেখানে `null` কেবল `undefined` এর সাথেই সমান)। এই `==` এর জগৎ **Equality lesson** এ আলোচিত হবে; এখানে শুধু মনে রাখুন relational তুলনা ও `==` আলাদা আলাদা নিয়মে চলে।",
    },
    { type: "h3", text: "Symbol ও BigInt: coercion যেখানে অস্বীকার করে" },
    {
      type: "ul",
      items: [
        "**Symbol** implicit ভাবে string বা number হতে পারে না: `'x' + Symbol()` ও `+Symbol()` `TypeError` দেয়। স্পষ্টভাবে `String(sym)` কাজ করে।",
        "**BigInt** ও number মিশিয়ে অঙ্ক করা যায় না: `1n + 1` `TypeError`। (`1n + '1'` অবশ্য `'11'` — string জেতে; আর `1n < 2` তুলনা চলে।) স্পষ্টভাবে `BigInt(x)` বা `Number(b)` দিয়ে এক type এ আনতে হয়। এখানে ভাষা ইচ্ছাকৃতভাবে coercion নিষিদ্ধ করেছে, কারণ নিঃশব্দে precision হারানোর ঝুঁকি।",
      ],
    },
    { type: "h3", text: "কীভাবে coercion এর bug এড়াবেন" },
    {
      type: "ol",
      items: [
        "**বাইরের ইনপুট সরাসরি অপারেটরে দেবেন না।** আগে `Number()`/`String()` দিয়ে স্পষ্ট রূপান্তর ও যাচাই করুন।",
        "**`===` ও `!==` ব্যবহার করুন**; `==` শুধু জেনে-বুঝে (যেমন `x == null`)। কারণ ও বিস্তারিত পরের Equality lesson এ।",
        "**`+` এ type মিশাবেন না।** string বানাতে চাইলে template literal বা `String(x)`, যোগ করতে চাইলে আগে সংখ্যা করুন।",
        "**Tooling কে কাজে লাগান:** ESLint এর `eqeqeq`, `no-implicit-coercion`, এবং TypeScript ও `@typescript-eslint/restrict-plus-operands` / `restrict-template-expressions` নিয়ম অনেক ঝুঁকিপূর্ণ coercion কম্পাইল-বা-lint সময়ে ধরে।",
        "**boolean context এ সাবধান:** `if (count)` এ `0` ও ‘নেই’ ধরা পড়ে — প্রয়োজনে `count !== undefined` বা `??` ব্যবহার করুন।",
        "**Callback এর extra argument সম্পর্কে সচেতন থাকুন** (`map(parseInt)` এর মতো) — যদিও সেটি coercion নয়, একই শ্রেণীর ‘নীরব ভুল’।",
      ],
    },
    {
      type: "callout",
      tone: "danger",
      title: "ভুল ধারণা ও নিরাপত্তা",
      text: "**ভুল ধারণা:** (১) ‘JavaScript এ coercion এলোমেলো/র‍্যান্ডম’ — না, পুরোটাই spec এ নির্দিষ্ট নিয়মে চলে; (২) ‘coercion সবসময় খারাপ’ — না, `if (x)`, `a || default`, template literal এ সুবিধাজনক ও নিরাপদ; (৩) ‘`[] + {}` সবসময় `[object Object]`’ — expression হিসেবে হ্যাঁ, কিন্তু কিছু console এ `{} + []` statement হিসেবে লিখলে `{}` কে খালি block ধরা হয় ও ফল `0` দেখায় — parsing এর পার্থক্য, coercion এর নয়; (৪) ‘`==` ও `<` একই নিয়মে চলে’ — না। **নিরাপত্তা:** (ক) **Type confusion** — কিছু server framework এ query string (`?role[]=admin` বা `?id=1&id=2`) `string` এর বদলে **array/object** হয়ে আসে। `['admin'] + ''` হলো `'admin'` — তাই `String(x) === 'admin'` এর মতো ‘সহজ’ চেক পেরিয়ে যেতে পারে, যদিও আসলে array এসেছে। `typeof` ও `Array.isArray` দিয়ে আগে গঠন যাচাই করুন। (খ) **আর্থিক হিসাবে**: JSON/form থেকে আসা `price: '100'` এর সাথে `shipping: 5` যোগ করলে `'1005'` হয় — ভুল মূল্য। server এ প্রতিটি সংখ্যা-field স্পষ্টভাবে parse ও range-validate করুন, client এর type কে বিশ্বাস করবেন না। (গ) authorization/token তুলনায় `==` এ অপ্রত্যাশিত coercion এড়াতে `===` ও প্রত্যাশিত type যাচাই বাধ্যতামূলক করুন।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Browser বনাম Node.js",
      text: "Coercion এর সব নিয়ম ECMAScript এর অংশ, তাই browser ও Node.js এ একই। শুধু দুটি জিনিস আলাদা: (১) **console এ প্রদর্শন** — Node এ `console.log([] + {})` এর ফল string হওয়ায় quote ছাড়া দেখায়, আর DevTools এ একটি string ফল quote সহ দেখাতে পারে; (২) `{} + []` এর মতো statement-অবস্থানের লেখা REPL/DevTools এ কীভাবে parse হয় তা environment ভেদে আলাদা হতে পারে। এই lesson এর সব উদাহরণ `console.log(...)` এর ভেতরে expression হিসেবে লেখা, তাই ফল নির্দিষ্ট।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ভাবুন আপনি একটি **দোভাষী (interpreter) ও একটি ক্যাশিয়ার** এর মাঝামাঝি কাজ করা স্বয়ংক্রিয় কাউন্টারে আছেন — এই কাউন্টারের নাম JavaScript।",
    },
    {
      type: "ul",
      items: [
        "আপনি কাউন্টারে একটি **কাগজে ‘৫’ লেখা চিরকুট** (string) ও একটি **২ টাকার নোট** (number) দিয়ে বললেন, ‘যোগ করুন’ (`+`)। কাউন্টারের নিয়ম: ‘কোনো একটি জিনিস কাগজের লেখা হলে আমি সবকিছুই কাগজে লিখে জোড়া লাগাব’ — ফলে সে ‘৫’ আর ‘২’ লিখে ‘৫২’ বলে দিল। এটাই `'5' + 2`।",
        "একই চিরকুট ও নোট দিয়ে আপনি বললেন, ‘বিয়োগ করুন’ (`-`)। বিয়োগ শুধু সংখ্যা নিয়ে হয়, তাই কাউন্টার চিরকুটটি পড়ে সংখ্যা ৫ বের করে নিয়ে ৫ − ২ = ৩ বলল। একই জিনিস, কিন্তু ‘কাজ’ ভিন্ন হওয়ায় ফলও ভিন্ন।",
        "আপনি যদি **একটি ফাইল-ফোল্ডার (object)** দেন, কাউন্টারের কর্মী প্রথমে ফোল্ডারটিকে ‘সংক্ষিপ্ত রূপ’ (primitive) এ নামায় — আগে ফোল্ডারের গায়ের **মূল্য-লেবেল (`valueOf`)** দেখে; না থাকলে **নাম-লেবেল (`toString`)** দেখে। আপনি চাইলে ফোল্ডারের গায়ে একটি **বিশেষ নির্দেশিকা (`Symbol.toPrimitive`)** আটকে দিতে পারেন: ‘টাকার কাজে ৫০, নামের কাজে ৫০ টাকা’ — তখন কাউন্টার সেটিই মানে।",
        "এই কাউন্টার **কখনো ‘বুঝলাম না’ বলে না** (যথাসাধ্য চালিয়ে যায়)। যদি রূপান্তর একেবারেই না হয় (যেমন Symbol কে সংখ্যা), তবেই সে অবশেষে ‘TypeError’ বলে থামে। আর যদি কিছু বুঝতে না পারে কিন্তু হিসাব করতেই হয়, সে `NaN` লিখে দেয় যা পরের সব হিসাব দূষিত করে।",
      ],
    },
    {
      type: "p",
      text: "ফলে ভালো অভ্যাস হলো কাউন্টারের হাতে ‘ধরে নেওয়ার’ সুযোগ না দিয়ে নিজে আগেই চিরকুট ও নোট একই ধরনে (সংখ্যায়) পরিবর্তন করে দেওয়া। সীমাবদ্ধতা: বাস্তব কাউন্টারে নিয়ম যেকোনো সময় পরিবর্তন হতে পারে, কিন্তু JavaScript এর coercion নিয়ম specification এ স্থির — ভাষা এগুলো ভাঙে না, তাই একবার শিখলে সারা জীবন কাজে লাগে।",
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "`+` অপারেটর কীভাবে সিদ্ধান্ত নেয়",
      nodes: [
        { id: "expr", label: "a + b", sub: "অপারেন্ড" },
        { id: "prim", label: "ToPrimitive", sub: "object → primitive" },
        { id: "check", label: "কোনো একদিক string?", sub: "সিদ্ধান্ত" },
        { id: "conv", label: "রূপান্তর", sub: "ToString / ToNumeric" },
        { id: "res", label: "ফল", sub: "" },
      ],
      steps: [
        {
          active: ["expr", "prim"],
          items: { expr: ["'5' + 2"], prim: ["'5' আগে থেকেই primitive", "2 আগে থেকেই primitive"] },
          note: "প্রথম ধাপ: দুই operand এ ToPrimitive। এখানে দুটিই primitive, তাই কিছু বদলায় না।",
        },
        {
          active: ["check", "conv", "res"],
          items: { check: ["'5' string → হ্যাঁ"], conv: ["ToString(2) = '2'"], res: ["'52'"] },
          note: "একটি operand string, তাই দ্বিতীয়টিকেও string করে **জোড়া** লাগানো হলো। ফল string `'52'`।",
          output: "52",
        },
        {
          active: ["expr", "check", "conv", "res"],
          items: { expr: ["true + 1"], check: ["কোনোটিই string নয় → না"], conv: ["ToNumeric(true) = 1", "1 + 1"], res: ["2"] },
          note: "`true + 1` — string নেই, তাই দুটিই সংখ্যা হয়ে **যোগ**। `true` → `1`, ফল `2`।",
          output: "2",
        },
        {
          active: ["expr", "check", "conv", "res"],
          items: { expr: ["undefined + 1"], check: ["string নেই → না"], conv: ["ToNumeric(undefined) = NaN", "NaN + 1"], res: ["NaN"] },
          note: "`undefined` → `NaN`, আর `NaN` এর সাথে যেকোনো অঙ্ক `NaN`। অন্যদিকে `null + 1` হলো `1`, কারণ `null` → `0`।",
          output: "NaN",
        },
        {
          active: ["expr", "prim", "check", "conv", "res"],
          items: { expr: ["[] + {}"], prim: ["[] → ''", "{} → '[object Object]'"], check: ["এখন দুটিই string → হ্যাঁ"], conv: ["'' + '[object Object]'"], res: ["'[object Object]'"] },
          note: "object হলে প্রথমে ToPrimitive: `[]` এর `toString()` খালি string, `{}` এর `'[object Object]'`। তারপর দুটি string জোড়া লাগে।",
          output: "[object Object]",
        },
      ],
      caption: "নিয়ম: ToPrimitive করো → একটিও string থাকলে concat → নইলে সংখ্যায় যোগ।",
    },
    {
      kind: "flow-steps",
      title: "ToPrimitive: object কে primitive বানানোর ধাপ",
      nodes: [
        { id: "obj", label: "object", sub: "+ / * / String()" },
        { id: "sym", label: "Symbol.toPrimitive", sub: "থাকলে সবার আগে" },
        { id: "vo", label: "valueOf()", sub: "" },
        { id: "ts", label: "toString()", sub: "" },
        { id: "res", label: "primitive", sub: "অথবা TypeError" },
      ],
      steps: [
        {
          active: ["obj", "sym"],
          items: { obj: ["hint = 'default' (`+` এ)"], sym: ["method আছে?", "থাকলে hint সহ ডাকো"] },
          note: "প্রথমে দেখা হয় object এ `[Symbol.toPrimitive]` আছে কি না। থাকলে সেটিই hint সহ ডাকা হয় এবং ফল primitive হতে হয়; ধাপগুলো এখানেই শেষ।",
        },
        {
          active: ["vo"],
          items: { vo: ["hint default/number → আগে valueOf()", "সাধারণ object: নিজেকেই ফেরত দেয় (primitive নয়)"] },
          note: "না থাকলে hint `default` বা `number` এ আগে `valueOf()`। সাধারণ object এ এটি object নিজেকেই ফেরত দেয়, যা primitive নয় — তাই ফল গ্রহণযোগ্য নয়।",
        },
        {
          active: ["ts", "res"],
          items: { ts: ["এবার toString()", "{} → '[object Object]'", "[1,2] → '1,2'"], res: ["'[object Object]'"] },
          note: "`valueOf` ব্যর্থ হলে `toString()`। এটি primitive (string) দেয়, তাই ToPrimitive শেষ। hint `string` হলে ক্রম উল্টো হতো: আগে `toString()`, পরে `valueOf()`।",
          output: "[object Object]",
        },
        {
          active: ["vo", "res"],
          items: { vo: ["{ valueOf() { return 42 } }"], res: ["42 → 42 + 1 = 43"] },
          note: "যদি কাস্টম `valueOf()` primitive (যেমন `42`) ফেরত দেয়, তাহলে `toString()` পর্যন্ত যেতেই হয় না — `obj + 1` হয় `43`। কোনোটিই primitive না দিলে `TypeError`।",
          output: "43",
        },
      ],
      caption: "hint: `+` এ 'default', `*`/`-`/`<` এ 'number', `String(obj)` এ 'string'।",
    },
    {
      kind: "flow-steps",
      title: "তুলনায় coercion: string বনাম সংখ্যা",
      nodes: [
        { id: "cmp", label: "a < b", sub: "relational" },
        { id: "kinds", label: "দুটিই string?", sub: "ToPrimitive এর পর" },
        { id: "lex", label: "অক্ষরক্রম তুলনা", sub: "UTF-16 code unit" },
        { id: "num", label: "সংখ্যায় তুলনা", sub: "ToNumeric" },
      ],
      steps: [
        {
          active: ["cmp", "kinds", "lex"],
          items: { cmp: ["'10' < '9'"], kinds: ["দুটিই string → হ্যাঁ"], lex: ["'1' < '9' → true", "দৈর্ঘ্য/মান দেখা হয় না"] },
          note: "দুটিই string, তাই অক্ষর ধরে তুলনা: প্রথম অক্ষর `'1'` ছোট `'9'` থেকে — ফল `true`। সংখ্যামান তুলনা হয়নি।",
          output: "true",
        },
        {
          active: ["cmp", "kinds", "num"],
          items: { cmp: ["10 < '9'"], kinds: ["একটি number → না"], num: ["10 vs 9", "10 < 9 → false"] },
          note: "একটি operand সংখ্যা, তাই দুটিই সংখ্যায় রূপান্তর — `10 < 9` হলো `false`। একই মান, ভিন্ন type, উল্টো ফল!",
          output: "false",
        },
        {
          active: ["cmp", "num"],
          items: { cmp: ["null >= 0"], num: ["ToNumber(null) = 0", "0 >= 0 → true"] },
          note: "`null` তুলনায় `0` হয়ে যায়, তাই `null >= 0` `true`। (অথচ `null == 0` `false` — `==` আলাদা নিয়ম, Equality lesson এ।)",
          output: "true",
        },
        {
          active: ["cmp", "num"],
          items: { cmp: ["NaN < 1  /  undefined >= 0"], num: ["ToNumber(undefined) = NaN", "NaN এর সাথে সব তুলনা false"] },
          note: "`NaN` জড়িত থাকলে `<`, `>`, `<=`, `>=` সবই `false`। তাই `undefined >= 0` ও `false`।",
          output: "false",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "ক্লাসিক coercion ফলের তালিকা",
      description: "প্রতিটি লাইনের ফল নিয়ম থেকে অনুমান করুন, তারপর চালিয়ে মেলান। মনে রাখবেন: `+` এ string জেতে, বাকি অঙ্ক-অপারেটর সংখ্যা চায়।",
      code: `console.log("5" + 2);        // string জোড়া
console.log("5" - 2);        // সংখ্যা
console.log("5" * "2");
console.log("10" / 4);
console.log(true + 1, true + true);
console.log(null + 1, undefined + 1);
console.log(1 + 2 + "3", "1" + 2 + 3);
console.log("b" + "a" + +"a" + "a");   // +"a" হলো NaN
console.log([] + [], [] + {});
console.log([1, 2] + [3]);
console.log(typeof ("5" + 2), typeof ("5" - 2));
console.log("abc" * 1);`,
    },
    {
      level: "intermediate",
      title: "ToPrimitive: valueOf, toString ও Symbol.toPrimitive",
      description: "কোন hint এ কোন method ডাকা হয় এবং কাস্টম `Symbol.toPrimitive` কীভাবে সবকিছু নিয়ন্ত্রণ করে — log দেখে নিজে প্রমাণ করুন।",
      code: `// ১) valueOf বনাম toString — কে কখন ডাকা হয়
const o = {
  valueOf() { console.log("  valueOf ডাকা হলো"); return 42; },
  toString() { console.log("  toString ডাকা হলো"); return "str"; },
};
console.log("o + 1:");
console.log(o + 1);
console.log("o * 2:");
console.log(o * 2);
console.log("String(o):");
console.log(String(o));

// ২) valueOf যদি object ফেরত দেয়, তাহলে toString এ নামে
const tricky = { valueOf() { return {}; }, toString() { return "7"; } };
console.log(tricky + 1);   // default hint → "7" + 1
console.log(tricky * 1);   // number hint → 7

// ৩) Symbol.toPrimitive সবকিছু নিয়ন্ত্রণ করে এবং hint দেখায়
const spy = {
  [Symbol.toPrimitive](hint) {
    console.log("  hint:", hint);
    return hint === "string" ? "S" : 1;
  },
};
console.log(+spy);
console.log(spy + 1);
console.log(String(spy));
console.log(spy < 2);

// ৪) Date এর বিশেষ আচরণ
const d = new Date(0);
console.log(typeof (d + 1), typeof (d - 1));`,
    },
    {
      level: "real-world",
      title: "Cart এর মোট হিসাব ও default sort — দুটি বাস্তব coercion ফাঁদ",
      description: "API/form থেকে আসা string মূল্য এবং `Array.prototype.sort()` এর ডিফল্ট আচরণ — দুটিই coercion থেকে আসা সবচেয়ে প্রচলিত production bug।",
      code: `// ১) JSON এ price string হয়ে এসেছে
const cart = [
  { name: "Pen", price: "10", qty: 3 },
  { name: "Book", price: "120", qty: 1 },
];

// ভুল: price + shipping → string concat; reduce এর শুরুও ভুল
const shipping = 5;
const badTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + shipping;
console.log("এটি সঠিক দেখায় কারণ * সংখ্যা চায়:", badTotal);

const badPlus = cart[0].price + shipping;   // "10" + 5
console.log("এটি ভুল কারণ + এ string জেতে:", badPlus, typeof badPlus);

// ঠিক: ইনপুট একবার স্পষ্টভাবে normalize করুন
const normalized = cart.map((item) => ({ ...item, price: Number(item.price) }));
const total = normalized.reduce((sum, item) => sum + item.price * item.qty, shipping);
console.log("সঠিক total:", total);

// ২) sort() এর ডিফল্ট comparator সবকিছুকে string এ রূপান্তর করে তুলনা করে
const scores = [10, 9, 100, 1];
console.log([...scores].sort());
console.log([...scores].sort((a, b) => a - b));   // a - b এ সংখ্যা coercion/তুলনা

// ৩) নিরাপদ স্ট্রিং তৈরি: অবজেক্ট সরাসরি + করবেন না
const user = { id: 7, name: "Rina" };
console.log("User: " + user);
console.log("User: " + JSON.stringify(user));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("5" + 2, "5" - 2, true + 1);
`,
    },
    {
      label: "অপারেটর বনাম type — ফলের সারণী",
      code: `const pairs = [
  ["'5' + 2", "5" + 2],
  ["'5' - 2", "5" - 2],
  ["'5' * '2'", "5" * "2"],
  ["true + 1", true + 1],
  ["null + 1", null + 1],
  ["undefined + 1", undefined + 1],
  ["null + undefined", null + undefined],
  ["[] + []", [] + []],
  ["[] + {}", [] + {}],
  ["[] * 2", [] * 2],
  ["[5] * 2", [5] * 2],
  ["({}) * 2", {} * 2],
  ["'' + 1", "" + 1],
  ["+'' ", +""],
  ["+'  12  '", +"  12  "],
  ["-'5'", -"5"],
  ["'3' + - '2'", "3" + -"2"],
];

for (const [label, value] of pairs) {
  console.log(label, "=>", value, "(" + typeof value + ")");
}`,
    },
    {
      label: "তুলনা: string বনাম সংখ্যা",
      code: `console.log("'10' < '9' :", "10" < "9");     // string: অক্ষরক্রম
console.log("10 < '9'   :", 10 < "9");       // সংখ্যা
console.log("'a' < 'b'  :", "a" < "b");
console.log("'B' < 'a'  :", "B" < "a");      // বড় হাতের কোড আগে
console.log("null >= 0  :", null >= 0);
console.log("null > 0   :", null > 0);
console.log("undefined >= 0 :", undefined >= 0);
console.log("NaN < 1    :", NaN < 1, "| NaN >= 1:", NaN >= 1);
console.log("[2] > 1    :", [2] > 1);        // [2] → "2" → 2
console.log("'abc' < 'abd' :", "abc" < "abd");

// অনেক সময় সংখ্যা-তুলনার আগে স্পষ্ট রূপান্তরই নিরাপদ
const a = "10", b = "9";
console.log("Number(a) < Number(b):", Number(a) < Number(b));`,
    },
    {
      label: "Symbol.toPrimitive ও hint",
      code: `class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  [Symbol.toPrimitive](hint) {
    if (hint === "string") return this.celsius + "°C";
    return this.celsius;
  }
}

const t = new Temperature(25);
console.log(t + 10);                 // default → number: 35
console.log(t * 2);                  // number: 50
console.log(t > 20);                 // number: true
console.log(String(t));              // string: 25°C
console.log("আজ: " + t);            // default hint → সংখ্যা 25, তাই "আজ: 25"
console.log(["x", t].join("-"));     // join ToString ব্যবহার করে → hint string

// সাধারণ class এ কী ঘটে
class Plain {}
console.log(String(new Plain()));
console.log(new Plain() + "");`,
    },
    {
      label: "Symbol ও BigInt এর সীমাবদ্ধতা",
      code: `const sym = Symbol("id");

try { console.log("x" + sym); } catch (e) { console.log("Symbol +:", e.name); }
try { console.log(+sym); } catch (e) { console.log("Symbol unary +:", e.name); }
console.log(String(sym));                // স্পষ্ট রূপান্তর চলে

try { console.log(1n + 1); } catch (e) { console.log("BigInt + number:", e.name); }
console.log(1n + BigInt(1));             // একই type এ আনুন
console.log(1n + "1");                   // string জেতে
console.log(1n < 2, 2n > 1);             // তুলনা চলে`,
    },
  ],

  debugging: [
    {
      title: "মূল্য ও ডেলিভারি চার্জ যোগ করে ‘১০০৫’ আসছে",
      bad: `const priceFromApi = "100";   // JSON এ string হিসেবে এসেছে
const shipping = 5;
console.log("Total:", priceFromApi + shipping);`,
      why: "`+` এর একদিক string হওয়ায় ToString করে দুটি জোড়া লাগছে — `'100' + 5` হলো `'1005'`। `+` ছাড়া `*` বা `-` হলে সংখ্যা হয়ে যেত, তাই bug টি অপারেটর বদলালেই ‘লুকিয়ে’ যায়। বাইরের data আসার সাথে সাথেই সংখ্যায় রূপান্তর করে নিন।",
      fix: `const priceFromApi = "100";
const shipping = 5;
const price = Number(priceFromApi);
if (!Number.isFinite(price)) throw new Error("অবৈধ মূল্য");
console.log("Total:", price + shipping);`,
    },
    {
      title: "sort() এ সংখ্যা সঠিক ক্রমে আসছে না",
      bad: `const scores = [10, 9, 100, 1];
scores.sort();
console.log(scores);`,
      why: "`sort()` এর ডিফল্ট comparator প্রতিটি element কে **string এ রূপান্তর করে** অক্ষরক্রমে সাজায়, তাই `'10'` আসে `'9'` এর আগে। সংখ্যা সাজাতে স্পষ্ট comparator দিতে হয়।",
      fix: `const scores = [10, 9, 100, 1];
scores.sort((a, b) => a - b);   // আরোহী (ছোট থেকে বড়)
console.log(scores);`,
    },
    {
      title: "null মান ‘বৈধ’ ধরা পড়ছে (null >= 0)",
      bad: `function check(value) {
  if (value >= 0) {
    return "valid";
  }
  return "invalid";
}
console.log(check(null));`,
      why: "তুলনায় `null` এর ToNumber ফল `0`, তাই `null >= 0` হলো `true`। অনুপস্থিত মানটি ‘বৈধ অ-ঋণাত্মক সংখ্যা’ হিসেবে ঢুকে গেল। relational তুলনার আগে type যাচাই করতে হয়।",
      fix: `function check(value) {
  if (typeof value === "number" && value >= 0) {
    return "valid";
  }
  return "invalid";
}
console.log(check(null));`,
    },
    {
      title: "TypeError: Cannot mix BigInt and other types",
      bad: `const big = 10n;
const result = big + 1;
console.log(result);`,
      why: "BigInt ও number মিশিয়ে অঙ্ক করা ভাষা ইচ্ছাকৃতভাবে নিষিদ্ধ করেছে — অন্যথায় নীরবে precision হারাত। implicit coercion এখানে কাজ করে না; আপনাকে এক type বেছে স্পষ্টভাবে রূপান্তর করতে হয়।",
      fix: `const big = 10n;
const result = big + BigInt(1);   // দুটিই BigInt
console.log(result);
console.log(Number(big) + 1);      // অথবা দুটিই number (বড় হলে precision যেতে পারে)`,
    },
    {
      title: "Object কে string এ জোড়া লাগালে [object Object]",
      bad: `const user = { id: 7, name: "Rina" };
console.log("User: " + user);`,
      why: "`+` অপারেটর `user` এ ToPrimitive চালায়; সাধারণ object এর `toString()` `'[object Object]'` ফেরত দেয়, তাই কোনো কাজের তথ্য আসে না — এবং কোনো error ও হয় না, তাই bug নীরবে log এ ঢুকে যায়।",
      fix: `const user = { id: 7, name: "Rina" };
console.log("User: " + JSON.stringify(user));
console.log("User:", user);              // বা object আলাদা argument হিসেবে`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "‘৫’ ও ২ — সঠিক যোগফল",
      prompt: "নিচের কোড `52` print করে। `+` লাইনটি এমনভাবে ঠিক করুন যেন ফল `7` হয়।",
      starter: `const a = "5";
const b = 2;
console.log(a + b);`,
      expected: "7",
      hints: ["`+` এ একটি operand string হলে concatenation হয়।", "যোগের আগে `a` কে সংখ্যা বানান।"],
      solution: `const a = "5";
const b = 2;
console.log(Number(a) + b);`,
      explanation: "`Number(a)` স্পষ্টভাবে `'5'` কে `5` করে, ফলে `+` এর দুই পাশই number এবং numeric addition চলে।",
    },
    {
      level: "beginner",
      title: "typeof দিয়ে coercion প্রমাণ",
      prompt: "প্রথম `typeof` এর ভেতরে এমন expression লিখুন যার ফল `number`, দ্বিতীয়টিতে এমন expression যার ফল `string` — শুধু `'5'` ও `2` এবং একটি অপারেটর ব্যবহার করে। প্রত্যাশিত: `number string`।",
      starter: `console.log(typeof (0), typeof (0));`,
      expected: "number string",
      hints: ["কোন অপারেটর `'5'` কে সংখ্যা করে? (`-`, `*`)", "কোন অপারেটরে string জেতে? (`+`)"],
      solution: `console.log(typeof ("5" - 2), typeof ("5" + 2));`,
      explanation: "`'5' - 2` তে ToNumber চলে ও ফল `3` (number)। `'5' + 2` এ একটি operand string হওয়ায় concatenation হয় ও ফল `'52'` (string)।",
    },
    {
      level: "beginner",
      title: "true, null, undefined এর সাথে যোগ",
      prompt: "`true + 1`, `null + 1`, `undefined + 1` এর ফল এক লাইনে print করুন। প্রত্যাশিত: `2 1 NaN`।",
      starter: `// TODO: expression গুলো বসান
console.log(0, 0, 0);`,
      expected: "2 1 NaN",
      hints: ["`true` → `1`, `null` → `0`, `undefined` → `NaN`।", "`console.log(a, b, c)` এ তিনটি argument দিন।"],
      solution: `console.log(true + 1, null + 1, undefined + 1);`,
      explanation: "ToNumeric: `true` → `1`, `null` → `0`, `undefined` → `NaN`। কোনোটিই string নয়, তাই যোগ হয়, জোড়া লাগে না।",
    },
    {
      level: "intermediate",
      title: "Symbol.toPrimitive যোগ করুন",
      prompt:
        "`temp` object এ `Symbol.toPrimitive` যোগ করুন যাতে `temp + 10` হয় `35` (সংখ্যা হিসেবে `25 + 10`) এবং `String(temp)` হয় `25°C`। প্রত্যাশিত: `35 25°C`।",
      starter: `const temp = { celsius: 25 };

console.log(temp + 10, String(temp));`,
      expected: "35 25°C",
      hints: ["method এর নাম `[Symbol.toPrimitive](hint)`।", "`hint === 'string'` হলে `this.celsius + '°C'`, নইলে `this.celsius`।"],
      solution: `const temp = {
  celsius: 25,
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? this.celsius + "°C" : this.celsius;
  },
};

console.log(temp + 10, String(temp));`,
      explanation: "`+` এ hint হলো `'default'`, তাই else শাখা — সংখ্যা `25` ফেরত যায়, ফল `35`। `String(temp)` এ hint `'string'`, তাই `'25°C'`।",
    },
    {
      level: "intermediate",
      title: "সংখ্যা ঠিকভাবে সাজান",
      prompt: "নিচের কোড `[ 1, 10, 100, 9 ]` print করে। শুধু `sort` এর আচরণ ঠিক করে `[ 1, 9, 10, 100 ]` print করান।",
      starter: `const nums = [10, 9, 100, 1];
nums.sort();
console.log(nums);`,
      expected: "[ 1, 9, 10, 100 ]",
      hints: ["ডিফল্ট `sort()` সবকিছুকে string করে তুলনা করে।", "comparator: `(a, b) => a - b`।"],
      solution: `const nums = [10, 9, 100, 1];
nums.sort((a, b) => a - b);
console.log(nums);`,
      explanation: "ডিফল্ট comparator string অক্ষরক্রম ব্যবহার করে (`'10' < '9'`)। `a - b` সংখ্যা ফেরত দেয়, ফলে সংখ্যামান অনুযায়ী সাজে।",
    },
    {
      level: "challenge",
      title: "কঠোর safeAdd: coercion ছাড়া যোগ",
      prompt:
        "`safeAdd(a, b)` লিখুন: যে মান number (সসীম) অথবা খালি-নয় এমন সংখ্যা-string, শুধু সেগুলো গ্রহণ করে যোগফল ফেরত দেবে। `null`, `boolean`, `undefined`, খালি/অবৈধ string, `NaN`/`Infinity` হলে `null` ফেরত দেবে। বর্তমান কোড coercion এর ওপর ভরসা করে ভুল ফল দেয়।",
      starter: `function safeAdd(a, b) {
  return a + b;
}

console.log(
  safeAdd("5", 2),
  safeAdd(" 3 ", "4"),
  safeAdd("", 1),
  safeAdd("x", 1),
  safeAdd(null, 1),
  safeAdd(true, 1)
);`,
      expected: "7 7 null null null null",
      hints: [
        "একটি ছোট helper `toStrictNumber(v)` লিখুন যা `number` বা `string` ছাড়া সবকিছুতে `null` দেয়।",
        "string হলে `trim()` খালি কি না আগে দেখুন (`Number('') === 0`)।",
        "রূপান্তরের পর `Number.isFinite` দিয়ে `NaN`/`Infinity` বাদ দিন।",
      ],
      solution: `function toStrictNumber(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function safeAdd(a, b) {
  const x = toStrictNumber(a);
  const y = toStrictNumber(b);
  return x === null || y === null ? null : x + y;
}

console.log(
  safeAdd("5", 2),
  safeAdd(" 3 ", "4"),
  safeAdd("", 1),
  safeAdd("x", 1),
  safeAdd(null, 1),
  safeAdd(true, 1)
);`,
      explanation: "সবকিছু আগে স্পষ্টভাবে একই type এ (number) আনা হয়েছে, তাই `+` এর ‘string জেতে’ নিয়ম আর কাজ করে না। `null`/`true` কে `0`/`1` ধরে নেওয়ার ঝুঁকিও এড়ানো গেছে — এটিই ‘coercion এর ওপর ভরসা না করে নিজের নিয়মে যাচাই’ করার উদাহরণ।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`console.log('5' + 2)` এর ফল কী?",
        options: ["7", "NaN", "52 (একটি string)", "TypeError"],
        answer: 2,
        explanation:
          "`+` এর একদিক string হলে অন্যটিও ToString হয়ে দুটি জোড়া লাগে — ফল string `'52'`। `7` হতো যদি দুটিই number হতো (বা `-` অপারেটর হতো, তখন `3`)। `NaN` আসত যদি সংখ্যায় রূপান্তর ব্যর্থ হতো, কিন্তু এখানে সংখ্যা-রূপান্তরই হয়নি। `TypeError` শুধু Symbol/BigInt মেশালে আসে।",
      },
      {
        question: "`'5' - 2` এর ফল কী?",
        options: ["'52'", "3", "NaN", "'3'"],
        answer: 1,
        explanation:
          "`-` সবসময় দুই পাশেই ToNumeric চালায়, তাই `'5'` হয় `5` এবং ফল সংখ্যা `3`। `'52'` হলো `+` এর ফল; `NaN` আসত যদি string টি সংখ্যা না হতো (যেমন `'a' - 2`); `'3'` (string) ভুল কারণ `-` কখনো string তৈরি করে না।",
      },
      {
        question: "`console.log(null >= 0, null > 0)` কী print করবে?",
        options: ["true false", "false false", "true true", "false true"],
        answer: 0,
        explanation:
          "তুলনায় `null` এর ToNumber ফল `0`, তাই `0 >= 0` সত্য আর `0 > 0` মিথ্যা — ফল `true false`। দ্বিতীয় অপশন ভাবে `null` সংখ্যা নয় বলে সব তুলনা মিথ্যা (এটি `undefined` এর ক্ষেত্রে সত্য, কারণ সে `NaN` হয়)। `true true` ভুল কারণ `0 > 0` মিথ্যা (কোনো সংখ্যা নিজের চেয়ে বড় নয়); `false true` ভুল কারণ `0 >= 0` সত্য।",
      },
      {
        question: "`+` অপারেটর সম্পর্কে কোন বর্ণনাটি সঠিক?",
        options: [
          "সবসময় সংখ্যা যোগ করে, string হলে আগে সংখ্যায় বদলায়",
          "সবসময় string জোড়া লাগায় যদি একটিও object থাকে",
          "ToPrimitive এর পর শুধু প্রথম operand string হলে concatenation হয়",
          "ToPrimitive এর পর যেকোনো একটি operand string হলে দুটিই string হয়ে জোড়া লাগে, নইলে সংখ্যায় যোগ হয়",
        ],
        answer: 3,
        explanation:
          "ঠিক এই নিয়মেই `+` কাজ করে — বাম বা ডান যেকোনো দিকে string থাকলেই concat। প্রথম অপশন `-` এর মতো আচরণ বর্ণনা করছে। দ্বিতীয়টি ভুল: object থাকলে ToPrimitive আগে চলে, তার ফল string না হলে (যেমন `valueOf` দিয়ে সংখ্যা) যোগও হতে পারে। তৃতীয়টি ভুল: বাম বা ডান যেকোনো একটি string হলেই হয়।",
      },
      {
        question: "`console.log('10' < '9')` এর ফল কী?",
        options: ["false", "NaN", "true", "TypeError"],
        answer: 2,
        explanation:
          "দুটিই string, তাই অক্ষরক্রমে তুলনা: `'1'` (প্রথম অক্ষর) ছোট `'9'` থেকে, তাই `true`। সংখ্যামান ধরলে `10 < 9` মিথ্যা হতো — সেটি `10 < '9'` এর ক্ষেত্রে ঘটে (একটি সংখ্যা থাকলে numeric তুলনা)। `<` কখনো `NaN` ফেরত দেয় না (শুধু boolean), আর এখানে `TypeError` এর কোনো কারণ নেই।",
      },
    ],
    coding: [
      {
        title: "String-সংখ্যার সঠিক সাজানো (মূল array না বদলে)",
        prompt: "`sortNumeric(list)` লিখুন যা string-সংখ্যার একটি array কে সংখ্যামান অনুযায়ী আরোহী ক্রমে সাজিয়ে **নতুন** array ফেরত দেবে (মূল array বদলাবে না)। `['10', '9', '100', '1']` এর ফল print করুন: `[ '1', '9', '10', '100' ]`।",
        starter: `// TODO: sortNumeric লিখুন
`,
        expected: "[ '1', '9', '10', '100' ]",
        solution: `function sortNumeric(list) {
  return [...list].sort((a, b) => Number(a) - Number(b));
}

console.log(sortNumeric(["10", "9", "100", "1"]));`,
      },
      {
        title: "`+` কী করবে — concat নাকি add?",
        prompt: "`plusMode(a, b)` লিখুন যা primitive মানের জন্য বলবে `+` কী করবে: কোনো একটি `string` হলে `'concat'`, নইলে `'add'`। `(1,2)`, `(1,'2')`, `(true,1)`, `('a',null)` এর ফল এক লাইনে print করুন: `add concat add concat`।",
        starter: `// TODO: plusMode লিখুন
`,
        expected: "add concat add concat",
        solution: `function plusMode(a, b) {
  return typeof a === "string" || typeof b === "string" ? "concat" : "add";
}

console.log(plusMode(1, 2), plusMode(1, "2"), plusMode(true, 1), plusMode("a", null));`,
      },
    ],
  },

  interview: [
    {
      q: "Type coercion কী? Implicit ও explicit এর পার্থক্য কী?",
      a: "Type coercion হলো engine এর নিজে থেকে একটি মানকে অপারেটর বা context এর প্রয়োজনীয় type এ রূপান্তর করা (implicit conversion), যেমন `'6' * 2` এ string কে সংখ্যা বানানো। Explicit conversion হলো আপনি নিজে `Number()`, `String()`, `Boolean()` ডেকে রূপান্তর করা।\n\nভেতরে দুটিতেই একই abstract operation (`ToPrimitive`, `ToNumber`, `ToString`, `ToBoolean`) চলে। পার্থক্য হলো স্পষ্টতা ও নিয়ন্ত্রণে — explicit রূপান্তরে কোডের অভিপ্রায় পরিষ্কার এবং আপনি edge case (খালি string, `null`) সামলান। coercion সবসময় খারাপ নয় (`if (x)`, `a ?? b`, template literal এ নিরাপদ), তবে `+` এর মতো অস্পষ্ট জায়গায় ও বাইরের ইনপুটে explicit রূপান্তর পছন্দনীয়।",
    },
    {
      q: "`'5' + 2` ও `'5' - 2` এর ফল আলাদা কেন?",
      a: "`+` অপারেটর দ্বৈত: যোগ ও string জোড়া। ToPrimitive এর পর যদি যেকোনো একটি operand string হয়, তবে অন্যটিও ToString হয়ে concatenation হয় — তাই `'5' + 2` হলো `'52'`। `-` শুধু সংখ্যাতেই কাজ করে, তাই দুই পাশেই ToNumeric চলে — `'5' - 2` হলো `3`।\n\nএকই কারণে `1 + 2 + '3'` হলো `'33'` (বাম থেকে ডানে: `3 + '3'`), আর `'1' + 2 + 3` হলো `'123'`। এর ফলে একটি ব্যবহারিক নিয়ম: বাইরের data যোগ করার আগে সংখ্যায় রূপান্তর করুন; নইলে অপারেটর বদলালেই ফল আমূল বদলে যায় — যা bug খুঁজে পাওয়া কঠিন করে।",
    },
    {
      q: "ToPrimitive কীভাবে কাজ করে? `valueOf`, `toString` ও `Symbol.toPrimitive` এর সম্পর্ক কী?",
      a: "object কোনো primitive চাওয়া context এ পড়লে ToPrimitive চলে, সাথে hint থাকে: `'number'` (`*`, `-`, `<`), `'string'` (`String(obj)`, property key), `'default'` (`+`)। প্রথমে object এ `[Symbol.toPrimitive](hint)` আছে কিনা দেখা হয় — থাকলে সেটিই ডাকা হয় এবং ফল primitive হতে হয়, নইলে `TypeError`।\n\nনা থাকলে OrdinaryToPrimitive: hint `'string'` এ `toString()` তারপর `valueOf()`; অন্যথায় `valueOf()` তারপর `toString()` — যেটি আগে primitive দেয়। সাধারণ object এ `valueOf` নিজেকেই ফেরত দেয় (primitive নয়), তাই `toString()` কাজ করে: `{}` → `'[object Object]'`, `[1,2]` → `'1,2'`। এজন্য `[] + {}` হলো `'[object Object]'`। `Date` ব্যতিক্রম: hint `default` এ সে string এর মতো আচরণ করে।",
    },
    {
      q: "`null >= 0` কেন `true` আর `null == 0` কেন `false`?",
      a: "Relational অপারেটর (`<`, `>`, `<=`, `>=`) দুই operand কে ToPrimitive করে, string না হলে ToNumeric করে সংখ্যা হিসেবে তুলনা করে। `ToNumber(null)` হলো `0`, তাই `null >= 0` হলো `0 >= 0` অর্থাৎ `true`, আর `null > 0` হলো `0 > 0` অর্থাৎ `false`।\n\nকিন্তু `==` এর অ্যালগরিদম সম্পূর্ণ আলাদা: সেখানে `null` ও `undefined` শুধু একে অপরের সাথেই (এবং নিজেদের সাথে) সমান, কোনো সংখ্যার সাথে নয় — তাই `null == 0` হলো `false`। এই কারণে `==` ও `<` কে একই নিয়মের অধীন ভাবা ভুল। `==` এর পুরো নিয়ম আলাদা Equality lesson এ; ব্যবহারিক পরামর্শ — সংখ্যা তুলনার আগে `typeof` বা `Number.isFinite` দিয়ে যাচাই করা।",
    },
    {
      q: "`[10, 9, 100, 1].sort()` কেন ভুল ক্রম দেয়? কীভাবে ঠিক করবেন?",
      a: "`Array.prototype.sort()` এ comparator না দিলে ডিফল্ট আচরণ হলো প্রতিটি element কে string এ রূপান্তর করে UTF-16 code unit ক্রমে তুলনা করা — সংখ্যামান দেখা হয় না। তাই `'10'` আসে `'9'` এর আগে (`'1' < '9'`) এবং ফল `[1, 10, 100, 9]`।\n\nসংখ্যা সাজাতে স্পষ্ট comparator দিন: `(a, b) => a - b` (আরোহী)। `sort` মূল array কে mutate করে, তাই দরকার হলে আগে copy (`[...arr]`) করুন; আধুনিক ES2023 এ non-mutating `toSorted()` ও আছে। এই bug এর শিকড় — implicit ToString coercion।",
    },
    {
      q: "Coercion সংক্রান্ত bug থেকে নিজের কোড কীভাবে নিরাপদ রাখবেন?",
      a: "কয়েকটি স্তরে: (১) **ইনপুট সীমানায় normalize ও validate** — form, query string, API body থেকে আসা মান সঙ্গে সঙ্গে স্পষ্টভাবে `Number()`/`String()` করে `typeof`, `Number.isFinite`, range পরীক্ষা করুন। (২) **`===`/`!==`** ব্যবহার করুন, `==` কেবল সচেতনভাবে (`x == null`)। (৩) **`+` এ type মিশাবেন না**; string বানাতে template literal, যোগ করতে আগে সংখ্যা। (৪) **Tooling**: ESLint এর `eqeqeq`, `no-implicit-coercion` এবং TypeScript (strict, `restrict-plus-operands`, `restrict-template-expressions`)।\n\nনিরাপত্তার দিকে: কিছু query parser এ `?id[]=1` array হয়ে আসে — implicit ToString এ `'1'` এর মতো দেখালেও আসলে type ভিন্ন, তাই `Array.isArray`/`typeof` দিয়ে গঠন যাচাই করুন। আর্থিক হিসাবে string মূল্যের সাথে `+` করলে ভুল মোট আসতে পারে — server এ আবার যাচাই বাধ্যতামূলক।",
    },
  ],

  summary: {
    takeaways: [
      "Coercion হলো engine এর স্বয়ংক্রিয় রূপান্তর; ভেতরে ToPrimitive, ToNumber, ToString, ToBoolean (এবং ToNumeric) abstract operation চলে।",
      "`+` এ ToPrimitive এর পর যেকোনো একদিক string হলে concatenation, নইলে সংখ্যা যোগ; `-`, `*`, `/` সবসময় সংখ্যা চায়।",
      "ক্লাসিক ফল: `'5' + 2` → `'52'`, `'5' - 2` → `3`, `true + 1` → `2`, `null + 1` → `1`, `undefined + 1` → `NaN`, `[] + {}` → `'[object Object]'`।",
      "object coerce হয় ToPrimitive দিয়ে: `Symbol.toPrimitive(hint)` আগে; নইলে hint অনুযায়ী `valueOf`/`toString` এর ক্রম (`string` এ `toString` আগে)।",
      "তুলনায় দুটিই string হলে অক্ষরক্রম (`'10' < '9'` → `true`), নইলে সংখ্যা; `null >= 0` `true` কিন্তু `null == 0` `false` — `==` আলাদা নিয়ম, পরের Equality lesson এ।",
      "Symbol ও BigInt মিশ্রণে ভাষা implicit coercion অস্বীকার করে `TypeError` দেয়।",
      "নিরাপদ থাকতে: সীমানায় explicit রূপান্তর ও যাচাই, `===`, lint/TypeScript নিয়ম এবং বাইরের type কে বিশ্বাস না করা।",
    ],
    syntax: `"5" + 2;              // "52"  (string জেতে)
"5" - 2;              // 3
true + 1;             // 2
[] + {};              // "[object Object]"
"10" < "9";           // true (অক্ষরক্রম)

const o = {
  [Symbol.toPrimitive](hint) {   // hint: "default" | "number" | "string"
    return hint === "string" ? "text" : 42;
  },
};

Number(x) + Number(y);   // স্পষ্ট রূপান্তর, coercion এড়ানো
nums.sort((a, b) => a - b);`,
    whenToUse: [
      "`if (x)`, `x || default`, `x ?? default` এর মতো boolean/default context এ সুপরিচিত implicit ToBoolean নির্ভরতা — সচেতনভাবে গ্রহণযোগ্য।",
      "কাস্টম class কে অঙ্ক বা string context এ সুন্দরভাবে আচরণ করাতে চাইলে `Symbol.toPrimitive` (বা `valueOf`/`toString`) সংজ্ঞায়িত করুন — তবে মাপা ব্যবহার, অতি-চালাকি নয়।",
      "বাইরের ইনপুট, আর্থিক হিসাব ও তুলনার ক্ষেত্রে implicit coercion এড়িয়ে explicit রূপান্তর ও যাচাই।",
      "সংখ্যা সাজাতে বা তুলনা করতে স্পষ্ট comparator ও সংখ্যায় রূপান্তরিত মান ব্যবহার করুন।",
    ],
    next: [
      "Equality: `==` বনাম `===` বনাম `Object.is` (null/undefined নিয়ম সহ)",
      "Operators ও `??`, `?.` (nullish ও optional chaining)",
      "Objects ও Prototype (valueOf/toString কোথা থেকে আসে)",
      "TypeScript ও static typing দিয়ে coercion ঝুঁকি কমানো",
    ],
  },

  compatibility:
    "Coercion এর সব নিয়ম ECMAScript এর অংশ, তাই browser ও Node.js এ আচরণ হুবহু এক। `Symbol.toPrimitive` ES2015 থেকে, BigInt ES2020 থেকে সব আধুনিক browser ও Node.js এ আছে; `toSorted()` ES2023 (পুরোনো environment এ নাও থাকতে পারে)। শুধু দুটি পার্থক্য: console এ ফল প্রদর্শনের ধরন (string এর quote), এবং `{} + []` এর মতো statement-অবস্থানের লেখার parsing REPL/DevTools এ আলাদা হতে পারে। এই lesson এর সব উদাহরণ Web Worker sandbox এ `console.log` এর ভেতরে expression হিসেবে চলে।",
};
