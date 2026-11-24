import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Pure function এর দুটি শর্ত (একই input → একই output; কোনো side effect নেই) এবং **referential transparency** ব্যাখ্যা করতে পারবেন।",
    "কোডে impurity চিনতে পারবেন: argument mutation, global/outer state, I/O, `Date`/`Math.random`, এমনকি `console.log`।",
    "Impure function কে pure এ refactor করতে পারবেন — spread, `map`/`filter`, এবং ES2023 `toSorted`/`toSpliced`/`with` দিয়ে।",
    "Shallow copy ও `Object.freeze` এর সীমাবদ্ধতা (nested object) বুঝে নিরাপদভাবে nested update করতে পারবেন।",
    "Memoization কেন শুধু pure function এ নিরাপদ, React এর reducer/render purity এবং **functional core, imperative shell** কাঠামো ব্যাখ্যা করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Pure function এর সংজ্ঞা" },
    {
      type: "p",
      text: "একটি function **pure** হয় যদি দুটি শর্তই পূরণ করে: **(১) Deterministic** — একই argument দিলে সবসময় একই ফল ফেরত দেয়, কোনো লুকানো input (global variable, বর্তমান সময়, random, network) এর ওপর নির্ভর করে না। **(২) Side-effect-free** — ফল ফেরত দেওয়া ছাড়া বাইরের জগতে কিছু বদলায় না: argument mutate করে না, global/outer variable লেখে না, ফাইল/network/DOM/console এ কিছু করে না।",
    },
    {
      type: "code",
      caption: "বাম দিকের দুটি pure, ডান দিকের দুটি impure।",
      code: `// pure: শুধু argument থেকে ফল, বাইরে কিছু বদলায় না
const add = (a, b) => a + b;
const withTax = (price, rate) => price + (price * rate) / 100;

// impure: লুকানো input
let rate = 10;
const withTaxImpure = (price) => price + (price * rate) / 100; // global rate পড়ে

// impure: side effect
let total = 0;
function addToTotal(n) { total += n; return total; }  // বাইরের variable বদলায়`,
    },
    { type: "h3", text: "কেন এই ধারণা গুরুত্বপূর্ণ?" },
    {
      type: "p",
      text: "Pure function ‘ছোট, বন্ধ বাক্সের’ মতো: ভেতরে কী ঢুকল আর কী বেরোল তা-ই সব। ফলে (১) **বোঝা সহজ** — অন্য ফাইলের global অবস্থা মাথায় রাখতে হয় না; (২) **test সহজ** — mock/setup ছাড়াই `expect(f(2)).toBe(4)`; (৩) **ভরসা করে reuse ও কম bug** — ডাকার ক্রম বা সংখ্যা ফল বদলায় না; (৪) **cache/memoize ও parallel চালানো নিরাপদ**; (৫) **React** এর মডেলের ভিত্তি (পরে দেখব)। Callbacks ও Higher-Order Functions lesson এ আমরা যে `map`/`filter`/`reduce` callback গুলো দেখেছি, সেগুলো pure হলে পুরো pipeline predictable হয়।",
    },
    { type: "h3", text: "Referential transparency" },
    {
      type: "p",
      text: "কোনো function call কে তার ফলাফল দিয়ে **প্রতিস্থাপন করলে প্রোগ্রামের আচরণ অপরিবর্তিত থাকলে** সেই expression টি **referentially transparent**। `add(2, 3)` কে `5` দিয়ে বদলে দিলে কিছুই বদলায় না — তাই `add` pure। কিন্তু `total += n` যুক্ত `addToTotal(5)` কে `5` দিয়ে বদলালে `total` আর আপডেট হবে না — আচরণ বদলে গেল, অর্থাৎ referentially transparent নয়। এই ধারণাটি বলে দেয় কেন pure call গুলো নির্ভয়ে cache করা, পুনর্বিন্যাস করা বা বাদ দেওয়া যায় (ফল দরকার না হলে)।",
    },
    { type: "h3", text: "Impurity চেনার তালিকা" },
    {
      type: "compare",
      headers: ["উৎস", "উদাহরণ", "কেন impure"],
      rows: [
        ["Argument mutation", "`arr.push(x)`, `obj.name = \"…\"`, `arr.sort()`", "caller এর data বদলে যায় (reference share হয়; Primitive vs Reference lesson)"],
        ["Global / outer variable লেখা", "`counter++`, `cache[key] = v` (বাইরের object)", "বাইরের অবস্থা বদলায়"],
        ["Global / outer variable পড়া", "`price * taxRate` (যেখানে `taxRate` বাইরের `let`)", "লুকানো input — ফল সময়ের সাথে বদলাতে পারে"],
        ["Time ও randomness", "`Date.now()`, `new Date()`, `Math.random()`", "প্রতিবার ভিন্ন ফল"],
        ["I/O", "`fetch`, `localStorage`, DOM, file, DB", "বাইরের জগৎ পড়া/লেখা"],
        ["`console.log`", "`console.log(x)`", "I/O (আউটপুট) — তাত্ত্বিকভাবে side effect; ব্যবহারিকভাবে নিরীহ, তবে ‘pure’ বলা শুদ্ধ নয়"],
        ["Exception ছোঁড়া", "`throw new Error()`", "সংজ্ঞা নিয়ে মতভেদ আছে: control flow বদলায়; অনেকে বিবেচনা করে না, কঠোর সংজ্ঞায় করে"],
      ],
    },
    {
      type: "p",
      text: "দুটি সূক্ষ্ম কথা। **প্রথমত**, function এর **নিজস্ব local** variable mutate করা impure নয়: `reduce` এর ভেতরে নতুন `[]` বানিয়ে তাতে `push` করা বাইরে থেকে দেখা যায় না, তাই function এখনো pure। **দ্বিতীয়ত**, বাইরের `const` constant (যেমন `const TAX = 10`) পড়া সাধারণত নিরাপদ — মান কখনো বদলায় না, তাই লুকানো input হিসেবে গণ্য করার দরকার নেই (তবে যে constant এর ভেতরের object বদলানো যায় তা আলাদা)।",
    },
    {
      type: "code",
      code: `// local mutation: pure (বাইরে থেকে কেউ out কে দেখে না)
function doubleAll(nums) {
  const out = [];
  for (const n of nums) out.push(n * 2);
  return out;
}

// argument mutation: impure
function doubleAllInPlace(nums) {
  for (let i = 0; i < nums.length; i++) nums[i] *= 2;
  return nums;
}

const data = [1, 2, 3];
console.log(doubleAll(data), data);        // data অপরিবর্তিত
console.log(doubleAllInPlace(data), data); // data বদলে গেছে`,
    },
    { type: "h3", text: "Impure → Pure: refactor এর কৌশল" },
    {
      type: "ol",
      items: [
        "**লুকানো input কে parameter বানান**: `getGreeting()` (যা `new Date()` পড়ে) কে `getGreeting(hour)` করুন; সময়টি বাইরে থেকে পাঠান। এতে test এ যেকোনো সময় পাঠানো যায়।",
        "**Argument mutate না করে নতুন মান ফেরত দিন**: object এ spread (`{ ...user, name }`), array এ `map`/`filter`/spread, আর ES2023 এর **`toSorted`, `toReversed`, `toSpliced`, `with`** যারা নতুন array দেয় (মূল array বদলায় না)।",
        "**Side effect কে ‘কিনারায়’ ঠেলে দিন**: logic আলাদা pure function এ, I/O (render, fetch, log) আলাদা ছোট function এ।",
        "**Nested data হলে প্রতিটি স্তরে copy** করুন যেগুলো বদলাচ্ছে; যা বদলাচ্ছে না তা আগের reference রেখে দিন (structural sharing — React এর re-render সীমিত করতে সাহায্য করে)।",
      ],
    },
    {
      type: "code",
      caption: "ES2023 এর non-mutating array method। (Node.js 20+ ও আধুনিক browser এ চলে।)",
      code: `const scores = [30, 10, 20];

const sorted = scores.toSorted((a, b) => a - b); // নতুন array
const reversed = scores.toReversed();            // নতুন array
const spliced = scores.toSpliced(1, 1);          // index 1 থেকে 1টি বাদ
const replaced = scores.with(0, 99);             // index 0 এ নতুন মান

console.log(sorted, reversed, spliced, replaced);
console.log(scores); // মূল array অপরিবর্তিত: [ 30, 10, 20 ]`,
    },
    {
      type: "callout",
      tone: "danger",
      title: "`sort()` / `reverse()` / `splice()` মূল array বদলায় — React state এ ভয়ংকর",
      text: "`const sorted = users.sort(byName)` — এটি `users` কেই বদলে দেয় এবং **একই reference** ফেরত দেয়। React state এ এভাবে লিখলে নতুন reference না থাকায় React পরিবর্তন ধরতে পারে না (re-render হয় না) অথবা অন্য component এ অদ্ভুত আচরণ দেখা যায়। ব্যবহার করুন `users.toSorted(byName)` অথবা পুরোনো runtime এর জন্য `[...users].sort(byName)`। একই কথা `reverse` ও `splice` এর ক্ষেত্রে।",
    },
    { type: "h3", text: "Shallow copy ও Object.freeze এর সীমা" },
    {
      type: "p",
      text: "`{ ...obj }` ও `[...arr]` ও `Object.assign` সব **shallow copy**: কেবল প্রথম স্তরের property কপি হয়; ভেতরের object/array এর **reference** একই থাকে (Primitive vs Reference Types lesson এর ধারণা)। তাই copy এর ভেতরের nested মান বদলালে মূলটিও বদলে যায়। `structuredClone(obj)` গভীর (deep) copy করে, কিন্তু function ও কিছু বিশেষ object ক্লোন করতে পারে না (error দেয়)। তাছাড়া deep clone ব্যয়বহুল — সাধারণত **যে path বদলাচ্ছে শুধু সেটুকু** copy করাই ভালো।",
    },
    {
      type: "p",
      text: "`Object.freeze(obj)` object এর property বদলানো, যোগ ও মুছে ফেলা আটকায় — কিন্তু **শুধু প্রথম স্তরে (shallow)**। ভেতরের nested object এখনো বদলানো যায়। Strict mode এ frozen object এ লিখতে গেলে `TypeError`, sloppy mode এ নীরবে ব্যর্থ হয় (ES module ও class body সবসময় strict)। Deep freeze চাইলে recursive helper লিখতে হয়। Freeze কে সাধারণত development এ ‘bug ধরার জাল’ হিসেবে ব্যবহার করা হয়, runtime শাসন হিসেবে নয়।",
    },
    {
      type: "code",
      code: `const state = { user: { name: "Rina" }, tags: ["a"] };

const copy = { ...state };          // shallow
copy.user.name = "Mim";             // nested — মূল state ও বদলে গেল!
console.log(state.user.name);       // Mim

const safe = { ...state, user: { ...state.user, name: "Tina" } }; // path-ভিত্তিক copy
console.log(state.user.name, safe.user.name);`,
    },
    { type: "h3", text: "Memoization শুধু pure function এ নিরাপদ" },
    {
      type: "p",
      text: "**Memoization** হলো function এর ফল argument অনুযায়ী মনে রাখা, যাতে একই argument এ আবার গণনা না করতে হয়। এটি তখনই সঠিক যখন function pure (একই input → একই output)। Impure function এ memoize করলে **পুরোনো (stale) ফল** আসে, কারণ লুকানো input বদলেছে কিন্তু cache জানে না; আবার side effect থাকলে cache hit এ সেই effect আর ঘটবে না (`console.log` আর হবে না, request আর যাবে না)। React এর `useMemo`/`useCallback`/`memo` এর পেছনেও একই অনুমান: ‘একই input এ একই ফল’।",
    },
    {
      type: "code",
      code: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);   // সরল key — object/function argument এ সীমাবদ্ধতা আছে
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

