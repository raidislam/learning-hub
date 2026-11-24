import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Arithmetic, assignment (compound ও logical assignment সহ), comparison ও logical operator গুলো সঠিকভাবে ব্যবহার করতে পারবেন।",
    "`&&` ও `||` যে boolean নয়, **operand** ফেরত দেয় — এবং **short-circuit evaluation** ভেতরে কীভাবে চলে, তা ব্যাখ্যা করতে পারবেন।",
    "`??` ও `||` এর পার্থক্য বুঝে `0`, `''`, `false` এর মতো বৈধ মান হারানো bug এড়াতে পারবেন।",
    "Operator **precedence** ও **associativity** পড়ে জটিল expression এর ফল আগে থেকে বলতে পারবেন।",
    "Prefix/postfix increment, `typeof`, `in`, `instanceof`, `delete`, `void`, comma ও bitwise operator এর মূল ব্যবহার জানবেন।",
  ],

  concept: [
    { type: "h3", text: "Operator কী এবং কেন দরকার?" },
    {
      type: "p",
      text: "**Operator** হলো একটি বিশেষ চিহ্ন (`+`, `===`, `&&`, `?.` ইত্যাদি) যা এক বা একাধিক **operand** (মান) নিয়ে একটি নতুন মান তৈরি করে। `3 + 4` এ `+` হলো operator, `3` ও `4` হলো operand, আর পুরো লেখাটি একটি **expression** — যার একটি ফলাফল মান আছে। JavaScript এর প্রায় সব হিসাব, শর্ত, ডিফল্ট মান নির্ধারণ ও data নিরাপদে পড়ার কাজ operator দিয়েই হয়। তাই operator এর নিয়ম নিখুঁতভাবে না জানলে এমন bug হয় যা চোখে ধরা কঠিন — যেমন `0` কে ‘মান নেই’ ভেবে ডিফল্টে বদলে ফেলা।",
    },
    {
      type: "p",
      text: "Operator কে operand সংখ্যা অনুযায়ী তিন ভাগে ভাবা যায়: **unary** (একটি operand, যেমন `!x`, `typeof x`), **binary** (দুটি, যেমন `a + b`), এবং **ternary** (তিনটি — JavaScript এ একমাত্র `cond ? a : b`)।",
    },
    { type: "h3", text: "Arithmetic operator" },
    {
      type: "compare",
      headers: ["Operator", "কাজ", "উদাহরণ", "ফল"],
      rows: [
        ["`+`", "যোগ (বা string concatenation)", "`7 + 2`", "`9`"],
        ["`-` `*` `/`", "বিয়োগ, গুণ, ভাগ (ভাগ সবসময় floating-point)", "`7 / 2`", "`3.5`"],
        ["`%`", "Remainder (ভাগশেষ) — dividend এর চিহ্ন ধরে রাখে", "`-7 % 3`", "`-1`"],
        ["`**`", "Exponent (ES2016), right-associative", "`2 ** 10`", "`1024`"],
        ["unary `+` / `-`", "ToNumber রূপান্তর / চিহ্ন উল্টানো", "`+\"42\"`", "`42`"],
      ],
    },
    {
      type: "p",
      text: "দুটি জিনিস মাথায় রাখুন। প্রথমত, JavaScript এর `Number` হলো IEEE 754 double — তাই `0.1 + 0.2` হয় `0.30000000000000004`, আর `1 / 0` হয় `Infinity` (error নয়), `0 / 0` হয় `NaN`। দ্বিতীয়ত, `+` একমাত্র arithmetic operator যা string এও কাজ করে: কোনো এক পাশ string হলে অন্য পাশ string এ রূপান্তরিত হয়ে concatenation হয় (`'1' + 2` → `'12'`)। অথচ `-`, `*`, `/` সবসময় সংখ্যায় রূপান্তর করে (`'5' - 2` → `3`)। `%` কে ‘modulo’ বলা হলেও এটি আসলে **remainder** — ঋণাত্মক সংখ্যায় ফল ঋণাত্মক হতে পারে।",
    },
    { type: "h3", text: "Assignment, compound ও logical assignment" },
    {
      type: "p",
      text: "`=` ডান পাশের expression এর মান বাম পাশের binding/property তে বসায়, এবং নিজেও সেই মান ফেরত দেয় (তাই `a = b = 0` চলে)। `+=`, `-=`, `*=`, `**=` ইত্যাদি **compound assignment** — `x += 3` মোটামুটি `x = x + 3` এর সংক্ষেপ, তবে বাম পাশ একবারই evaluate হয়। ES2021 এ যুক্ত হয়েছে তিনটি **logical assignment**, যা short-circuit করে — অর্থাৎ শর্ত না মিললে assignment ই হয় না:",
    },
    {
      type: "ul",
      items: [
        "`a ||= b` — `a` **falsy** হলে তবেই `a = b`। (`a || (a = b)` এর মতো)",
        "`a &&= b` — `a` **truthy** হলে তবেই `a = b`।",
        "`a ??= b` — `a` **null বা undefined** হলে তবেই `a = b`। ‘ডিফল্ট বসাও, কিন্তু `0`/`''` ছুঁয়ো না’ — এটিই আধুনিক idiom।",
      ],
    },
    { type: "h3", text: "Comparison ও logical operator" },
    {
      type: "p",
      text: "`<`, `>`, `<=`, `>=` দুটি সংখ্যা তুলনা করে; দুটিই string হলে **lexicographic** (UTF-16 code unit ক্রমে) তুলনা করে — তাই `'10' < '9'` হয় `true`। `===`/`!==` (strict) ও `==`/`!=` (loose) এর বিস্তারিত আলাদা lesson এ আছে; আপাতত নিয়ম: **সবসময় `===` ও `!==`**।",
    },
    {
      type: "p",
      text: "`&&`, `||` ও `!` — এখানে সবচেয়ে বড় ভুল ধারণা হলো এরা ‘boolean ফেরত দেয়’। আসলে `&&` ও `||` **দুই operand এর একটিকেই** ফেরত দেয়, boolean এ রূপান্তর করে না। নিয়ম: `a || b` — `a` truthy হলে `a` ফেরত, নইলে `b`। `a && b` — `a` falsy হলে `a` ফেরত, নইলে `b`। শুধু `!` সবসময় boolean ফেরত দেয়।",
    },
    {
      type: "code",
      caption: "যেকোনো environment এ চলে — শুধু বোঝার জন্য, operand ফেরত দেওয়ার প্রমাণ",
      code: "console.log('Rina' || 'guest');   // 'Rina'   (বাঁদিক truthy, তাই সেটিই)\nconsole.log('' || 'guest');       // 'guest'\nconsole.log(5 && 'ok');           // 'ok'     (বাঁদিক truthy, তাই ডানদিক)\nconsole.log(0 && 'ok');           // 0       (বাঁদিক falsy, তাই সেটিই)",
    },
    { type: "h3", text: "Short-circuit evaluation ভেতরে কীভাবে চলে" },
    {
      type: "p",
      text: "`a || b` evaluate করার সময় engine আগে `a` evaluate করে। `a` truthy হলে ফল নির্ধারিত — তাই `b` এর expression **কখনো evaluate ই হয় না**। এই কারণে `b` এ function call থাকলে সেটি চলেই না। একে বলে **short-circuit**। এটি শুধু optimisation নয়, ভাষার নিয়মের অংশ — তাই `user && user.save()` বা `cache || compute()` এর মতো pattern নিরাপদ ও ইচ্ছাকৃতভাবে কাজ করে। একই কথা `&&` (বাঁদিক falsy হলে থামে), `??` (বাঁদিক null/undefined না হলে থামে) এবং তিনটি logical assignment এর জন্য সত্য।",
    },
    { type: "h3", text: "`??` বনাম `||` — সবচেয়ে গুরুত্বপূর্ণ আধুনিক পার্থক্য" },
    {
      type: "p",
      text: "ডিফল্ট মান দিতে বহু বছর `value || default` লেখা হতো। সমস্যা: `||` সব **falsy** মানকে ‘অনুপস্থিত’ ধরে — `0`, `''`, `false`, `NaN` সবই। কিন্তু একটি form এ `quantity = 0` বা `volume = 0` তো বৈধ ইনপুট! **Nullish coalescing `??`** (ES2020) শুধু `null` ও `undefined` কে ‘অনুপস্থিত’ ধরে। তাই ডিফল্ট দেওয়ার জন্য আধুনিক কোডে প্রথম পছন্দ `??`; `||` তখনই, যখন সত্যিই সব falsy মান ডিফল্টে বদলাতে চান (যেমন খালি string কে fallback label এ)।",
    },
    {
      type: "compare",
      headers: ["Expression", "`||` ফল", "`??` ফল"],
      rows: [
        ["`0 ?? 10` / `0 || 10`", "`10`", "`0`"],
        ["`'' ?? 'x'` / `'' || 'x'`", "`'x'`", "`''`"],
        ["`false ?? true` / `false || true`", "`true`", "`false`"],
        ["`null ?? 10` / `null || 10`", "`10`", "`10`"],
        ["`undefined ?? 10` / `undefined || 10`", "`10`", "`10`"],
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Syntax নিয়ম: `??` কে `||`/`&&` এর সাথে বন্ধনী ছাড়া মেশানো যায় না",
      text: "`a || b ?? c` লিখলে **SyntaxError** — ভাষার designers ইচ্ছাকৃতভাবে precedence এর অস্পষ্টতা বন্ধ করেছেন। স্পষ্ট করতে বন্ধনী দিন: `(a || b) ?? c`।",
    },
    { type: "h3", text: "Optional chaining `?.` (সংক্ষেপে)" },
    {
      type: "p",
      text: "`user?.address?.city` — যদি `user` বা `address` `null`/`undefined` হয়, তবে TypeError না ছুড়ে পুরো chain **short-circuit করে `undefined`** দেয়। `obj?.[key]` ও `fn?.()` রূপও আছে। এটি প্রায়ই `??` এর সাথে জোড়ায় ব্যবহার হয়: `user?.address?.city ?? 'Unknown'`। (Objects ও property access এর lesson এ এর পূর্ণ আলোচনা আসছে।) সতর্কতা: `?.` শুধু null/undefined এর জন্য রক্ষা দেয় — `0` বা `''` এ property পড়তে গেলে স্বাভাবিক আচরণই হয়।",
    },
    { type: "h3", text: "Ternary, unary ও বিশেষ operator গুলো" },
    {
      type: "ul",
      items: [
        "**Ternary** `cond ? a : b` — expression (মান ফেরত দেয়), তাই `const label = ok ? 'yes' : 'no'` চলে। nested ternary পড়তে কষ্টকর হয়ে গেলে `if/else` ব্যবহার করুন।",
        "**`typeof x`** — string ফেরত দেয় (`'number'`, `'string'`, `'object'`, `'function'`, `'bigint'`, `'symbol'`, `'undefined'`, `'boolean'`)। undeclared নামেও error দেয় না। বিখ্যাত অদ্ভুততা: `typeof null === 'object'` (ভাষার প্রথম দিকের ভুল, compatibility এর জন্য রয়ে গেছে)।",
        "**`in`** — `'key' in obj` property আছে কি না দেখে, **prototype chain সহ**। নিজস্ব property দেখতে `Object.hasOwn(obj, 'key')` ব্যবহার করুন।",
        "**`instanceof`** — `x instanceof Foo` দেখে `Foo.prototype` টি `x` এর prototype chain এ আছে কি না।",
        "**`delete obj.key`** — object থেকে নিজস্ব property মুছে `true/false` দেয়; variable মুছতে পারে না। array এর element এ ব্যবহার করলে ফাঁক (hole) রেখে যায় — তাই array তে এড়িয়ে চলুন।",
        "**`void expr`** — expression evaluate করে সবসময় `undefined` ফেরত দেয়। আজ বিরল; `void 0` হলো `undefined` পাওয়ার পুরোনো কৌশল।",
        "**Comma `a, b`** — দুটিই evaluate করে, ডানেরটি ফেরত দেয়। প্রায় কেবল `for (let i = 0, j = 10; ...)` এর মতো জায়গায় দেখা যায়। function argument এর কমা এটি নয়।",
      ],
    },
    { type: "h3", text: "Increment/decrement: prefix বনাম postfix" },
    {
      type: "p",
      text: "`i++` (postfix) আগে **পুরোনো মান** ফেরত দেয়, তারপর `i` বাড়ায়। `++i` (prefix) আগে বাড়ায়, তারপর **নতুন মান** ফেরত দেয়। একা একটি statement এ (`i++;`) দুটির ফল এক, কিন্তু বৃহত্তর expression এ আলাদা। তাই `count = count++` এর মতো লাইন কিছুই বদলায় না — postfix এর ফেরত মান (পুরোনোটি) আবার `count` এ বসে যায়।",
    },
    { type: "h3", text: "Precedence ও associativity" },
    {
      type: "p",
      text: "একটি expression এ একাধিক operator থাকলে **precedence** ঠিক করে কে আগে কাজ করবে (`*` আগে, `+` পরে)। precedence সমান হলে **associativity** ঠিক করে দিক: বেশিরভাগ operator বাঁ থেকে ডানে (`a - b - c` = `(a - b) - c`), কিন্তু `**`, assignment ও ternary ডান থেকে বামে (`2 ** 3 ** 2` = `2 ** (3 ** 2)` = `512`)। মোটামুটি ক্রম (উঁচু থেকে নিচু): বন্ধনী `( )` → member access/call `.` `?.` `()` → postfix/prefix `++`, unary (`!`, `typeof`, `-x`) → `**` → `* / %` → `+ -` → shift → comparison (`<` `>` `in` `instanceof`) → equality (`===`) → `&` → `^` → `|` → `&&` → `||` ও `??` → ternary → assignment → comma।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "ব্যবহারিক পরামর্শ",
      text: "পুরো precedence table মুখস্থ করার দরকার নেই। যেখানেই একাধিক ধরনের operator মিশেছে (বিশেষত `&&` ও `||` একসাথে), বন্ধনী দিয়ে ইচ্ছা স্পষ্ট করুন। `-2 ** 2` লিখলে **SyntaxError** — কারণ unary minus ও `**` এর মিশ্রণ অস্পষ্ট; লিখতে হবে `(-2) ** 2` বা `-(2 ** 2)`।",
    },
    { type: "h3", text: "Bitwise operator (সংক্ষেপে)" },
    {
      type: "p",
      text: "`&`, `|`, `^`, `~`, `<<`, `>>`, `>>>` সংখ্যাকে **32-bit signed integer** ধরে bit স্তরে কাজ করে। frontend এ এগুলো বিরল — flags/permission mask, কিছু hashing/graphics কোডে দেখা যায়। পুরোনো ‘`~~x` দিয়ে integer করা’ বা ‘`~arr.indexOf(x)`’ কৌশল আজ `Math.trunc` ও `includes` এর কারণে অপ্রয়োজনীয় ও কম পাঠযোগ্য। মনে রাখুন: `5 & 3` = `1`, `5 | 3` = `7`, `5 ^ 3` = `6`, `1 << 3` = `8`, `-1 >>> 0` = `4294967295`।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "১) ‘`||` boolean ফেরত দেয়’ — না, operand ফেরত দেয়। ২) ‘`??` আর `||` একই’ — `0`/`''`/`false` এ আলাদা। ৩) ‘`i++` আর `++i` সবসময় এক’ — শুধু একা statement এ এক। ৪) ‘`%` modulo’ — আসলে remainder, `-7 % 3` হয় `-1`। ৫) ‘`typeof null` তে `null` বোঝা যায়’ — পাওয়া যায় `'object'`। ৬) ‘`a = b = c` শুধু `a` সেট করে’ — ডান থেকে বামে সবগুলোতেই assign হয়।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security note: user-controlled key ও `in` / `||=`",
      text: "`'constructor' in {}` হলো `true`, কারণ `in` prototype chain ও দেখে। আর `obj[userKey] ||= {}` বা `obj[a][b] = v` ধরনের কোডে `userKey` যদি `'__proto__'` হয়, তবে **prototype pollution** (সবার ভাগাভাগি করা prototype এ ঢুকে পড়া) এর ঝুঁকি তৈরি হতে পারে। নির্ভরযোগ্য নয় এমন key নিয়ে কাজ করলে `Map`, `Object.create(null)` বা `Object.hasOwn` ব্যবহার করুন এবং `__proto__`, `constructor`, `prototype` key বাতিল করুন।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "Operator এর আচরণ ECMAScript spec দ্বারা নির্ধারিত, তাই Browser ও Node.js এ একই। পার্থক্য শুধু version সমর্থনে (নিচে compatibility দেখুন) এবং `instanceof` এর মতো ক্ষেত্রে — Browser এ ভিন্ন iframe এর `Array` এ তৈরি array এর বেলায় `instanceof Array` ব্যর্থ হতে পারে (তখন `Array.isArray` ব্যবহার করুন)।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "Operator কে ভাবুন একটি **রান্নাঘরের যন্ত্রপাতি** হিসেবে। `+` হলো মিক্সার, `?.` হলো সাবধানে ঢাকনা খোলার চিমটা, `&&`/`||`/`??` হলো **দরজার প্রহরী** — যারা ঠিক করে ভেতরে কাকে ঢুকতে দেওয়া হবে।",
    },
    {
      type: "p",
      text: "ধরুন একটি অফিসে তিনটি টেবিলে পরপর আবেদন জমা হয় এবং প্রতিটি টেবিলে একজন করে কর্মকর্তা বসেন। `a || b || c` হলো এমন নিয়ম: ‘প্রথম টেবিলের কর্মকর্তা যদি **কোনো একটি গ্রহণযোগ্য কাগজ** দেন, সেটিই চূড়ান্ত — বাকি টেবিলে যেতেই হবে না।’ আর তাঁর কাছে কাগজই না থাকলে পরের টেবিলে যাও। এখানে ‘গ্রহণযোগ্য’ এর সংজ্ঞাতেই `||` ও `??` এর তফাত: `||` টেবিলে **শূন্য (0) লেখা কাগজ** বা **ফাঁকা কাগজ ('')** কেও ‘কাগজ নেই’ বলে ফিরিয়ে দেয়। কিন্তু `??` শুধু তখনই পরের টেবিলে পাঠায় যখন সত্যিই **কোনো কাগজই নেই** (`null`/`undefined`) — `0` লেখা কাগজকে সে বৈধ বলে গ্রহণ করে, কারণ ‘০ ইউনিট’ ও একটি সত্য উত্তর।",
    },
    {
      type: "ul",
      items: [
        "**Short-circuit**: প্রথম টেবিলেই কাজ মিটে গেলে বাকি টেবিলের কর্মকর্তারা ঘুম থেকেই ওঠেন না — অর্থাৎ তাঁদের function চলেই না।",
        "**Precedence**: অফিসে ‘আগে সিল, তারপর সই’ এর মতো কাজের ক্রম আছে — বন্ধনী মানে ‘আগে এটি করো’ বলে স্পষ্ট নির্দেশ।",
        "**Optional chaining**: দরজা বন্ধ থাকলে ধাক্কা দিয়ে ভেঙে ঢোকার (TypeError) বদলে ‘কেউ নেই’ বলে ফিরে আসা (`undefined`)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "memory-steps",
      title: "Logical assignment: কখন আসলে assign হয়?",
      code: "let a = 5;\na ||= 10;\nlet b = 0;\nb ||= 10;\nlet c = 0;\nc ??= 10;",
      steps: [
        {
          line: 0,
          memory: [{ name: "a", value: "5", kind: "let", state: "live" }],
          note: "`a` কে `5` দিয়ে শুরু করা হলো।",
        },
        {
          line: 1,
          memory: [{ name: "a", value: "5", kind: "let", state: "live" }],
          note: "`a ||= 10` — `a` truthy (`5`), তাই short-circuit: ডান পাশ (`10`) evaluate ই হয় না এবং assignment ও হয় না। `a` `5` ই থাকে।",
        },
        {
          line: 2,
          memory: [
            { name: "a", value: "5", kind: "let", state: "live" },
            { name: "b", value: "0", kind: "let", state: "live" },
          ],
          note: "`b` হলো `0` — একটি falsy কিন্তু সম্পূর্ণ বৈধ সংখ্যা।",
        },
        {
          line: 3,
          memory: [
            { name: "a", value: "5", kind: "let", state: "live" },
            { name: "b", value: "10", kind: "let", state: "live" },
          ],
          note: "`b ||= 10` — `0` falsy, তাই assignment হয় এবং `b` হয় `10`। **এটিই বিপদ:** আমরা হয়তো `0` রাখতে চেয়েছিলাম।",
        },
        {
          line: 4,
          memory: [
            { name: "a", value: "5", kind: "let", state: "live" },
            { name: "b", value: "10", kind: "let", state: "live" },
            { name: "c", value: "0", kind: "let", state: "live" },
          ],
          note: "আরেকটি `0` — এবার `c` তে।",
        },
        {
          line: 5,
          memory: [
            { name: "a", value: "5", kind: "let", state: "live" },
            { name: "b", value: "10", kind: "let", state: "live" },
            { name: "c", value: "0", kind: "let", state: "live" },
          ],
          note: "`c ??= 10` — `0` null/undefined নয়, তাই assignment হয় না; `c` `0` ই থাকে। ডিফল্ট দেওয়ার সময় `??=` তাই নিরাপদ।",
        },
      ],
      caption: "`||=` falsy দেখে, `??=` শুধু null/undefined দেখে।",
    },
    {
      kind: "flow-steps",
      title: "Precedence ও associativity: `1 + 2 * 3 ** 2` কীভাবে evaluate হয়",
      nodes: [
        { id: "expr", label: "Expression", sub: "1 + 2 * 3 ** 2" },
        { id: "pow", label: "ধাপ ১: **", sub: "সর্বোচ্চ precedence" },
        { id: "mul", label: "ধাপ ২: *", sub: "তারপর গুণ" },
        { id: "add", label: "ধাপ ৩: +", sub: "সবশেষে যোগ" },
      ],
      steps: [
        {
          active: ["expr"],
          items: { expr: ["1 + 2 * 3 ** 2"] },
          note: "তিনটি operator: `+`, `*`, `**`। engine আগে precedence দেখে — কে আগে কাজ করবে।",
        },
        {
          active: ["pow"],
          items: { expr: ["1 + 2 * 3 ** 2"], pow: ["3 ** 2 = 9"] },
          note: "`**` এর precedence সবচেয়ে বেশি, তাই `3 ** 2` আগে হয় → `9`। এখন expression: `1 + 2 * 9`।",
        },
        {
          active: ["mul"],
          items: { pow: ["3 ** 2 = 9"], mul: ["2 * 9 = 18"] },
          note: "এরপর `*`: `2 * 9` → `18`। expression: `1 + 18`।",
        },
        {
          active: ["add"],
          items: { mul: ["2 * 9 = 18"], add: ["1 + 18 = 19"] },
          output: "19",
          note: "সবশেষে `+`: `19`। বন্ধনী দিলে ক্রম বদলায়: `(1 + 2) * 3 ** 2` = `27`। আর `2 ** 3 ** 2` এ দুটি `**` থাকায় associativity কাজ করে — ডান থেকে বামে: `2 ** (3 ** 2)` = `512`।",
        },
      ],
      caption: "Precedence = কে আগে; associativity = সমান হলে কোন দিক থেকে।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Arithmetic ও compound assignment",
      description: "মৌলিক হিসাব, `%` ও `**`, compound assignment এবং floating-point এর পরিচিত চমক। Output অনুমান করে তারপর চালান।",
      code: `console.log(7 + 2, 7 - 2, 7 * 2, 7 / 2);
console.log(7 % 3, 2 ** 10, -7 % 3);

let n = 5;
n += 3;   // 8
n *= 2;   // 16
n **= 2;  // 256
console.log(n);

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log("1" + 2, "5" - 2, +"42");`,
    },
    {
      level: "intermediate",
      title: "&&, ||, ?? — boolean নয়, operand ফেরত দেয়",
      description: "প্রতিটি লাইনের ফল কোন operand সেটি লক্ষ্য করুন। শেষে short-circuit প্রমাণ: ডান পাশের function চলেছে কি না।",
      code: `console.log("Rina" || "guest");
console.log(0 || "default");
console.log(0 ?? "default");
console.log(null ?? undefined ?? "end");
console.log("hi" && 42);
console.log(null && 42);
console.log(!!"hi", !!"");

let calls = 0;
const loud = () => { calls++; return "called"; };

true || loud();
false && loud();
"x" ?? loud();
console.log("calls after short-circuit:", calls);

null ?? loud();
console.log("calls after null ??:", calls);`,
    },
    {
      level: "real-world",
      title: "Config normalise: ??=, ||=, ?. ও ?? একসাথে",
      description: "বাস্তব কোডে user এর দেওয়া option এ ডিফল্ট বসানো — `0` ও `''` বৈধ থাকে, অনুপস্থিত data তে crash হয় না।",
      code: `function normalize(opts) {
  const o = { ...opts };
  o.retries ??= 3;        // 0 বৈধ, তাই ??=
  o.timeout = o.timeout ?? 1000;
  o.verbose ||= false;    // এখানে falsy হলে false-ই চাই
  return o;
}

console.log(normalize({ retries: 0, timeout: 0 }));
console.log(normalize({}));

function cityOf(user) {
  return user?.address?.city ?? "Unknown";
}

console.log(cityOf({ address: { city: "Dhaka" } }));
console.log(cityOf({ address: null }));
console.log(cityOf(undefined));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log(10 % 4, 2 ** 3 ** 2);
`,
    },
    {
      label: "Prefix বনাম postfix, comma, void",
      code: `let i = 5;
const a = i++;   // a = পুরোনো মান
const b = ++i;   // b = নতুন মান
console.log(a, b, i);

let count = 5;
count = count++;  // কিছুই বদলায় না!
console.log(count);

console.log((1, 2, 3));
console.log(void 0);`,
    },
    {
      label: "typeof, in, instanceof, delete",
      code: `console.log(typeof null, typeof [], typeof function () {}, typeof 10n, typeof Symbol());
console.log(typeof notDeclaredAnywhere);

const obj = { a: 1 };
console.log("a" in obj, "toString" in obj, Object.hasOwn(obj, "toString"));
console.log(delete obj.a, obj);

console.log([] instanceof Array, [] instanceof Object);
console.log(Object.create(null) instanceof Object);`,
    },
    {
      label: "Bitwise operator",
      code: `console.log(5 & 3, 5 | 3, 5 ^ 3);   // 1 7 6
console.log(~5, 1 << 3);            // -6 8
console.log(-16 >> 2, -1 >>> 0);    // -4 4294967295

// flags এর ছোট উদাহরণ
const READ = 1, WRITE = 2, EXEC = 4;
let perm = READ | WRITE;
console.log(perm, (perm & WRITE) !== 0, (perm & EXEC) !== 0);`,
    },
    {
      label: "Precedence ও associativity",
      code: `console.log(1 + 2 * 3 ** 2);
console.log((1 + 2) * 3 ** 2);
console.log(2 ** 3 ** 2);
console.log((2 ** 3) ** 2);
console.log(10 - 3 - 2);
console.log(1 + 2 + "3", "1" + 2 + 3);

let x, y;
x = y = 7;
console.log(x, y);

try {
  console.log(eval("-2 ** 2"));
} catch (e) {
  console.log(e.name);
}
console.log((-2) ** 2, -(2 ** 2));`,
    },
  ],

  debugging: [
    {
      title: "`||` দিয়ে ডিফল্ট দিতে গিয়ে বৈধ `0` হারানো",
      bad: `function getQty(opts) {
  return opts.qty || 1;
}
console.log(getQty({ qty: 0 }));`,
      why: "`0` falsy, তাই `0 || 1` ফেরত দেয় `1`। user স্পষ্টভাবে `0` দিয়েছিল, কিন্তু কোড সেটিকে ‘মান নেই’ ভেবে ডিফল্ট বসিয়ে দিয়েছে। এটি `||` ব্যবহারের সবচেয়ে সাধারণ bug (`volume`, `offset`, `price: 0`, `''` সবখানে)।",
      fix: `function getQty(opts) {
  return opts.qty ?? 1;   // শুধু null/undefined এ ডিফল্ট
}
console.log(getQty({ qty: 0 }));`,
    },
    {
      title: "`+` দিয়ে string ও সংখ্যা মেশানো",
      bad: `const price = "10";   // ধরুন input থেকে এসেছে
const total = price + 5;
console.log(total);`,
      why: "`+` এর এক পাশ string হলে অন্য পাশ string এ রূপান্তরিত হয়ে concatenation হয়, তাই `'10' + 5` = `'105'`। form input সবসময় string, তাই সংখ্যা যোগের আগে স্পষ্টভাবে রূপান্তর করতে হবে।",
      fix: `const price = "10";
const total = Number(price) + 5;
console.log(total);`,
    },
    {
      title: "`??` ও `||` বন্ধনী ছাড়া মেশানো — SyntaxError",
      bad: `const a = null;
const b = 0;
const result = a || b ?? "fallback";
console.log(result);`,
      why: "ভাষা `||`/`&&` এবং `??` কে বন্ধনী ছাড়া একসাথে লিখতে দেয় না, কারণ ইচ্ছা কোনটি আগে — তা অস্পষ্ট। এটি **parse** পর্যায়েই SyntaxError, তাই কোনো লাইনই চলে না।",
      fix: `const a = null;
const b = 0;
const result = (a || b) ?? "fallback";
console.log(result);`,
    },
    {
      title: "`count = count++` — কিছুই বাড়ে না",
      bad: `let count = 5;
count = count++;
console.log(count);`,
      why: "postfix `count++` পুরোনো মান `5` ফেরত দেয় (এবং count কে ক্ষণিকের জন্য `6` করে), কিন্তু তারপর সেই ফেরত মান `5` আবার `count` এ assign হয়। ফলে `count` `5` ই থেকে যায়।",
      fix: `let count = 5;
count++;            // বা count += 1
console.log(count);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "Remainder ও exponent",
      prompt: "`___` এর জায়গায় সঠিক operator বসিয়ে `17` কে `5` দিয়ে ভাগ করলে ভাগশেষ এবং `2` এর `10` ঘাত — এক লাইনে print করুন: `2 1024`।",
      starter: `console.log(17 ___ 5, 2 ___ 10);`,
      expected: "2 1024",
      hints: ["ভাগশেষের operator হলো `%`।", "ঘাতের operator হলো `**`।"],
      solution: `console.log(17 % 5, 2 ** 10);`,
    },
    {
      level: "beginner",
      title: "`0` হারানো bug ঠিক করুন",
      prompt: "`volume` হলো `0` (mute) — এটি বৈধ মান। এখনকার কোড `50` print করে। শুধু operator বদলে `0` print করান।",
      starter: `const settings = { volume: 0 };
const volume = settings.volume || 50;
console.log(volume);`,
      expected: "0",
      hints: ["`0` falsy, কিন্তু null/undefined নয়।", "কোন operator শুধু null/undefined এ ডিফল্ট দেয়?"],
      solution: `const settings = { volume: 0 };
const volume = settings.volume ?? 50;
console.log(volume);`,
    },
    {
      level: "beginner",
      title: "Ternary দিয়ে Pass/Fail",
      prompt: "`score` ৪০ বা তার বেশি হলে `Pass`, নইলে `Fail` — একটি ternary দিয়ে `result` এ রেখে print করুন। `score = 72`।",
      starter: `const score = 72;
let result;
// TODO: ternary দিয়ে result নির্ধারণ করুন
console.log(result);`,
      expected: "Pass",
      hints: ["`condition ? মান১ : মান২`।", "`result = score >= 40 ? ... : ...;`"],
      solution: `const score = 72;
let result;
result = score >= 40 ? "Pass" : "Fail";
console.log(result);`,
    },
    {
      level: "intermediate",
      title: "Logical assignment দিয়ে ডিফল্ট",
      prompt: "`retries` এর `0` অবশ্যই থাকবে। `name` খালি string হলে `'guest'` হবে। `theme` `null` হলে `'dark'` হবে। উপযুক্ত logical assignment (`??=` বা `||=`) ব্যবহার করুন।",
      starter: `const config = { retries: 0, name: "", theme: null };

// TODO: তিনটি logical assignment

console.log(config);`,
      expected: "{ retries: 0, name: 'guest', theme: 'dark' }",
      hints: ["যেখানে `0` রাখতে হবে সেখানে `??=`।", "খালি string কেও বদলাতে চাইলে `||=`।"],
      solution: `const config = { retries: 0, name: "", theme: null };

config.retries ??= 3;
config.name ||= "guest";
config.theme ??= "dark";

console.log(config);`,
      explanation: "`retries ??= 3`: `0` null নয়, তাই অপরিবর্তিত। `name ||= 'guest'`: `''` falsy, তাই বদলায়। `theme ??= 'dark'`: `null` তাই বদলায়।",
    },
    {
      level: "intermediate",
      title: "Short-circuit এ খরচবহুল call এড়ান",
      prompt: "`cache` এ মান আছে, তাই `expensive()` চালানোর দরকারই নেই। একটি operator দিয়ে `value` লিখুন যাতে `cached 0` print হয়।",
      starter: `let calls = 0;
const expensive = () => { calls++; return "data"; };
const cache = "cached";

const value = expensive();   // TODO: cache থাকলে এটি ডাকা যাবে না

console.log(value, calls);`,
      expected: "cached 0",
      hints: ["`a || b` এ `a` truthy হলে `b` evaluate হয় না।"],
      solution: `let calls = 0;
const expensive = () => { calls++; return "data"; };
const cache = "cached";

const value = cache || expensive();

console.log(value, calls);`,
      explanation: "`cache` truthy, তাই `||` থেমে যায় ও `cache` ফেরত দেয়; `expensive()` evaluate ই হয় না, `calls` `0` থাকে। (`cache` এ `0`/`''` বৈধ হতে পারলে `??` ব্যবহার করতেন।)",
    },
    {
      level: "challenge",
      title: "Safe city report: ?. ও ?? ও ++",
      prompt:
        "প্রতিটি user এর জন্য `নাম: city` print করুন; `address` নেই বা `null` হলে (অথবা `city` না থাকলে) `Unknown`। কিন্তু `city` যদি খালি string `''` হয় তবে সেটি **বৈধ** — `Unknown` হবে না (লাইনটি `Tuhin: ` হবে)। শেষে `Unknown count: N` print করুন, যেখানে N হলো কতজনের city পাওয়া যায়নি (null/undefined)।",
      starter: `const users = [
  { name: "Rina", address: { city: "Dhaka" } },
  { name: "Karim", address: null },
  { name: "Mim" },
  { name: "Tuhin", address: { city: "" } },
];

let unknown = 0;

// TODO: loop চালিয়ে print করুন ও unknown গুনুন

// console.log("Unknown count:", unknown);`,
      expected: "Rina: Dhaka\nKarim: Unknown\nMim: Unknown\nTuhin:\nUnknown count: 2",
      hints: ["`user.address?.city` চেইন `undefined` দেয় যখন `address` null/undefined।", "`'' ` কে ধরে রাখতে `||` নয়, `??` লাগবে।", "`unknown` গুনতে `city == null` বা `city === undefined` পরীক্ষা করে `unknown++`।"],
      solution: `const users = [
  { name: "Rina", address: { city: "Dhaka" } },
  { name: "Karim", address: null },
  { name: "Mim" },
  { name: "Tuhin", address: { city: "" } },
];

let unknown = 0;

for (const user of users) {
  const city = user.address?.city;
  if (city === undefined) unknown++;
  console.log(user.name + ": " + (city ?? "Unknown"));
}

console.log("Unknown count:", unknown);`,
      explanation: "`user.address?.city` তিন ক্ষেত্রে `undefined`: address `null`, address নেই, বা city property নেই। `??` শুধু তখনই `'Unknown'` দেয়; Tuhin এর `''` অক্ষত থাকে। `Tuhin: ` লাইনের শেষের space যাচাইয়ে বাদ যায়।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`console.log(0 ?? 5, 0 || 5)` কী print করবে?",
        options: ["`0 0`", "`5 5`", "`0 5`", "`5 0`"],
        answer: 2,
        explanation:
          "`??` শুধু null/undefined এ ডানদিক নেয়, `0` নয় — তাই `0 ?? 5` = `0`। `||` সব falsy তে ডানদিক নেয়, তাই `0 || 5` = `5`। ফল `0 5`। বাকি অপশনগুলো দুটি operator কে এক ধরে নেওয়া বা ক্রম উল্টে দেওয়ার ভুল।",
      },
      {
        question: "`console.log(2 ** 3 ** 2)` এর ফল কী?",
        options: ["`64`", "`512`", "`36`", "SyntaxError"],
        answer: 1,
        explanation:
          "`**` right-associative: `2 ** (3 ** 2)` = `2 ** 9` = `512`। বাঁ থেকে ডানে ধরলে `(2 ** 3) ** 2` = `64` হতো — সেটি ভুল। `36` কোনো ভাবেই আসে না। SyntaxError হয় শুধু `-2 ** 2` এর মতো unary মিশ্রণে, এখানে নয়।",
      },
      {
        question: "`let i = 1; const r = i++ + ++i; console.log(r);` এর ফল কী?",
        options: ["`4`", "`3`", "`5`", "`2`"],
        answer: 0,
        explanation:
          "`i++` পুরোনো মান `1` ফেরত দেয় ও `i` হয় `2`। তারপর `++i` `i` কে `3` করে `3` ফেরত দেয়। `1 + 3` = `4`। `3` বা `5` আসবে prefix/postfix গুলিয়ে ফেললে; `2` কোনো যুক্তিতেই আসে না।",
      },
      {
        question: "`console.log('5' - 2, '5' + 2)` কী print করবে?",
        options: ["`3 7`", "`52 3`", "`7 52`", "`3 52`"],
        answer: 3,
        explanation:
          "`-` সবসময় ToNumber করে: `'5' - 2` = `3`। `+` এর একপাশ string হলে concatenation: `'5' + 2` = `'52'`। তাই `3 52`। অন্য অপশনগুলোতে হয় `+` কে যোগ ধরা হয়েছে, নয়তো `-` কে string অপারেশন।",
      },
      {
        question: "`x ??= 10` কখন `x` এ `10` বসায়?",
        options: ["`x` falsy হলে (যেমন `0`)", "`x` শুধু `null` বা `undefined` হলে", "`x` truthy হলে", "সবসময়"],
        answer: 1,
        explanation:
          "`??=` হলো `x ?? (x = 10)` এর মতো: শুধু null/undefined এ assign করে। ‘falsy হলে’ হলো `||=`, ‘truthy হলে’ হলো `&&=`, আর ‘সবসময়’ হলো সাধারণ `=`।",
      },
    ],
    coding: [
      {
        title: "Odd/Even লেবেল",
        prompt: "`[1, 2, 3, 4]` এর প্রতিটি সংখ্যার জন্য `%` ও ternary দিয়ে `1:odd`, `2:even` ... আলাদা লাইনে print করুন।",
        starter: `const nums = [1, 2, 3, 4];
// TODO
`,
        expected: "1:odd\n2:even\n3:odd\n4:even",
        solution: `const nums = [1, 2, 3, 4];
for (const n of nums) {
  console.log(n + ":" + (n % 2 === 0 ? "even" : "odd"));
}`,
      },
      {
        title: "ডিফল্ট সহ pagination option",
        prompt: "`withDefaults(opts)` লিখুন যা `{ page, size }` ফেরত দেয়: `page` না থাকলে `1`, `size` না থাকলে `20`; কিন্তু `0` দেওয়া থাকলে `0` ই থাকবে। `withDefaults({ page: 0 })` print করুন।",
        starter: `function withDefaults(opts) {
  // TODO
}
console.log(withDefaults({ page: 0 }));`,
        expected: "{ page: 0, size: 20 }",
        solution: `function withDefaults(opts) {
  return { page: opts.page ?? 1, size: opts.size ?? 20 };
}
console.log(withDefaults({ page: 0 }));`,
      },
    ],
  },

  interview: [
    {
      q: "`||` ও `??` এর পার্থক্য কী? কখন কোনটি ব্যবহার করবেন?",
      a: "`||` বাঁদিকের operand **falsy** হলে ডানদিক ফেরত দেয়; falsy এর মধ্যে `0`, `''`, `false`, `NaN`, `null`, `undefined` সব পড়ে। `??` শুধু `null` ও `undefined` হলে ডানদিক দেয়।\n\nডিফল্ট মান দেওয়ার বেলায় প্রায় সবসময় `??` — কারণ `0` (সংখ্যা), `''` (খালি text), `false` (বন্ধ করা setting) সবই বৈধ ইনপুট হতে পারে। `||` তখনই, যখন সত্যিই সব ‘খালি’ মানকে fallback এ বদলাতে চান, যেমন খালি display name এর বদলে ‘Anonymous’ দেখানো। আর মনে রাখবেন, বন্ধনী ছাড়া `??` কে `||`/`&&` এর সাথে মেশানো SyntaxError।",
    },
    {
      q: "`&&` ও `||` কি boolean ফেরত দেয়? Short-circuit evaluation কী?",
      a: "না। এরা দুই operand এর **একটিকে হুবহু** ফেরত দেয়। `a || b` — `a` truthy হলে `a`, নইলে `b`। `a && b` — `a` falsy হলে `a`, নইলে `b`। তাই `user && user.name` এর ফল `user` এর মান বা `name` হতে পারে, `true/false` নয়।\n\n**Short-circuit** মানে ফল নির্ধারিত হয়ে গেলে ডান পাশের expression evaluate ই হয় না। এর কারণে `cache || compute()` তে cache থাকলে `compute` চলে না, আর `obj && obj.method()` এ `obj` না থাকলে error ছোড়ার আগেই থেমে যায়। এটি ভাষার নিয়মের অংশ, শুধু optimisation নয় — তাই side effect আছে এমন function ডান পাশে রাখলে সচেতন থাকতে হয়।",
    },
    {
      q: "`i++` ও `++i` এর পার্থক্য কী?",
      a: "দুটিই `i` কে ১ বাড়ায়, তফাত **expression এর ফেরত মানে**। `i++` (postfix) পুরোনো মান ফেরত দেয়, `++i` (prefix) নতুন মান। `let i = 5; const a = i++;` এ `a = 5, i = 6`; `const b = ++i;` এ `b = 7`।\n\nএকা statement এ (`i++;`) কোনো পার্থক্য নেই, কিন্তু `arr[i++]` বা `count = count++` এর মতো জায়গায় আছে — শেষটিতে count বাড়েই না। পাঠযোগ্যতার জন্য অনেক style guide এ expression এর ভেতরে `++` এড়িয়ে আলাদা লাইনে `i += 1` লেখার পরামর্শ দেওয়া হয়।",
    },
    {
      q: "`2 ** 3 ** 2` এর ফল কত এবং কেন? `-2 ** 2` এ কী হয়?",
      a: "`**` **right-associative**, তাই `2 ** 3 ** 2` = `2 ** (3 ** 2)` = `2 ** 9` = `512`। বেশিরভাগ বাকি binary operator left-associative (`10 - 3 - 2` = `5`), কিন্তু `**`, assignment (`a = b = c`) ও ternary ডান থেকে বামে চলে।\n\n`-2 ** 2` লিখলে **SyntaxError**, কারণ unary minus ও `**` এর মধ্যে কোনটি আগে হবে তা spec ইচ্ছাকৃতভাবে অস্পষ্ট রাখেনি — আপনাকে `(-2) ** 2` (`4`) অথবা `-(2 ** 2)` (`-4`) লিখে ইচ্ছা স্পষ্ট করতে হয়। এই নিয়ম থেকে বোঝা যায় precedence এ সন্দেহ থাকলে বন্ধনী ব্যবহার করাই সঠিক।",
    },
    {
      q: "Optional chaining `?.` কীভাবে কাজ করে এবং এর সীমাবদ্ধতা কী?",
      a: "`a?.b` এ `a` যদি `null` বা `undefined` হয়, তবে পুরো chain **short-circuit** হয়ে `undefined` দেয় — `b` পড়ার চেষ্টাই হয় না, তাই TypeError আসে না। `a?.[k]` ও `fn?.()` রূপও আছে। শর্ট-সার্কিট শুধু chain এর বাকি অংশ বাদ দেয়, পুরো expression নয়।\n\nসীমাবদ্ধতা: এটি শুধু null/undefined থেকে রক্ষা করে, `0`/`''` এ সাধারণ আচরণই হয়; একটি ভুল নাম বা ভুল type এ বহু স্তরের `?.` bug কে নীরবে `undefined` এ লুকিয়ে ফেলতে পারে, তাই data এর গঠন নিশ্চিত থাকলে অকারণে সবখানে `?.` দেবেন না। আর assignment এর বাম দিকে (`a?.b = 1`) এটি বৈধ নয়। সাধারণত এটি `??` এর সাথে জোড়ায় আসে।",
    },
    {
      q: "`typeof null` কী দেয় এবং `in` ও `instanceof` কী পরীক্ষা করে?",
      a: "`typeof null` দেয় `'object'` — এটি JavaScript এর প্রথম দিকের একটি পরিচিত ভুল, যা web compatibility এর কারণে ঠিক করা হয়নি। তাই null যাচাই করতে `x === null` ব্যবহার করুন; object যাচাই করতে `typeof x === 'object' && x !== null`।\n\n`'k' in obj` property আছে কি না দেখে, **prototype chain সহ** — তাই `'toString' in {}` হয় `true`; শুধু নিজস্ব property চাইলে `Object.hasOwn(obj, 'k')`। `x instanceof F` দেখে `F.prototype` টি `x` এর prototype chain এ আছে কি না; ভিন্ন realm (যেমন iframe) এর object এ এটি ব্যর্থ হতে পারে, এবং array র জন্য `Array.isArray` বেশি নির্ভরযোগ্য।",
    },
  ],

  summary: {
    takeaways: [
      "`&&` ও `||` operand ফেরত দেয়, boolean নয়; ফল নির্ধারিত হলে ডান পাশ evaluate ই হয় না (short-circuit)।",
      "ডিফল্ট মানের জন্য `??` / `??=` (শুধু null/undefined); `||` / `||=` সব falsy কে বদলায় — `0`, `''`, `false` হারানোর ঝুঁকি।",
      "`**`, assignment ও ternary right-associative; `-2 ** 2` SyntaxError; সন্দেহ হলে বন্ধনী দিন।",
      "`i++` পুরোনো মান, `++i` নতুন মান ফেরত দেয়; `count = count++` কিছুই বাড়ায় না।",
      "`+` string এর সাথে concatenation করে, বাকি arithmetic operator সংখ্যায় রূপান্তর করে; `%` আসলে remainder।",
      "`?.` null/undefined এ chain থামিয়ে `undefined` দেয়; `typeof null` হলো `'object'`; `in` prototype chain ও দেখে।",
    ],
    syntax: `a ** b            // exponent (right-associative)
x += 1; x **= 2   // compound assignment
x ||= d           // x falsy হলে assign
x &&= v           // x truthy হলে assign
x ??= d           // x null/undefined হলে assign
a ?? b            // a null/undefined না হলে a, নইলে b
user?.address?.city   // safe chain
cond ? yes : no   // ternary
typeof x, 'k' in o, o instanceof F, delete o.k`,
    whenToUse: [
      "ডিফল্ট মান: `value ?? fallback` (বা `obj.key ??= fallback`)।",
      "সব ‘খালি’ মান বদলাতে চাইলে সচেতনভাবে `||`।",
      "Nested data নিরাপদে পড়তে `?.`, সাথে `??` দিয়ে fallback।",
      "ছোট শর্তে মান বাছাই: ternary; জটিল হলে `if/else`।",
      "একাধিক ধরনের operator মিশলে বন্ধনী দিয়ে precedence স্পষ্ট করুন।",
    ],
    next: ["Equality: `==` বনাম `===`", "Truthy ও Falsy", "Objects ও Optional Chaining (বিস্তারিত)", "Type Conversion ও Coercion"],
  },

  compatibility:
    "Arithmetic, comparison, logical, ternary, `typeof`, `in`, `instanceof`, bitwise — সব পুরোনো browser ও Node.js এ আছে। `**` ES2016 (Node 7+)। `?.` ও `??` ES2020 (Node 14+), logical assignment `&&=`, `||=`, `??=` ES2021 (Node 15+); সব আধুনিক browser এ সমর্থিত। পুরোনো browser (যেমন IE) এ এগুলো নেই — সেখানে transpiler (Babel/TypeScript) লাগে। Operator এর আচরণ spec দ্বারা নির্ধারিত, তাই Browser ও Node.js এ একই ফল দেয়। এই Playground browser-like Web Worker এ চলে।",
};
