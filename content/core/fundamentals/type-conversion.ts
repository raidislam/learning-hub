import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Type conversion (explicit) ও type coercion (implicit) এর পার্থক্য বলতে পারবেন, এবং কেন এই lesson শুধু explicit রূপান্তর নিয়ে তা জানবেন।",
    "`Number()`, `String()`, `Boolean()`, unary `+`, `parseInt`, `parseFloat`, `toString` এর আচরণ ও ফল — বিশেষ করে `Number('')`, `Number(null)`, `Number(undefined)` — নির্ভুলভাবে অনুমান করতে পারবেন।",
    "`Number()` ও `parseInt/parseFloat` এর মৌলিক পার্থক্য (পুরো string কঠোরভাবে বনাম prefix পড়া) বুঝে পরিস্থিতি অনুযায়ী বেছে নিতে পারবেন।",
    "`NaN` এর বৈশিষ্ট্য, `isNaN` বনাম `Number.isNaN` এর পার্থক্য এবং `parseInt` এর radix সংক্রান্ত ফাঁদ (যেমন `map(parseInt)`) এড়াতে পারবেন।",
    "Falsy মানগুলোর সম্পূর্ণ তালিকা জানবেন এবং `Boolean()` এর ফল নিশ্চিতভাবে বলতে পারবেন।",
    "`JSON.stringify/parse` কে data রূপান্তরের হাতিয়ার হিসেবে ব্যবহার করবেন এবং user input নিরাপদে validate করে রূপান্তর করার নিয়ম প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Type conversion কী এবং কেন দরকার?" },
    {
      type: "p",
      text: "JavaScript একটি **dynamically typed** ভাষা: variable এর কোনো স্থির type নেই, type থাকে **মানের (value)**। কিন্তু বাস্তব প্রোগ্রামে data সবসময় আপনার পছন্দের type এ আসে না। HTML input এর `.value` সবসময় string; `URLSearchParams` এর সব মান string; `fetch` করা JSON এর সংখ্যা কখনো string এ ঢুকে আসে; `localStorage` শুধু string রাখে। তাই একটি মানকে আরেক type এ **রূপান্তর** করা ছাড়া উপায় নেই। এই কাজটিই **type conversion**।",
    },
    {
      type: "p",
      text: "রূপান্তর দুই রকম। **Explicit conversion (type casting)** — আপনি নিজে `Number(x)`, `String(x)` ইত্যাদি লিখে স্পষ্টভাবে বলেন ‘এই মানটিকে অমুক type এ চাই’। **Implicit conversion (type coercion)** — আপনি কিছু বলেননি, কিন্তু `'5' * 2` এর মতো অপারেটর ব্যবহার করায় engine নিজে রূপান্তর করে ফেলেছে। এই lesson এ শুধু প্রথমটি; দ্বিতীয়টি আলাদা **Type Coercion** lesson এ। মূল কারণ: explicit রূপান্তরে আপনার নিয়ন্ত্রণ আছে, কোডের উদ্দেশ্য পাঠক বুঝতে পারে — আর এটিই best practice।",
    },
    { type: "h3", text: "মূল তিনটি target: number, string, boolean" },
    {
      type: "p",
      text: "প্রায় সব রূপান্তর তিনটি target type এর একটিতে যায়। ECMAScript specification এ এর জন্য তিনটি **abstract operation** আছে — `ToNumber`, `ToString`, `ToBoolean`। এগুলো সরাসরি কল করা যায় না; `Number()`, `String()`, `Boolean()` function ও অপারেটরগুলো ভেতরে এদেরই ব্যবহার করে। তাই এই তিনটির নিয়ম মুখস্থ নয়, **বুঝে** রাখা দরকার — বাকি সব আচরণ (coercion সহ) এদের ওপর দাঁড়িয়ে।",
    },
    { type: "h3", text: "Number(): ToNumber এর নিয়ম" },
    {
      type: "p",
      text: "`Number(value)` মানটিকে সংখ্যায় রূপান্তর করে; পারলে সংখ্যা, না পারলে `NaN` (**Not-a-Number**)। নিয়মগুলো মনে রাখার মতো গুছিয়ে নিন:",
    },
    {
      type: "compare",
      headers: ["ইনপুট", "Number(ইনপুট)", "কারণ"],
      rows: [
        ["`'42'`, `'3.14'`, `' 42 '`", "`42`, `3.14`, `42`", "বৈধ সংখ্যা-লিটারেল; দুই পাশের whitespace বাদ যায়"],
        ["`''` (খালি) ও `'   '`", "`0`", "খালি বা শুধু whitespace এর string কে `0` ধরা হয় — অনেক bug এর উৎস"],
        ["`'12px'`, `'abc'`, `'1,000'`", "`NaN`", "পুরো string টি বৈধ সংখ্যা না হলে `NaN` — আংশিক পড়া হয় না"],
        ["`'0x1f'`, `'1e3'`", "`31`, `1000`", "hex (`0x`), binary (`0b`), octal (`0o`) prefix ও exponent বোঝে"],
        ["`true`, `false`", "`1`, `0`", "boolean → সংখ্যা"],
        ["`null`", "`0`", "spec এ `null` → `+0`"],
        ["`undefined`", "`NaN`", "spec এ `undefined` → `NaN` — `null` এর সাথে অসঙ্গতি লক্ষ্য করুন"],
        ["`[]`, `[5]`, `[1, 2]`", "`0`, `5`, `NaN`", "array প্রথমে string এ রূপান্তর হয় (`''`, `'5'`, `'1,2'`), তারপর সংখ্যায়"],
        ["`{}`", "`NaN`", "object → `'[object Object]'` → `NaN`"],
        ["`10n` (BigInt)", "`10`", "`Number()` BigInt কে সংখ্যায় আনতে পারে (বড় হলে precision হারায়)"],
        ["`Symbol()`", "**TypeError**", "Symbol কে সংখ্যায় রূপান্তর করাই যায় না"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Number('') === 0 — সবচেয়ে বিপজ্জনক আচরণগুলোর একটি",
      text: "খালি input থেকে `Number(input.value)` করলে `0` পাবেন, `NaN` নয়। তাই ‘`NaN` হলে error দেখাব’ ধরনের validation খালি ঘরে ফাঁকি দেয়: ব্যবহারকারী কিছুই লেখেনি, অথচ প্রোগ্রাম ভাবছে সে `0` দিয়েছে। খালি-কি-না **আগে আলাদাভাবে** পরীক্ষা করুন (`input.trim() === ''`)।",
    },
    { type: "h3", text: "Number() বনাম parseInt/parseFloat বনাম unary +" },
    {
      type: "compare",
      headers: ["", "`Number(s)` / `+s`", "`parseFloat(s)`", "`parseInt(s, radix)`"],
      rows: [
        ["পড়ার ধরন", "**পুরো** string কঠোরভাবে", "বাম থেকে বৈধ দশমিক সংখ্যার **prefix**", "বাম থেকে বৈধ পূর্ণসংখ্যার **prefix**"],
        ["`'42px'`", "`NaN`", "`42`", "`42`"],
        ["`'3.99'`", "`3.99`", "`3.99`", "`3` (দশমিক কেটে যায়)"],
        ["`''`", "`0`", "`NaN`", "`NaN`"],
        ["`'0x1f'`", "`31`", "`0`", "`31` (radix না দিলে 0x ধরে hex)"],
        ["কখন ব্যবহার", "পুরো মান বৈধ সংখ্যা কি না যাচাই", "‘10.5px’ এর মতো এককসহ মান থেকে সংখ্যা বের করা", "নির্দিষ্ট base এর পূর্ণসংখ্যা (`radix` সহ)"],
      ],
    },
    {
      type: "p",
      text: "unary `+` (যেমন `+'5'`) ভেতরে ঠিক `Number()` এর মতোই `ToNumber` চালায়। সংক্ষিপ্ত, কিন্তু প্রথম দর্শনে অর্থ বোঝা কঠিন — টিম style guide অনুযায়ী `Number(x)` প্রায়ই বেশি পাঠযোগ্য। একটি পার্থক্য: unary `+` BigInt এ `TypeError` দেয়, `Number()` দেয় না।",
    },
    { type: "h3", text: "parseInt এর radix: তিনটি ফাঁদ" },
    {
      type: "ul",
      items: [
        "**সবসময় radix দিন**: `parseInt(s, 10)`। radix না দিলে (বা `0` দিলে) সাধারণত base-10 ধরা হয়, কিন্তু string `0x` দিয়ে শুরু হলে hex ধরা হয় — আচরণ ইনপুটের ওপর নির্ভর করে। (পুরোনো `'08'` octal ধরার সমস্যা ES5 থেকে নেই, তবু স্পষ্ট radix ভালো অভ্যাস।)",
        "**`map(parseInt)` ভুল**: `map` callback কে `(element, index, array)` দেয়, আর `parseInt` এর দ্বিতীয় parameter radix। তাই `['1','2','3'].map(parseInt)` আসলে `parseInt('1',0)`, `parseInt('2',1)`, `parseInt('3',2)` ডাকে → `[ 1, NaN, NaN ]`। সমাধান `map(Number)` বা `map((s) => parseInt(s, 10))`।",
        "**parseInt প্রথমে argument কে string বানায়**: সংখ্যা দিলেও তা string এ রূপান্তর হয়। `parseInt(0.0000005)` তে সংখ্যাটির string রূপ `'5e-7'`, তাই ফল `5`! সংখ্যাকে পূর্ণসংখ্যা করতে `Math.trunc`/`Math.floor` ব্যবহার করুন, `parseInt` নয়।",
      ],
    },
    { type: "h3", text: "NaN: যে মান নিজেকেও চেনে না" },
    {
      type: "p",
      text: "`NaN` একটি বিশেষ `number` মান (`typeof NaN` হলো `'number'`) যা ‘অবৈধ সংখ্যা’ বোঝায়। এর দুটি বৈশিষ্ট্য মনে রাখুন: (১) `NaN === NaN` হলো `false` — IEEE 754 মান অনুযায়ী `NaN` নিজের সাথেও সমান নয়; (২) `NaN` অঙ্কের মধ্য দিয়ে **ছড়িয়ে যায়** — `NaN + 1`, `NaN * 0` সবই `NaN`। তাই একটি অবৈধ ইনপুট পুরো হিসাব নষ্ট করে ফেলতে পারে, এবং error না দিয়ে নীরবে ‘NaN’ UI তে দেখা যায়।",
    },
    {
      type: "compare",
      headers: ["পরীক্ষা", "`isNaN(x)` (global)", "`Number.isNaN(x)`"],
      rows: [
        ["কীভাবে কাজ করে", "আগে `x` কে `Number(x)` করে, তারপর দেখে `NaN` কি না", "রূপান্তর **করে না**; `x` নিজেই `NaN` মান কি না দেখে"],
        ["`'abc'`", "`true` (কারণ `Number('abc')` হলো `NaN`)", "`false` (এটি string, `NaN` মান নয়)"],
        ["`undefined`", "`true`", "`false`"],
        ["`''`", "`false` (কারণ `Number('')` হলো `0`)", "`false`"],
        ["`NaN`", "`true`", "`true`"],
        ["কোনটি ব্যবহার করবেন", "প্রায় কখনো না — বিভ্রান্তিকর", "**ডিফল্ট** পছন্দ; আগে নিজে রূপান্তর করে নিন"],
      ],
    },
    { type: "h3", text: "String() ও toString()" },
    {
      type: "p",
      text: "`String(value)` ভেতরে `ToString` চালায়। `String(null)` হলো `'null'`, `String(undefined)` হলো `'undefined'`, `String(123)` হলো `'123'`, `String([1, 2])` হলো `'1,2'`, `String({})` হলো `'[object Object]'`। এমনকি `String(Symbol('a'))` ও কাজ করে (`'Symbol(a)'`)। অন্যদিকে `value.toString()` হলো একটি **method call** — `null` বা `undefined` এ কল করলে `TypeError`, কারণ তাদের কোনো method নেই। তবে `Number` এ `toString(radix)` বিশেষ কাজে লাগে: `(255).toString(16)` হলো `'ff'`, `(5).toString(2)` হলো `'101'`।",
    },
    { type: "h3", text: "Boolean(): ToBoolean ও Falsy তালিকা" },
    {
      type: "p",
      text: "`ToBoolean` এর নিয়ম সবচেয়ে সরল: মাত্র **আটটি falsy মান** আছে, বাকি সবকিছু **truthy**। তালিকাটি মুখস্থ রাখুন: `false`, `0`, `-0`, `0n` (BigInt শূন্য), `''` (খালি string), `null`, `undefined`, `NaN`। এর বাইরে সব truthy — এমনকি `'0'`, `'false'`, `[]`, `{}`, `-1`, `' '` ও।",
    },
    {
      type: "code",
      caption: "Falsy মান ও কিছু আশ্চর্যজনক truthy মান (Playground এ চালিয়ে দেখুন)",
      code: `const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
console.log(falsy.map(Boolean));          // সব false

console.log(Boolean("0"), Boolean("false"), Boolean([]), Boolean({}), Boolean(" "));  // সব true`,
    },
    {
      type: "p",
      text: "প্রয়োগে প্রায়ই `!!value` লেখা হয় (দ্বিগুণ negation) — ফল `Boolean(value)` এর মতোই। কিন্তু একটি বিপদ আছে: ‘মান আছে কি না’ পরীক্ষা করতে `if (count)` লিখলে `0` ও ‘নেই’ বলে ধরা পড়ে। যেখানে `0` বা `''` বৈধ মান, সেখানে স্পষ্টভাবে `value !== undefined` বা `value != null` ব্যবহার করুন (এই `!=` এর বিশেষ আচরণ Equality lesson এ)।",
    },
    { type: "h3", text: "JSON: data কে string এ ও ফেরত রূপান্তর" },
    {
      type: "p",
      text: "`JSON.stringify(value)` একটি data structure কে JSON **string** এ রূপান্তর করে (network, `localStorage` বা log এর জন্য), আর `JSON.parse(text)` সেই string থেকে আবার value বানায়। এটি deep copy এর কাজে লাগলেও মূলত একটি **serialization** হাতিয়ার, এবং এতে তথ্য হারাতে পারে: `undefined`, function ও symbol মানের property বাদ পড়ে; array এ এরা `null` হয়; `NaN`/`Infinity` হয় `null`; `Date` হয়ে যায় ISO string (ফেরত এনে আর `Date` পাবেন না); `BigInt` এ `TypeError`; cycle থাকলে `TypeError`।",
    },
    {
      type: "p",
      text: "`JSON.parse` অবৈধ text এ `SyntaxError` ছোড়ে, তাই অবিশ্বস্ত বা বাইরের source থেকে আসা text এ সবসময় `try/catch` চাই। আর বৈধ JSON হলেও তার ভেতরের data এর **আকার ও type আপনার প্রত্যাশামতো কি না** তা আলাদা করে যাচাই করতে হয়।",
    },
    {
      type: "callout",
      tone: "info",
      title: "Object কে primitive এ রূপান্তর — কিছুটা আগাম ঝলক",
      text: "`Number({ })` বা `String([1, 2])` এ object প্রথমে একটি primitive এ রূপান্তরিত হয় (`valueOf`/`toString` ডেকে), তারপর target type এ যায়। এই `ToPrimitive` ধাপটির পুরো ব্যাখ্যা — `Symbol.toPrimitive` সহ — **Type Coercion** lesson এ, কারণ সেখানে এটি সবচেয়ে বেশি কাজে লাগে।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "ভুল ধারণা ও নিরাপত্তা",
      text: "**ভুল ধারণা:** (১) ‘`parseInt` আর `Number` একই’ — না: `'42px'` এ একটি `42`, অন্যটি `NaN`। (২) ‘`isNaN` ই `NaN` পরীক্ষার সঠিক উপায়’ — না, `Number.isNaN` ব্যবহার করুন। (৩) ‘`Boolean('false')` হলো `false`’ — না, খালি নয় এমন যেকোনো string truthy। (৪) ‘`toString()` সব মানে চলে’ — `null`/`undefined` এ `TypeError`। **নিরাপত্তা:** user input (form, query string, API body) কখনো রূপান্তরের পরেও বিশ্বাস করবেন না। `parseInt('42abc')` নীরবে `42` দেয়, `Number('')` নীরবে `0` দেয়, আর আর্থিক হিসাবে floating-point `0.1 + 0.2` এর ভুল আছে। কিছু framework (যেমন nested query string parser) এ `?id[]=1` লিখলে `id` string এর বদলে **array** হয়ে আসে — এই type confusion থেকে logic bypass হতে পারে। তাই রূপান্তরের আগে `typeof` ও গঠন যাচাই করুন, রূপান্তরের পরে range ও `Number.isFinite`/`Number.isInteger` যাচাই করুন। `JSON.parse` কে `try/catch` এ রাখুন এবং ফলের shape validate করুন। কোনো অবস্থাতেই user এর string কে `eval` বা `new Function` দিয়ে ‘রূপান্তর’ করবেন না।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Browser বনাম Node.js",
      text: "এই lesson এর সব রূপান্তর-নিয়ম ECMAScript এর অংশ, তাই browser ও Node.js এ হুবহু একই। পার্থক্য শুধু ‘ইনপুট কোথা থেকে আসে’ তে: browser এ DOM input এর `.value` ও `URLSearchParams`, Node.js এ `process.argv`, environment variable (`process.env`, সবসময় string) ও HTTP body — সবই string আকারে আসে বলে রূপান্তর দরকার হয়। এই lesson এর playground এ DOM বা `process` ব্যবহার করা যায় না, তাই উদাহরণে string literal দিয়ে ইনপুট অনুকরণ করা হয়েছে।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ভাবুন আপনি **বিদেশ সফরে মুদ্রা বিনিময় কাউন্টারে** (currency exchange) আছেন। প্রতিটি দেশের টাকা আলাদা ‘type’। হিসাব করতে চাইলে সবাইকে এক মুদ্রায় আনতে হয়।",
    },
    {
      type: "ul",
      items: [
        "**Explicit conversion** = আপনি নিজে কাউন্টারে গিয়ে বলেন ‘এই ১০০ ডলার টাকায় বদলে দিন’। রেট কী, কত পেলেন — আপনি জানেন এবং সিদ্ধান্তটি আপনার। এটিই `Number(x)`, `String(x)` লেখা।",
        "**Implicit coercion** = দোকানি নিজে থেকে আপনার ডলার ‘ঠিকঠাক’ রেটে ভাঙিয়ে নিল, আপনাকে না জানিয়ে। বেশির ভাগ সময় ঠিক, কিন্তু কখন কোন রেট লাগল, বুঝতে না পারলে ঠকে যেতে পারেন। (সেটি পরের lesson।)",
        "**`Number('12px')` = `NaN`** হলো কাউন্টারের কর্মীর বলা ‘এটি কোনো বৈধ নোট নয়, নিচ্ছি না’ — পুরো নোটটি হতে হবে। অন্যদিকে **`parseFloat('12px')`** হলো কর্মীর ‘নোটের নম্বর পর্যন্ত পড়ে নিলাম, পেছনের ছাপা লেখা উপেক্ষা করলাম’।",
        "**`Number('')` = `0`** হলো এমন কর্মী, যে একটি **খালি খাম** পেয়ে ‘শূন্য টাকা জমা পড়ল’ লিখে খাতায় তুলে নিল — যেন আপনি জমা দিয়েছেন ঠিকই, মান শূন্য। অথচ আসলে আপনি কিছুই দেননি। তাই খাম খালি কি না আগে আলাদা দেখতে হয়।",
        "**`NaN`** হলো একটি জাল নোট যা যেকোনো হিসাবে ঢুকলে পুরো হিসাব দূষিত করে (`NaN` ছড়িয়ে যায়), এবং এটি নিজেকেও ‘আমি আমার সমান’ বলে স্বীকার করে না (`NaN !== NaN`) — তাই বিশেষ পরীক্ষক (`Number.isNaN`) লাগে।",
      ],
    },
    {
      type: "p",
      text: "সীমাবদ্ধতা: বাস্তবে মুদ্রা বিনিময়ে মূল্য রক্ষিত থাকে (মান বদলায় না, শুধু রূপ)। JavaScript এ রূপান্তরে তথ্য **হারাতে পারে** — যেমন `parseInt('3.99')` হলো `3`, `JSON.stringify` এ `undefined` বাদ যায়, `Number(10n ** 20n)` এ precision যায়।",
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Number() ভেতরে কী করে: কয়েকটি ইনপুট, কয়েকটি ফল",
      nodes: [
        { id: "in", label: "ইনপুট", sub: "যেকোনো মান" },
        { id: "fn", label: "Number()", sub: "ToNumber" },
        { id: "rule", label: "রূপান্তর নিয়ম", sub: "string / null / undefined…" },
        { id: "out", label: "ফল", sub: "number বা NaN" },
      ],
      steps: [
        {
          active: ["in", "fn"],
          items: { in: ["'42'"], fn: ["Number('42')"] },
          note: "`Number('42')` ডাকা হলো। `ToNumber` প্রথমে দেখে ইনপুটের type কী — এখানে string।",
        },
        {
          active: ["rule", "out"],
          items: { rule: ["পুরো string = বৈধ সংখ্যা-লিটারেল?", "হ্যাঁ → মান নাও"], out: ["42"] },
          note: "string টি পুরোটাই বৈধ সংখ্যা, তাই ফল `42`। দুই পাশে whitespace থাকলেও বাদ যেত।",
        },
        {
          active: ["in", "rule"],
          items: { in: ["''  (খালি string)"], rule: ["খালি / শুধু whitespace → 0"] },
          note: "`Number('')` — নিয়ম অনুযায়ী খালি বা শুধু-whitespace string কে `0` ধরা হয়। এটি `NaN` নয়, এবং এটিই form validation এ ফাঁদ।",
          output: "0",
        },
        {
          active: ["in", "rule", "out"],
          items: { in: ["'12px'"], rule: ["পুরোটা বৈধ নয় (px আছে)"], out: ["NaN"] },
          note: "`Number('12px')` — কঠোর নিয়ম: পুরো string টি সংখ্যা হতে হবে। `px` থাকায় ফল `NaN`। (আংশিক পড়তে চাইলে `parseFloat`।)",
          output: "NaN",
        },
        {
          active: ["in", "rule", "out"],
          items: { in: ["null  |  undefined"], rule: ["null → 0", "undefined → NaN"], out: ["0   |   NaN"] },
          note: "`Number(null)` হলো `0`, কিন্তু `Number(undefined)` হলো `NaN` — spec এর এই অসঙ্গতিটি মুখস্থ রাখার মতো, কারণ ‘মান নেই’ দুই রকম ফল দেয়।",
          output: "0\nNaN",
        },
      ],
      caption: "Number() পুরো ইনপুটকে একটি সংখ্যা-লিটারেল হিসেবে ব্যাখ্যা করার চেষ্টা করে — পারলে সংখ্যা, না পারলে NaN।",
    },
    {
      kind: "flow-steps",
      title: "parseInt('42px', 10): বাম থেকে ডানে prefix পড়া",
      nodes: [
        { id: "s", label: "string", sub: "'42px'" },
        { id: "scan", label: "বাম থেকে পড়া", sub: "অঙ্ক সংগ্রহ" },
        { id: "stop", label: "থামার জায়গা", sub: "প্রথম অবৈধ অক্ষর" },
        { id: "res", label: "ফল", sub: "সংগৃহীত অংশ → সংখ্যা" },
      ],
      steps: [
        {
          active: ["s"],
          items: { s: ["'4'  '2'  'p'  'x'"] },
          note: "`parseInt` প্রথমে leading whitespace বাদ দেয়, তারপর ঐচ্ছিক `+`/`-` চিহ্ন, তারপর radix অনুযায়ী অঙ্ক পড়া শুরু করে।",
        },
        {
          active: ["scan"],
          items: { scan: ["'4' → বৈধ", "'2' → বৈধ"] },
          note: "`'4'` ও `'2'` দশমিক (radix 10) অঙ্ক — সংগ্রহ হলো `'42'`।",
        },
        {
          active: ["stop"],
          items: { stop: ["'p' → অবৈধ, এখানেই থামো", "বাকি 'px' উপেক্ষিত"] },
          note: "`'p'` অঙ্ক নয়, তাই এখানেই পড়া শেষ। বাকি অংশ নীরবে বাদ — কোনো error হয় না। এজন্যই user input এ `parseInt` বিপজ্জনক হতে পারে।",
        },
        {
          active: ["res"],
          items: { res: ["'42' → 42"] },
          note: "সংগৃহীত অংশ থেকে সংখ্যা `42`। যদি প্রথম অক্ষরই অবৈধ হতো (`'px42'`), কিছুই সংগৃহীত হতো না এবং ফল হতো `NaN`।",
          output: "42",
        },
      ],
      caption: "Number('42px') কঠোর (NaN), parseInt('42px', 10) উদার (42) — প্রয়োজন বুঝে বেছে নিন।",
    },
    {
      kind: "flow-steps",
      title: "map(parseInt) এর ফাঁদ: index টি radix হয়ে যায়",
      nodes: [
        { id: "arr", label: "array", sub: "['1','2','3']" },
        { id: "map", label: "map", sub: "(el, index, arr)" },
        { id: "pi", label: "parseInt", sub: "(string, radix)" },
        { id: "res", label: "ফল", sub: "" },
      ],
      steps: [
        {
          active: ["arr", "map"],
          items: { map: ["callback(el, index, array)"] },
          note: "`map` প্রতিটি element এর জন্য callback কে **তিনটি** argument দেয়: element, index, পুরো array।",
        },
        {
          active: ["map", "pi"],
          items: { pi: ["parseInt('1', 0)", "parseInt('2', 1)", "parseInt('3', 2)"] },
          note: "`parseInt` শুধু প্রথম দুটি argument ব্যবহার করে — দ্বিতীয়টি radix। তাই index `0, 1, 2` ই radix হিসেবে ঢুকে গেল।",
        },
        {
          active: ["pi", "res"],
          items: { pi: ["radix 0 → 10 ধরে → 1", "radix 1 → অবৈধ radix → NaN", "radix 2 → '3' বৈধ নয় → NaN"], res: ["[ 1, NaN, NaN ]"] },
          note: "radix `0` মানে ডিফল্ট (দশমিক), radix `1` অবৈধ (সীমা ২–৩৬) তাই `NaN`, আর binary তে `'3'` কোনো অঙ্ক নয় তাই `NaN`।",
          output: "[ 1, NaN, NaN ]",
        },
        {
          active: ["map", "res"],
          items: { map: ["map(Number) বা map((s) => parseInt(s, 10))"], res: ["[ 1, 2, 3 ]"] },
          note: "সমাধান: এমন function দিন যা শুধু প্রথম argument নেয় (`Number`), অথবা radix নিজে স্পষ্ট করে দিন।",
          output: "[ 1, 2, 3 ]",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Number, String, Boolean — মৌলিক রূপান্তর",
      description: "তিনটি function এ কয়েকটি পরিচিত ইনপুট দিয়ে ফল দেখুন। চালানোর আগে প্রতিটির output অনুমান করার চেষ্টা করুন।",
      code: `// 1) Number()
console.log(Number("42"), Number("3.14"), Number("  7  "));
console.log(Number(""), Number(null), Number(undefined));
console.log(Number(true), Number(false), Number("12px"));

// 2) String()
console.log(String(123), String(true), String(null), String(undefined));
console.log(String([1, 2, 3]), String({}));

// 3) Boolean()
console.log(Boolean(""), Boolean("0"), Boolean(0), Boolean([]), Boolean(NaN));

// 4) type যাচাই
console.log(typeof Number("5"), typeof String(5), typeof Boolean(5));`,
    },
    {
      level: "intermediate",
      title: "parseInt, parseFloat ও NaN এর আচরণ",
      description: "prefix পড়া, radix, দশমিক কেটে যাওয়া এবং `NaN` পরীক্ষার সঠিক পদ্ধতি একসাথে।",
      code: `// prefix পড়া
console.log(parseInt("42px", 10), parseInt("px42", 10), parseFloat("3.14abc"));
console.log(parseInt("3.99", 10), Number("3.99"), Math.trunc(3.99));

// radix
console.log(parseInt("101", 2), parseInt("ff", 16), parseInt("0x1f"));
console.log((255).toString(16), (5).toString(2));

// map(parseInt) এর ফাঁদ ও সমাধান
const raw = ["1", "2", "3"];
console.log(raw.map(parseInt));
console.log(raw.map(Number));
console.log(raw.map((s) => parseInt(s, 10)));

// NaN
const bad = Number("abc");
console.log(bad, bad === bad, Number.isNaN(bad), Object.is(bad, NaN));
console.log(isNaN("abc"), Number.isNaN("abc"));
console.log(NaN + 1, NaN * 0, typeof NaN);`,
    },
    {
      level: "real-world",
      title: "Form ইনপুট normalize ও validate করা",
      description: "বাস্তবে সব input string। নিচের function গুলো খালি ঘর, অবৈধ সংখ্যা, range এবং JSON এর সম্ভাব্য ব্যর্থতা — সব সামলে নিরাপদে রূপান্তর করে।",
      code: `// খালি বা অবৈধ হলে null, নইলে সংখ্যা
function toNumberOrNull(raw) {
  if (typeof raw !== "string") return null;      // প্রথমে type যাচাই
  const trimmed = raw.trim();
  if (trimmed === "") return null;               // Number("") === 0 এর ফাঁদ এড়ানো
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;          // NaN ও Infinity বাদ
}

function parseAge(raw) {
  const n = toNumberOrNull(raw);
  if (n === null) return { ok: false, error: "সংখ্যা দিন" };
  if (!Number.isInteger(n)) return { ok: false, error: "পূর্ণসংখ্যা দিন" };
  if (n < 0 || n > 120) return { ok: false, error: "০ থেকে ১২০ এর মধ্যে দিন" };
  return { ok: true, value: n };
}

const inputs = ["25", "", "  ", "abc", "12px", "25.5", "200", " 30 ", "1e2"];
for (const raw of inputs) {
  console.log(JSON.stringify(raw), "->", parseAge(raw));
}

// JSON: নিরাপদ parse
function safeParse(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e.name };
  }
}
console.log(safeParse('{"theme":"dark","size":14}'));
console.log(safeParse("{theme: dark}"));

// JSON round-trip এ কী হারায়
const original = { n: 1, u: undefined, f() {}, d: new Date(0), bad: NaN };
console.log(JSON.stringify(original));`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log(Number("12"), String(12), Boolean(12));
`,
    },
    {
      label: "Number() এর ফল-তালিকা",
      code: `const samples = [
  ["''", ""],
  ["'   '", "   "],
  ["null", null],
  ["undefined", undefined],
  ["'12px'", "12px"],
  ["'0x1f'", "0x1f"],
  ["'1e3'", "1e3"],
  ["'1_000'", "1_000"],
  ["'Infinity'", "Infinity"],
  ["true", true],
  ["[]", []],
  ["[5]", [5]],
  ["[1, 2]", [1, 2]],
  ["{}", {}],
];

for (const [label, value] of samples) {
  console.log("Number(" + label + ") =", Number(value));
}

try {
  Number(Symbol("x"));
} catch (e) {
  console.log("Number(Symbol()) ->", e.name);
}`,
    },
    {
      label: "parseInt বনাম Number — তুলনা",
      code: `const inputs = ["42", "42px", "px42", "3.99", "", " 42 ", "1e3", "0x10", "-7"];

for (const s of inputs) {
  console.log(
    JSON.stringify(s),
    "Number:", Number(s),
    "| parseInt:", parseInt(s, 10),
    "| parseFloat:", parseFloat(s)
  );
}

// parseInt এর সংখ্যা-ইনপুট ফাঁদ
console.log(parseInt(0.0000005), "<- 0.0000005 এর string রূপ হলো", String(0.0000005));
console.log(parseInt("12", 37), parseInt("12", 1));  // অবৈধ radix`,
    },
    {
      label: "Falsy তালিকা ও Boolean()",
      code: `const values = [false, 0, -0, 0n, "", null, undefined, NaN, "0", "false", " ", [], {}, -1, Infinity];

for (const v of values) {
  console.log(Object.is(v, -0) ? "-0" : typeof v === "bigint" ? v + "n" : v, "->", Boolean(v));
}

const count = 0;
console.log("if (count) ভুল হতে পারে:", count ? "আছে" : "নেই");
console.log("count !== undefined:", count !== undefined ? "আছে" : "নেই");`,
    },
    {
      label: "JSON রূপান্তর ও তথ্য হারানো",
      code: `const data = {
  name: "Rina",
  age: 25,
  skip: undefined,
  fn() {},
  nan: NaN,
  when: new Date(0),
  list: [1, undefined, () => 1],
};

const text = JSON.stringify(data);
console.log(text);

const back = JSON.parse(text);
console.log(back);
console.log(typeof back.when);          // string — Date ফেরত আসেনি

console.log(JSON.stringify(undefined)); // undefined (string নয়)

try {
  JSON.stringify({ big: 10n });
} catch (e) {
  console.log("BigInt:", e.name);
}

try {
  JSON.parse("{'a': 1}");               // single quote বৈধ JSON নয়
} catch (e) {
  console.log("parse:", e.name);
}`,
    },
  ],

  debugging: [
    {
      title: "ইনপুট যোগ করতে গিয়ে জোড়া লেগে যাচ্ছে ('5' + '3' = '53')",
      bad: `const a = "5";   // যেমন input.value
const b = "3";
console.log("Total:", a + b);`,
      why: "দুটি মানই string, তাই `+` যোগ নয়, **string concatenation** করে। DOM input, query string, env variable — সব string আকারে আসে, তাই যোগের আগে স্পষ্টভাবে সংখ্যায় রূপান্তর করুন।",
      fix: `const a = "5";
const b = "3";
console.log("Total:", Number(a) + Number(b));`,
    },
    {
      title: "map(parseInt) এ NaN",
      bad: `const ids = ["10", "20", "30"].map(parseInt);
console.log(ids);`,
      why: "`map` callback কে `(element, index, array)` দেয়; `parseInt` এর দ্বিতীয় parameter radix। তাই index টি radix হয়ে `parseInt('10', 0)`, `parseInt('20', 1)`, `parseInt('30', 2)` চলে — ফল `[ 10, NaN, NaN ]`।",
      fix: `const ids = ["10", "20", "30"].map(Number);
console.log(ids);

// অথবা radix স্পষ্ট করে:
console.log(["10", "20", "30"].map((s) => parseInt(s, 10)));`,
    },
    {
      title: "খালি ইনপুট ‘০’ হয়ে ঢুকে যাচ্ছে",
      bad: `function readPrice(raw) {
  const price = Number(raw);
  if (Number.isNaN(price)) return "অবৈধ মূল্য";
  return "মূল্য: " + price;
}
console.log(readPrice(""));`,
      why: "`Number('')` হলো `0`, `NaN` নয়। তাই খালি ঘর validation পেরিয়ে ‘মূল্য: 0’ হয়ে যাচ্ছে — ব্যবহারকারী কিছু না লিখেও বিনামূল্যে পণ্য পেয়ে যেতে পারত।",
      fix: `function readPrice(raw) {
  if (raw.trim() === "") return "মূল্য দিন";   // খালি আগে আলাদা পরীক্ষা
  const price = Number(raw);
  if (!Number.isFinite(price)) return "অবৈধ মূল্য";
  return "মূল্য: " + price;
}
console.log(readPrice(""));`,
    },
    {
      title: "SyntaxError: JSON.parse এ ভাঙা text",
      bad: `const stored = "{theme: dark}";   // বৈধ JSON নয়
const settings = JSON.parse(stored);
console.log(settings.theme);`,
      why: "JSON এ key ও string মান double-quote এ লিখতে হয়। `JSON.parse` অবৈধ text এ `SyntaxError` ছোড়ে, এবং catch না করলে প্রোগ্রাম থেমে যায় — localStorage বা network থেকে আসা text কখনোই নিশ্চিতভাবে বৈধ নয়।",
      fix: `const stored = "{theme: dark}";
let settings;
try {
  settings = JSON.parse(stored);
} catch {
  settings = { theme: "light" };   // নিরাপদ ডিফল্ট
}
console.log(settings.theme);`,
    },
    {
      title: "null.toString() এ TypeError",
      bad: `const middleName = null;
console.log("নাম: " + middleName.toString());`,
      why: "`null` ও `undefined` এর কোনো method নেই, তাই `.toString()` ডাকলে `TypeError: Cannot read properties of null`। `String(value)` এই দুটি মানকেও নিরাপদে string করে।",
      fix: `const middleName = null;
console.log("নাম: " + String(middleName));
console.log("নাম: " + (middleName ?? "নেই"));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "String কে সংখ্যা বানিয়ে যোগ",
      prompt: "নিচের কোড `428` print করে কারণ `s` একটি string। এক জায়গায় রূপান্তর যোগ করে `50` print করুন।",
      starter: `const s = "42";
console.log(s + 8);`,
      expected: "50",
      hints: ["`+` এর বাম পাশ string হলে concatenation হয়।", "`Number(s)` ব্যবহার করুন।"],
      solution: `const s = "42";
console.log(Number(s) + 8);`,
      explanation: "`Number('42')` সংখ্যা `42` দেয়, তাই `42 + 8` হয় `50`।",
    },
    {
      level: "beginner",
      title: "Boolean() এর তিনটি ফল",
      prompt: "`Boolean('0')`, `Boolean(0)` ও `Boolean([])` এর ফল এক লাইনে print করুন (`console.log` এ তিনটি argument)। প্রত্যাশিত: `true false true`।",
      starter: `// TODO: তিনটি Boolean() ফল এক লাইনে print করুন
`,
      expected: "true false true",
      hints: ["`console.log(a, b, c)` space দিয়ে আলাদা করে print করে।", "`'0'` একটি খালি-নয় string, `[]` একটি object — দুটোই truthy।"],
      solution: `console.log(Boolean("0"), Boolean(0), Boolean([]));`,
      explanation: "Falsy শুধু আটটি; `'0'` (খালি নয় এমন string) ও `[]` (object) truthy, আর `0` falsy।",
    },
    {
      level: "beginner",
      title: "এককসহ মান থেকে সংখ্যা",
      prompt: "`weight` এর মান `'3.5kg'`। নিচের কোড `NaN` print করে। সঠিক function বদলে `7` print করুন।",
      starter: `const weight = "3.5kg";
console.log(Number(weight) * 2);`,
      expected: "7",
      hints: ["`Number` পুরো string কঠোরভাবে পড়ে।", "যে function বাম থেকে prefix পড়ে এবং দশমিক বোঝে সেটি লাগবে।"],
      solution: `const weight = "3.5kg";
console.log(parseFloat(weight) * 2);`,
      explanation: "`parseFloat('3.5kg')` বৈধ prefix `3.5` পর্যন্ত পড়ে, বাকি উপেক্ষা করে। `Number` এ `kg` থাকায় `NaN` হয়।",
    },
    {
      level: "intermediate",
      title: "নিরাপদ সংখ্যা রূপান্তর",
      prompt:
        "`toNumber(input)` function লিখুন: input খালি বা শুধু whitespace হলে `null`, `NaN` হলে `null`, নইলে সংখ্যা। বর্তমান কোড খালি ঘরে `0` দেয় এবং অবৈধ ইনপুটে `NaN` দেয়।",
      starter: `function toNumber(input) {
  return Number(input);
}

console.log(toNumber("42"), toNumber(""), toNumber("  "), toNumber("abc"), toNumber("3.5"));`,
      expected: "42 null null null 3.5",
      hints: ["আগে `input.trim() === ''` পরীক্ষা করুন।", "`Number.isNaN(n)` হলে `null` ফেরত দিন।"],
      solution: `function toNumber(input) {
  if (input.trim() === "") return null;
  const n = Number(input);
  return Number.isNaN(n) ? null : n;
}

console.log(toNumber("42"), toNumber(""), toNumber("  "), toNumber("abc"), toNumber("3.5"));`,
      explanation: "`Number('')` ও `Number('  ')` উভয়ই `0`, তাই খালি-পরীক্ষা `Number` এর আগে করতে হয়। তারপর `NaN` কে `null` এ বদলে ‘অবৈধ’ বোঝানো হয়।",
    },
    {
      level: "intermediate",
      title: "map(parseInt) ঠিক করুন",
      prompt: "নিচের কোড `[ 1, NaN, NaN ]` print করে। বদলে `[ 1, 2, 3 ]` print করান।",
      starter: `const nums = ["1", "2", "3"].map(parseInt);
console.log(nums);`,
      expected: "[ 1, 2, 3 ]",
      hints: ["`map` index টি দ্বিতীয় argument হিসেবে দেয়, যা `parseInt` radix ধরে নেয়।", "`map(Number)` অথবা arrow function দিয়ে radix `10` স্পষ্ট করুন।"],
      solution: `const nums = ["1", "2", "3"].map((s) => parseInt(s, 10));
console.log(nums);`,
      explanation: "arrow function শুধু element টি `parseInt` এ পাঠায় এবং radix `10` স্পষ্ট করে, ফলে index আর radix হয়ে যায় না।",
    },
    {
      level: "challenge",
      title: "Query string এর মান type সহ parse করুন",
      prompt:
        "`parseQuery(qs)` লিখুন: `'a=1&b=true&c=hello&d='` কে object এ বদলান। নিয়ম: `'true'`/`'false'` হলে boolean; খালি নয় এবং বৈধ সংখ্যা হলে number; নইলে string (খালি string ও string)। প্রত্যাশিত: `{ a: 1, b: true, c: 'hello', d: '' }`।",
      starter: `function parseQuery(qs) {
  const result = {};
  for (const pair of qs.split("&")) {
    const [key, value] = pair.split("=");
    result[key] = value;   // TODO: type অনুযায়ী রূপান্তর
  }
  return result;
}

console.log(parseQuery("a=1&b=true&c=hello&d="));`,
      expected: "{ a: 1, b: true, c: 'hello', d: '' }",
      hints: [
        "boolean আগে পরীক্ষা করুন: `value === 'true'`।",
        "সংখ্যার জন্য `value.trim() !== ''` এবং `!Number.isNaN(Number(value))` দুটিই লাগবে — কেন? (`Number('') === 0`)",
        "কোনোটিই না মিললে মূল string ই রাখুন।",
      ],
      solution: `function convert(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return value;
}

function parseQuery(qs) {
  const result = {};
  for (const pair of qs.split("&")) {
    const [key, value] = pair.split("=");
    result[key] = convert(value);
  }
  return result;
}

console.log(parseQuery("a=1&b=true&c=hello&d="));`,
      explanation: "খালি-পরীক্ষা ছাড়া `d=` কে `0` বানিয়ে ফেলা হতো (`Number('') === 0`)। `'hello'` এ `Number` ফল `NaN` তাই string ই থাকে। প্রতিটি সিদ্ধান্ত স্পষ্ট ও নিয়ন্ত্রিত — এটিই explicit conversion এর সুবিধা।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`Number(null)` এর ফল কী?",
        options: ["NaN", "0", "null", "TypeError"],
        answer: 1,
        explanation:
          "spec অনুযায়ী `null` সংখ্যায় রূপান্তরিত হলে `0` হয়। `NaN` হয় `Number(undefined)` এ — এই অসঙ্গতিই প্রশ্নের ফাঁদ। `null` ফেরত দেওয়ার প্রশ্নই ওঠে না কারণ `Number` সবসময় number type দেয়। `TypeError` শুধু `Symbol` এর ক্ষেত্রে।",
      },
      {
        question: "`console.log(Number.isNaN('abc'), isNaN('abc'))` কী print করবে?",
        options: ["true true", "false false", "false true", "true false"],
        answer: 2,
        explanation:
          "`Number.isNaN('abc')` রূপান্তর করে না; `'abc'` একটি string, `NaN` মান নয়, তাই `false`। global `isNaN('abc')` আগে `Number('abc')` (= `NaN`) করে তাই `true`। অন্য অপশনগুলো এই পার্থক্য উপেক্ষা করেছে বা উল্টো ধরেছে।",
      },
      {
        question: "`parseInt('101', 2)` এর ফল কী?",
        options: ["5", "101", "NaN", "2"],
        answer: 0,
        explanation:
          "radix `2` মানে string টি binary হিসেবে পড়া: `101` (binary) = ৪ + ০ + ১ = `5`। `101` হতো যদি radix `10` হতো। `NaN` হতো যদি string এ binary অঙ্ক (`0`/`1`) ছাড়া অক্ষর থাকত। `2` এর কোনো ভিত্তি নেই।",
      },
      {
        question: "`['10', '10', '10'].map(parseInt)` এর ফল কী?",
        options: ["[ 10, 10, 10 ]", "[ 10, 0, 0 ]", "[ 10, NaN, NaN ]", "[ 10, NaN, 2 ]"],
        answer: 3,
        explanation:
          "index `0, 1, 2` radix হয়ে যায়: `parseInt('10', 0)` = `10` (radix `0` মানে ডিফল্ট দশমিক), `parseInt('10', 1)` = `NaN` (radix `1` অবৈধ), `parseInt('10', 2)` = `2` (binary `10`)। তাই `[ 10, NaN, 2 ]`। তৃতীয় অপশনটি ভাবে binary তেও `NaN` হবে — কিন্তু `'10'` binary তে বৈধ।",
      },
      {
        question: "`Boolean('false')` এর ফল কী?",
        options: ["false", "true", "TypeError", "undefined"],
        answer: 1,
        explanation:
          "খালি নয় এমন যেকোনো string truthy — শব্দটির অর্থ কী তা engine দেখে না। তাই `true`। `false` মনে হয় ‘অর্থ পড়ে’ ভাবলে। `Boolean()` কখনো `TypeError` বা `undefined` দেয় না — সবসময় `true` বা `false`।",
      },
    ],
    coding: [
      {
        title: "বৈধ সংখ্যাগুলোর যোগফল",
        prompt: "`sumValid(list)` লিখুন: list এর string এর মধ্যে যেগুলো বৈধ সংখ্যা (খালি নয়, `NaN` নয়) সেগুলোর যোগফল ফেরত দিন। `['10', '20', 'abc', '5', '']` এর জন্য `35` print করুন।",
        starter: `// TODO: sumValid লিখুন
`,
        expected: "35",
        solution: `function sumValid(list) {
  let total = 0;
  for (const s of list) {
    if (s.trim() === "") continue;
    const n = Number(s);
    if (!Number.isNaN(n)) total += n;
  }
  return total;
}

console.log(sumValid(["10", "20", "abc", "5", ""]));`,
      },
      {
        title: "safeJsonParse",
        prompt: "`safeJsonParse(text, fallback)` লিখুন: `JSON.parse` সফল হলে ফল, `SyntaxError` হলে `fallback` ফেরত দিন। `safeJsonParse('{\"a\":1}', null)` ও `safeJsonParse('{bad', 'fallback')` এর ফল এক লাইনে print করে `{ a: 1 } fallback` দেখান।",
        starter: `// TODO: safeJsonParse লিখুন
`,
        expected: "{ a: 1 } fallback",
        solution: `function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

console.log(safeJsonParse('{"a":1}', null), safeJsonParse("{bad", "fallback"));`,
      },
    ],
  },

  interview: [
    {
      q: "Type conversion ও type coercion এর পার্থক্য কী? কোনটি ব্যবহার করা উচিত?",
      a: "**Type conversion (explicit)** হলো আপনি নিজে `Number(x)`, `String(x)`, `Boolean(x)` ইত্যাদি লিখে রূপান্তর করা। **Type coercion (implicit)** হলো অপারেটর বা context এর কারণে engine এর নিজে থেকে রূপান্তর, যেমন `'5' * 2` বা `if (value)`।\n\nউভয় ক্ষেত্রেই ভেতরে একই abstract operation (`ToNumber`, `ToString`, `ToBoolean`, `ToPrimitive`) চলে। পার্থক্য হলো স্পষ্টতায়: explicit রূপান্তরে কোডের উদ্দেশ্য পাঠক সরাসরি বোঝে এবং আপনি edge case (খালি string, `null`) সামলান। তাই সাধারণ নিয়ম — গুরুত্বপূর্ণ জায়গায় (বিশেষ করে বাইরের input) explicit রূপান্তর; `if (x)` এর মতো সুপরিচিত boolean context এ implicit গ্রহণযোগ্য।",
    },
    {
      q: "`Number('')`, `Number(null)`, `Number(undefined)` এর ফল কী এবং এটি কেন গুরুত্বপূর্ণ?",
      a: "`Number('')` হলো `0`, `Number(null)` হলো `0`, আর `Number(undefined)` হলো `NaN`। কারণ spec এর `ToNumber`: খালি বা শুধু-whitespace string এর মান `0`, `null` এর মান `+0`, কিন্তু `undefined` এর মান `NaN`।\n\nগুরুত্ব: ফর্ম validation এ `Number(input.value)` করে `NaN` হলে error দেখানোর কৌশল খালি ঘরে কাজ করে না, কারণ খালি ঘর `0` হয়ে যায়। সমাধান — রূপান্তরের আগে খালি-পরীক্ষা (`trim() === ''`) আলাদা করা, তারপর `Number.isFinite` দিয়ে ফল যাচাই করা।",
    },
    {
      q: "`Number('42px')` ও `parseInt('42px')` এর পার্থক্য কী? কখন কোনটি?",
      a: "`Number` পুরো string কে সংখ্যা-লিটারেল হিসেবে কঠোরভাবে পড়ে — `'42px'` তে `NaN`। `parseInt` বাম থেকে বৈধ পূর্ণসংখ্যার **prefix** পড়ে এবং বাকি অংশ নীরবে উপেক্ষা করে — `42`। `parseFloat` একইভাবে দশমিক বোঝে।\n\nযখন চান পুরো মানটি বৈধ সংখ্যা কি না (user input validation) তখন `Number` (এবং `Number.isFinite`)। যখন ইচ্ছাকৃতভাবে এককসহ মান থেকে সংখ্যা বের করতে চান (`'12.5px'`) তখন `parseFloat`। `parseInt` ব্যবহার করলে সবসময় radix দিন (`parseInt(s, 10)`)।",
    },
    {
      q: "`['1','2','3'].map(parseInt)` কেন `[1, NaN, NaN]` দেয়?",
      a: "`Array.prototype.map` এর callback কে তিনটি argument দেওয়া হয়: `(element, index, array)`। `parseInt` এর signature হলো `parseInt(string, radix)` — তাই index টি radix হিসেবে ঢুকে যায়।\n\nফলে ডাক হয় `parseInt('1', 0)` → `1` (radix `0` মানে ডিফল্ট), `parseInt('2', 1)` → `NaN` (radix অবশ্যই ২–৩৬ বা ০ হতে হবে), `parseInt('3', 2)` → `NaN` (binary তে `3` নেই)। সমাধান: `map(Number)` অথবা `map((s) => parseInt(s, 10))`। এটি একটি ক্লাসিক উদাহরণ যে callback এর অতিরিক্ত argument ও function এর signature না মিললে কী ঘটে।",
    },
    {
      q: "`isNaN` ও `Number.isNaN` এর পার্থক্য কী?",
      a: "global `isNaN(x)` আগে `x` কে `Number(x)` দিয়ে রূপান্তর করে, তারপর দেখে ফল `NaN` কি না। তাই `isNaN('abc')` হয় `true` (কারণ `Number('abc')` হলো `NaN`), যদিও `'abc'` নিজে `NaN` মান নয়। `Number.isNaN(x)` (ES2015) কোনো রূপান্তর করে না — শুধু `x` ঠিক `NaN` মান হলেই `true`।\n\nআধুনিক কোডে `Number.isNaN` ব্যবহার করুন, এবং রূপান্তর চাইলে নিজে স্পষ্টভাবে করুন। মনে রাখুন `NaN === NaN` হলো `false`; সেই কারণেই বিশেষ function দরকার। `Object.is(x, NaN)` ও কাজ করে। আরও কড়া যাচাই চাইলে `Number.isFinite(x)` (যা `NaN` ও `Infinity` দুটিকেই বাদ দেয়)।",
    },
    {
      q: "JavaScript এর falsy মান কী কী? `Boolean('false')` ও `Boolean([])` এর ফল কী?",
      a: "মোট আটটি falsy মান: `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`। বাকি সব truthy। তাই `Boolean('false')` হলো `true` (খালি-নয় string), `Boolean([])` ও `Boolean({})` হলো `true` (যেকোনো object truthy), `Boolean('0')` হলো `true`।\n\nব্যবহারিক সতর্কতা: `if (count)` লিখলে `count === 0` ‘নেই’ বলে ধরা পড়ে; `if (name)` এ খালি string ‘নেই’। যেখানে `0` বা `''` বৈধ মান, সেখানে `!== undefined` বা `!= null`, অথবা nullish coalescing (`??`) ব্যবহার করুন।",
    },
    {
      q: "`JSON.stringify` ও `JSON.parse` দিয়ে রূপান্তরে কী কী তথ্য হারায়? নিরাপত্তার দিক থেকে কী সতর্কতা?",
      a: "`JSON.stringify` এ `undefined`, function ও symbol মানের property বাদ পড়ে (array তে `null` হয়), `NaN`/`Infinity` হয় `null`, `Date` হয় ISO string (parse করলে আর `Date` থাকে না), `Map`/`Set` হয় খালি object `{}`, `BigInt` ও cycle এ `TypeError` ছোড়ে। তাই এটি সাধারণ deep copy এর নির্ভরযোগ্য উপায় নয় — `structuredClone` ভালো।\n\nনিরাপত্তা: `JSON.parse` অবৈধ text এ `SyntaxError` ছোড়ে — `try/catch` দিন। বৈধ JSON এর ভেতরের data তবুও অবিশ্বস্ত: প্রত্যাশিত field, type ও range validate করুন (প্রয়োজনে schema validation)। কখনো JSON এর বদলে `eval` ব্যবহার করবেন না — সেটি যেকোনো কোড চালাতে দেয়।",
    },
  ],

  summary: {
    takeaways: [
      "Explicit conversion (`Number()`, `String()`, `Boolean()`) আপনাকে নিয়ন্ত্রণ ও স্পষ্টতা দেয়; implicit coercion আলাদা lesson।",
      "`Number('')` ও `Number(null)` হলো `0`, `Number(undefined)` ও `Number('12px')` হলো `NaN` — খালি input আগে আলাদা পরীক্ষা করুন।",
      "`Number` পুরো string কঠোরভাবে পড়ে; `parseInt`/`parseFloat` বাম থেকে prefix পড়ে। `parseInt` এ সবসময় radix দিন এবং `map(parseInt)` এড়ান।",
      "`NaN !== NaN`, এবং `NaN` গাণিতিক হিসাবে ছড়িয়ে যায়; পরীক্ষার জন্য `Number.isNaN` (বা `Number.isFinite`), global `isNaN` নয়।",
      "Falsy মাত্র আটটি: `false, 0, -0, 0n, '', null, undefined, NaN`; বাকি সব truthy (`'0'`, `'false'`, `[]`, `{}` সহ)।",
      "`String(x)` সব মানে নিরাপদ; `x.toString()` `null`/`undefined` এ `TypeError` দেয়। `JSON.stringify/parse` তথ্য হারাতে পারে এবং `parse` কে `try/catch` এ রাখতে হয়।",
      "বাইরের input রূপান্তরের আগে ও পরে যাচাই করুন (type, range, `Number.isFinite`/`Number.isInteger`) — রূপান্তর মানে বিশ্বাসযোগ্য নয়।",
    ],
    syntax: `Number("42");            // 42   (পুরো string কঠোর)
Number("");              // 0    (সাবধান)
+"42";                   // 42   (unary +, Number এর মতো)
parseInt("42px", 10);    // 42   (সবসময় radix দিন)
parseFloat("3.5kg");     // 3.5
String(123);             // "123"
(255).toString(16);      // "ff"
Boolean(value);          // !!value
Number.isNaN(x);         // রূপান্তর ছাড়া NaN পরীক্ষা
Number.isFinite(x);      // NaN ও Infinity বাদ
JSON.stringify(obj);     // data -> string
JSON.parse(text);        // string -> data (try/catch সহ)`,
    whenToUse: [
      "বাইরের input (form, query string, env, localStorage) ব্যবহারের আগে → `Number()` / `String()` দিয়ে স্পষ্ট রূপান্তর + যাচাই।",
      "এককসহ বা আংশিক মান থেকে সংখ্যা বের করতে → `parseFloat` / `parseInt(s, 10)`।",
      "নির্দিষ্ট base এ (`ff`, `101`) সংখ্যা পড়তে বা লিখতে → `parseInt(s, radix)` / `n.toString(radix)`।",
      "মান ‘আছে কি না’ দেখতে যেখানে `0`/`''` বৈধ → `!= null`, `??` বা স্পষ্ট তুলনা, শুধু truthiness নয়।",
      "Data network বা storage এ পাঠাতে → `JSON.stringify`; ফেরত আনতে → `JSON.parse` (try/catch ও validation সহ)।",
    ],
    next: [
      "Type Coercion — implicit রূপান্তর ও ToPrimitive",
      "Equality: `==` বনাম `===` বনাম `Object.is`",
      "Operators ও nullish coalescing (`??`)",
      "Input validation ও error handling (পরবর্তী modules)",
    ],
  },

  compatibility:
    "`Number()`, `parseInt`, `String()`, `Boolean()`, `JSON` সব ECMAScript এর অংশ, তাই browser ও Node.js এ আচরণ একই। `Number.isNaN`, `Number.isFinite`, `Number.isInteger` ES2015 থেকে আছে; BigInt (`0n`) ES2020 থেকে সব আধুনিক browser ও Node.js এ আছে। পার্থক্য কেবল ইনপুটের উৎসে (browser এ DOM `.value`/`URLSearchParams`, Node.js এ `process.argv`/`process.env`/HTTP body — সব string)। এই lesson এর playground browser-like Web Worker এ চলে, তাই DOM বা `process` ব্যবহার করা হয়নি; ইনপুট string literal দিয়ে অনুকরণ করা হয়েছে।",
};
