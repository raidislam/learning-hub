import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Higher-order function (HOF) এর সংজ্ঞা — ‘function নেয়’ অথবা ‘function return করে’ — এবং কেন এটি সম্ভব তা ব্যাখ্যা করতে পারবেন।",
    "`map`, `filter`, `reduce`, `sort`, `forEach` এর মূল ধারণা বুঝে নিজে `map`/`filter` লিখতে পারবেন (Module 03 এ এগুলো বিস্তারিত শিখব)।",
    "Function factory, **closure** দিয়ে অবস্থা মনে রাখা এবং currying/partial application এর মধ্যে পার্থক্য করতে পারবেন।",
    "`compose`/`pipe`, এবং decorator/wrapper (`once`, logging, retry, debounce) লিখে function এর আচরণ বদলাতে পারবেন।",
    "HOF এর খরচ ও readability এর trade-off বুঝে কখন ব্যবহার করবেন তা সিদ্ধান্ত নিতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Higher-order function কাকে বলে?" },
    {
      type: "p",
      text: "যে function নিচের দুটির **যেকোনো একটি** করে, সেটিই **higher-order function (HOF)**: (১) এক বা একাধিক function কে **argument হিসেবে নেয়**, অথবা (২) একটি function কে **return value হিসেবে ফেরত দেয়**। যে function গুলো HOF এর ভেতরে পাঠানো/ফেরত আসে, সেগুলো সাধারণ function ই — শুধু ‘সাধারণ মানের’ মতো ব্যবহৃত হচ্ছে।",
    },
    {
      type: "p",
      text: "Callbacks lesson এ দেখেছি function কে argument হিসেবে পাঠানো যায়। HOF হলো সেই ধারণার পরবর্তী ধাপ: callback নেওয়া function টিই HOF (`forEach`, `sort`, `setTimeout`), আবার যে function নতুন function বানিয়ে ফেরত দেয় (`makeMultiplier`, `once`, `debounce`) সেটিও HOF। কারণ JavaScript এ function **first-class value** — তাকে variable এ রাখা, argument হিসেবে দেওয়া, return করা সবই চলে।",
    },
    {
      type: "code",
      caption: "দুই ধরনের HOF: (১) function নেয়, (২) function ফেরত দেয়।",
      code: `// (১) function নেয়
function applyTwice(fn, x) {
  return fn(fn(x));
}
console.log(applyTwice((n) => n + 3, 10)); // 16

// (২) function ফেরত দেয় (function factory)
function makeMultiplier(factor) {
  return (n) => n * factor;
}
const double = makeMultiplier(2);
console.log(double(21)); // 42`,
    },
    { type: "h3", text: "কেন HOF দরকার? — সমস্যা যা সমাধান হয়" },
    {
      type: "p",
      text: "ধরুন তিনটি loop আছে: একটি সবার দাম দ্বিগুণ করে, একটি সস্তা আইটেম ছাঁকে, একটি যোগফল বের করে। তিনটিতেই ‘array ঘোরানো’ কোড একই, শুধু **মাঝখানের ছোট অংশ** আলাদা। HOF দিয়ে ‘ঘোরানো’ অংশকে একবার লিখে ফেলা যায় আর ‘আলাদা অংশ’ টি callback হিসেবে পাঠানো যায়। এতে: **duplication কমে**, কোড ‘কীভাবে’ এর বদলে ‘কী চাই’ বলে (declarative), আর **আচরণ পুনর্ব্যবহারযোগ্য** হয় (একই `retry` যেকোনো function কে মুড়ে দেওয়া যায়)।",
    },
    { type: "h3", text: "Built-in HOF: একটি পূর্বাভাস" },
    {
      type: "p",
      text: "Array এর `map`, `filter`, `reduce`, `sort`, `forEach` সবই HOF। এখানে শুধু ধারণাটি দেখে নিচ্ছি — Module 03 (Arrays) এ প্রতিটির edge case, performance ও ব্যবহারবিধি বিস্তারিত আছে।",
    },
    {
      type: "compare",
      headers: ["Method", "Callback এর কাজ", "কী ফেরত দেয়", "মূল array বদলায়?"],
      rows: [
        ["`map(fn)`", "প্রতিটি element কে নতুন মানে রূপান্তর", "একই দৈর্ঘ্যের নতুন array", "না"],
        ["`filter(fn)`", "রাখব কি না (true/false)", "ছোট (বা সমান) নতুন array", "না"],
        ["`reduce(fn, init)`", "accumulator এ element জমা", "একটি মান (যেকোনো type)", "না"],
        ["`forEach(fn)`", "প্রতিটি element এ side effect", "`undefined`", "callback চাইলে বদলাতে পারে"],
        ["`sort(cmp)`", "দুটি element এর ক্রম ঠিক করা", "**একই array** (in-place)", "**হ্যাঁ** (mutate করে)"],
      ],
    },
    {
      type: "code",
      code: `const prices = [120, 80, 45, 200];

const withTax = prices.map((p) => p * 1.1);          // রূপান্তর
const cheap = prices.filter((p) => p < 100);         // বাছাই
const total = prices.reduce((sum, p) => sum + p, 0); // জমা করা

console.log(cheap, total);`,
    },
    { type: "h3", text: "নিজের `map` ও `filter` লেখা" },
    {
      type: "p",
      text: "Built-in HOF কোনো যাদু নয়। ভেতরে সাধারণ loop আর callback call। নিজে লিখলে বোঝা যায় callback কী কী argument পায় (element, index, array) এবং কেন এগুলো ‘নতুন array’ বানায়। (বাস্তব `Array.prototype.map` এর spec আরও কিছু কাজ করে — যেমন sparse array হ্যান্ডেল, `thisArg` — নিচেরটি শিক্ষামূলক সরলীকরণ।)",
    },
    {
      type: "code",
      code: `function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(fn(arr[i], i, arr));
  }
  return out;
}

function myFilter(arr, predicate) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i, arr)) out.push(arr[i]);
  }
  return out;
}

console.log(myMap([1, 2, 3], (n) => n * 10));
console.log(myFilter([1, 2, 3, 4], (n) => n % 2 === 0));`,
    },
    { type: "h3", text: "Function factory ও closure" },
    {
      type: "p",
      text: "যে HOF function **ফেরত দেয়**, সেই ফেরত-আসা function টি তার জন্মস্থানের variable গুলো মনে রাখে — একে **closure** বলে (Scope ও Closures lesson এ বিস্তারিত)। `makeMultiplier(2)` শেষ হয়ে গেলেও ফেরত আসা arrow function টি `factor = 2` ধরে রাখে, কারণ সে ওই variable টিকে reference করছে। প্রতিবার `makeMultiplier` call এ **নতুন** একটি environment তৈরি হয়, তাই `double` ও `triple` আলাদা `factor` মনে রাখে। Closure ছাড়া function factory অসম্ভব।",
    },
    { type: "h3", text: "Currying ও Partial application" },
    {
      type: "p",
      text: "**Partial application**: একটি function এর কিছু argument আগে দিয়ে রেখে নতুন function বানানো (বাকি argument পরে আসবে)। **Currying**: `f(a, b, c)` কে `f(a)(b)(c)` — এক argument নেওয়া function এর শৃঙ্খলে রূপান্তর। দুটো একই নয়, কিন্তু ঘনিষ্ঠ: curried function এর প্রতিটি ধাপই একধরনের partial application। উপযোগিতা: সাধারণ-উদ্দেশ্য function থেকে নির্দিষ্ট-উদ্দেশ্য function বানানো (`const isAdult = greaterThan(18)`)।",
    },
    {
      type: "code",
      code: `const add = (a) => (b) => a + b;          // হাতে-লেখা curry
const add10 = add(10);
console.log(add10(5), add(1)(2));

// partial application: bind এর extra argument ও ব্যবহার করা যায়
function volume(l, w, h) { return l * w * h; }
const flatBox = volume.bind(null, 10, 10);  // l, w ঠিক করা
console.log(flatBox(2));`,
    },
    { type: "h3", text: "Composition: `compose` ও `pipe`" },
    {
      type: "p",
      text: "ছোট ছোট function কে জুড়ে বড় function বানানোই **composition**। `pipe(f, g, h)(x)` মানে `h(g(f(x)))` — বাম থেকে ডানে পড়া যায়। `compose(f, g, h)(x)` মানে `f(g(h(x)))` — গাণিতিক ক্রম (ডান থেকে বাম)। প্রতিটি ধাপ একটি মান নেয় ও একটি মান ফেরত দেয় — তাই function গুলো ছোট, একমুখী ও আলাদাভাবে test করা সহজ হয়।",
    },
    {
      type: "code",
      code: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

const trim = (s) => s.trim();
const lower = (s) => s.toLowerCase();
const slug = (s) => s.replaceAll(" ", "-");

const makeSlug = pipe(trim, lower, slug);
console.log(makeSlug("  Higher Order Functions "));
console.log(compose(slug, lower, trim)("  Same Result "));`,
    },
    { type: "h3", text: "Decorator / wrapper: function মুড়ে আচরণ যোগ করা" },
    {
      type: "p",
      text: "একটি function নিয়ে তার চারপাশে **একই signature এর নতুন function** বানিয়ে আগে/পরে কিছু কাজ যোগ করা যায় — logging, caching, retry, rate-limit, error reporting। মূল function বদলাতে হয় না। উৎকৃষ্ট wrapper এর নিয়ম: (১) সব argument পাঠাও (`...args`), (২) **return value ফেরত দাও**, (৩) প্রয়োজনে `this` বজায় রাখো (`fn.apply(this, args)`)। এর একটিও ভুলে গেলে মুড়ে দেওয়া function ভেঙে যায়।",
    },
    {
      type: "code",
      caption: "`once`, `withLogging`, এবং fake failing function এর জন্য `retry`। Timing ও random ছাড়াই দেখানো।",
      code: `function once(fn) {
  let called = false, result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

function withLogging(fn, log) {
  return function (...args) {
    log.push("call " + fn.name + "(" + args.join(", ") + ")");
    const result = fn.apply(this, args);
    log.push("-> " + result);
    return result;
  };
}

function retry(fn, times) {
  return function (...args) {
    let lastError;
    for (let i = 0; i < times; i++) {
      try { return fn.apply(this, args); }
      catch (e) { lastError = e; }
    }
    throw lastError;
  };
}`,
    },
    {
      type: "p",
      text: "**Debounce** (দেরি করে চালানো, ক্রমাগত call এ আগেরটি বাতিল) একটি জনপ্রিয় HOF: সার্চ বক্সে ব্যবহারকারী টাইপ করতে থাকলে প্রতি keystroke এ API call না করে, থামার ~৩০০ ms পরে একবার call। ভেতরে একটি `timerId` closure তে রাখা হয়: নতুন call এলে পুরোনো timer `clearTimeout` করে নতুন timer বসে। **Throttle** আলাদা: নির্দিষ্ট সময়ে সর্বোচ্চ একবার চালায় (scroll/resize এ ব্যবহৃত)। Production এ সাধারণত পরীক্ষিত library (যেমন lodash) ব্যবহার করা হয়, কারণ leading/trailing/cancel/flush এর মতো edge case অনেক।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Closure এর ফাঁদ: debounce/once প্রতিবার নতুন করে বানাবেন না",
      text: "`const debounced = debounce(save, 300)` কে **একবার** বানাতে হয়। প্রতিটি event এ `debounce(save, 300)(value)` লিখলে প্রতিবার নতুন closure (নতুন `timerId`) তৈরি হয়, আগের timer কেউ বাতিল করে না — debounce কাজই করে না। React এ একই কারণে debounced function কে component এর ভেতরে প্রতি render এ নতুন করে না বানিয়ে `useMemo`/`useRef`/`useCallback` দিয়ে স্থিতিশীল রাখতে হয় (শুধু ধারণা; hook এর বিস্তারিত React course এ)।",
    },
    { type: "h3", text: "React এর সাথে সম্পর্ক (ধারণাগত)" },
    {
      type: "ul",
      items: [
        "**Higher-Order Component (HOC)**: component নেয়, নতুন component ফেরত দেয় — `withAuth(Page)`। ধারণা একই: wrapper দিয়ে আচরণ (auth check, data) যোগ। আজ বেশিরভাগ ক্ষেত্রে custom hook এ এই কাজ করা হয়, তবে HOC এখনো পুরোনো কোড ও library (যেমন `memo`, `forwardRef` ধরনের wrapper) তে আছে।",
        "**Hooks**: `useCallback(fn, deps)` ও `useMemo(() => value, deps)` function নেয় — React এর কাছে ‘function value’ হিসেবে। `useState` এর `setState(prev => next)` তে updater function পাঠানো হয়; আর `useEffect` এর cleanup function return করা — সবই HOF এর ধারণা।",
        "**Event handler factory**: `const handleChange = (field) => (e) => setForm(...)` — একটি function যা handler return করে (currying)।",
        "**Array method in JSX**: `items.map(item => <Row key={item.id} />)` — `map` একটি HOF।",
      ],
    },
    {
      type: "code",
      caption: "React/JSX — শুধু ধারণা দেখানোর জন্য, এই sandbox এ চালানো যায় না (JSX ও React দরকার)।",
      code: `// ধারণাগত snippet (চালানো হবে না)
function withLoading(Component) {
  return function Wrapped(props) {
    if (props.loading) return <p>Loading...</p>;
    return <Component {...props} />;
  };
}
const UserListWithLoading = withLoading(UserList);`,
    },
    { type: "h3", text: "খরচ ও readability: কখন HOF ব্যবহার করবেন না" },
    {
      type: "ul",
      items: [
        "**Debuggability**: গভীর wrapper chain এ stack trace লম্বা হয়, error কোথায় তা বোঝা কঠিন; wrapper গুলোকে নাম দিন (`function withLogging...`) যাতে stack এ পড়া যায়।",
        "**Performance**: HOF নিজে সাধারণত যথেষ্ট দ্রুত; আধুনিক engine সরল callback inline ও optimize করে (আচরণ engine ভেদে ভিন্ন)। তবে হট path এ (লাখ লাখ iteration) একাধিক `map().filter().map()` মধ্যবর্তী array বানায় — তখন একটি loop বা একটি `reduce` ভাবুন। **আগে মাপুন, তারপর optimize করুন।**",
        "**Readability**: `pipe(a, b, c)` সুন্দর, কিন্তু ৮ স্তরের curry/compose ও point-free style টিমের অনেকে বুঝবে না। একটি সরল `for...of` কখনো বেশি পরিষ্কার।",
        "**Abstraction এর দাম**: এক জায়গায় মাত্র একবার লাগে এমন কাজের জন্য আলাদা HOF বানানোর দরকার নেই; তৃতীয়বার একই ধরন দেখলে তখন বের করুন।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Common misconceptions",
      text: "(১) ‘HOF মানে কেবল `map/filter/reduce`’ — না, যেকোনো function যা function নেয় বা ফেরত দেয়, `setTimeout` ও HOF। (২) ‘`map` এ callback এর শুধু একটি argument থাকে’ — তিনটি: element, index, array (`[\"1\",\"2\"].map(parseInt)` এর বিখ্যাত bug এখান থেকে)। (৩) ‘`sort` নতুন array দেয়’ — না, in-place mutate করে (`toSorted` নতুন array দেয়)। (৪) ‘Currying আর partial application একই’ — না। (৫) ‘`forEach` এ `return` দিয়ে loop থামানো যায়’ — যায় না। (৬) ‘Arrow function দিয়ে বানানো wrapper এ `this` বজায় থাকে’ — arrow এর নিজের `this` নেই, তাই method wrapper এ সাধারণ `function` ও `apply(this, args)` লাগে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **কফি মেশিন** (কিন্তু যার ফিল্টার ও সেটিংস বদলানো যায়) এবং একটি **কারখানার প্রোডাকশন লাইন** কল্পনা করুন।",
    },
    {
      type: "ul",
      items: [
        "**Function নেওয়া HOF** = সেই কফি মেশিন যা ‘রেসিপি কার্ড’ ঢোকালে সেই অনুযায়ী কফি বানায়। মেশিন (`map`/`sort`) একই; কার্ড (callback) বদলালে ফল বদলায়। মেশিন জানে ‘কীভাবে ঘোরাতে হয়’, কার্ড জানে ‘কী বানাতে হবে’।",
        "**Function ফেরত দেওয়া HOF** = একটি **ছাঁচ-প্রস্তুতকারী** কারখানা (`makeMultiplier`)। ‘গুণক ২’ বললে সে একটি আলাদা যন্ত্র বানিয়ে দেয় যা সবসময় দ্বিগুণ করে। যন্ত্রের ভেতরে ‘২’ সেট করা থাকে — এটাই closure।",
        "**`pipe`/`compose`** = প্রোডাকশন লাইন: কাঁচামাল (input) প্রথম স্টেশনে (`trim`), তারপর দ্বিতীয় (`lower`), তারপর তৃতীয় (`slug`)। প্রতিটি স্টেশন ছোট ও একটিমাত্র কাজ করে; আপনি স্টেশন বদলে নতুন লাইন বানাতে পারেন।",
        "**Decorator/wrapper** = পণ্যের ওপর **প্যাকেজিং** — ভেতরের জিনিস একই, বাইরে সিল (logging), বীমা (retry) বা ওয়ারেন্টি কার্ড (caching) যোগ হলো। ভালো প্যাকেজিং ভেতরের জিনিস পৌঁছে দেয় (return value), না দিলে গ্রাহক খালি বাক্স পায় (return ভুলে যাওয়ার bug)।",
        "**Currying** = আজকের ডেলিভারি ফর্ম একটি একটি করে পূরণ: আগে ঠিকানা (প্রথম argument), পরে ফোন নম্বর, পরে পেমেন্ট। **Partial application** = ঠিকানা আগে ভরে রাখা ফর্ম যেটি বারবার ব্যবহার করা যায়।",
        "**Debounce** = লিফটের দরজা: কেউ ঢুকতে থাকলে দরজা বন্ধের কাউন্টডাউন আবার শুরু হয়; কেউ না এলে তবেই বন্ধ হয় (একবার চালায়)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Function factory: প্রতিটি call এর নিজস্ব `factor`",
      caption: "`makeMultiplier` প্রতিবার নতুন environment তৈরি করে; ফেরত আসা function নিজের environment মনে রাখে।",
      code: "function makeMultiplier(factor) {\n  return (n) => n * factor;\n}\nconst double = makeMultiplier(2);\nconst triple = makeMultiplier(3);\nconsole.log(double(5), triple(5));",
      steps: [
        {
          line: 0,
          memory: [
            { name: "makeMultiplier", value: "ƒ (factor)", kind: "value", state: "live" },
            { name: "double", value: "", kind: "const", state: "tdz" },
            { name: "triple", value: "", kind: "const", state: "tdz" },
          ],
          note: "Function declaration hoist হয়ে আগেই তৈরি। `double`/`triple` `const` তাই declaration লাইন পর্যন্ত TDZ তে।",
        },
        {
          line: 3,
          memory: [
            { name: "makeMultiplier", value: "ƒ (factor)", kind: "value", state: "live" },
            { name: "factor (env #1)", value: "2", kind: "value", state: "live" },
            { name: "double", value: "ƒ (n) → n * factor  [env #1]", kind: "const", state: "live" },
            { name: "triple", value: "", kind: "const", state: "tdz" },
          ],
          note: "`makeMultiplier(2)` চলল: নতুন environment (#1) যেখানে `factor = 2`। ভেতরের arrow function সেই environment এর reference ধরে নিয়ে ফেরত এল। call শেষ হলেও environment #1 বেঁচে থাকে, কারণ `double` তাকে ধরে আছে।",
        },
        {
          line: 4,
          memory: [
            { name: "makeMultiplier", value: "ƒ (factor)", kind: "value", state: "live" },
            { name: "factor (env #1)", value: "2", kind: "value", state: "live" },
            { name: "factor (env #2)", value: "3", kind: "value", state: "live" },
            { name: "double", value: "ƒ (n) → n * factor  [env #1]", kind: "const", state: "live" },
            { name: "triple", value: "ƒ (n) → n * factor  [env #2]", kind: "const", state: "live" },
          ],
          note: "দ্বিতীয় call এ **নতুন** environment (#2), `factor = 3`। দুটি function এর কোড একই, কিন্তু তারা আলাদা environment ধরে আছে — তাই আচরণ আলাদা।",
        },
        {
          line: 5,
          memory: [
            { name: "double", value: "ƒ [env #1: factor=2]", kind: "const", state: "live" },
            { name: "triple", value: "ƒ [env #2: factor=3]", kind: "const", state: "live" },
          ],
          output: "10 15",
          note: "`double(5)` এ `n = 5`, `factor` খোঁজা হয় env #1 এ → `2` → `10`। `triple(5)` এ env #2 → `3` → `15`।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "pipe: মান এক function থেকে আরেক function এ বয়ে যায়",
      caption: "`pipe(add1, double, square)(2)` — প্রতিটি ধাপের output পরের ধাপের input।",
      nodes: [
        { id: "in", label: "Input", sub: "x = 2" },
        { id: "f", label: "add1", sub: "n + 1" },
        { id: "g", label: "double", sub: "n * 2" },
        { id: "h", label: "square", sub: "n * n" },
        { id: "out", label: "Result" },
      ],
      steps: [
        { active: ["in"], items: { in: ["2"] }, note: "`pipe(...)` শুরুতে function গুলোর তালিকা জমা রাখে (closure)। `(2)` দিয়ে ডাকলে `reduce` শুরু হয়, `acc = 2`।" },
        { active: ["f"], items: { in: ["2"], f: ["add1(2) = 3"] }, note: "প্রথম function: `add1(2)` → `3`। এটি নতুন `acc`।" },
        { active: ["g"], items: { f: ["3"], g: ["double(3) = 6"] }, note: "দ্বিতীয় function `acc = 3` নিয়ে `6` দেয়। `double` জানে না আগে কী ছিল — প্রতিটি function স্বাধীন, তাই আলাদা test করা সহজ।" },
        { active: ["h"], items: { g: ["6"], h: ["square(6) = 36"] }, note: "তৃতীয় function `6` নিয়ে `36` দেয়।" },
        { active: ["out"], items: { out: ["36"] }, output: "36", note: "শেষ `acc = 36` ই `pipe` এর ফল। `compose` একই কাজ করে কিন্তু function তালিকা **উল্টো দিক থেকে** (`reduceRight`)।" },
      ],
    },
    {
      kind: "flow-steps",
      title: "Decorator: wrapper কীভাবে মূল function কে ঘিরে থাকে",
      caption: "`const safeAdd = withLogging(add)` এর পর `safeAdd(2, 3)` call এর পথ।",
      nodes: [
        { id: "caller", label: "Caller", sub: "safeAdd(2, 3)" },
        { id: "wrapper", label: "Wrapper", sub: "withLogging এর ফেরত function" },
        { id: "orig", label: "Original", sub: "add(2, 3)" },
        { id: "log", label: "Log", sub: "side effect" },
      ],
      steps: [
        { active: ["caller", "wrapper"], items: { wrapper: ["args = [2, 3]"] }, note: "Caller ভাবে সে `add` ই ডাকছে, কিন্তু আসলে wrapper টি চলছে। `...args` দিয়ে সব argument ধরা হলো।" },
        { active: ["wrapper", "log"], items: { log: ["call add(2, 3)"] }, note: "আগের কাজ (before): log এ লেখা।" },
        { active: ["wrapper", "orig"], items: { orig: ["return 5"] }, note: "মূল function কে একই argument (এবং প্রয়োজনে একই `this`) দিয়ে ডাকা হলো। ফল `5`।" },
        { active: ["wrapper", "log"], items: { log: ["call add(2, 3)", "-> 5"] }, note: "পরের কাজ (after): ফল log এ।" },
        { active: ["wrapper", "caller"], items: { caller: ["পেল 5"] }, output: "5", note: "সবশেষে wrapper কে অবশ্যই **`return result`** করতে হবে — না করলে caller পায় `undefined`। এটি decorator এর সবচেয়ে সাধারণ bug।" },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Function নেওয়া ও ফেরত দেওয়া HOF, এবং `map/filter/reduce` এর স্বাদ",
      description: "দুই ধরনের HOF পাশাপাশি। মনে রাখুন, নিচের array method গুলো নতুন array বানায়, মূল array অক্ষত রাখে।",
      code: `function applyTwice(fn, x) {
  return fn(fn(x));
}
console.log(applyTwice((n) => n + 3, 10));

function makeGreeter(greeting) {
  return (name) => greeting + ", " + name + "!";
}
const hello = makeGreeter("Hello");
const salaam = makeGreeter("আসসালামু আলাইকুম");
console.log(hello("Rina"));
console.log(salaam("Mim"));

const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter((n) => n % 2 === 0);
const squares = evens.map((n) => n * n);
const sum = squares.reduce((acc, n) => acc + n, 0);
console.log(evens, squares, sum);
console.log(numbers); // মূল array অপরিবর্তিত`,
    },
    {
      level: "intermediate",
      title: "নিজের map/filter, curry, এবং compose বনাম pipe",
      description: "Built-in এর কার্যপ্রণালী নিজে লিখে বোঝা; তারপর curry ও দুই ধরনের composition এর ক্রম মিলিয়ে দেখা।",
      code: `function myMap(arr, fn) {
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
  return out;
}
function myFilter(arr, pred) {
  const out = [];
  for (let i = 0; i < arr.length; i++) if (pred(arr[i], i, arr)) out.push(arr[i]);
  return out;
}
console.log(myMap(["a", "b"], (s, i) => s + i));
console.log(myFilter([5, 12, 8, 130], (n) => n >= 10));

// curry + partial application
const greaterThan = (limit) => (n) => n > limit;
const isAdult = greaterThan(17);
console.log([12, 18, 30, 7].filter(isAdult));

// compose (ডান থেকে বামে) বনাম pipe (বাম থেকে ডানে)
const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);
const compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);
const add1 = (n) => n + 1;
const double = (n) => n * 2;
console.log(pipe(add1, double)(5));     // double(add1(5))
console.log(compose(add1, double)(5));  // add1(double(5))`,
    },
    {
      level: "real-world",
      title: "Production-style wrapper: once + logging + retry + debounce",
      description: "UI ও service layer এ বারবার লাগা wrapper গুলো। Timing মাপা বা random নেই — fake failing function ও call-সংখ্যা দিয়ে আচরণ দেখানো হয়েছে। Debounce এর timer এর ক্রম deterministic।",
      code: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

function withLogging(fn, log) {
  return function (...args) {
    log.push("call " + fn.name + "(" + args.join(", ") + ")");
    const result = fn.apply(this, args);
    log.push("-> " + result);
    return result;
  };
}

function retry(fn, times) {
  return function (...args) {
    let lastError;
    for (let attempt = 1; attempt <= times; attempt++) {
      try {
        return fn.apply(this, args);
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError;
  };
}

function debounce(fn, ms) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), ms);
  };
}

// once: ভারী initialization একবারই
const init = once(() => { console.log("initializing..."); return 42; });
console.log(init(), init(), init());

// retry: প্রথম দুইবার ব্যর্থ, তৃতীয়বার সফল
let attempts = 0;
function flaky(x) {
  attempts++;
  if (attempts < 3) throw new Error("temporary failure");
  return x * 2;
}
const log = [];
const reliable = withLogging(retry(flaky, 5), log);
console.log(reliable(21), "after", attempts, "attempts");
console.log(log);

// retry সব চেষ্টা শেষ হলে error ছোঁড়ে
attempts = -10;
try { retry(flaky, 2)(1); } catch (e) { console.log("gave up:", e.message); }

// debounce: ঘনঘন call এ শেষটিই চলে
const search = debounce((q) => console.log("search:", q), 10);
search("j"); search("ja"); search("jav");
setTimeout(() => search("javascript"), 40);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
const makeAdder = (n) => (x) => x + n;
console.log(makeAdder(10)(5));
`,
    },
    {
      label: "map এ parseInt এর বিখ্যাত ফাঁদ",
      code: `// map callback কে তিনটি argument দেয়: (element, index, array)
console.log(["1", "2", "3"].map(parseInt));            // parseInt(string, radix) — index টি radix হয়ে যায়
console.log(["1", "2", "3"].map((s) => parseInt(s, 10)));
console.log(["1", "2", "3"].map(Number));

// callback কী কী পাচ্ছে দেখুন
["x", "y"].map((...args) => console.log(args));`,
    },
    {
      label: "reduce দিয়ে map/filter বানানো ও sort এর mutation",
      code: `const nums = [5, 1, 4];

const doubled = nums.reduce((acc, n) => { acc.push(n * 2); return acc; }, []);
console.log("reduce-map:", doubled);

const sortedCopy = [...nums].sort((a, b) => a - b);
console.log("copy sorted:", sortedCopy, "original:", nums);

nums.sort((a, b) => a - b);               // mutate করে!
console.log("after in-place sort:", nums);

// ES2023: নতুন array ফেরত দেয়, মূল array বদলায় না
const data = [3, 2, 1];
console.log(data.toSorted((a, b) => a - b), data);`,
    },
    {
      label: "Decorator: call গণনা ও this রক্ষা (timing ছাড়া)",
      code: `function countCalls(fn) {
  function wrapper(...args) {
    wrapper.calls++;
    return fn.apply(this, args);   // this ও argument দুটোই পাঠানো
  }
  wrapper.calls = 0;
  return wrapper;
}

const user = {
  name: "Rina",
  greet: countCalls(function (greeting) {
    return greeting + ", " + this.name;
  }),
};

console.log(user.greet("Hi"));
console.log(user.greet("Hello"));
console.log("calls:", user.greet.calls);`,
    },
    {
      label: "Curry helper ও partial application",
      code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const add3 = (a, b, c) => a + b + c;
const c = curry(add3);
console.log(c(1)(2)(3), c(1, 2)(3), c(1)(2, 3));

const partial = (fn, ...preset) => (...rest) => fn(...preset, ...rest);
const add100 = partial(add3, 100, 0);
console.log(add100(5));`,
    },
  ],

  debugging: [
    {
      title: "Wrapper এ `return` ভুলে যাওয়া",
      bad: `function withLogging(fn) {
  return function (...args) {
    console.log("calling with", args);
    fn(...args);          // result return করা হয়নি!
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
console.log(loggedAdd(2, 3));`,
      why: "Wrapper function এর ভেতরে `fn(...args)` call হয়েছে ঠিকই, কিন্তু তার ফল কোথাও return করা হয়নি, তাই wrapper টি implicit ভাবে `undefined` ফেরত দেয়। Caller `5` আশা করেছিল। Decorator লেখার তিন নিয়ম: সব argument পাঠাও, **return value ফেরত দাও**, `this` বজায় রাখো।",
      fix: `function withLogging(fn) {
  return function (...args) {
    console.log("calling with", args);
    return fn(...args);
  };
}

const add = (a, b) => a + b;
const loggedAdd = withLogging(add);
console.log(loggedAdd(2, 3));`,
    },
    {
      title: "`[\"1\",\"2\",\"3\"].map(parseInt)` কেন ভুল ফল দেয়",
      bad: `const result = ["1", "2", "3"].map(parseInt);
console.log(result);`,
      why: "`map` callback কে `(element, index, array)` তিনটি argument দেয়, আর `parseInt(string, radix)` এর দ্বিতীয় parameter হলো radix (সংখ্যা পদ্ধতির ভিত্তি)। তাই call গুলো হয় `parseInt(\"1\", 0)`, `parseInt(\"2\", 1)`, `parseInt(\"3\", 2)` — radix 1 অবৈধ ও `\"3\"` binary তে অবৈধ, ফলে `NaN`। সমাধান: wrapper দিয়ে শুধু প্রয়োজনীয় argument পাঠানো, অথবা `Number` ব্যবহার।",
      fix: `const result = ["1", "2", "3"].map((s) => parseInt(s, 10));
console.log(result);
console.log(["1", "2", "3"].map(Number));`,
    },
    {
      title: "Wrapper এ `this` হারিয়ে যায়",
      bad: `"use strict";

function wrap(fn) {
  return function (...args) {
    return fn(...args);          // this পাঠানো হয়নি
  };
}

const user = {
  name: "Rina",
  hello: wrap(function () {
    return "hi " + this.name;
  }),
};

try {
  console.log(user.hello());
} catch (e) {
  console.log("failed:", e.name);
}`,
      why: "`user.hello()` call এ wrapper এর `this` হলো `user` — কিন্তু wrapper ভেতরে `fn(...args)` লিখে মূল function কে **সাধারণ call** করেছে, তাই মূল function এ `this` হয়েছে `undefined` (strict mode) এবং `this.name` এ `TypeError`। সমাধান: `fn.apply(this, args)` (এবং wrapper কে অবশ্যই সাধারণ `function` হতে হবে; arrow হলে নিজের `this` থাকে না)।",
      fix: `"use strict";

function wrap(fn) {
  return function (...args) {
    return fn.apply(this, args);
  };
}

const user = {
  name: "Rina",
  hello: wrap(function () {
    return "hi " + this.name;
  }),
};

console.log(user.hello());`,
    },
    {
      title: "Debounce প্রতিবার নতুন করে বানানো",
      bad: `function debounce(fn, ms) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), ms);
  };
}

function save(text) { console.log("saved:", text); }

function onInput(text) {
  debounce(save, 10)(text);   // প্রতিবার নতুন closure, নতুন timerId
}

onInput("a");
onInput("ab");
onInput("abc");`,
      why: "Debounce এর ‘আগের timer বাতিল’ কাজটি নির্ভর করে একই `timerId` closure এর ওপর। এখানে `onInput` প্রতিবার নতুন `debounce(...)` বানাচ্ছে, তাই প্রতিটির নিজস্ব `timerId` — কেউ কারো timer বাতিল করে না এবং তিনটি call ই চলে। Debounced function একবার বানিয়ে (module level বা React এ `useMemo`/`useRef` দিয়ে স্থিতিশীল করে) সেটিই বারবার call করুন।",
      fix: `function debounce(fn, ms) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), ms);
  };
}

function save(text) { console.log("saved:", text); }

const debouncedSave = debounce(save, 10);   // একবারই বানানো

function onInput(text) {
  debouncedSave(text);
}

onInput("a");
onInput("ab");
onInput("abc");`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Function factory: `makeAdder`",
      prompt: "`makeAdder(n)` লিখুন যা একটি function ফেরত দেয়; সেই function একটি সংখ্যা `x` নিয়ে `x + n` ফেরত দেয়।",
      starter: `function makeAdder(n) {
  // TODO
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(3));
console.log(add10(5));`,
      expected: "8\n15",
      hints: ["`makeAdder` এর ভেতরে একটি function লিখে `return` করুন।", "ভেতরের function `n` কে ব্যবহার করতে পারে — এটাই closure।"],
      solution: `function makeAdder(n) {
  return (x) => x + n;
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(3));
console.log(add10(5));`,
      explanation: "`add5` ও `add10` আলাদা environment এ আলাদা `n` মনে রাখে।",
    },
    {
      level: "beginner",
      title: "filter + map + reduce দিয়ে মোট দাম",
      prompt: "শুধু `inStock: true` আইটেমগুলোর `price` যোগ করে মোট দাম print করুন। `for` loop নয় — `filter`, `map`, `reduce` ব্যবহার করুন।",
      starter: `const items = [
  { name: "pen", price: 10, inStock: true },
  { name: "book", price: 120, inStock: false },
  { name: "bag", price: 450, inStock: true },
];

const total = 0; // TODO: filter -> map -> reduce
console.log(total);`,
      expected: "460",
      hints: ["`items.filter((i) => i.inStock)`", "তারপর `.map((i) => i.price)` এবং `.reduce((a, b) => a + b, 0)`।"],
      solution: `const items = [
  { name: "pen", price: 10, inStock: true },
  { name: "book", price: 120, inStock: false },
  { name: "bag", price: 450, inStock: true },
];

const total = items
  .filter((i) => i.inStock)
  .map((i) => i.price)
  .reduce((a, b) => a + b, 0);
console.log(total);`,
      explanation: "প্রতিটি ধাপ একটি নতুন array/মান তৈরি করে; এই chain এর প্রতিটি ধাপ ছোট ও আলাদা করে পড়া যায়।",
    },
    {
      level: "beginner",
      title: "`applyN(fn, n, x)`",
      prompt: "`applyN(fn, n, x)` লিখুন যা `fn` কে `x` এর ওপর পরপর `n` বার প্রয়োগ করে ফল ফেরত দেয়। `applyN(double, 3, 1)` এর ফল `8`।",
      starter: `function applyN(fn, n, x) {
  // TODO
  return x;
}

const double = (v) => v * 2;
console.log(applyN(double, 3, 1));
console.log(applyN((s) => s + "!", 2, "hey"));`,
      expected: "8\nhey!!",
      hints: ["একটি `let result = x` রাখুন এবং loop এ `result = fn(result)`।"],
      solution: `function applyN(fn, n, x) {
  let result = x;
  for (let i = 0; i < n; i++) {
    result = fn(result);
  }
  return result;
}

const double = (v) => v * 2;
console.log(applyN(double, 3, 1));
console.log(applyN((s) => s + "!", 2, "hey"));`,
      explanation: "`fn` যেকোনো function, তাই `applyN` সংখ্যা ও string দুটোতেই কাজ করে — এই সাধারণীকরণই HOF এর শক্তি।",
    },
    {
      level: "intermediate",
      title: "`once` wrapper",
      prompt: "`once(fn)` লিখুন: যতবারই call হোক, মূল `fn` কেবল প্রথমবার চলবে; পরের call গুলো প্রথমবারের ফলই ফেরত দেবে।",
      starter: `function once(fn) {
  // TODO
  return fn;
}

const init = once(() => {
  console.log("init");
  return 42;
});

console.log(init());
console.log(init());
console.log(init());`,
      expected: "init\n42\n42\n42",
      hints: ["Closure এ `called` ও `result` রাখুন।", "মূল function সব argument ও `this` সহ ডাকতে `fn.apply(this, args)`।"],
      solution: `function once(fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

const init = once(() => {
  console.log("init");
  return 42;
});

console.log(init());
console.log(init());
console.log(init());`,
      explanation: "অবস্থা (`called`, `result`) wrapper এর closure তে থাকে, বাইরে থেকে কেউ বদলাতে পারে না।",
    },
    {
      level: "intermediate",
      title: "`curry(fn)` — নির্দিষ্ট arity",
      prompt: "`curry(fn)` লিখুন যাতে `curried(1)(2)(3)`, `curried(1, 2)(3)` ও `curried(1)(2, 3)` সবই কাজ করে। যথেষ্ট argument জমা হলেই মূল function call হবে। (`fn.length` হলো declared parameter সংখ্যা।)",
      starter: `function curry(fn) {
  // TODO
  return fn;
}

const add3 = (a, b, c) => a + b + c;
const curried = curry(add3);
console.log(curried(1)(2)(3));
console.log(curried(1, 2)(3));
console.log(curried(1)(2, 3));`,
      expected: "6\n6\n6",
      hints: ["ভেতরের function `...args` নেবে; `args.length >= fn.length` হলে `fn(...args)` ফেরত দিন।", "নইলে এমন function ফেরত দিন যা আরও argument নিয়ে আবার একই curried function কে ডাকে।"],
      solution: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...more) => curried(...args, ...more);
  };
}

const add3 = (a, b, c) => a + b + c;
const curried = curry(add3);
console.log(curried(1)(2)(3));
console.log(curried(1, 2)(3));
console.log(curried(1)(2, 3));`,
      explanation: "জমা-হওয়া argument গুলো closure তে (`args`) থাকে। সীমাবদ্ধতা: default/rest parameter থাকলে `fn.length` ভরসাযোগ্য নয় (default parameter এর আগ পর্যন্ত গণনা হয়)।",
    },
    {
      level: "challenge",
      title: "`debounce` — search box এর ক্লাসিক",
      prompt: "`debounce(fn, ms)` লিখুন: ঘনঘন call এ শুধু **শেষ call** এর argument দিয়ে `ms` পরে একবার `fn` চলবে। নিচের usage এ প্রথম তিনটি call এর পর শুধু `search: abc` এবং পরে আলাদা call এর `search: xyz` ছাপা হবে। Wrapper যেন `this` ও argument বজায় রাখে।",
      starter: `function debounce(fn, ms) {
  // TODO
  return fn;
}

const search = debounce(function (q) {
  console.log("search:", q);
}, 10);

search("a");
search("ab");
search("abc");
setTimeout(() => search("xyz"), 60);`,
      expected: "search: abc\nsearch: xyz",
      hints: ["Closure এ `let timerId` রাখুন।", "প্রতি call এ আগে `clearTimeout(timerId)`, তারপর `timerId = setTimeout(...)`।", "Timer এর ভেতরে `fn.apply(this, args)` ডাকুন; wrapper টি সাধারণ `function` (arrow নয়) যাতে `this` পাওয়া যায়।"],
      solution: `function debounce(fn, ms) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
}

const search = debounce(function (q) {
  console.log("search:", q);
}, 10);

search("a");
search("ab");
search("abc");
setTimeout(() => search("xyz"), 60);`,
      explanation: "`timerId` closure তে থাকে বলে নতুন call আগেরটি বাতিল করতে পারে। Timer এর ভেতরের arrow function wrapper এর `this` ও `args` ধরে রাখে। পরীক্ষায় ১০ ms বনাম ৬০ ms এর ব্যবধান যথেষ্ট বড় রাখা হয়েছে যাতে ক্রম স্থির থাকে। Production এ leading edge, `cancel`, `flush` সহ library সংস্করণ ব্যবহার করুন।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "নিচের কোনটি higher-order function?",
        options: [
          "যে function একটি function কে argument হিসেবে নেয় অথবা function ফেরত দেয়",
          "যে function শুধু সংখ্যা নেয় ও সংখ্যা ফেরত দেয়",
          "যে function অন্য function এর ভেতরে লেখা হয়েছে",
          "যে function arrow syntax এ লেখা",
        ],
        answer: 0,
        explanation: "সঠিক: HOF এর সংজ্ঞা — function নেওয়া অথবা function ফেরত দেওয়া। ‘শুধু সংখ্যা নেয়’ বিকল্পে function value জড়িত নয়। ‘ভেতরে লেখা’ শুধু অবস্থান, আচরণ নয় — nested function HOF হতেও পারে, না-ও পারে। ‘arrow syntax’ কেবল syntax; arrow বা সাধারণ function যেকোনোটিই HOF হতে পারে।",
      },
      {
        question: "`const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);` হলে `pipe(add1, double)(5)` এর ফল কী (`add1 = n => n + 1`, `double = n => n * 2`)?",
        options: ["11", "12", "10", "6"],
        answer: 1,
        explanation: "সঠিক: 12 — আগে `add1(5) = 6`, তারপর `double(6) = 12` (`pipe` বাম থেকে ডানে)। 11 হতো যদি `compose` (`add1(double(5)) = 11`) হতো, অর্থাৎ ক্রম উল্টো। 10 শুধু `double` প্রয়োগ, 6 শুধু `add1` প্রয়োগের ফল — দুটোই অসম্পূর্ণ।",
      },
      {
        question: "`[\"1\", \"2\", \"3\"].map(parseInt)` এর ফল কী এবং কেন?",
        options: [
          "[1, 2, 3] — `parseInt` সঠিকভাবে কাজ করে",
          "[NaN, NaN, NaN] — string কে `parseInt` পড়তে পারে না",
          "TypeError — `parseInt` callback হতে পারে না",
          "[1, NaN, NaN] — `map` index কে `parseInt` এর radix হিসেবে পাঠায়",
        ],
        answer: 3,
        explanation: "সঠিক: `map` callback কে `(element, index, array)` দেয়, `parseInt(string, radix)` তাই `parseInt(\"1\", 0)` → 1 (radix 0 মানে সাধারণ default), `parseInt(\"2\", 1)` → NaN, `parseInt(\"3\", 2)` → NaN। `[1, 2, 3]` ভুল কারণ index অতিরিক্ত argument হয়ে ফল বদলে দেয়। `[NaN, NaN, NaN]` ভুল কারণ প্রথম মান বৈধ (১)। `TypeError` ভুল কারণ `parseInt` যেকোনো function এর মতোই callback হতে পারে।",
      },
      {
        question: "`function wrap(fn) { return function (...args) { fn(...args); }; }` এ কী সমস্যা আছে?",
        options: [
          "কোনো সমস্যা নেই, এটি নিখুঁত decorator",
          "`...args` ব্যবহার করা যায় না",
          "মূল function এর return value হারিয়ে যায় (এবং `this` ও বজায় থাকে না)",
          "Wrapper এ নাম না থাকায় error হয়",
        ],
        answer: 2,
        explanation: "সঠিক: `return` না থাকায় wrapper সবসময় `undefined` ফেরত দেয়; আর `fn(...args)` সাধারণ call হওয়ায় `this` ও পাঠানো হয় না (`fn.apply(this, args)` লাগত)। প্রথম উত্তর ভুল কারণ এ দুটো সমস্যা বাস্তব। `...args` বৈধ ও এখানে উপকারী। নামহীন function expression এ কোনো error হয় না।",
      },
      {
        question: "Search box এ `onChange` এ প্রতিবার `debounce(search, 300)(value)` লিখলে কী হবে?",
        options: [
          "ঠিকভাবেই debounce হবে",
          "`search` কখনো চলবে না",
          "প্রতিবার নতুন closure (নতুন timer অবস্থা) তৈরি হওয়ায় কোনো call বাতিল হবে না, তাই debounce কাজ করবে না",
          "শুধু প্রথম call চলবে",
        ],
        answer: 2,
        explanation: "সঠিক: debounce এর কার্যকারিতা একটি **শেয়ার করা** `timerId` এর ওপর নির্ভর করে; প্রতিবার নতুন debounced function বানালে প্রতিটির আলাদা `timerId` থাকে, আগেরটি কেউ বাতিল করে না — ফলে প্রতিটি call ই চলে। ‘ঠিকভাবেই debounce হবে’ তাই ভুল। ‘কখনো চলবে না’ ও ‘শুধু প্রথম call’ ভুল কারণ প্রতিটি timer নিজের পথে চলবে।",
      },
    ],
    coding: [
      {
        title: "`compose(...fns)` লিখুন",
        prompt: "`compose(f, g, h)(x)` যেন `f(g(h(x)))` ফেরত দেয় (ডান থেকে বামে)। কোনো function না দিলে identity (`x` ফেরত)।",
        starter: `function compose(...fns) {
  // TODO
}

const add1 = (n) => n + 1;
const double = (n) => n * 2;
const square = (n) => n * n;

console.log(compose(add1, double)(5));
console.log(compose(square, add1, double)(3));
console.log(compose()(7));`,
        expected: "11\n49\n7",
        solution: `function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

const add1 = (n) => n + 1;
const double = (n) => n * 2;
const square = (n) => n * n;

console.log(compose(add1, double)(5));
console.log(compose(square, add1, double)(3));
console.log(compose()(7));`,
      },
      {
        title: "`groupBy(arr, keyFn)`",
        prompt: "`groupBy` একটি array ও একটি `keyFn` নেয় এবং এমন object ফেরত দেয় যেখানে প্রতিটি key র জন্য সংশ্লিষ্ট element গুলোর array থাকে। Key এর ক্রম প্রথম দেখা ক্রমে। মূল array বদলাবেন না।",
        starter: `function groupBy(arr, keyFn) {
  // TODO
}

console.log(groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd")));
console.log(groupBy(["apple", "avocado", "banana"], (s) => s[0]));`,
        expected: "{ odd: [ 1, 3, 5 ], even: [ 2, 4 ] }\n{ a: [ 'apple', 'avocado' ], b: [ 'banana' ] }",
        solution: `function groupBy(arr, keyFn) {
  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});
}

console.log(groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd")));
console.log(groupBy(["apple", "avocado", "banana"], (s) => s[0]));`,
      },
    ],
  },

  interview: [
    {
      q: "Higher-order function কী? তিনটি বাস্তব উদাহরণ দিন।",
      a: "যে function এক বা একাধিক function কে argument হিসেবে নেয়, অথবা একটি function কে return value হিসেবে ফেরত দেয়, সেটি higher-order function। এটি সম্ভব কারণ JavaScript এ function first-class value — variable এ রাখা, argument করা, return করা সবই চলে।\n\nউদাহরণ: (১) `Array.prototype.map/filter/reduce/sort` — callback নেয়; (২) `setTimeout(fn, ms)` ও `addEventListener` — callback নেয়; (৩) `once(fn)`, `debounce(fn, ms)`, `makeMultiplier(n)` — function নেয় এবং/অথবা নতুন function ফেরত দেয়। React এ `useCallback`, `withAuth(Component)` (HOC) ও `setState(prev => ...)` একই ধারণার।",
    },
    {
      q: "Currying ও partial application এর পার্থক্য কী? কখন কাজে লাগে?",
      a: "**Currying** একটি রূপান্তর: `f(a, b, c)` কে `f(a)(b)(c)` রূপে বদলানো, যেখানে প্রতিটি function ঠিক একটি argument নেয়। **Partial application** হলো একটি function এর কিছু argument আগেই ঠিক করে দিয়ে বাকি argument এর জন্য নতুন function বানানো — যেমন `fn.bind(null, a, b)` বা `(...rest) => fn(a, b, ...rest)`। Curry করা function এর প্রতিটি ধাপ একরকম partial application, কিন্তু partial application এ ‘ঠিক এক argument করে’ নেওয়ার কড়াকড়ি নেই।\n\nকাজে লাগে সাধারণ function থেকে নির্দিষ্ট function বানাতে (`const isAdult = greaterThan(17)`), `map/filter` এ পরিষ্কার callback দিতে, event handler factory (`handleChange(field)(event)`) বানাতে। অতিরিক্ত ব্যবহারে readability কমে, তাই দলের সবাই যে style এ স্বচ্ছন্দ সেটি ব্যবহার করুন।",
    },
    {
      q: "`compose` আর `pipe` এর পার্থক্য কী? কীভাবে লিখবেন?",
      a: "দুটোই function জুড়ে নতুন function বানায়; পার্থক্য ক্রমে। `pipe(f, g, h)(x)` মানে `h(g(f(x)))` — বাম থেকে ডানে, ঠিক যেভাবে পড়া হয়; `compose(f, g, h)(x)` মানে `f(g(h(x)))` — গাণিতিক function composition এর মতো ডান থেকে বামে।\n\nসাধারণ implementation: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)` এবং `compose` এ `reduceRight`। প্রতিটি function এক argument নেবে ও এক মান ফেরত দেবে — এটিই composition এর শর্ত; একাধিক argument লাগলে curry/partial করে নিতে হয়। Async ধাপ থাকলে সাধারণ `pipe` চলে না, কারণ ধাপ গুলো Promise ফেরত দেয় — তখন `await` সহ ভিন্ন সংস্করণ লাগে।",
    },
    {
      q: "Decorator/wrapper লেখার সময় কোন কোন বিষয় মনে রাখতে হয়?",
      a: "চারটি জিনিস: (১) **সব argument পাঠানো** — `...args` ব্যবহার, আর যদি মূল function এর `length`/`name` গুরুত্বপূর্ণ হয় তা বজায় রাখা; (২) **return value ফেরত দেওয়া** — না দিলে caller `undefined` পায়; (৩) **`this` বজায় রাখা** — wrapper কে সাধারণ `function` লিখে `fn.apply(this, args)` ডাকা (arrow হলে নিজের `this` নেই); (৪) **async হলে Promise ফেরত দেওয়া** — wrapper এ error বা await এর সময় ফল ঠিকভাবে propagate করা।\n\nঅতিরিক্ত: wrapper এর অবস্থা (cache, call count, timer) closure তে থাকে, তাই wrapper একবার বানিয়ে পুনরায় ব্যবহার করুন; wrapper কে নাম দিন যাতে stack trace এ বোঝা যায়। এই নিয়মগুলোর যেকোনো একটি ভুললে ‘মুড়ে দেওয়া function ভেঙে যায়’।",
    },
    {
      q: "`map`, `filter`, `reduce` আর `forEach` — কখন কোনটি ব্যবহার করবেন? `map` এর বদলে `forEach` কেন নয়?",
      a: "`map` রূপান্তরের জন্য: একই দৈর্ঘ্যের নতুন array চাই। `filter` বাছাইয়ের জন্য: কিছু element বাদ দিতে। `reduce` সবকিছু একটি মানে জমাতে (যোগফল, object, group)। `forEach` যখন কেবল **side effect** দরকার (log, DOM update) এবং ফল দরকার নেই।\n\n`forEach` ব্যবহার করে নতুন array বানাতে গেলে বাইরের variable mutate করতে হয় (`const out = []; arr.forEach(x => out.push(...))`) — এতে কোড কম পরিষ্কার ও কম composable। `map` ‘ফল ফেরত দেয়’ বলে chain করা যায় এবং উদ্দেশ্য পরিষ্কার দেখায়। তবে `.map().filter().map()` মধ্যবর্তী array বানায়; হট path এ একটি loop/`reduce` ভাবুন — আগে মাপুন। Module 03 এ প্রতিটির সূক্ষ্ম নিয়ম (sparse array, initial value ছাড়া `reduce`, `sort` এর mutation) দেখব।",
    },
    {
      q: "React এ HOC আর custom hook এর সম্পর্ক কী? দুটোই কি higher-order function?",
      a: "HOC হলো একটি higher-order function যা একটি component নেয় এবং নতুন component ফেরত দেয় (`withAuth(Page)`) — স্পষ্টতই ‘function নেয় ও ফেরত দেয়’। Custom hook (`useAuth()`) সাধারণ function যা অন্য hook call করে; সে নিজে HOF হতে পারে বা না-ও পারে (যদি callback নেয় — যেমন `useDebounce(fn)` — তবে HOF)।\n\nআধুনিক React এ আচরণ পুনর্ব্যবহারের জন্য বেশিরভাগ ক্ষেত্রে hook পছন্দ করা হয়, কারণ HOC এ ‘wrapper hell’ ও props নাম সংঘর্ষ হয় এবং component tree গভীর হয়। তবে HOC এখনো কাজের (যেমন error boundary এর মতো wrapper, `memo`, পুরোনো library)। দুটির মূলে একই ধারণা: ছোট function বা component জুড়ে আচরণ যোগ করা। বিস্তারিত React ক্ষেত্রে।",
    },
  ],

  summary: {
    takeaways: [
      "Higher-order function = function নেয় অথবা function ফেরত দেয়; JavaScript এ function first-class value বলে এটি স্বাভাবিক।",
      "`map/filter/reduce/sort/forEach` built-in HOF; ভেতরে সাধারণ loop আর callback call — callback পায় `(element, index, array)`।",
      "Function factory ও closure: ফেরত আসা function তার জন্মস্থানের variable (যেমন `factor`) মনে রাখে; প্রতি call এ নতুন environment।",
      "`pipe`/`compose` ছোট function জুড়ে বড় function বানায়; curry/partial application সাধারণ function থেকে নির্দিষ্ট function তৈরি করে।",
      "Decorator লেখার নিয়ম: সব argument পাঠাও, return value ফেরত দাও, `this` বজায় রাখো (`fn.apply(this, args)`)।",
      "Debounce/once এর অবস্থা closure তে থাকে — একবার বানিয়ে পুনর্ব্যবহার করুন, প্রতিবার নতুন করে নয়।",
      "HOF এর দাম: stack trace জটিলতা, মধ্যবর্তী array, অতিরিক্ত abstraction — মেপে ও readability দেখে ব্যবহার করুন।",
    ],
    syntax: `// function নেয়
const apply = (fn, x) => fn(x);

// function ফেরত দেয়
const makeAdder = (n) => (x) => x + n;

// composition
const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);

// wrapper
const wrap = (fn) => function (...args) {
  return fn.apply(this, args);
};`,
    whenToUse: [
      "একই কাঠামো বারবার লিখছেন (loop, retry, logging) কিন্তু মাঝের ছোট অংশ আলাদা — সেই অংশ callback করে HOF বের করুন।",
      "আচরণ জুড়তে চান মূল function না বদলে (cache, retry, auth check, analytics) — decorator/wrapper।",
      "সরল `for...of` বেশি পরিষ্কার বা হট path এ হলে অতিরিক্ত compose/curry এড়ান।",
    ],
    next: [
      "Pure Functions — ভালো HOF এর callback গুলো সাধারণত pure; কেন তা পরের lesson এ।",
      "Scope ও Closures — function factory ও wrapper এর অবস্থা কোথায় থাকে।",
      "Arrays (Module 03) — `map/filter/reduce/sort` এর পূর্ণ আলোচনা ও edge case।",
      "Promises ও async/await — async wrapper (retry, timeout) কীভাবে লিখবেন।",
    ],
  },

  compatibility:
    "Higher-order function, closure, `Array.prototype.map/filter/reduce/sort/forEach`, `Function.prototype.bind/apply` সব ECMAScript এর অংশ — সব আধুনিক browser ও Node.js এ একই আচরণ। `toSorted` (ES2023) Node.js 20+ ও আধুনিক browser এ আছে; পুরোনো runtime এ `[...arr].sort()` ব্যবহার করুন। `setTimeout`/`clearTimeout` (debounce এ) ECMAScript নয়, host API — browser ও Node.js দুটোতেই আছে, তবে Node.js এ `setTimeout` একটি object ফেরত দেয়, browser এ number (`clearTimeout` দুটোতেই কাজ করে)। HOC/JSX এর অংশ শুধু React এ (এই sandbox এ চলে না)।",
};