let calls = 0;
const square = memoize((n) => { calls++; return n * n; });
console.log(square(4), square(4), "computed", calls, "time");`,
    },
    { type: "h3", text: "React এর সাথে যোগ: render ও reducer purity" },
    {
      type: "ul",
      items: [
        "**Component render pure হওয়া উচিত**: একই props/state পেলে একই JSX ফেরত দিতে হবে; render এর ভেতরে global লেখা, DOM mutate, `fetch` বা প্রচলিত অর্থে random/`Date.now()` দিয়ে UI ঠিক করা এড়ানো উচিত — side effect যায় `useEffect` বা event handler এ।",
        "**`useReducer`/Redux reducer অবশ্যই pure**: `(state, action) => newState` — state mutate না করে নতুন object ফেরত দেয়। পুরোনো ও নতুন state এর reference তুলনা করেই React/Redux পরিবর্তন ধরে।",
        "**`setState(prev => next)` এর updater pure** হতে হয়। Development এ React এর Strict Mode ইচ্ছাকৃতভাবে কিছু function (render, updater, reducer) দুইবার ডাকে — pure হলে এতে কিছু বদলায় না, impure হলে bug ধরা পড়ে। (আচরণ React এর version ও mode নির্ভর; নিজের project এর docs দেখুন।)",
        "**Props কে mutate করবেন না** — props হলো parent এর data; সেটি mutate করা মানে argument mutation।",
      ],
    },
    { type: "h3", text: "সবকিছু pure হতে পারে না: functional core, imperative shell" },
    {
      type: "p",
      text: "একটি প্রোগ্রাম যদি শুধু pure function দিয়ে তৈরি হয় তবে সে বাইরের জগতে কোনো প্রভাব ফেলে না — অর্থাৎ ব্যবহারহীন! আসল অ্যাপে data আনা, DB তে লেখা, UI আঁকা — সবই side effect। তাই কৌশল হলো **functional core, imperative shell**: ব্যবসায়িক logic (হিসাব, validation, রূপান্তর, reducer) থাকে **pure core** এ — যা সহজে test হয়; আর side effect গুলো (fetch, render, log, storage) থাকে পাতলা **shell** এ, যে core কে data জোগান দেয় এবং ফল নিয়ে বাইরের কাজ করে।",
    },
    {
      type: "code",
      code: `// core: pure — test সহজ
function summarize(items, taxRate) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = (subtotal * taxRate) / 100;
  return { subtotal, tax, total: subtotal + tax };
}

