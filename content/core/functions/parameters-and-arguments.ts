import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "**Parameter** (declaration এর নাম) ও **argument** (call এর মান) এর পার্থক্য এবং তাদের মধ্যে binding কীভাবে হয় তা explain করতে পারবেন।",
    "কম বা বেশি argument দিলে JavaScript কী করে (missing → `undefined`, extra → উপেক্ষিত কিন্তু পাওয়া যায়) এবং `fn.length` কী গোনে — তা বুঝবেন।",
    "Pass-by-value এর সঠিক অর্থ: object argument এর **mutation** ও **reassignment** এর পার্থক্য ধরতে পারবেন।",
    "Rest parameter (`...args`), legacy `arguments` object, spread এবং destructured parameter যথাযথ জায়গায় ব্যবহার করতে পারবেন।",
    "Positional parameter বনাম options-object pattern বেছে নিতে এবং ন্যূনতম argument validation লিখতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Parameter আর Argument — দুটি আলাদা জিনিস" },
    {
      type: "p",
      text: "প্রায় সবাই শব্দ দুটি গুলিয়ে ফেলে, কিন্তু পার্থক্যটি সহজ। **Parameter** হলো function **declare** করার সময় বন্ধনীর ভেতরের নাম — একটি placeholder, যা function এর ভেতরের local variable হয়ে যায়। **Argument** হলো function **call** করার সময় বন্ধনীর ভেতরে আপনি যে আসল মান পাঠান। `function add(a, b) {}` এ `a`, `b` হলো parameter; `add(2, 3)` এ `2`, `3` হলো argument।",
    },
    {
      type: "code",
      code: "function greet(name, greeting) {   // name, greeting = parameters\n  return greeting + ', ' + name;\n}\n\ngreet('Rina', 'Hello');            // 'Rina', 'Hello' = arguments",
      caption: "Declaration এ parameter, call এ argument। (এই snippet টি concept ব্যাখ্যার জন্য; নিচের Examples ও Playground এ চালিয়ে দেখতে পারবেন।)",
    },
    {
      type: "p",
      text: "Call এর সময় engine ডান দিকের argument গুলোর মান **বাম থেকে ডানে, অবস্থান (position) অনুযায়ী** parameter গুলোর সাথে bind করে — প্রথম argument প্রথম parameter এ, দ্বিতীয়টি দ্বিতীয়টিতে। নাম মিলিয়ে নয়, **ক্রম** মিলিয়ে। এই কারণেই `greet('Hello', 'Rina')` লিখলে কোনো error আসে না, শুধু অর্থ উল্টে যায়।",
    },
    { type: "h3", text: "Arity: সংখ্যা মিলতে হবে না" },
    {
      type: "p",
      text: "অনেক ভাষায় parameter এর সংখ্যার সাথে argument এর সংখ্যা না মিললে compile/runtime error হয়। JavaScript এ হয় না। Function এর parameter সংখ্যাকে বলে **arity**, আর JavaScript এ arity শুধু একটি ‘ইঙ্গিত’, কোনো বাধ্যবাধকতা নয়:",
    },
    {
      type: "ul",
      items: [
        "**কম argument** দিলে অবশিষ্ট parameter গুলো **`undefined`** পায়। কোনো error নেই। `add(5)` এ `b` হয় `undefined`, তাই `5 + undefined` = `NaN` (Type Coercion lesson এ দেখেছি কেন)।",
        "**বেশি argument** দিলে বাড়তি মানগুলো কোনো নামে bind হয় না, তাই সাধারণভাবে নীরবে উপেক্ষিত হয় — কিন্তু হারিয়ে যায় না; rest parameter বা `arguments` দিয়ে পাওয়া যায়।",
        "এই নমনীয়তাই callback এর ভিত্তি: `arr.map(fn)` প্রতিবার `fn` কে `(element, index, array)` তিনটি argument দেয়; আপনার `fn` শুধু `(element)` নিলেও সমস্যা নেই। আবার এই নমনীয়তাই `['1','2','3'].map(parseInt)` এর বিখ্যাত bug এর কারণ (নিচে Debugging এ দেখব)।",
      ],
    },
    { type: "h3", text: "Pass-by-value: argument এ আসলে কী কপি হয়?" },
    {
      type: "p",
      text: "JavaScript এ argument সবসময় **value হিসেবে** পাঠানো হয় — অর্থাৎ call এর মুহূর্তে argument expression এর মান evaluate হয় এবং সেই মানের একটি **কপি** parameter এ বসে। Primitive এর ক্ষেত্রে কপি হয় আসল মান (`number`, `string`…), তাই function এর ভেতরে parameter বদলালে বাইরের variable অক্ষত থাকে। Object এর ক্ষেত্রে ‘মান’ হলো **reference (ঠিকানা)** — সেই ঠিকানারই কপি হয়, object টি কপি হয় না। (Primitive vs Reference Types lesson এ এই ধারণা বিস্তারিত দেখেছি।)",
    },
    {
      type: "p",
      text: "ফলে দুটি আলাদা কাজ আলাদা ফল দেয়। **Mutation** (`user.name = 'Mim'`) — parameter ও বাইরের variable একই object এর দিকে তাকিয়ে আছে, তাই পরিবর্তন বাইরে থেকেও দেখা যায়। **Reassignment** (`user = { ... }`) — শুধু function এর **local parameter** কে নতুন object এ বাঁধা হলো; বাইরের variable এর ঠিকানা বদলায় না। কেউ কেউ এই আচরণকে ‘call by sharing’ নামেও ডাকে; মূল কথা হলো — JavaScript এ ‘pass by reference’ নেই, অর্থাৎ function এর ভেতর থেকে caller এর variable কে নতুন মানে বাঁধা যায় না।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Argument mutation — React এও সবচেয়ে সাধারণ bug এর উৎস",
      text: "যে function এর parameter এ object/array আসে, সেটি যদি সেই object কে সরাসরি বদলে ফেলে (`items.push(...)`, `user.name = ...`), তাহলে caller এর data নীরবে বদলে যায়। React এ state/props mutate করলে re-render না হওয়া বা অদ্ভুত stale UI এর পেছনে প্রায়ই এটিই কারণ। সাধারণ নিয়ম: input argument বদলাবেন না; spread বা `map`/`filter` দিয়ে নতুন কপি ফেরত দিন।",
    },
    { type: "h3", text: "Rest parameter বনাম পুরোনো arguments object" },
    {
      type: "p",
      text: "অনির্দিষ্ট সংখ্যক argument নিতে হলে আধুনিক উপায় **rest parameter**: `function sum(...nums) {}`। `nums` একটি **আসল Array** — তাই `map`, `reduce`, `filter` সরাসরি চলে। Rest parameter অবশ্যই **শেষ** parameter হতে হবে এবং একটি function এ একটির বেশি থাকতে পারে না।",
    },
    {
      type: "p",
      text: "ES2015 এর আগে এর বদলে ছিল **`arguments`** — নিয়মিত (non-arrow) function এর ভেতরে স্বয়ংক্রিয়ভাবে পাওয়া একটি **array-like** object: `length` আছে ও `arguments[0]` দিয়ে index করা যায়, কিন্তু এটি Array নয় — `map`/`filter` নেই (`Array.from(arguments)` দিয়ে রূপান্তর করতে হতো)। পুরোনো কোড পড়ার জন্য এটি জানা দরকার; নতুন কোডে rest parameter ব্যবহার করুন।",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "Rest `...args`", "`arguments`"],
      rows: [
        ["ধরন", "আসল `Array`", "Array-like object (Array নয়)"],
        ["Array method (`map`, `reduce`)", "সরাসরি চলে", "চলে না (আগে রূপান্তর দরকার)"],
        ["Arrow function এ", "কাজ করে", "**নেই** — arrow এর নিজস্ব `arguments` নেই, বাইরের function এর টি দেখে (lexical)"],
        ["কতগুলো argument ধরে", "নামকরা parameter এর **পরের** বাকি সবগুলো", "call এ পাঠানো **সবগুলো**"],
        ["পড়ার সুবিধা", "Signature দেখেই বোঝা যায়", "Signature থেকে লুকানো"],
        ["আধুনিক কোডে", "প্রস্তাবিত", "শুধু legacy কোডে"],
      ],
    },
    { type: "h3", text: "Spread: call site এ array ‘খুলে’ দেওয়া" },
    {
      type: "p",
      text: "Rest এর বিপরীত দিক হলো **spread**। Rest বাকি argument গুলোকে একটি array তে **জড়ো** করে (declaration এ), spread একটি iterable কে আলাদা আলাদা argument এ **ছড়িয়ে** দেয় (call এ): `Math.max(...scores)`। একই `...` চিহ্ন, কিন্তু কোথায় বসেছে তা দিয়েই অর্থ নির্ধারিত হয় — parameter তালিকায় হলে rest, argument তালিকায় হলে spread। পুরোনো `fn.apply(null, arr)` এর আধুনিক বিকল্প এটি।",
    },
    { type: "h3", text: "Destructured parameter ও options-object pattern" },
    {
      type: "p",
      text: "Parameter কে সরাসরি destructure করা যায়: `function area({ width, height }) {}` বা `function first([a, b]) {}`। এটি আসলে ভেতরে `const { width, height } = argument` লেখার সংক্ষেপ। React এর প্রতিটি component (`function Card({ title, onClose })`) এই পদ্ধতিই ব্যবহার করে।",
    },
    {
      type: "p",
      text: "Parameter অনেক হলে — বিশেষ করে `boolean` বা ঐচ্ছিক মান থাকলে — positional parameter পড়তে কষ্টকর: `createUser('Rina', true, false, 3)` পড়ে কিছুই বোঝা যায় না। তাই ৩টির বেশি parameter, বা একাধিক ঐচ্ছিক parameter থাকলে **options object** pattern ব্যবহার করা হয়: `createUser('Rina', { admin: true, active: false, retries: 3 })`। নাম দেখেই অর্থ পরিষ্কার, ক্রম মনে রাখতে হয় না, এবং ভবিষ্যতে নতুন option যোগ করলে পুরোনো call ভাঙে না।",
    },
    {
      type: "compare",
      headers: ["", "Positional", "Options object"],
      rows: [
        ["Call এর পাঠযোগ্যতা", "`f(a, true, 3)` — অর্থ অস্পষ্ট", "`f(a, { retry: true, max: 3 })` — স্ব-ব্যাখ্যামূলক"],
        ["ক্রম মনে রাখা", "বাধ্যতামূলক", "দরকার নেই"],
        ["ঐচ্ছিক মান বাদ দেওয়া", "মাঝেরটি বাদ দিতে `undefined` দিতে হয়", "শুধু লাগবে যেটি সেটি দিন"],
        ["নতুন option যোগ", "পুরোনো call ভাঙার ঝুঁকি", "নিরাপদ"],
        ["উপযুক্ত", "১–২টি সহজ, স্পষ্ট parameter (`add(a, b)`)", "৩+ বা ঐচ্ছিক/flag parameter"],
      ],
    },
    { type: "h3", text: "fn.length ও argument validation" },
    {
      type: "p",
      text: "প্রতিটি function এর `length` property আছে, যা **default মান বা rest ছাড়া** parameter এর সংখ্যা (প্রথম default/rest parameter এ পৌঁছানোর আগ পর্যন্ত) জানায়: `((a, b) => {}).length` হলো `2`, কিন্তু `((a, b = 1) => {}).length` হলো `1` আর `((...r) => {}).length` হলো `0`। Library গুলো (যেমন কিছু `curry` implementation) এটি দিয়ে function এর ‘প্রত্যাশিত’ argument সংখ্যা অনুমান করে।",
    },
    {
      type: "p",
      text: "যেহেতু JavaScript argument সংখ্যা বা type যাচাই করে না, public function এর boundary (API, utility, form handler) তে নিজেই validation লিখতে হয়: `typeof`, `Number.isFinite`, `Array.isArray` দিয়ে পরীক্ষা করে সঠিক `TypeError` ছুড়ুন। ভেতরের (private) helper এ অতিরিক্ত validation অপ্রয়োজনীয় — সীমানায় যাচাই, ভেতরে বিশ্বাস। (TypeScript compile-time এ অনেকটা এই কাজ করে, কিন্তু runtime এ network/user input থেকে আসা মান যাচাই তবুও দরকার।)",
    },
    {
      type: "callout",
      tone: "info",
      title: "সাধারণ ভুল ধারণা (Common misconceptions)",
      text: "(১) ‘JavaScript object **pass by reference** করে’ — ভুল; reference এর **কপি** pass হয়, তাই parameter এ নতুন object বসালে caller এর variable বদলায় না। (২) ‘Argument সংখ্যা না মিললে error হয়’ — না, নীরবে `undefined`/উপেক্ষা। (৩) ‘`arguments` একটি Array’ — না, array-like। (৪) ‘Arrow function এও `arguments` আছে’ — না, নেই। (৫) ‘Parameter আর argument একই কথা’ — না; একটি declaration এর, অন্যটি call এর।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "ব্যবহারের নিয়ম",
      text: "ডিফল্ট ভাবে নামকরা parameter ব্যবহার করুন। পরিবর্তনশীল সংখ্যা লাগলে rest (`...args`)। ৩টির বেশি বা ঐচ্ছিক parameter হলে options object (destructured, default সহ)। Input object কখনো mutate করবেন না। `arguments` শুধু পুরোনো কোড পড়ার সময় চিনে রাখুন।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **রেস্তোরাঁর অর্ডার ফর্ম** কল্পনা করুন। ফর্মে ছাপা থাকে খালি ঘর: ‘খাবারের নাম: ____, সাথে পানীয়: ____’। এই ছাপা খালি ঘরগুলোই **parameter** — মান নেই, শুধু একটি নাম ও জায়গা আছে। ক্যাশিয়ারের কাছে গিয়ে আপনি যখন বলেন ‘বিরিয়ানি আর লাচ্ছি’, সেই বলা মানগুলো হলো **argument**।",
    },
    {
      type: "ul",
      items: [
        "ক্যাশিয়ার **ক্রম অনুযায়ী** ঘর পূরণ করেন — আপনি ‘লাচ্ছি, বিরিয়ানি’ বললে খাবারের ঘরে লাচ্ছি বসবে। এটিই positional binding।",
        "পানীয় না বললে ঘরটি **ফাঁকা (`undefined`)** থেকে যায় — ক্যাশিয়ার আপত্তি করেন না, রান্নাঘর যা পারে তাই করে। বেশি জিনিস বললে অতিরিক্তগুলো ফর্মে ঘর পায় না, কিন্তু ক্যাশিয়ার ‘নোটবুকে’ (rest/`arguments`) টুকে রাখতে পারেন।",
        "**Object argument**: আপনি রান্নাঘরে একটি ‘টেবিল নম্বর কার্ড’ (reference) দেন; ফর্মে কার্ডের **ফটোকপি** বসে। কার্ডের ঠিকানায় গিয়ে টেবিলের জিনিস বদলালে (mutation) সবাই দেখে। কিন্তু ফটোকপিতে নতুন টেবিল নম্বর লিখলে (reassignment) আপনার আসল কার্ড বদলায় না।",
        "**Options object** হলো ‘বিশেষ নির্দেশনা’ ফর্ম: ‘ঝাল: কম, প্যাকেট: হ্যাঁ’ — ক্রম নয়, **লেবেল** দেখে পূরণ হয়। তাই ঘর বাড়ালেও পুরোনো অর্ডার অচল হয় না।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Object argument: mutation বনাম reassignment",
      caption: "Parameter এ কপি হয় reference — object নয়। তাই ভেতরের বদল বাইরে দেখা যায়, কিন্তু parameter এ নতুন object বসালে দেখা যায় না।",
      code: "function rename(user) {\n  user.name = \"Mim\";\n  user = { name: \"Other\" };\n}\nconst u = { name: \"Rina\" };\nrename(u);",
      steps: [
        {
          line: 4,
          memory: [{ name: "u", value: "→ obj#1 { name: \"Rina\" }", kind: "const", state: "live" }],
          note: "Global এ `u` তৈরি হলো; heap এ `obj#1` object এবং `u` এ তার ঠিকানা (reference)।",
        },
        {
          line: 5,
          memory: [
            { name: "u", value: "→ obj#1 { name: \"Rina\" }", kind: "const", state: "live" },
            { name: "user (param)", value: "→ obj#1", kind: "value", state: "live" },
          ],
          note: "`rename(u)` call: `u` এর **মান** (ঠিকানা) কপি হয়ে parameter `user` এ বসল। এখন দুটি নামই **একই** `obj#1` এর দিকে তাকিয়ে আছে — object কপি হয়নি।",
        },
        {
          line: 1,
          memory: [
            { name: "u", value: "→ obj#1 { name: \"Mim\" }", kind: "const", state: "live" },
            { name: "user (param)", value: "→ obj#1", kind: "value", state: "live" },
          ],
          note: "`user.name = \"Mim\"` — এটি **mutation**। `user` যে object এ পৌঁছায় সেটিই বদলাল, আর `u` ও সেই একই object, তাই বাইরে থেকেও `Mim` দেখা যায়।",
        },
        {
          line: 2,
          memory: [
            { name: "u", value: "→ obj#1 { name: \"Mim\" }", kind: "const", state: "live" },
            { name: "user (param)", value: "→ obj#2 { name: \"Other\" }", kind: "value", state: "live" },
          ],
          note: "`user = { name: \"Other\" }` — এটি **reassignment**। শুধু local parameter `user` নতুন `obj#2` তে বাঁধল। `u` এখনো `obj#1` এ — caller এর variable কে function এর ভেতর থেকে নতুন মানে বাঁধার উপায় নেই।",
        },
        {
          line: -1,
          memory: [{ name: "u", value: "→ obj#1 { name: \"Mim\" }", kind: "const", state: "live" }],
          note: "Function ফিরে এলে parameter `user` (ও তার `obj#2`) বাদ পড়ে। বাইরে রয়ে গেল mutation এর ফল: `u.name === \"Mim\"`। পুরো ঘটনার শিক্ষা: **mutation দৃশ্যমান, reassignment নয়**।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Call এর সময় argument থেকে parameter এ binding",
      caption: "`greet('Rina')` — function ঘোষণা: `function greet(name, greeting)`। দুটি parameter, একটি argument।",
      nodes: [
        { id: "call", label: "Call site", sub: "greet('Rina')" },
        { id: "args", label: "Argument list", sub: "বাম→ডান, position" },
        { id: "params", label: "Parameters", sub: "name, greeting" },
        { id: "body", label: "Function body", sub: "local scope" },
      ],
      steps: [
        {
          active: ["call"],
          items: { call: ["greet('Rina')"] },
          note: "Call এর মুহূর্তে engine প্রতিটি argument expression **evaluate** করে মান বের করে — এখানে একটিই: `'Rina'`।",
        },
        {
          active: ["args"],
          items: { args: ["[0] 'Rina'"] },
          note: "মানগুলো একটি তালিকায় (ক্রম অনুযায়ী) সাজানো হয়। সংখ্যা মিলছে কি না, engine এখানে দেখে না।",
        },
        {
          active: ["params"],
          items: { params: ["name = 'Rina'", "greeting = undefined"] },
          note: "Position ধরে binding: প্রথম argument → `name`। দ্বিতীয় argument নেই, তাই `greeting` পায় `undefined`। কোনো error নেই।",
        },
        {
          active: ["body"],
          items: { body: ["name = 'Rina'", "greeting = undefined", "greeting + ', ' + name", "→ 'undefined, Rina'"] },
          note: "Body চলে এই local binding গুলো নিয়ে। `undefined` string এ জুড়ে গেছে — তাই সীমানায় default বা validation দরকার (পরের Default Parameters lesson)।",
          output: "undefined, Rina",
        },
        {
          active: ["args", "params"],
          items: { args: ["[0] 'A'", "[1] 'B'", "[2] 'C'"], params: ["name = 'A'", "greeting = 'B'"] },
          note: "উল্টো ঘটনা: `greet('A','B','C')`। তৃতীয় argument `'C'` কোনো parameter এ bind হয়নি, তাই উপেক্ষিত — কিন্তু সেটি `arguments` বা rest parameter এ পাওয়া যায়।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "কম-বেশি argument এবং fn.length",
      description: "Argument সংখ্যা না মিললে কী হয় দেখুন: কম হলে `undefined`, বেশি হলে নীরবে উপেক্ষা। `length` কী গোনে তাও লক্ষ্য করুন।",
      code: `function greet(name, greeting) {
  return greeting + ", " + name;
}

console.log(greet("Rina", "Hello"));          // সঠিক
console.log(greet("Rina"));                   // greeting = undefined
console.log(greet("Rina", "Hi", "extra"));    // 'extra' উপেক্ষিত

console.log("arity:", greet.length);          // parameter সংখ্যা

function withDefault(a, b = 2, c) {}
console.log(withDefault.length);              // প্রথম default এর আগ পর্যন্ত
console.log(((...rest) => rest).length);      // rest গোনা হয় না`,
    },
    {
      level: "intermediate",
      title: "Mutation বনাম reassignment এবং spread/rest",
      description: "Object argument এ দুটি কাজ আলাদা ফল দেয়। তারপর rest দিয়ে জড়ো করা এবং spread দিয়ে ছড়ানো দেখুন।",
      code: `function rename(user) { user.name = "Mim"; }
function replace(user) { user = { name: "Other" }; return user.name; }

const u = { name: "Rina" };
rename(u);
console.log(u);              // mutation বাইরে দেখা যায়
console.log(replace(u));     // local parameter বদলাল
console.log(u);              // u অক্ষত

// rest: জড়ো করে একটি আসল Array
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
const scores = [10, 20, 30];
console.log(sum(...scores, 40));   // spread: array কে আলাদা argument এ খোলে
console.log(sum());                // কিছু না দিলে খালি array

// legacy arguments: array-like
function legacy() {
  console.log(arguments.length, Array.isArray(arguments), Array.isArray(Array.from(arguments)));
}
legacy("a", "b", "c");`,
    },
    {
      level: "real-world",
      title: "Options object, default ও validation: HTTP request config",
      description: "Production style: প্রথম parameter বাধ্যতামূলক, বাকি সব ঐচ্ছিক option একটি destructured object এ। সীমানায় validation আছে। `= {}` দিয়ে option object পুরোপুরি বাদ দেওয়াও নিরাপদ।",
      code: `function createRequest(url, { method = "GET", headers = {}, retries = 0 } = {}) {
  if (typeof url !== "string" || url.trim() === "") {
    throw new TypeError("url must be a non-empty string");
  }
  if (!Number.isInteger(retries) || retries < 0) {
    throw new RangeError("retries must be a non-negative integer");
  }
  return {
    url,
    method: method.toUpperCase(),
    headers: { Accept: "application/json", ...headers },
    retries,
  };
}

console.log(createRequest("/api/users"));
console.log(createRequest("/api/users", { method: "post", retries: 2, headers: { Authorization: "Bearer x" } }));

for (const bad of [[42], ["/api", { retries: -1 }]]) {
  try {
    createRequest(...bad);
  } catch (err) {
    console.log(err.name + ": " + err.message);
  }
}`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function show(a, b) {
  console.log("a =", a, "| b =", b);
}
show(1);
show(1, 2, 3);
`,
    },
    {
      label: "Rest বনাম arguments",
      code: `function viaArguments() {
  // arguments array-like: map নেই, তাই আগে রূপান্তর
  return Array.from(arguments).map((n) => n * 2);
}
function viaRest(...nums) {
  return nums.map((n) => n * 2);
}
console.log(viaArguments(1, 2, 3));
console.log(viaRest(1, 2, 3));

// arrow এর নিজস্ব arguments নেই; বাইরের function এরটি দেখে
function outer() {
  const inner = () => arguments.length;
  return inner(1, 2, 3, 4, 5);
}
console.log(outer("only-one"));`,
    },
    {
      label: "Destructured parameter ও default",
      code: `function area({ width, height = 10 }) {
  return width * height;
}
console.log(area({ width: 5 }));
console.log(area({ width: 5, height: 4 }));

function firstTwo([a, b] = []) {
  return [b, a];
}
console.log(firstTwo([1, 2]));
console.log(firstTwo());

try {
  area();               // undefined কে destructure করা যায় না
} catch (e) {
  console.log(e.name);
}`,
    },
    {
      label: "Spread দিয়ে call",
      code: `const nums = [4, 9, 2];
console.log(Math.max(...nums));
console.log(Math.max(...nums, 100));

function intro(a, b, c) { return [a, b, c]; }
console.log(intro(...[1, 2], 3));
console.log(intro(..."ab"));        // string ও iterable

// argument সংখ্যা: map callback এ তিনটি
["x", "y"].forEach((...args) => console.log(args));`,
    },
  ],

  debugging: [
    {
      title: "Argument ভুলে গেলে NaN",
      bad: `function add(a, b) {
  return a + b;
}
console.log(add(5));`,
      why: "`add(5)` এ `b` পায় `undefined`, এবং `5 + undefined` হয় `NaN`। JavaScript argument সংখ্যা যাচাই করে না, তাই bug টি error হিসেবে ধরা পড়ে না — ধরা পড়ে অনেক পরে, অন্য জায়গায়। Public function এ validation বা default দিন।",
      fix: `function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("add expects two numbers");
  }
  return a + b;
}
try {
  console.log(add(5, 3));
  console.log(add(5));
} catch (e) {
  console.log(e.name + ": " + e.message);
}`,
    },
    {
      title: "Arrow function এ arguments কাজ করে না",
      bad: `function makeSummer() {
  // arrow এর নিজের arguments নেই — makeSummer এর টি দেখে
  return () => {
    let total = 0;
    for (const n of arguments) total += n;
    return total;
  };
}
const sum = makeSummer(1000);
console.log(sum(1, 2, 3));`,
      why: "Arrow function এর নিজস্ব `arguments` নেই; নাম খোঁজা হয় lexical ভাবে বাইরের function এ, তাই এখানে `makeSummer(1000)` এর `arguments` (`[1000]`) ধরা পড়ছে — `1, 2, 3` নয়। Result `1000`, `6` নয়। Rest parameter এ এই সমস্যা নেই, কারণ সেটি arrow এর নিজের parameter।",
      fix: `function makeSummer() {
  return (...nums) => nums.reduce((acc, n) => acc + n, 0);
}
const sum = makeSummer();
console.log(sum(1, 2, 3));`,
    },
    {
      title: "Input object নীরবে mutate হচ্ছে",
      bad: `function addTag(post, tag) {
  post.tags.push(tag);
  return post;
}
const original = { title: "Hello", tags: ["js"] };
const updated = addTag(original, "react");
console.log(original.tags, updated.tags);`,
      why: "`post` ও `original` একই object এর reference, তাই `post.tags.push` caller এর `original` ও বদলে দেয়। দুটি আলাদা সংস্করণ চাইলে function কে নতুন object ফেরত দিতে হবে — নইলে React এ state mutate করে re-render মিস হয়, undo/history ভেঙে যায়।",
      fix: `function addTag(post, tag) {
  return { ...post, tags: [...post.tags, tag] };
}
const original = { title: "Hello", tags: ["js"] };
const updated = addTag(original, "react");
console.log(original.tags, updated.tags);`,
    },
    {
      title: "map(parseInt) এর অদ্ভুত ফল",
      bad: `console.log(["1", "2", "3"].map(parseInt));`,
      why: "`map` প্রতিবার callback কে তিনটি argument দেয়: `(element, index, array)`। `parseInt(string, radix)` এর দ্বিতীয় parameter হলো radix, তাই `parseInt('2', 1)` ও `parseInt('3', 2)` অবৈধ radix/অঙ্ক হওয়ায় `NaN`। বাড়তি argument ‘নিরীহ’ নয়। শুধু যে argument লাগবে সেটিই পাঠান।",
      fix: `console.log(["1", "2", "3"].map((s) => parseInt(s, 10)));
console.log(["1", "2", "3"].map(Number));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "fullName function লিখুন",
      prompt: "`fullName(first, last)` function টি first ও last নাম জুড়ে (মাঝে একটি space) ফেরত দিক। `fullName('Rina', 'Akter')` print করলে `Rina Akter` আসতে হবে।",
      starter: `function fullName(first, last) {
  // TODO: দুটি নাম space দিয়ে জুড়ে return করুন
  return first;
}

console.log(fullName("Rina", "Akter"));`,
      expected: "Rina Akter",
      hints: ["দুটি parameter আছে — দুটিই ব্যবহার করুন।", "`first + ' ' + last` লিখুন।"],
      solution: `function fullName(first, last) {
  return first + " " + last;
}

console.log(fullName("Rina", "Akter"));`,
    },
    {
      level: "beginner",
      title: "Rest দিয়ে argument গোনা",
      prompt: "`countArgs` কে এমন করুন যেন সে যতগুলো argument পায় তার সংখ্যা ফেরত দেয়। `countArgs(1, 2, 3)` ও `countArgs()` এর ফল যথাক্রমে `3` ও `0`।",
      starter: `function countArgs() {
  // TODO: rest parameter ব্যবহার করুন
  return 0;
}

console.log(countArgs(1, 2, 3));
console.log(countArgs());`,
      expected: "3\n0",
      hints: ["Parameter তালিকায় `...args` লিখুন।", "`args` একটি Array, তাই `args.length` দিন।"],
      solution: `function countArgs(...args) {
  return args.length;
}

console.log(countArgs(1, 2, 3));
console.log(countArgs());`,
    },
    {
      level: "beginner",
      title: "Destructured parameter",
      prompt: "`area` function টি `{ width, height }` object নিয়ে ক্ষেত্রফল ফেরত দিক। Parameter তালিকাতেই destructure করুন। `area({ width: 5, height: 10 })` হবে `50`।",
      starter: `function area(rect) {
  // TODO: parameter তালিকায় { width, height } destructure করুন
  return rect;
}

console.log(area({ width: 5, height: 10 }));`,
      expected: "50",
      hints: ["`function area({ width, height })` লিখুন।", "তারপর `width * height` return করুন।"],
      solution: `function area({ width, height }) {
  return width * height;
}

console.log(area({ width: 5, height: 10 }));`,
    },
    {
      level: "intermediate",
      title: "Argument mutate করবেন না",
      prompt: "`withDiscount` এখন input `product` কে সরাসরি বদলে দিচ্ছে। এটি এমনভাবে ঠিক করুন যেন নতুন object ফেরত দেয় ও মূল product অক্ষত থাকে। আউটপুট: প্রথমে মূল, তারপর ছাড়যুক্ত।",
      starter: `function withDiscount(product, percent) {
  product.price = product.price - (product.price * percent) / 100;
  return product;
}

const pen = { name: "Pen", price: 100 };
const discounted = withDiscount(pen, 10);
console.log(pen);
console.log(discounted);`,
      expected: "{ name: 'Pen', price: 100 }\n{ name: 'Pen', price: 90 }",
      hints: ["`product.price = ...` আসলে caller এর object বদলায়।", "Spread দিয়ে নতুন object বানান: `{ ...product, price: ... }`।"],
      solution: `function withDiscount(product, percent) {
  return { ...product, price: product.price - (product.price * percent) / 100 };
}

const pen = { name: "Pen", price: 100 };
const discounted = withDiscount(pen, 10);
console.log(pen);
console.log(discounted);`,
      explanation: "নতুন object তৈরি করে ফেরত দিলে input অক্ষত থাকে। এটিই React এর immutable update pattern এর ভিত্তি।",
    },
    {
      level: "intermediate",
      title: "arguments থেকে rest এ রূপান্তর",
      prompt: "নিচের legacy `sum` function `arguments` এর বদলে rest parameter ব্যবহার করুক, যেন `sum(1, 2, 3, 4)` = `10`, `sum()` = `0` হয়। তৃতীয় লাইনে `sum.length` (rest গোনা হয় না) print হবে `0`।",
      starter: `function sum(a, b) {
  return a + b;
}

console.log(sum(1, 2, 3, 4));
console.log(sum());
console.log(sum.length);`,
      expected: "10\n0\n0",
      hints: ["Parameter তালিকা বদলে `...nums` করুন।", "`reduce` এ initial মান `0` দিলে খালি array তেও কাজ করে।"],
      solution: `function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}

console.log(sum(1, 2, 3, 4));
console.log(sum());
console.log(sum.length);`,
      explanation: "Rest parameter একটি আসল Array দেয় এবং `fn.length` এ গোনা হয় না, তাই `length` হয় `0`।",
    },
    {
      level: "challenge",
      title: "createUser: options object ও validation",
      prompt: "`createUser(name, options)` লিখুন: `name` বাধ্যতামূলক non-empty string (না হলে `TypeError('name is required')`), এবং `options` হলো ঐচ্ছিক `{ role = 'user', active = true }` (options পুরোপুরি বাদ দিলেও কাজ করবে)। `name` trim করা হবে। শেষে `createUser.length` print করুন।",
      starter: `function createUser(name) {
  // TODO: destructured, default সহ options parameter যোগ করুন
  // TODO: name validation (TypeError("name is required"))
  return { name };
}

console.log(createUser("  Rina "));
console.log(createUser("Mim", { role: "admin" }));
try {
  createUser("");
} catch (e) {
  console.log(e.name + ": " + e.message);
}
console.log(createUser.length);`,
      expected: "{ name: 'Rina', role: 'user', active: true }\n{ name: 'Mim', role: 'admin', active: true }\nTypeError: name is required\n1",
      hints: [
        "দ্বিতীয় parameter: `{ role = 'user', active = true } = {}`।",
        "Validation: `typeof name !== 'string' || name.trim() === ''` হলে `throw new TypeError(...)`।",
        "`fn.length` default যুক্ত প্রথম parameter এর আগ পর্যন্ত গোনে, তাই `1`।",
      ],
      solution: `function createUser(name, { role = "user", active = true } = {}) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new TypeError("name is required");
  }
  return { name: name.trim(), role, active };
}

console.log(createUser("  Rina "));
console.log(createUser("Mim", { role: "admin" }));
try {
  createUser("");
} catch (e) {
  console.log(e.name + ": " + e.message);
}
console.log(createUser.length);`,
      explanation: "`= {}` না থাকলে `createUser('Rina')` এ `undefined` কে destructure করতে গিয়ে TypeError হতো। বাধ্যতামূলক parameter (`name`) আগে, ঐচ্ছিক গুলো options object এ — এটি production এর সাধারণ নকশা।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`function f(a, b) {}` — `f(1, 2, 3)` call করলে কী হয়?",
        options: [
          "`TypeError` — argument বেশি",
          "তৃতীয় argument কোনো নামে bind হয় না, তাই সাধারণভাবে উপেক্ষিত (কিন্তু rest/`arguments` এ পাওয়া যেত)",
          "`a` ও `b` তে `1`, `3` বসে",
          "Function টি call-ই হয় না",
        ],
        answer: 1,
        explanation: "JavaScript arity enforce করে না। বাড়তি argument নীরবে নামহীন থাকে। প্রথম বিকল্প ভুল কারণ কোনো error নেই; তৃতীয়টি ভুল কারণ binding position অনুযায়ী হয়, বাদ দিয়ে নয়; চতুর্থটি ভুল কারণ call স্বাভাবিকভাবেই চলে।",
      },
      {
        question: "নিচের কোডে শেষ লাইনে কী print হবে?\n`function f(o) { o = { x: 2 }; }`\n`const obj = { x: 1 }; f(obj); console.log(obj.x);`",
        options: ["`2`", "`undefined`", "`1`", "`TypeError`"],
        answer: 2,
        explanation: "`o = { x: 2 }` শুধু local parameter `o` কে নতুন object এ বাঁধে; `obj` এর reference বদলায় না, তাই `1`। `2` হতো যদি `o.x = 2` (mutation) লেখা হতো। `undefined` বা TypeError এর কোনো কারণ নেই।",
      },
      {
        question: "Rest parameter (`...args`) ও `arguments` এর মধ্যে কোন বক্তব্যটি সঠিক?",
        options: [
          "দুটিই আসল Array এবং arrow function এ কাজ করে",
          "`arguments` আসল Array, rest array-like",
          "Rest আসল Array এবং arrow এ কাজ করে; `arguments` array-like এবং arrow এ নিজস্ব নেই",
          "Rest শুধু function এর মাঝের parameter হতে পারে",
        ],
        answer: 2,
        explanation: "Rest আসল Array (তাই `map`, `reduce` চলে) এবং arrow এও ব্যবহারযোগ্য। `arguments` array-like এবং arrow এর নিজস্ব নেই। অন্য বিকল্পগুলো এই বৈশিষ্ট্য উল্টে দিয়েছে; আর rest অবশ্যই **শেষ** parameter হতে হবে, মাঝে নয়।",
      },
      {
        question: "কোন ক্ষেত্রে options-object pattern সবচেয়ে বেশি উপযোগী?",
        options: [
          "`add(a, b)` এর মতো দুটি স্পষ্ট parameter",
          "`createUser(name, true, false, 3)` এর মতো একাধিক boolean/ঐচ্ছিক মান",
          "যেখানে সবসময় ঠিক একটিই argument",
          "যেখানে function এ কোনো parameter নেই",
        ],
        answer: 1,
        explanation: "একাধিক ঐচ্ছিক/flag মান থাকলে positional call পড়া যায় না এবং ক্রম ভুল হয়; নামযুক্ত option এ সেটি সমাধান হয়। বাকি তিনটি ক্ষেত্রে বাড়তি object যোগ করলে শুধু জটিলতা বাড়ে।",
      },
      {
        question: "`((a, b = 2, c) => {}).length` এর মান কত?",
        options: ["3", "2", "0", "1"],
        answer: 3,
        explanation: "`length` গোনে প্রথম default (বা rest) parameter এর **আগ পর্যন্ত** — এখানে শুধু `a`, তাই `1`। `3` হতো যদি সব গোনা হতো, `2` হতো শুধু default বাদ দিলে (কিন্তু `c` ও বাদ পড়ে), আর `0` হতো প্রথম parameter ই default হলে।",
      },
    ],
    coding: [
      {
        title: "joinWords: separator + rest",
        prompt: "`joinWords(separator, ...words)` লিখুন যা words গুলো separator দিয়ে জুড়ে string ফেরত দেয়। `joinWords('-', 'a', 'b', 'c')` → `a-b-c`; `joinWords('+', 'x')` → `x`; কোনো word না দিলে খালি string (length `0`)।",
        starter: `function joinWords() {
  // TODO
}

console.log(joinWords("-", "a", "b", "c"));
console.log(joinWords("+", "x"));
console.log(joinWords("/").length);`,
        expected: "a-b-c\nx\n0",
        solution: `function joinWords(separator, ...words) {
  return words.join(separator);
}

console.log(joinWords("-", "a", "b", "c"));
console.log(joinWords("+", "x"));
console.log(joinWords("/").length);`,
      },
      {
        title: "updateSettings: mutate না করে নতুন object",
        prompt: "`updateSettings(settings, changes)` নতুন object ফেরত দিক (`changes` দিয়ে `settings` কে override করে) এবং মূল `settings` অক্ষত রাখুক।",
        starter: `function updateSettings(settings, changes) {
  // TODO
}

const base = { theme: "dark", lang: "bn" };
const next = updateSettings(base, { theme: "light" });
console.log(base);
console.log(next);`,
        expected: "{ theme: 'dark', lang: 'bn' }\n{ theme: 'light', lang: 'bn' }",
        solution: `function updateSettings(settings, changes) {
  return { ...settings, ...changes };
}

const base = { theme: "dark", lang: "bn" };
const next = updateSettings(base, { theme: "light" });
console.log(base);
console.log(next);`,
      },
    ],
  },

  interview: [
    {
      q: "Parameter ও argument এর পার্থক্য কী?",
      a: "**Parameter** হলো function declaration এ লেখা নাম (`function add(a, b)` এর `a`, `b`) — function এর ভেতরে এরা local variable। **Argument** হলো call এর সময় পাঠানো আসল মান (`add(2, 3)` এর `2`, `3`)।\n\nCall এর সময় engine argument গুলো evaluate করে ক্রম অনুযায়ী parameter এ bind করে। নাম নয়, **position** দিয়ে মিল হয় — তাই argument এর ক্রম ভুল হলে error নয়, শুধু ভুল ফল আসে। এই কারণেই বেশি parameter থাকলে options object ভালো।",
    },
    {
      q: "JavaScript কি pass by value নাকি pass by reference?",
      a: "JavaScript এ সবসময় **pass by value** — তবে object এর ক্ষেত্রে ‘value’ হলো reference (ঠিকানা), তাই এটিকে কেউ কেউ ‘call by sharing’ বলেন।\n\nPrimitive এর কপি হয় আসল মান। Object এর ক্ষেত্রে ঠিকানার কপি হয় — ফলে parameter ও caller এর variable একই object এ পৌঁছায়। তাই `param.x = 1` (**mutation**) caller এও দেখা যায়, কিন্তু `param = {...}` (**reassignment**) caller এর variable বদলায় না। সত্যিকারের pass by reference হলে function এর ভেতর থেকে caller এর variable কেই নতুন মানে বাঁধা যেত — JavaScript এ সেটি সম্ভব নয়।",
    },
    {
      q: "Rest parameter ও `arguments` object এর মধ্যে কোনটি কখন, এবং কেন?",
      a: "নতুন কোডে সবসময় rest parameter (`...args`)। কারণ: (১) এটি আসল Array, তাই `map`/`reduce` সরাসরি চলে; (২) arrow function এ কাজ করে, যেখানে `arguments` এর নিজস্ব সংস্করণই নেই (বাইরের function এর টি দেখা যায়); (৩) signature দেখেই বোঝা যায় function কতগুলো ও কী ধরনের argument নেয়।\n\n`arguments` array-like (`length` ও index আছে কিন্তু Array method নেই) এবং পুরোনো কোডে পাওয়া যায়; সেটি পড়তে জানা দরকার, কিন্তু নতুন কোডে লেখা উচিত নয়। আর rest কেবল নামকরা parameter এর **পরের** বাকি argument গুলো ধরে, `arguments` ধরে সবগুলো।",
    },
    {
      q: "কখন positional parameter ছেড়ে options object ব্যবহার করবেন?",
      a: "সাধারণ নিয়ম: তিনটির বেশি parameter, বা একাধিক ঐচ্ছিক মান/boolean flag থাকলে options object। `fetchData(url, true, false, 3)` পড়ে কেউ বোঝে না `true` কী, কিন্তু `fetchData(url, { cache: true, retries: 3 })` নিজেই ব্যাখ্যা।\n\nসুবিধা: call এ ক্রম মনে রাখতে হয় না, ঐচ্ছিক মান বাদ দেওয়া সহজ, এবং পরে নতুন option যোগ করলে পুরোনো caller ভাঙে না। সাবধানতা: parameter টি `= {}` default সহ দিন, নইলে option ছাড়া call এ `undefined` destructure হয়ে TypeError হবে; আর বাধ্যতামূলক মান আলাদা positional parameter রাখাই ভালো।",
    },
    {
      q: "Function এর ভেতরে argument object mutate করলে কী সমস্যা, এবং React এ এর প্রাসঙ্গিকতা কী?",
      a: "Object ও array পাঠানোর সময় reference এর কপি যায়, তাই ভেতর থেকে `items.push(x)` বা `user.name = y` করলে caller এর আসল data বদলে যায় — এটি **hidden side effect**, যা debug করা কঠিন কারণ call এ দেখে বোঝা যায় না কী বদলাল।\n\nReact এ state ও props mutate করা বিপজ্জনক: React সাধারণত reference পরিবর্তন দেখে re-render ঠিক করে, তাই একই reference mutate করলে UI আপডেট নাও হতে পারে, memoization (`useMemo`, `React.memo`) ভুল ফল দিতে পারে। সমাধান: spread/`map`/`filter` দিয়ে নতুন object/array ফেরত দেওয়া, যাতে function কে predictable রাখা যায়।",
    },
    {
      q: "`['1', '2', '3'].map(parseInt)` কেন `[1, NaN, NaN]` দেয়?",
      a: "`map` তার callback কে প্রতিবার তিনটি argument দেয়: `(element, index, array)`। `parseInt(string, radix)` এর দ্বিতীয় parameter হলো radix (সংখ্যা পদ্ধতির ভিত্তি), তাই `index` টি radix হয়ে যায়।\n\nফলে call গুলো হয় `parseInt('1', 0)` (radix 0 কে সাধারণ ভাবে ১০ ধরা হয়, ফল `1`), `parseInt('2', 1)` (radix 1 অবৈধ, `NaN`) এবং `parseInt('3', 2)` (বাইনারিতে `3` বৈধ অঙ্ক নয়, `NaN`)। শিক্ষা: JavaScript বাড়তি argument নীরবে পাঠিয়ে দেয়, তাই এমন function কে সরাসরি callback দিতে হলে wrapper (`s => parseInt(s, 10)`) বা `Number` ব্যবহার করুন।",
    },
  ],

  summary: {
    takeaways: [
      "Parameter = declaration এর নাম; argument = call এর মান। Binding হয় **position** অনুযায়ী।",
      "Arity enforce হয় না: কম argument → `undefined`, বেশি → নীরবে উপেক্ষিত (rest/`arguments` এ পাওয়া যায়)।",
      "Argument সবসময় value হিসেবে যায়; object এর ক্ষেত্রে reference এর কপি — mutation বাইরে দেখা যায়, reassignment যায় না।",
      "Rest `...args` আসল Array; `arguments` array-like ও arrow এ নেই — নতুন কোডে rest। Call এ `...` হলো spread।",
      "৩+ বা ঐচ্ছিক parameter হলে destructured options object (`= {}` default সহ)।",
      "`fn.length` প্রথম default/rest এর আগের parameter গোনে। সীমানায় নিজেই validation লিখুন।",
    ],
    syntax: `function f(a, b) {}                       // parameters
f(1, 2);                                  // arguments

function sum(...nums) {}                  // rest: জড়ো করে
sum(...[1, 2, 3]);                        // spread: ছড়ায়

function area({ w, h = 1 } = {}) {}       // destructured + default
function g(a, b = 2) {}                   // g.length === 1`,
    whenToUse: [
      "অনির্দিষ্ট সংখ্যক argument লাগলে rest parameter।",
      "৩টির বেশি বা ঐচ্ছিক/flag parameter থাকলে options object।",
      "Public function এ `typeof`/`Number.isFinite` দিয়ে validation; ভেতরের helper এ নয়।",
      "Input object/array কে mutate না করে নতুন কপি ফেরত দিন।",
    ],
    next: [
      "Default Parameters — missing/undefined argument এর জন্য ডিফল্ট মান",
      "Return — function থেকে মান ফেরত দেওয়া",
      "Higher-order ও Callback Functions — extra argument এর বাস্তব প্রভাব",
    ],
  },

  compatibility:
    "Rest parameter, spread ও destructured parameter ES2015 এর অংশ — সব আধুনিক browser ও Node.js (6+) এ কাজ করে। `arguments` সব environment এ আছে (arrow function ছাড়া)। Object spread (`{ ...obj }`) ES2018 এর অংশ। এই lesson এর সব কোড browser ও Node.js এ একই আচরণ করে।",
};
