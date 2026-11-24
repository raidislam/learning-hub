import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`call`, `apply`, `bind` এর signature ও পার্থক্য (কখন চালায়, argument কীভাবে নেয়, কী ফেরত দেয়) নিজে ব্যাখ্যা করতে পারবেন।",
    "`this` Keyword lesson এর explicit binding rule কে বাস্তবে প্রয়োগ করে lost-this bug ঠিক করতে পারবেন।",
    "`bind` দিয়ে **partial application**, এবং bound function এর বিশেষ আচরণ (আবার rebind করা যায় না, `new` এ `this` উপেক্ষিত) বুঝবেন।",
    "Method borrowing ও `Math.max.apply` এর মতো legacy pattern চিনবেন এবং আধুনিক বিকল্প (spread, `Array.from`, `Object.hasOwn`) ব্যবহার করবেন।",
    "Arrow function কেন `thisArg` উপেক্ষা করে — নিজে প্রমাণ করতে এবং `bind` এর polyfill নিজে লিখতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "সমস্যাটা কী? ‘function টি চালাও, কিন্তু this আমি ঠিক করে দেব’" },
    {
      type: "p",
      text: "`this` Keyword lesson এ দেখেছি `this` ঠিক হয় call এর সময়, এবং plain call এ (`f()`) `this` হারিয়ে যায়। কখনো আমরা চাই function টি এক object এ লেখা থাকুক কিন্তু অন্য object এর `this` নিয়ে চলুক; কখনো চাই `this` একবার স্থায়ীভাবে ঠিক করে রাখতে। JavaScript এর সব function (`Function.prototype` এ) তিনটি method দেয় এই কাজের জন্য: **`call`**, **`apply`** ও **`bind`**। এরা এই জন্য ‘explicit binding’ — আপনি নিজে স্পষ্ট করে `this` দিচ্ছেন।",
    },
    { type: "h3", text: "তিনটির signature" },
    {
      type: "code",
      caption: "তিনটিতেই প্রথম argument `thisArg` — function এর ভেতরে `this` যা হবে।",
      code: `fn.call(thisArg, a, b);        // এখনই চালায়, argument আলাদা আলাদা
fn.apply(thisArg, [a, b]);     // এখনই চালায়, argument একটি array (বা array-like) তে
const g = fn.bind(thisArg, a); // চালায় না! নতুন function ফেরত দেয়
g(b);                          // এখন চালালে fn এর this = thisArg, argument = (a, b)`,
    },
    {
      type: "compare",
      headers: ["", "`call`", "`apply`", "`bind`"],
      rows: [
        ["কখন চালায়?", "তৎক্ষণাৎ", "তৎক্ষণাৎ", "**চালায় না** — নতুন function দেয়"],
        ["Argument", "আলাদা: `call(t, a, b)`", "array: `apply(t, [a, b])`", "preset: `bind(t, a, b)`, বাকিগুলো পরে call এ"],
        ["ফেরত দেয়", "function এর return value", "function এর return value", "নতুন **bound function**"],
        ["`this` স্থায়ী?", "শুধু ওই একটি call এ", "শুধু ওই একটি call এ", "হ্যাঁ, bound function এর সারাজীবন"],
        ["সাধারণ ব্যবহার", "method borrowing, `this` দিয়ে এক-বার চালানো", "argument আগে থেকে array তে থাকলে (legacy)", "callback/handler পাঠানো, partial application"],
      ],
    },
    {
      type: "p",
      text: "মনে রাখার সহজ কৌশল: **A**pply = **A**rray; **C**all = **C**omma-separated; **B**ind = **B**ound করে ‘পরে চালাব’। আধুনিক কোডে `apply` এর array-নেওয়ার সুবিধাটি spread (`fn.call(t, ...arr)`) দিয়েই পাওয়া যায়, তাই `apply` এখন মূলত পুরোনো কোডে দেখা যায়।",
    },
    { type: "h3", text: "ভেতরে কী ঘটে (মানসিক মডেল)" },
    {
      type: "p",
      text: "`fn.call(obj, 1, 2)` কে আপনি ‘`obj` এর একটি অস্থায়ী method হিসেবে `fn` কে চালানো’ ভাবতে পারেন — যেন `obj.fn(1, 2)` লিখেছেন কিন্তু `obj` এ আসলে `fn` property যোগ না করেই। Spec অনুযায়ী `call` function এর internal `[[Call]]` কে সরাসরি `thisArg` ও argument list দিয়ে চালায়। `apply` একই, শুধু argument list টি array-like object থেকে বানিয়ে নেয়। `bind` একটি নতুন **bound function exotic object** তৈরি করে, যার ভেতরে তিনটি তথ্য জমা থাকে: লক্ষ্য function, বাঁধা `this`, এবং preset argument গুলো। Bound function call হলে সেই preset argument এর পরে নতুন argument যোগ করে লক্ষ্য function কে বাঁধা `this` দিয়ে চালায়।",
    },
    {
      type: "p",
      text: "Bound function এর `name` হয় `\"bound \" + আসল নাম` এবং `length` হয় আসল `length` থেকে preset argument এর সংখ্যা বাদ (সর্বনিম্ন ০)। (Example 1 এ দেখুন।)",
    },
    { type: "h3", text: "`bind` এর বিশেষ নিয়ম" },
    {
      type: "ul",
      items: [
        "**আবার rebind হয় না।** `const f = fn.bind(a); f.call(b)` বা `f.bind(b)()` তেও `this` থাকে `a`। প্রথম `bind` ই চূড়ান্ত। (Preset argument গুলো কিন্তু জমতে থাকে — পরের `bind` এর preset আগের পরে বসে।)",
        "**`new` bound `this` কে হারায়।** `new boundFn()` করলে বাঁধা `this` উপেক্ষিত হয়, নতুন object টিই `this` হয় — কিন্তু preset argument গুলো তখনও প্রযোজ্য। এই কারণে precedence এ `new` সবার ওপরে।",
        "**`bind` মূল function বদলায় না।** এটি সবসময় নতুন function ফেরত দেয়; `fn.bind(x) !== fn`। প্রতিবার `bind` করলে নতুন function object তৈরি হয়।",
        "**Arrow function এর ওপর `bind(thisArg)` এর `this` অংশটি অকার্যকর** — কিন্তু preset argument অংশটি ঠিকই কাজ করে (নিচে দেখুন)।",
      ],
    },
    { type: "h3", text: "Partial application: `bind` দিয়ে argument আগে ভরে রাখা" },
    {
      type: "p",
      text: "`bind` এর প্রথম argument এর পর যা দেবেন সেগুলো bound function এর **শুরুর argument** হয়ে যায়। একে partial application বলে: বহু-argument function থেকে কম-argument এর বিশেষায়িত function বানানো, যেমন `const double = multiply.bind(null, 2)`। যখন `this` লাগে না তখন `thisArg` হিসেবে `null` বা `undefined` দেওয়া প্রচলিত। (শুধু ‘শুরুর’ argument বাঁধা যায়; মাঝখানের বা শেষের argument এর জন্য closure বা arrow লিখতে হয়।) আধুনিক কোডে এক-লাইনের arrow (`(b) => multiply(2, b)`) প্রায়ই বেশি পাঠযোগ্য; `bind` তখন ভালো যখন `this` ও বাঁধতে হবে।",
    },
    { type: "h3", text: "Method borrowing ও legacy pattern" },
    {
      type: "p",
      text: "Method borrowing মানে এক object এর method কে অন্য object এর ওপর চালানো, যে object এর সেই method নেই। সবচেয়ে বিখ্যাত উদাহরণ: array-like object (`arguments`, পুরোনো `NodeList`, `{ 0: 'a', length: 1 }`) এ `Array.prototype.slice.call(arrayLike)` — যেহেতু array এর অনেক method শুধু `length` ও সংখ্যা-ইনডেক্স দেখে, তাই সেগুলো যেকোনো array-like এ চলে। আর `Math.max.apply(null, nums)` এসেছিল ‘array কে separate argument এ ভাঙতে’ spread আসার আগে।",
    },
    {
      type: "compare",
      headers: ["পুরোনো (legacy) পদ্ধতি", "আধুনিক বিকল্প", "মন্তব্য"],
      rows: [
        ["`Array.prototype.slice.call(arguments)`", "rest parameter `(...args)` বা `Array.from(arguments)`", "নতুন কোডে `arguments` এড়ান; rest দিন"],
        ["`Math.max.apply(null, nums)`", "`Math.max(...nums)`", "অত্যন্ত বড় array তে দুটোতেই argument সীমা (engine-নির্ভর) ছাড়ানোর ঝুঁকি আছে; সে ক্ষেত্রে `reduce`"],
        ["`Array.prototype.push.apply(a, b)`", "`a.push(...b)`", "একই সীমার সাবধানতা"],
        ["`Object.prototype.hasOwnProperty.call(o, k)`", "`Object.hasOwn(o, k)` (ES2022)", "prototype-নেই object এ (`Object.create(null)`) এ `o.hasOwnProperty` ই নেই"],
        ["`const self = this;` / `fn.bind(this)` callback এ", "arrow function", "lexical `this`"],
      ],
    },
    {
      type: "p",
      text: "তবে `Object.prototype.toString.call(value)` এখনও একটি বৈধ, ব্যবহারিক কৌশল — এটি `[object Array]`, `[object Null]` ইত্যাদি ফেরত দেয়, যা `typeof` দিয়ে পাওয়া যায় না (সাধারণত `Array.isArray` ও `=== null` বেশি পাঠযোগ্য, তবু কোডবেসে এটি পাবেন)।",
    },
    { type: "h3", text: "`thisArg` কিছু ক্ষেত্রে উপেক্ষিত বা বদলে যায়" },
    {
      type: "ul",
      items: [
        "**Arrow function:** `call`/`apply`/`bind` এর `thisArg` সম্পূর্ণ উপেক্ষিত — কারণ arrow এর নিজস্ব `this` নেই। (Argument গুলো কিন্তু ঠিকই যায়।) Debugging ও Playground এ নিজে প্রমাণ করুন।",
        "**Strict mode এ `null`/`undefined` thisArg:** `this` হুবহু `null`/`undefined` ই থাকে। Sloppy mode এ সেগুলো `globalThis` এ বদলে যায় এবং primitive গুলো wrapper object এ boxed হয় (`fn.call(5)` এ `typeof this === 'object'`)। এই sandbox strict, তাই এখানে `fn.call(5)` এ `typeof this === 'number'`।",
        "**`null` পাঠানো নিরাপদ** যদি function এর ভেতরে `this` ব্যবহারই না হয় (`Math.max.apply(null, arr)`, `add.bind(null, 10)`)। `this` ব্যবহার হলে `null` দিলে strict এ `TypeError`, sloppy এ global এ পড়া/লেখা।",
      ],
    },
    { type: "h3", text: "Lost-this ঠিক করা: bind বনাম বিকল্প" },
    {
      type: "p",
      text: "`const f = counter.inc; f()` এর মতো lost-this এ `counter.inc.bind(counter)` সবচেয়ে সরাসরি সমাধান: handler টি যেখানেই যাক (timer, event emitter, অন্য module) `this` স্থির। বিকল্প arrow wrapper `() => counter.inc()` (call-site এ dot থাকে) ও class field arrow। কোনটি ভালো তা প্রসঙ্গ নির্ভর: `bind` একটি নামযুক্ত function ফেরত দেয় যা বহুবার পাঠানো যায় এবং preset argument দেয়; arrow wrapper সাধারণত বেশি পাঠযোগ্য এবং উপাদান আলাদা (`counter.inc` মুছে গেলে বা বদলে গেলেও call সময়ে সর্বশেষ মান নেয়, যেখানে `bind` bind-এর সময়কার function টি ধরে রাখে)।",
    },
    {
      type: "p",
      text: "**React class component এর ইতিহাস:** পুরোনো React এ `onClick={this.handleClick}` এ `this` হারাত, তাই constructor এ `this.handleClick = this.handleClick.bind(this)` লেখা প্রায় আচারে পরিণত হয়েছিল — এভাবে প্রতিটি instance এ একবারই bound function তৈরি হতো (render এর ভেতরে `onClick={this.handleClick.bind(this)}` লিখলে প্রতি render এ নতুন function তৈরি হয়, যা ছোট-সমস্যা বা memoization এ বাধা হতে পারত)। পরে class field arrow এই পুনরাবৃত্তি সরিয়েছে, আর hooks এসে `this` কেই সরিয়ে দিয়েছে। এখন legacy কোড পড়া ও library callback বুঝতেই এই জ্ঞান প্রয়োজন।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Performance ও পাঠযোগ্যতা (সাবধানে পড়ুন)",
      text: "আধুনিক engine গুলো `call`/`apply`/`bind` খুব ভালো optimize করে (সাধারণত), তাই সাধারণ UI/backend কোডে এদের খরচ নিয়ে চিন্তা করার দরকার নেই — বরং পাঠযোগ্যতা দেখুন। `bind` প্রতিবার নতুন function object বানায়: hot loop বা বহু-হাজার instance এ প্রতিবার `bind` করলে memory ও GC চাপ বাড়তে পারে। Performance নিয়ে সিদ্ধান্ত নেওয়ার আগে নিজের workload এ মাপুন; ‘`bind` ধীর’ জাতীয় সাধারণ সিদ্ধান্ত engine ও সংস্করণ ভেদে বদলায়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Common misconceptions",
      text: "**(১)** ‘`call` ও `apply` ভিন্ন কাজ করে’ — না, শুধু argument পাঠানোর ধরন ভিন্ন। **(২)** ‘`bind` function টি চালায়’ — না, নতুন function ফেরত দেয়; `bind` লিখে `()` ভুলে গেলে কিছুই চলে না। **(৩)** ‘`bind` করা function কে `call` দিয়ে অন্য `this` দেওয়া যায়’ — না। **(৪)** ‘Arrow function এ `bind` দিলে `this` বদলায়’ — না। **(৫)** ‘`bind` মূল function এর `this` বদলে দেয়’ — না, মূল function অপরিবর্তিত, নতুন একটি function তৈরি হয়।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "নিরাপত্তা: `apply` এ untrusted array ও dynamic dispatch",
      text: "`fn.apply(this, userControlledArray)` বা `obj[userInput].call(...)` এ argument বা method-নাম ব্যবহারকারী নিয়ন্ত্রণ করলে অপ্রত্যাশিত function চলতে পারে বা অত্যন্ত বড় array তে engine এর argument সীমা ছাড়িয়ে `RangeError` এ service ক্র্যাশ করতে পারে। Allow-list দিয়ে method নির্বাচন করুন, argument এর সংখ্যা সীমিত করুন এবং বাইরের input থেকে আসা মানকে সরাসরি `thisArg` বানাবেন না।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "আবার সেই ছাপানো **চিঠির টেমপ্লেটের** ছবিটি ভাবুন: ‘প্রিয় ____, আপনার অর্ডার ____ তারিখে পৌঁছাবে।’ টেমপ্লেট = function; প্রথম ফাঁকা (নাম) = `this`; দ্বিতীয় ফাঁকা = argument।",
    },
    {
      type: "ul",
      items: [
        "**`call(thisArg, a)`** — আপনি টেমপ্লেট হাতে নিয়ে, মুখে বলে দিচ্ছেন ‘নাম: করিম, তারিখ: ১০ই’ এবং **এখনই ছাপিয়ে** ফেলছেন। ছাপানো চিঠি (return value) হাতে আসে।",
        "**`apply(thisArg, [a])`** — একই, কিন্তু আপনি ফাঁকা ঘরের তথ্যগুলো একটি **খামে (array)** ভরে দিচ্ছেন; ছাপাখানা খাম খুলে তথ্য বসায়। এখনই ছাপা হয়।",
        "**`bind(thisArg, a)`** — আপনি ছাপাখানাকে আজ ছাপাতে বলছেন না; বরং টেমপ্লেটের একটি **নতুন কপি** বানাচ্ছেন যেখানে নাম (`this`) ও প্রথম তথ্য আগেই কালি দিয়ে লেখা। ওই কপি যে কেউ পরে যেকোনো সময় নিয়ে বাকি ফাঁকা ঘর পূরণ করে ছাপাতে পারে। **কপির নাম সিলমোহর হয়ে গেছে** — তাই অন্য কেউ এসে ‘এটা রিনার নামে ছাপো’ বললেও কালি বদলায় না (rebind হয় না)।",
        "**Method borrowing** — রিনার অফিসের একটি দক্ষ ‘সারাংশ-লেখার’ পদ্ধতি আপনি করিমের ফাইলে চালাচ্ছেন, যদিও পদ্ধতিটি করিমের নয়। কাজ করে কারণ পদ্ধতিটি শুধু ফাইলে ‘পৃষ্ঠার সংখ্যা ও ক্রমিক নম্বর’ চায় (`length` ও index) — এটিই array-like।",
        "**Arrow function** — চিঠিতে আগেই ছাপা ‘এই বিভাগের প্রধানের নাম’; কেউ মুখে নাম বলুক (`call`) বা কালি দিক (`bind`), ছাপা নাম বদলায় না।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "call, apply ও bind: ‘এখনই চালাও’ বনাম ‘নতুন function বানাও’",
      caption: "`call`/`apply` সরাসরি target চালায়; `bind` মাঝখানে একটি bound function তৈরি করে যা পরে target কে চালায়।",
      nodes: [
        { id: "target", label: "target fn", sub: "আসল function" },
        { id: "call", label: "call / apply", sub: "এখনই" },
        { id: "bind", label: "bind", sub: "পরে" },
        { id: "bound", label: "bound fn", sub: "নতুন function" },
        { id: "run", label: "চলছে", sub: "this + args" },
      ],
      steps: [
        {
          active: ["target"],
          items: { target: ["function intro(g, p) {", "  return g + this.name + p }"] },
          note: "আসল function `intro`। তার `this` ও argument call এর সময় ঠিক হবে — এখনো কিছু চলেনি।",
        },
        {
          active: ["target", "call", "run"],
          items: {
            call: ["intro.call(rina, 'Hi', '!')", "intro.apply(rina, ['Hi', '!'])"],
            run: ["this = rina", "args = ('Hi', '!')", "→ ফল সাথে সাথে ফেরত"],
          },
          note: "**`call`/`apply`:** আপনি `this` ও argument দিলেন, engine সাথে সাথে target চালিয়ে ফল ফেরত দিল। শুধু argument এর পাঠানোর ধরন আলাদা: comma দিয়ে অথবা array তে। এই call এর পর `this` এর আর কোনো প্রভাব বাকি থাকে না।",
        },
        {
          active: ["target", "bind", "bound"],
          items: {
            bind: ["intro.bind(rina, 'Hi')", "চালায় না!"],
            bound: ["[[Target]] = intro", "[[BoundThis]] = rina", "[[BoundArgs]] = ['Hi']"],
          },
          note: "**`bind`:** target চালানো হলো না। বদলে engine একটি নতুন **bound function** তৈরি করল, যার ভেতরে target, বাঁধা `this` ও preset argument জমা। এটি একটি সাধারণ function এর মতো যেকোনো জায়গায় পাঠানো যায়।",
        },
        {
          active: ["bound", "target", "run"],
          items: {
            bound: ["hello('!')   // পরে, যেকোনো জায়গা থেকে"],
            run: ["this = rina (বাঁধা)", "args = ('Hi', '!')  // preset + নতুন", "→ intro চলল"],
          },
          note: "**পরে call:** bound function ডাকলে সে preset argument এর **পরে** নতুন argument যোগ করে target কে বাঁধা `this` দিয়ে চালায়। Call-site এ আপনি যা-ই করুন (`.call(other)`, `obj.hello()`), বাঁধা `this` বদলায় না।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Bound function কে rebind করার চেষ্টা কেন ব্যর্থ হয়",
      caption: "একবার bind হলে `this` স্থির; শুধু `new` ই তাকে উপেক্ষা করতে পারে।",
      nodes: [
        { id: "fa", label: "fa = show.bind(a)", sub: "bound #1" },
        { id: "try", label: "rebind চেষ্টা", sub: "call / bind" },
        { id: "new", label: "new fa()", sub: "constructor" },
        { id: "this", label: "this = ?", sub: "ফলাফল" },
      ],
      steps: [
        {
          active: ["fa", "this"],
          items: { fa: ["BoundThis = a"], this: ["fa() → this = a"] },
          note: "`fa` তৈরি হলো, ভেতরে `BoundThis = a`। সরাসরি `fa()` এ `this = a`।",
        },
        {
          active: ["fa", "try", "this"],
          items: {
            try: ["fa.call(b)", "fa.apply(b)", "fa.bind(b)()"],
            this: ["তিনটিতেই this = a", "(thisArg উপেক্ষিত)"],
          },
          note: "`call(b)` বা `bind(b)` করলেও bound function এর ভেতরের `BoundThis` কেউ ছোঁয় না — সে আসল target কে সবসময় `a` দিয়েই চালায়। প্রথম `bind` ই চূড়ান্ত।",
        },
        {
          active: ["fa", "new", "this"],
          items: {
            new: ["new fa()  (fa যদি constructor হয়)"],
            this: ["this = নতুন object", "BoundThis উপেক্ষিত", "BoundArgs তবু প্রযোজ্য"],
          },
          note: "`new` এর precedence সবচেয়ে বেশি: bound function এ `new` দিলে বাঁধা `this` বাতিল, নতুন object ই `this`। তবে preset argument আগের মতোই যোগ হয়। এই কারণেই `bind` এর polyfill এ `this instanceof bound` পরীক্ষা লাগে।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "call, apply, bind: একই function, তিন পথ",
      description: "একই `intro` function কে `call`, `apply` ও `bind` দিয়ে চালানো। সাথে bound function এর `name` ও `length` দেখুন।",
      code: `function intro(greeting, punct) {
  return greeting + ", I am " + this.name + punct;
}

const rina = { name: "Rina" };

console.log(intro.call(rina, "Hello", "!"));      // argument আলাদা
console.log(intro.apply(rina, ["Hi", "."]));      // argument array তে

const hello = intro.bind(rina, "Hey");            // চালায় না, নতুন function
console.log(hello("?"));                          // preset "Hey" + নতুন "?"

console.log(typeof hello, hello.name, hello.length);   // length = 2 - 1 preset
console.log(hello === intro);                     // নতুন function`,
    },
    {
      level: "intermediate",
      title: "bind: rebind হয় না, new এ উপেক্ষিত, partial application",
      description: "Bound function এর তিনটি বৈশিষ্ট্য: `this` স্থায়ী, `new` তাকে হারায়, এবং preset argument দিয়ে বিশেষায়িত function।",
      code: `function show() {
  return this.id;
}
const a = { id: "a" };
const b = { id: "b" };

const fa = show.bind(a);
console.log(fa(), fa.call(b), fa.bind(b)());     // তিনটিই a — rebind হয় না

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const PointAt0 = Point.bind(a, 0);               // this=a, x=0 preset
const p = new PointAt0(5);                       // new, bound this কে উপেক্ষা করে
console.log(p.x, p.y, p instanceof Point, p.id);

const multiply = (x, y) => x * y;
const double = multiply.bind(null, 2);           // arrow এ this অপ্রাসঙ্গিক, preset কাজ করে
const triple = multiply.bind(null, 3);
console.log(double(7), triple(7));`,
    },
    {
      level: "real-world",
      title: "Method borrowing ও আধুনিক বিকল্প পাশাপাশি",
      description: "পুরোনো কোডে যা দেখবেন (`slice.call`, `Math.max.apply`, `hasOwnProperty.call`) এবং আজকের কোডে যা লিখবেন (`Array.from`, spread, `Object.hasOwn`)।",
      code: `// array-like: index + length আছে, কিন্তু Array নয়
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
console.log(typeof arrayLike.map);                   // array এর map নেই

// legacy: Array এর method ধার করা
console.log(Array.prototype.slice.call(arrayLike, 1));
console.log(Array.prototype.map.call(arrayLike, (x) => x.toUpperCase()));

// modern
console.log(Array.from(arrayLike).slice(1));
console.log(Array.from(arrayLike, (x) => x.toUpperCase()));

// array কে separate argument এ ভাঙা
const nums = [4, 9, 2];
console.log(Math.max.apply(null, nums));             // legacy
console.log(Math.max(...nums));                      // modern

// prototype ছাড়া object এ hasOwnProperty নেই
const bare = Object.create(null);
bare.k = 1;
console.log(typeof bare.hasOwnProperty);
console.log(Object.prototype.hasOwnProperty.call(bare, "k"));   // legacy
console.log(Object.hasOwn(bare, "k"));                          // modern (ES2022)

// type tag: এখনও দরকারে লাগে
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call(null));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function who(greeting) {
  return greeting + ", " + this.name;
}
console.log(who.call({ name: "Rina" }, "Hello"));
`,
    },
    {
      label: "Arrow function thisArg উপেক্ষা করে (প্রমাণ)",
      code: `function outer() {
  // arrow টি এখানে লেখা, তাই এর this = outer এর this
  const arrow = () => this.id;
  return arrow;
}

const f = outer.call({ id: "outer" });      // outer এর this = { id: 'outer' }

console.log(f());                           // outer
console.log(f.call({ id: "call" }));        // এখনও outer
console.log(f.apply({ id: "apply" }));      // এখনও outer
console.log(f.bind({ id: "bind" })());      // এখনও outer

// তুলনা: regular function এ call কাজ করে
function regular() {
  return this.id;
}
console.log(regular.call({ id: "call" }));`,
    },
    {
      label: "null / undefined thisArg (strict mode)",
      code: `function whoIsThis() {
  return this;
}

console.log(whoIsThis.call(null));
console.log(whoIsThis.call(undefined));
console.log(whoIsThis.call(0));
console.log(typeof whoIsThis.call("text"));   // strict: primitive boxed হয় না

// this ব্যবহার না হলে null নিরাপদ
console.log(Math.max.apply(null, [1, 5, 3]));

// this ব্যবহার হলে null এ error
function needsThis() {
  return this.value;
}
try {
  needsThis.call(null);
} catch (e) {
  console.log(e.name);
}`,
    },
    {
      label: "Partial application ও argument ক্রম",
      code: `function log(level, source, message) {
  console.log("[" + level + "] " + source + ": " + message);
}

const logError = log.bind(null, "ERROR");
const logAuthError = logError.bind(null, "auth");   // preset জমে: (ERROR, auth, ...)

logError("db", "connection lost");
logAuthError("token expired");

// শুধু শুরুর argument বাঁধা যায়; শেষেরটি বাঁধতে closure
const logDisk = (msg) => log("WARN", "disk", msg);
logDisk("90% full");

console.log(logAuthError.name, logAuthError.length);`,
    },
    {
      label: "bind এর সহজ polyfill (new ছাড়া)",
      code: `// সরল সংস্করণ: this + preset argument; new support নেই (Challenge এ পূর্ণ সংস্করণ লিখুন)
function simpleBind(fn, thisArg, ...preset) {
  return function (...args) {
    return fn.apply(thisArg, [...preset, ...args]);
  };
}

function greet(greeting, name) {
  return greeting + ", " + name + " from " + this.city;
}

const dhaka = simpleBind(greet, { city: "Dhaka" }, "Hello");
console.log(dhaka("Rina"));
console.log(dhaka.call({ city: "Other" }, "Karim"));   // rebind হচ্ছে না`,
    },
  ],

  debugging: [
    {
      title: "Math.max.call এ array পাঠানো: NaN",
      bad: `const scores = [40, 90, 70];
console.log(Math.max.call(null, scores));`,
      why: "`call` এ argument আলাদা আলাদা দিতে হয়। এখানে পুরো array টি **একটি** argument হিসেবে গেছে; `Math.max` সেটিকে number এ রূপান্তর করার চেষ্টা করে (`'40,90,70'` → `NaN`) এবং ফল `NaN`। Array কে ভেঙে পাঠাতে `apply` বা spread লাগে।",
      fix: `const scores = [40, 90, 70];
console.log(Math.max.apply(null, scores));   // legacy
console.log(Math.max.call(null, ...scores)); // call + spread
console.log(Math.max(...scores));            // আধুনিক ও সবচেয়ে সরল`,
    },
    {
      title: "bind কে call করতে ভুলে যাওয়া",
      bad: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const message = user.greet.bind(user);
console.log("type:", typeof message, "| is string:", typeof message === "string");`,
      why: "`bind` function টি **চালায় না**, নতুন function ফেরত দেয়। `message` এ তাই function, string নয়। শেষে `()` দিয়ে চালাতে হবে। (UI তে এভাবে `onClick={fn.bind(x)}` ঠিক আছে — কারণ সেখানে function টি দরকার; কিন্তু ফলাফল দরকার হলে `call` বা bound function এ `()`।)",
      fix: `const user = {
  name: "Rina",
  greet() {
    return "Hi, " + this.name;
  },
};

const greetFn = user.greet.bind(user);
const message = greetFn();                 // এখন চালানো হলো
console.log("type:", typeof message, "| is string:", typeof message === "string");
console.log(message);`,
    },
    {
      title: "Bound function কে অন্য this দিয়ে চালানোর চেষ্টা",
      bad: `function show() {
  return this.id;
}
const a = { id: "a" };
const b = { id: "b" };

const f = show.bind(a);
console.log(f.call(b));    // b আশা করেছিলাম`,
      why: "প্রথম `bind` এ `this` চূড়ান্তভাবে `a` এ বাঁধা হয়ে গেছে; পরের `call(b)` সেটি বদলাতে পারে না, তাই `a` print হয়। `this` পরে বদলানোর সম্ভাবনা রাখতে চাইলে আগেই `bind` করবেন না — আসল (unbound) function কে সংরক্ষণ করুন এবং দরকারে তাতে `call` করুন।",
      fix: `function show() {
  return this.id;
}
const a = { id: "a" };
const b = { id: "b" };

// আসল (unbound) function এ call
console.log(show.call(b));   // b
console.log(show.call(a));   // a`,
    },
    {
      title: "Arrow function এ call দিয়ে this বদলানোর চেষ্টা",
      bad: `function setup() {
  const greet = () => "Hi, " + (this && this.name);
  return greet.call({ name: "Karim" });
}

console.log(setup.call({ name: "Rina" }));   // Karim আশা করেছিলাম`,
      why: "Arrow এর নিজস্ব `this` নেই — সে `setup` এর `this` (`Rina`) ব্যবহার করে, এবং `call` এর `thisArg` উপেক্ষা করে। আপনি যদি `call` দিয়ে `this` বদলাতে চান, function টি অবশ্যই regular `function` হতে হবে।",
      fix: `function setup() {
  function greet() {                       // regular function: call কাজ করে
    return "Hi, " + (this && this.name);
  }
  return greet.call({ name: "Karim" });
}

console.log(setup.call({ name: "Rina" }));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "apply দিয়ে array থেকে সর্বোচ্চ মান",
      prompt: "`Math.max(numbers)` `NaN` দেয়। `apply` ব্যবহার করে `numbers` থেকে সর্বোচ্চ মান `9` print করুন।",
      starter: `const numbers = [3, 9, 4];

// TODO: apply ব্যবহার করুন
console.log(Math.max(numbers));`,
      expected: "9",
      hints: ["`apply` এর দ্বিতীয় argument একটি array।", "`Math.max` এ `this` লাগে না, তাই `thisArg` হবে `null`।"],
      solution: `const numbers = [3, 9, 4];

console.log(Math.max.apply(null, numbers));`,
      explanation: "`apply(null, numbers)` array টিকে `Math.max(3, 9, 4)` এর মতো আলাদা argument এ ভেঙে দেয়। আধুনিক সমতুল্য: `Math.max(...numbers)`।",
    },
    {
      level: "beginner",
      title: "Method borrowing: array-like এ join",
      prompt: "`arrayLike` একটি সাধারণ object, তাই `.join` নেই। `Array.prototype.join` ধার করে `-` দিয়ে জুড়ে `a-b-c` print করুন।",
      starter: `const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

// TODO
console.log(___);`,
      expected: "a-b-c",
      hints: ["`Array.prototype.join.call(arrayLike, ...)`।", "`join` এর argument হলো separator string।"],
      solution: `const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

console.log(Array.prototype.join.call(arrayLike, "-"));`,
      explanation: "`join` শুধু `this.length` ও `this[0]`, `this[1]`… পড়ে — তাই `length` ও index থাকা যেকোনো object এ চলে। এটিই method borrowing এর মূল।",
    },
    {
      level: "beginner",
      title: "bind দিয়ে logger বিশেষায়িত করা",
      prompt: "`log(level, msg)` থেকে `bind` দিয়ে `logError` বানান, যা `level` কে `[ERROR]` দিয়ে preset করে। `logError(\"disk full\")` এ `[ERROR] disk full` print হবে।",
      starter: `function log(level, msg) {
  console.log(level + " " + msg);
}

const logError = undefined;   // TODO

logError("disk full");`,
      expected: "[ERROR] disk full",
      hints: ["`bind` এর প্রথম argument `thisArg` (এখানে `null`), তারপর preset।", "`log.bind(null, \"[ERROR]\")`।"],
      solution: `function log(level, msg) {
  console.log(level + " " + msg);
}

const logError = log.bind(null, "[ERROR]");

logError("disk full");`,
      explanation: "`log.bind(null, '[ERROR]')` এমন নতুন function যার প্রথম argument সবসময় `'[ERROR]'`। এটিই partial application।",
    },
    {
      level: "intermediate",
      title: "bind দিয়ে method কে map এর callback বানান",
      prompt: "`player.add` কে `map` এ plain callback হিসেবে পাঠালে `this` হারায়। `bind` ব্যবহার করে `addToPlayer` বানিয়ে `[ 1, 3, 6 ]` print করুন।",
      starter: `const player = {
  points: 0,
  add(n) {
    this.points += n;
    return this.points;
  },
};

const addToPlayer = player.add;   // TODO: ঠিক করুন

console.log([1, 2, 3].map(addToPlayer));`,
      expected: "[ 1, 3, 6 ]",
      hints: ["`map` callback কে plain function হিসেবে call করে।", "`player.add.bind(player)`।"],
      solution: `const player = {
  points: 0,
  add(n) {
    this.points += n;
    return this.points;
  },
};

const addToPlayer = player.add.bind(player);

console.log([1, 2, 3].map(addToPlayer));`,
      explanation: "`bind(player)` এর পর `this` সবসময় `player`; তাই `points` জমতে থাকে: ১, ১+২=৩, ৩+৩=৬।",
    },
    {
      level: "intermediate",
      title: "নিজের `call` লিখুন",
      prompt:
        "`Function.prototype.myCall` লিখুন, যা `fn.call` এর মতো কাজ করে: `thisArg` কে `this` বানিয়ে function চালায় ও ফল ফেরত দেয়। ইঙ্গিত: object এ একটি অস্থায়ী (unique) property হিসেবে function রেখে তাকে method হিসেবে call করুন, তারপর property মুছুন। (এই exercise এ শুধু object `thisArg` ধরে নিন।)",
      starter: `Function.prototype.myCall = function (thisArg, ...args) {
  // TODO
};

function intro(greeting) {
  return greeting + ", " + this.name;
}

console.log(intro.myCall({ name: "Rina" }, "Hi"));`,
      expected: "Hi, Rina",
      hints: ["`this` (যা `myCall` এ) হলো target function নিজেই।", "একটি `Symbol()` key ব্যবহার করুন যাতে existing property ভাঙে না: `ctx[key] = this`।", "`const result = ctx[key](...args); delete ctx[key]; return result;`"],
      solution: `Function.prototype.myCall = function (thisArg, ...args) {
  const key = Symbol("fn");
  const ctx = Object(thisArg);
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

function intro(greeting) {
  return greeting + ", " + this.name;
}

console.log(intro.myCall({ name: "Rina" }, "Hi"));`,
      explanation: "এটি দেখায় `call` আসলে implicit binding এরই একটি সংগঠিত রূপ: `ctx[key](...args)` একটি method call, তাই `this = ctx`। (সত্যিকারের `call` এই কৌশল নয়, সরাসরি engine-এর internal call ব্যবহার করে — যেমন strict mode এ `null` কে `null`ই রাখে; এই সংস্করণ তা করে না।)",
    },
    {
      level: "challenge",
      title: "Real-world: `bind` এর polyfill (this + preset + new)",
      prompt:
        "`Function.prototype.myBind` লিখুন: (১) বাঁধা `this` ব্যবহার করবে; (২) preset argument ও পরের argument জোড়া দেবে; (৩) `new` দিয়ে call হলে বাঁধা `this` উপেক্ষা করে নতুন object ব্যবহার করবে এবং `instanceof` আসল constructor এর সাথে কাজ করবে। নিচের তিনটি পরীক্ষা পাস করতে হবে।",
      starter: `Function.prototype.myBind = function (thisArg, ...preset) {
  // TODO
};

function greet(greeting, punct) {
  return greeting + ", " + this.name + punct;
}
const b = greet.myBind({ name: "Rina" }, "Hello");
console.log(b("!"));
console.log(b.call({ name: "Other" }, "?"));   // rebind হয় না

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const PointAt1 = Point.myBind(null, 1);
const p = new PointAt1(2);
console.log(p.x, p.y, p instanceof Point);`,
      expected: "Hello, Rina!\nHello, Rina?\n1 2 true",
      hints: ["`const target = this;` লিখে রাখুন — ভেতরের function এ `this` অন্য হবে।", "ভেতরের function regular হতে হবে (arrow নয়), যাতে `new` দেওয়া যায়। `this instanceof bound` দিয়ে `new` ধরুন।", "`new` হলে `target.apply(this, ...)`, নইলে `target.apply(thisArg, ...)`। শেষে `bound.prototype = Object.create(target.prototype)`।"],
      solution: `Function.prototype.myBind = function (thisArg, ...preset) {
  const target = this;
  if (typeof target !== "function") {
    throw new TypeError("myBind must be called on a function");
  }
  function bound(...args) {
    const isNew = this instanceof bound;
    return target.apply(isNew ? this : thisArg, [...preset, ...args]);
  }
  if (target.prototype) {
    bound.prototype = Object.create(target.prototype);
  }
  return bound;
};

function greet(greeting, punct) {
  return greeting + ", " + this.name + punct;
}
const b = greet.myBind({ name: "Rina" }, "Hello");
console.log(b("!"));
console.log(b.call({ name: "Other" }, "?"));

function Point(x, y) {
  this.x = x;
  this.y = y;
}
const PointAt1 = Point.myBind(null, 1);
const p = new PointAt1(2);
console.log(p.x, p.y, p instanceof Point);`,
      explanation: "`bound` একটি regular function তাই `new bound()` চলে; তখন `this` নতুন object যার prototype `bound.prototype` — তাই `this instanceof bound` সত্য। আমরা `bound.prototype` কে `target.prototype` থেকে তৈরি করেছি, ফলে `instanceof Point` ও সত্য। সাধারণ call এ `this` অন্য কিছু (বা `undefined`) বলে `thisArg` ব্যবহৃত হয়, এবং `b.call(other)` এ `other` উপেক্ষিত। (আসল `bind` এ `name`, `length` ও কিছু edge case আরও আছে; এটি শেখার জন্য সরলীকৃত polyfill।)",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোনটি `fn.apply(t, [1, 2])` এর সমতুল্য?",
        options: ["`fn.call(t, [1, 2])`", "`fn.bind(t, 1, 2)`", "`fn.call(t, 1, 2)`", "`fn.bind(t)([1, 2])`"],
        answer: 2,
        explanation: "`apply` array কে ভেঙে আলাদা argument বানায়, `call(t, 1, 2)` তাই সমতুল্য। `call(t, [1, 2])` array টিকে একটি argument হিসেবে পাঠায়। `bind(t, 1, 2)` function টি চালায় না, নতুন function ফেরত দেয়। `bind(t)([1, 2])` ও array কে একটি argument হিসেবে পাঠায়।",
      },
      {
        question: "`const g = fn.bind(a); const h = g.bind(b);` — `h()` চালালে `fn` এর ভেতরে `this` কী?",
        options: ["`a`", "`b`", "`a` ও `b` এর মিশ্রণ", "`undefined`"],
        answer: 0,
        explanation: "প্রথম `bind` এর বাঁধা `this` চূড়ান্ত; দ্বিতীয় `bind` শুধু নতুন একটি wrapper বানায়, কিন্তু সেই wrapper ভেতরে `g` কে call করে এবং `g` সবসময় `a` ব্যবহার করে। তাই `a`। `b` হতো না, কারণ rebind হয় না। মিশ্রণ বলে কিছু নেই; `undefined` হতো যদি কোনো bind ই না থাকত।",
      },
      {
        question: "`Math.max.call(null, [1, 5, 3])` এর ফল কী?",
        options: ["`5`", "`TypeError`", "`1`", "`NaN`"],
        answer: 3,
        explanation: "`call` এ পুরো array টি **একটি** argument হিসেবে যায়; `Math.max` সেটিকে number এ রূপান্তরের চেষ্টা করে (`'1,5,3'` → `NaN`), তাই `NaN`। `5` পেতে `apply(null, arr)` বা `Math.max(...arr)` লাগে। TypeError হয় না, কারণ `Math.max` এ `this` ব্যবহার হয় না, তাই `null` ঠিক আছে। `1` ভুল।",
      },
      {
        question: "Arrow function `arrow` এর ওপর `arrow.call(obj)` করলে `this` কী হয়?",
        options: [
          "`obj`",
          "`arrow` এ `call` ব্যবহার করলে `TypeError`",
          "`call` এর আগে যে `this` ছিল সেটি, অর্থাৎ arrow যেখানে লেখা সেই scope এর `this` অপরিবর্তিত থাকে",
          "সবসময় `undefined`",
        ],
        answer: 2,
        explanation: "Arrow এর নিজস্ব `this` নেই, তাই `thisArg` উপেক্ষিত এবং `this` lexical ভাবে বাইরের scope থেকেই থাকে। Error হয় না — `call` বৈধ, শুধু `thisArg` কিছু করে না (argument গুলো ঠিকই যায়)। `obj` হতো regular function এ। ‘সবসময় `undefined`’ ভুল, কারণ বাইরের scope এর `this` কিছু একটা হতে পারে।",
      },
      {
        question: "`Array.prototype.slice.call(arguments)` এর আধুনিক ও সবচেয়ে পছন্দের বিকল্প কোনটি?",
        options: [
          "`arguments.slice()`",
          "`arguments.toArray()`",
          "Rest parameter `(...args)` (বা `Array.from(arguments)`)",
          "`[].concat(arguments)`",
        ],
        answer: 2,
        explanation: "Rest parameter সরাসরি একটি আসল array দেয় এবং arrow function এও কাজ করে (যেখানে `arguments` নেই)। `Array.from(arguments)` বৈধ বিকল্প। `arguments.slice()` ও `arguments.toArray()` কাজ করে না — `arguments` array নয়, তাই এই method গুলো নেই। `[].concat(arguments)` array এর ভেতরে `arguments` object টিকে একটি উপাদান হিসেবে ঢোকায়, আলাদা করে না।",
      },
    ],
    coding: [
      {
        title: "`arguments` ধার করে যোগফল",
        prompt: "`sumAll()` কোনো parameter ঘোষণা করে না, বরং `arguments` ব্যবহার করে। `arguments` array নয়, তাই `.reduce` নেই। `Array.prototype.reduce` ধার করে `sumAll(1, 2, 3, 4)` এ `10` print করান।",
        starter: `function sumAll() {
  return arguments.reduce((acc, n) => acc + n, 0);   // TODO: ঠিক করুন
}

console.log(sumAll(1, 2, 3, 4));`,
        expected: "10",
        solution: `function sumAll() {
  return Array.prototype.reduce.call(arguments, (acc, n) => acc + n, 0);
}

console.log(sumAll(1, 2, 3, 4));`,
      },
      {
        title: "bindMethods: সব method কে object এ বাঁধুন",
        prompt: "`bindMethods(obj)` লিখুন, যা `obj` এর নিজস্ব (own) সব function-মানের property কে `obj` এর সাথে `bind` করে। এরপর `inc` extract করে দুবার চালালে `2` print হবে।",
        starter: `function bindMethods(obj) {
  // TODO
}

const store = {
  count: 0,
  label: "store",
  inc() {
    this.count++;
    return this.count;
  },
};

bindMethods(store);
const { inc } = store;
inc();
console.log(inc());`,
        expected: "2",
        solution: `function bindMethods(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "function") {
      obj[key] = obj[key].bind(obj);
    }
  }
}

const store = {
  count: 0,
  label: "store",
  inc() {
    this.count++;
    return this.count;
  },
};

bindMethods(store);
const { inc } = store;
inc();
console.log(inc());`,
      },
    ],
  },

  interview: [
    {
      q: "`call`, `apply` ও `bind` এর পার্থক্য কী?",
      a: "তিনটিই function এর `this` explicitly ঠিক করে। **`call(thisArg, a, b)`** তৎক্ষণাৎ function চালায়, argument আলাদা আলাদা। **`apply(thisArg, [a, b])`** তৎক্ষণাৎ চালায়, argument একটি array (বা array-like) তে। **`bind(thisArg, a)`** চালায় না — নতুন function ফেরত দেয় যার `this` স্থায়ীভাবে বাঁধা এবং শুরুর argument গুলো preset।\n\nআধুনিক কোডে `apply` এর কাজ spread দিয়ে (`fn.call(t, ...arr)`) হয়ে যায়। কোনটি কখন: একবার চালানোর জন্য `call`; handler/callback হিসেবে পাঠানোর জন্য `bind`; argument array তে আছে এমন পুরোনো কোডে `apply`।",
    },
    {
      q: "Bound function এর আচরণ নিয়ে কী কী বিশেষত্ব আছে?",
      a: "(১) **Rebind হয় না:** `bind` করা function এ `call`/`apply`/আবার `bind` দিয়ে `this` বদলানো যায় না; প্রথম `bind` ই চূড়ান্ত। (২) **`new` একে উপেক্ষা করে:** `new bound()` এ বাঁধা `this` বাতিল, নতুন object ই `this`, তবে preset argument গুলো থাকে। (৩) প্রতিবার `bind` করলে **নতুন function object** তৈরি হয়, মূল function বদলায় না। (৪) `name` হয় `'bound ' + আসল নাম`, `length` = আসল `length` − preset সংখ্যা (০ এর নিচে নয়)।\n\nএই বৈশিষ্ট্যগুলোই `bind` polyfill এ `this instanceof bound` পরীক্ষা ও prototype বসানোর কারণ। প্রয়োগে সাবধান: handler বহুবার `bind` করা (যেমন প্রতি render এ) মেমোরি ও identity-নির্ভর optimization (যেমন memoization) এ সমস্যা করতে পারে।",
    },
    {
      q: "Arrow function এ `call`/`apply`/`bind` করলে কী হয়?",
      a: "Arrow এর নিজস্ব `this` নেই, তাই `thisArg` সম্পূর্ণ উপেক্ষিত হয় — কোনো error হয় না, কিন্তু কোনো কাজও করে না। বাকি argument গুলো ঠিকই যায়। `bind` এর **preset argument** অংশটিও arrow এর ওপর কাজ করে, যেমন `multiply.bind(null, 2)`। কিন্তু `this` বদলাতে চাইলে function টি অবশ্যই regular `function` হতে হবে।\n\nপ্রমাণ: একটি function এর ভেতরে arrow লিখে সেটিকে `.call({id: 'other'})` করলে `this` তবুও বাইরের function এর `this` থাকে। এটি arrow কে callback ও event handler এ নিরাপদ করে, আবার ‘`this` ধার দেওয়া’ ধরনের method borrowing এ অকার্যকর করে — তাই object/prototype এর method regular function এ লিখুন।",
    },
    {
      q: "Method borrowing কী? `Array.prototype.slice.call(arguments)` কেন কাজ করত এবং আজ কী ব্যবহার করবেন?",
      a: "Method borrowing মানে একটি object এর method কে অন্য object এর ওপর চালানো। `Array.prototype.slice` এর spec অনুযায়ী সে শুধু `this.length` ও `this[i]` পড়ে (generic), তাই `length` ও index থাকা যেকোনো **array-like** (`arguments`, পুরোনো `NodeList`, সাধারণ object) এ `slice.call(arrayLike)` চলে এবং আসল array ফেরত দেয়।\n\nআজ: `arguments` এর বদলে rest parameter `(...args)` (সরাসরি আসল array, arrow এও চলে); array-like → array এর জন্য `Array.from(arrayLike)`; iterable হলে spread `[...iterable]`। `Object.prototype.hasOwnProperty.call(o, k)` এর বদলে `Object.hasOwn(o, k)` (ES2022)। ধার করা এখনও কাজে লাগে `Object.prototype.toString.call(v)` এর মতো কৌশলে।",
    },
    {
      q: "React class component এ event handler এর জন্য কেন `bind` লাগত এবং বিকল্প কী ছিল?",
      a: "Class এর method prototype এ থাকে এবং instance এর সাথে স্বয়ংক্রিয়ভাবে bound নয়। `onClick={this.handleClick}` এ React handler টি plain function হিসেবে call করত, তাই `this` হারাত (strict mode, কারণ class body strict) এবং `this.setState` এ `TypeError` হতো। সমাধানগুলো: (১) constructor এ `this.handleClick = this.handleClick.bind(this)` — প্রতি instance এ একবারই; (২) JSX এ `onClick={() => this.handleClick()}` বা `.bind(this)` — সহজ, কিন্তু প্রতি render এ নতুন function তৈরি হয়; (৩) class field arrow `handleClick = () => {}`।\n\nFunction component ও hooks এ `this` নেই, handler closure দিয়ে state ধরে — তাই আজ এই সমস্যা নেই, কিন্তু legacy কোডবেস, error boundary ও DOM-ভিত্তিক library এর callback এর জন্য এটি জানা দরকার।",
    },
    {
      q: "`bind` এর একটি polyfill কীভাবে লিখবেন? কোন কোন বিষয় ভাবতে হবে?",
      a: "মৌলিক কাঠামো: লক্ষ্য function সংরক্ষণ (`const target = this`), preset argument সংগ্রহ (`...preset`), এবং একটি **regular** function ফেরত দেওয়া যা `target.apply(thisArg, [...preset, ...args])` চালায়। এখানে arrow ব্যবহার করলে `new` সমর্থন করা যায় না।\n\nসম্পূর্ণ করতে: (১) `new` সমর্থন — bound function এর ভেতরে `this instanceof bound` হলে বাঁধা `thisArg` এর বদলে নতুন `this` ব্যবহার; (২) `bound.prototype = Object.create(target.prototype)` যাতে `instanceof` কাজ করে; (৩) `typeof target !== 'function'` হলে `TypeError`; (৪) `name`/`length` ঠিক রাখা (শেখার সংস্করণে প্রায়ই বাদ)। আজকের সব engine এ native `bind` আছে — polyfill লেখা মূলত ধারণা বোঝার অনুশীলন ও legacy environment এর জন্য।",
    },
  ],

  summary: {
    takeaways: [
      "`call(thisArg, a, b)` ও `apply(thisArg, [a, b])` তৎক্ষণাৎ চালায়; `bind(thisArg, a)` চালায় না, নতুন bound function ফেরত দেয়।",
      "Bound function এর `this` স্থায়ী — `call`/`apply`/আবার `bind` তাকে বদলাতে পারে না; শুধু `new` তাকে উপেক্ষা করে (preset argument থাকে)।",
      "`bind` দিয়ে partial application: শুরুর argument আগে ভরে রাখা (`multiply.bind(null, 2)`); `this` দরকার না হলে `null` দিন।",
      "Arrow function `thisArg` উপেক্ষা করে — `this` বদলাতে চাইলে regular `function` লিখুন।",
      "Legacy: `slice.call(arguments)`, `Math.max.apply`, `hasOwnProperty.call`। আধুনিক: rest/`Array.from`, spread, `Object.hasOwn`।",
      "Lost-this এর সমাধান: `bind`, arrow wrapper, class field arrow বা `thisArg` support — প্রসঙ্গ অনুযায়ী বেছে নিন।",
    ],
    syntax: `fn.call(thisArg, a, b);          // এখনই চালায়
fn.apply(thisArg, [a, b]);       // এখনই চালায়, array তে argument
const g = fn.bind(thisArg, a);   // নতুন function; this স্থায়ী, a preset
g(b);                            // fn.call(thisArg, a, b)

Array.prototype.slice.call(arrayLike);   // legacy method borrowing
Math.max(...nums);                       // modern (apply এর বদলে)
Object.hasOwn(obj, "key");               // modern (hasOwnProperty.call এর বদলে)`,
    whenToUse: [
      "Method কে callback/handler হিসেবে পাঠাতে হলে এবং `this` ঠিক রাখতে হলে → `bind` (বা arrow wrapper)।",
      "Function টি এক-বারই অন্য `this` দিয়ে চালাতে হলে → `call` (argument array তে থাকলে spread সহ `call`)।",
      "বহু-argument function থেকে বিশেষায়িত function বানাতে (আগের argument পরিচিত) → `bind(null, ...preset)` বা closure।",
      "Decorator/wrapper (debounce, once, memoize) লেখার সময় আসল function এ `this` ও argument পাঠাতে → `fn.apply(this, args)`।",
    ],
    next: ["Classes ও Prototype (OOP module) — `new`, `super`, prototype থেকে method ধার", "Higher-Order Functions ও Closures — `bind` এর বিকল্প হিসেবে closure", "Callback Functions ও Event Loop — `this` ও async callback এর মিথস্ক্রিয়া"],
  },

  compatibility:
    "`call`, `apply`, `bind` ES5 থেকে সব browser ও Node.js এ কাজ করে (`bind` এর জন্য IE9+ ও Node এর সব আধুনিক সংস্করণ)। Spread (`Math.max(...nums)`) ES2015, `Object.hasOwn` ES2022 (সব আধুনিক browser ও Node.js 16.9+)। ‘বড় array তে spread/apply এর argument সংখ্যা সীমা’ engine-নির্ভর। এই lesson এর সব কোড browser ও Node.js এ একই ফল দেয়; Playground browser-like Web Worker এ strict mode এ চলে, তাই sloppy mode এ `null`/`undefined`/primitive `thisArg` এর boxing আচরণ এখানে দেখা যাবে না — সেটি concept অংশে আলোচিত।",
};
