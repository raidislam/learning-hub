import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "`try / catch / finally` এর control flow ও semantics (বিশেষ করে `finally` এর সাথে `return` এর আচরণ) ব্যাখ্যা করতে পারবেন।",
    "`throw` দিয়ে সবসময় `Error` object ছোড়ার কারণ এবং `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError` এর পার্থক্য বুঝবেন।",
    "`error.name`, `message`, `stack` ও `cause` (ES2022) ব্যবহার করে কার্যকর error তথ্য তৈরি করতে পারবেন।",
    "`Error` extend করে custom error class বানিয়ে `instanceof` দিয়ে নির্দিষ্ট error ধরতে ও বাকিগুলো rethrow করতে পারবেন।",
    "প্রত্যাশিত অবস্থা (validation) ও আসল exception এর পার্থক্য বুঝে সঠিক কৌশল বেছে নিতে পারবেন।",
    "`try/catch` কী ধরতে পারে না (async callback, parse-time error) এবং user এর কাছে কখনো internal তথ্য ফাঁস না করার নিয়ম প্রয়োগ করতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Error কী এবং কেন handle করতে হয়?" },
    {
      type: "p",
      text: "প্রোগ্রাম চলার সময় সবকিছু সবসময় ঠিক থাকে না: JSON ভুল ফরম্যাটে আসে, `null` এর property পড়ার চেষ্টা হয়, network বন্ধ থাকে, user ভুল input দেয়। JavaScript এ এমন অবস্থা তৈরি হলে (বা আপনি নিজে `throw` করলে) একটি **exception** ওঠে। Exception এর স্বাভাবিক ফল হলো: বর্তমান কোডের প্রবাহ **সাথে সাথে থেমে যায়** এবং engine call stack এর ওপরের দিকে (caller, তার caller…) এমন একটি `catch` খুঁজতে থাকে যা এটি সামলাতে পারে। এই ওপরে-ওঠার প্রক্রিয়াকে বলে **stack unwinding**। কোথাও `catch` না পেলে exception **uncaught** হয় — browser এ console এ লাল error, Node.js এ process crash।",
    },
    {
      type: "p",
      text: "Error handling এর লক্ষ্য সব error লুকানো নয়। লক্ষ্য হলো: **(১)** যে অবস্থা থেকে আমরা সত্যিই সামলে উঠতে পারি তা সামলানো, **(২)** যা পারি না তা স্পষ্টভাবে ও দ্রুত জানানো (**fail-fast**), **(৩)** resource (file, lock, loading spinner) সবসময় পরিষ্কার করা, এবং **(৪)** user কে অর্থপূর্ণ বার্তা দেওয়া, অথচ ভেতরের তথ্য ফাঁস না করা।",
    },
    { type: "h3", text: "try / catch / finally এর গঠন ও প্রবাহ" },
    {
      type: "code",
      caption: "সাধারণ গঠন: try তে ঝুঁকিপূর্ণ কোড, catch এ সামলানো, finally তে পরিষ্কার-করা",
      code: `try {
  // ঝুঁকিপূর্ণ কোড
} catch (error) {
  // try তে exception উঠলে শুধু তখনই চলে
} finally {
  // exception হোক বা না হোক — সবসময় চলে
}`,
    },
    {
      type: "ul",
      items: [
        "**try** — সব ঠিক থাকলে শেষ পর্যন্ত চলে। প্রথম যে লাইনে exception ওঠে, ওই লাইনের পরের বাকি try-কোড **চলে না** এবং প্রবাহ সোজা `catch` এ যায়।",
        "**catch (error)** — `error` variable টি শুধু এই block এর ভেতরে বৈধ। Exception না উঠলে `catch` পুরোপুরি skip হয়। ES2019 থেকে `catch { ... }` (optional catch binding) লেখা যায়, যখন error এর মান দরকার নেই।",
        "**finally** — exception হোক বা না হোক, এমনকি `try` বা `catch` এর ভেতরে `return`/`throw` থাকলেও **চলে**। Cleanup (timer বন্ধ, spinner লুকানো, lock ছাড়া) এর জন্য এটিই জায়গা।",
        "`catch` বা `finally` এর যেকোনো একটি থাকতেই হবে; শুধু `try { }` বৈধ নয়।",
      ],
    },
    {
      type: "p",
      text: "**`finally` এর সূক্ষ্মতা:** `try` তে `return value` থাকলে engine আগে `value` টি হিসাব করে রাখে, তারপর `finally` চালায়, তারপর function থেকে বেরোয়। অর্থাৎ `finally` এর কোড `return` এর **পরেও** চলে। কিন্তু `finally` এর ভেতরে যদি আরেকটি `return` (বা `throw`) থাকে, সেটি আগের `return`/`throw` কে **বাতিল করে বসে যায়**। এটি একটি পরিচিত bug-উৎস: `finally` এ `return` লিখলে `try` এ ছোড়া error নীরবে হারিয়ে যায়। তাই `finally` তে `return` লিখবেন না।",
    },
    { type: "h3", text: "throw: কী ছুঁড়বেন?" },
    {
      type: "p",
      text: "ভাষা অনুযায়ী `throw` দিয়ে **যেকোনো মান** ছোড়া যায় — `throw \"oops\"`, `throw 42`, `throw { code: 1 }`। কিন্তু সবসময় **`Error` object** (বা তার subclass) ছুঁড়ুন: `throw new Error(\"কী ভুল হলো\")`। কারণ `Error` object এ থাকে `name`, `message` এবং (অধিকাংশ engine এ) `stack` — যেখানে error তৈরি হয়েছিল তার call-stack এর ছবি, যা debugging এর প্রধান উপকরণ। String ছুঁড়লে `stack` থাকে না, `instanceof Error` মিথ্যা হয়, আর catch করা লোকটিকে `typeof` দিয়ে অনুমান করতে হয় সে কী পেয়েছে।",
    },
    { type: "h3", text: "বিল্ট-ইন error type" },
    {
      type: "compare",
      headers: ["Type", "কখন ওঠে", "উদাহরণ"],
      rows: [
        ["`TypeError`", "মান ভুল type এর, বা অনুমোদিত নয় এমন ব্যবহার", "`null.name`, `undefined()`, `const` এ reassign"],
        ["`ReferenceError`", "এমন নাম ব্যবহার যা scope এ নেই (বা TDZ তে আছে)", "`console.log(notDeclared)`"],
        ["`SyntaxError`", "কোড (বা parse করা text) ভাষার ব্যাকরণ মানে না", "`JSON.parse(\"{bad\")`, `new Function(\"if (\")`"],
        ["`RangeError`", "মান বৈধ type এর, কিন্তু অনুমোদিত সীমার বাইরে", "`new Array(-1)`, `(1).toFixed(101)`"],
        ["`Error`", "সাধারণ/নিজস্ব কারণ — আপনার নিজের `throw` এর জন্য", "`throw new Error(\"...\")`"],
      ],
    },
    {
      type: "p",
      text: "এছাড়া `EvalError`, `URIError`, `AggregateError` আছে; দৈনন্দিন কাজে প্রথম চারটিই বেশি দেখা যায়। প্রতিটি error object এ: **`name`** (যেমন `\"TypeError\"`), **`message`** (মানুষ-পাঠযোগ্য বর্ণনা) এবং **`stack`**। `message` এর সঠিক ভাষা engine ভেদে আলাদা হতে পারে (V8 ও Firefox ভিন্ন বাক্য দেয়), আর `stack` এর ফরম্যাটও engine-নির্ভর — তাই এগুলোর ওপর নির্ভর করে কোডের logic লিখবেন না; বদলে `name` বা `instanceof` দিয়ে type পরীক্ষা করুন।",
    },
    { type: "h3", text: "cause: error এর শৃঙ্খল (ES2022)" },
    {
      type: "p",
      text: "নিচু স্তরের error ধরে উঁচু স্তরে আরও অর্থপূর্ণ error ছোড়ার সময় মূল error হারিয়ে ফেললে debugging কঠিন হয়। ES2022 এ `new Error(message, { cause: originalError })` দিয়ে মূল error সংযুক্ত রাখা যায়; পরে `error.cause` দিয়ে পাওয়া যায়। এতে উঁচু স্তরের বার্তা (`\"Config লোড করা গেল না\"`) ও নিচের আসল কারণ (`SyntaxError` ...) দুটিই থাকে।",
    },
    { type: "h3", text: "Custom error class" },
    {
      type: "code",
      caption: "Error extend করে নিজস্ব type: super() আগে, তারপর name ও অতিরিক্ত তথ্য",
      code: `class ValidationError extends Error {
  constructor(field, message, options) {
    super(message, options); // options এ { cause } দেওয়া যায়
    this.name = "ValidationError";
    this.field = field;
  }
}`,
    },
    {
      type: "p",
      text: "কেন বানাব? কারণ `catch` এ আপনাকে প্রায়ই প্রশ্ন করতে হয় ‘এটি কি আমার প্রত্যাশিত ধরনের error?’। message string মিলিয়ে দেখা ভঙ্গুর; `error instanceof ValidationError` পরিষ্কার ও নির্ভরযোগ্য। নিজের `name` সেট না করলে `name` থাকে `\"Error\"`। (একটি সূক্ষ্মতা: ভিন্ন realm, যেমন iframe, থেকে আসা error এ `instanceof` কাজ নাও করতে পারে।)",
    },
    { type: "h3", text: "Rethrow: যা সামলাতে পারেন না তা ছেড়ে দিন" },
    {
      type: "p",
      text: "`catch` সব error ধরে — আপনার প্রত্যাশিত গুলো এবং প্রোগ্রামের ভুল (typo, `null` access) দুটিই। তাই সাধারণ নিয়ম: **শুধু যা সামলাতে জানেন তা সামলান, বাকিটা `throw error;` দিয়ে আবার ছুঁড়ুন।** নইলে একটি typo জনিত `TypeError` কে ‘invalid input’ বলে ভুল বার্তা দিয়ে লুকিয়ে ফেলা হবে। আর `catch {}` (খালি) প্রায় সবসময় ভুল — এটি error কে গিলে ফেলে।",
    },
    { type: "h3", text: "প্রত্যাশিত অবস্থা বনাম exception" },
    {
      type: "p",
      text: "‘Username খালি’, ‘email এ @ নেই’ — এগুলো user এর ভুল, সিস্টেমের ব্যর্থতা নয়; এগুলো **প্রত্যাশিত** এবং ঘন ঘন ঘটে। এদের জন্য সাধারণত result ফেরত দেওয়াই (`{ ok: false, errors: [...] }` বা error এর তালিকা) ভালো — আগের ‘Conditional Statements’ lesson এর validate-then-act। আর exception ব্যবহার করুন **ব্যতিক্রমী** অবস্থায়: contract ভঙ্গ (function ভুল argument পেল), I/O ব্যর্থতা, বা এমন পরিস্থিতি যেখানে caller এর কিছু করার নেই এবং দ্রুত থামাই ভালো। Exception কে স্বাভাবিক control flow হিসেবে (loop থেকে বেরোতে) ব্যবহার করা এড়িয়ে চলুন; তাতে কোড পড়াও কঠিন হয়, আর error তৈরির সময় stack capture এর খরচও থাকে।",
    },
    { type: "h3", text: "try/catch কী ধরতে পারে না" },
    {
      type: "ul",
      items: [
        "**Async callback এর ভেতরের error:** `try { setTimeout(() => { throw new Error(\"x\"); }, 0); } catch {}` — `setTimeout` এর callback পরে চলে, তখন `try` block অনেক আগেই শেষ, call stack ও আলাদা। Callback এর **ভেতরেই** নিজস্ব `try/catch` লিখতে হয়।",
        "**Promise rejection:** `try { promise } catch` কেবল synchronous throw ধরে; rejection `.catch()` বা `await` সহ `try/catch` লাগে। এই বিষয় বিস্তারিত পরের ‘Promises ও async/await’ lesson এ।",
        "**একই script এর parse-time `SyntaxError`:** কোডে ব্যাকরণগত ভুল থাকলে script চলার আগেই engine থেমে যায়, তাই ওই script এর `try/catch` কখনো চালুই হয় না। (কিন্তু `JSON.parse`, `eval`, `new Function` চলার সময় `SyntaxError` ছোড়ে, যা ধরা যায়।)",
      ],
    },
    {
      type: "p",
      text: "যে error কোথাও ধরা পড়ল না তার জন্য environment নিজস্ব ‘শেষ আশ্রয়’ দেয় — যা শুধু লগ/রিপোর্টের জন্য, সামলানোর জন্য নয়। নিচের দুটি কোড **এই playground এ চালানো যাবে না** (Web Worker এ `window`/`process` নেই), তাই কেবল দেখানোর জন্য:",
    },
    {
      type: "code",
      caption: "Browser: uncaught error ও unhandled promise rejection ধরার global hook (non-executed)",
      code: `window.onerror = (message, source, line, col, error) => {
  reportToServer({ message, source, line, col, stack: error && error.stack });
};
window.addEventListener("unhandledrejection", (event) => {
  reportToServer({ reason: String(event.reason) });
});`,
    },
    {
      type: "code",
      caption: "Node.js: process level hook (non-executed)",
      code: `process.on("uncaughtException", (error) => {
  logger.error(error);
  process.exit(1); // অবস্থা অনিশ্চিত — লগ করে বন্ধ করাই নিরাপদ
});
process.on("unhandledRejection", (reason) => {
  logger.error(reason);
});`,
    },
    {
      type: "callout",
      tone: "info",
      title: "Browser বনাম Node.js",
      text: "`try/catch/finally`, `throw`, `Error` ও তার subtype, `cause` — সবই ভাষার অংশ, তাই দুই জায়গায় একই। পার্থক্য শুধু ‘শেষ আশ্রয়’ এ: browser এ `window.onerror` ও `unhandledrejection` event, Node এ `process.on(\"uncaughtException\")` ও `\"unhandledRejection\"`। Node এর আধুনিক version এ unhandled rejection ডিফল্টে process বন্ধ করে দেয়। আর `error.stack` এর ফরম্যাট engine (V8, SpiderMonkey, JavaScriptCore) ভেদে আলাদা — তার ওপর parsing করে logic লিখবেন না।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Common misconceptions",
      text: "**(১)** ‘`try/catch` যেকোনো error ধরে’ — না: async callback ও parse-time error ধরে না। **(২)** ‘`finally` শুধু error হলে চলে’ — না, সবসময় চলে। **(৩)** ‘`finally` এ `return` দেওয়া নিরীহ’ — না, এটি আগের `throw`/`return` কে বাতিল করে। **(৪)** ‘string ছুঁড়লেও চলে’ — চলে, কিন্তু `stack` থাকে না, `instanceof Error` মিথ্যা। **(৫)** ‘`catch` এ খালি block রাখলে program নিরাপদ’ — উল্টো, সমস্যা লুকিয়ে ফেলে। **(৬)** ‘`error.message` দেখে logic চালানো যায়’ — message পরিবর্তনশীল, `instanceof`/নিজস্ব `code` ব্যবহার করুন।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security: user কে কখনো stack trace বা internal তথ্য দেখাবেন না",
      text: "`error.message` বা `error.stack` সরাসরি response/UI তে পাঠালে file path, library version, SQL query, server address, এমনকি password ও token ফাঁস হতে পারে — যা আক্রমণকারীকে সিস্টেমের গঠন জানিয়ে দেয়। নিয়ম: **ভেতরের জন্য** বিস্তারিত log (stack সহ, শুধু আপনার server/monitoring এ), **user এর জন্য** সংক্ষিপ্ত ও সাধারণ বার্তা (`\"কিছু একটা সমস্যা হয়েছে, পরে চেষ্টা করুন\"`) এবং চাইলে একটি অনুসন্ধান-id। Production এ error বার্তা বানানোর সময়ও secret (`password`, API key) বার্তার ভেতরে বসাবেন না — কারণ সেগুলো log ও monitoring এ চলে যায়।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "একটি **কারখানার প্রোডাকশন লাইন ও সেফটি ব্যবস্থা** ভাবুন। লাইনে একটি যন্ত্রাংশ ত্রুটিপূর্ণ হলে ওই ধাপের কাজ আর এগোতে পারে না — একজন শ্রমিক **অ্যালার্ম বাজায়** (`throw`)। অ্যালার্ম তার ধাপের কাছের সুপারভাইজার থেকে শুরু করে ওপরের দিকে এক এক করে প্রতিটি দায়িত্বশীল ব্যক্তির কাছে পৌঁছায় (stack unwinding), যতক্ষণ না কেউ বলেন ‘এটি আমি দেখছি’ (`catch`)।",
    },
    {
      type: "ul",
      items: [
        "**`try`** হলো কাজের ধাপ, যেখানে ঝুঁকি আছে — যেমন গরম ধাতু ঢালা।",
        "**`catch`** হলো সুপারভাইজারের সিদ্ধান্ত: ‘এই ত্রুটি আমি সামলাতে পারি — যন্ত্রাংশ বাতিল করে নতুনটা দিচ্ছি।’ কিন্তু যদি সমস্যাটি এমন হয় যা তাঁর এখতিয়ারে নেই (বিদ্যুৎ বিভ্রাট), তিনি **rethrow** করেন — ওপরে জানিয়ে দেন, নিজে চেপে যান না।",
        "**`finally`** হলো শিফট শেষের বাধ্যতামূলক পরিষ্কার-করা: যা-ই ঘটুক — সফল, ব্যর্থ বা মাঝপথে বন্ধ — চুল্লি নেভানো, গ্যাস বন্ধ ও দরজা তালা। এমনকি শ্রমিক কাজ শেষ করে ‘আমি বেরিয়ে যাচ্ছি’ (`return`) বললেও এই চেকলিস্ট করে তবেই তিনি বেরোতে পারেন। কিন্তু যদি এই চেকলিস্টের ভেতরেই কেউ নিজের মনে ‘সব ঠিক আছে’ লিখে বেরিয়ে যায় (`return` in `finally`), তবে আগের অ্যালার্ম চাপা পড়ে যায়।",
        "**Custom error class** হলো অ্যালার্মের রঙ: লাল (আগুন), হলুদ (যন্ত্রাংশ), নীল (কাঁচামাল কম)। সুপারভাইজার রঙ দেখেই বোঝে এটি তাঁর এলাকা কি না (`instanceof`) — অ্যালার্মের বার্তা পড়ে অনুমান করতে হয় না।",
        "**`cause`** হলো ঘটনার রিপোর্টে সংযুক্ত মূল সতর্কবার্তা: ‘ডেলিভারি বিলম্ব’ (উঁচু স্তরের বার্তা) এর সাথে সংযুক্ত ‘ট্রাক খারাপ হয়েছিল’ (আসল কারণ)।",
        "**প্রত্যাশিত অবস্থা বনাম exception:** গ্রাহক ভুল ফর্ম জমা দিলে অ্যালার্ম বাজানো হয় না — কাউন্টার থেকে ফর্ম ফেরত দিয়ে বলা হয় কী ভুল (validation result)। অ্যালার্ম শুধু অস্বাভাবিক ঘটনার জন্য।",
        "**Security:** কারখানার অভ্যন্তরীণ নকশা ও সার্কিট (stack trace) বাইরের দর্শনার্থীকে দেখানো হয় না — তাঁকে শুধু বলা হয় ‘সাময়িক বিঘ্ন, ক্ষমা করবেন’; বিস্তারিত যায় শুধু ভেতরের রেকর্ড-খাতায় (internal log)।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "try / catch / finally: exception উঠলে প্রবাহ",
      caption: "try এর যে লাইনে exception ওঠে সেখান থেকে বাকি try-কোড বাদ পড়ে, প্রবাহ catch → finally → পরের কোডে যায়।",
      nodes: [
        { id: "try", label: "try", sub: "ঝুঁকিপূর্ণ কোড" },
        { id: "catch", label: "catch (error)", sub: "সামলানো" },
        { id: "finally", label: "finally", sub: "সবসময় চলে" },
        { id: "after", label: "পরের কোড", sub: "প্রবাহ চলে" },
      ],
      steps: [
        {
          active: ["try"],
          items: { try: ["লাইন ১: console.log(\"start\")"] },
          output: "start",
          note: "`try` block এ প্রবেশ। প্রথম লাইন সফলভাবে চলল।",
        },
        {
          active: ["try"],
          items: { try: ["লাইন ২: throw new Error(\"boom\")", "লাইন ৩: (আর চলবে না)"] },
          note: "দ্বিতীয় লাইনে exception উঠল। `try` এর বাকি কোড (লাইন ৩) **বাদ পড়ল** — engine সাথে সাথে খুঁজছে কোন `catch` এটি ধরবে।",
        },
        {
          active: ["catch"],
          items: { catch: ["error.name = \"Error\"", "error.message = \"boom\""] },
          output: "caught: boom",
          note: "অনুরূপ `catch` পাওয়া গেল। `error` variable এ ছোড়া object টি। এখানে আমরা সামলালাম (বার্তা লগ করলাম)।",
        },
        {
          active: ["finally"],
          items: { finally: ["cleanup চলছে"] },
          output: "cleanup",
          note: "`catch` শেষ হওয়ার পর `finally` চলে — exception হোক বা না হোক, এটি চলত। যদি `catch` এ আবার `throw` করা হতো, তাও `finally` আগে চলত।",
        },
        {
          active: ["after"],
          note: "Exception সামলানো হয়ে গেছে, তাই `try...finally` এর পরের কোড স্বাভাবিকভাবে চলে। যদি `catch` এ rethrow করা হতো, তবে এই ধাপে না পৌঁছে exception আরও ওপরের caller এ চলে যেত।",
        },
      ],
    },
    {
      kind: "flow-steps",
      title: "finally ও return: কে আগে, কে জেতে",
      caption: "`try` এর `return` এর মান আগে হিসাব হয়, `finally` চলে, তারপর function বেরোয় — কিন্তু `finally` এ `return` থাকলে সেটিই জেতে।",
      nodes: [
        { id: "try", label: "try", sub: "return \"A\"" },
        { id: "finally", label: "finally", sub: "console.log(\"cleanup\")" },
        { id: "caller", label: "caller", sub: "ফল পায়" },
      ],
      steps: [
        {
          active: ["try"],
          items: { try: ["return \"A\"", "ফেরত-মান \"A\" মনে রাখা হলো"] },
          note: "`return \"A\"` এ মান `\"A\"` হিসাব হয়ে engine এর কাছে ‘অপেক্ষমাণ ফেরত-মান’ হিসেবে জমা থাকে। function এখনো বেরোয়নি।",
        },
        {
          active: ["finally"],
          items: { finally: ["console.log(\"cleanup\")", "অপেক্ষমাণ ফেরত-মান: \"A\""] },
          output: "cleanup",
          note: "Function ছাড়ার আগে `finally` চলে — `cleanup` print হয়। এখানে আমরা মান বদলাইনি, তাই অপেক্ষমাণ `\"A\"` অক্ষত।",
        },
        {
          active: ["caller"],
          items: { caller: ["পেল: \"A\""] },
          output: "A",
          note: "`finally` শেষ হলে function সেই অপেক্ষমাণ `\"A\"` ফেরত দেয়। **কিন্তু** `finally` এর ভেতরে `return \"B\"` লিখলে caller `\"B\"` পেত, আর `try` এ `throw` থাকলে সেই error হারিয়ে যেত।",
        },
      ],
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "try / catch / finally এর মৌলিক ব্যবহার",
      description: "`JSON.parse` ভুল text এ `SyntaxError` ছোড়ে। কোনো error বার্তার ওপর নির্ভর না করে শুধু `name` দেখানো হচ্ছে (বার্তা engine ভেদে আলাদা)।",
      code: `function parseOrNull(text) {
  try {
    const value = JSON.parse(text);
    console.log("parsed:", value);
    return value;
  } catch (error) {
    console.log("failed:", error.name);
    return null;
  } finally {
    console.log("finished parsing attempt");
  }
}

parseOrNull('{"name": "Rina"}');
parseOrNull("{name: Rina}");

// optional catch binding: error এর মান দরকার নেই
try {
  null.property;
} catch {
  console.log("কিছু একটা ভুল হয়েছে, কিন্তু প্রোগ্রাম চলছে");
}`,
    },
    {
      level: "intermediate",
      title: "Custom error, instanceof, cause ও rethrow",
      description: "নিজস্ব `ValidationError` শুধু সেটিই ধরে, বাকি error rethrow হয়। নিচে `cause` দিয়ে মূল error সংযুক্ত করা হয়েছে।",
      code: `class ValidationError extends Error {
  constructor(field, message, options) {
    super(message, options);
    this.name = "ValidationError";
    this.field = field;
  }
}

function setAge(age) {
  if (!Number.isInteger(age) || age < 0) {
    throw new ValidationError("age", "age must be a non-negative integer");
  }
  return age;
}

function handle(input) {
  try {
    console.log("age set:", setAge(input));
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("validation:", error.field, "-", error.message);
    } else {
      throw error; // যা সামলাতে জানি না, তা ছেড়ে দিই
    }
  }
}

handle(25);
handle(-3);

// cause: মূল error ধরে রাখা
function loadSettings(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Settings could not be loaded", { cause: error });
  }
}

try {
  loadSettings("{oops");
} catch (error) {
  console.log(error.message);
  console.log("cause:", error.cause.name);
  console.log(error instanceof Error, error.name);
}`,
    },
    {
      level: "real-world",
      title: "Safe boundary: ভেতরে বিস্তারিত log, user কে সাধারণ বার্তা",
      description: "একটি request handler কল্পনা করুন। অভ্যন্তরীণ error এ সংবেদনশীল তথ্য থাকতে পারে, তাই user কে শুধু নিরাপদ বার্তা ও একটি reference id দেওয়া হয়; বিস্তারিত যায় শুধু ‘server log’ এ। প্রত্যাশিত validation ভুল কিন্তু exception নয় — সরাসরি result।",
      code: `class AppError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "AppError";
  }
}

const serverLog = [];            // বাস্তবে: monitoring/log service
let nextId = 100;

function createUser(input) {
  // প্রত্যাশিত অবস্থা: exception নয়, result
  if (typeof input.email !== "string" || !input.email.includes("@")) {
    return { ok: false, status: 400, message: "Invalid email" };
  }
  // অস্বাভাবিক অবস্থা: infrastructure ব্যর্থতা (internal details আছে)
  if (input.simulateDbFailure) {
    throw new AppError("DB connect failed: user=admin host=10.0.0.5");
  }
  return { ok: true, status: 201, message: "Created" };
}

function handleRequest(input) {
  try {
    return createUser(input);
  } catch (error) {
    const refId = "ERR-" + nextId++;
    serverLog.push({ refId, name: error.name, message: error.message });
    // user কে কখনো error.message/stack নয়
    return { ok: false, status: 500, message: "Something went wrong. Reference: " + refId };
  } finally {
    // এখানে cleanup, যেমন DB connection ছাড়া
  }
}

console.log(handleRequest({ email: "rina@mail.com" }));
console.log(handleRequest({ email: "bad" }));
console.log(handleRequest({ email: "x@y.com", simulateDbFailure: true }));
console.log("server log:", serverLog);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
try {
  throw new Error("test error");
} catch (error) {
  console.log(error.name + ": " + error.message);
}
`,
    },
    {
      label: "Built-in error type গুলো দেখুন",
      code: `const attempts = {
  ReferenceError: () => notDeclaredAnywhere,
  TypeError: () => null.property,
  RangeError: () => new Array(-1),
  SyntaxError: () => JSON.parse("{bad"),
};

for (const [label, fn] of Object.entries(attempts)) {
  try {
    fn();
  } catch (error) {
    console.log(label, "->", error.name, "| instanceof Error:", error instanceof Error, "| match:", error.name === label);
  }
}

// message ও stack engine-নির্ভর; তাই শুধু type যাচাই করুন
try { undefinedFunction(); } catch (e) { console.log(e instanceof ReferenceError); }`,
    },
    {
      label: "finally: চলার ক্রম ও return override",
      code: `function order() {
  try {
    console.log("1. try");
    return "from try";
  } finally {
    console.log("2. finally runs after return value is computed");
  }
}
console.log("3. caller got:", order());

// finally এ return: আগের মান বাতিল
function override() {
  try {
    return "from try";
  } finally {
    return "from finally";
  }
}
console.log(override());

// finally এ return error কে গিলে ফেলে
function swallow() {
  try {
    throw new Error("lost!");
  } finally {
    return "no error visible";
  }
}
console.log(swallow());`,
    },
    {
      label: "যা ইচ্ছে ছোড়া যায়, কিন্তু Error ছুঁড়ুন",
      code: `const thrown = ["text", 42, { code: 7 }, new Error("real")];

for (const value of thrown) {
  try {
    throw value;
  } catch (e) {
    console.log("type:", typeof e, "| instanceof Error:", e instanceof Error, "| stack:", typeof e.stack);
  }
}

// catch এর e শুধু catch block এ বৈধ
try { throw new Error("x"); } catch (e) {}
console.log(typeof e);`,
    },
    {
      label: "Async callback: try/catch এর বাইরে চলে",
      code: `try {
  setTimeout(() => {
    // নিজস্ব try/catch ছাড়া এখানে throw করলে বাইরের catch ধরবে না
    try {
      throw new Error("late failure");
    } catch (error) {
      console.log("callback এর ভেতরে ধরা:", error.message);
    }
  }, 0);
  console.log("try block শেষ — callback এখনো চলেনি");
} catch (error) {
  console.log("এটি কখনো চলবে না");
}
console.log("outer কোড শেষ");`,
    },
  ],

  debugging: [
    {
      title: "finally তে return: error নীরবে হারিয়ে যায়",
      bad: `function load() {
  try {
    throw new Error("disk read failed");
  } finally {
    return "default data"; // error বাতিল!
  }
}
console.log(load());`,
      why: "`finally` এর `return` আগের `throw` কে বাতিল করে দেয়, তাই error কোথাও দৃশ্যমান হয় না এবং caller ভাবে সব ঠিক আছে। `finally` শুধু cleanup এর জন্য; ফেরত-মান বা error নিয়ন্ত্রণ `try`/`catch` এ রাখুন।",
      fix: `function load() {
  try {
    throw new Error("disk read failed");
  } catch (error) {
    console.log("logged:", error.message);
    return "default data"; // সচেতনভাবে fallback
  } finally {
    console.log("cleanup only");
  }
}
console.log(load());`,
    },
    {
      title: "খালি catch: সমস্যা লুকানো",
      bad: `let config = null;
try {
  config = JSON.parse("{ invalid json");
} catch {
  // কিছুই না
}
console.log("config loaded:", config !== undefined);
console.log(config);`,
      why: "খালি `catch` error গিলে ফেলে। প্রোগ্রাম এগিয়ে যায় কিন্তু `config` `null` — পরের ধাপে বিভ্রান্তিকর ব্যর্থতা হবে এবং কারণ খুঁজে পাওয়া কঠিন। হয় সামলান (fallback + log), নয়তো rethrow।",
      fix: `let config = null;
try {
  config = JSON.parse("{ invalid json");
} catch (error) {
  console.log("config invalid (" + error.name + "), using defaults");
  config = { theme: "light" };
}
console.log(config);`,
    },
    {
      title: "String ছোঁড়া: stack ও instanceof নেই",
      bad: `try {
  throw "Something broke";
} catch (e) {
  console.log("message:", e.message);
  console.log("is Error:", e instanceof Error);
  console.log("stack type:", typeof e.stack);
}`,
      why: "String এর `message` বা `stack` property নেই — তাই `undefined`। `instanceof Error` মিথ্যা। debugging এর সবচেয়ে দরকারি তথ্য (কোথায় ঘটল) হারিয়ে যায়। সবসময় `new Error(...)` ছুঁড়ুন।",
      fix: `try {
  throw new Error("Something broke");
} catch (e) {
  console.log("message:", e.message);
  console.log("is Error:", e instanceof Error);
  console.log("stack type:", typeof e.stack);
}`,
    },
    {
      title: "অতি-বিস্তৃত catch: প্রোগ্রামের ভুল ‘invalid input’ হয়ে যায়",
      bad: `function nameLength(jsonText) {
  try {
    return JSON.parse(jsonText).nmae.length; // typo: nmae
  } catch {
    return "invalid JSON";
  }
}
console.log(nameLength('{"name":"Rina"}'));`,
      why: "Input আসলে বৈধ JSON, কিন্তু `nmae` typo এর কারণে ওঠা `TypeError` ও একই `catch` এ ধরা পড়ে এবং ভুল বার্তা (‘invalid JSON’) দেখায়। `try` ছোট রাখুন, আর শুধু প্রত্যাশিত type (`SyntaxError`) ধরে বাকিটা rethrow করুন।",
      fix: `function nameLength(jsonText) {
  let data;
  try {
    data = JSON.parse(jsonText);
  } catch (error) {
    if (error instanceof SyntaxError) return "invalid JSON";
    throw error;
  }
  return data.name.length;
}
console.log(nameLength('{"name":"Rina"}'));
console.log(nameLength("{oops"));`,
    },
    {
      title: "User কে internal error বার্তা পাঠানো (তথ্য ফাঁস)",
      bad: `function connectDb() {
  throw new Error("Connection refused: user=admin password=hunter2 host=10.0.0.5");
}
function apiHandler() {
  try {
    connectDb();
  } catch (error) {
    return { status: 500, body: error.message }; // user পর্যন্ত যাচ্ছে!
  }
}
console.log(apiHandler());`,
      why: "`error.message` এ credential ও internal ঠিকানা আছে এবং সেটি সরাসরি response এ চলে যাচ্ছে — আক্রমণকারীর জন্য উপহার। বিস্তারিত শুধু server log এ থাকবে; user কে সাধারণ বার্তা।",
      fix: `const internalLog = [];
function connectDb() {
  throw new Error("Connection refused: host=10.0.0.5");
}
function apiHandler() {
  try {
    connectDb();
  } catch (error) {
    internalLog.push(error.message); // শুধু ভেতরের জন্য
    return { status: 500, body: "Something went wrong. Please try again later." };
  }
}
console.log(apiHandler());
console.log("internal log entries:", internalLog.length);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "JSON বৈধ কি না",
      prompt: "`isValidJson(text)` লিখুন: `JSON.parse` সফল হলে `true`, `SyntaxError` ছুঁড়লে `false` ফেরত দেবে।",
      starter: `function isValidJson(text) {
  // TODO: try / catch ব্যবহার করুন
}

console.log(isValidJson('{"a": 1}'));
console.log(isValidJson("{a: 1}"));`,
      expected: "true\nfalse",
      hints: ["`try` তে `JSON.parse(text); return true;`।", "`catch` এ `return false;`।"],
      solution: `function isValidJson(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

console.log(isValidJson('{"a": 1}'));
console.log(isValidJson("{a: 1}"));`,
    },
    {
      level: "beginner",
      title: "catch ও finally এর ক্রম",
      prompt: "নিচের `catch` ও `finally` block ভরে দিন যাতে output হয়: `start`, `caught: boom`, `cleanup`।",
      starter: `console.log("start");
try {
  throw new Error("boom");
} catch (error) {
  // TODO: "caught: " + message print করুন
} finally {
  // TODO: "cleanup" print করুন
}`,
      expected: "start\ncaught: boom\ncleanup",
      hints: ["`error.message` এ `\"boom\"` আছে।", "`console.log(\"caught: \" + error.message)`।"],
      solution: `console.log("start");
try {
  throw new Error("boom");
} catch (error) {
  console.log("caught: " + error.message);
} finally {
  console.log("cleanup");
}`,
    },
    {
      level: "beginner",
      title: "নিজে throw করুন",
      prompt: "`withdraw(balance, amount)` তে `amount` `balance` এর চেয়ে বেশি হলে `new Error(\"Insufficient funds\")` ছুঁড়ুন; নইলে বাকি টাকা ফেরত দিন। মূল কোড error ধরে `caught: ...` print করে।",
      starter: `function withdraw(balance, amount) {
  // TODO: প্রয়োজনে throw করুন
  return balance - amount;
}

try {
  console.log(withdraw(100, 30));
  console.log(withdraw(100, 500));
} catch (e) {
  console.log("caught: " + e.message);
}`,
      expected: "70\ncaught: Insufficient funds",
      hints: ["`if (amount > balance) { throw new Error(...); }`", "Guard clause এর মতো শুরুতেই পরীক্ষা করুন।"],
      solution: `function withdraw(balance, amount) {
  if (amount > balance) {
    throw new Error("Insufficient funds");
  }
  return balance - amount;
}

try {
  console.log(withdraw(100, 30));
  console.log(withdraw(100, 500));
} catch (e) {
  console.log("caught: " + e.message);
}`,
    },
    {
      level: "intermediate",
      title: "Custom ValidationError",
      prompt: "`Error` extend করে `ValidationError` class বানান: constructor `(field, message)`; `name` হবে `\"ValidationError\"` এবং `field` property থাকবে। তারপর নিচের কোড চালিয়ে output দেখুন।",
      starter: `// TODO: class ValidationError extends Error { ... }

function checkAge(age) {
  if (age < 0) throw new ValidationError("age", "age must be positive");
  return age;
}

try {
  checkAge(-1);
} catch (e) {
  console.log(e.name, e.field, e.message, e instanceof Error);
}`,
      expected: "ValidationError age age must be positive true",
      hints: ["`super(message)` সবার আগে।", "`this.name = \"ValidationError\"; this.field = field;`"],
      solution: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function checkAge(age) {
  if (age < 0) throw new ValidationError("age", "age must be positive");
  return age;
}

try {
  checkAge(-1);
} catch (e) {
  console.log(e.name, e.field, e.message, e instanceof Error);
}`,
      explanation: "`extends Error` হওয়ায় `instanceof Error` সত্য থাকে এবং `stack` ও পাওয়া যায়। `name` সেট না করলে সেটি `\"Error\"` থেকে যেত।",
    },
    {
      level: "intermediate",
      title: "cause দিয়ে error মোড়ানো",
      prompt: "`loadUser(text)` এ `JSON.parse` ব্যর্থ হলে মূল error কে `cause` হিসেবে রেখে `new Error(\"Could not load user\")` ছুঁড়ুন। Main কোড বার্তা ও `cause` এর `name` print করে।",
      starter: `function loadUser(text) {
  // TODO: try/catch + { cause }
  return JSON.parse(text);
}

try {
  loadUser("{broken");
} catch (e) {
  console.log(e.message);
  console.log(e.cause && e.cause.name);
}`,
      expected: "Could not load user\nSyntaxError",
      hints: ["`new Error(\"...\", { cause: error })` — দ্বিতীয় argument একটি object।", "`catch (error) { throw new Error(..., { cause: error }); }`"],
      solution: `function loadUser(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Could not load user", { cause: error });
  }
}

try {
  loadUser("{broken");
} catch (e) {
  console.log(e.message);
  console.log(e.cause && e.cause.name);
}`,
      explanation: "উপরের স্তরের বার্তা ও নিচের আসল কারণ দুটিই বেঁচে আছে। শুধু `throw new Error(\"Could not load user\")` লিখলে মূল `SyntaxError` হারিয়ে যেত।",
    },
    {
      level: "challenge",
      title: "Retry এর সাথে cleanup (try / catch / finally একসাথে)",
      prompt:
        "`runWithRetry(task, maxAttempts)` লিখুন: `task` কে সর্বোচ্চ `maxAttempts` বার চেষ্টা করুন। প্রতিটি ব্যর্থ চেষ্টায় `attempt N failed: <message>` print করুন। সফল হলে ফল `return` করুন। সব চেষ্টা ব্যর্থ হলে `new Error(\"gave up after N attempts\", { cause: lastError })` ছুঁড়ুন। **সফল বা ব্যর্থ — যেভাবেই বেরোক, ঠিক একবার `cleanup` print হবে** (`finally` এ)।",
      starter: `function runWithRetry(task, maxAttempts) {
  // TODO: loop + try/catch + finally
}

let calls = 0;
const flaky = () => {
  calls++;
  if (calls < 3) throw new Error("fail " + calls);
  return "ok on " + calls;
};

try {
  console.log("result:", runWithRetry(flaky, 5));
} catch (e) {
  console.log("error:", e.message);
}

const broken = () => { throw new Error("nope"); };
try {
  console.log("result:", runWithRetry(broken, 2));
} catch (e) {
  console.log("error:", e.message, "| cause:", e.cause.message);
}`,
      expected:
        "attempt 1 failed: fail 1\nattempt 2 failed: fail 2\ncleanup\nresult: ok on 3\nattempt 1 failed: nope\nattempt 2 failed: nope\ncleanup\nerror: gave up after 2 attempts | cause: nope",
      hints: [
        "বাইরের `try { ... } finally { console.log(\"cleanup\"); }`, ভেতরে `for` loop।",
        "প্রতি চেষ্টায় ভেতরের `try { return task(); } catch (err) { lastError = err; console.log(...); }`।",
        "Loop শেষে (সব ব্যর্থ) `throw new Error(..., { cause: lastError })` — এটিও `finally` এর আগে চলবে।",
      ],
      solution: `function runWithRetry(task, maxAttempts) {
  let lastError;
  try {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return task();
      } catch (err) {
        lastError = err;
        console.log("attempt " + attempt + " failed: " + err.message);
      }
    }
    throw new Error("gave up after " + maxAttempts + " attempts", { cause: lastError });
  } finally {
    console.log("cleanup");
  }
}

let calls = 0;
const flaky = () => {
  calls++;
  if (calls < 3) throw new Error("fail " + calls);
  return "ok on " + calls;
};

try {
  console.log("result:", runWithRetry(flaky, 5));
} catch (e) {
  console.log("error:", e.message);
}

const broken = () => { throw new Error("nope"); };
try {
  console.log("result:", runWithRetry(broken, 2));
} catch (e) {
  console.log("error:", e.message, "| cause:", e.cause.message);
}`,
      explanation:
        "লক্ষ্য করুন `cleanup` টি `result: ok on 3` এর **আগে** print হয়: `console.log(\"result:\", runWithRetry(...))` এ argument আগে হিসাব হয়, এবং function থেকে বেরোনোর আগে `finally` চলে। দ্বিতীয় ক্ষেত্রে `throw` ও `finally` এর পরে caller এর `catch` চলে। ভেতরের `try/catch` শুধু একটি চেষ্টার ব্যর্থতা সামলায়; বাইরের `try/finally` পুরো অপারেশনের cleanup নিশ্চিত করে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`function f() { try { return \"A\"; } finally { console.log(\"B\"); } } console.log(f());` কী print করে?",
        options: ["শুধু A", "প্রথমে B, তারপর A", "শুধু B", "প্রথমে A, তারপর B"],
        answer: 1,
        explanation: "`return \"A\"` এর মান হিসাব হয়ে অপেক্ষায় থাকে, তারপর `finally` চলে (`B` print), তারপর function বেরোয় এবং `console.log(f())` `A` print করে। তাই ক্রম `B` তারপর `A`। ‘শুধু A’ ভুল কারণ `finally` সবসময় চলে; `A` আগে আসত না, কারণ `console.log(f())` এর আগে `f()` শেষ হতে হয়।",
      },
      {
        question: "নিচের কোন ক্ষেত্রে ঘিরে থাকা `try/catch` error ধরতে **পারে না**?",
        options: ["`JSON.parse(\"{\")`", "`null.name`", "`setTimeout` এর callback এর ভেতরে `throw`", "`throw new Error(\"x\")`"],
        answer: 2,
        explanation: "`setTimeout` callback পরে চলে, তখন `try` block শেষ ও call stack আলাদা, তাই বাইরের `catch` কিছু ধরে না। বাকি তিনটি synchronous: `JSON.parse` এর `SyntaxError`, `null.name` এর `TypeError` ও সরাসরি `throw` — সবই ধরা যায়।",
      },
      {
        question: "`try { throw \"x\"; } catch (e) { console.log(e instanceof Error); }` এর output কী?",
        options: ["false", "true", "TypeError", "undefined"],
        answer: 0,
        explanation: "ছোড়া মান একটি primitive string, `Error` object নয়, তাই `instanceof Error` হলো `false` (কোনো error আসে না, `instanceof` এ ডান দিকে constructor থাকলে বাম দিকে primitive দিলে `false`)। `true` হতো `new Error(\"x\")` ছুঁড়লে। `undefined` নয়, কারণ `instanceof` সবসময় boolean দেয়।",
      },
      {
        question: "ES2022 এ নিচু স্তরের error কে নতুন error এর সাথে সংযুক্ত রাখার সঠিক উপায় কোনটি?",
        options: ["`new Error(\"msg\", { reason: err })` ও `e.reason`", "`new Error(\"msg\", { parent: err })` ও `e.parent`", "`new Error(\"msg\", err)` ও `e.previous`", "`new Error(\"msg\", { cause: err })` ও `e.cause`"],
        answer: 3,
        explanation: "ES2022 এর options object এ স্বীকৃত key হলো `cause`, এবং পরে `error.cause` দিয়ে পাওয়া যায়। `reason`, `parent`, `previous` — এসব কোনো standard নয়; এগুলো দিলে সংযুক্তি তৈরি হয় না।",
      },
      {
        question: "`finally` সম্পর্কে কোন বিবৃতি সঠিক?",
        options: ["শুধু error হলে চলে", "`try` তে `return` থাকলে চলে না", "`try` তে `return` থাকলেও চলে", "শুধু `catch` block থাকলে চলে"],
        answer: 2,
        explanation: "`finally` exception হোক বা না হোক, এমনকি `try`/`catch` এ `return` বা `throw` থাকলেও চলে। ‘শুধু error হলে’ ভুল (সফল হলেও চলে), ‘return থাকলে চলে না’ ভুল (return এর মান হিসাবের পর চলে), আর `catch` ছাড়া শুধু `try...finally` ও বৈধ।",
      },
    ],
    coding: [
      {
        title: "parseJsonOr: fallback সহ নিরাপদ parse",
        prompt: "`parseJsonOr(text, fallback)` লিখুন: `text` বৈধ JSON হলে parse করা মান, নইলে `fallback` ফেরত দিন। `'{\"a\":1}'` এর জন্য `{}` fallback এবং `\"oops\"` এর জন্য `[]` fallback দিয়ে ফল print করুন।",
        starter: `function parseJsonOr(text, fallback) {
  // TODO
}

console.log(parseJsonOr('{"a":1}', {}));
console.log(parseJsonOr("oops", []));`,
        expected: "{ a: 1 }\n[]",
        solution: `function parseJsonOr(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

console.log(parseJsonOr('{"a":1}', {}));
console.log(parseJsonOr("oops", []));`,
      },
      {
        title: "HttpError ও 404",
        prompt: "`Error` extend করে `HttpError(status, message)` বানান (`name` হবে `\"HttpError\"`)। `fetchUser(id)` শুধু `id === 1` এর জন্য `{ id: 1 }` ফেরত দেয়, নইলে `HttpError(404, \"User not found\")` ছোঁড়ে। `1` ও `2` এর জন্য কল করে সফল হলে ফল, ব্যর্থ হলে `status name message` print করুন।",
        starter: `// TODO: class HttpError

function fetchUser(id) {
  // TODO
}

for (const id of [1, 2]) {
  try {
    console.log(fetchUser(id));
  } catch (e) {
    console.log(e.status, e.name, e.message);
  }
}`,
        expected: "{ id: 1 }\n404 HttpError User not found",
        solution: `class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function fetchUser(id) {
  if (id !== 1) throw new HttpError(404, "User not found");
  return { id: 1 };
}

for (const id of [1, 2]) {
  try {
    console.log(fetchUser(id));
  } catch (e) {
    console.log(e.status, e.name, e.message);
  }
}`,
      },
    ],
  },

  interview: [
    {
      q: "`try / catch / finally` এর প্রবাহ ব্যাখ্যা করুন। `finally` এ `return` থাকলে কী হয়?",
      a: "`try` তে exception না উঠলে `catch` skip হয়ে `finally` চলে। Exception উঠলে `try` এর বাকি অংশ বাদ যায়, প্রবাহ `catch` এ আসে এবং তারপর `finally` চলে। `finally` **সবসময়** চলে — `try`/`catch` এ `return`, `break` বা `throw` থাকলেও। `try` এর `return` এর মান আগে হিসাব হয়, তারপর `finally` চলে, তারপর function বেরোয়।\n\nকিন্তু `finally` এর ভেতরেই `return` (বা `throw`) থাকলে সেটি আগের `return`/`throw` কে **বাতিল করে বসে যায়** — ফলে `try` এ ছোড়া error নীরবে গায়েব। তাই `finally` কে শুধু cleanup (timer বন্ধ, resource মুক্ত, spinner লুকানো) এর জন্য রাখুন; control flow ও ফেরত-মান `try`/`catch` এ রাখুন।",
    },
    {
      q: "কেন সবসময় `Error` object ছুঁড়া উচিত, যেকোনো মান ছোড়া গেলেও?",
      a: "ভাষা যেকোনো মান `throw` করতে দিলেও `Error` object এ ধারাবাহিকভাবে `name`, `message` এবং (অধিকাংশ engine এ) `stack` থাকে — যা debugging ও log এর মূল উপাদান। String বা plain object ছুঁড়লে `stack` থাকে না (error কোথায় ঘটল তা জানা যায় না), `instanceof Error` মিথ্যা হয়, এবং monitoring tool গুলো ঠিকমতো গ্রুপ/রিপোর্ট করতে পারে না।\n\nআরও একটি কারণ: catch করা লোককে নিশ্চিত থাকতে হয় সে একটি কাঠামোবদ্ধ জিনিস পাচ্ছে। `Error` এর subclass (`class ValidationError extends Error`) দিয়ে type ও অতিরিক্ত তথ্য (`field`, `status`, `code`) যোগ করা যায় এবং `instanceof` দিয়ে নির্ভরযোগ্যভাবে আলাদা করা যায়।",
    },
    {
      q: "`TypeError`, `ReferenceError`, `SyntaxError` ও `RangeError` এর পার্থক্য কী? কিছু উদাহরণ দিন।",
      a: "`ReferenceError` — এমন নাম ব্যবহার যা scope এ নেই বা TDZ তে আছে (`console.log(notDeclared)`)। `TypeError` — মান ভুল type এর বা ব্যবহার বৈধ নয় (`null.name`, `undefined()`, `const` এ reassign)। `SyntaxError` — কোড বা parse করা text ভাষার ব্যাকরণ মানে না; কোডে থাকলে script চলারই আগে ধরা পড়ে, আর `JSON.parse`/`eval`/`new Function` এ runtime এ ছোড়ে (ধরা যায়)। `RangeError` — মান সঠিক type এর কিন্তু সীমার বাইরে (`new Array(-1)`, `(1).toFixed(101)`)।\n\nব্যবহারিক পরামর্শ: error এর `message` এর ওপর logic দাঁড় করাবেন না, কারণ বার্তা engine ভেদে আলাদা; `error.name` বা `instanceof` ব্যবহার করুন।",
    },
    {
      q: "Custom error class কেন বানাব, এবং `cause` কীভাবে সাহায্য করে?",
      a: "Custom error (`class NotFoundError extends Error`) দিয়ে catch এ ‘এটি কি আমার প্রত্যাশিত error?’ প্রশ্নটির উত্তর message string মেলানোর ভঙ্গুর পদ্ধতির বদলে `instanceof` দিয়ে নির্ভরযোগ্যভাবে দেওয়া যায়। সেই সঙ্গে `status`, `field`, `code` এর মতো অতিরিক্ত তথ্য বহন করা যায়। নিজের `name` সেট করতে ভুলবেন না, নইলে `name` থাকে `\"Error\"`।\n\n`cause` (ES2022) মূল error কে উঁচু স্তরের error এর সাথে জুড়ে রাখে: `throw new Error(\"Order failed\", { cause: dbError })`। এতে উঁচু স্তরে অর্থপূর্ণ বার্তা, আর নিচের আসল কারণও পাওয়া যায় — স্তর পেরোনোর সময় তথ্য হারায় না। Log করার সময় `cause` শৃঙ্খলও যাতে দেখা যায় তা নিশ্চিত করুন।",
    },
    {
      q: "কখন exception ছুঁড়বেন আর কখন result/ফেরত-মান (যেমন `{ ok: false }`) ব্যবহার করবেন?",
      a: "প্রত্যাশিত ও ঘন ঘন ঘটা অবস্থা — যেমন form validation ভুল, ‘পাওয়া যায়নি’ — এ result ফেরত দেওয়া সাধারণত পরিষ্কার: caller স্পষ্টভাবে দুই ক্ষেত্র সামলাতে বাধ্য হয় এবং control flow সরল থাকে। Exception উপযুক্ত **ব্যতিক্রমী** অবস্থায়: function এর contract ভঙ্গ (ভুল argument), I/O বা infrastructure ব্যর্থতা, এমন অবস্থা যেখানে caller এর কিছু করার নেই এবং দ্রুত থেমে যাওয়া উচিত (**fail-fast**)।\n\nException কে সাধারণ control flow (loop থেকে বেরোনো, বিকল্প পথ) হিসেবে ব্যবহার করা এড়ানো ভালো: কোড পড়া কঠিন হয় এবং error তৈরির সময় stack capture এর খরচও থাকে। কোনো কঠোর নিয়ম নেই — team এর convention ও সামঞ্জস্য গুরুত্বপূর্ণ।",
    },
    {
      q: "`try/catch` কোন কোন error ধরতে পারে না, এবং সেগুলো কীভাবে সামলাবেন?",
      a: "**(১)** Async callback এর error — `try { setTimeout(() => { throw ... }) } catch {}` ধরে না, কারণ callback পরে চলে যখন `try` শেষ। সমাধান: callback এর **ভেতরে** `try/catch`। **(২)** Promise rejection — synchronous `try/catch` ধরে না; `.catch()` লাগে বা `async` function এ `await` সহ `try/catch`। (বিস্তারিত পরের Promises/async lesson এ।) **(৩)** একই script এর parse-time `SyntaxError` — script চলার আগেই থামে, তাই ওই script এর `try/catch` কার্যকর হয় না; তবে `JSON.parse`, `eval`, `new Function` এর runtime `SyntaxError` ধরা যায়।\n\nযা কোথাও ধরা পড়ে না তার জন্য শেষ আশ্রয়: browser এ `window.onerror` ও `unhandledrejection` event, Node এ `process.on(\"uncaughtException\")` ও `\"unhandledRejection\"`। এগুলো মূলত লগ/রিপোর্টের জন্য — অবস্থা অনিশ্চিত হতে পারে, তাই সাধারণত লগ করে process বন্ধ করাই নিরাপদ (Node এ)।",
    },
    {
      q: "Production এ error বার্তা নিয়ে কী নিরাপত্তা-সতর্কতা নেবেন?",
      a: "User বা API client কে কখনো `error.message`, `error.stack`, SQL query, file path বা library version সরাসরি দেখাবেন না — এগুলো আক্রমণকারীকে সিস্টেমের গঠন, প্রযুক্তি ও দুর্বলতা জানিয়ে দেয়, আর বার্তায় ভুল করে credential ঢুকে থাকলে সরাসরি ফাঁস হয়। নিয়ম: server এ বিস্তারিত (stack সহ) log করুন, user কে সাধারণ বার্তা ও একটি reference id দিন যা দিয়ে support ওই log খুঁজে পাবে।\n\nআরও: error বার্তা বানানোর সময় secret/token/password তার ভেতরে বসাবেন না (log ও monitoring এ চলে যায়); user-input কে error বার্তায় অনিয়ন্ত্রিতভাবে বসিয়ে HTML এ দেখালে XSS হতে পারে, তাই output escape করুন; এবং বিস্তারিত error ভেদে HTTP status (যেমন ‘user আছে কি না’ ও ‘password ভুল’) আলাদা বার্তা দিয়ে account enumeration এর সুযোগ দেবেন না।",
    },
  ],

  summary: {
    takeaways: [
      "Exception ওঠা মানে প্রবাহ থেমে stack বেয়ে ওপরের `catch` খোঁজা (stack unwinding); না পেলে uncaught।",
      "`finally` সবসময় চলে (return এর পরেও); `finally` তে `return`/`throw` আগের ফলকে বাতিল করে — এড়িয়ে চলুন।",
      "সবসময় `new Error(...)` (বা subclass) ছুঁড়ুন; `name`, `message`, `stack` পাবেন; `stack` ও `message` engine-নির্ভর।",
      "`TypeError`, `ReferenceError`, `SyntaxError`, `RangeError` চিনুন; `instanceof`/`name` দিয়ে যাচাই করুন, message দিয়ে নয়।",
      "`cause` (ES2022) দিয়ে মূল error ধরে রাখুন; custom class দিয়ে নিজস্ব error type ও অতিরিক্ত তথ্য যোগ করুন।",
      "যা সামলাতে জানেন শুধু তাই ধরুন, বাকিটা rethrow করুন; খালি `catch` নয়।",
      "প্রত্যাশিত অবস্থা (validation) → result; ব্যতিক্রমী অবস্থা → exception; async error আলাদা কৌশলে (পরের lesson)।",
      "User কে stack trace বা internal তথ্য দেখাবেন না — ভেতরে log, বাইরে সাধারণ বার্তা।",
    ],
    syntax: `try {
  riskyOperation();
} catch (error) {                 // বা: catch { ... }
  if (!(error instanceof ValidationError)) throw error; // rethrow
  handle(error);
} finally {
  cleanup();                      // সবসময় চলে
}

class AppError extends Error {
  constructor(message, options) {
    super(message, options);      // options = { cause }
    this.name = "AppError";
  }
}

throw new Error("মানুষ-পাঠযোগ্য বার্তা", { cause: originalError });`,
    whenToUse: [
      "I/O, parsing (`JSON.parse`) বা বাইরের ডেটা নিয়ে কাজে — ব্যর্থতার জন্য `try/catch`।",
      "Resource cleanup এ — `finally`।",
      "Contract ভঙ্গ বা ব্যতিক্রমী অবস্থায় দ্রুত থামাতে — `throw new Error`/custom error।",
      "একাধিক স্তরে error এ অর্থ ও মূল কারণ ধরে রাখতে — `cause`।",
      "প্রত্যাশিত user-error এ (`validation`) — exception নয়, result ফেরত।",
    ],
    next: [
      "Promises ও async/await — asynchronous error handling (`.catch`, `await` + `try/catch`)",
      "Functions ও Scope — call stack এর গভীর ধারণা",
      "Debugging কৌশল — browser DevTools ও Node inspector",
      "Web Security Basics — error বার্তা, logging ও XSS",
    ],
  },

  compatibility:
    "`try/catch/finally`, `throw`, `Error` ও তার subtype সব ECMAScript এ আছে; optional catch binding (`catch {`) ES2019, `Error` এর `cause` option ES2022 — সব আধুনিক browser ও Node.js (16.9+ এ `cause`) এ কাজ করে। `error.stack` এর ফরম্যাট ও অনেক `message` এর বাক্য engine ভেদে আলাদা। শেষ আশ্রয়ের hook আলাদা: browser এ `window.onerror`/`unhandledrejection`, Node এ `process.on(\"uncaughtException\"/\"unhandledRejection\")` — এই দুটি lesson এ শুধু দেখানো হয়েছে, Web Worker playground এ চালানো যায় না।",
};
