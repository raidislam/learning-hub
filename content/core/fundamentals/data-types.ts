import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "JavaScript এর ৮টি data type (৭টি primitive + object) নাম ধরে বলতে এবং প্রতিটির ব্যবহার ব্যাখ্যা করতে পারবেন।",
    "`typeof` এর অদ্ভুত আচরণ (`typeof null`, `typeof function`, `typeof NaN`) এর কারণ বুঝে নিরাপদ type check লিখতে পারবেন।",
    "Floating point (`0.1 + 0.2`), `NaN`, `Number.MAX_SAFE_INTEGER` এর সীমাবদ্ধতা এবং কখন **BigInt** বা integer (cents) ব্যবহার করবেন — তা ব্যাখ্যা করতে পারবেন।",
    "String এর immutability এবং primitive বনাম object (value বনাম reference) এর মৌলিক পার্থক্য বুঝবেন।",
    "Dynamic typing ও implicit coercion এর ঝুঁকি চিনে স্পষ্ট রূপান্তর ও যাচাইয়ের অভ্যাস গড়ে তুলতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Data type কেন এত গুরুত্বপূর্ণ?" },
    {
      type: "p",
      text: "প্রতিটি মান (value) কেবল একটি ‘জিনিস’ নয় — তার একটি **type** আছে, আর সেই type ঠিক করে মানটির উপর কী কী অপারেশন সম্ভব এবং সেগুলো কীভাবে আচরণ করবে। `+` চিহ্ন দুটি number এ যোগ করে, কিন্তু দুটি string এ জোড়া লাগায়। `5 / 0` এ `Infinity` আসে, `\"abc\" * 2` এ `NaN` আসে। এই আচরণগুলো type থেকেই আসে। ৫ বছর frontend এ কাজ করলে আপনি এসব দেখেছেন; এই lesson এ লক্ষ্য হলো ‘কেন’ বোঝা, যাতে type সংক্রান্ত bug কে ‘JavaScript অদ্ভুত’ বলে এড়িয়ে না গিয়ে ভেতরের নিয়ম থেকে ব্যাখ্যা করা যায়।",
    },
    {
      type: "p",
      text: "JavaScript হলো **dynamically typed** ভাষা: variable এর কোনো নির্দিষ্ট type নেই, **মান** এর type আছে। একই variable এ প্রথমে number, পরে string রাখা যায় (`let x = 1; x = \"a\";`)। Type যাচাই হয় **চলার সময়**, compile এর সময় নয় — তাই ভুল type এর bug প্রোগ্রাম চলার সময়ই ধরা পড়ে (অথবা আদৌ ধরা পড়ে না, নীরবে ভুল ফল দেয়)। এই কারণেই TypeScript এর মতো static টুল এত জনপ্রিয়।",
    },
    { type: "h3", text: "৮টি type: ৭টি primitive + object" },
    {
      type: "compare",
      headers: ["Type", "উদাহরণ", "`typeof` ফল", "কখন ব্যবহার করবেন"],
      rows: [
        ["string", "`\"hello\"`, `'hi'`, template literal", "`\"string\"`", "টেক্সট: নাম, ইমেইল, ID যেগুলো গাণিতিক নয়"],
        ["number", "`42`, `3.14`, `NaN`, `Infinity`", "`\"number\"`", "সাধারণ গণিত (৬৪-বিট floating point)"],
        ["bigint", "`123n`, `2n ** 64n`", "`\"bigint\"`", "নিরাপদ সীমার চেয়ে বড় পূর্ণসংখ্যা"],
        ["boolean", "`true`, `false`", "`\"boolean\"`", "শর্ত, flag"],
        ["undefined", "`undefined`", "`\"undefined\"`", "‘মান এখনো বসেনি’ — engine এর দেওয়া ডিফল্ট"],
        ["null", "`null`", "`\"object\"` (!)", "‘ইচ্ছাকৃতভাবে কিছু নেই’ — আপনি নিজে বসান"],
        ["symbol", "`Symbol(\"id\")`", "`\"symbol\"`", "ইউনিক key, library-স্তরের লুকানো property"],
        ["object", "`{}`, `[]`, `function`, `Date`, `Map`", "`\"object\"` (function এর জন্য `\"function\"`)", "জটিল ডেটা ও আচরণ"],
      ],
    },
    {
      type: "p",
      text: "**Primitive** মানগুলো **immutable** (অপরিবর্তনীয়) এবং তুলনা হয় **মান** ধরে: `\"a\" === \"a\"` সত্য। **Object** (array ও function সহ) mutable এবং তুলনা হয় **reference** ধরে: `{} === {}` মিথ্যা, কারণ দুটি আলাদা object। Primitive এর নিজস্ব method নেই বলে মনে হলেও `\"abc\".toUpperCase()` চলে — engine সাময়িকভাবে একটি **wrapper object** (`String`) বানিয়ে method চালায়, তারপর ফেলে দেয় (autoboxing)।",
    },
    { type: "h3", text: "`typeof` এর অদ্ভুত আচরণ" },
    {
      type: "ul",
      items: [
        "`typeof null === \"object\"` — এটি JavaScript এর প্রথম দিকের একটি পুরোনো ভুল, যা backward compatibility এর কারণে আজও রয়ে গেছে। `null` object নয়। তাই object যাচাইয়ে লিখুন `value !== null && typeof value === \"object\"`।",
        "`typeof function(){}` হলো `\"function\"`, যদিও function ও আসলে object। `typeof` এখানে একটি বিশেষ ফল দেয় যা ‘callable’ বোঝায়।",
        "`typeof NaN === \"number\"` — NaN এর পুরো নাম ‘Not a Number’ হলেও এটি একটি number type এর মান (অবৈধ গাণিতিক ফলের চিহ্ন)।",
        "`typeof []` ও `\"object\"` — array আলাদা type নয়। array যাচাইয়ে `Array.isArray(value)` ব্যবহার করুন।",
        "undeclared নামে `typeof` নিরাপদ (`\"undefined\"`) — কিন্তু TDZ তে থাকা `let`/`const` এ নয়।",
      ],
    },
    { type: "h3", text: "Number: IEEE 754 floating point ও তার সীমাবদ্ধতা" },
    {
      type: "p",
      text: "JavaScript এর `number` হলো **৬৪-বিট IEEE 754 double-precision floating point**। পূর্ণসংখ্যা ও দশমিক উভয়ই একই type। বাইনারিতে `0.1` ও `0.2` সসীম দশমিকে প্রকাশ করা যায় না (যেমন দশমিকে `1/3` যায় না), তাই এগুলো খুব কাছাকাছি আনুমানিক মান হিসেবে সংরক্ষিত হয় এবং যোগফল হয় `0.30000000000000004`। এটি JavaScript এর ‘bug’ নয় — floating point ব্যবহারকারী সব ভাষাতেই (Python, Java, C) একই ঘটে।",
    },
    {
      type: "ul",
      items: [
        "`Number.MAX_SAFE_INTEGER` হলো `2 ** 53 - 1` (`9007199254740991`)। এর উপরে সব পূর্ণসংখ্যা সঠিকভাবে প্রকাশ করা যায় না: `9007199254740992 === 9007199254740993` সত্য।",
        "`Number.EPSILON` দিয়ে দুটি দশমিক সংখ্যার ‘যথেষ্ট কাছাকাছি’ তুলনা করা যায় (ছোট মানের জন্য)।",
        "টাকা-পয়সার হিসাবে দশমিক এড়ান: **সবচেয়ে ছোট একক (cents/পয়সা)** পূর্ণসংখ্যায় রাখুন, শেষে ফরম্যাট করুন (`Intl.NumberFormat`)।",
        "`NaN !== NaN`: NaN নিজের সাথেও সমান নয়। যাচাইয়ে `Number.isNaN(x)` ব্যবহার করুন। (গ্লোবাল `isNaN(x)` আগে type রূপান্তর করে, তাই `isNaN(\"abc\")` ও `true` দেয়।)",
        "`Infinity`, `-Infinity` ও `-0` ও আছে; `Number.isFinite(x)` দিয়ে যাচাই করুন।",
      ],
    },
    { type: "h3", text: "BigInt ও Symbol" },
    {
      type: "p",
      text: "**BigInt** (ES2020) সীমাহীন আকারের পূর্ণসংখ্যা রাখে; literal এ `n` প্রত্যয় (`123n`)। Number ও BigInt মেশানো যায় না — `1n + 1` `TypeError` দেয়; স্পষ্টভাবে `1n + BigInt(1)` লিখতে হয়। BigInt এ দশমিক নেই (`5n / 2n` হয় `2n`)। এটি `JSON.stringify` এ সরাসরি serialize হয় না (TypeError), আর `Math.*` ফাংশনেও চলে না। ব্যবহার: খুব বড় ID, নিখুঁত পূর্ণসংখ্যা গণিত, timestamp (nanosecond)।",
    },
    {
      type: "p",
      text: "**Symbol** (ES2015) প্রতিবার **ইউনিক** মান তৈরি করে: `Symbol(\"id\") !== Symbol(\"id\")`। বর্ণনা (description) শুধু debug এর জন্য। মূল ব্যবহার: object এ এমন property key যা অন্য কোডের key এর সাথে সংঘর্ষ করবে না, এবং ভাষার ‘well-known symbol’ (যেমন `Symbol.iterator`) যা দিয়ে আপনার object কে `for...of` এর উপযোগী করা যায়। Symbol key সাধারণ `for...in` বা `Object.keys` এ আসে না।",
    },
    {
      type: "callout",
      tone: "info",
      title: "ভুল ধারণা: ‘String ও array এর মতো, index ধরে বদলানো যায়’",
      text: "String **immutable**: `s[0] = \"J\"` কাজ করে না (non-strict mode এ নীরবে ব্যর্থ, strict mode — ES Module সহ — এ `TypeError`)। `toUpperCase()`, `slice()`, `replace()` ইত্যাদি সব **নতুন** string ফেরত দেয়, আসলটি অপরিবর্তিত থাকে। এ কারণে `s.toUpperCase();` লিখে ফল না ধরলে কিছুই ঘটে না। আরেকটি ভুল ধারণা: ‘`undefined` ও `null` একই’ — `undefined` মানে ‘বসানো হয়নি’, `null` মানে ‘ইচ্ছাকৃতভাবে ফাঁকা’; `null == undefined` সত্য হলেও `null === undefined` মিথ্যা।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "নিরাপত্তা ও নির্ভরযোগ্যতা: type সংক্রান্ত নীরব bug",
      text: "(১) **বড় ID এর precision হারানো:** API থেকে `{\"id\": 9007199254740993}` পেয়ে `JSON.parse` করলে ID টি নীরবে বদলে যায় (`9007199254740992`) — ভুল record এ পৌঁছানো বা অন্য ব্যবহারকারীর ডেটা দেখার ঝুঁকি। বড় ID কে string হিসেবে পাঠান। (২) **ইনপুট type যাচাই না করা:** `req.body.amount` string `\"10\"` এলে `+` জোড়া লেগে যায় (`\"10\" + 5 = \"105\"`); পরিমাণ/মূল্য নিয়ে এমন বিভ্রাট আর্থিক ক্ষতি ঘটাতে পারে — সার্ভারে সবসময় type ও পরিসর যাচাই করুন (schema validation)। (৩) অর্থের হিসাবে floating point এ গোলমাল জমে — integer cents ব্যবহার করুন।",
    },
    { type: "h3", text: "Type conversion ও তুলনা" },
    {
      type: "p",
      text: "JavaScript প্রয়োজনে মান স্বয়ংক্রিয়ভাবে অন্য type এ রূপান্তর করে (**implicit coercion**): `\"5\" * 2` হয় `10`, কিন্তু `\"5\" + 2` হয় `\"52\"`। `==` coercion সহ তুলনা করে (`0 == \"\"` সত্য!), `===` করে না। আধুনিক কোডে ডিফল্ট `===`, আর রূপান্তর স্পষ্ট করে লিখুন: `Number(x)`, `String(x)`, `Boolean(x)`। সব `falsy` মান মুখস্থ রাখুন: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`; বাকি সব truthy (এমনকি `\"0\"`, `[]`, `{}`)।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Browser ও Node.js এ data type",
      text: "Data type ECMAScript এর অংশ, তাই browser, Node.js, Deno সবখানে একই। পার্থক্য কেবল **আশেপাশের API** তে: যেমন Node.js এ `Buffer` (বাইনারি ডেটা) আছে যা একটি `Uint8Array` এর উপশ্রেণী, browser এ আছে `Blob`, `File`; JSON প্রসঙ্গে `BigInt` কোথাও নিজে থেকে serialize হয় না। `typeof document`, `typeof process` এর মতো যাচাই environment ভেদে আলাদা ফল দেয়।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনার বাসায় **জিনিসপত্র রাখার বিভিন্ন ধরনের পাত্র** আছে। প্রতিটি পাত্রের ওপর কিছু রাখার জন্য নির্দিষ্ট ‘ধরন’ নিয়ম আছে।",
    },
    {
      type: "ul",
      items: [
        "**Primitive মান (string, number, boolean…)** হলো **নোট-বইয়ের একটি ঘরে লেখা সংখ্যা বা শব্দ**। আপনি কাউকে ফটোকপি দিলে সে নিজের কপি পায়; তার কপিতে কাটাকুটি করলে আপনার বইয়ে প্রভাব পড়ে না (copy by value)। আর ছাপা অক্ষর কেউ মুছে বদলাতে পারে না — নতুন করে লিখতে হয় (**immutability**)।",
        "**Object** হলো **গুদাম ঘর**। আপনি কাউকে গুদামের **চাবি/ঠিকানা** দেন, গুদাম নয়। দুজনের কাছে চাবি থাকলে একজন ভেতরে জিনিস সাজালে অন্যজনও সেই বদলে দেখবে (copy by reference)।",
        "**`undefined`** হলো সদ্য কেনা, **এখনো কিছু রাখা হয়নি** এমন ফাঁকা তাক। **`null`** হলো এমন তাক যার গায়ে নিজে হাতে লিখে রেখেছেন ‘এখানে ইচ্ছাকৃতভাবে কিছু নেই’।",
        "**Number এর floating point** হলো ‘ইঞ্চি-ফিতার’ মতো: সব মাপ নিখুঁত দেখানো যায় না — এক-তৃতীয়াংশ মাপতে গেলে সবসময় একটু আনুমানিক হয়। তাই টাকার হিসাবে ফিতার ভগ্নাংশ এড়িয়ে পুরো পয়সায় (cents) গোনা নিরাপদ।",
        "**BigInt** হলো **যত লম্বা চাই তত লম্বা হিসাবের খাতা**; আর **Symbol** হলো প্রতিটি **ইউনিক সিরিয়াল-নম্বর স্টিকার** — দুটি স্টিকার দেখতে এক হলেও কখনোই এক নয়।",
        "**`typeof null === \"object\"`** হলো গুদামের পুরোনো লেবেলে ছাপার ভুল: সবাই জানে ভুল, কিন্তু বহু ক্যাটালগ ওই লেবেলের ওপর নির্ভর করে তৈরি, তাই শোধরানো হয়নি।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "৮টি type: primitive ও object এর শ্রেণিবিন্যাস",
      caption: "Primitive: stack এ (বা সরাসরি variable এ) মান; Object: heap এ, variable এ থাকে reference।",
      nodes: [
        { id: "value", label: "JavaScript Value", sub: "যেকোনো মান" },
        { id: "prim", label: "Primitive (৭টি)", sub: "immutable, মান ধরে তুলনা" },
        { id: "obj", label: "Object", sub: "mutable, reference ধরে তুলনা" },
      ],
      steps: [
        {
          active: ["value"],
          items: { value: ["প্রতিটি মান ঠিক একটি type এর"] },
          note: "JavaScript এর প্রতিটি মান ঠিক একটি type এর। সেই type ঠিক করে মানটি কীভাবে আচরণ করবে।",
        },
        {
          active: ["prim"],
          items: { prim: ["string  \"hi\"", "number  42, NaN", "bigint  10n", "boolean true"] },
          note: "প্রথম চারটি primitive: string, number, bigint, boolean। এরা **immutable** — মান বদলানো নয়, নতুন মান তৈরি হয়।",
        },
        {
          active: ["prim"],
          items: { prim: ["string  \"hi\"", "number  42, NaN", "bigint  10n", "boolean true", "undefined", "null", "symbol  Symbol('id')"] },
          note: "বাকি তিনটি primitive: `undefined`, `null`, `symbol`। মোট ৭টি primitive।",
        },
        {
          active: ["obj"],
          items: { obj: ["{ }  plain object", "[ ]  array", "function", "Date, Map, Set, RegExp…"] },
          note: "বাকি সবই **object** — array, function, Date, Map ইত্যাদি। এরা mutable এবং variable এ থাকে শুধু **reference**।",
        },
        {
          active: ["prim", "obj"],
          items: { prim: ["\"a\" === \"a\"  →  true (মান সমান)"], obj: ["{} === {}  →  false (আলাদা object)"] },
          note: "তুলনার পার্থক্য: primitive এ **মান** মিললেই সমান; object এ **একই reference** হলেই কেবল সমান।",
          output: "true false",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "typeof এর ফল: কোন মানে কী আসে",
      caption: "ব্যতিক্রমগুলো মনে রাখুন: `null`, function, array, NaN।",
      nodes: [
        { id: "in", label: "মান", sub: "যা পরীক্ষা করবেন" },
        { id: "typeof", label: "typeof", sub: "string ফেরত দেয়" },
        { id: "note", label: "সতর্কতা", sub: "কী ভুল বোঝা যায়" },
      ],
      steps: [
        {
          active: ["in", "typeof"],
          items: { in: ["42", "\"hi\"", "10n", "true"], typeof: ["\"number\"", "\"string\"", "\"bigint\"", "\"boolean\""] },
          note: "বেশিরভাগ primitive এর ফল প্রত্যাশিত: নামটাই ফেরত দেয়।",
        },
        {
          active: ["in", "typeof"],
          items: { in: ["undefined", "Symbol('s')", "function(){}"], typeof: ["\"undefined\"", "\"symbol\"", "\"function\""] },
          note: "`function` এর জন্য আলাদা ফল `\"function\"` — যদিও function আসলে object।",
          output: "function",
        },
        {
          active: ["in", "typeof", "note"],
          items: { in: ["null"], typeof: ["\"object\""], note: ["ঐতিহাসিক ভুল!", "null object নয়"] },
          note: "`typeof null` দেয় `\"object\"` — পুরোনো ভুল যা backward compatibility এর কারণে আজও আছে। null যাচাই করতে `=== null` ব্যবহার করুন।",
          output: "object",
        },
        {
          active: ["in", "typeof", "note"],
          items: { in: ["[1, 2]", "NaN"], typeof: ["\"object\"", "\"number\""], note: ["array → Array.isArray()", "NaN → Number.isNaN()"] },
          note: "array এর ফল `\"object\"` ও NaN এর ফল `\"number\"` — তাই এদের জন্য `Array.isArray` ও `Number.isNaN` ব্যবহার করুন।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Primitive কপি বনাম Object reference",
      code: 'let a = 10;\nlet b = a;\nb = 20;\nconst p = { n: 1 };\nconst q = p;\nq.n = 2;',
      steps: [
        {
          line: 0,
          memory: [{ name: "a", value: "10", kind: "let", state: "live" }],
          note: "`a` তে primitive `10` সরাসরি থাকে।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "10", kind: "let", state: "live" },
          ],
          note: "`b = a` — মানটি **কপি** হলো। এখন দুটি আলাদা `10`।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
          ],
          note: "`b` বদলালে `a` অপরিবর্তিত — কারণ কপি স্বাধীন।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 1 }", kind: "const", state: "live" },
          ],
          note: "`p` এ থাকে heap এর object এর **reference**।",
        },
        {
          line: 4,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 1 }", kind: "const", state: "live" },
            { name: "q", value: "→ (একই object)", kind: "const", state: "live" },
          ],
          note: "`q = p` — শুধু **reference** কপি হলো; object একটাই।",
        },
        {
          line: 5,
          memory: [
            { name: "a", value: "10", kind: "let", state: "live" },
            { name: "b", value: "20", kind: "let", state: "live" },
            { name: "p", value: "→ { n: 2 }", kind: "const", state: "live" },
            { name: "q", value: "→ (একই object)", kind: "const", state: "live" },
          ],
          note: "`q.n = 2` বদলাল সেই একই object, তাই `p.n` ও এখন `2`। এ কারণেই object কপি করতে `structuredClone` বা spread লাগে।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "সব type এর typeof দেখুন",
      description: "প্রতিটি type এর একটি করে নমুনা নিয়ে `typeof` এর ফল দেখুন। কোনগুলো আপনার প্রত্যাশা থেকে আলাদা — তা নিজে অনুমান করে তারপর চালান।",
      code: `const samples = [
  "hello",
  42,
  10n,
  true,
  undefined,
  null,
  Symbol("id"),
  { a: 1 },
  [1, 2, 3],
  function () {},
  NaN,
];

for (const v of samples) {
  console.log(String(typeof v).padEnd(10), "<-", typeof v === "symbol" ? "Symbol(id)" : v);
}

console.log(Array.isArray([]), Array.isArray({}));
console.log(null === null, typeof null === "object");`,
    },
    {
      level: "intermediate",
      title: "Floating point, NaN ও নিরাপদ পূর্ণসংখ্যার সীমা",
      description: "`0.1 + 0.2` কেন `0.3` নয়, `NaN` এর অদ্ভুত তুলনা, আর `MAX_SAFE_INTEGER` পার হলে কী হয় — একসাথে দেখুন।",
      code: `console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);

// NaN
console.log(NaN === NaN, Number.isNaN(NaN));
console.log(isNaN("abc"), Number.isNaN("abc")); // global isNaN আগে রূপান্তর করে
console.log(Number("12px"), Number(""), Number(null), Number(undefined));

// নিরাপদ সীমা
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MAX_SAFE_INTEGER + 1 === Number.MAX_SAFE_INTEGER + 2);
console.log(Number.isSafeInteger(2 ** 53), Number.isSafeInteger(2 ** 53 - 1));

// BigInt এ নিখুঁত
console.log(String(2n ** 64n));
console.log(String(BigInt(Number.MAX_SAFE_INTEGER) + 2n));`,
    },
    {
      level: "real-world",
      title: "টাকার হিসাব ও বড় ID: cents এবং string",
      description: "Floating point এ টাকার যোগে ভুল জমে। সমাধান: পূর্ণসংখ্যা পয়সা (cents) এ হিসাব, শেষে `Intl.NumberFormat` দিয়ে দেখানো। আর বড় ID কে string এ রাখা।",
      code: `const prices = [0.1, 0.2, 0.3];

// ভুল পথ
const naive = prices.reduce((sum, p) => sum + p, 0);
console.log("naive:", naive);

// সঠিক পথ: পয়সায় গুনে পূর্ণসংখ্যা যোগ
const cents = prices.map((p) => Math.round(p * 100));
const totalCents = cents.reduce((sum, c) => sum + c, 0);
console.log("totalCents:", totalCents);
console.log("total:", totalCents / 100);

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
console.log(fmt.format(totalCents / 100));

// বড় ID: number এ হারায়, string এ নিরাপদ
const asNumber = JSON.parse('{"id": 9007199254740993}').id;
const asString = JSON.parse('{"id": "9007199254740993"}').id;
console.log("number id:", asNumber);
console.log("string id:", asString);
console.log("BigInt দিয়ে গণনা:", String(BigInt(asString) + 1n));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log(typeof "hello");
`,
    },
    {
      label: "Dynamic typing ও coercion",
      code: `let x = 5;
console.log(typeof x);
x = "five";
console.log(typeof x);
x = [5];
console.log(typeof x);

console.log("5" + 2);     // string জোড়া
console.log("5" - 2);     // number এ রূপান্তর
console.log("5" * "2");
console.log(true + 1);
console.log([] + {});
console.log(1 < 2 < 3, 3 > 2 > 1);

// == বনাম ===
console.log(0 == "", 0 === "");
console.log(null == undefined, null === undefined);`,
    },
    {
      label: "String immutability",
      code: `let s = "hello";
console.log(s.toUpperCase());   // নতুন string
console.log(s);                 // আসলটি অপরিবর্তিত

try {
  s[0] = "J";                   // sloppy mode এ নীরবে ব্যর্থ, strict mode এ TypeError
} catch (e) {
  console.log(e.name);
}
console.log(s);

// নতুন string বানিয়ে আবার বাঁধুন
s = "J" + s.slice(1);
console.log(s);

// string এর length UTF-16 code unit গোনে
console.log("hi".length, "😀".length, [..."😀"].length);`,
    },
    {
      label: "BigInt ও Symbol",
      code: `// BigInt
const big = 12345678901234567890n;
console.log(typeof big, String(big * 2n));
console.log(String(5n / 2n));          // পূর্ণসংখ্যার ভাগ
try {
  console.log(1n + 1);
} catch (e) {
  console.log(e.name + ": " + e.message);
}
console.log(1n + BigInt(1) === 2n);

// Symbol: প্রতিবার ইউনিক
const s1 = Symbol("id");
const s2 = Symbol("id");
console.log(s1 === s2, s1.description);

const user = { name: "Rina", [s1]: 101 };
console.log(Object.keys(user));          // symbol key আসে না
console.log(user[s1]);
console.log(Object.getOwnPropertySymbols(user).length);`,
    },
  ],

  debugging: [
    {
      title: "0.1 + 0.2 === 0.3 মিথ্যা",
      bad: `const total = 0.1 + 0.2;
console.log(total === 0.3);`,
      why: "`0.1` ও `0.2` বাইনারি floating point এ ঠিক প্রকাশ করা যায় না, ফলে যোগফল `0.30000000000000004`। তাই সরাসরি `===` তুলনা মিথ্যা। দশমিক তুলনায় ছোট সহনসীমা (tolerance, `Number.EPSILON`) ব্যবহার করুন, অথবা পূর্ণসংখ্যা এককে (cents) গুনুন।",
      fix: `const total = 0.1 + 0.2;
console.log(Math.abs(total - 0.3) < Number.EPSILON);

// টাকার ক্ষেত্রে: পূর্ণসংখ্যা এককে
console.log((10 + 20) / 100 === 0.3);`,
    },
    {
      title: "TypeError: Cannot read properties of null (typeof null)",
      bad: `const user = null;
if (typeof user === "object") {
  console.log(user.name);
}`,
      why: "`typeof null` হলো `\"object\"` — তাই guard টি `null` কে আটকাতে পারে না এবং `null.name` পড়তে গিয়ে TypeError। object যাচাইয়ে `null` আলাদা করে বাদ দিন।",
      fix: `const user = null;
if (typeof user === "object" && user !== null) {
  console.log(user.name);
} else {
  console.log("user নেই");
}

// অথবা optional chaining
console.log(user?.name);`,
    },
    {
      title: "TypeError: Cannot mix BigInt and other types",
      bad: `const big = 10n;
console.log(big + 1);`,
      why: "JavaScript BigInt ও number স্বয়ংক্রিয়ভাবে মেশায় না, কারণ নিখুঁত মান হারিয়ে যেতে পারে। দুটিকে এক type এ আনতে হবে — `BigInt(1)` বা `1n`।",
      fix: `const big = 10n;
console.log(String(big + 1n));
console.log(String(big + BigInt(1)));`,
    },
    {
      title: "বড় ID নীরবে বদলে যায় (precision loss)",
      bad: `const payload = '{"orderId": 9007199254740993}';
const order = JSON.parse(payload);
console.log(order.orderId);`,
      why: "`9007199254740993` নিরাপদ পূর্ণসংখ্যার সীমা (`2 ** 53 - 1`) ছাড়িয়ে গেছে, তাই `JSON.parse` এর number এ নিকটতম প্রকাশযোগ্য মান `9007199254740992` বসে — কোনো error ছাড়াই। ID, ফোন নম্বর ও অনুরূপ ‘গণনার জন্য নয়’ মান সার্ভার থেকে **string** হিসেবে পাঠান।",
      fix: `const payload = '{"orderId": "9007199254740993"}';
const order = JSON.parse(payload);
console.log(order.orderId);

// দরকারে নিখুঁত গণনা
console.log(String(BigInt(order.orderId) + 1n));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "null কে বাদ দিয়ে object যাচাই",
      prompt: "`isObject(value)` লিখুন যা কেবল **প্রকৃত object** এর জন্য `true` দেয় (`null` এর জন্য `false`)। `isObject(null)` ও `isObject({})` print করুন।",
      starter: `function isObject(value) {
  return typeof value === "object";   // TODO: null এর জন্য ভুল
}

console.log(isObject(null));
console.log(isObject({}));`,
      expected: "false\ntrue",
      hints: ["`typeof null` হলো `\"object\"`।", "`value !== null` শর্ত যোগ করুন।"],
      solution: `function isObject(value) {
  return value !== null && typeof value === "object";
}

console.log(isObject(null));
console.log(isObject({}));`,
    },
    {
      level: "beginner",
      title: "NaN যাচাই",
      prompt: "`x === NaN` সবসময় মিথ্যা। সঠিক পদ্ধতিতে বদলে `true` print করান।",
      starter: `const x = Number("abc");
console.log(x === NaN);   // TODO: সঠিক যাচাই ব্যবহার করুন`,
      expected: "true",
      hints: ["`NaN` নিজের সমান নয়।", "`Number.isNaN(x)`।"],
      solution: `const x = Number("abc");
console.log(Number.isNaN(x));`,
    },
    {
      level: "beginner",
      title: "দশমিক যোগফল ঠিক করুন",
      prompt: "`0.1 + 0.2` এর ফল দুই দশমিক পর্যন্ত গোল করে `Number` হিসেবে print করুন, যাতে `0.3` আসে।",
      starter: `const sum = 0.1 + 0.2;
console.log(sum);   // TODO: দুই দশমিকে গোল করুন`,
      expected: "0.3",
      hints: ["`toFixed(2)` একটি string ফেরত দেয় (`\"0.30\"`)।", "`Number(...)` দিয়ে আবার number বানান।"],
      solution: `const sum = 0.1 + 0.2;
console.log(Number(sum.toFixed(2)));`,
    },
    {
      level: "intermediate",
      title: "২ এর ৬৪ ঘাত: নিখুঁত মান",
      prompt: "`2 ** 64` এ number এর precision সীমা ছাড়ায়। BigInt দিয়ে নিখুঁত মান বের করে `String(...)` করে print করুন (প্রত্যাশিত `18446744073709551616`)।",
      starter: `console.log(2 ** 64);   // TODO: BigInt ব্যবহার করুন`,
      expected: "18446744073709551616",
      hints: ["`2n ** 64n`।", "`console.log(String(...))`।"],
      solution: `console.log(String(2n ** 64n));`,
    },
    {
      level: "intermediate",
      title: "String immutable: নতুন string বানান",
      prompt: "String এর প্রথম অক্ষর বদলানো যায় না। `s` এর প্রথম অক্ষর `J` করে (নতুন string বানিয়ে) `Jello` print করুন।",
      starter: `let s = "hello";
s[0] = "J";      // TODO: কাজ করে না
console.log(s);`,
      expected: "Jello",
      hints: ["`slice(1)` প্রথম অক্ষরের পরের অংশ দেয়।", "`\"J\" + s.slice(1)` কে `s` এ বসান।"],
      solution: `let s = "hello";
s = "J" + s.slice(1);
console.log(s);`,
      explanation: "String immutable, তাই index ধরে লেখা যায় না (sloppy mode এ নীরবে ব্যর্থ, strict mode এ TypeError)। নতুন string বানিয়ে `s` এ আবার বাঁধাই একমাত্র পথ — এজন্য `s` কে `let` রাখতে হয়েছে।",
    },
    {
      level: "challenge",
      title: "নির্ভরযোগ্য typeName",
      prompt:
        "`typeName(value)` লিখুন যা `typeof` এর অদ্ভুত আচরণ ঠিক করে: `null` এর জন্য `\"null\"`, array এর জন্য `\"array\"`, বাকিদের জন্য `typeof` এর ফল। তারপর নিচের সাতটি মানের নাম এক লাইনে (স্পেস দিয়ে) print করুন।",
      starter: `function typeName(value) {
  // TODO
  return typeof value;
}

console.log(
  typeName(null),
  typeName([]),
  typeName({}),
  typeName(1n),
  typeName(Symbol("s")),
  typeName(() => 1),
  typeName(NaN)
);`,
      expected: "null array object bigint symbol function number",
      hints: [
        "প্রথমে `value === null` যাচাই করুন।",
        "তারপর `Array.isArray(value)`।",
        "বাকিদের জন্য `typeof value` ই যথেষ্ট; NaN এর ফল `number` থাকাই প্রত্যাশিত।",
      ],
      solution: `function typeName(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

console.log(
  typeName(null),
  typeName([]),
  typeName({}),
  typeName(1n),
  typeName(Symbol("s")),
  typeName(() => 1),
  typeName(NaN)
);`,
      explanation: "`typeof` এর দুই দুর্বলতা — `null` ও array কে `object` বলা — আলাদা করে ধরা হয়েছে। অর্ডার গুরুত্বপূর্ণ: `null` যাচাই আগে, কারণ `Array.isArray(null)` নিরাপদ হলেও পরে `typeof` এ `object` আসত। NaN আসলেই number type এর, তাই `number` ফেরত দেওয়া সঠিক; NaN আলাদা করতে চাইলে `Number.isNaN` লাগবে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`typeof null` এর ফল কী?",
        options: ["\"null\"", "\"undefined\"", "\"number\"", "\"object\""],
        answer: 3,
        explanation: "এটি JavaScript এর পুরোনো, backward compatibility এর কারণে রয়ে যাওয়া ভুল — `typeof null` হলো `\"object\"`। `\"null\"` ও `\"undefined\"` কাছাকাছি মনে হলেও ভুল, আর `null` কে number বলার কোনো কারণ নেই।",
      },
      {
        question: "`0.1 + 0.2 === 0.3` এর ফল কী?",
        options: ["true", "false", "TypeError", "NaN"],
        answer: 1,
        explanation: "দশমিক সংখ্যা বাইনারি floating point এ আনুমানিক সংরক্ষিত হয়, যোগফল হয় `0.30000000000000004`, তাই `===` মিথ্যা। কোনো error বা NaN আসে না — দুটি বৈধ number এর যোগ।",
      },
      {
        question: "JavaScript এ কয়টি primitive type আছে?",
        options: ["৭", "৬", "৮", "৯"],
        answer: 0,
        explanation: "৭টি: string, number, bigint, boolean, undefined, null, symbol। `object` কে ধরলে মোট ৮টি type, কিন্তু object primitive নয়। ৬ বা ৯ গণনা ভুল।",
      },
      {
        question: "`10n + 1` এর ফল কী?",
        options: ["11n", "11", "TypeError", "\"101\""],
        answer: 2,
        explanation: "BigInt ও number সরাসরি মেশানো যায় না — `TypeError: Cannot mix BigInt and other types`। স্বয়ংক্রিয় রূপান্তর নিখুঁত মান নষ্ট করতে পারে বলে ভাষা তা নিষিদ্ধ করেছে। `11n` পেতে `10n + 1n` লিখতে হয়; string জোড়া লাগানো (`\"101\"`) এখানে ঘটে না।",
      },
      {
        question: "`typeof typeof 1` এর ফল কী?",
        options: ["\"number\"", "\"string\"", "\"undefined\"", "\"object\""],
        answer: 1,
        explanation: "ভেতরের `typeof 1` দেয় string `\"number\"`; তখন বাইরের `typeof \"number\"` দেয় `\"string\"`। কারণ `typeof` সবসময় একটি **string** ফেরত দেয়। বাকি অপশনগুলো ভেতরের ফল বা অন্য type ধরে নেয়।",
      },
    ],
    coding: [
      {
        title: "প্রকৃত সসীম number যাচাই",
        prompt: "`isPlainNumber(v)` লিখুন যা কেবল **সসীম number** এর জন্য `true` দেয় (`NaN`, `Infinity`, string এর জন্য নয়)। চারটি মান পরীক্ষা করুন: `5`, `NaN`, `\"5\"`, `Infinity` (প্রত্যাশিত `true false false false`)।",
        starter: `function isPlainNumber(v) {
  return typeof v === "number";   // TODO: NaN ও Infinity বাদ দিন
}

console.log(isPlainNumber(5), isPlainNumber(NaN), isPlainNumber("5"), isPlainNumber(Infinity));`,
        expected: "true false false false",
        solution: `function isPlainNumber(v) {
  return typeof v === "number" && Number.isFinite(v);
}

console.log(isPlainNumber(5), isPlainNumber(NaN), isPlainNumber("5"), isPlainNumber(Infinity));`,
      },
      {
        title: "পয়সায় যোগ করে নিখুঁত মোট",
        prompt: "`[0.1, 0.2, 0.3]` এর যোগফল floating point ভুল এড়িয়ে `0.6` print করুন। প্রতিটি মানকে পয়সায় (`Math.round(p * 100)`) রূপান্তর করে পূর্ণসংখ্যা যোগ করুন, শেষে `100` দিয়ে ভাগ করুন।",
        starter: `const prices = [0.1, 0.2, 0.3];
const total = prices.reduce((sum, p) => sum + p, 0);
console.log(total);`,
        expected: "0.6",
        solution: `const prices = [0.1, 0.2, 0.3];
const totalCents = prices.reduce((sum, p) => sum + Math.round(p * 100), 0);
console.log(totalCents / 100);`,
      },
    ],
  },

  interview: [
    {
      q: "JavaScript এ কয়টি data type আছে? Primitive ও object এর মূল পার্থক্য কী?",
      a: "মোট ৮টি: ৭টি primitive (string, number, bigint, boolean, undefined, null, symbol) এবং object (array, function, Date, Map ইত্যাদি সহ)।\n\n**Primitive:** immutable, তুলনা ও কপি হয় **মান** ধরে, নিজস্ব property নেই (method চালানোর সময় engine সাময়িক wrapper object বানায়)। **Object:** mutable, variable এ থাকে **reference**, তুলনা হয় reference ধরে (`{} === {}` মিথ্যা), কপি করলে reference কপি হয় — তাই একটি বদলালে অন্যটিতেও প্রভাব পড়ে। আসল কপির জন্য `structuredClone` বা spread (shallow) ব্যবহার করতে হয়।",
    },
    {
      q: "`typeof null` কেন `\"object\"`? `null` ও `undefined` এর পার্থক্য কী?",
      a: "`typeof null === \"object\"` হলো ভাষার প্রথম দিকের একটি ভুল, যা সংশোধন করলে বিদ্যমান ওয়েবসাইট ভেঙে যেত বলে (backward compatibility) আজও রয়ে গেছে। `null` আসলে object নয়; তাই object যাচাইয়ে `value !== null && typeof value === \"object\"` লিখতে হয়।\n\n**`undefined`** মানে ‘মান এখনো বসেনি’ — engine ডিফল্টভাবে দেয় (বসানো হয়নি এমন variable, অনুপস্থিত property, return ছাড়া function)। **`null`** মানে ‘ইচ্ছাকৃতভাবে ফাঁকা’ — ডেভেলপার নিজে বসান। `null == undefined` সত্য, কিন্তু `===` মিথ্যা। API তে ‘মান নেই’ বোঝাতে সাধারণত `null` পছন্দ করা হয় (JSON এ `undefined` নেই)।",
    },
    {
      q: "কেন `0.1 + 0.2 !== 0.3`? বাস্তবে টাকার হিসাব কীভাবে করবেন?",
      a: "JavaScript এর number হলো ৬৪-বিট IEEE 754 double। বাইনারিতে `0.1` ও `0.2` সসীমভাবে প্রকাশ করা যায় না (যেমন দশমিকে `1/3` যায় না), তাই এগুলো নিকটতম আনুমানিক মান হিসেবে সংরক্ষিত হয়, আর যোগফল হয় `0.30000000000000004`। এটি JavaScript এর নিজস্ব ত্রুটি নয়; floating point ব্যবহারকারী সব ভাষায় এমন হয়।\n\nটাকার হিসাবে: সবচেয়ে ছোট এককে (পয়সা/cents) **পূর্ণসংখ্যা** রাখুন ও যোগ-বিয়োগ করুন, শুধু দেখানোর সময় ভাগ করে `Intl.NumberFormat` এ ফরম্যাট করুন। বড় ও নিখুঁত দরকার হলে BigInt বা সার্ভারে decimal library। দশমিক তুলনায় `Math.abs(a - b) < Number.EPSILON` এর মতো সহনসীমা ব্যবহার করুন।",
    },
    {
      q: "`Number.MAX_SAFE_INTEGER` কী? এর বেশি মান নিয়ে কী সমস্যা হয় এবং BigInt কখন লাগে?",
      a: "`Number.MAX_SAFE_INTEGER` হলো `2 ** 53 - 1 = 9007199254740991`; double এর ম্যান্টিসা এই পর্যন্ত **প্রতিটি পূর্ণসংখ্যা অনন্যভাবে** প্রকাশ করতে পারে। এর উপরে কিছু পূর্ণসংখ্যা প্রকাশযোগ্য নয়, ফলে ‘গোল’ হয়: `2 ** 53 === 2 ** 53 + 1` সত্য। সমস্যাটি নীরব — error আসে না।\n\nবাস্তব ঝুঁকি: ডাটাবেসের ৬৪-বিট ID `JSON.parse` এ বদলে যাওয়া। সমাধান: ID string এ পাঠান, বা **BigInt** ব্যবহার করুন (`123n`)। BigInt এ number এর সাথে মেশানো যায় না, `JSON.stringify` সরাসরি পারে না (কাস্টম serializer লাগে), আর দশমিক নেই। তাই সাধারণ গণিতে number, খুব বড় নিখুঁত পূর্ণসংখ্যায় BigInt।",
    },
    {
      q: "String কেন immutable? `s[0] = 'J'` করলে কী হয়?",
      a: "String immutable মানে একবার তৈরি হলে এর ভেতরের অক্ষর বদলানো যায় না। এতে engine নিরাপদে একই string ভাগ করে ব্যবহার করতে পারে (কপি না করেই), hash ও তুলনা সহজ হয়, এবং string কে object key হিসেবে নির্ভরযোগ্যভাবে ব্যবহার করা যায়। (Engine ভেতরে নিজের optimization করলেও ভাষার স্তরে আচরণ immutable।)\n\n`s[0] = \"J\"` লিখলে non-strict (sloppy) mode এ নীরবে কিছুই ঘটে না; strict mode (ES Module, class body সহ) এ `TypeError`। সব string method (`toUpperCase`, `slice`, `replace`) নতুন string ফেরত দেয় — তাই ফল না ধরলে কাজ হারিয়ে যায়: `s = s.toUpperCase()`।",
    },
    {
      q: "Dynamic typing ও implicit coercion এর ঝুঁকি কী? কীভাবে সামলাবেন?",
      a: "Dynamic typing এ type চলার সময় ঠিক হয়, তাই ভুল type এর মান ঢুকলে প্রোগ্রাম নীরবে ভুল ফল দেয়: `\"10\" + 5` হয় `\"105\"`, `\"10\" - 5` হয় `5`। `==` coercion করে (`0 == \"\"` সত্য, `null == undefined` সত্য), যা অনুমান কঠিন করে।\n\nসামলানোর উপায়: (১) ডিফল্ট `===`; (২) স্পষ্ট রূপান্তর — `Number(x)`, `String(x)`, `Boolean(x)`; (৩) সীমানায় (API ইনপুট, form, `localStorage`) schema validation (যেমন Zod) ও `Number.isFinite`/`Array.isArray` জাতীয় যাচাই; (৪) TypeScript ও lint rule (`eqeqeq`)। এছাড়া falsy মানগুলো মুখস্থ রাখুন (`false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`) যাতে `if (count)` এ ০ এর ভুল না হয়।",
    },
  ],

  summary: {
    takeaways: [
      "৮টি type: string, number, bigint, boolean, undefined, null, symbol (primitive) ও object।",
      "Primitive immutable ও মান ধরে তুলনা; object mutable ও reference ধরে তুলনা।",
      "`typeof null === \"object\"` ঐতিহাসিক ভুল; array এর জন্য `Array.isArray`, NaN এর জন্য `Number.isNaN`।",
      "Number মানে IEEE 754 double: `0.1 + 0.2 !== 0.3`; নিরাপদ পূর্ণসংখ্যার সীমা `2 ** 53 - 1`।",
      "বড় পূর্ণসংখ্যায় BigInt (number এর সাথে মেশে না); বড় ID পাঠাতে string; টাকায় integer cents।",
      "Dynamic typing ও coercion এর ঝুঁকি এড়াতে `===`, স্পষ্ট রূপান্তর ও সীমানায় যাচাই ব্যবহার করুন।",
    ],
    syntax: `typeof "hi";            // "string"
typeof 42;              // "number"
typeof 10n;             // "bigint"
typeof Symbol("id");    // "symbol"
typeof undefined;       // "undefined"
typeof null;            // "object"  (ঐতিহাসিক ভুল)
typeof (() => 1);       // "function"

Number.isNaN(x);        // NaN যাচাই
Number.isSafeInteger(n);
Array.isArray(v);
value !== null && typeof value === "object";`,
    whenToUse: [
      "সাধারণ গণিতে `number`; টাকায় পূর্ণসংখ্যা (cents); ID/ফোন নম্বরে `string`।",
      "২^৫৩ এর চেয়ে বড় নিখুঁত পূর্ণসংখ্যায় `bigint`।",
      "ইউনিক ও সংঘর্ষ-মুক্ত property key বা protocol (`Symbol.iterator`) এ `symbol`।",
      "‘ইচ্ছাকৃতভাবে ফাঁকা’ বোঝাতে `null`, ‘বসানো হয়নি’ বোঝাতে `undefined` (নিজে সচরাচর বসাবেন না)।",
      "বাইরের ডেটা (API, form) ব্যবহারের আগে type ও পরিসর যাচাই করুন।",
    ],
    next: [
      "Primitive vs Reference Types — copy, তুলনা ও `const` এর mutation এর গভীর কারণ",
      "Type Conversion ও Coercion — `==` বনাম `===`, truthy/falsy",
      "Operators ও Expressions",
    ],
  },

  compatibility:
    "Data type ECMAScript এর অংশ, তাই browser, Node.js ও Deno তে আচরণ একই। `bigint` ও `symbol` আধুনিক সব browser ও Node.js এ সমর্থিত (BigInt ES2020, Node 10.4+; Symbol ES2015)। পার্থক্য কেবল আশেপাশের API তে: Node.js এ `Buffer`, browser এ `Blob`/`File`; `JSON.stringify` কোথাও BigInt নিজে serialize করে না। এই lesson এর সব executable কোড pure JavaScript, তাই browser এর Web Worker Playground এ চলে।",
};