// shell: impure — I/O এখানে
function printReceipt(items) {
  const s = summarize(items, 10);
  console.log("Total:", s.total);
}
printReceipt([{ price: 100, qty: 2 }]);`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Common misconceptions",
      text: "(১) ‘Pure মানে কোনো variable বদলায় না’ — function এর ভেতরের local variable বদলানো চলে, কেবল বাইরের জিনিস নয়। (২) ‘`const` দিলে function pure হয়ে যায়’ — `const` শুধু binding স্থির রাখে, object এর ভেতরের mutation আটকায় না। (৩) ‘`Object.freeze` deep immutability দেয়’ — না, shallow। (৪) ‘`console.log` থাকলেও pure’ — কঠোর অর্থে না (I/O)। (৫) ‘Pure মানে সবসময় ধীর (copy এর খরচ)’ — সাধারণ আকারে copy সস্তা, আর structural sharing পুরো copy এড়ায়; হট path এ মেপে দেখুন। (৬) ‘সব কোড pure করতে হবে’ — না, side effect কে কিনারায় আলাদা রাখাই লক্ষ্য।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "দ্রুত যাচাই: ‘pure কি না’ প্রশ্ন",
      text: "নিজেকে জিজ্ঞেস করুন: (ক) function টি কি সবসময় একই argument এ একই ফল দেয়? (খ) function call এর আগে-পরে বাইরের কিছু কি বদলাল (argument সহ)? (গ) call টি কি ফলের মান দিয়ে বদলে ফেলা যায়? যেকোনোটির উত্তর ‘না’ হলে impure।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **ক্যালকুলেটর** আর একটি **ব্যাংকের ATM** এর পার্থক্য ভাবুন।",
    },
    {
      type: "ul",
      items: [
        "**Pure function = ক্যালকুলেটর।** `7 × 6` চাপলে সবসময় `42`। কাল, পরশু, অন্য কেউ চাপলেও একই। ক্যালকুলেটর আপনার ডেস্কের আর কিছু বদলায় না (side effect নেই) এবং আজকের তারিখ বা মেজাজ দেখে ফল বদলায় না (লুকানো input নেই)।",
        "**Impure function = ATM।** ‘৫০০ টাকা তোলো’ বললে ফল নির্ভর করে ব্যালান্স (global state), লাইনের নেটওয়ার্ক (I/O), মেশিনে নোট আছে কি না (বাইরের অবস্থা) এর ওপর; আর এর **প্রভাব** আছে — আপনার ব্যালান্স কমে যায় (side effect)। একই কাজ দ্বিতীয়বার করলে ফল ভিন্ন হতে পারে।",
        "**Argument mutation** = আপনার কাছ থেকে নেওয়া ফর্মে ব্যাংক কর্মী নিজের কলমে কিছু লিখে ফেরত দিল — আপনার মূল ফর্ম বদলে গেল। **Pure** আচরণ হলো ফর্মের ফটোকপি করে কপিতে লেখা।",
        "**Shallow copy** = ফাইলের শুধু উপরের কাভার ফটোকপি করা; ভেতরের কাগজগুলো আসলে একই কাগজ। কপির ফাইলে ভেতরের কাগজে লিখলে মূল ফাইলেও দেখা যায়। **Deep copy** = প্রতিটি পাতা ফটোকপি।",
        "**Memoization** = ক্যালকুলেটরের ফল খাতায় টুকে রাখা: ‘৭×৬ = ৪২’ আগেই লেখা থাকলে আবার চেপে হিসাব করতে হয় না। কিন্তু ATM এর ‘ব্যালান্স’ টুকে রাখলে কাল ভুল তথ্য পাবেন (stale) — তাই শুধু ক্যালকুলেটর-ধরনের (pure) জিনিসেই খাতা নিরাপদ।",
        "**Functional core, imperative shell** = ব্যাংকের পেছনের হিসাব বিভাগ (pure নিয়মে সুদ হিসাব) আর সামনের কাউন্টার (টাকা দেওয়া-নেওয়া)। হিসাব বিভাগ পরীক্ষা করা সহজ; কাউন্টার যত পাতলা, ঝুঁকি তত কম।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Pure বনাম Impure: function টি কার সাথে যোগাযোগ করে?",
      caption: "Pure function এর তীর কেবল ‘input → output’; impure function এর অতিরিক্ত তীর বাইরের অবস্থার দিকে।",
      nodes: [
        { id: "in", label: "Argument", sub: "input" },
        { id: "fn", label: "Function", sub: "ভেতরের কাজ" },
        { id: "out", label: "Return value", sub: "output" },
        { id: "world", label: "বাইরের জগৎ", sub: "global, DOM, network, argument এর মূল object" },
      ],
      steps: [
        {
          active: ["in", "fn", "out"],
          items: { in: ["price = 100", "rate = 10"], fn: ["price + price * rate / 100"], out: ["110"] },
          note: "**Pure**: `withTax(100, 10)`। শুধু argument নিল, শুধু ফল ফেরত দিল। বাইরের জগতের সাথে কোনো যোগাযোগ নেই — যতবার ডাকুন `110`।",
        },
        {
          active: ["fn", "world"],
          items: { fn: ["price * taxRate (global)"], world: ["taxRate = 10"] },
          note: "**Impure (লুকানো input)**: function টি global `taxRate` **পড়ছে**। argument একই থাকলেও `taxRate` বদলালে ফল বদলে যাবে — call দেখে ফল অনুমান করা যায় না।",
        },
        {
          active: ["fn", "world"],
          items: { fn: ["total += n"], world: ["total = 0", "→ total = 5"] },
          note: "**Impure (side effect)**: function টি বাইরের `total` **লিখছে**। ফল ফেরত দেওয়া ছাড়াও বাইরের অবস্থা বদলে গেল — ডাকার সংখ্যা ও ক্রম গুরুত্বপূর্ণ হয়ে গেল।",
        },
        {
          active: ["in", "fn", "world"],
          items: { in: ["list → [1, 2]"], fn: ["list.push(3)"], world: ["caller এর list = [1, 2, 3]"] },
          note: "**Impure (argument mutation)**: argument একটি reference; `push` মূল array কেই বদলায় — caller এর দিকে তাকালে দেখা যায় তার array বদলে গেছে। এটি সবচেয়ে সাধারণ ‘অদৃশ্য’ side effect।",
        },
        {
          active: ["in", "fn", "out"],
          items: { in: ["list → [1, 2]"], fn: ["[...list, 3]"], out: ["নতুন array [1, 2, 3]"] },
          note: "**সমাধান**: নতুন array বানিয়ে ফেরত দিন। মূল `list` অক্ষত — আবার pure।",
        },
      ],
    },
    {
      kind: "memory-steps",
      title: "Reference, mutation ও shallow copy এর ফাঁদ",
      caption: "`b` শুধু একই object এর আরেকটি নাম; `c` shallow copy — কিন্তু `tags` এখনো share করা।",
      code: 'const a = { n: 1, tags: ["x"] };\nconst b = a;\nb.n = 2;\nconst c = { ...a, n: 3 };\nc.tags.push("y");',
      steps: [
        {
          line: 0,
          memory: [
            { name: "a", value: '→ #1 { n: 1, tags: → #2 }', kind: "const", state: "live" },
            { name: "#2 (array)", value: '["x"]', kind: "value", state: "live" },
          ],
          note: "heap এ দুটি object: `#1` (object) ও তার `tags` property র `#2` (array)। `a` এ থাকে `#1` এর reference।",
        },
        {
          line: 1,
          memory: [
            { name: "a", value: '→ #1 { n: 1, tags: → #2 }', kind: "const", state: "live" },
            { name: "b", value: "→ #1 (একই object)", kind: "const", state: "live" },
            { name: "#2 (array)", value: '["x"]', kind: "value", state: "live" },
          ],
          note: "`const b = a` কপি করে না — শুধু reference কপি। `a` ও `b` একই `#1` এর দুটি নাম।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: '→ #1 { n: 2, tags: → #2 }', kind: "const", state: "live" },
            { name: "b", value: "→ #1 (একই object)", kind: "const", state: "live" },
            { name: "#2 (array)", value: '["x"]', kind: "value", state: "live" },
          ],
          note: "`b.n = 2` — **mutation**। `a.n` ও এখন `2`, কারণ একই object। কোনো function এর parameter এও এটাই ঘটে: argument মূল object এর reference।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: '→ #1 { n: 2, tags: → #2 }', kind: "const", state: "live" },
            { name: "b", value: "→ #1 (একই object)", kind: "const", state: "live" },
            { name: "c", value: '→ #3 { n: 3, tags: → #2 }', kind: "const", state: "live" },
            { name: "#2 (array)", value: '["x"]', kind: "value", state: "live" },
          ],
          note: "`{ ...a, n: 3 }` নতুন object `#3` বানাল (তাই `a` অক্ষত রইল)। কিন্তু `tags` এর **reference** কপি হলো — `#1` ও `#3` দুটোই একই `#2` array কে ধরে আছে (shallow copy)।",
        },
        {
          line: 4,
          memory: [
            { name: "a", value: '→ #1 { n: 2, tags: → #2 }', kind: "const", state: "live" },
            { name: "c", value: '→ #3 { n: 3, tags: → #2 }', kind: "const", state: "live" },
            { name: "#2 (array)", value: '["x", "y"]', kind: "value", state: "error" },
          ],
          note: "`c.tags.push(\"y\")` — `c` বদলাল ভেবে আমরা নিশ্চিন্ত, কিন্তু `#2` শেয়ার করা, তাই `a.tags` ও এখন `[\"x\", \"y\"]`। সমাধান: `{ ...a, n: 3, tags: [...a.tags, \"y\"] }` — যা বদলাচ্ছে সেই path এ নতুন copy।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "Functional core, imperative shell: একটি ‘Add to cart’ click",
      caption: "I/O শুধু shell এ; হিসাব ও state পরিবর্তন core এ (pure reducer)।",
      nodes: [
        { id: "event", label: "Event", sub: "click, network" },
        { id: "shell1", label: "Shell", sub: "(imperative) input নেয়" },
        { id: "core", label: "Core", sub: "(pure) reducer / হিসাব" },
        { id: "shell2", label: "Shell", sub: "(imperative) ফল প্রয়োগ" },
        { id: "world", label: "বাইরের জগৎ", sub: "UI, DB, console" },
      ],
      steps: [
        {
          active: ["event", "shell1"],
          items: { event: ["click: add item b"], shell1: ["action = { type: \"add\", id: \"b\" }"] },
          note: "বাইরের জগৎ থেকে ঘটনা আসে। Shell সেটিকে সরল data (action) এ রূপান্তর করে — এই ধাপে I/O আছে।",
        },
        {
          active: ["shell1", "core"],
          items: { shell1: ["state, action"], core: ["cartReducer(state, action)"] },
          note: "Shell **শুধু data** দিয়ে core কে ডাকে। core এ কোনো `fetch`/DOM নেই — তাই test এ শুধু `cartReducer(s, a)` চালিয়ে ফল মেলালেই হয়।",
        },
        {
          active: ["core"],
          items: { core: ["{ ...state, items: [...state.items, newItem] }", "→ নতুন state (state mutate হয়নি)"] },
          note: "Core নতুন state **ফেরত দেয়**; পুরোনো state অক্ষত। এটি সম্পূর্ণ pure: একই (state, action) → একই নতুন state।",
        },
        {
          active: ["core", "shell2"],
          items: { shell2: ["নতুন state পেল"] },
          note: "ফল ফিরে এল shell এ। Shell সিদ্ধান্ত নেয় এই ফল নিয়ে কী করতে হবে।",
        },
        {
          active: ["shell2", "world"],
          items: { world: ["UI আঁকা হলো", "localStorage এ লেখা হলো", "analytics event গেল"] },
          note: "সব side effect এখানে: UI render, storage, network। Core যেহেতু pure, এই effect গুলো বদলালেও (যেমন DB বদল) core এর test অক্ষত থাকে। React এ `useReducer` + `useEffect` ঠিক এই ভাগাভাগিই।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Pure বনাম Impure: পাশাপাশি তুলনা",
      description: "একই কাজ দুই ভাবে। লক্ষ্য করুন কোনটি ‘argument’ বদলে ফেলছে এবং কোনটির ফল বাইরের মানের ওপর নির্ভর করছে।",
      code: `// pure
function addPure(list, item) {
  return [...list, item];
}

// impure: argument mutate করে
function addImpure(list, item) {
  list.push(item);
  return list;
}

const original = ["a", "b"];
const p = addPure(original, "c");
console.log("pure:", p, "original:", original);

const q = addImpure(original, "c");
console.log("impure:", q, "original:", original);
console.log("same reference?", q === original);

// লুকানো input
let rate = 10;
const taxImpure = (price) => price + (price * rate) / 100;
const taxPure = (price, r) => price + (price * r) / 100;
console.log(taxImpure(100));
rate = 20;
console.log(taxImpure(100), "<- একই argument, ভিন্ন ফল");
console.log(taxPure(100, 10), taxPure(100, 10), "<- সবসময় একই");`,
    },
    {
      level: "intermediate",
      title: "Immutable update: nested object ও ES2023 array method",
      description: "Spread, `map` ও `toSorted/with/toSpliced` দিয়ে মূল data অক্ষত রেখে নতুন data বানানো; nested এ কোন অংশ share হয় সেটিও দেখুন।",
      code: `const user = {
  name: "Rina",
  address: { city: "Dhaka", zip: "1207" },
  skills: ["js", "css"],
};

const moved = {
  ...user,
  address: { ...user.address, city: "Chattogram" },
};

console.log(user.address.city, moved.address.city);
console.log("address share?", user.address === moved.address);   // নতুন
console.log("skills share?", user.skills === moved.skills);      // যা বদলায়নি, তা share

const todos = [
  { id: 1, done: false },
  { id: 2, done: false },
];
const toggled = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t));
console.log(toggled);
console.log("untouched item shared?", toggled[0] === todos[0]);

const nums = [30, 10, 20];
console.log(nums.toSorted((a, b) => a - b), nums.with(1, 99), nums.toSpliced(0, 1));
console.log(nums);`,
    },
    {
      level: "real-world",
      title: "Cart reducer + selector + memoize + shell (production-style)",
      description: "React `useReducer`/Redux এর reducer এর মতো pure core, তার test-সদৃশ যাচাই (original state অক্ষত), memoized selector, এবং পাতলা imperative shell। কোনো DOM/network ছাড়া।",
      code: `// ---------- functional core ----------
function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const exists = state.items.some((i) => i.id === action.id);
      const items = exists
        ? state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { id: action.id, price: action.price, qty: 1 }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default:
      return state;
  }
}

function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

let computeCount = 0;
const selectTotal = memoize((items) => {
  computeCount++;
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
});

// ---------- verification: core কে আলাদা করে পরীক্ষা ----------
const initial = { items: [{ id: "pen", price: 10, qty: 1 }] };
const snapshot = JSON.stringify(initial);

const s1 = cartReducer(initial, { type: "add", id: "bag", price: 450 });
const s2 = cartReducer(s1, { type: "add", id: "pen", price: 10 });
const s3 = cartReducer(s2, { type: "remove", id: "bag" });

console.log("initial unchanged:", JSON.stringify(initial) === snapshot);
console.log("new object each time:", s1 !== initial, s2 !== s1);
console.log("unrelated state returns same ref:", cartReducer(s3, { type: "noop" }) === s3);
console.log("total s2:", selectTotal(s2.items), "again:", selectTotal(s2.items), "computed", computeCount, "time(s)");

// ---------- imperative shell: I/O এখানে ----------
function render(state) {
  console.log("render:", state.items.map((i) => i.id + "x" + i.qty).join(", "));
}
let current = initial;
function dispatch(action) {
  current = cartReducer(current, action);   // pure core
  render(current);                          // side effect
}
dispatch({ type: "add", id: "book", price: 120 });
dispatch({ type: "add", id: "book", price: 120 });`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const double = (n) => n * 2;
console.log(double(4), double(4)); // pure: সবসময় একই
`,
    },
    {
      label: "sort() mutate করে, toSorted() করে না",
      code: `const users = ["tina", "amit", "rina"];

const a = users.toSorted();
console.log("toSorted:", a, "| original:", users);

const b = users.sort();
console.log("sort    :", b, "| original:", users);
console.log("same reference?", b === users);

// পুরোনো runtime এ বিকল্প
const c = [...["z", "y"]].sort();
console.log(c);`,
    },
    {
      label: "Object.freeze শুধু shallow",
      code: `"use strict";

const config = Object.freeze({ mode: "dark", nested: { size: 12 } });

try {
  config.mode = "light";           // frozen: strict mode এ TypeError
} catch (e) {
  console.log("top-level:", e.name);
}

config.nested.size = 99;           // nested এখনো বদলানো যায়
console.log(config);

function deepFreeze(obj) {
  Object.values(obj).forEach((v) => {
    if (typeof v === "object" && v !== null) deepFreeze(v);
  });
  return Object.freeze(obj);
}

const strict = deepFreeze({ mode: "dark", nested: { size: 12 } });
try {
  strict.nested.size = 99;
} catch (e) {
  console.log("deep:", e.name);
}`,
    },
    {
      label: "Memoize ও stale ফল (impure এ)",
      code: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

// impure: global rate পড়ে
let rate = 10;
const priceImpure = memoize((n) => n + (n * rate) / 100);
console.log(priceImpure(100));
rate = 20;
console.log(priceImpure(100), "<- stale!");

// pure: rate parameter
const pricePure = memoize((n, r) => n + (n * r) / 100);
console.log(pricePure(100, 10), pricePure(100, 20));`,
    },
    {
      label: "Date/Random কে ভেতর থেকে বাইরে আনা",
      code: `// impure: বর্তমান সময় লুকানো input
function greetingImpure() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : "Good afternoon";
}

// pure: সময় parameter, shell থেকে আসবে
function greeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

console.log(greeting(9), "|", greeting(15), "|", greeting(21));
console.log(typeof greetingImpure()); // ফল সময়ের ওপর নির্ভর, তাই test করা কঠিন`,
    },
  ],

  debugging: [
    {
      title: "Helper function ‘নিঃশব্দে’ caller এর array বদলে দিচ্ছে",
      bad: `function withDefault(list, fallback) {
  if (list.length === 0) list.push(fallback);
  return list;
}

const queue = [];
const safe = withDefault(queue, "idle");
console.log(safe);
console.log("queue after:", queue);`,
      why: "`queue` argument হিসেবে গেছে একটি **reference** হিসেবে, তাই `list.push` মূল `queue` কেই বদলে দিয়েছে। Helper function এর কাজ ছিল ‘ডিফল্ট সহ একটি তালিকা দেওয়া’, caller এর data বদলানো নয়। সমাধান: নতুন array ফেরত দিন (`[fallback]` বা `[...list]`) — আর caller এর `queue` অক্ষত থাকবে।",
      fix: `function withDefault(list, fallback) {
  return list.length === 0 ? [fallback] : list;
}

const queue = [];
const safe = withDefault(queue, "idle");
console.log(safe);
console.log("queue after:", queue);`,
    },
    {
      title: "`sort()` করে state এর মূল array বদলে ফেলা",
      bad: `const users = [
  { name: "tina", age: 30 },
  { name: "amit", age: 25 },
];

function getSortedByAge(list) {
  return list.sort((a, b) => a.age - b.age);
}

const sorted = getSortedByAge(users);
console.log(sorted.map((u) => u.name));
console.log(users.map((u) => u.name), "<- original কেন বদলাল?");`,
      why: "`Array.prototype.sort` in-place কাজ করে এবং **একই array** ফেরত দেয়। তাই ‘sorted কপি’ আসলে মূল `users`; React state এ এভাবে করলে re-render বা অন্য component এ ক্রম গোলমালের bug হয়। সমাধান: `list.toSorted(...)` অথবা `[...list].sort(...)`।",
      fix: `const users = [
  { name: "tina", age: 30 },
  { name: "amit", age: 25 },
];

function getSortedByAge(list) {
  return list.toSorted((a, b) => a.age - b.age);
}

const sorted = getSortedByAge(users);
console.log(sorted.map((u) => u.name));
console.log(users.map((u) => u.name));`,
    },
    {
      title: "Spread করেও nested object বদলে যায় (shallow copy)",
      bad: `const state = { profile: { city: "Dhaka" }, count: 1 };

function updateCity(s, city) {
  const next = { ...s };
  next.profile.city = city;    // nested — shared reference!
  return next;
}

const next = updateCity(state, "Sylhet");
console.log(state.profile.city, next.profile.city);
console.log(state.profile === next.profile);`,
      why: "`{ ...s }` শুধু প্রথম স্তর কপি করে; `profile` এর **reference** কপি হয়েছে, তাই `next.profile` ও `state.profile` একই object। `next.profile.city = city` আসলে মূল state কেও বদলে দিল। যে path বদলাচ্ছে তার প্রতিটি স্তরে নতুন object: `{ ...s, profile: { ...s.profile, city } }`।",
      fix: `const state = { profile: { city: "Dhaka" }, count: 1 };

function updateCity(s, city) {
  return { ...s, profile: { ...s.profile, city } };
}

const next = updateCity(state, "Sylhet");
console.log(state.profile.city, next.profile.city);
console.log(state.profile === next.profile);`,
    },
    {
      title: "Impure function memoize করে stale ফল পাওয়া",
      bad: `function memoize(fn) {
  const cache = new Map();
  return (n) => {
    if (!cache.has(n)) cache.set(n, fn(n));
    return cache.get(n);
  };
}

let ratePercent = 10;
const price = memoize((n) => n + (n * ratePercent) / 100);

console.log(price(100));
ratePercent = 20;
console.log(price(100));`,
      why: "`price` এর ফল শুধু `n` এর ওপর নয়, global `ratePercent` এর ওপরেও নির্ভর করে — কিন্তু cache এর key তে শুধু `n` আছে। তাই `ratePercent` বদলালেও cache `110` ফেরত দেয় (stale)। Memoization শুধু pure function এ নিরাপদ: লুকানো input কে parameter বানান (`(n, rate) => ...`) যাতে তা key এর অংশ হয়।",
      fix: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

const price = memoize((n, ratePercent) => n + (n * ratePercent) / 100);

console.log(price(100, 10));
console.log(price(100, 20));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Argument mutate করা বন্ধ করুন",
      prompt: "`applyDiscount(order)` টি মূল `order` object কে বদলে দিচ্ছে। এটিকে pure করুন: নতুন object ফেরত দিক, `order` অক্ষত থাকুক। (`total` এর ১০% ছাড়।) প্রত্যাশিত output: মূল `100`, ছাড়ের পরে `90`।",
      starter: `function applyDiscount(order) {
  order.total = order.total * 0.9;
  return order;
}

const order = { id: 1, total: 100 };
const discounted = applyDiscount(order);
console.log(order.total, discounted.total);`,
      expected: "100 90",
      hints: ["`{ ...order, total: ... }` দিয়ে নতুন object বানান।"],
      solution: `function applyDiscount(order) {
  return { ...order, total: order.total * 0.9 };
}

const order = { id: 1, total: 100 };
const discounted = applyDiscount(order);
console.log(order.total, discounted.total);`,
      explanation: "Spread নতুন object বানায়, তাই `order` অক্ষত থাকে। `total` প্রথম স্তরের primitive, তাই shallow copy যথেষ্ট।",
    },
    {
      level: "beginner",
      title: "Pure `addItem`",
      prompt: "`addItem(list, item)` ফিরিয়ে দেবে নতুন array (শেষে `item` সহ); মূল `list` যেন না বদলায়।",
      starter: `function addItem(list, item) {
  list.push(item);
  return list;
}

const letters = ["a", "b"];
const more = addItem(letters, "c");
console.log(letters, more);`,
      expected: "[ 'a', 'b' ] [ 'a', 'b', 'c' ]",
      hints: ["`push` বাদ দিয়ে spread: `[...list, item]`।"],
      solution: `function addItem(list, item) {
  return [...list, item];
}

const letters = ["a", "b"];
const more = addItem(letters, "c");
console.log(letters, more);`,
      explanation: "Array spread নতুন array বানায়। এটাই React state এ item যোগ করার সঠিক রূপ।",
    },
    {
      level: "beginner",
      title: "মূল array না বদলে সাজান",
      prompt: "`scores` কে ছোট থেকে বড় সাজিয়ে `sorted` এ রাখুন, কিন্তু `scores` যেন `[3, 1, 2]` ই থাকে।",
      starter: `const scores = [3, 1, 2];
const sorted = scores.sort((a, b) => a - b);
console.log(scores);
console.log(sorted);`,
      expected: "[ 3, 1, 2 ]\n[ 1, 2, 3 ]",
      hints: ["ES2023 এর `toSorted` ব্যবহার করুন।", "অথবা `[...scores].sort(...)`।"],
      solution: `const scores = [3, 1, 2];
const sorted = scores.toSorted((a, b) => a - b);
console.log(scores);
console.log(sorted);`,
      explanation: "`sort` মূল array বদলায় ও একই reference ফেরত দেয়; `toSorted` নতুন array দেয়।",
    },
    {
      level: "intermediate",
      title: "Nested immutable update",
      prompt: "`updateCity(user, city)` লিখুন যা `user.address.city` বদলানো নতুন user ফেরত দেয় (বাকি সব `zip` সহ অক্ষত)। মূল `user` যেন না বদলায় এবং `address` নতুন object হয়।",
      starter: `function updateCity(user, city) {
  user.address.city = city;
  return user;
}

const user = { name: "Rina", address: { city: "Dhaka", zip: "1207" } };
const next = updateCity(user, "Chattogram");
console.log(user.address.city, next.address.city, user.address === next.address);
console.log(next.address.zip);`,
      expected: "Dhaka Chattogram false\n1207",
      hints: ["দুই স্তরেই spread লাগবে: `user` এবং `user.address`।", "`{ ...user, address: { ...user.address, city } }`"],
      solution: `function updateCity(user, city) {
  return { ...user, address: { ...user.address, city } };
}

const user = { name: "Rina", address: { city: "Dhaka", zip: "1207" } };
const next = updateCity(user, "Chattogram");
console.log(user.address.city, next.address.city, user.address === next.address);
console.log(next.address.zip);`,
      explanation: "যে path বদলাচ্ছে (`user` → `address`) প্রতিটি স্তরে নতুন object; বাকি (`name`, `zip`) আগের মান বা reference রাখে।",
    },
    {
      level: "intermediate",
      title: "নিজের `memoize` লিখুন",
      prompt: "`memoize(fn)` লিখুন যা আগের argument এর ফল cache থেকে দেয়। নিচের `calls` গণনা দেখাবে `slowSquare` আসলে কতবার চলেছে (প্রত্যাশা: `3` আর `4` এর জন্য দুইবার)।",
      starter: `function memoize(fn) {
  // TODO
  return fn;
}

let calls = 0;
const slowSquare = (n) => {
  calls++;
  return n * n;
};

const fast = memoize(slowSquare);
console.log(fast(3));
console.log(fast(3));
console.log(fast(4));
console.log("calls:", calls);`,
      expected: "9\n9\n16\ncalls: 2",
      hints: ["`Map` দিয়ে cache রাখুন; key হিসেবে `JSON.stringify(args)`।", "`cache.has(key)` না থাকলে `fn(...args)` চালিয়ে `set` করুন।"],
      solution: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
}

let calls = 0;
const slowSquare = (n) => {
  calls++;
  return n * n;
};

const fast = memoize(slowSquare);
console.log(fast(3));
console.log(fast(3));
console.log(fast(4));
console.log("calls:", calls);`,
      explanation: "এটি সঠিক কারণ `slowSquare` pure। `JSON.stringify(args)` সরল key; `undefined`/function/circular argument এ এটি ভরসাযোগ্য নয় — production এ আলাদা ভাবে ভাবতে হয়।",
    },
    {
      level: "challenge",
      title: "Pure `cartReducer`: নতুন state, structural sharing",
      prompt: "`cartReducer(state, action)` লিখুন। `add`: item না থাকলে `{ id, qty: 1 }` যোগ, থাকলে `qty + 1`। `remove`: item বাদ। অজানা action এ **একই state reference** ফেরত। কোনো অবস্থাতেই `state` mutate করা যাবে না। যে item বদলায়নি তার object reference আগেরটিই থাকবে।",
      starter: `function cartReducer(state, action) {
  // TODO: pure reducer
  return state;
}

const initial = { items: [{ id: "a", qty: 1 }] };
const s1 = cartReducer(initial, { type: "add", id: "b" });
const s2 = cartReducer(s1, { type: "add", id: "a" });
const s3 = cartReducer(s2, { type: "remove", id: "b" });

console.log(s3.items);
console.log(initial.items.length, s1.items.length);
console.log(s1 === initial, s2.items[0] === s1.items[0], s3.items[0] === s2.items[0]);
console.log(cartReducer(s3, { type: "noop" }) === s3);`,
      expected: "[ { id: 'a', qty: 2 } ]\n1 2\nfalse false true\ntrue",
      hints: ["`switch (action.type)` ও `default: return state`।", "Add এর জন্য: `some` দিয়ে আছে কি না দেখুন; থাকলে `map` (শুধু মিলে যাওয়া item এ `{ ...i, qty: i.qty + 1 }`), নইলে `[...state.items, newItem]`।", "Remove: `filter` — বাকি item এর reference অপরিবর্তিত থাকে।"],
      solution: `function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const exists = state.items.some((i) => i.id === action.id);
      const items = exists
        ? state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { id: action.id, qty: 1 }];
      return { ...state, items };
    }
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    default:
      return state;
  }
}

