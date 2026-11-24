import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`if / else if / else`, `switch` ও ternary (`? :`) এর কাজ, নিয়ম ও সীমাবদ্ধতা নিজে explain করতে পারবেন।",
    "`switch` এর strict comparison, fallthrough, `break` এবং `case` এ `{ }` দিয়ে block scope — এই চারটি জিনিস ঠিকভাবে ব্যবহার করতে পারবেন।",
    "Guard clause ও early return দিয়ে deep nesting কমিয়ে কোড পড়ার উপযোগী করতে পারবেন।",
    "লম্বা `if/else` বা `switch` এর বদলে lookup object / `Map` কখন ও কীভাবে ব্যবহার করবেন — তা বুঝবেন।",
    "Truthiness এর ফাঁদ (`0`, `\"\"`, `NaN`) চিনে condition আরও নির্ভুল লিখতে পারবেন।",
    "Validate-then-act pattern দিয়ে input যাচাই করে তারপর কাজ করার কোড সাজাতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Conditional statement কেন দরকার?" },
    {
      type: "p",
      text: "একটি প্রোগ্রাম যদি সবসময় ওপর থেকে নিচে একই লাইনগুলো চালাত, তবে সেটি শুধু একটি স্থির স্ক্রিপ্ট হতো। বাস্তব কাজে সিদ্ধান্ত নিতে হয়: user login করা আছে কি না, cart খালি কি না, input বৈধ কি না, API থেকে কী status এসেছে। **Conditional statement** হলো সেই ব্যবস্থা, যার মাধ্যমে একটি expression এর ফল (সত্য বা মিথ্যা) দেখে engine ঠিক করে কোন কোড চলবে আর কোনটি **চলবে না**। অর্থাৎ এটি প্রোগ্রামের **control flow** নিয়ন্ত্রণ করে।",
    },
    {
      type: "p",
      text: "ভেতরে কী ঘটে? `if (condition)` এ engine প্রথমে `condition` expression টি evaluate করে একটি মান পায়। তারপর সেই মানকে **boolean এ রূপান্তর** করে (ToBoolean — যাকে আমরা truthy/falsy বলি)। ফল `true` হলে পরের statement/block চলে, নইলে সেটি পুরোপুরি skip হয়ে যায়। মনে রাখবেন: condition কে `true`/`false` হতেই হবে এমন নয় — যেকোনো মান দেওয়া যায়, engine নিজে তাকে boolean এ বদলে নেয়। এই সুবিধাই আবার অনেক bug এর উৎস।",
    },
    { type: "h3", text: "if / else if / else" },
    {
      type: "code",
      caption: "ওপর থেকে নিচে পরীক্ষা হয়; প্রথম যে condition সত্য, শুধু সেই block চলে",
      code: `if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}`,
    },
    {
      type: "p",
      text: "`else if` আসলে কোনো আলাদা keyword নয়। এটি হলো `else` এর ভেতরে আরেকটি `if` statement — শুধু `{ }` বাদ দিয়ে লেখা। তাই চেইনটি সবসময় **ওপর থেকে নিচে** পরীক্ষা হয় এবং **প্রথম মিল পাওয়া মাত্র** বাকি সব শাখা বাদ পড়ে। এর একটি বাস্তব ফল: condition এর **ক্রম** গুরুত্বপূর্ণ। যদি `score >= 70` কে `score >= 90` এর আগে রাখেন, তবে ৯৫ পেলেও প্রথম শাখাই চলবে। সবসময় সবচেয়ে নির্দিষ্ট (specific) condition আগে রাখুন।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "সবসময় `{ }` ব্যবহার করুন",
      text: "একটি statement হলে `{ }` ছাড়াও `if` লেখা যায়, কিন্তু পরে কেউ আরেকটি লাইন যোগ করলে সেটি `if` এর ভেতরে ঢুকবে না — এবং indentation দেখে যেমন মনে হয় তেমন আচরণ হবে না। এটি একটি পরিচিত bug এর কারণ। Team এর সব linter ও formatter (ESLint `curly` rule, Prettier) এই অভ্যাসকেই সমর্থন করে।",
    },
    { type: "h3", text: "switch: একটি মানকে অনেক সম্ভাবনার সাথে মেলানো" },
    {
      type: "p",
      text: "যখন **একটিই মান** কে অনেকগুলো নির্দিষ্ট মানের সাথে মেলাতে হয় (যেমন `status === \"pending\"`, `\"shipped\"`, `\"delivered\"`), তখন `switch` পরিষ্কার হয়। `switch (expr)` এ `expr` একবার evaluate হয়; তারপর engine ওপর থেকে নিচে প্রতিটি `case` এর মানের সাথে **strict equality (`===`)** দিয়ে তুলনা করে। প্রথম মিলের জায়গা থেকে কোড চলতে শুরু করে। কোনোটি না মিললে `default` এ যায় (`default` টি যেকোনো জায়গায় লেখা যায়, তবে শেষে রাখাই প্রচলিত)।",
    },
    {
      type: "ul",
      items: [
        "**Strict comparison:** `switch (1) { case \"1\": ... }` মিলবে না, কারণ `1 === \"1\"` মিথ্যা। কোনো type coercion হয় না।",
        "**Fallthrough:** মিল পাওয়ার পর `break` (বা `return`/`throw`) না পেলে engine পরের `case` এর কোডও চালাতে থাকে — পরের case এর মান মিলুক বা না মিলুক। এটি switch এর সবচেয়ে বড় bug-উৎস। ইচ্ছাকৃতভাবে একাধিক case একই কাজ করাতে চাইলে (`case 6: case 7:`) fallthrough কাজে লাগে, তখন একটি comment দিয়ে ইচ্ছাটি জানিয়ে রাখুন।",
        "**Block scope:** পুরো `switch` এর `{ }` মিলিয়ে **একটিই** block scope। তাই দুটি `case` এ `let x` বা `const x` লিখলে SyntaxError (redeclaration)। প্রতিটি case এর কোড আলাদা `{ }` এ মুড়ে দিলে সমস্যা মেটে।",
        "**`switch (true)` কৌশল:** `case score > 90:` লিখলে আসলে `true === (score > 90)` তুলনা হয়। কাজ করে, কিন্তু সাধারণ `if/else if` এর চেয়ে পরিষ্কার নয় — তাই এটি এড়িয়ে `if/else if` ব্যবহার করুন।",
      ],
    },
    { type: "h3", text: "Ternary operator: একটি মান বেছে নেওয়ার expression" },
    {
      type: "p",
      text: "`condition ? valueIfTrue : valueIfFalse` একটি **expression** — অর্থাৎ এটি একটি মান উৎপন্ন করে এবং `const label = age >= 18 ? \"Adult\" : \"Minor\";` এর মতো জায়গায় বসানো যায়। `if` হলো **statement**; এটি কোনো মান ফেরত দেয় না। তাই যেখানে লক্ষ্য শুধু একটি মান বেছে নেওয়া, সেখানে ternary উপযুক্ত। কিন্তু যেখানে একাধিক কাজ (side effect) করতে হবে, সেখানে `if` ই ভালো। দুই স্তরের বেশি nested ternary পড়া কঠিন — তখন `if/else if` বা lookup ব্যবহার করুন।",
    },
    { type: "h3", text: "Guard clause ও early return: nesting কমান" },
    {
      type: "p",
      text: "অনেক নতুন কোডে এমন দেখা যায়: `if (a) { if (b) { if (c) { ...আসল কাজ... } } }`। প্রতিটি স্তর পাঠকের মনে একটি করে ‘এখনো কোন শর্তের ভেতরে আছি’ মনে রাখার বোঝা চাপায়। **Guard clause** এর ধারণা উল্টো: অবৈধ বা বিশেষ ক্ষেত্রগুলো function এর **শুরুতেই** পরীক্ষা করে সাথে সাথে `return` (বা `throw`) করুন। যা বাকি থাকে সেটিই ‘সুখের পথ’ (happy path) — যা কোনো nesting ছাড়াই নিচে সোজা লেখা থাকে। ফল: কম indentation, কম মানসিক বোঝা, এবং edge case গুলো এক জায়গায় দৃশ্যমান।",
    },
    {
      type: "code",
      caption: "Guard clause: অবৈধ ক্ষেত্র আগে বাদ, আসল কাজ নিচে সোজা",
      code: `function shippingFee(order) {
  if (!order) return "no order";
  if (order.items.length === 0) return "empty cart";
  if (order.country !== "BD") return 500;
  return order.total > 1000 ? 0 : 60;
}`,
    },
    { type: "h3", text: "Switch এর বিকল্প: lookup object ও Map" },
    {
      type: "p",
      text: "যখন প্রতিটি case আসলে ‘key থেকে value’ মেলানো (status code → বার্তা, role → permission), তখন লম্বা `switch` এর বদলে একটি **lookup table** পরিষ্কার। ডেটা (কী কী আছে) ও লজিক (কীভাবে খুঁজব) আলাদা হয়ে যায়, নতুন entry যোগ করা এক লাইনের কাজ। দুটি পথ আছে:",
    },
    {
      type: "compare",
      headers: ["দিক", "Plain object `{ }`", "`Map`"],
      rows: [
        ["Key এর type", "শুধু string/symbol (সংখ্যা string এ রূপান্তরিত হয়)", "যেকোনো মান (number, object ইত্যাদি) আসল type সহ"],
        ["Inherited key এর ঝুঁকি", "আছে — `obj[\"constructor\"]` prototype থেকে মান দেয়", "নেই — শুধু নিজের সংরক্ষিত entry"],
        ["অনুপস্থিত key চেক", "`Object.hasOwn(obj, key)` (ES2022) বা `??`", "`map.has(key)` / `map.get(key) ?? default`"],
        ["কখন ভালো", "ছোট, স্থির, string-key এর table", "dynamic key, সংখ্যা key, বা user-input থেকে আসা key"],
      ],
    },
    {
      type: "p",
      text: "তবে lookup সবসময় `switch` কে হারায় না। যেখানে প্রতিটি শাখায় একাধিক statement চলে বা জটিল শর্ত (`>`, `<`, range) আছে, সেখানে `if/else if` বা `switch` ঠিক। Lookup এর মান হিসেবে function রাখাও যায় (`handlers[type]?.(payload)`), কিন্তু user-input থেকে আসা key দিয়ে প্রথমে অবশ্যই যাচাই করুন সেটি আপনার নিজের table এর key কি না।",
    },
    { type: "h3", text: "Truthiness: condition এ যা লুকিয়ে থাকে" },
    {
      type: "p",
      text: "JavaScript এ নিচের মানগুলো **falsy**: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`। আর কিছু সব **truthy** — এমনকি `\"0\"`, `\"false\"`, `[]` ও `{}` ও। বিস্তারিত নিয়ম ‘Truthy / Falsy’ lesson এ আছে; এখানে শুধু সিদ্ধান্ত নেওয়ার সময়কার ফাঁদটি দেখুন: `if (quantity)` লিখলে quantity `0` হলে কোড ভুল শাখায় যায়, অথচ `0` একটি বৈধ মান হতে পারে। যেখানে ‘মান আছে কি নেই’ আর ‘মান অর্থপূর্ণ কি না’ আলাদা প্রশ্ন, সেখানে স্পষ্ট তুলনা লিখুন: `quantity !== undefined`, `Number.isFinite(quantity)`, বা `quantity ?? 1`।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Short-circuit ও conditional",
      text: "`&&`, `||`, `??` আসলে কিছুটা conditional এর কাজই করে: `user && user.name` এর ডানদিক শুধু বাম দিক truthy হলে evaluate হয়। এগুলো ‘Operators’ lesson এ বিস্তারিত আছে। নিয়ম: মান নির্বাচন বা default বসানোর জন্য ঠিক আছে (`name ?? \"Guest\"`), কিন্তু একাধিক কাজ করার জন্য (`ok && doA() && doB()`) `if` ব্যবহার করুন — পাঠকের জন্য উদ্দেশ্য স্পষ্ট থাকে।",
    },
    {
      type: "p",
      text: "আরেকটি প্রায়ই-লাগা পরীক্ষা হলো ‘key আছে কি না’। `\"name\" in obj` পরীক্ষা করে property টি object এ **বা তার prototype chain এ** আছে কি না। নিজের (own) property হিসেবে আছে কি না জানতে `Object.hasOwn(obj, \"name\")` (ES2022) ব্যবহার করুন। আর array তে কোনো মান আছে কি না জানতে `arr.includes(value)` — সংখ্যা index নয় (`in` array তে index পরীক্ষা করে, মান নয়, যা অনেককে বিভ্রান্ত করে)।",
    },
    { type: "h3", text: "Validate-then-act pattern" },
    {
      type: "p",
      text: "নিরাপদ কোডের একটি মৌলিক ধাপবিন্যাস: **(১)** input সংগ্রহ, **(২)** যাচাই (validate) — সব নিয়ম পরীক্ষা করে ত্রুটির তালিকা বানানো, **(৩)** ত্রুটি থাকলে কাজ না করে সেগুলো জানানো, **(৪)** ত্রুটি না থাকলে তবেই আসল কাজ (save, charge, send)। বৈধতা পরীক্ষার আগে কোনো side effect ঘটানো যাবে না। Guard clause এই pattern এর স্বাভাবিক সঙ্গী।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "**(১)** ‘`else if` আলাদা একটি syntax’ — না, এটি `else` এর ভেতর `if`। **(২)** ‘switch `==` দিয়ে মেলায়’ — না, `===` দিয়ে; `\"1\"` ও `1` মিলে না। **(৩)** ‘`case` এ break না দিলে পরের case এর মান মিলতে হবে’ — না, মিল পাওয়ার পর মান যাচাই ছাড়াই নিচের সব কোড চলে। **(৪)** ‘`[]` falsy’ — না, empty array truthy; খালি কি না জানতে `arr.length === 0`। **(৫)** ‘Ternary সবসময় `if` এর চেয়ে ভালো’ — শুধু মান বেছে নেওয়ার ক্ষেত্রে।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security: client-side check কখনো যথেষ্ট নয়",
      text: "Browser এ `if (user.isAdmin) { showAdminPanel(); }` শুধু UI লুকায় — এটি **নিরাপত্তা নয়**, কারণ user DevTools দিয়ে মান বদলাতে পারে বা সরাসরি API ডাকতে পারে। প্রকৃত authorization সবসময় server এ যাচাই করুন। এছাড়া, user-input থেকে আসা key দিয়ে `handlers[key]` ডাকার আগে `Object.hasOwn` বা `Map` দিয়ে নিশ্চিত হোন — নইলে `\"constructor\"` বা `\"__proto__\"` এর মতো inherited key দিয়ে অপ্রত্যাশিত কোড চালানো যেতে পারে। শর্তে `=` (assignment) ও `===` গুলিয়ে ফেলাও একটি পরিচিত নিরাপত্তা-ত্রুটি: `if (role = \"admin\")` সবাইকে admin বানিয়ে ফেলে।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "`if`, `switch`, ternary, `Object.hasOwn`, `??` — সব ECMAScript এর অংশ, তাই browser ও Node.js এ একই আচরণ। পার্থক্য শুধু আপনি condition এ কী মান দেন তাতে: browser এ `window`/`document` সংক্রান্ত feature detection (`typeof window !== \"undefined\"`), Node এ `process.env` — এগুলো environment-নির্ভর, কিন্তু conditional এর নিয়ম একই।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **বিমানবন্দরের চেক-ইন ও নিরাপত্তা তল্লাশি** কল্পনা করুন। আপনি পথে যত গেট পার হন, প্রতিটিতে একজন কর্মকর্তা একটিই প্রশ্ন করেন এবং উত্তর ‘না’ হলে আপনাকে সেখানেই থামিয়ে ফিরিয়ে দেন।",
    },
    {
      type: "ul",
      items: [
        "**Guard clause** হলো এই গেটগুলো: পাসপোর্ট নেই? — এখানেই ফেরত। টিকিট নেই? — ফেরত। বোর্ডিং পাস নেই? — ফেরত। যিনি সব গেট পার করেন, তাঁর জন্য বিমানে ওঠা একটি সোজা পথ। ভেতরের গেটের ভেতরে গেট (deep nesting) বানালে কর্মীরা নিজেরাই বিভ্রান্ত হতেন।",
        "**`if / else if / else`** হলো লাইনে দাঁড়ানো কাউন্টার: ‘ফার্স্ট ক্লাস? — এই কাউন্টার। না হলে বিজনেস? — ওই কাউন্টার। না হলে ইকোনমি।’ প্রথম মিলের কাউন্টারেই আপনার কাজ শেষ — বাকি কাউন্টার আর দেখা হয় না। তাই কাউন্টারের ক্রম গুরুত্বপূর্ণ।",
        "**`switch`** হলো গেট নম্বর অনুযায়ী ডিসপ্লে বোর্ড: ফ্লাইট নম্বর (একটিই মান) মিলিয়ে সরাসরি সঠিক গেটে পাঠানো। `break` ভুলে গেলে আপনি নিজের গেটে ঢুকেও পরের গেট, তার পরের গেট দিয়ে হেঁটে যাবেন — এটাই fallthrough।",
        "**Ternary** হলো কার্ডের রঙ বেছে নেওয়ার মতো ছোট সিদ্ধান্ত — ‘ফার্স্ট ক্লাস হলে সোনালি, নইলে নীল’ — এক ঝলকে একটি মান পাওয়া।",
        "**Validate-then-act**: তল্লাশিতে সব নিয়ম মিলিয়ে দেখার পরই বিমানে ওঠার অনুমতি; তল্লাশি ছাড়া আগে-ওঠা বিমানে কোনো ‘ফেরত নেওয়া’ নেই। আর **Truthiness এর ফাঁদ** হলো এমন কর্মী যে ‘লগেজ ০ কেজি’ শুনে ভাবে ‘লগেজ নেই, তথ্য অনুপস্থিত’ — অথচ ০ একটি বৈধ উত্তর।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "if / else if / else চেইন: score = 72 এর জন্য প্রবাহ",
      caption: "প্রথম সত্য শাখা চলে, বাকি শাখা একেবারেই পরীক্ষা হয় না।",
      nodes: [
        { id: "input", label: "Input", sub: "score = 72" },
        { id: "c1", label: "score >= 90 ?", sub: "if" },
        { id: "c2", label: "score >= 80 ?", sub: "else if" },
        { id: "c3", label: "score >= 70 ?", sub: "else if" },
        { id: "else", label: "else", sub: "fallback" },
        { id: "after", label: "চেইনের পরের কোড" },
      ],
      steps: [
        {
          active: ["input"],
          items: { input: ["score = 72"] },
          note: "চেইন শুরুর আগে `score` এর মান জানা আছে। এখন engine ওপর থেকে নিচে condition পরীক্ষা শুরু করবে।",
        },
        {
          active: ["c1"],
          items: { c1: ["72 >= 90 → false"] },
          note: "প্রথম condition মিথ্যা, তাই এই শাখার block skip হয় এবং পরের `else if` এ যাওয়া হয়।",
        },
        {
          active: ["c2"],
          items: { c2: ["72 >= 80 → false"] },
          note: "দ্বিতীয় condition ও মিথ্যা। এখনো কোনো block চলেনি।",
        },
        {
          active: ["c3"],
          items: { c3: ["72 >= 70 → true", "grade = \"C\""] },
          output: "grade: C",
          note: "তৃতীয় condition সত্য — এই block চলে। এখানেই চেইনের সিদ্ধান্ত শেষ।",
        },
        {
          active: ["after"],
          items: { else: ["(পরীক্ষাই হয়নি)"] },
          note: "`else` শাখা skip হয়ে গেল, কারণ আগেই একটি শাখা মিলেছে। এখন চেইনের পরের কোড চলে। ক্রম উল্টে `>= 70` প্রথমে রাখলে ৯৫ ও ৭২ দুজনেই ‘C’ পেত — তাই specific আগে।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "switch এর fallthrough: switch (2) এ break না থাকলে কী হয়",
      code: 'let log = "";\nswitch (2) {\n  case 1: log += "a";\n  case 2: log += "b";\n  case 3: log += "c"; break;\n  default: log += "d";\n}',
      steps: [
        {
          line: 0,
          memory: [{ name: "log", value: '""', kind: "let", state: "live" }],
          note: "`log` একটি খালি string দিয়ে শুরু।",
        },
        {
          line: 1,
          memory: [{ name: "log", value: '""', kind: "let", state: "live" }],
          note: "`switch (2)` — engine মান `2` কে ওপর থেকে প্রতিটি case এর সাথে `===` দিয়ে মেলায়: `2 === 1` মিথ্যা, `2 === 2` সত্য। এখান থেকে execution শুরু হবে।",
        },
        {
          line: 3,
          memory: [{ name: "log", value: '"b"', kind: "let", state: "live" }],
          note: "`case 2` এর কোড চলল: `log` হলো `\"b\"`। কিন্তু এই লাইনে `break` নেই।",
        },
        {
          line: 4,
          memory: [{ name: "log", value: '"bc"', kind: "let", state: "live" }],
          note: "**Fallthrough:** `case 3` এর মান `2` এর সাথে মেলে না, তবু engine মান যাচাই না করেই নিচের কোড চালাল। `log` হলো `\"bc\"`। তারপর `break` এ switch থেকে বেরিয়ে গেল।",
        },
        {
          line: 6,
          memory: [{ name: "log", value: '"bc"', kind: "let", state: "live" }],
          output: "bc",
          note: "`default` এ আর পৌঁছানো হয়নি — `break` এর কারণে। ফল `\"bc\"`। ইচ্ছাকৃত না হলে প্রতিটি case এর শেষে `break`/`return` দিন।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "if / else if / else দিয়ে grade নির্ধারণ",
      description: "ক্রম কেন গুরুত্বপূর্ণ তা লক্ষ্য করুন: সবচেয়ে বড় threshold আগে। কোড চালানোর আগে অনুমান করুন প্রতিটি score এ কী print হবে।",
      code: `function gradeOf(score) {
  if (score >= 90) {
    return "A";
  } else if (score >= 80) {
    return "B";
  } else if (score >= 70) {
    return "C";
  } else {
    return "F";
  }
}

const scores = [95, 82, 70, 41];
for (const s of scores) {
  console.log(s, "->", gradeOf(s));
}

// ternary: ছোট একটি মান বেছে নেওয়া
const age = 17;
const label = age >= 18 ? "Adult" : "Minor";
console.log(label);`,
    },
    {
      level: "intermediate",
      title: "switch: strict comparison, fallthrough ও block scope",
      description: "তিনটি আচরণ একসাথে দেখুন: `\"1\"` ও `1` আলাদা, ইচ্ছাকৃত grouped case (`6` ও `7`), এবং `case` এ `{ }` দিয়ে `const` ব্যবহার।",
      code: `function describe(value) {
  switch (value) {
    case 1:
      return "number one";
    case "1":
      return "string one";
    case 6:
    case 7: // ইচ্ছাকৃত fallthrough: দুটিই weekend
      return "weekend";
    case 8: {
      const note = "braces দিয়ে নিজস্ব scope";
      return note;
    }
    case 9: {
      const note = "এখানেও const note — কোনো conflict নেই";
      return note;
    }
    default:
      return "unknown";
  }
}

console.log(describe(1));
console.log(describe("1"));
console.log(describe(7));
console.log(describe(8));
console.log(describe(9));
console.log(describe(true));`,
    },
    {
      level: "real-world",
      title: "Guard clause + validate-then-act + lookup table",
      description: "একটি অর্ডার প্রক্রিয়া: আগে সব ভুল সংগ্রহ (validate), ভুল থাকলে কোনো কাজ নয়; নইলে একটি lookup table থেকে shipping rate নিয়ে হিসাব। এখানে `Map` ব্যবহার হয়েছে কারণ key আসে বাইরের ডেটা থেকে।",
      code: `const shippingRates = new Map([
  ["standard", 60],
  ["express", 150],
]);

function validate(order) {
  const errors = [];
  if (!order || typeof order !== "object") return ["order missing"];
  if (!Array.isArray(order.items) || order.items.length === 0) errors.push("cart is empty");
  if (!shippingRates.has(order.method)) errors.push("unknown shipping method");
  return errors;
}

function checkout(order) {
  const errors = validate(order);
  if (errors.length > 0) {
    return "Rejected: " + errors.join(", ");
  }
  // এখান থেকে নিশ্চিত: order বৈধ — এবার আসল কাজ
  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = shippingRates.get(order.method);
  return "Total: " + (subtotal + shipping);
}

console.log(checkout(null));
console.log(checkout({ items: [], method: "standard" }));
console.log(checkout({ items: [{ price: 100, qty: 2 }], method: "drone" }));
console.log(checkout({ items: [{ price: 100, qty: 2 }], method: "express" }));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const temperature = 31;
if (temperature > 30) {
  console.log("গরম");
} else {
  console.log("স্বাভাবিক");
}
`,
    },
    {
      label: "Truthiness: কোনটি if এ ঢোকে?",
      code: `const values = [0, "", "0", [], {}, null, undefined, NaN, -1, "false"];
for (const v of values) {
  console.log(JSON.stringify(v), "->", v ? "truthy" : "falsy");
}

// ফাঁদ: 0 একটি বৈধ মান
const count = 0;
console.log("if (count):", count ? "আছে" : "নেই");
console.log("count !== undefined:", count !== undefined ? "আছে" : "নেই");
console.log("count ?? 10:", count ?? 10);
console.log("count || 10:", count || 10);`,
    },
    {
      label: "switch: strict vs ==",
      code: `function strict(x) {
  switch (x) {
    case 1: return "matched 1";
    default: return "default";
  }
}
console.log(strict(1));
console.log(strict("1"));

// তুলনা: == coercion করে, switch করে না
console.log(1 == "1", 1 === "1");

// fallthrough দেখুন
function steps(n) {
  const out = [];
  switch (n) {
    case 1: out.push("one");
    case 2: out.push("two");
    case 3: out.push("three"); break;
    default: out.push("other");
  }
  return out;
}
console.log(steps(1));
console.log(steps(3));
console.log(steps(9));`,
    },
    {
      label: "Lookup object বনাম Map: inherited key",
      code: `const labels = { admin: "Administrator", user: "Member" };
const key = "constructor";

console.log("naive:", typeof labels[key]);          // inherited function!
console.log("hasOwn:", Object.hasOwn(labels, key)); // false
console.log("safe:", Object.hasOwn(labels, key) ? labels[key] : "Unknown");

const safeMap = new Map(Object.entries(labels));
console.log("Map:", safeMap.get(key) ?? "Unknown");
console.log("in operator:", "constructor" in labels, Object.hasOwn(labels, "admin"));`,
    },
    {
      label: "Guard clause বনাম deep nesting",
      code: `function nested(user) {
  if (user) {
    if (user.active) {
      if (user.email) {
        return "send to " + user.email;
      } else {
        return "no email";
      }
    } else {
      return "inactive";
    }
  } else {
    return "no user";
  }
}

function guarded(user) {
  if (!user) return "no user";
  if (!user.active) return "inactive";
  if (!user.email) return "no email";
  return "send to " + user.email;
}

const cases = [null, { active: false }, { active: true }, { active: true, email: "a@b.com" }];
for (const c of cases) {
  console.log(nested(c) === guarded(c), guarded(c));
}`,
    },
  ],

  debugging: [
    {
      title: "switch এ break ভুলে যাওয়া (অনিচ্ছাকৃত fallthrough)",
      bad: `function colorName(code) {
  let name = "";
  switch (code) {
    case "r":
      name = "red";
    case "g":
      name = "green";
    case "b":
      name = "blue";
  }
  return name;
}
console.log(colorName("r"));
console.log(colorName("g"));`,
      why: "মিল পাওয়ার পর `break` না থাকায় engine নিচের সব case এর কোড চালিয়ে যায় এবং শেষে `name` সবসময় `\"blue\"` হয়ে যায়। কোনো error আসে না — তাই bug টি চুপচাপ ভুল ফল দেয়।",
      fix: `function colorName(code) {
  switch (code) {
    case "r":
      return "red";
    case "g":
      return "green";
    case "b":
      return "blue";
    default:
      return "unknown";
  }
}
console.log(colorName("r"));
console.log(colorName("g"));`,
    },
    {
      title: "Truthiness ফাঁদ: 0 কে ‘নেই’ ভাবা",
      bad: `function showStock(qty) {
  if (qty) {
    return "In stock: " + qty;
  }
  return "Unknown stock";
}
console.log(showStock(5));
console.log(showStock(0));`,
      why: "`0` falsy, তাই `if (qty)` এ ঢোকে না। অথচ ‘০টি আছে’ একটি বৈধ তথ্য, ‘তথ্য নেই’ নয়। যেখানে `0`, `\"\"` অর্থপূর্ণ মান, সেখানে truthiness নয়, স্পষ্ট তুলনা করুন।",
      fix: `function showStock(qty) {
  if (qty === undefined || qty === null) {
    return "Unknown stock";
  }
  return "In stock: " + qty;
}
console.log(showStock(5));
console.log(showStock(0));
console.log(showStock(undefined));`,
    },
    {
      title: "শর্তে `=` (assignment) লিখে ফেলা",
      bad: `let role = "guest";
if (role = "admin") {
  console.log("Access granted");
} else {
  console.log("Access denied");
}
console.log("role is now:", role);`,
      why: "`role = \"admin\"` একটি **assignment expression**; এটি `role` এ মান বসায় এবং বসানো মানটি (`\"admin\"`, truthy) ফেরত দেয়। ফলে condition সবসময় সত্য এবং `role` নিজেই বদলে যায়। তুলনা করতে `===` লিখতে হয়। ESLint এর `no-cond-assign` rule এটি ধরে।",
      fix: `let role = "guest";
if (role === "admin") {
  console.log("Access granted");
} else {
  console.log("Access denied");
}
console.log("role is still:", role);`,
    },
    {
      title: "case এ let/const দিয়ে SyntaxError",
      bad: `function f(x) {
  switch (x) {
    case 1:
      const msg = "one";
      return msg;
    case 2:
      const msg = "two";
      return msg;
  }
}
console.log(f(1));`,
      why: "পুরো `switch` এর `{ }` একটিই block scope, তাই দুটি `const msg` একই scope এ redeclaration — parse এর সময়ই SyntaxError, কোনো লাইনই চলে না। প্রতিটি case কে নিজস্ব `{ }` এ রাখলে scope আলাদা হয়।",
      fix: `function f(x) {
  switch (x) {
    case 1: {
      const msg = "one";
      return msg;
    }
    case 2: {
      const msg = "two";
      return msg;
    }
    default:
      return "other";
  }
}
console.log(f(1), f(2), f(3));`,
    },
    {
      title: "Lookup object এ inherited key এর ফাঁদ",
      bad: `const labels = { admin: "Administrator", user: "Member" };
const key = "constructor"; // ধরুন এটি user input
const label = labels[key] ?? "Unknown";
console.log("type:", typeof label);`,
      why: "plain object এর prototype chain এ `constructor`, `toString` ইত্যাদি key আছে। তাই `labels[\"constructor\"]` `undefined` নয়, একটি function ফেরত দেয় এবং `??` default টি বসায় না। User-input key এর ক্ষেত্রে `Object.hasOwn` অথবা `Map` ব্যবহার করুন।",
      fix: `const labels = { admin: "Administrator", user: "Member" };
const key = "constructor";
const label = Object.hasOwn(labels, key) ? labels[key] : "Unknown";
console.log("type:", typeof label);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "সংখ্যার চিহ্ন নির্ণয়",
      prompt: "`sign(n)` function লিখুন: `n` ধনাত্মক হলে `\"positive\"`, ঋণাত্মক হলে `\"negative\"`, শূন্য হলে `\"zero\"` ফেরত দেবে।",
      starter: `function sign(n) {
  // TODO: if / else if / else ব্যবহার করুন
}

console.log(sign(5));
console.log(sign(-3));
console.log(sign(0));`,
      expected: "positive\nnegative\nzero",
      hints: ["`n > 0` ও `n < 0` দুটি আলাদা condition; বাকিটা `else`।", "প্রতিটি শাখা থেকে `return` করুন।"],
      solution: `function sign(n) {
  if (n > 0) {
    return "positive";
  } else if (n < 0) {
    return "negative";
  } else {
    return "zero";
  }
}

console.log(sign(5));
console.log(sign(-3));
console.log(sign(0));`,
    },
    {
      level: "beginner",
      title: "Ternary দিয়ে label বাছাই",
      prompt: "`age` ১৮ বা তার বেশি হলে `label` এ `\"Adult\"`, নইলে `\"Minor\"` রাখুন — ternary ব্যবহার করে — এবং print করুন।",
      starter: `const age = 20;
const label = ""; // TODO: ternary দিয়ে বদলান
console.log(label);`,
      expected: "Adult",
      hints: ["গঠন: `condition ? a : b`।", "Condition হবে `age >= 18`।"],
      solution: `const age = 20;
const label = age >= 18 ? "Adult" : "Minor";
console.log(label);`,
    },
    {
      level: "beginner",
      title: "switch দিয়ে Weekday / Weekend",
      prompt: "`dayType(day)` এ `1`–`5` হলে `\"Weekday\"`, `6` ও `7` হলে `\"Weekend\"`, অন্য কিছু হলে `\"Invalid\"` ফেরত দিন। `switch` ব্যবহার করুন এবং একাধিক case একসাথে গ্রুপ করুন।",
      starter: `function dayType(day) {
  switch (day) {
    // TODO: case গুলো লিখুন
  }
}

console.log(dayType(3));
console.log(dayType(6));
console.log(dayType(7));
console.log(dayType(9));`,
      expected: "Weekday\nWeekend\nWeekend\nInvalid",
      hints: ["`case 1: case 2: ... return \"Weekday\";` — একাধিক case একই কোডে পৌঁছায়।", "`default` ভুলবেন না।"],
      solution: `function dayType(day) {
  switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return "Weekday";
    case 6:
    case 7:
      return "Weekend";
    default:
      return "Invalid";
  }
}

console.log(dayType(3));
console.log(dayType(6));
console.log(dayType(7));
console.log(dayType(9));`,
    },
    {
      level: "intermediate",
      title: "Guard clause দিয়ে shipping fee",
      prompt: "`shippingFee(order)` লিখুন, **কোনো nested `if` ছাড়া** (শুধু guard clause): order না থাকলে `\"No order\"`; `items` খালি হলে `\"Empty cart\"`; `country` `\"BD\"` না হলে `500`; নইলে `total > 1000` হলে `0`, না হলে `60`।",
      starter: `function shippingFee(order) {
  // TODO: guard clause + early return
}

console.log(shippingFee(null));
console.log(shippingFee({ items: [], country: "BD", total: 0 }));
console.log(shippingFee({ items: [1], country: "US", total: 50 }));
console.log(shippingFee({ items: [1], country: "BD", total: 2000 }));
console.log(shippingFee({ items: [1], country: "BD", total: 300 }));`,
      expected: "No order\nEmpty cart\n500\n0\n60",
      hints: ["প্রথমে `if (!order) return ...;`।", "শেষ লাইনে ternary: `order.total > 1000 ? 0 : 60`।"],
      solution: `function shippingFee(order) {
  if (!order) return "No order";
  if (order.items.length === 0) return "Empty cart";
  if (order.country !== "BD") return 500;
  return order.total > 1000 ? 0 : 60;
}

console.log(shippingFee(null));
console.log(shippingFee({ items: [], country: "BD", total: 0 }));
console.log(shippingFee({ items: [1], country: "US", total: 50 }));
console.log(shippingFee({ items: [1], country: "BD", total: 2000 }));
console.log(shippingFee({ items: [1], country: "BD", total: 300 }));`,
      explanation: "প্রতিটি অবৈধ ক্ষেত্র শুরুতেই `return` করে বেরিয়ে যায়, তাই শেষ লাইনটি nesting ছাড়াই সোজা ‘সুখের পথ’।",
    },
    {
      level: "intermediate",
      title: "Map lookup দিয়ে HTTP status বার্তা",
      prompt: "`describe(code)` এ `switch` ব্যবহার না করে `Map` ব্যবহার করুন: `200 → \"OK\"`, `404 → \"Not Found\"`, `500 → \"Server Error\"`। অন্য code এ `\"Unknown\"`।",
      starter: `const messages = new Map([
  [200, "OK"],
  [404, "Not Found"],
  [500, "Server Error"],
]);

function describe(code) {
  // TODO: messages থেকে খুঁজুন, না পেলে "Unknown"
}

console.log(describe(200));
console.log(describe(404));
console.log(describe(418));`,
      expected: "OK\nNot Found\nUnknown",
      hints: ["`map.get(key)` না পেলে `undefined` দেয়।", "`??` দিয়ে default বসান।"],
      solution: `const messages = new Map([
  [200, "OK"],
  [404, "Not Found"],
  [500, "Server Error"],
]);

function describe(code) {
  return messages.get(code) ?? "Unknown";
}

console.log(describe(200));
console.log(describe(404));
console.log(describe(418));`,
      explanation: "`Map` এ সংখ্যা key সংখ্যা হিসেবেই থাকে (object এর মতো string এ রূপান্তরিত হয় না), আর inherited key এর ঝুঁকিও নেই।",
    },
    {
      level: "challenge",
      title: "Validate-then-act: user রেজিস্ট্রেশন যাচাই",
      prompt:
        "`validate(user)` এমন একটি array ফেরত দেবে যাতে সব ভুলের বার্তা থাকে (একটি ভুলেই থেমে যাবেন না)। নিয়ম: `name` trim করার পর খালি হতে পারবে না → `\"name required\"`; `email` এ `@` থাকতে হবে → `\"email invalid\"`; `age` অবশ্যই integer এবং ১৮–১২০ এর মধ্যে → `\"age must be 18-120\"`। Main code ভুল না থাকলে `ok`, নইলে ভুলগুলো `, ` দিয়ে জুড়ে print করে।",
      starter: `function validate(user) {
  const errors = [];
  // TODO: নিয়মগুলো পরীক্ষা করে errors এ push করুন
  return errors;
}

const users = [
  { name: " Rina ", email: "rina@mail.com", age: 25 },
  { name: "", email: "bad", age: 15 },
  { name: "Karim", email: "k@x.com", age: "30" },
];

for (const u of users) {
  const errors = validate(u);
  if (errors.length === 0) {
    console.log("ok");
  } else {
    console.log(errors.join(", "));
  }
}`,
      expected: "ok\nname required, email invalid, age must be 18-120\nage must be 18-120",
      hints: [
        "`typeof user.name !== \"string\" || user.name.trim() === \"\"` দিয়ে name পরীক্ষা করুন।",
        "`Number.isInteger(\"30\")` হলো `false` — string সংখ্যা integer নয়।",
        "প্রতিটি নিয়ম আলাদা `if`, `else if` নয় — তবেই সব ভুল জমা হবে।",
      ],
      solution: `function validate(user) {
  const errors = [];
  if (typeof user.name !== "string" || user.name.trim() === "") {
    errors.push("name required");
  }
  if (typeof user.email !== "string" || !user.email.includes("@")) {
    errors.push("email invalid");
  }
  if (!Number.isInteger(user.age) || user.age < 18 || user.age > 120) {
    errors.push("age must be 18-120");
  }
  return errors;
}

const users = [
  { name: " Rina ", email: "rina@mail.com", age: 25 },
  { name: "", email: "bad", age: 15 },
  { name: "Karim", email: "k@x.com", age: "30" },
];

for (const u of users) {
  const errors = validate(u);
  if (errors.length === 0) {
    console.log("ok");
  } else {
    console.log(errors.join(", "));
  }
}`,
      explanation: "এখানে নিয়মগুলো `else if` চেইন নয়, স্বাধীন `if`, কারণ লক্ষ্য হলো সব ভুল একসাথে জানানো। Main অংশে ভুল থাকলে আসল কাজ করা হচ্ছে না — এটাই validate-then-act। `Number.isInteger` string `\"30\"` কে অগ্রাহ্য করে, কোনো coercion ছাড়াই।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`switch (1) { case \"1\": console.log(\"A\"); break; default: console.log(\"B\"); }` কী print করবে?",
        options: ["A", "কিছুই না", "B", "SyntaxError"],
        answer: 2,
        explanation: "`switch` strict equality (`===`) ব্যবহার করে। `1 === \"1\"` মিথ্যা, তাই `case \"1\"` মেলে না এবং `default` চলে — `B`। `A` হতো যদি `==` এর মতো coercion হতো (হয় না)। `default` থাকায় ‘কিছুই না’ নয়, আর কোড syntactically বৈধ।",
      },
      {
        question: "নিচের কোনটি **falsy**?",
        options: ["`[]`", "`{}`", "`\"0\"`", "`NaN`"],
        answer: 3,
        explanation: "`NaN` falsy (পাশাপাশি `0`, `\"\"`, `null`, `undefined`, `false`, `0n`)। `[]` ও `{}` যেকোনো object এর মতো truthy, আর `\"0\"` একটি non-empty string, তাই truthy।",
      },
      {
        question: "`switch (2) { case 1: log(\"a\"); case 2: log(\"b\"); case 3: log(\"c\"); break; default: log(\"d\"); }` এ কোন ক্রমে log হবে?",
        options: ["শুধু b", "b, c", "b, c, d", "a, b, c"],
        answer: 1,
        explanation: "`2` মেলে `case 2` এ, তাই `b` log হয়। `break` না থাকায় fallthrough হয়ে `case 3` এর `c` ও চলে, তারপর `break`। `default` এ পৌঁছানো হয় না (`d` নয়), আর `case 1` এ মিল না হওয়ায় `a` নয়।",
      },
      {
        question: "Deep nesting কমানোর জন্য সবচেয়ে উপযুক্ত কৌশল কোনটি?",
        options: ["Guard clause ও early return", "সবকিছু একটি লম্বা ternary তে লেখা", "প্রতিটি `if` এ `{ }` বাদ দেওয়া", "সব শর্ত `switch(true)` এ ঢোকানো"],
        answer: 0,
        explanation: "অবৈধ ক্ষেত্র শুরুতেই `return`/`throw` করলে বাকি কোড nesting ছাড়াই সোজা লেখা যায়। লম্বা ternary পড়া কঠিন করে, `{ }` বাদ দিলে bug বাড়ে এবং nesting কমে না, আর `switch(true)` সাধারণত `if/else if` এর চেয়ে বেশি পরিষ্কার নয়।",
      },
      {
        question: "`const x = 3; const r = x > 5 ? \"big\" : x > 2 ? \"mid\" : \"small\";` এ `r` এর মান কী?",
        options: ["\"big\"", "\"small\"", "\"mid\"", "undefined"],
        answer: 2,
        explanation: "প্রথম condition `3 > 5` মিথ্যা, তাই ডানের nested ternary দেখা হয়: `3 > 2` সত্য, ফল `\"mid\"`। `\"big\"` হতো x ৫ এর বেশি হলে, `\"small\"` হতো x ২ বা কম হলে। Ternary সবসময় একটি মান দেয়, তাই `undefined` নয়।",
      },
    ],
    coding: [
      {
        title: "Leap year নির্ণয়",
        prompt: "`isLeap(year)` লিখুন: ৪ দিয়ে বিভাজ্য কিন্তু ১০০ দিয়ে নয়, অথবা ৪০০ দিয়ে বিভাজ্য হলে `true`। ১৯০০, ২০০০, ২০২৪, ২০২৩ এর জন্য ফল print করুন।",
        starter: `function isLeap(year) {
  // TODO
}

console.log(isLeap(1900));
console.log(isLeap(2000));
console.log(isLeap(2024));
console.log(isLeap(2023));`,
        expected: "false\ntrue\ntrue\nfalse",
        solution: `function isLeap(year) {
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

console.log(isLeap(1900));
console.log(isLeap(2000));
console.log(isLeap(2024));
console.log(isLeap(2023));`,
      },
      {
        title: "বয়স অনুযায়ী টিকিট",
        prompt: "`ticket(age)`: `age` ১২ এর কম হলে `\"Child\"`, ১২–৫৯ হলে `\"Adult\"`, ৬০ বা বেশি হলে `\"Senior\"`, আর `age` সংখ্যা না হলে (`Number.isFinite` দিয়ে যাচাই) বা ঋণাত্মক হলে `\"Invalid\"`। ৫, ৩০, ৬৫, -1, `\"x\"` এর জন্য print করুন।",
        starter: `function ticket(age) {
  // TODO: প্রথমে guard clause
}

for (const a of [5, 30, 65, -1, "x"]) {
  console.log(ticket(a));
}`,
        expected: "Child\nAdult\nSenior\nInvalid\nInvalid",
        solution: `function ticket(age) {
  if (!Number.isFinite(age) || age < 0) return "Invalid";
  if (age < 12) return "Child";
  if (age < 60) return "Adult";
  return "Senior";
}

for (const a of [5, 30, 65, -1, "x"]) {
  console.log(ticket(a));
}`,
      },
    ],
  },

  interview: [
    {
      q: "`switch` এ কোন ধরনের তুলনা হয়? `==` নাকি `===`?",
      a: "`switch` **strict equality (`===`)** ব্যবহার করে — অর্থাৎ type coercion হয় না। `switch (1)` এ `case \"1\"` মিলবে না, আর `NaN` কোনো case এর সাথেই মিলবে না কারণ `NaN === NaN` মিথ্যা।\n\nএর ফল: input যদি string আকারে আসে (যেমন form value বা query string), তবে case এ সংখ্যা লিখলে মিলবে না — আগে সংখ্যায় রূপান্তর করুন (`Number(value)`), বা case গুলোকেও string রাখুন। এটি switch কে `if (x == 1 || ...)` এর চেয়ে বেশি পূর্বানুমেয় করে।",
    },
    {
      q: "Fallthrough কী? কখন ভালো আর কখন বিপজ্জনক?",
      a: "কোনো `case` এ মিল পাওয়ার পর `break`, `return` বা `throw` না থাকলে engine নিচের পরের `case` এর কোডও (মান যাচাই ছাড়াই) চালাতে থাকে — একেই fallthrough বলে। **ভালো** ব্যবহার: একাধিক মানের জন্য একই কাজ — `case 6: case 7: return \"Weekend\";` (মাঝখানে কোনো কোড নেই)। **বিপজ্জনক**: কোড থাকা case এর শেষে ভুলে `break` বাদ পড়া — চুপচাপ ভুল ফল দেয়, error আসে না।\n\nতাই ইচ্ছাকৃত fallthrough এ comment দিন, linter এর `no-fallthrough` rule চালু রাখুন, আর function এর ভেতরে হলে `break` এর বদলে সরাসরি `return` ব্যবহার করুন।",
    },
    {
      q: "Guard clause কী এবং কেন nested `if` এর চেয়ে ভালো?",
      a: "Guard clause হলো function এর শুরুতে অবৈধ বা বিশেষ ক্ষেত্র পরীক্ষা করে সাথে সাথে `return`/`throw` করা। এতে আসল (happy path) কোড nesting ছাড়াই সরাসরি নিচে থাকে। সুবিধা: **(১)** indentation কম, পাঠকের মনে ‘কোন শর্তের ভেতরে আছি’ রাখার বোঝা কম; **(২)** edge case গুলো এক জায়গায় দৃশ্যমান; **(৩)** নতুন শর্ত যোগ করা সহজ, পুরো block পুনর্গঠন লাগে না।\n\nসতর্কতা: একটি function এ অনেক early return থাকলে cleanup (যেমন resource মুক্ত করা) ভুলে যাওয়া সহজ — তখন `try...finally` বা cleanup আলাদা করা ভালো। আর guard clause মানে ‘সব জায়গায় অন্তত একটি return’ নয়; যেখানে শর্তগুলো সত্যিই সমান-গুরুত্বের বিকল্প, সেখানে `if/else` ই পরিষ্কার।",
    },
    {
      q: "Ternary কখন ব্যবহার করবেন আর কখন করবেন না?",
      a: "Ternary একটি **expression**, তাই যেখানে লক্ষ্য একটি মান বেছে নেওয়া (`const label = ok ? \"Yes\" : \"No\"`, JSX/template এর ভেতরে, argument হিসেবে) সেখানে এটি উপযুক্ত। `if` একটি **statement**, যেখানে একাধিক কাজ বা side effect করতে হয় সেখানে সেটিই ভালো।\n\nসীমারেখা: nested ternary দুই স্তরের বেশি হলে পাঠযোগ্যতা দ্রুত কমে — তখন `if/else if` বা lookup ব্যবহার করুন। আর ternary কে শুধু side effect চালানোর জন্য (`ok ? save() : cancel();`) ব্যবহার করা অভ্যাস নয়; সেখানে `if` ই উদ্দেশ্য স্পষ্ট রাখে।",
    },
    {
      q: "`switch` এর পরিবর্তে lookup object বা `Map` কখন ব্যবহার করা উচিত, এবং এতে কী ঝুঁকি আছে?",
      a: "যখন প্রতিটি case আসলে ‘key → value’ (বা key → function) মেলানো, তখন lookup table পরিষ্কার: ডেটা ও লজিক আলাদা, নতুন entry এক লাইনে, এবং কোড কম। সংখ্যা বা object key চাইলে `Map` সরাসরি কাজ করে।\n\nঝুঁকি: plain object এর prototype chain থেকে inherited key (`constructor`, `toString`, `__proto__`) আসতে পারে। ফলে user-input key দিয়ে `table[key]` ডাকলে অপ্রত্যাশিত মান বা function পেয়ে যেতে পারেন। সমাধান: `Object.hasOwn(table, key)` দিয়ে যাচাই করুন, `Map` ব্যবহার করুন, বা `Object.create(null)` দিয়ে prototype-বিহীন object বানান। আর যেখানে range বা জটিল শর্ত (`score >= 90`) আছে, সেখানে lookup নয়, `if/else if` ই সঠিক।",
    },
    {
      q: "`if (value)` এ কোন কোন মানে অপ্রত্যাশিত আচরণ হতে পারে, এবং কীভাবে এড়াবেন?",
      a: "`if (value)` মানকে boolean এ রূপান্তর করে। Falsy মান: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, `NaN`। সমস্যা হয় যখন এদের মধ্যে `0` বা `\"\"` একটি **বৈধ ডেটা**: যেমন stock `0`, বা user ইচ্ছাকৃতভাবে খালি string দিয়েছে। উল্টোদিকে `\"0\"`, `[]`, `{}` truthy — অনেকে এগুলোকে falsy ভাবে।\n\nপ্রতিকার: উদ্দেশ্য অনুযায়ী স্পষ্ট পরীক্ষা লিখুন — অনুপস্থিতির জন্য `value == null` বা `value === undefined`, সংখ্যার জন্য `Number.isFinite(value)`, array এর জন্য `arr.length === 0`, default এর জন্য `||` এর বদলে `??` (যা শুধু `null`/`undefined` এ কাজ করে)।",
    },
    {
      q: "`in` operator ও `Object.hasOwn` এর পার্থক্য কী?",
      a: "`\"key\" in obj` পরীক্ষা করে property টি object এ **অথবা তার prototype chain এ** আছে কি না, তাই `\"toString\" in {}` হয় `true`। `Object.hasOwn(obj, \"key\")` (ES2022) শুধু object এর **নিজের** property পরীক্ষা করে — পুরোনো `obj.hasOwnProperty(key)` এর আধুনিক ও নিরাপদ বিকল্প, কারণ এটি `hasOwnProperty` override করা বা `Object.create(null)` object এও কাজ করে।\n\nArray তে `in` **index** পরীক্ষা করে, মান নয়: `2 in [10, 20, 30]` হয় `true` (index ২ আছে), কিন্তু `10 in [10, 20, 30]` হয় `false`। মান খুঁজতে `arr.includes(value)` ব্যবহার করুন।",
    },
  ],

  summary: {
    takeaways: [
      "Condition যেকোনো মান হতে পারে — engine তাকে boolean এ (truthy/falsy) রূপান্তর করে; তাই `0` ও `\"\"` এর ফাঁদ মনে রাখুন।",
      "`if/else if/else` ওপর থেকে নিচে পরীক্ষা করে, প্রথম মিলেই থামে — specific condition আগে রাখুন।",
      "`switch` strict (`===`) তুলনা করে; `break` ছাড়া fallthrough হয়; `case` এ `let/const` লিখলে `{ }` দিন।",
      "Ternary একটি expression — মান বাছাইয়ের জন্য ভালো, দুই স্তরের বেশি nest করবেন না।",
      "Guard clause ও early return দিয়ে deep nesting এড়িয়ে happy path সোজা রাখুন।",
      "Key→value মেলানোর জন্য `Map` বা lookup object; user-input key এ `Object.hasOwn` বা `Map` ব্যবহার করুন।",
      "Validate-then-act: আগে সব যাচাই, তারপর কাজ। Client-side check নিরাপত্তা নয় — server এ আবার যাচাই করুন।",
    ],
    syntax: `if (a) { /* ... */ } else if (b) { /* ... */ } else { /* ... */ }

switch (value) {            // strict (===) তুলনা
  case 1:
  case 2: { return "x"; }   // grouped case, নিজস্ব block
  default: return "y";
}

const label = ok ? "yes" : "no";      // ternary
if (!input) return;                   // guard clause
const msg = table.get(key) ?? "n/a";  // Map lookup + default
Object.hasOwn(obj, key);              // নিজের key কি না`,
    whenToUse: [
      "দুই-তিনটি শাখা বা range/জটিল শর্ত → `if / else if / else`।",
      "একটি মানকে অনেক নির্দিষ্ট মানের সাথে মেলানো এবং প্রতিটি শাখায় কাজ আছে → `switch` (প্রতিটি case এ `break`/`return`)।",
      "শুধু একটি মান বেছে নেওয়া → ternary; default মানের জন্য `??`।",
      "শুরুতে অবৈধ ক্ষেত্র বাদ দিতে → guard clause।",
      "Key→value বা key→handler মেলানো → `Map` বা lookup object।",
    ],
    next: [
      "Loops — `for`, `while`, `for...of`",
      "Error Handling — `throw`, `try/catch` দিয়ে ব্যতিক্রমী অবস্থা সামলানো",
      "Truthy / Falsy ও Operators lesson (`&&`, `||`, `??`, `?.`)",
      "Functions — early return ও pure function এর ধারণা",
    ],
  },

  compatibility:
    "`if`, `switch`, ternary, `??` (ES2020) ও `Object.hasOwn` (ES2022) সব আধুনিক browser ও Node.js (16.9+ এ `Object.hasOwn`) এ একই আচরণ করে। এই lesson এর সব runnable কোড pure JavaScript, তাই Web Worker sandbox এ চলে। Browser-specific (যেমন `window`, `document`) বা Node-specific (যেমন `process.env`) পরীক্ষা শর্তে ব্যবহার করা যায়, কিন্তু conditional এর নিয়ম দুই জায়গাতেই এক।",
};
