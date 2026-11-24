import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`var`, `let`, `const` এর scope, hoisting ও reassignment নিয়ম নিজে explain করতে পারবেন।",
    "JavaScript engine কোড চালানোর আগে variable নিয়ে ভেতরে কী করে (creation phase) এবং **Temporal Dead Zone** কেন আছে — তা বুঝবেন।",
    "`const` মানে ‘মান অপরিবর্তনীয়’ নয়, ‘binding অপরিবর্তনীয়’ — এই পার্থক্য ধরতে পারবেন।",
    "Loop এর ভেতরে `var` এর closure bug চিনে `let` দিয়ে ঠিক করতে পারবেন।",
    "বাস্তব কোডে কখন কোনটি ব্যবহার করবেন — সেই নিয়ম প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Variable আসলে কী?" },
    {
      type: "p",
      text: "Variable হলো memory তে রাখা একটি মানের **নামযুক্ত ঠিকানা**। `let age = 25;` লিখলে JavaScript একটি নাম (`age`) তৈরি করে এবং সেই নামকে `25` মানের সাথে **bind** করে। এই নাম-থেকে-মান সংযোগটিকে বলে **binding**। পুরো আলোচনার মূল বিষয় হলো — binding কোথায় বাঁচে (scope), কখন তৈরি হয় (hoisting), এবং পরে বদলানো যায় কি না (reassignment)।",
    },
    {
      type: "p",
      text: "ES2015 (ES6) এর আগে শুধু `var` ছিল। সেটির কিছু নিয়ম অদ্ভুত ছিল, যেগুলো থেকে অসংখ্য bug জন্মাত। তাই ES2015 এ `let` ও `const` যোগ হয়েছে। আজকের modern JavaScript এ প্রায় সব কোড `const` ও `let` দিয়ে লেখা হয়।",
    },
    { type: "h3", text: "তিনটির পার্থক্য এক নজরে" },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "var", "let", "const"],
      rows: [
        ["Scope", "Function scope (block মানে না)", "Block scope `{ }`", "Block scope `{ }`"],
        ["Hoisting", "হয়, মান `undefined` দিয়ে শুরু", "হয়, কিন্তু **TDZ** এ থাকে", "হয়, কিন্তু **TDZ** এ থাকে"],
        ["Reassign", "করা যায়", "করা যায়", "**যায় না** (TypeError)"],
        ["Redeclare (একই scope)", "করা যায়", "যায় না (SyntaxError)", "যায় না (SyntaxError)"],
        ["Initial মান", "ঐচ্ছিক", "ঐচ্ছিক (না দিলে `undefined`)", "**বাধ্যতামূলক**"],
        ["Global object এ যুক্ত হয়?", "হয় (classic script এর top-level এ)", "না", "না"],
      ],
    },
    { type: "h3", text: "ভেতরে কীভাবে কাজ করে? (Creation phase ও Execution phase)" },
    {
      type: "p",
      text: "JavaScript engine (যেমন V8) কোড লাইন ধরে ধরে সরাসরি চালায় না। প্রতিটি scope এ ঢোকার সময় আগে একটি **creation phase** চলে — engine পুরো scope টি স্ক্যান করে সব declaration একটি **Environment Record** এ নথিভুক্ত করে। তারপর শুরু হয় **execution phase**, যেখানে লাইন ধরে কোড চলে ও মান বসে।",
    },
    {
      type: "ul",
      items: [
        "`var x` — creation phase এই `x` তৈরি করে এবং সাথে সাথে `undefined` দিয়ে **initialize** করে দেয়। তাই declaration লাইনের আগেও `x` পড়া যায় (পাবেন `undefined`)। একেই সাধারণত **hoisting** বলা হয়।",
        "`let x` / `const x` — creation phase এ নামটি নথিভুক্ত হয়, কিন্তু **initialize হয় না**। declaration লাইনে পৌঁছানো পর্যন্ত এটি **Temporal Dead Zone (TDZ)** এ থাকে; এই সময় নামটি পড়লে বা লিখলে `ReferenceError`।",
        "`function foo() {}` declaration সম্পূর্ণভাবে (নাম ও body সহ) hoist হয় — এটি আলাদা topic (Functions module)।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "‘let hoist হয় না’ — এটি একটি জনপ্রিয় ভুল ধারণা",
      text: "`let` ও `const` ও hoist হয় — অর্থাৎ block এর শুরুতেই তাদের নাম জানা থাকে। প্রমাণ: একটি বাইরের `x` থাকলেও ভেতরের block এ পরে `let x` লিখলে ভেতরে `x` পড়লে বাইরের `x` মিলে না, বরং TDZ error আসে — কারণ ভেতরের `x` ইতিমধ্যেই shadow করে বসে আছে। TDZ হলো এই ‘জানা আছে কিন্তু ব্যবহারযোগ্য নয়’ অবস্থার নাম।",
    },
    { type: "h3", text: "const আসলে কী নিশ্চিত করে?" },
    {
      type: "p",
      text: "`const` নিশ্চিত করে যে **নাম থেকে মানের binding** আর বদলাবে না। কিন্তু মানটি যদি object বা array হয়, তবে সেই object এর **ভেতরের কনটেন্ট বদলানো যায়** — কারণ `const` শুধু ‘ঠিকানা’ আটকে রাখে, ঠিকানার বাড়ির আসবাব নয়। সত্যিকারের (shallow) immutability চাইলে `Object.freeze()` ব্যবহার করতে হয়, এবং nested object এর জন্য সেটিও যথেষ্ট নয়।",
    },
    { type: "h3", text: "কোনটি কখন ব্যবহার করবেন — আধুনিক নিয়ম" },
    {
      type: "ol",
      items: [
        "**ডিফল্ট হিসেবে `const`**। প্রায় ৮০–৯০% variable কখনো reassign হয় না। `const` দেখলে পাঠক বুঝে যায় ‘এই নামটি আর বদলাবে না’ — কোড পড়া সহজ হয়।",
        "যে variable সত্যিই পরে বদলাবে (counter, accumulator, loop index) সেখানে **`let`**।",
        "**`var` নতুন কোডে ব্যবহার করবেন না।** পুরোনো কোড পড়ার জন্য নিয়মগুলো জানা দরকার, কিন্তু নিজে লিখবেন না।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Browser ও Node.js এ পার্থক্য",
      text: "Browser এর classic `<script>` এর top-level এ `var x = 1` লিখলে `window.x` তৈরি হয়; `let`/`const` এ হয় না। ES Module (`type=\"module\"`) এবং Node.js (CommonJS ও ESM উভয়) এ top-level variable module-local — global object এ যায় না। তাই এই আচরণ environment ভেদে আলাদা।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন আপনি একটি অফিসে কাজ করেন। প্রতিটি **ঘর (scope)** এর দরজায় কিছু **নামফলক (variable name)** লাগানো আছে, আর প্রতিটি নামফলকের পেছনে একটি **ডেস্কের ঠিকানা (memory)**।",
    },
    {
      type: "ul",
      items: [
        "**`var`** হলো পুরো **ফ্লোরের** জন্য নামফলক। ফ্লোরের যেকোনো ঘরের ভেতর থেকে লাগালেও সেটি ফ্লোরের সবাই দেখতে পায় — ঘরের দেয়াল (block) তাকে আটকায় না। আর ফ্লোর চালু হওয়ার সাথেই নামফলকটি লাগানো থাকে, ডেস্ক খালি (`undefined`)।",
        "**`let`** হলো একটি **নির্দিষ্ট ঘরের** (block) নামফলক। ঘরের বাইরে কেউ দেখে না। ঘর তৈরি হওয়ার সময় নামফলক লাগানো থাকে, কিন্তু ডেস্ক **সিল করা** — আপনি নিজে সেই লাইনে পৌঁছে সিল না খোলা পর্যন্ত কেউ ডেস্কে হাত দিতে পারবে না (TDZ)। সিল খোলার পর ডেস্কের জিনিস বদলাতে পারবেন।",
        "**`const`** হলো `let` এর মতোই, কিন্তু নামফলকটি **স্থায়ীভাবে ঝালাই** করা। নামফলক আর অন্য ডেস্কে সরানো যাবে না। তবে ডেস্কের ওপর যদি একটি **ফাইল-ক্যাবিনেট (object)** থাকে, তার ভেতরের ফাইল আপনি বদলাতে পারবেন — শুধু ক্যাবিনেটটিকে অন্য ক্যাবিনেট দিয়ে বদলানো যাবে না।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Hoisting ও Temporal Dead Zone: var বনাম let",
      code: "console.log(a);\nvar a = 10;\nconsole.log(b);\nlet b = 20;",
      steps: [
        {
          line: -1,
          memory: [
            { name: "a", value: "undefined", kind: "var", state: "hoisted" },
            { name: "b", value: "", kind: "let", state: "tdz" },
          ],
          note: "Creation phase: কোড চলার আগেই engine পুরো scope স্ক্যান করে। `a` (var) তৈরি হয়ে `undefined` পায়। `b` (let) নথিভুক্ত হয়, কিন্তু uninitialized — এটি TDZ তে।",
        },
        {
          line: 0,
          memory: [
            { name: "a", value: "undefined", kind: "var", state: "hoisted" },
            { name: "b", value: "", kind: "let", state: "tdz" },
          ],
          output: "undefined",
          note: "`console.log(a)` — `a` আগে থেকেই আছে, মান `undefined`। কোনো error নেই। (এটাই hoisting এর ফল — এবং এই আচরণ প্রায়ই bug লুকিয়ে রাখে।)",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: "10", kind: "var", state: "live" },
            { name: "b", value: "", kind: "let", state: "tdz" },
          ],
          note: "`var a = 10` — এই লাইনে এসে `a` এর মান `10` বসে। declaration আগেই হয়েছিল; এখানে শুধু assignment হলো।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "10", kind: "var", state: "live" },
            { name: "b", value: "", kind: "let", state: "error" },
          ],
          output: "ReferenceError: Cannot access 'b' before initialization",
          note: "`b` পড়ার চেষ্টা — কিন্তু `let b = 20` লাইনে এখনো পৌঁছায়নি, তাই `b` TDZ তে। engine ReferenceError ছুড়ে প্রোগ্রাম থামিয়ে দেয়। এটি ভালো — bug সাথে সাথে ধরা পড়ে।",
        },
      ],
      caption: "TDZ হলো scope শুরু থেকে `let`/`const` declaration লাইন পর্যন্ত সময়কাল।",
    },
    {
      kind: "memory-steps",
      title: "let ও const: reassignment বনাম mutation",
      code: 'let count = 1;\ncount = 2;\nconst user = { name: "Rina" };\nuser.name = "Mim";\nuser = {};',
      steps: [
        {
          line: -1,
          memory: [
            { name: "count", value: "", kind: "let", state: "tdz" },
            { name: "user", value: "", kind: "const", state: "tdz" },
          ],
          note: "Creation phase: দুটি নামই নথিভুক্ত, দুটিই TDZ তে।",
        },
        {
          line: 0,
          memory: [
            { name: "count", value: "1", kind: "let", state: "live" },
            { name: "user", value: "", kind: "const", state: "tdz" },
          ],
          note: "`count` initialize হলো — মান `1`।",
        },
        {
          line: 1,
          memory: [
            { name: "count", value: "2", kind: "let", state: "live" },
            { name: "user", value: "", kind: "const", state: "tdz" },
          ],
          note: "`let` এ reassignment বৈধ — একই binding, নতুন মান `2`।",
        },
        {
          line: 2,
          memory: [
            { name: "count", value: "2", kind: "let", state: "live" },
            { name: "user", value: '→ { name: "Rina" }', kind: "const", state: "live" },
          ],
          note: "`user` একটি object এর **reference** ধরে রাখে। object টি তৈরি হয় heap এ, `user` এ থাকে তার ঠিকানা।",
        },
        {
          line: 3,
          memory: [
            { name: "count", value: "2", kind: "let", state: "live" },
            { name: "user", value: '→ { name: "Mim" }', kind: "const", state: "live" },
          ],
          note: "এটি **mutation** — object এর ভেতরের property বদলাচ্ছে, `user` এর ঠিকানা একই আছে। তাই `const` হওয়া সত্ত্বেও এটি বৈধ।",
        },
        {
          line: 4,
          memory: [
            { name: "count", value: "2", kind: "let", state: "live" },
            { name: "user", value: '→ { name: "Mim" }', kind: "const", state: "error" },
          ],
          output: "TypeError: Assignment to constant variable.",
          note: "এটি **reassignment** — `user` কে নতুন ঠিকানায় বাঁধার চেষ্টা। `const` এটি অনুমতি দেয় না, তাই TypeError।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "const ও let এর মৌলিক ব্যবহার",
      description: "যে মান বদলাবে না তার জন্য `const`, যা বদলাবে তার জন্য `let`। Output দেখে নিজে অনুমান করুন, তারপর চালান।",
      code: `const course = "JavaScript"; // নাম কখনো বদলাবে না
let day = 1;                 // প্রতিদিন বাড়বে

day = day + 1;
day += 1;                    // shorthand

console.log(course, day);
console.log(typeof course, typeof day);`,
    },
    {
      level: "intermediate",
      title: "Block scope বনাম Function scope",
      description: "একই block এ তিনটি declaration — block এর বাইরে কোনটি দেখা যায়? লক্ষ্য করুন `typeof` কোনো undeclared নামে error দেয় না।",
      code: `function demo() {
  if (true) {
    var a = "আমি var";
    let b = "আমি let";
    const c = "আমি const";
  }

  console.log(a);          // var: function পুরোটাই scope
  console.log(typeof b);   // let: block এর বাইরে নেই
  console.log(typeof c);   // const: block এর বাইরে নেই
}

demo();`,
    },
    {
      level: "real-world",
      title: "Loop এ closure: var এর ক্লাসিক bug ও let এর সমাধান",
      description: "UI তে অনেক সময় loop চালিয়ে প্রতিটি আইটেমের জন্য handler বানানো হয়। `var` দিয়ে করলে সব handler একই `i` দেখে। `let` প্রতিটি iteration এর জন্য নতুন binding তৈরি করে।",
      code: `const handlersVar = [];
for (var i = 0; i < 3; i++) {
  handlersVar.push(() => i);
}

const handlersLet = [];
for (let j = 0; j < 3; j++) {
  handlersLet.push(() => j);
}

// handler গুলো loop শেষ হওয়ার পরে ডাকা হচ্ছে
console.log("var:", handlersVar.map((fn) => fn()));
console.log("let:", handlersLet.map((fn) => fn()));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const message = "Hello, JavaScript!";
console.log(message);
`,
    },
    {
      label: "Hoisting: var vs let",
      code: `console.log("var:", typeof hoistedVar);   // undefined (hoisted)
var hoistedVar = 1;

try {
  console.log(hoistedLet);                  // TDZ
} catch (e) {
  console.log(e.name + ": " + e.message);
}
let hoistedLet = 2;`,
    },
    {
      label: "const এর ভেতরের mutation",
      code: `const list = [1, 2, 3];
list.push(4);                // বৈধ: mutation
console.log(list);

try {
  list = [];                 // অবৈধ: reassignment
} catch (e) {
  console.log(e.name + ": " + e.message);
}

const frozen = Object.freeze({ a: 1, inner: { b: 2 } });
try {
  frozen.a = 99;             // frozen: strict mode এ TypeError (sloppy mode এ নীরবে ব্যর্থ)
} catch (e) {
  console.log(e.name + ": " + e.message);
}
frozen.inner.b = 3;          // freeze shallow — nested object বদলানো যায়
console.log(frozen);
`,
    },
    {
      label: "Shadowing ও TDZ",
      code: `const x = "বাইরের x";

function test() {
  // নিচে let x আছে, তাই এই পুরো function এ x বলতে ভেতরের x-কেই বোঝায়
  try {
    console.log(x);
  } catch (e) {
    console.log(e.name + ": " + e.message);
  }
  let x = "ভেতরের x";
  console.log(x);
}

test();`,
    },
  ],

  debugging: [
    {
      title: "ReferenceError: Cannot access 'x' before initialization",
      bad: `console.log(price);
let price = 100;`,
      why: "`let` ও `const` declaration লাইনের আগে TDZ তে থাকে। কোড লাইন ধরে চলে, তাই `console.log(price)` যখন চলে তখন `price` এখনো initialize হয়নি। `var` হলে নীরবে `undefined` print করত — এই কারণেই `let` এর error বেশি নিরাপদ।",
      fix: `let price = 100;     // আগে declare ও initialize
console.log(price);  // 100`,
    },
    {
      title: "TypeError: Assignment to constant variable",
      bad: `const total = 0;
const prices = [10, 20, 30];
for (const p of prices) {
  total = total + p;
}
console.log(total);`,
      why: "`total` কে `const` করা হয়েছে, কিন্তু loop এর ভেতরে তাকে বারবার নতুন মান দেওয়া হচ্ছে — এটি reassignment। যে variable বদলাবে সেটি `const` হতে পারে না।",
      fix: `// ১) accumulator বদলায় বলে let
let total = 0;
for (const p of [10, 20, 30]) {
  total += p;
}
console.log(total);

// ২) আরও ভালো: reassignment-ই দরকার নেই
const sum = [10, 20, 30].reduce((acc, p) => acc + p, 0);
console.log(sum);`,
    },
    {
      title: "Loop এ সবাই একই মান দেখে (var + async)",
      bad: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("i =", i), 0);
}`,
      why: "`var i` পুরো function/global scope এ **একটি মাত্র** binding। `setTimeout` এর callback গুলো loop শেষ হওয়ার পরে চলে, তখন `i` এর মান `3`। তিনটি callback একই `i` দেখছে।",
      fix: `for (let i = 0; i < 3; i++) {
  // let: প্রতিটি iteration এর জন্য নতুন i
  setTimeout(() => console.log("i =", i), 0);
}`,
    },
    {
      title: "SyntaxError: Missing initializer in const declaration",
      bad: `const apiUrl;
apiUrl = "https://example.com";`,
      why: "`const` binding পরে বদলানো যায় না, তাই declaration এর সময়ই মান দিতে হয়। এই error টি **parse** পর্যায়েই ধরা পড়ে, তাই কোডের কোনো লাইনই চলে না।",
      fix: `const apiUrl = "https://example.com";
console.log(apiUrl);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "const আর let ঠিকভাবে বসান",
      prompt: "`name` কখনো বদলাবে না আর `age` একবার বদলাবে। সঠিক keyword বসিয়ে `age` কে `26` করুন এবং `console.log(name, age)` দিয়ে `Rahim 26` print করুন।",
      starter: `// TODO: সঠিক keyword বসান
___ name = "Rahim";
___ age = 25;

// TODO: age কে 26 করুন

console.log(name, age);`,
      expected: "Rahim 26",
      hints: ["যা বদলাবে না → `const`, যা বদলাবে → `let`।", "`age = 26;` লিখলেই reassignment হয়।"],
      solution: `const name = "Rahim";
let age = 25;
age = 26;
console.log(name, age);`,
    },
    {
      level: "beginner",
      title: "TypeError ঠিক করুন",
      prompt: "নিচের কোডে `TypeError` আসছে। এক শব্দ বদলে এটি ঠিক করুন যেন `15` print হয়।",
      starter: `const score = 10;
score = score + 5;
console.log(score);`,
      expected: "15",
      hints: ["error বার্তা বলছে constant এ assign করা হয়েছে।", "`score` কে reassign করতেই হবে, তাই `const` ঠিক নয়।"],
      solution: `let score = 10;
score = score + 5;
console.log(score);`,
    },
    {
      level: "beginner",
      title: "Block scope প্রমাণ করুন",
      prompt: "block এর বাইরে `message` সত্যিই দেখা যায় না — এটি প্রমাণ করতে block এর বাইরে একটি লাইন লিখুন, যা কোনো error ছাড়া `undefined` print করবে।",
      starter: `{
  let message = "hello";
}

// TODO: block এর বাইরে এক লাইনে প্রমাণ করুন`,
      expected: "undefined",
      hints: ["সরাসরি `console.log(message)` করলে ReferenceError আসবে।", "`typeof` undeclared নামেও error দেয় না, শুধু স্ট্রিং `'undefined'` ফেরত দেয়।"],
      solution: `{
  let message = "hello";
}
console.log(typeof message);`,
      explanation: "`typeof message` এর ফল string `\"undefined\"`; `console.log` এটিকে `undefined` হিসেবে print করে (top-level string এ quote থাকে না)।",
    },
    {
      level: "intermediate",
      title: "const object এর mutation",
      prompt: "`user` কে reassign **না** করে তার `age` কে `21` করুন, তারপর পুরো `user` print করুন।",
      starter: `const user = { name: "Rina", age: 20 };

// TODO: user = ... লেখা যাবে না

console.log(user);`,
      expected: "{ name: 'Rina', age: 21 }",
      hints: ["property assign করলে binding বদলায় না।"],
      solution: `const user = { name: "Rina", age: 20 };
user.age = 21;
console.log(user);`,
    },
    {
      level: "intermediate",
      title: "Loop closure bug ঠিক করুন",
      prompt: "নিচের কোড `[ 3, 3, 3 ]` print করে। শুধু loop এর declaration বদলে `[ 0, 1, 2 ]` print করান।",
      starter: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`,
      expected: "[ 0, 1, 2 ]",
      hints: ["কোন declaration প্রতিটি iteration এ নতুন binding তৈরি করে?"],
      solution: `const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`,
      explanation: "`let` দিয়ে for loop এর প্রতিটি iteration এর জন্য `i` এর একটি আলাদা copy তৈরি হয়, প্রতিটি closure নিজের copy টি ধরে রাখে।",
    },
    {
      level: "challenge",
      title: "Real-world: Shopping cart এর হিসাব",
      prompt:
        "একটি cart এর সব item এর `price * qty` যোগ করে **Subtotal** বের করুন। Subtotal ৫০০ এর বেশি হলে ১০% **Discount**, নইলে ০। তারপর **Total** print করুন। নিয়ম: যা বদলাবে না তা `const`, যা বদলাবে শুধু তা `let`। Expected output তিন লাইন।",
      starter: `const cart = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
  { name: "Bag", price: 450, qty: 1 },
];