const initial = { items: [{ id: "a", qty: 1 }] };
const s1 = cartReducer(initial, { type: "add", id: "b" });
const s2 = cartReducer(s1, { type: "add", id: "a" });
const s3 = cartReducer(s2, { type: "remove", id: "b" });

console.log(s3.items);
console.log(initial.items.length, s1.items.length);
console.log(s1 === initial, s2.items[0] === s1.items[0], s3.items[0] === s2.items[0]);
console.log(cartReducer(s3, { type: "noop" }) === s3);`,
      explanation: "`map`/`filter`/spread প্রতিটি নতুন array বা object বানায় কিন্তু বদলায়নি এমন item এর reference রেখে দেয় (structural sharing)। সেজন্য `s3.items[0] === s2.items[0]` সত্য: `remove` ওই item কে ছোঁয়নি। React/Redux পুরোনো-নতুন reference তুলনা করেই বোঝে কী বদলেছে। অজানা action এ একই state ফেরত দিলে অপ্রয়োজনীয় re-render এড়ানো যায়।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোন function pure?",
        options: [
          "`const f = (n) => n * Math.random();`",
          "`const f = (arr) => { arr.push(1); return arr; };`",
          "`const f = (a, b) => { const t = [a, b]; t.sort(); return t; };`",
          "`let k = 2; const f = (n) => n * k;` (যেখানে `k` পরে বদলায়)",
        ],
        answer: 2,
        explanation: "সঠিক: তৃতীয়টি — `t` function এর নিজস্ব local array; তাকে mutate করলে বাইরে কিছু বদলায় না, আর একই `a`, `b` এ ফল একই। প্রথমটি `Math.random()` এর কারণে non-deterministic। দ্বিতীয়টি argument mutate করে। চতুর্থটি লুকানো input (`k`) পড়ে — `k` বদলালে একই `n` এ ভিন্ন ফল।",
      },
      {
        question: "`const sorted = list.sort((a, b) => a - b);` এ কোন সমস্যাটি আছে?",
        options: [
          "`sort` নতুন array দেয়, তাই কোনো সমস্যা নেই",
          "`sort` এ comparator দেওয়া যায় না",
          "`sort` মূল `list` কেই বদলায় এবং `sorted` ও `list` একই reference হয়",
          "`sort` শুধু string এ কাজ করে",
        ],
        answer: 2,
        explanation: "সঠিক: `Array.prototype.sort` in-place; মূল array বদলায় ও একই array ফেরত দেয়। তাই `sorted === list` সত্য, আর মূল data এর ক্রম নষ্ট হয়। ‘নতুন array দেয়’ ভুল — সেটি `toSorted` এর বৈশিষ্ট্য। Comparator দেওয়া যায়, আর `sort` যেকোনো মানেই কাজ করে (default টি string order এ)।",
      },
      {
        question: "`const copy = { ...state }; copy.user.name = \"X\";` চালালে কী হয়?",
        options: [
          "শুধু `copy.user.name` বদলায়; `state` অক্ষত",
          "`state.user.name` ও বদলে যায়, কারণ spread শুধু প্রথম স্তর কপি করে",
          "TypeError, কারণ spread করা object এ লেখা যায় না",
          "`state` ও `copy` এর সব property বদলে যায়",
        ],
        answer: 1,
        explanation: "সঠিক: spread shallow; `user` property এর reference কপি হয়, তাই দুই object এর `user` একই object — একটিতে বদলালে অন্যটিতেও দেখা যায়। প্রথম বিকল্প deep copy ধরে নিয়েছে। TypeError হয় না, কারণ spread এর ফলস্বরূপ object সাধারণ ও লেখার যোগ্য। চতুর্থটি ভুল: `copy` এর প্রথম স্তরের property গুলো `state` থেকে স্বাধীন।",
      },
      {
        question: "Memoization কেন impure function এ বিপজ্জনক?",
        options: [
          "কারণ `Map` impure function এ কাজ করে না",
          "কারণ memoize করা function সবসময় ধীর হয়",
          "কারণ cache শুধু argument দেখে; লুকানো input বদলালে stale ফল আসে এবং side effect আর ঘটে না",
          "কারণ JavaScript impure function কে cache করতে দেয় না",
        ],
        answer: 2,
        explanation: "সঠিক: cache key শুধু argument থেকে বানানো; function যদি global/সময়/random এর ওপর নির্ভর করে তবে cache hit এ পুরোনো ফল ফেরে। আবার cache hit এ function এর ভেতরের side effect (log, request) চলেই না। `Map` এর এতে কোনো ভূমিকা নেই; ধীর হওয়াও কারণ নয় (উল্টোটাই ঘটে); আর JavaScript এ এমন কোনো বিধিনিষেধ নেই — সমস্যাটি যৌক্তিক, ভাষাগত নয়।",
      },
      {
        question: "‘Functional core, imperative shell’ কাঠামোর মূল ধারণা কী?",
        options: [
          "সব কোড pure করতে হবে, I/O ও pure ভাবে লিখতে হবে",
          "ব্যবসায়িক logic pure function এ রেখে I/O ও side effect পাতলা বাইরের স্তরে (shell) রাখা",
          "Side effect শুধু core এ রাখা, shell এ শুধু হিসাব",
          "Class ব্যবহার করে functional style এড়ানো",
        ],
        answer: 1,
        explanation: "সঠিক: pure core (হিসাব, validation, reducer) সহজে test হয়; shell I/O (render, fetch, storage) করে ও core কে data দেয়। প্রথমটি ভুল: কোনো I/O না থাকলে প্রোগ্রাম অর্থহীন, তাই ‘সব pure’ সম্ভব নয়। তৃতীয়টি ভূমিকা উল্টে দিয়েছে। চতুর্থটি প্রাসঙ্গিক নয় — এটি class/function এর বিতর্ক নয়, side effect কোথায় রাখা হবে তার সিদ্ধান্ত।",
      },
    ],
    coding: [
      {
        title: "Immutable `toggleTodo`",
        prompt: "`toggleTodo(todos, id)` নতুন array ফেরত দেবে যেখানে ওই `id` এর todo এর `done` উল্টানো। মূল array ও object কিছুই বদলাবে না; বদলায়নি এমন todo এর reference একই থাকবে।",
        starter: `function toggleTodo(todos, id) {
  // TODO
}

const todos = [
  { id: 1, done: false },
  { id: 2, done: false },
];
const next = toggleTodo(todos, 2);
console.log(next);
console.log(todos[1].done, next[0] === todos[0]);`,
        expected: "[ { id: 1, done: false }, { id: 2, done: true } ]\nfalse true",
        solution: `function toggleTodo(todos, id) {
  return todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
}

const todos = [
  { id: 1, done: false },
  { id: 2, done: false },
];
const next = toggleTodo(todos, 2);
console.log(next);
console.log(todos[1].done, next[0] === todos[0]);`,
      },
      {
        title: "সময় বাইরে থেকে ইনজেক্ট করে `greeting` pure করুন",
        prompt: "`greeting(hour)` লিখুন (`hour` একটি সংখ্যা `0–23`): `12` এর কম হলে `Good morning`, `18` এর কম হলে `Good afternoon`, নইলে `Good evening`। কোনো `Date` ব্যবহার করবেন না — সময় caller (shell) দেবে।",
        starter: `function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : "Good afternoon";
}

console.log(greeting(9));
console.log(greeting(15));
console.log(greeting(21));`,
        expected: "Good morning\nGood afternoon\nGood evening",
        solution: `function greeting(hour) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

console.log(greeting(9));
console.log(greeting(15));
console.log(greeting(21));`,
      },
    ],
  },

  interview: [
    {
      q: "Pure function কাকে বলে? Referential transparency এর সাথে সম্পর্ক কী?",
      a: "Pure function এর দুটি শর্ত: (১) একই argument এ সবসময় একই ফল (deterministic — global অবস্থা, সময়, random, I/O এর ওপর নির্ভরশীল নয়), (২) কোনো observable side effect নেই — argument mutate করে না, global বদলায় না, I/O করে না।\n\nReferential transparency হলো expression এর একটি বৈশিষ্ট্য: expression কে তার ফল দিয়ে প্রতিস্থাপন করলে প্রোগ্রামের আচরণ বদলায় না। Pure function এর call সর্বদা referentially transparent। এ কারণেই pure call গুলো নিরাপদে cache, পুনর্বিন্যাস, parallel বা lazy ভাবে চালানো যায়। Function এর ভেতরের local mutation (যেমন নিজের বানানো array তে `push`) বাইরে থেকে দেখা যায় না, তাই তাতে purity নষ্ট হয় না।",
    },
    {
      q: "নিচের কোডে কী কী impurity আছে এবং কীভাবে ঠিক করবেন? `function addToCart(cart, item) { cart.items.push(item); cart.updatedAt = Date.now(); console.log('added'); return cart; }`",
      a: "চারটি impurity: (১) `cart.items.push(item)` — argument mutation; (২) `cart.updatedAt = ...` — argument mutation; (৩) `Date.now()` — লুকানো input (প্রতিবার ভিন্ন); (৪) `console.log` — I/O side effect।\n\nসমাধান: সময় parameter করুন, নতুন object ফেরত দিন, log shell এ নিন: `function addToCart(cart, item, now) { return { ...cart, items: [...cart.items, item], updatedAt: now }; }`। Shell এ: `const next = addToCart(cart, item, Date.now()); console.log('added'); render(next);`। এখন core টি যেকোনো `now` দিয়ে test করা যায়, আর `cart` অক্ষত থাকে। নতুন object ফেরত দিলে React state এ reference পরিবর্তন ধরা পড়ে — এটি React এর জন্যও দরকারি।",
    },
    {
      q: "`Object.freeze` কি deep immutability দেয়? কীভাবে nested data নিরাপদ রাখবেন?",
      a: "না। `Object.freeze` শুধু প্রথম স্তর (shallow) জমাট করে: property যোগ, মুছে ফেলা ও পরিবর্তন আটকায়, কিন্তু ভেতরের nested object/array এখনো বদলানো যায়। Strict mode এ frozen object এ লিখলে `TypeError`, sloppy mode এ নীরবে ব্যর্থ। (ES module ও class body সবসময় strict।)\n\nNested data নিরাপদ রাখার উপায়: (১) আপডেটের সময় যে path বদলায় তার প্রতিটি স্তর spread/`map`/`filter` দিয়ে নতুন করে (structural sharing); (২) development এ recursive `deepFreeze` দিয়ে accidental mutation ধরা; (৩) জটিল nested state এ Immer এর মতো library (যা ‘mutation-সদৃশ’ লেখাকে immutable update এ রূপ দেয়); (৪) `structuredClone` দিয়ে deep copy — তবে ব্যয়বহুল এবং function ক্লোন করে না। সাধারণ নীতি: freeze কে bug ধরার জাল ভাবুন, অ্যাপের ডিজাইনের বিকল্প নয়।",
    },
    {
      q: "Memoization কীভাবে কাজ করে এবং কেন শুধু pure function এর জন্য নিরাপদ?",
      a: "Memoize wrapper একটি cache (সাধারণত `Map`) রাখে; argument থেকে key বানিয়ে দেখে ফল আগে গণনা হয়েছে কি না। হলে cache থেকে ফেরত দেয়, নইলে মূল function চালিয়ে ফল cache এ রাখে। Cache টি closure তে থাকে।\n\nএটি তখনই সঠিক যখন ‘একই key → একই ফল’ — অর্থাৎ function pure। Function লুকানো input (global, সময়, random) এর ওপর নির্ভর করলে cache stale ফল দেয়; আর side effect থাকলে (log, request, mutation) cache hit এ তা আর ঘটে না, ফলে আচরণ বদলে যায়। আরও সতর্কতা: key বানানো (`JSON.stringify` সব ধরনের argument এ ভরসাযোগ্য নয়), cache এর আকার সীমিত না রাখলে memory leak, আর argument হিসেবে object দিলে reference নাকি মান দিয়ে key — এই সিদ্ধান্ত। React এর `useMemo` ও `React.memo` একই ধারণা, কিন্তু সেখানে dependency array ও render purity এর ওপর নির্ভর করে।",
    },
    {
      q: "React এ ‘render অবশ্যই pure হতে হবে’ বলতে কী বোঝায়, এবং এটি reducer এর সাথে কীভাবে যুক্ত?",
      a: "React ধরে নেয় একটি component কে একই props, state ও context দিয়ে ডাকলে একই JSX পাওয়া যাবে এবং render চলাকালে বাইরের কিছু বদলাবে না। এই অনুমানের ওপর ভর করেই React ইচ্ছামতো render স্থগিত, পুনরায় চালানো বা (development এ Strict Mode এ) দুইবার চালানোর সুযোগ পায়। Render এর ভেতরে global লেখা, props/state mutate করা, DOM বদলানো বা `fetch` করলে এই অনুমান ভাঙে এবং অদ্ভুত bug হয়। Side effect এর জায়গা event handler বা `useEffect`।\n\nReducer (`useReducer`, Redux) এর একই শর্ত: `(state, action) => newState` pure হতে হবে — state mutate না করে নতুন object ফেরত দেবে। কারণ React/Redux পরিবর্তন শনাক্ত করে reference তুলনা করে; mutation হলে reference একই থাকে, UI আপডেট হয় না। আবার pure হওয়ায় reducer কে UI ছাড়াই unit test করা যায়, ও time-travel debugging সম্ভব হয় — এটাই ‘functional core’ এর ব্যবহারিক রূপ।",
    },
    {
      q: "সব function pure করা কি সম্ভব বা উচিত? বাস্তব প্রজেক্টে সীমানা কীভাবে টানেন?",
      a: "সম্ভব নয়, উচিতও নয়: যে প্রোগ্রাম কোনো side effect করে না সে ব্যবহারকারীকে কিছু দেখায় না, কিছু সংরক্ষণ করে না। আসল অ্যাপের মূল্যই I/O তে — data আনা, DB তে লেখা, UI আঁকা। তাই লক্ষ্য ‘সব pure’ নয়, বরং ‘side effect কে ছোট, সুস্পষ্ট ও কিনারায় রাখা’।\n\nব্যবহারিক কাঠামো: functional core, imperative shell। হিসাব, validation, রূপান্তর, state transition (reducer), formatting — pure function এ; fetch, render, storage, logging, timer — shell এ, যেখানে pure core কে data দেওয়া ও ফল প্রয়োগ করা হয়। এতে লাভ: business logic mock ছাড়া test হয়, bug এর জায়গা ছোট হয়, আর I/O প্রযুক্তি (REST থেকে GraphQL) বদলালেও core অক্ষত থাকে। কখনো কখনো কর্মক্ষমতার কারণে ইচ্ছা করেই mutation বেছে নেওয়া হয় (হট loop এ), তবে সেটি function এর ভেতরে সীমাবদ্ধ রেখে (local mutation) বাইরে pure interface বজায় রাখা যায়।",
    },
  ],

  summary: {
    takeaways: [
      "Pure function = একই input → একই output **এবং** কোনো side effect নেই; এই দুই শর্তই আবশ্যক।",
      "Impurity এর উৎস: argument mutation, global পড়া/লেখা, `Date`/`Math.random`, I/O (এবং `console.log`)। Function এর নিজস্ব local mutation impure নয়।",
      "Refactor: লুকানো input কে parameter করুন; mutate না করে নতুন মান ফেরত দিন (spread, `map`, `filter`, `toSorted`, `toSpliced`, `with`); যে path বদলায় শুধু সেটুকু copy করুন।",
      "Spread ও `Object.freeze` shallow — nested data এর প্রতিটি স্তরে আলাদা copy লাগে (`structuredClone` deep, কিন্তু ব্যয়বহুল)।",
      "Memoization শুধু pure function এ নিরাপদ; impure এ stale ফল আসে ও side effect বাদ পড়ে।",
      "React এ render, reducer ও updater function pure হতে হয়; side effect যায় handler/`useEffect` এ।",
      "Functional core, imperative shell: logic pure, I/O পাতলা বাইরের স্তরে — test ও রক্ষণাবেক্ষণ সহজ।",
    ],
    syntax: `// pure + immutable update
const updated = { ...user, address: { ...user.address, city } };
const added = [...list, item];
const sorted = list.toSorted(cmp);   // ES2023
const replaced = list.with(2, value);
const removed = list.toSpliced(1, 1);

// reducer শৈলী
const reducer = (state, action) => {
  switch (action.type) {
    case "add": return { ...state, items: [...state.items, action.item] };
    default: return state;
  }
};`,
    whenToUse: [
      "Business logic, calculation, validation, formatting, reducer — সবসময় pure রাখার চেষ্টা করুন (test সহজ, reuse নিরাপদ)।",
      "UI state ও React props/state নিয়ে কাজ করলে — mutation এড়িয়ে নতুন reference বানান।",
      "যেখানে I/O অনিবার্য (fetch, DOM, storage), সেটিকে পাতলা shell এ আলাদা করুন; হট path এ মেপে দেখে প্রয়োজনে local mutation করুন।",
    ],
    next: [
      "Scope ও Closures — memoize ও factory এর অবস্থা কোথায় থাকে।",
      "Arrays (Module 03) — `map/filter/reduce`, `toSorted` ও অন্যান্য non-mutating method বিস্তারিত।",
      "Objects ও immutability — `structuredClone`, deep copy ও Immer-এর ধারণা।",
      "Async JavaScript — side effect এর সবচেয়ে সাধারণ উৎস (network) কীভাবে সামলাবেন।",
    ],
  },

  compatibility:
    "Pure function একটি ডিজাইন নীতি — ভাষাগতভাবে সব runtime এ একই। Spread (`...`) ও `Object.freeze` সব আধুনিক browser ও Node.js এ আছে। ES2023 এর `toSorted`, `toReversed`, `toSpliced`, `with` Node.js 20+ ও সাম্প্রতিক browser এ আছে (পুরোনো runtime এ `[...arr].sort()` ইত্যাদি ব্যবহার করুন; ব্যবহারের আগে নিজের target browser টেবিল দেখুন)। `structuredClone` আধুনিক browser ও Node.js 17+ এ আছে এবং function ক্লোন করতে পারে না। Frozen object এ লেখার আচরণ strict mode এ `TypeError`, sloppy mode এ নীরব ব্যর্থতা; ES module ও class body সবসময় strict। React Strict Mode এর double-invoke আচরণ শুধু development এ এবং version-নির্ভর।",
};
