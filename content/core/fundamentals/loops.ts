import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`for`, `while`, `do...while`, `for...of` ও `for...in` এর গঠন, কাজের নিয়ম ও কোনটি কখন ব্যবহার করবেন — তা explain করতে পারবেন।",
    "`for...of` কীভাবে iterable (array, string, Map, Set) এর ওপর চলে এবং `for...in` কেন array এর জন্য ভুল পছন্দ — তা বুঝবেন।",
    "`break`, `continue` ও label ব্যবহার করে loop নিয়ন্ত্রণ করতে এবং `forEach` এর সীমাবদ্ধতা চিনতে পারবেন।",
    "`let` দিয়ে loop variable এর প্রতি-iteration binding এবং closure এর সম্পর্ক ব্যাখ্যা করতে পারবেন।",
    "Infinite loop, off-by-one ও ‘iterate করার সময় array বদলানো’ — এই তিনটি ক্লাসিক bug চিনে ঠিক করতে পারবেন।",
    "বড় loop browser ও Node.js এ কী প্রভাব ফেলে এবং user-controlled সীমা কেন ঝুঁকিপূর্ণ — তা বুঝবেন।",
  ],

  concept: [
    { type: "h3", text: "Loop কেন দরকার?" },
    {
      type: "p",
      text: "একই কাজ বারবার করতে হলে — ১০০টি product এর দাম যোগ করা, একটি string এর প্রতিটি অক্ষর পরীক্ষা করা, API থেকে আসা তালিকার প্রতিটি আইটেম render করা — কোড কপি-পেস্ট না করে আমরা **loop** ব্যবহার করি। Loop হলো এমন একটি control flow কাঠামো যা একটি শর্ত সত্য থাকা পর্যন্ত (বা একটি সংগ্রহের সব উপাদান শেষ না হওয়া পর্যন্ত) একটি কোড-block বারবার চালায়। প্রতিটি পুনরাবৃত্তিকে বলে **iteration**।",
    },
    {
      type: "p",
      text: "ভেতরে কী ঘটে? Engine একটি loop এর জন্য বলতে গেলে চারটি জিনিস মনে রাখে: **(১)** loop এর অবস্থা (যেমন counter `i`), **(২)** চলার শর্ত, **(৩)** প্রতি iteration এর কোড, **(৪)** iteration শেষে অবস্থা বদলানোর নিয়ম। কোড execution এই চক্রে ঘোরে: শর্ত পরীক্ষা → body চালানো → অবস্থা হালনাগাদ → আবার শর্ত পরীক্ষা। শর্ত মিথ্যা হলে loop শেষ এবং প্রবাহ পরের statement এ যায়।",
    },
    { type: "h3", text: "Classic `for`" },
    {
      type: "code",
      caption: "for (init; test; update) — তিনটি অংশ আলাদা সময়ে চলে",
      code: `for (let i = 0; i < 3; i++) {
  console.log(i);
}`,
    },
    {
      type: "ul",
      items: [
        "**init** (`let i = 0`) — loop শুরুর আগে মাত্র **একবার** চলে।",
        "**test** (`i < 3`) — **প্রতিটি iteration এর আগে** পরীক্ষা হয়; মিথ্যা হলেই loop শেষ। তাই শর্ত প্রথমবারেই মিথ্যা হলে body একবারও চলে না।",
        "**update** (`i++`) — প্রতিটি iteration এর body শেষে চলে, তারপর আবার test।",
        "তিনটি অংশই ঐচ্ছিক: `for (;;)` একটি অসীম loop (ভেতরে `break` দরকার)।",
        "`let` ব্যবহার করলে spec অনুযায়ী প্রতি iteration এ `i` এর একটি **নতুন binding** তৈরি হয় — এর ফল closure এর ক্ষেত্রে গুরুত্বপূর্ণ (‘var / let / const’ lesson দেখুন)।",
      ],
    },
    { type: "h3", text: "`while` ও `do...while`" },
    {
      type: "p",
      text: "`while (condition) { ... }` তখন ভালো যখন আগে থেকে জানা নেই কতবার ঘুরবে — যেমন ‘যতক্ষণ queue তে কাজ আছে’ বা ‘যতক্ষণ না valid input পাই’। এখানে counter এর update আপনাকে **নিজে body এর ভেতরে** লিখতে হয়; ভুলে গেলে loop কখনো থামে না। `do { ... } while (condition)` এ body আগে চলে, শর্ত পরে পরীক্ষা হয় — অর্থাৎ body **কমপক্ষে একবার** চলবেই। ব্যবহার কম, কিন্তু ‘একবার চেষ্টা করেই দেখি, ব্যর্থ হলে আবার’ ধরনের কাজে (retry, menu দেখানো) স্বাভাবিক।",
    },
    { type: "h3", text: "`for...of`: iterable এর উপাদান পড়া" },
    {
      type: "p",
      text: "`for (const x of iterable)` হলো সংগ্রহের **মান** পড়ার আধুনিক ও প্রস্তাবিত উপায়। ভেতরে এটি `iterable[Symbol.iterator]()` ডেকে একটি **iterator** পায়, তারপর বারবার `.next()` ডাকে — প্রতিবার `{ value, done }` ফেরত আসে; `done: true` হলে loop শেষ। এই protocol যে object মানে তাকেই **iterable** বলে। Array, string, `Map`, `Set`, `arguments`, generator সবই iterable। কিন্তু **plain object (`{}`) iterable নয়** — তাই `for (const x of {a: 1})` TypeError দেয়।",
    },
    {
      type: "ul",
      items: [
        "**Array:** মান পাওয়া যায়, index নয়। Index সহ চাইলে `for (const [i, v] of arr.entries())`।",
        "**String:** code point ধরে চলে, অর্থাৎ একটি emoji (যা UTF-16 এ দুটি code unit) এক iteration এ আসে; কিন্তু `str.length` ও `str[i]` code unit ধরে কাজ করে।",
        "**Map:** প্রতি iteration এ `[key, value]` জোড়া — `for (const [k, v] of map)`।",
        "**Set:** শুধু মান, insertion ক্রমে।",
        "**Object:** `Object.keys(obj)`, `Object.values(obj)`, `Object.entries(obj)` দিয়ে (যা নিজের enumerable string key এর array দেয়) তারপর `for...of`।",
        "`const` ব্যবহার করা যায়, কারণ প্রতি iteration এ নতুন binding তৈরি হয় (reassign হচ্ছে না)।",
      ],
    },
    { type: "h3", text: "`for...in`: object এর key — এবং কেন array এ নয়" },
    {
      type: "p",
      text: "`for (const key in obj)` একটি object এর **enumerable string key** গুলোর ওপর ঘোরে — এবং শুধু নিজের নয়, **prototype chain থেকে inherited enumerable key ও** আসে। Symbol key আসে না। এটি মূলত object এর key দেখার জন্য তৈরি। Array এর জন্য এটি ভুল পছন্দ, কারণ: **(১)** `key` সবসময় **string** (`\"0\"`, `\"1\"`), সংখ্যা নয় — তাই `key + 1` string জোড়া লাগায়; **(২)** কেউ `Array.prototype` এ enumerable property যোগ করলে সেটিও আসবে; **(৩)** ক্রম ও sparse array এর আচরণ কোডে অপ্রত্যাশিত; **(৪)** `for...of` ও সাধারণ `for` সরল ও দ্রুত। Object এর key এর জন্য আজকাল বেশি পরিষ্কার `Object.keys / entries`, কারণ তারা শুধু নিজের key দেয়।",
    },
    {
      type: "compare",
      headers: ["বৈশিষ্ট্য", "for...of", "for...in"],
      rows: [
        ["কী দেয়", "মান (value)", "key (সবসময় string)"],
        ["কোথায় চলে", "iterable (array, string, Map, Set…)", "যেকোনো object এর enumerable string key"],
        ["Inherited key", "প্রযোজ্য নয়", "**আসে** (prototype chain থেকে)"],
        ["Plain object এ", "TypeError (iterable নয়)", "কাজ করে"],
        ["Array এর জন্য", "প্রস্তাবিত", "এড়িয়ে চলুন"],
      ],
    },
    { type: "h3", text: "`break`, `continue` ও label" },
    {
      type: "p",
      text: "`break` সবচেয়ে ভেতরের loop (বা `switch`) থেকে সম্পূর্ণ বেরিয়ে যায়। `continue` শুধু **বর্তমান iteration** এর বাকি অংশ বাদ দিয়ে পরের iteration এ যায় (`for` এ update ও test এ)। একটি সূক্ষ্ম ফাঁদ: loop এর ভেতরের `switch` এ `break` শুধু `switch` থেকে বেরোয়, loop থেকে নয়। Nested loop এর বাইরের loop থামাতে **label** ব্যবহার করা যায়: `outer: for (...) { for (...) { if (found) break outer; } }`। Label ব্যবহার বিরল — অনেক সময় ওই লজিক একটি function এ সরিয়ে `return` করাই পরিষ্কার।",
    },
    { type: "h3", text: "`forEach` বনাম `for...of`" },
    {
      type: "p",
      text: "`arr.forEach(cb)` প্রতিটি উপাদানের জন্য callback ডাকে। এটি সুবিধাজনক, কিন্তু callback হলো আলাদা function, তাই: **`break` বা `continue` ব্যবহার করা যায় না** (callback এর ভেতর `return` শুধু ওই callback কে শেষ করে, loop নয়); বাইরের function এ `return` করা যায় না; এবং **`await` ঠিকভাবে কাজ করে না** — `forEach` callback এর ফেরত করা Promise এর জন্য অপেক্ষা করে না, তাই `async` callback দিলে সব iteration প্রায় একসাথে শুরু হয়ে যায় এবং `forEach` এর পরের কোড আগে চলে। ক্রমানুযায়ী async কাজের জন্য `for...of` (async function এর ভেতরে `await` সহ) ব্যবহার করুন। async নিয়ে বিস্তারিত পরে ‘Promises ও async/await’ lesson এ।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Module 03 এ আসছে",
      text: "`map`, `filter`, `reduce`, `find`, `some`, `every` এর মতো array method pipeline Module 03 এ বিস্তারিত আসবে। এগুলো ‘কীভাবে ঘুরব’ এর বদলে ‘কী চাই’ বলে এবং অনেক ক্ষেত্রে আরও পরিষ্কার। কিন্তু loop এর মূল ধারণা (iteration, শর্ত, early exit) না জানলে সেগুলো ঠিকমতো বোঝা কঠিন — তাই আগে এখানকার নিয়মগুলো পাকা করুন।",
    },
    { type: "h3", text: "তিনটি ক্লাসিক bug" },
    {
      type: "ul",
      items: [
        "**Infinite loop:** শর্ত কখনো মিথ্যা হয় না — সাধারণত counter update ভুলে যাওয়া, ভুল দিকে update (`i--` যখন `i++` লাগবে), বা এমন শর্ত যা কখনো বদলায় না। Browser এ main thread আটকে পেজ freeze হয়; Node এ event loop আটকে যায় — অন্য কিছুই চলে না।",
        "**Off-by-one:** `i <= arr.length` লিখলে শেষে `arr[arr.length]` (যার মান `undefined`) ও পড়া হয়। Index শুরু হয় `0` থেকে, শেষ index হলো `length - 1`। সীমা `<` না `<=` — প্রতিবার ভাবুন।",
        "**Iterate করার সময় array বদলানো:** `for` loop এ `splice` দিয়ে উপাদান সরালে পরের উপাদানগুলো এক ঘর বাঁয়ে সরে যায়, ফলে একটি উপাদান **বাদ পড়ে**। আবার `for...of` চলাকালীন `push` করলে নতুন উপাদানও iteration এ আসতে পারে (এমনকি অসীম হতে পারে)। নিরাপদ উপায়: নতুন array বানান (`filter`), বা পেছন থেকে ঘুরুন, বা আগে আলাদা তালিকায় কী কী সরাবেন তা জমা করুন।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "**(১)** ‘`for...in` array এর জন্য ভালো’ — না; key string, inherited key ও আসতে পারে। **(২)** ‘`forEach` এ return দিলে loop থামে’ — না, শুধু ওই callback শেষ হয়। **(৩)** ‘`forEach` এ `await` দিলে ক্রমানুসারে চলে’ — না। **(৪)** ‘`for` loop সবসময় `for...of` এর চেয়ে দ্রুত’ — এটি নির্ভর করে engine, ডেটা ও কোডের ওপর; আধুনিক engine দুটিকেই ভালোভাবে optimize করে। বাস্তবে সাধারণ কাজে পার্থক্য নগণ্য — আগে পরিষ্কার কোড লিখুন, ধীর মনে হলে measure করুন। **(৫)** ‘`const` loop variable এ ব্যবহার করা যায় না’ — `for...of` / `for...in` এ যায়; classic `for (const i = 0; ...; i++)` এ যায় না, কারণ `i++` reassignment।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security ও stability: loop এর সীমা কার হাতে?",
      text: "যদি loop এর সংখ্যা user এর দেওয়া মান থেকে আসে (`for (let i = 0; i < req.count; i++)`) তবে একজন আক্রমণকারী বিশাল সংখ্যা পাঠিয়ে CPU আটকে দিতে পারে (**DoS**)। সবসময় উপরের সীমা বেঁধে দিন (`Math.min(count, 100)`) এবং বাইরের ডেটা যাচাই করুন। এছাড়া, `for...in` দিয়ে user-supplied object এর key ধরে নিজের object এ লিখলে `__proto__` এর মতো key দিয়ে **prototype pollution** ঘটতে পারে — তাই বাইরের ডেটা merge করার আগে key allow-list করুন বা `Map` ব্যবহার করুন।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js এ প্রভাব",
      text: "Loop এর ভাষাগত নিয়ম দুই জায়গাতেই এক। পার্থক্য প্রভাবে: browser এ দীর্ঘ synchronous loop **main thread** আটকে UI (click, scroll, animation) জমিয়ে দেয়; ভারী কাজ Web Worker এ বা ছোট ছোট ভাগে করুন। Node.js এ একই কারণে **event loop** আটকে সব request অপেক্ষা করে। এই playground একটি Web Worker এ চলে, তাই একটি অসীম loop এখানেও আটকে যাবে — বিশেষ সতর্ক থাকুন।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **ছাপাখানার গ্রাহক-তালিকা** কল্পনা করুন। আপনার কাছে ২০০ জন সদস্যের নাম-ঠিকানা আছে এবং প্রত্যেককে একটি চিঠি পাঠাতে হবে। প্রতিবার হাতে নতুন করে নির্দেশ লিখলে চলে না — আপনি কাজের একটি **পদ্ধতি** ঠিক করেন, আর সেটি বারবার চালান।",
    },
    {
      type: "ul",
      items: [
        "**`for` loop** হলো ক্রমিক নম্বর ধরে কাজ: ‘১ নম্বর থেকে শুরু, ২০০ পর্যন্ত, প্রতিবার ১ করে বাড়াও।’ আপনি সংখ্যাটাই নিয়ন্ত্রণ করছেন। শেষ নম্বরে ভুল (২০১ পর্যন্ত চালানো) হলো **off-by-one**।",
        "**`for...of`** হলো সরাসরি তালিকা হাতে নিয়ে ‘প্রত্যেক সদস্যের জন্য’ বলা — নম্বর গোনার ঝামেলা নেই, শুধু বর্তমান সদস্যই সামনে। `entries()` হলো সদস্যের পাশে সিরিয়াল নম্বরও চাওয়া।",
        "**`while`** হলো ‘যতক্ষণ খামের স্তূপে খাম আছে, একটি করে তুলে ডাকে দাও।’ কতবার ঘুরবে আগে জানা নেই। যদি স্তূপ থেকে খাম তোলাই ভুলে যান (update ভুলে যাওয়া), তবে স্তূপ কখনো ফুরোবে না — এটিই **infinite loop**।",
        "**`do...while`** হলো ‘একটি চিঠি আগে পাঠিয়ে তারপর দেখি আরও আছে কি না’ — কমপক্ষে একবার কাজ হবেই।",
        "**`continue`**: ‘এই সদস্যের ঠিকানা ভুল, এঁকে বাদ দিয়ে পরেরজনে যাও।’ **`break`**: ‘ডাক বন্ধ হয়ে গেছে, বাকিদের আজ আর পাঠানো হবে না।’ **label** হলো ‘শুধু এই ঘর নয়, পুরো গুদাম ছেড়ে বেরোও।’",
        "**`for...in`** হলো সদস্য-ফাইলের ক্যাবিনেটের **লেবেল** পড়া — মানুষকে নয়, ফাইলের ট্যাগ (key) কে। আর ক্যাবিনেটটি যদি পুরোনো একটি বড় ক্যাবিনেট থেকে ‘উত্তরাধিকারসূত্রে’ ট্যাগও পায়, তবে সেগুলোও গোনায় ধরা পড়ে (inherited key)।",
        "**ঘোরার সময় তালিকা বদলানো** হলো তালিকা ধরে যেতে যেতে মাঝখান থেকে একটি নাম কেটে দেওয়া — পরের নামগুলো এক ঘর এগিয়ে আসে, আর আপনার আঙুল পরেরটিতে গিয়ে একটি নাম ডিঙিয়ে যায়।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "for loop trace: sum = 1 + 2 + 3",
      caption: "প্রতিটি iteration এ `i` (counter) ও `sum` (accumulator) এর পরিবর্তন লক্ষ্য করুন। শেষে `i` loop এর বাইরে আর থাকে না।",
      code: "let sum = 0;\nfor (let i = 1; i <= 3; i++) {\n  sum += i;\n}\nconsole.log(sum);",
      steps: [
        {
          line: 0,
          memory: [{ name: "sum", value: "0", kind: "let", state: "live" }],
          note: "Accumulator `sum` শুরু হলো `0` দিয়ে। এখনো loop শুরু হয়নি।",
        },
        {
          line: 1,
          memory: [
            { name: "sum", value: "0", kind: "let", state: "live" },
            { name: "i", value: "1", kind: "let", state: "live" },
          ],
          note: "**init:** `let i = 1` — একবারই চলে। তারপর **test:** `1 <= 3` সত্য, তাই body তে ঢোকা হবে।",
        },
        {
          line: 2,
          memory: [
            { name: "sum", value: "1", kind: "let", state: "live" },
            { name: "i", value: "1", kind: "let", state: "live" },
          ],
          note: "Iteration ১: `sum += i` → `0 + 1 = 1`।",
        },
        {
          line: 1,
          memory: [
            { name: "sum", value: "1", kind: "let", state: "live" },
            { name: "i", value: "2", kind: "let", state: "live" },
          ],
          note: "Body শেষ। **update:** `i++` → `2`। **test:** `2 <= 3` সত্য — আবার body তে।",
        },
        {
          line: 2,
          memory: [
            { name: "sum", value: "3", kind: "let", state: "live" },
            { name: "i", value: "2", kind: "let", state: "live" },
          ],
          note: "Iteration ২: `sum += i` → `1 + 2 = 3`।",
        },
        {
          line: 1,
          memory: [
            { name: "sum", value: "3", kind: "let", state: "live" },
            { name: "i", value: "3", kind: "let", state: "live" },
          ],
          note: "`i++` → `3`; test `3 <= 3` সত্য (কারণ `<=`)।",
        },
        {
          line: 2,
          memory: [
            { name: "sum", value: "6", kind: "let", state: "live" },
            { name: "i", value: "3", kind: "let", state: "live" },
          ],
          note: "Iteration ৩: `sum += i` → `3 + 3 = 6`।",
        },
        {
          line: 1,
          memory: [
            { name: "sum", value: "6", kind: "let", state: "live" },
            { name: "i", value: "4", kind: "let", state: "live" },
          ],
          note: "`i++` → `4`; test `4 <= 3` **মিথ্যা** — body চলে না, loop শেষ। এই মুহূর্তে `i` এর মান ছিল `4`, কিন্তু loop এর পরে `i` scope এ আর নেই।",
        },
        {
          line: 4,
          memory: [{ name: "sum", value: "6", kind: "let", state: "live" }],
          output: "6",
          note: "Loop এর পরের কোড: `console.log(sum)` → `6`। শুধু `sum` বেঁচে আছে, কারণ `let i` শুধু for এর scope এ।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "for loop এর চক্র: init → test → body → update",
      caption: "init একবার; তারপর test → body → update এর চক্র ঘোরে, test মিথ্যা হলে বেরিয়ে যায়।",
      nodes: [
        { id: "init", label: "init", sub: "let i = 0 (একবার)" },
        { id: "test", label: "test", sub: "i < 2 ?" },
        { id: "body", label: "body", sub: "console.log(i)" },
        { id: "update", label: "update", sub: "i++" },
        { id: "exit", label: "exit", sub: "loop শেষ" },
      ],
      steps: [
        {
          active: ["init"],
          items: { init: ["i = 0"] },
          note: "`init` প্রথমে একবার চলে এবং `i` তৈরি করে। এরপর কখনো আর init এ ফেরা হয় না।",
        },
        {
          active: ["test"],
          items: { test: ["0 < 2 → true"] },
          note: "প্রতি iteration এর **আগে** test। সত্য, তাই body তে যাওয়া হবে।",
        },
        {
          active: ["body"],
          items: { body: ["print i"] },
          output: "0",
          note: "Body চলল: `0` print হলো।",
        },
        {
          active: ["update"],
          items: { update: ["i = 1"] },
          note: "Body এর পর update: `i++`। তারপর আবার test এ ফেরা।",
        },
        {
          active: ["test", "body"],
          items: { test: ["1 < 2 → true"], body: ["print i"] },
          output: "1",
          note: "দ্বিতীয় চক্র: test সত্য, body তে `1` print। তারপর update করে `i = 2`।",
        },
        {
          active: ["test", "exit"],
          items: { test: ["2 < 2 → false"], exit: ["i এর scope শেষ"] },
          note: "তৃতীয়বার test মিথ্যা — body না চালিয়ে সরাসরি loop থেকে বেরোনো। মোট body চলল ২ বার।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "for, while ও do...while পাশাপাশি",
      description: "একই কাজ (১ থেকে ৩ গোনা) তিনভাবে। এরপর দেখুন `do...while` শর্ত মিথ্যা হলেও একবার চলে, আর `while` একবারও চলে না।",
      code: `for (let i = 1; i <= 3; i++) {
  console.log("for:", i);
}

let n = 1;
while (n <= 3) {
  console.log("while:", n);
  n++; // update ভুললে infinite loop
}

let k = 1;
do {
  console.log("do...while:", k);
  k++;
} while (k <= 3);

// শর্ত শুরু থেকেই মিথ্যা
let a = 10;
while (a < 5) {
  console.log("while চলবে না");
}
do {
  console.log("do...while তবু একবার চলল");
} while (a < 5);`,
    },
    {
      level: "intermediate",
      title: "for...of বনাম for...in: Array, String, Map, Set, Object",
      description: "কোন loop কী দেয় তা এক জায়গায় দেখুন। বিশেষভাবে লক্ষ্য করুন: array তে `for...in` এর key এর type, এবং prototype থেকে inherited key।",
      code: `const fruits = ["apple", "banana"];

for (const f of fruits) console.log("of:", f);
for (const [i, f] of fruits.entries()) console.log("entries:", i, f);
for (const k in fruits) console.log("in:", k, typeof k);

for (const ch of "hi!") console.log("char:", ch);

const stock = new Map([["pen", 5], ["book", 2]]);
for (const [name, qty] of stock) console.log("map:", name, qty);

const tags = new Set(["a", "b", "a"]);
for (const t of tags) console.log("set:", t);

const user = { name: "Rina", age: 25 };
for (const [k, v] of Object.entries(user)) console.log("entry:", k, v);

// for...in inherited enumerable key ও দেখায়
const parent = { inherited: true };
const child = Object.create(parent);
child.own = 1;
for (const key in child) {
  console.log("for...in:", key, "| own?", Object.hasOwn(child, key));
}
console.log("Object.keys:", Object.keys(child));

// plain object iterable নয়
try {
  for (const x of user) console.log(x);
} catch (e) {
  console.log(e.name);
}`,
    },
    {
      level: "real-world",
      title: "Record batch প্রক্রিয়াকরণ: continue, break ও label",
      description: "বাস্তবে একটি batch এ ভুল record বাদ দিতে (`continue`) এবং নির্দিষ্ট sentinel এ পুরো কাজ থামাতে (`break`) হয়। নিচে এর সাথে nested loop এ label দিয়ে প্রথম মিল খোঁজা আছে।",
      code: `const batch = [
  { id: 1, amount: 120 },
  { id: 2, amount: -5 },      // অবৈধ
  { id: 3, amount: 80 },
  { id: 4, amount: "ten" },   // অবৈধ
  { id: 5, amount: 50 },
];

let total = 0;
let skipped = 0;
for (const rec of batch) {
  if (typeof rec.amount !== "number" || rec.amount < 0) {
    skipped++;
    continue; // এই record বাদ, পরেরটিতে যাও
  }
  total += rec.amount;
}
console.log("total:", total, "skipped:", skipped);

// প্রথম মিল পেলেই দুই স্তরের loop থেকেই বেরোনো
const seats = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3"],
  ["C1", "C2", "C3"],
];
let found = null;
search: for (let r = 0; r < seats.length; r++) {
  for (let c = 0; c < seats[r].length; c++) {
    if (seats[r][c] === "B2") {
      found = { row: r, col: c };
      break search; // শুধু ভেতরের নয়, বাইরের loop ও
    }
  }
}
console.log(found);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
for (let i = 0; i < 5; i++) {
  console.log("i =", i);
}
`,
    },
    {
      label: "forEach এ break/return কাজ করে না",
      code: `const nums = [1, 2, 3, 4, 5];

// forEach: return শুধু ওই callback শেষ করে
nums.forEach((n) => {
  if (n === 3) return; // continue এর মতো আচরণ, break নয়
  console.log("forEach:", n);
});

// for...of: break আসলেই থামায়
for (const n of nums) {
  if (n === 3) break;
  console.log("for...of:", n);
}

// some() এর মতো method early exit দেয় (Module 03 এ বিস্তারিত)
nums.some((n) => {
  if (n === 3) return true;
  console.log("some:", n);
  return false;
});`,
    },
    {
      label: "Closure: var বনাম let loop",
      code: `const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(() => i);
}

const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(() => j);
}

console.log(withVar.map((f) => f()));
console.log(withLet.map((f) => f()));

// for...of এ const প্রতি iteration এ নতুন binding
const fns = [];
for (const x of ["a", "b"]) fns.push(() => x);
console.log(fns.map((f) => f()));`,
    },
    {
      label: "Iterate করার সময় array বদলানো",
      code: `// ভুল: সামনে থেকে splice
const a = [1, 2, 2, 3, 2];
for (let i = 0; i < a.length; i++) {
  if (a[i] === 2) a.splice(i, 1);
}
console.log("forward splice:", a);

// ঠিক ১: পেছন থেকে
const b = [1, 2, 2, 3, 2];
for (let i = b.length - 1; i >= 0; i--) {
  if (b[i] === 2) b.splice(i, 1);
}
console.log("backward splice:", b);

// ঠিক ২: নতুন array বানান
const c = [1, 2, 2, 3, 2].filter((n) => n !== 2);
console.log("filter:", c);`,
    },
    {
      label: "Off-by-one ও string এর code point",
      code: `const arr = ["x", "y", "z"];
for (let i = 0; i <= arr.length; i++) {
  console.log(i, arr[i]);   // শেষ লাইনে undefined
}

const s = "a😀";
console.log("length:", s.length);          // code unit গণনা
let count = 0;
for (const ch of s) count++;               // code point ধরে
console.log("for...of count:", count);
console.log([...s].length);`,
    },
  ],

  debugging: [
    {
      title: "Off-by-one: <= দিয়ে সীমা পার করা",
      bad: `const items = ["a", "b", "c"];
const out = [];
for (let i = 0; i <= items.length; i++) {
  out.push(items[i].toUpperCase());
}
console.log(out);`,
      why: "`i <= items.length` এ শেষ iteration এ `i === 3`, আর `items[3]` হলো `undefined`। `undefined.toUpperCase()` TypeError ছোড়ে। Array এর বৈধ index `0` থেকে `length - 1`, তাই সীমা হবে `<`।",
      fix: `const items = ["a", "b", "c"];
const out = [];
for (let i = 0; i < items.length; i++) {
  out.push(items[i].toUpperCase());
}
console.log(out);

// আরও ভালো: index ছাড়াই
const out2 = [];
for (const item of items) out2.push(item.toUpperCase());
console.log(out2);`,
    },
    {
      title: "Iterate করার সময় splice: উপাদান ডিঙিয়ে যায়",
      bad: `const nums = [1, 2, 2, 3];
for (let i = 0; i < nums.length; i++) {
  if (nums[i] === 2) {
    nums.splice(i, 1); // সরালে পরের উপাদান এক ঘর বাঁয়ে আসে
  }
}
console.log(nums);`,
      why: "প্রথম `2` সরানোর পর দ্বিতীয় `2` `i` index এ চলে আসে, কিন্তু loop `i++` করে পরের index এ চলে যায় — ফলে দ্বিতীয় `2` পরীক্ষাই হয় না এবং `[1, 2, 3]` থেকে যায়। কোনো error নেই, তাই bug টি লুকিয়ে থাকে। নতুন array বানানোই সবচেয়ে নিরাপদ।",
      fix: `const nums = [1, 2, 2, 3];
const result = nums.filter((n) => n !== 2);
console.log(result);`,
    },
    {
      title: "Array তে for...in: key string, সংখ্যা নয়",
      bad: `const prices = [10, 20, 30];
let total = 0;
for (const i in prices) {
  total += i; // i হলো "0", "1", "2" (string)
}
console.log(total);`,
      why: "`for...in` index কে **string** হিসেবে দেয়। তাই `total += i` সংখ্যা যোগ না করে string জোড়া লাগায় (`0 + \"0\"` → `\"00\"`), এবং এটি prices এর মানই ধরছে না — শুধু index ধরছে। মান পেতে `for...of`।",
      fix: `const prices = [10, 20, 30];
let total = 0;
for (const price of prices) {
  total += price;
}
console.log(total);`,
    },
    {
      title: "Infinite loop: update ভুলে যাওয়া",
      bad: `let i = 0;
let guard = 0; // শুধু এই demo কে নিরাপদ রাখতে
while (i < 3) {
  console.log("working...", i);
  // i++ ভুলে গেছি!
  if (++guard > 3) {
    console.log("থামাতে হলো: শর্ত কখনো মিথ্যা হয়নি");
    break;
  }
}`,
      why: "`while (i < 3)` এর শর্ত নির্ভর করে `i` এর ওপর, কিন্তু body তে কোথাও `i` বদলানো হয়নি, তাই শর্ত চিরকাল সত্য। বাস্তবে `guard` থাকে না — browser tab freeze হয় বা Node process আটকে যায়। নিয়ম: loop লেখার সময় নিজেকে জিজ্ঞেস করুন ‘কোন লাইন শর্তকে একদিন মিথ্যা করবে?’",
      fix: `let i = 0;
while (i < 3) {
  console.log("working...", i);
  i++; // শর্ত বদলানোর লাইন
}
console.log("done");`,
    },
    {
      title: "forEach এ async/await ক্রমানুসারে চলে না",
      bad: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  [1, 2, 3].forEach(async (n) => {
    await wait(10);
    console.log("item", n);
  });
  console.log("done"); // আগেই চলে যায়!
}
run();`,
    why: "`forEach` callback এর ফেরত করা Promise এর জন্য অপেক্ষা করে না। তাই `run()` এর `await` নেই, `\"done\"` আগে print হয় এবং আইটেমগুলো পরে আসে। ক্রমানুযায়ী async কাজের জন্য `for...of` এর ভেতরে `await` ব্যবহার করুন (async/await বিস্তারিত পরের lesson এ)।",
      fix: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  for (const n of [1, 2, 3]) {
    await wait(10);
    console.log("item", n);
  }
  console.log("done");
}
run();`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "১ থেকে ১০ এর যোগফল",
      prompt: "`for` loop দিয়ে `1` থেকে `10` পর্যন্ত সংখ্যার যোগফল বের করে print করুন।",
      starter: `let sum = 0;
// TODO: for loop লিখুন

console.log(sum);`,
      expected: "55",
      hints: ["`for (let i = 1; i <= 10; i++)` — `<=` কারণ ১০ ও ধরতে হবে।", "Body তে `sum += i;`।"],
      solution: `let sum = 0;
for (let i = 1; i <= 10; i++) {
  sum += i;
}
console.log(sum);`,
    },
    {
      level: "beginner",
      title: "while দিয়ে countdown",
      prompt: "`n` শুরু `3` থেকে `while` loop এ `3`, `2`, `1` আলাদা লাইনে print করুন, তারপর `Liftoff!` print করুন।",
      starter: `let n = 3;
// TODO: while loop লিখুন

console.log("Liftoff!");`,
      expected: "3\n2\n1\nLiftoff!",
      hints: ["শর্ত: `n > 0`।", "প্রতি iteration এ print করে `n--` করতে ভুলবেন না।"],
      solution: `let n = 3;
while (n > 0) {
  console.log(n);
  n--;
}
console.log("Liftoff!");`,
    },
    {
      level: "beginner",
      title: "for...of দিয়ে স্বরবর্ণ গোনা",
      prompt: "`for...of` দিয়ে `word` এর প্রতিটি অক্ষর দেখে স্বরবর্ণ (`a e i o u`) কয়টি আছে তা print করুন।",
      starter: `const word = "education";
let vowels = 0;
const vowelSet = "aeiou";
// TODO: for...of loop লিখুন

console.log(vowels);`,
      expected: "5",
      hints: ["`for (const ch of word)`।", "`vowelSet.includes(ch)` দিয়ে পরীক্ষা করুন।"],
      solution: `const word = "education";
let vowels = 0;
const vowelSet = "aeiou";
for (const ch of word) {
  if (vowelSet.includes(ch)) vowels++;
}
console.log(vowels);`,
    },
    {
      level: "intermediate",
      title: "Object কে query string এ রূপান্তর",
      prompt: "`Object.entries` ও `for...of` দিয়ে object টিকে `a=1&b=2&c=3` ধরনের string বানিয়ে print করুন (বাইরের ডেটা হলে encode করতে হয়, এখানে দরকার নেই)।",
      starter: `const params = { a: 1, b: 2, c: 3 };
const parts = [];
// TODO: parts এ "key=value" জমান

console.log(parts.join("&"));`,
      expected: "a=1&b=2&c=3",
      hints: ["`for (const [key, value] of Object.entries(params))`।", "`parts.push(key + \"=\" + value)`।"],
      solution: `const params = { a: 1, b: 2, c: 3 };
const parts = [];
for (const [key, value] of Object.entries(params)) {
  parts.push(key + "=" + value);
}
console.log(parts.join("&"));`,
      explanation: "`Object.entries` শুধু নিজের enumerable string key এর `[key, value]` জোড়া দেয়, তাই `for...in` এর inherited key এর ঝামেলা নেই।",
    },
    {
      level: "intermediate",
      title: "প্রথম duplicate খুঁজুন (early break)",
      prompt: "তালিকাটি ঘুরে **প্রথম যে মান দ্বিতীয়বার দেখা যায়** তা `Set` ব্যবহার করে খুঁজে বের করে print করুন। পেলেই loop থামান। না পেলে `none`।",
      starter: `const nums = [3, 1, 4, 1, 5, 3];
let firstDup = "none";
// TODO: Set + for...of + break

console.log(firstDup);`,
      expected: "1",
      hints: ["`const seen = new Set();`", "`seen.has(n)` সত্য হলে `firstDup = n; break;`, নইলে `seen.add(n)`।"],
      solution: `const nums = [3, 1, 4, 1, 5, 3];
let firstDup = "none";
const seen = new Set();
for (const n of nums) {
  if (seen.has(n)) {
    firstDup = n;
    break;
  }
  seen.add(n);
}
console.log(firstDup);`,
      explanation: "দ্বিতীয়বার দেখা যায় এমন প্রথম মান `1` (index ৩), যদিও `3` ও পরে পুনরাবৃত্ত — কারণ আমরা ‘যে মুহূর্তে duplicate ধরা পড়ে’ তা খুঁজছি, আর `break` পরের উপাদান দেখা বন্ধ করে।",
    },
    {
      level: "challenge",
      title: "Stream প্রক্রিয়াকরণ: skip, stop ও গণনা",
      prompt:
        "`records` ঘুরে: যদি মান `\"STOP\"` string হয় তবে সম্পূর্ণ loop থামান। যদি মান সংখ্যা না হয় বা ঋণাত্মক হয় তবে সেটি বাদ দিন (`skipped` বাড়ান) এবং পরেরটিতে যান। অন্যথায় `total` এ যোগ ও `processed` বাড়ান। শেষে তিন লাইনে `total`, `processed`, `skipped` print করুন।",
      starter: `const records = [10, -5, 20, "x", 30, "STOP", 99];
let total = 0;
let processed = 0;
let skipped = 0;

// TODO: for...of + continue + break

console.log("total:", total);
console.log("processed:", processed);
console.log("skipped:", skipped);`,
      expected: "total: 60\nprocessed: 3\nskipped: 2",
      hints: [
        "`STOP` পরীক্ষা সবার আগে করুন — নইলে সেটি ‘সংখ্যা নয়’ হিসেবে skipped গোনা হবে।",
        "`typeof r !== \"number\" || r < 0` হলে `skipped++; continue;`।",
        "`99` কখনো দেখাই হবে না, কারণ `break` তার আগেই loop শেষ করেছে।",
      ],
      solution: `const records = [10, -5, 20, "x", 30, "STOP", 99];
let total = 0;
let processed = 0;
let skipped = 0;

for (const r of records) {
  if (r === "STOP") break;
  if (typeof r !== "number" || r < 0) {
    skipped++;
    continue;
  }
  total += r;
  processed++;
}

console.log("total:", total);
console.log("processed:", processed);
console.log("skipped:", skipped);`,
      explanation: "শর্তের ক্রম এখানে মূল বিষয়: ‘থামার’ নিয়ম (`break`) আগে, ‘বাদ দেওয়ার’ নিয়ম (`continue`) তার পরে, আর স্বাভাবিক কাজ সবশেষে। `10 + 20 + 30 = 60`, বাদ পড়ল `-5` ও `\"x\"`।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`for (const k in [\"a\", \"b\"]) console.log(typeof k);` কী print করবে?",
        options: ["\"number\" দুইবার", "\"string\" দুইবার", "\"undefined\" দুইবার", "\"object\" দুইবার"],
        answer: 1,
        explanation: "`for...in` সবসময় property **key** দেয় এবং key গুলো string — array এর index ও `\"0\"`, `\"1\"`। তাই `typeof k` হয় `\"string\"`। `\"number\"` একটি জনপ্রিয় ভুল ধারণা; `undefined`/`object` এর কোনো কারণ নেই।",
      },
      {
        question: "`let c = 0; do { c++; } while (false); console.log(c);` এর output কী?",
        options: ["0", "infinite loop", "1", "TypeError"],
        answer: 2,
        explanation: "`do...while` এ body আগে চলে, শর্ত পরে পরীক্ষা হয়। তাই body একবার চলে (`c` হয় `1`), তারপর `false` দেখে loop শেষ। `0` হতো সাধারণ `while (false)` এ। শর্ত মিথ্যা, তাই infinite loop নয়; কোডে কোনো error নেই।",
      },
      {
        question: "`forEach` এর callback এর ভেতরে `return;` লিখলে কী হয়?",
        options: ["পুরো loop থেমে যায়", "বাইরের function থেকেও return হয়", "SyntaxError হয়", "শুধু ওই callback শেষ হয়, loop পরের উপাদানে চলতে থাকে"],
        answer: 3,
        explanation: "Callback একটি আলাদা function, তাই `return` শুধু সেটিকেই শেষ করে — `continue` এর মতো আচরণ। `forEach` কে থামানো যায় না (exception ছোড়া ছাড়া)। বাইরের function এ return হয় না, আর এটি বৈধ syntax। Early exit দরকার হলে `for...of` + `break`।",
      },
      {
        question: "`for (let i = 0; i < 3; i++) { if (i === 1) continue; console.log(i); }` কী print করে?",
        options: ["0 এবং 2", "0, 1, 2", "শুধু 0", "শুধু 1"],
        answer: 0,
        explanation: "`i === 1` এ `continue` বাকি body (print) বাদ দিয়ে সরাসরি `i++` এ যায়, তাই `1` print হয় না। বাকি দুটি `0` ও `2` print হয়। `break` হলে শুধু `0` print হতো — `continue` ও `break` এর পার্থক্য এখানেই।",
      },
      {
        question: "নিচের কোনটি `for...of` দিয়ে সরাসরি ঘোরা যায় **না**?",
        options: ["Array", "Map", "Plain object `{ a: 1 }`", "String"],
        answer: 2,
        explanation: "Plain object এ `Symbol.iterator` নেই, তাই iterable নয় — `for...of` TypeError দেয়। Array, `Map` ও string সবাই iterable। Object এর জন্য `Object.keys/values/entries` এর ফলাফল (array) এর ওপর `for...of` চালাতে হয়।",
      },
    ],
    coding: [
      {
        title: "FizzBuzz (১ থেকে 15)",
        prompt: "১ থেকে ১৫ পর্যন্ত: ৩ ও ৫ উভয় দিয়ে বিভাজ্য হলে `FizzBuzz`, শুধু ৩ দিয়ে `Fizz`, শুধু ৫ দিয়ে `Buzz`, নইলে সংখ্যাটিই — আলাদা লাইনে print করুন।",
        starter: `// TODO: for loop + if / else if
`,
        expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
        solution: `for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) console.log("FizzBuzz");
  else if (i % 3 === 0) console.log("Fizz");
  else if (i % 5 === 0) console.log("Buzz");
  else console.log(i);
}`,
      },
      {
        title: "শব্দের গণনা (Map দিয়ে)",
        prompt: "`words` array তে প্রতিটি শব্দ কতবার আছে তা `Map` এ গুনে `শব্দ: সংখ্যা` আকারে আলাদা লাইনে (প্রথম দেখার ক্রমে) print করুন।",
        starter: `const words = ["a", "b", "a", "c", "b", "a"];
const counts = new Map();
// TODO: গণনা করুন, তারপর for...of দিয়ে print করুন
`,
        expected: "a: 3\nb: 2\nc: 1",
        solution: `const words = ["a", "b", "a", "c", "b", "a"];
const counts = new Map();
for (const w of words) {
  counts.set(w, (counts.get(w) ?? 0) + 1);
}
for (const [word, n] of counts) {
  console.log(word + ": " + n);
}`,
      },
    ],
  },

  interview: [
    {
      q: "`for...of` ও `for...in` এর পার্থক্য কী? Array এর জন্য কোনটি ব্যবহার করবেন?",
      a: "`for...of` একটি **iterable** এর **মান** দেয় (`Symbol.iterator` protocol ধরে), আর `for...in` একটি object এর **enumerable string key** দেয় — নিজের এবং prototype chain থেকে inherited উভয়ই। Array এর জন্য `for...of` (বা সাধারণ `for`/array method)।\n\nকারণ: `for...in` এ index আসে **string** হিসেবে (`\"0\"`), `Array.prototype` এ কেউ enumerable property যোগ করলে সেটিও আসে, এবং sparse array এ আচরণ অপ্রত্যাশিত। Object এর key ঘোরার জন্যও বেশি নিরাপদ `Object.keys/entries`, কারণ সেগুলো inherited key বাদ দেয়। `for...in` ব্যবহার করলে `Object.hasOwn(obj, key)` দিয়ে ফিল্টার করা ভালো অভ্যাস।",
    },
    {
      q: "`forEach` কেন `break` সমর্থন করে না, এবং `async/await` এর সাথে কেন সমস্যা হয়?",
      a: "`forEach` একটি method, যা প্রতিটি উপাদানের জন্য আপনার দেওয়া callback function ডাকে। `break`/`continue` শুধু সরাসরি loop statement এর ভেতরে বৈধ, callback এর ভেতরে নয়; callback এর `return` শুধু ওই callback এর invocation শেষ করে। থামাতে হলে exception ছুঁড়তে হয়, যা অশোভন। তাই early exit চাইলে `for...of`, বা `some`/`every`/`find` এর মতো method (Module 03) ব্যবহার করুন।\n\nAsync এর ক্ষেত্রে `forEach` callback এর ফেরত দেওয়া Promise কে **কখনো অপেক্ষা করে না**। `arr.forEach(async x => await work(x))` সব কাজ প্রায় একই সাথে শুরু করে দেয় এবং `forEach` এর পরের কোড আগেই চলে যায়, ত্রুটিও আলাদা হয়ে ‘unhandled rejection’ হতে পারে। ক্রমানুসারে কাজ চাইলে async function এ `for...of` + `await`; সমান্তরাল কাজ চাইলে `Promise.all(arr.map(...))`।",
    },
    {
      q: "`for (let i...)` এবং `for (var i...)` এ closure এর আচরণ আলাদা কেন?",
      a: "`var i` function (বা global) scope এ একটিই binding, তাই loop এ তৈরি সব closure একই `i` দেখে এবং loop শেষে তার চূড়ান্ত মান (যেমন `3`) পায়। `for (let i...)` এ spec অনুযায়ী **প্রতিটি iteration এর জন্য `i` এর একটি নতুন binding** তৈরি হয়, আগের iteration এর শেষ মান নতুন binding এ কপি হয়ে তারপর `i++` চলে। তাই প্রতিটি closure নিজের iteration এর `i` ধরে রাখে।\n\nএকই কারণে `for...of`/`for...in` এ `const` ব্যবহার করা যায় — প্রতি iteration এ নতুন binding তৈরি হয়, reassign হচ্ছে না। কিন্তু classic `for (const i = 0; i < n; i++)` এ `i++` reassignment, তাই দ্বিতীয় iteration এ TypeError।",
    },
    {
      q: "Loop চলাকালীন array থেকে উপাদান সরানো বা যোগ করা নিরাপদ কি? কীভাবে এড়াবেন?",
      a: "সাধারণত নিরাপদ নয়। সামনে থেকে `splice` দিয়ে সরালে পরের উপাদান বাঁয়ে সরে যায় আর counter এগিয়ে যায়, ফলে একটি উপাদান **বাদ পড়ে**। `for...of` চলাকালীন `push` করলে array iterator প্রতিবার বর্তমান `length` দেখে বলে নতুন উপাদানও পরে iteration এ আসে — ভুলভাবে করলে loop অসীম হয়ে যেতে পারে। (`forEach` এর ক্ষেত্রে সীমা শুরুতেই নির্ধারিত হয়, তাই নতুন যোগ হওয়া উপাদান সেখানে ঘোরা হয় না, কিন্তু সরানো উপাদান বাদ পড়ে।)\n\nনিরাপদ উপায়: **(১)** `filter` / `map` দিয়ে নতুন array বানান (সবচেয়ে পরিষ্কার); **(২)** পেছন থেকে ঘুরে `splice`; **(৩)** আগে আলাদা তালিকায় কী কী সরাবেন জমা করে পরে সরান; **(৪)** মূল array এর একটি কপি ঘোরা (`[...arr]`)।",
    },
    {
      q: "`break`, `continue` ও label কীভাবে কাজ করে? Label কখন ব্যবহার করবেন?",
      a: "`break` সবচেয়ে ভেতরের loop বা `switch` থেকে বেরিয়ে যায়; `continue` বর্তমান iteration এর বাকি অংশ ছেড়ে পরের iteration এ যায় (`for` এ update অংশ চলে, তারপর test)। মনে রাখবেন, loop এর ভেতরের `switch` এ `break` শুধু `switch` থেকে বেরোয়। Label ব্যবহার করে `break outer;` বা `continue outer;` দিলে বাইরের নামকরণ করা loop এ প্রভাব ফেলা যায়।\n\nLabel বিরল, কারণ বেশি label পড়া কঠিন করে। সাধারণত ভেতরের লজিক একটি আলাদা function এ সরিয়ে সরাসরি `return` করলেই কাজ হয়, যা বেশি পরিষ্কার। তবু দুই স্তরের grid/matrix এ প্রথম মিল খোঁজার মতো ছোট ক্ষেত্রে label সরল সমাধান হতে পারে।",
    },
    {
      q: "`for`, `for...of`, `forEach`, `map` — কোনটি দ্রুত? কীভাবে বেছে নেবেন?",
      a: "এই প্রশ্নের নির্দিষ্ট উত্তর নেই — গতি নির্ভর করে engine (V8, SpiderMonkey, JavaScriptCore), ডেটার আকার ও কোডের ধরনের ওপর, এবং আধুনিক engine এগুলোকে ভালোভাবে optimize করে। বেশিরভাগ বাস্তব কাজে পার্থক্য নগণ্য, তাই micro-benchmark এর ওপর ভিত্তি করে কোড বিকৃত করা ঠিক নয়।\n\nবেছে নেওয়ার নিয়ম: **পাঠযোগ্যতা ও উদ্দেশ্য** দেখুন। Early exit/`await` লাগলে `for...of`; রূপান্তর হলে `map`; ফিল্টার হলে `filter`; সরল side effect হলে `forEach` বা `for...of`। যদি profiler দেখায় loop আসলেই বাধা, তখন measure করে অপ্টিমাইজ করুন (যেমন `length` cache করা বা algorithm বদলানো) — তবে প্রায়ই algorithm (O(n²) থেকে O(n)) বদলানো loop এর ধরন বদলানোর চেয়ে অনেক বড় জয়।",
    },
  ],

  summary: {
    takeaways: [
      "`for` এ init একবার, তারপর test → body → update চক্র; test মিথ্যা হলে loop শেষ।",
      "`while` এ আগে শর্ত, `do...while` এ আগে body (কমপক্ষে একবার) — counter update নিজে লিখতে হয়।",
      "`for...of` iterable এর **মান** দেয়; Map এ `[key, value]`; index চাইলে `arr.entries()`; plain object এ নয়।",
      "`for...in` enumerable **string key** (inherited সহ) দেয় — array এর জন্য এড়িয়ে চলুন।",
      "`break` loop থামায়, `continue` বর্তমান iteration বাদ দেয়; `forEach` এ এ দুটির কোনোটি কাজ করে না, `await` ও না।",
      "`let` প্রতি iteration এ নতুন binding বানায় — closure bug এর সমাধান।",
      "Off-by-one, infinite loop ও iterate করার সময় array বদলানো — তিনটি ক্লাসিক bug; user-controlled সীমা বাঁধুন।",
    ],
    syntax: `for (let i = 0; i < n; i++) { }
while (cond) { }
do { } while (cond);

for (const v of iterable) { }              // array, string, Map, Set
for (const [i, v] of arr.entries()) { }    // index সহ
for (const [k, v] of Object.entries(o)) { } // object এর নিজের key
for (const key in obj) { }                 // inherited key ও আসে

outer: for (...) { for (...) { break outer; } }`,
    whenToUse: [
      "সংগ্রহের সব উপাদান পড়তে ও early exit বা `await` লাগলে → `for...of`।",
      "Index/সংখ্যা নিয়ন্ত্রণ বা উল্টো দিকে ঘুরতে → classic `for`।",
      "কতবার ঘুরবে আগে জানা নেই (queue, retry) → `while` / `do...while`।",
      "Object এর key/value → `Object.entries` + `for...of` (শুধু inherited key সহ দরকার হলে তবেই `for...in`)।",
      "রূপান্তর/ফিল্টার/যোগফল → Module 03 এর `map`/`filter`/`reduce`।",
    ],
    next: [
      "Error Handling — loop এর ভেতরে ব্যর্থতা সামলানো",
      "Functions ও Scope — closure এর গভীর ব্যাখ্যা",
      "Module 03: Array methods (`map`, `filter`, `reduce`, `find`)",
      "Iterators ও Generators — `Symbol.iterator` নিজে বানানো",
    ],
  },

  compatibility:
    "`for`, `while`, `do...while` সব JavaScript এর শুরু থেকে আছে। `for...of`, `let` per-iteration binding, `Map`/`Set` ES2015; `Object.entries` ES2017; `Object.hasOwn` ES2022 — সব আধুনিক browser ও Node.js এ একই আচরণ করে। পার্থক্য শুধু প্রভাবে: browser এ দীর্ঘ loop main thread আটকে UI জমায়, Node এ event loop আটকায়। এই lesson এর সব runnable কোড pure JavaScript, তাই Web Worker sandbox এ চলে।",
};