const DISCOUNT_RATE = 0.1;
const DISCOUNT_THRESHOLD = 500;

// TODO: subtotal, discount, total হিসাব করুন

// console.log("Subtotal:", subtotal);
// console.log("Discount:", discount);
// console.log("Total:", total);`,
      expected: "Subtotal: 600\nDiscount: 60\nTotal: 540",
      hints: ["`subtotal` loop এ বাড়ে — তাই `let`।", "`for (const item of cart)` ব্যবহার করতে পারেন — প্রতিটি iteration এ নতুন `item` binding হয়।", "`discount` একবারই নির্ধারিত হয়, ternary দিয়ে `const` রাখুন।"],
      solution: `const cart = [
  { name: "Pen", price: 10, qty: 3 },
  { name: "Book", price: 120, qty: 1 },
  { name: "Bag", price: 450, qty: 1 },
];
const DISCOUNT_RATE = 0.1;
const DISCOUNT_THRESHOLD = 500;

let subtotal = 0;
for (const item of cart) {
  subtotal += item.price * item.qty;
}

const discount = subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
const total = subtotal - discount;

console.log("Subtotal:", subtotal);
console.log("Discount:", discount);
console.log("Total:", total);`,
      explanation: "শুধু `subtotal` বদলায় বলে সেটিই `let`। বাকি সবকিছু `const` — পাঠক দেখেই বুঝবে কোন মানটি পরে বদলায়।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোডের output কী? `console.log(typeof x); var x = 5;`",
        options: ["ReferenceError", "\"undefined\"", "\"number\"", "SyntaxError"],
        answer: 1,
        explanation:
          "`var x` hoist হয় এবং creation phase এ `undefined` পায়। `x = 5` assignment চলে পরে। তাই `typeof x` হয় `\"undefined\"`। ReferenceError আসত যদি `let` হতো (TDZ)। `\"number\"` হতো যদি লাইনের ক্রম উল্টো হতো।",
      },
      {
        question: "`const arr = [1, 2]; arr.push(3);` — কী হবে?",
        options: ["`arr` হবে `[1, 2, 3]`, কোনো error নেই", "TypeError, কারণ arr const", "SyntaxError", "`arr` অপরিবর্তিত থাকবে, কোনো error নেই"],
        answer: 0,
        explanation: "`const` শুধু binding (`arr` নামটি) আটকায়। `push` array object এর ভেতরের কনটেন্ট বদলায় (mutation), arr কে নতুন কিছুতে bind করে না। তাই বৈধ।",
      },
      {
        question: "কোনগুলো **block scope** মানে?",
        options: ["শুধু `var`", "শুধু `const`", "`let` ও `const`", "`var`, `let`, `const` তিনটিই"],
        answer: 2,
        explanation: "`let` ও `const` block scoped। `var` শুধু function (বা global) scope মানে — `if`, `for` এর `{}` তাকে আটকায় না।",
      },
      {
        question: "`for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0);` কী print করবে?",
        options: ["0 1 2", "0 0 0", "undefined undefined undefined", "3 3 3"],
        answer: 3,
        explanation: "`var i` এর একটি মাত্র binding আছে। callback গুলো loop শেষে চলে, তখন `i === 3`। `let i` হলে `0 1 2` পেতেন।",
      },
      {
        question: "`let x; console.log(x);` কী print করে?",
        options: ["undefined", "ReferenceError", "null", "SyntaxError"],
        answer: 0,
        explanation: "`let x;` লাইন execute হওয়ার মুহূর্তে initializer না থাকলে `x` কে `undefined` দিয়ে initialize করা হয় (TDZ শেষ)। তাই পরের লাইনে `undefined`, error নয়। (তবে `const x;` SyntaxError।)",
      },
    ],
    coding: [
      {
        title: "বৃত্তের ক্ষেত্রফল",
        prompt: "`const PI = 3.14159` ও `let radius = 5` ব্যবহার করে ক্ষেত্রফল বের করুন এবং `toFixed(2)` দিয়ে `Area: 78.54` print করুন।",
        starter: `// TODO
`,
        expected: "Area: 78.54",
        solution: `const PI = 3.14159;
let radius = 5;
const area = PI * radius * radius;
console.log("Area: " + area.toFixed(2));`,
      },
      {
        title: "setTimeout loop ঠিক করুন",
        prompt: "নিচের কোডটি `3 3 3` print করে। শুধু একটি keyword বদলে `0`, `1`, `2` (আলাদা লাইনে) print করান।",
        starter: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
        expected: "0\n1\n2",
        solution: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
      },
    ],
  },

  interview: [
    {
      q: "`var`, `let` ও `const` এর পার্থক্য কী?",
      a: "তিনটি দিক দিয়ে বলুন: **scope**, **hoisting/TDZ**, **reassignment**।\n\n`var` function scoped, hoist হয়ে `undefined` পায়, redeclare ও reassign করা যায়। `let` block scoped, TDZ আছে, reassign করা যায় কিন্তু একই scope এ redeclare করা যায় না। `const` ও block scoped এবং TDZ আছে, কিন্তু declaration এর সময় মান দিতে হয় এবং binding reassign করা যায় না।\n\nশেষে আধুনিক নিয়মটি বলুন: ডিফল্ট `const`, দরকার হলে `let`, `var` এড়িয়ে চলুন।",
    },
    {
      q: "`let` ও `const` কি hoist হয়? Temporal Dead Zone কী?",
      a: "হ্যাঁ, hoist হয় — তবে `var` এর মতো `undefined` দিয়ে initialize হয় না। scope এ ঢোকার সময় নামটি Environment Record এ নথিভুক্ত হয় কিন্তু uninitialized থাকে। scope এর শুরু থেকে declaration লাইন পর্যন্ত সময়টিই **TDZ**; এই সময় নামটি access করলে `ReferenceError`।\n\nপ্রমাণ হিসেবে shadowing এর উদাহরণ দিন: বাইরে `x` থাকলেও ভেতরের block এ পরে `let x` থাকলে আগে `x` পড়লে ReferenceError আসে — যদি hoist না হতো, বাইরের `x` ই পাওয়া যেত।",
    },
    {
      q: "`const` কি সত্যিই immutable?",
      a: "না। `const` শুধু **binding** কে immutable করে, মানকে নয়। `const obj = {}; obj.a = 1;` বৈধ।\n\nShallow immutability এর জন্য `Object.freeze(obj)`। কিন্তু freeze **shallow** — nested object এর property তখনও বদলানো যায়। Deep freeze এর জন্য recursion বা ভিন্ন library (যেমন Immer) লাগে। আর non-strict mode এ frozen object এ লিখলে নীরবে ব্যর্থ হয়, strict mode (ES Module সহ) এ TypeError দেয়।",
    },
    {
      q: "Loop এ `var` ব্যবহার করে `setTimeout` চালালে সব `3` কেন print হয়, আর `let` কীভাবে সমাধান করে?",
      a: "`var i` পুরো function এ একটি মাত্র variable। তিনটি callback ই সেই একই `i` কে **closure** হিসেবে ধরে রাখে। callback গুলো চলে loop শেষে, তখন `i === 3`।\n\n`for (let i …)` এ spec অনুযায়ী প্রতিটি iteration এ `i` এর একটি **নতুন binding** তৈরি হয় এবং আগের মান সেখানে copy হয়। তাই প্রতিটি callback নিজের iteration এর `i` দেখে। (পুরোনো কোডে সমাধান ছিল IIFE দিয়ে নতুন scope বানানো।)",
    },
    {
      q: "`var` কি এখনো কখনো ব্যবহার করা উচিত?",
      a: "নতুন কোডে প্রায় কখনো না। `let`/`const` সবকিছুই করতে পারে, কিন্তু বেশি নিরাপদভাবে। `var` চেনা দরকার legacy কোড পড়া ও ইন্টারভিউয়ের জন্য। কিছু পুরোনো bundler বা `<script>` এ global এ property যোগ করতে `var` ব্যবহার হতো — আজ সেটির জন্য `globalThis.x = ...` স্পষ্টভাবে লেখাই ভালো অভ্যাস।",
    },
    {
      q: "`typeof` কি TDZ তে থাকা variable এও নিরাপদ?",
      a: "না। `typeof undeclaredName` নিরাপদ (`\"undefined\"` দেয়), কিন্তু TDZ তে থাকা `let`/`const` নামে `typeof` ও ReferenceError ছোড়ে — কারণ নামটি declared, শুধু uninitialized। ES2015 এর আগে `typeof` সবসময় নিরাপদ ছিল, তাই এটি একটি পরিচিত edge case।",
    },
  ],

  summary: {
    takeaways: [
      "ডিফল্ট `const`, বদলাতে হলে `let`, `var` নয়।",
      "`let`/`const` block scoped; `var` function scoped।",
      "`var` hoist হয়ে `undefined` পায়; `let`/`const` hoist হয়ে **TDZ** এ থাকে।",
      "`const` binding আটকায়, object এর ভেতরের mutation আটকায় না (`Object.freeze` shallow)।",
      "Loop এ `let` প্রতিটি iteration এ নতুন binding বানায় — closure bug এর সমাধান।",
      "Browser এর classic script এর top-level `var` global object এ যায়; module ও Node.js এ যায় না।",
    ],
    syntax: `const PI = 3.14159;          // reassign হবে না
let count = 0;               // reassign হবে
count += 1;

for (let i = 0; i < 3; i++) {}   // প্রতি iteration এ নতুন i
for (const item of [1, 2]) {}    // প্রতি iteration এ নতুন const

const obj = Object.freeze({ a: 1 });  // shallow freeze`,
    whenToUse: [
      "কোনো নাম পরে বদলাবে না → `const` (object/array হলেও)।",
      "Counter, accumulator, state যা বারবার বদলায় → `let`।",
      "`for...of` / `for...in` এর element → `const`।",
      "পুরোনো কোড maintain করার সময় ছাড়া `var` নয়।",
    ],
    next: ["Data Types — primitive ও reference type", "Primitive vs Reference Types — `const` এর mutation এর গভীর কারণ", "Scope Chain ও Closures (Functions module)", "Hoisting ও Temporal Dead Zone (Advanced module, গভীর আলোচনা)"],
  },

  compatibility:
    "`let`/`const` ES2015 এর অংশ — সব আধুনিক browser ও Node.js এ কাজ করে (Node 6+)। এই lesson এর সব কোড browser ও Node.js এ একই ফল দেয়, শুধু top-level `var` এর global object আচরণ আলাদা (ওপরের table দেখুন)। এই Playground browser-like Web Worker এ চলে।",
};
