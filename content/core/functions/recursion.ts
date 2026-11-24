import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Recursion এর দুটি অংশ — **base case** ও **recursive case** — চিনে নিজে function লিখতে পারবেন।",
    "Call stack এ frame কীভাবে জমে (building) এবং ফেরত আসার সময় কীভাবে খুলে যায় (unwinding) তা ধাপে ধাপে ব্যাখ্যা করতে পারবেন।",
    "Stack overflow (`RangeError`) কেন হয়, কীভাবে এড়াবেন এবং recursion বনাম iteration এর trade-off বুঝবেন।",
    "Naive `fib` এ duplicate কাজ চিনে **memoization** দিয়ে ঠিক করতে পারবেন।",
    "Nested data (deep array, tree, JSON-like object) এর ওপর recursion চালাতে পারবেন।",
    "Accumulator pattern, mutual recursion ও trampoline এর ধারণা জানবেন এবং সাধারণ recursion bug ধরতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Recursion আসলে কী?" },
    {
      type: "p",
      text: "Recursion হলো এমন একটি function যা তার সমস্যা সমাধানের জন্য **নিজেকেই আবার ডাকে** — তবে প্রতিবার সমস্যাটিকে একটু ছোট করে। `factorial(4)` বের করতে `4 * factorial(3)` লিখি; `factorial(3)` বের করতে `3 * factorial(2)` — এভাবে চলতে চলতে একসময় এমন একটি সমস্যায় পৌঁছাই যার উত্তর সরাসরি জানা (`factorial(0) = 1`)। সেখান থেকে উত্তরগুলো ফেরত আসতে আসতে পুরো উত্তর তৈরি হয়।",
    },
    {
      type: "p",
      text: "প্রতিটি সঠিক recursive function এর **ঠিক দুটি অংশ** থাকে। (১) **Base case** — যে অবস্থায় function আর নিজেকে ডাকে না, সরাসরি উত্তর দেয়। (২) **Recursive case** — যেখানে function সমস্যাকে ছোট করে (progress) নিজেকে ডাকে। Base case না থাকলে function চিরকাল নিজেকে ডাকতে থাকবে; আর progress না থাকলে base case এ কখনো পৌঁছানো যাবে না।",
    },
    {
      type: "code",
      caption: "Recursion এর কাঠামো (সব recursive function এই ছাঁচে পড়ে)",
      code: `function solve(problem) {
  if (isSmallest(problem)) {      // 1) base case
    return directAnswer(problem);
  }
  const smaller = shrink(problem); // 2) সমস্যা ছোট করুন (progress)
  return combine(problem, solve(smaller)); // 3) নিজেকে ডাকুন ও ফল জোড়া দিন
}`,
    },
    { type: "h3", text: "ভেতরে কী ঘটে: Call Stack" },
    {
      type: "p",
      text: "JavaScript এ প্রতিটি function call এর জন্য engine একটি **stack frame** তৈরি করে call stack এ রাখে। Frame এ থাকে সেই call এর parameter, local variable ও ‘কাজ শেষ হলে কোথায় ফিরব’ — এই তথ্য। Function `return` করলে frame টি stack থেকে সরে যায়। Recursion এ একই function এর **অনেকগুলো frame** একসাথে stack এ থাকে, প্রতিটির নিজস্ব `n`।",
    },
    {
      type: "p",
      text: "`factorial(4)` চালালে stack বাড়তে থাকে (**building phase**): `factorial(4)` → `factorial(3)` → … → `factorial(0)`। `factorial(0)` সরাসরি `1` ফেরত দেয়, তখন **unwinding phase** শুরু: `factorial(1)` পায় `1` ও `1 * 1` ফেরত দেয়, `factorial(2)` পায় `1` ও `2 * 1` … শেষে `24`। লক্ষ্য করুন — গুণ (`n * ...`) ঘটে **ফেরার পথে**, যাওয়ার পথে নয়। তাই প্রতিটি frame কে অপেক্ষা করতে হয় এবং `n` ধরে রাখতে হয়।",
    },
    { type: "h3", text: "Stack Overflow" },
    {
      type: "p",
      text: "Call stack এর আকার সীমিত (engine ও environment ভেদে আলাদা, সাধারণভাবে হাজার থেকে কয়েক হাজার frame)। Base case ছাড়া বা অতি গভীর recursion এ সীমা পেরোলে engine `RangeError` ছোড়ে — এটিই stack overflow। এর সঠিক সীমা বা message লেখা প্রতিটি engine এ আলাদা হতে পারে, তাই সংখ্যার ওপর নির্ভর করে কোড লিখবেন না; শুধু `err.name` (`RangeError`) দিয়ে ধরুন।",
    },
    {
      type: "callout",
      tone: "danger",
      title: "Stack overflow এড়ানোর ঝুঁকি ও করণীয়",
      text: "ব্যবহারকারীর দেওয়া data (যেমন deeply nested JSON) এর ওপর অনিয়ন্ত্রিত recursion চালালে আক্রমণকারী ইচ্ছাকৃতভাবে অতি-গভীর structure পাঠিয়ে আপনার server বা tab কে crash করাতে পারে। Input এর depth সীমিত করুন (depth counter), অথবা explicit stack/queue দিয়ে iterative সমাধান লিখুন। ES2015 এ proper tail call (PTC) এর কথা spec এ আছে, কিন্তু বাস্তবে প্রধান engine গুলোতে এটি নিশ্চিতভাবে পাওয়া যায় না (সাধারণভাবে শুধু Safari/JavaScriptCore এ আছে) — তাই tail position এ লিখলেই stack overflow থেকে রেহাই পাবেন, এমন ধরে নেবেন না।",
    },
    { type: "h3", text: "Recursion বনাম Iteration" },
    {
      type: "compare",
      headers: ["দিক", "Recursion", "Iteration (loop)"],
      rows: [
        ["Memory", "প্রতি call এ একটি frame; depth এর সমানুপাতিক stack ব্যবহার", "সাধারণত ধ্রুবক (O(1)) বাড়তি memory"],
        ["গভীরতার সীমা", "Stack সীমায় আটকায় (`RangeError`)", "প্রায় সীমাহীন (heap/সময় পর্যন্ত)"],
        ["স্পষ্টতা", "Tree, nested data, ‘ভাগ করে জয়’ সমস্যায় অনেক পরিষ্কার", "সরল গণনা ও সমান্তরাল ধাপে পরিষ্কার"],
        ["গতি", "Call overhead আছে; সাধারণত একটু ধীর", "সাধারণত দ্রুত"],
        ["Debug", "Stack trace এ অনেক frame", "সরল"],
      ],
    },
    {
      type: "p",
      text: "নিয়ম: সমস্যার গঠন নিজেই **স্বয়ংসম্পূর্ণ ছোট সমস্যায় ভাঙে** (tree, nested array, directory, expression parser) — recursion ব্যবহার করুন। সমস্যা শুধু ‘n বার পুনরাবৃত্তি’ — loop ব্যবহার করুন (Loops lesson দেখুন)। আর depth অজানা বা বিশাল হলে explicit stack সহ loop।",
    },
    { type: "h3", text: "Naive recursion এ duplicate কাজ ও Memoization" },
    {
      type: "p",
      text: "`fib(n) = fib(n-1) + fib(n-2)` সরলভাবে লিখলে একই `fib(k)` বারবার হিসাব হয় — call সংখ্যা প্রায় সূচকীয় (exponential) হারে বাড়ে। **Memoization** হলো আগে হিসাব করা ফল একটি `Map` এ রেখে দেওয়া, যাতে একই argument এ দ্বিতীয়বার আর হিসাব করতে না হয়। এটি closure এর একটি চমৎকার ব্যবহার — cache টি function এর ‘ব্যক্তিগত’ state (Closures lesson এ দেখেছি)। Memoization শুধু **pure function** এ নিরাপদ (Pure Functions lesson দেখুন), কারণ একই input এ একই output না হলে cache ভুল ফল দেবে।",
    },
    { type: "h3", text: "Nested data এর ওপর recursion" },
    {
      type: "p",
      text: "Recursion এর সবচেয়ে বাস্তব ব্যবহার এখানে: যে data এর গভীরতা আগে থেকে জানা নেই। ফাইল-ফোল্ডার tree, comment thread (reply এর reply), menu এর submenu, React এর component tree, JSON — সবই ‘নিজের মতো ছোট অংশ ধারণকারী’ গঠন। **Deep flatten**, **directory size**, **deep clone** (প্রতিটি nested object এ নিজেকে ডেকে copy), **JSON.stringify এর মতো serializer** সবই একই প্যাটার্ন: ‘এই node টি leaf কি? হলে সরাসরি উত্তর। নইলে প্রতিটি child এ নিজেকে ডেকে ফল জোড়ো।’ (Deep clone এ circular reference থাকলে সাধারণ recursion অনন্তকাল চলে — `structuredClone` এই সমস্যা সামলায়।)",
    },
    { type: "h3", text: "Accumulator pattern" },
    {
      type: "p",
      text: "‘ফেরার পথে’ জোড়া লাগানোর বদলে **এগোনোর পথেই** partial ফল একটি extra parameter (**accumulator**) এ বহন করা যায়: `sum(n, acc = 0)` → `sum(n - 1, acc + n)`। Base case এ `acc` ই চূড়ান্ত উত্তর। এতে recursive call টি function এর শেষ কাজ হয় (**tail position**) — তাত্ত্বিকভাবে frame অপেক্ষা না করেই ছেড়ে দেওয়া যায়। কিন্তু উপরে বলা হয়েছে, বেশিরভাগ engine এ এই optimization পাওয়া যায় না — তাই accumulator pattern এর আসল সুবিধা প্রায়ই **পরিষ্কার state বহন** ও **trampoline/loop এ রূপান্তর সহজ** হওয়া।",
    },
    { type: "h3", text: "Mutual recursion ও Trampoline" },
    {
      type: "p",
      text: "**Mutual recursion** এ দুটি (বা বেশি) function একে অপরকে ডাকে: `isEven(n)` ডাকে `isOdd(n - 1)`, আর `isOdd(n)` ডাকে `isEven(n - 1)`। Parser (expression ↔ term ↔ factor) ও state machine এ এটি স্বাভাবিক। **Trampoline** হলো stack overflow এড়ানোর কৌশল: recursive function নিজেকে সরাসরি না ডেকে ‘পরের ধাপের জন্য একটি thunk (অসম্পূর্ণ কাজ)’ ফেরত দেয়, আর একটি বাইরের `while` loop সেই thunk গুলো একটার পর একটা চালায় — ফলে stack সবসময় সমতল থাকে। এটি এক ধরনের কৌশল; দৈনন্দিন কোডে প্রায় লাগে না, তবে ধারণাটি জানা থাকলে ‘কেন loop এ বদলাই’ বুঝবেন।",
    },
    { type: "h3", text: "Recursively ভাবার উপায়" },
    {
      type: "ol",
      items: [
        "**ছোটতম সমস্যাটি কী?** (খালি array, `n === 0`, leaf node) — সেটিই base case।",
        "**একটি ধাপ ছোট করলে সমস্যাটি কেমন দেখায়?** (`n - 1`, `arr.slice(1)`, প্রতিটি child)।",
        "**Recursive call কে বিশ্বাস করুন** — ধরে নিন `solve(smaller)` সঠিক উত্তর দেবে। ভেতরে কীভাবে দেবে তা মাথায় সম্পূর্ণ simulate করবেন না।",
        "**ছোট সমস্যার উত্তর থেকে বড় সমস্যার উত্তর বানান** (`n * factorial(n - 1)`)।",
        "Progress নিশ্চিত করুন: প্রতি call এ input কি সত্যিই base case এর দিকে এগোচ্ছে?",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "সাধারণ ভুল ধারণা",
      text: "(১) ‘Recursion সবসময় loop এর চেয়ে ভালো/স্মার্ট’ — না; অনেক ক্ষেত্রে loop ছোট, দ্রুত ও নিরাপদ। (২) ‘Tail recursion লিখলেই stack overflow হবে না’ — JavaScript এ নিশ্চিত নয়, উপরে দেখুন। (৩) ‘Recursive call এর ভেতরে আগের `n` হারিয়ে যায়’ — না, প্রতিটি call এর frame এ নিজস্ব `n` থাকে; এ কারণেই ফেরার সময় `n * ...` কাজ করে। (৪) ‘Memoization সব recursion কে দ্রুত করে’ — শুধু যেখানে overlapping subproblem আছে (যেমন fib); যেখানে প্রতিটি call এর argument আলাদা (যেমন tree traversal) সেখানে cache এর কোনো লাভ নেই।",
    },
    {
      type: "callout",
      tone: "warn",
      title: "কখন recursion এড়াবেন",
      text: "যে data এর depth ব্যবহারকারী নিয়ন্ত্রণ করে, বা যেখানে হাজার-লক্ষ ধাপ লাগতে পারে (যেমন লিংকড লিস্টের ১ লক্ষ node), সেখানে loop অথবা explicit stack ব্যবহার করুন। Data structure ও algorithm ভিত্তিক গভীর recursion (backtracking, divide and conquer, DP) পরবর্তী DSA module এ (Module 13) আলাদাভাবে আসছে; এই lesson এ আমরা শুধু language এর দিকটি দেখছি।",
    },
    {
      type: "callout",
      tone: "tip",
      title: "React এর সাথে সংযোগ",
      text: "একটি `<TreeNode>` component যখন নিজের child এর জন্য আবার `<TreeNode>` render করে, সেটিই recursion — base case হলো ‘children নেই’। Comment thread, file explorer, nested menu এভাবেই বানানো হয়। এখানেও গভীরতা সীমিত রাখা ও key ঠিকমতো দেওয়া জরুরি।",
    },
  ],

  analogy: [
    {
      type: "p",
      text: "রাশিয়ান **ম্যাত্রিওশকা পুতুল** ভাবুন — একটি বড় কাঠের পুতুল খুললে ভেতরে একটু ছোট পুতুল, তার ভেতরে আরও ছোট, এভাবে চলতে থাকে, শেষে একটি ছোট্ট নিরেট পুতুল যাকে আর খোলা যায় না। ধরুন আপনার কাজ ‘মোট কয়টি পুতুল আছে’ গুনে বলা।",
    },
    {
      type: "ul",
      items: [
        "**পুতুল খোলা ও ভেতরে তাকানো** = recursive call। প্রতিবার আপনি একই কাজ করছেন (‘একটি পুতুল ধরো, খুলে ভেতরেরটাকে একই কাজ দাও’), শুধু পুতুলটি ছোট।",
        "**সবচেয়ে ছোট নিরেট পুতুল** = base case। এটি খোলা যায় না, তাই সরাসরি বলা যায় ‘এখানে ১টি’।",
        "**খোলা অবস্থায় টেবিলে সারি করে রাখা অর্ধেক-খোলা পুতুলগুলো** = call stack এর frame। প্রতিটি পুতুল ‘অপেক্ষা করছে’ ভেতরের গোনা শেষ হওয়ার জন্য, এবং তার নিজস্ব তথ্য (কোনটি কত নম্বর) ধরে রেখেছে।",
        "**ভেতরের গোনা ফেরত আসা** = unwinding। সবচেয়ে ছোটটি বলে ‘১’, তার ওপরেরটি বলে ‘১ + ১ = ২’, তার ওপরেরটি ‘৩’ … বাইরের পুতুল পর্যন্ত।",
        "**টেবিলে জায়গা শেষ হয়ে যাওয়া** = stack overflow। যদি পুতুলের কোনো শেষ না থাকে (base case নেই), টেবিল একসময় ভরে যাবে।",
        "**‘আমি আগে একবার ৫ নম্বর পুতুলের গোনা করেছি, খাতায় লেখা আছে’** = memoization।",
      ],
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "factorial(3): Call Stack এ frame জমা ও খুলে যাওয়া",
      nodes: [
        { id: "code", label: "কোড", sub: "factorial(n)" },
        { id: "stack", label: "Call Stack", sub: "উপরের frame সক্রিয়" },
        { id: "ret", label: "Return মান" },
      ],
      steps: [
        {
          active: ["code", "stack"],
          items: {
            code: ["factorial(n) {", "  if (n === 0) return 1;", "  return n * factorial(n - 1);", "}"],
            stack: ["factorial(3)  [n=3]", "main()"],
          },
          note: "`factorial(3)` ডাকা হলো। Stack এ নতুন frame (`n = 3`)। `n !== 0`, তাই function `3 * factorial(2)` হিসাব করতে নিজেকে ডাকবে — কিন্তু গুণটি এখনো বাকি, frame টি অপেক্ষায়।",
        },
        {
          active: ["stack"],
          items: {
            stack: ["factorial(2)  [n=2]", "factorial(3)  [n=3, অপেক্ষায়]", "main()"],
          },
          note: "Building phase: `factorial(2)` এর নতুন frame উপরে বসল। নিচের frame এর `n = 3` অক্ষত — প্রতিটি frame এর নিজস্ব `n`।",
        },
        {
          active: ["stack"],
          items: {
            stack: ["factorial(1)  [n=1]", "factorial(2)  [n=2, অপেক্ষায়]", "factorial(3)  [n=3, অপেক্ষায়]", "main()"],
          },
          note: "আরও একটি frame। Stack এখন ৩টি factorial frame ধরে আছে (সাথে `main`)। কোনো গুণ এখনো হয়নি।",
        },
        {
          active: ["stack"],
          items: {
            stack: ["factorial(0)  [n=0]  ← base case", "factorial(1)  [n=1, অপেক্ষায়]", "factorial(2)  [n=2, অপেক্ষায়]", "factorial(3)  [n=3, অপেক্ষায়]", "main()"],
          },
          note: "`n === 0` — base case! এই frame আর নিজেকে ডাকে না, সরাসরি `1` ফেরত দেবে। Stack এখন সবচেয়ে গভীরে।",
        },
        {
          active: ["stack", "ret"],
          items: {
            stack: ["factorial(1)  [n=1] ← 1 পেল → 1 * 1", "factorial(2)  [n=2, অপেক্ষায়]", "factorial(3)  [n=3, অপেক্ষায়]", "main()"],
            ret: ["factorial(0) → 1"],
          },
          note: "Unwinding শুরু: `factorial(0)` এর frame সরে গেল, `1` ফেরত গেল। `factorial(1)` এখন `1 * 1 = 1` হিসাব করে ফেরত দেবে।",
        },
        {
          active: ["stack", "ret"],
          items: {
            stack: ["factorial(2)  [n=2] ← 1 পেল → 2 * 1", "factorial(3)  [n=3, অপেক্ষায়]", "main()"],
            ret: ["factorial(0) → 1", "factorial(1) → 1"],
          },
          note: "`factorial(1)` এর frame ও সরে গেল। `factorial(2)` পেল `1`, হিসাব করল `2 * 1 = 2`।",
        },
        {
          active: ["ret"],
          items: {
            stack: ["main()  ← 6 পেল"],
            ret: ["factorial(0) → 1", "factorial(1) → 1", "factorial(2) → 2", "factorial(3) → 6"],
          },
          note: "`factorial(3)` পেল `2`, হিসাব করল `3 * 2 = 6`। সব factorial frame সরে গেছে, stack আগের অবস্থায় ফিরেছে। উত্তর `6`।",
          output: "6",
        },
      ],
      caption: "গুণ ঘটে ফেরার পথে — তাই প্রতিটি frame কে `n` মনে রেখে অপেক্ষা করতে হয়।",
    },
    {
      kind: "flow-steps",
      title: "Naive fib(4): একই কাজ বারবার, তারপর memoization",
      nodes: [
        { id: "tree", label: "Call tree", sub: "naive fib" },
        { id: "cache", label: "Memo cache", sub: "Map" },
        { id: "count", label: "মোট call" },
      ],
      steps: [
        {
          active: ["tree"],
          items: {
            tree: ["fib(4)", "├─ fib(3)", "│   ├─ fib(2)", "│   │   ├─ fib(1)", "│   │   └─ fib(0)", "│   └─ fib(1)", "└─ fib(2)", "    ├─ fib(1)", "    └─ fib(0)"],
            count: ["9 টি call (fib(4) এর জন্য)"],
          },
          note: "Naive `fib(4)` এর পুরো call tree। মনোযোগ দিন: `fib(2)` দুইবার হিসাব হয়েছে (একবার `fib(3)` এর ভেতরে, একবার সরাসরি)। `fib(1)` তিনবার।",
        },
        {
          active: ["tree", "count"],
          items: {
            tree: ["fib(2) → 2 বার", "fib(1) → 3 বার", "fib(0) → 2 বার", "অথচ প্রতিবার ফল একই!"],
            count: ["n বাড়লে call সংখ্যা প্রায় সূচকীয় হারে বাড়ে"],
          },
          note: "এটিই **overlapping subproblems**। `n = 4` এ ক্ষতি ছোট, কিন্তু `n = 30` এ লক্ষ লক্ষ অপ্রয়োজনীয় call। ফল একই হলে আবার হিসাব করা অপচয়।",
        },
        {
          active: ["cache"],
          items: {
            cache: ["(খালি) fib(4) শুরু"],
            tree: ["fib(4) → fib(3) → fib(2) → fib(1), fib(0)"],
          },
          note: "Memoized সংস্করণে প্রথমে ঠিক একই গভীরে নামি, কিন্তু প্রতিটি ফল ফেরার সময় `Map` এ রাখি।",
        },
        {
          active: ["cache"],
          items: {
            cache: ["1 → 1", "0 → 0", "2 → 1", "3 → 2"],
            tree: ["fib(2) এখন cache এ আছে"],
          },
          note: "`fib(3)` ফিরে আসার পর `fib(2)` এর ফল cache এ। এখন `fib(4)` এর দ্বিতীয় অংশ `fib(2)` ডাকলে আর নিচে নামতে হবে না — cache থেকে সরাসরি পাওয়া যাবে।",
        },
        {
          active: ["cache", "count"],
          items: {
            cache: ["1 → 1", "0 → 0", "2 → 1", "3 → 2", "4 → 3"],
            count: ["প্রতিটি আলাদা n এর জন্য হিসাব মাত্র একবার → n এর সমানুপাতিক কাজ"],
          },
          note: "প্রতিটি `fib(k)` এর আসল হিসাব এখন ঠিক একবার। সময় সূচকীয় থেকে প্রায় রৈখিক (linear) এ নামল — তবে বদলে cache এ কিছু memory লাগে।",
        },
      ],
      caption: "Call tree এ একই node বারবার দেখা গেলে memoization এর প্রার্থী।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "Factorial, countdown ও array এর যোগফল",
      description: "তিনটি ক্লাসিক recursion — প্রতিটিতে base case ও progress চিহ্নিত করুন।",
      code: `function factorial(n) {
  if (n === 0) return 1;          // base case
  return n * factorial(n - 1);    // recursive case: n ছোট হচ্ছে
}

function countdown(n) {
  if (n === 0) {                  // base case
    console.log("Go!");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

function sum(arr) {
  if (arr.length === 0) return 0; // খালি array → 0
  const [first, ...rest] = arr;
  return first + sum(rest);       // একটি element + বাকিটার যোগফল
}

console.log(factorial(5));
countdown(3);
console.log(sum([1, 2, 3, 4]));`,
    },
    {
      level: "intermediate",
      title: "Naive fib বনাম memoized fib (call গোনা সহ)",
      description: "দুটি সংস্করণে কয়টি call হলো গুনে দেখুন। Memoization এ cache `Map` টি closure এর ভেতর থাকে।",
      code: `let naiveCalls = 0;
function fibNaive(n) {
  naiveCalls++;
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

function makeMemoFib() {
  const cache = new Map();
  let calls = 0;
  function fib(n) {
    calls++;
    if (n < 2) return n;
    if (cache.has(n)) return cache.get(n);
    const value = fib(n - 1) + fib(n - 2);
    cache.set(n, value);
    return value;
  }
  return { fib, getCalls: () => calls };
}

console.log("naive fib(15):", fibNaive(15), "calls:", naiveCalls);

const memo = makeMemoFib();
console.log("memo  fib(15):", memo.fib(15), "calls:", memo.getCalls());
console.log("memo  fib(50):", memo.fib(50)); // naive হলে অসম্ভব ধীর হতো`,
    },
    {
      level: "real-world",
      title: "Directory tree: মোট সাইজ, path তালিকা ও pretty print",
      description: "ফাইল-ফোল্ডার এর মতো nested data তে depth অজানা — recursion স্বাভাবিক পছন্দ। তিনটি আলাদা কাজ একই প্যাটার্নে: leaf হলে সরাসরি উত্তর, নইলে child গুলোতে নিজেকে ডাকো।",
      code: `const tree = {
  name: "src",
  children: [
    { name: "index.js", size: 120 },
    {
      name: "components",
      children: [
        { name: "Button.jsx", size: 300 },
        { name: "Card.jsx", size: 450 },
        { name: "icons", children: [{ name: "logo.svg", size: 80 }] },
      ],
    },
    { name: "utils", children: [] },
  ],
};

function totalSize(node) {
  if (!node.children) return node.size; // leaf (ফাইল)
  return node.children.reduce((sum, child) => sum + totalSize(child), 0);
}

function listFiles(node, prefix = "") {
  const path = prefix ? prefix + "/" + node.name : node.name;
  if (!node.children) return [path];
  return node.children.flatMap((child) => listFiles(child, path));
}

function print(node, depth = 0) {
  console.log("  ".repeat(depth) + (node.children ? node.name + "/" : node.name));
  for (const child of node.children ?? []) print(child, depth + 1);
}

console.log("Total size:", totalSize(tree));
console.log(listFiles(tree));
print(tree);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}
console.log(power(2, 10));
`,
    },
    {
      label: "Stack overflow ধরা (শুধু err.name)",
      code: `// base case নেই — অনন্ত recursion
function forever(n) {
  return forever(n + 1) + 1;
}

try {
  forever(0);
} catch (err) {
  // message বা stack engine ভেদে আলাদা — শুধু name নির্ভরযোগ্য
  console.log(err.name);
  console.log(err instanceof RangeError);
}

// stack overflow এর পরেও প্রোগ্রাম স্বাভাবিক চলে
console.log("এখনো বেঁচে আছি");`,
    },
    {
      label: "Mutual recursion: isEven / isOdd",
      code: `function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}
function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}

console.log(isEven(10), isOdd(10));
console.log(isEven(7), isOdd(7));`,
    },
    {
      label: "Accumulator pattern",
      code: `// ফেরার পথে জোড়া নয়, এগোনোর পথেই acc এ জমা
function sumTo(n, acc = 0) {
  if (n === 0) return acc;
  return sumTo(n - 1, acc + n);
}
console.log(sumTo(5));

// accumulator দিয়ে reverse
function reverse(str, acc = "") {
  if (str === "") return acc;
  return reverse(str.slice(1), str[0] + acc);
}
console.log(reverse("recursion"));`,
    },
    {
      label: "Trampoline: stack ছাড়া গভীর recursion",
      code: `// নিজেকে না ডেকে "পরের ধাপের thunk" ফেরত দেয়
function sumToT(n, acc = 0) {
  if (n === 0) return acc;
  return () => sumToT(n - 1, acc + n);
}

function trampoline(fn) {
  return (...args) => {
    let result = fn(...args);
    while (typeof result === "function") {
      result = result(); // stack বাড়ে না, loop চলে
    }
    return result;
  };
}

const safeSum = trampoline(sumToT);
console.log(safeSum(100000));

// তুলনা: সরাসরি recursion
function sumDirect(n) {
  return n === 0 ? 0 : n + sumDirect(n - 1);
}
try {
  sumDirect(1000000);
} catch (err) {
  console.log("direct:", err.name);
}`,
    },
    {
      label: "Deep flatten ও depth গণনা",
      code: `function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item));
    else out.push(item);
  }
  return out;
}

function depth(value) {
  if (!Array.isArray(value)) return 0;
  return 1 + Math.max(0, ...value.map(depth));
}

const nested = [1, [2, [3, [4]], 5], 6];
console.log(flatten(nested));
console.log(depth(nested));
console.log(nested.flat(Infinity)); // বিল্ট-ইন সমাধান`,
    },
  ],

  debugging: [
    {
      title: "Base case নেই: অনন্ত recursion (depth guard সহ নিরাপদ ডেমো)",
      bad: `let depth = 0;
function countdown(n) {
  depth++;
  if (depth > 50) throw new Error("depth guard: base case নেই!");
  console.log(n);
  countdown(n - 1); // n কখনো থামার শর্ত পায় না
}
countdown(3);`,
      why: "Function এ `n === 0` এর মতো কোনো base case নেই, তাই `n` নেমে যায় `-1, -2, …` অনন্তকাল। সাধারণ ক্ষেত্রে এটি `RangeError` (stack overflow) ঘটাত; এখানে আমরা নিরাপদে ধরার জন্য একটি depth counter রেখেছি। বাস্তবে depth counter ডিবাগের সময় খুব কাজের — অনন্ত লুপে tab hang করানোর বদলে স্পষ্ট error পাবেন।",
      fix: `function countdown(n) {
  if (n < 0) return;      // base case যোগ করা হলো
  console.log(n);
  countdown(n - 1);
}
countdown(3);`,
    },
    {
      title: "ভুল দিকে progress: base case এ কখনো পৌঁছায় না",
      bad: `let calls = 0;
function sumTo(n) {
  calls++;
  if (calls > 100) throw new Error("depth guard: base case এ পৌঁছাচ্ছে না");
  if (n === 0) return 0;
  return n + sumTo(n + 1); // ভুল: n বাড়ছে, কমছে না
}
console.log(sumTo(3));`,
      why: "Base case আছে (`n === 0`), কিন্তু recursive call এ `n - 1` এর বদলে `n + 1` লেখা হয়েছে — input base case থেকে **দূরে** যাচ্ছে। Base case থাকাই যথেষ্ট নয়; প্রতিটি call এ input অবশ্যই base case এর দিকে এগোতে হবে। `sumTo(-1)` এর মতো ঋণাত্মক input এর জন্যও `n <= 0` ধরনের শর্ত ভাবুন।",
      fix: `function sumTo(n) {
  if (n <= 0) return 0;     // ঋণাত্মক input এও নিরাপদ
  return n + sumTo(n - 1);  // সঠিক দিকে progress
}
console.log(sumTo(3));`,
    },
    {
      title: "Recursive call এর ফল return করতে ভোলা",
      bad: `function sum(arr) {
  if (arr.length === 0) return 0;
  const [first, ...rest] = arr;
  first + sum(rest);   // ফল ফেলে দেওয়া হচ্ছে — return নেই!
}
console.log(sum([1, 2, 3]));`,
      why: "`first + sum(rest)` হিসাব হচ্ছে ঠিকই, কিন্তু কোনো `return` নেই, তাই function `undefined` ফেরত দেয়। ফলে প্রতিটি স্তরে ওপরের frame `undefined` পায় এবং চূড়ান্ত ফলও `undefined`। Recursion এ ‘ফল ওপরে পাঠানো’ প্রতিটি স্তরের দায়িত্ব — প্রতিটি রাস্তা (branch) অবশ্যই `return` করবে।",
      fix: `function sum(arr) {
  if (arr.length === 0) return 0;
  const [first, ...rest] = arr;
  return first + sum(rest);
}
console.log(sum([1, 2, 3]));`,
    },
    {
      title: "Shared mutable state: বাইরের array এ ফল জমে থাকা",
      bad: `const found = [];           // global shared state
function collectEven(arr) {
  for (const x of arr) {
    if (Array.isArray(x)) collectEven(x);
    else if (x % 2 === 0) found.push(x);
  }
  return found;
}
console.log(collectEven([1, [2, 3], 4]));
console.log(collectEven([[6], 8]));  // আগের ফল জমে থাকে`,
      why: "`found` function এর বাইরে থাকায় প্রতিবার ডাকলে আগের call এর ফল জমে থাকে — দ্বিতীয় call এ `[2, 4, 6, 8]` আসে, যদিও শুধু `[6, 8]` চাওয়া হয়েছিল। Recursive function কে যথাসম্ভব **pure** রাখুন: ফল return করুন এবং ওপরে জোড়া লাগান।",
      fix: `function collectEven(arr) {
  return arr.flatMap((x) =>
    Array.isArray(x) ? collectEven(x) : x % 2 === 0 ? [x] : []
  );
}
console.log(collectEven([1, [2, 3], 4]));
console.log(collectEven([[6], 8]));`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "1 থেকে n এর যোগফল",
      prompt: "`sumTo(n)` recursion দিয়ে লিখুন (loop নয়): `sumTo(4)` এর উত্তর `10`। Base case `n === 0`।",
      starter: `function sumTo(n) {
  // TODO: base case ও recursive case
}

console.log(sumTo(4));`,
      expected: "10",
      hints: ["Base case: `n === 0` হলে `0`।", "Recursive case: `n + sumTo(n - 1)`।"],
      solution: `function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}

console.log(sumTo(4));`,
      explanation: "`sumTo(4) = 4 + sumTo(3) = 4 + 3 + sumTo(2) = … = 4 + 3 + 2 + 1 + 0 = 10`। প্রতি call এ `n` এক কমে, তাই base case এ পৌঁছায়।",
    },
    {
      level: "beginner",
      title: "power(base, exp)",
      prompt: "`power(2, 5)` কে `**` ছাড়া, recursion দিয়ে হিসাব করুন। `base^0 = 1`।",
      starter: `function power(base, exp) {
  // TODO
}

console.log(power(2, 5));`,
      expected: "32",
      hints: ["`exp === 0` হলে `1`।", "`base * power(base, exp - 1)`।"],
      solution: `function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}

console.log(power(2, 5));`,
      explanation: "প্রতিবার `exp` এক কমে এবং একটি `base` গুণ হয়; `exp` শূন্য হলে থামে।",
    },
    {
      level: "beginner",
      title: "String উল্টানো",
      prompt: "`reverse(str)` recursion দিয়ে লিখুন: `\"abc\"` থেকে `\"cba\"`। Base case খালি string।",
      starter: `function reverse(str) {
  // TODO
}

console.log(reverse("abc"));`,
      expected: "cba",
      hints: ["`str === \"\"` হলে `\"\"` ফেরত দিন।", "প্রথম অক্ষর বাদে বাকিটা উল্টে শেষে প্রথম অক্ষর বসান: `reverse(str.slice(1)) + str[0]`।"],
      solution: `function reverse(str) {
  if (str === "") return "";
  return reverse(str.slice(1)) + str[0];
}

console.log(reverse("abc"));`,
      explanation: "`reverse(\"abc\") = reverse(\"bc\") + \"a\" = (reverse(\"c\") + \"b\") + \"a\" = \"cba\"`।",
    },
    {
      level: "intermediate",
      title: "Deep flatten (বিল্ট-ইন ছাড়া)",
      prompt: "যেকোনো গভীরতার nested array কে সমতল করুন — `Array.prototype.flat` ব্যবহার করবেন না। Element যদি array হয় তবে recursion।",
      starter: `function flatten(arr) {
  // TODO
}

console.log(flatten([1, [2, [3, [4]], 5]]));`,
      expected: "[ 1, 2, 3, 4, 5 ]",
      hints: ["`Array.isArray(item)` দিয়ে নির্ধারণ করুন item টি array কি না।", "Array হলে `flatten(item)` এর ফল spread করুন; নইলে item নিজেই যোগ করুন।"],
      solution: `function flatten(arr) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item)) out.push(...flatten(item));
    else out.push(item);
  }
  return out;
}

console.log(flatten([1, [2, [3, [4]], 5]]));`,
      explanation: "Base case হলো ‘array নয় এমন element’ (leaf); recursive case হলো ‘nested array’ — সেটিকে ছোট সমস্যা ভেবে নিজেকে ডাকা।",
    },
    {
      level: "intermediate",
      title: "Memoized fibonacci (call গুনে প্রমাণ করুন)",
      prompt: "নিচের `fib(20)` সঠিক উত্তর দেয় কিন্তু `calls` অনেক। `memo` (Map) যোগ করুন যাতে প্রতিটি `n` এর জন্য কাজ একবারই হয় এবং output হয় `6765` ও `39` (call সংখ্যা)। `calls++` লাইনটি function এর একদম শুরুতেই রাখুন।",
      starter: `let calls = 0;
function fib(n) {
  calls++;
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

console.log(fib(20));
console.log(calls);`,
      expected: "6765\n39",
      hints: ["`memo` কে default parameter (`memo = new Map()`) করে প্রতিটি recursive call এ পাঠান।", "`calls++` এর পরে `n < 2` দেখুন, তারপর `memo.has(n)`; হিসাবের পর `memo.set(n, value)`।"],
      solution: `let calls = 0;
function fib(n, memo = new Map()) {
  calls++;
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}

console.log(fib(20));
console.log(calls);`,
      explanation: "Naive সংস্করণে call সংখ্যা ২১৮৯১; memoized এ মাত্র ৩৯ (প্রায় ২n)। প্রতিটি `fib(k)` এর আসল হিসাব একবার, পরে cache hit।",
    },
    {
      level: "challenge",
      title: "Real-world: Comment thread এর মোট reply গণনা ও সর্বোচ্চ depth",
      prompt:
        "একটি discussion thread এ প্রতিটি comment এর `replies` array থাকতে পারে (যেকোনো গভীরতা)। দুটি function লিখুন: `countComments(comments)` — সব স্তর মিলিয়ে মোট comment সংখ্যা; `maxDepth(comments)` — সবচেয়ে গভীর reply এর স্তর (শুধু top-level comment থাকলে `1`, খালি array হলে `0`)। দুটিই recursion দিয়ে, input mutate করবেন না। Output দুই লাইন।",
      starter: `const thread = [
  { id: 1, replies: [
    { id: 2, replies: [{ id: 3, replies: [] }] },
    { id: 4, replies: [] },
  ] },
  { id: 5, replies: [] },
];

function countComments(comments) {
  // TODO
}

function maxDepth(comments) {
  // TODO
}

console.log("count:", countComments(thread));
console.log("depth:", maxDepth(thread));`,
      expected: "count: 5\ndepth: 3",
      hints: [
        "Base case: খালি array এ count `0`, depth `0`।",
        "প্রতিটি comment এর জন্য `1 + countComments(comment.replies)` যোগ করুন (`reduce` ব্যবহার করতে পারেন)।",
        "Depth এর জন্য: `1 + maxDepth(comment.replies)` গুলোর মধ্যে সর্বোচ্চটি; খালি হলে `Math.max(0, ...)` এর মতো সুরক্ষা রাখুন।",
      ],
      solution: `const thread = [
  { id: 1, replies: [
    { id: 2, replies: [{ id: 3, replies: [] }] },
    { id: 4, replies: [] },
  ] },
  { id: 5, replies: [] },
];

function countComments(comments) {
  return comments.reduce((total, c) => total + 1 + countComments(c.replies), 0);
}

function maxDepth(comments) {
  if (comments.length === 0) return 0;
  return 1 + Math.max(...comments.map((c) => maxDepth(c.replies)));
}

console.log("count:", countComments(thread));
console.log("depth:", maxDepth(thread));`,
      explanation: "দুটিতেই base case হলো খালি `replies`। Recursive case এ প্রতিটি child কে ছোট সমস্যা হিসেবে নিজেকে ডেকে ফল জোড়া হয় — count এ যোগ, depth এ সর্বোচ্চ + ১। এটি React এ nested `<Comment>` render করার একই কাঠামো।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "একটি recursive function এ **base case** এর কাজ কী?",
        options: [
          "Function কে দ্রুত করা",
          "Recursion থামানো এবং সরাসরি উত্তর দেওয়া",
          "Stack এ নতুন frame বানানো",
          "Input validate করা",
        ],
        answer: 1,
        explanation:
          "Base case এমন অবস্থা যেখানে function নিজেকে আর ডাকে না, সরাসরি উত্তর দেয়। এটি ছাড়া অনন্ত call ও stack overflow। দ্রুত করা বা frame বানানো এর কাজ নয় (frame বানায় প্রতিটি call), আর validation আলাদা দায়িত্ব।",
      },
      {
        question: "`function f(n) { return n === 0 ? 0 : n + f(n + 1); }` এ `f(3)` ডাকলে সম্ভবত কী ঘটবে?",
        options: [
          "`6` ফেরত দেবে",
          "`0` ফেরত দেবে",
          "`RangeError` (stack overflow) — কারণ `n` base case থেকে দূরে যাচ্ছে",
          "SyntaxError",
        ],
        answer: 2,
        explanation:
          "`n` ৩ থেকে ৪, ৫… বাড়ে, কখনো `0` হয় না, তাই stack ভরে `RangeError`। `6` বা `0` পেতে হলে progress সঠিক দিকে (`n - 1`) হতে হত। Syntax এ কোনো ভুল নেই, তাই SyntaxError নয়।",
      },
      {
        question: "নিচের কোনটি naive `fib(n)` ধীর হওয়ার প্রধান কারণ?",
        options: [
          "JavaScript এ recursion সবসময় ধীর",
          "একই `fib(k)` অসংখ্যবার পুনরায় হিসাব হয় (overlapping subproblems)",
          "`+` operator ধীর",
          "Call stack এ খুব কম frame ধরে",
        ],
        answer: 1,
        explanation:
          "Call tree তে একই node বারবার আসে, তাই call সংখ্যা সূচকীয়ভাবে বাড়ে — memoization এ ঠিক এটিই সমাধান হয়। Recursion নিজে ‘সবসময় ধীর’ নয়, `+` ধীর নয়, আর stack এ কম ধরা নয়, বরং বেশি ধরা stack overflow এর কারণ।",
      },
      {
        question: "JavaScript এ tail recursive লিখলে stack overflow সম্পর্কে সবচেয়ে সঠিক বক্তব্য কোনটি?",
        options: [
          "সব engine এ নিশ্চিতভাবে stack overflow হবে না",
          "কখনোই stack overflow হবে না",
          "শুধু Node.js এ হবে না",
          "Tail recursion JavaScript এ নিষিদ্ধ",
        ],
        answer: 0,
        explanation:
          "ES2015 spec এ proper tail call আছে, কিন্তু প্রধান engine গুলোতে সাধারণভাবে এটি পাওয়া যায় না (শুধু কিছু engine এ আছে), তাই এর ওপর নির্ভর করা যায় না। ‘কখনোই হবে না’ বা ‘শুধু Node.js এ হবে না’ ভুল; Tail recursion বৈধ কোড, নিষিদ্ধ নয় — শুধু optimization নিশ্চিত নয়। নিশ্চিত সমাধান হলো loop বা trampoline।",
      },
      {
        question: "নিচের কোনটি recursion এর জন্য সবচেয়ে উপযুক্ত?",
        options: [
          "১ থেকে ১০০০০০ পর্যন্ত যোগফল",
          "যেকোনো গভীরতার nested comment thread এ মোট comment গোনা",
          "একটি array এর প্রতিটি element print করা",
          "Counter বাড়ানো",
        ],
        answer: 1,
        explanation:
          "Nested ও অজানা গভীরতার data এ recursion স্বাভাবিক ও পরিষ্কার। ১ লক্ষ পর্যন্ত যোগফল recursion এ stack overflow এর ঝুঁকিতে, loop ভালো। Array print ও counter সরল iteration এর কাজ।",
      },
    ],
    coding: [
      {
        title: "Palindrome পরীক্ষা (recursion)",
        prompt: "`isPalindrome(str)` recursion দিয়ে লিখুন। প্রথম ও শেষ অক্ষর মিলে কি না দেখুন, তারপর মাঝের অংশে নিজেকে ডাকুন। `\"racecar\"` → `true`, `\"hello\"` → `false`।",
        starter: `function isPalindrome(str) {
  // TODO
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));`,
        expected: "true\nfalse",
        solution: `function isPalindrome(str) {
  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}

console.log(isPalindrome("racecar"));
console.log(isPalindrome("hello"));`,
      },
      {
        title: "Plain JSON deep clone",
        prompt: "`deepClone(value)` লিখুন যা nested object ও array গভীরভাবে copy করে (শুধু plain JSON-ধরনের data: number, string, boolean, null, array, object)। Copy বদলালে মূল data যেন না বদলায়।",
        starter: `function deepClone(value) {
  // TODO
}

const original = { a: 1, list: [1, { b: 2 }] };
const copy = deepClone(original);
copy.list[1].b = 99;
console.log(original.list[1].b);
console.log(copy.list[1].b);
console.log(copy !== original);`,
        expected: "2\n99\ntrue",
        solution: `function deepClone(value) {
  if (value === null || typeof value !== "object") return value; // base case: primitive
  if (Array.isArray(value)) return value.map(deepClone);
  const out = {};
  for (const key of Object.keys(value)) {
    out[key] = deepClone(value[key]);
  }
  return out;
}

const original = { a: 1, list: [1, { b: 2 }] };
const copy = deepClone(original);
copy.list[1].b = 99;
console.log(original.list[1].b);
console.log(copy.list[1].b);
console.log(copy !== original);`,
      },
    ],
  },

  interview: [
    {
      q: "Recursion কী এবং একটি সঠিক recursive function এ কী কী থাকতে হয়?",
      a: "Recursion হলো function এর নিজেকে ডেকে সমস্যাকে ছোট ছোট একই ধরনের সমস্যায় ভাঙা। সঠিক recursive function এ অন্তত দুটি জিনিস লাগে।\n\nপ্রথমত **base case** — যে অবস্থায় function আর নিজেকে ডাকে না; দ্বিতীয়ত **recursive case**, যেখানে input প্রতিবার base case এর দিকে **এগোয়** (progress)। Base case না থাকলে বা progress ভুল দিকে হলে অনন্ত call ও stack overflow।\n\nসাথে বলুন: ‘recursive call কে বিশ্বাস করা’ — অর্থাৎ ছোট সমস্যার উত্তর ঠিক ধরে নিয়ে বড় সমস্যার উত্তর বানানো।",
    },
    {
      q: "Recursive call এ call stack কীভাবে আচরণ করে? Stack overflow কেন হয়?",
      a: "প্রতিটি call এ engine একটি নতুন **stack frame** তৈরি করে — যাতে সেই call এর parameter, local variable ও return এর তথ্য থাকে। Recursion এ base case এ পৌঁছানো পর্যন্ত frame গুলো একটির ওপর একটি জমে (building), তারপর return করতে করতে একে একে সরে (unwinding)।\n\nStack এর আকার সীমিত (engine ও environment ভেদে আলাদা)। Frame এর সংখ্যা সেই সীমা ছাড়ালে `RangeError` ছোড়া হয় — এটিই stack overflow। কারণ সাধারণত base case নেই, ভুল progress, বা বৈধ কিন্তু অতি-গভীর input। Message বা সীমার সংখ্যা engine এর ওপর নির্ভর করে, তাই কোডে সেটির ওপর নির্ভর করা উচিত নয়।",
    },
    {
      q: "JavaScript কি tail call optimization সমর্থন করে? Stack overflow এড়ানোর উপায় কী?",
      a: "ES2015 spec এ proper tail calls (PTC) এর কথা আছে — tail position এ থাকা call এর জন্য নতুন frame না বানিয়ে বর্তমান frame পুনরায় ব্যবহার করা। কিন্তু বাস্তবে প্রধান engine গুলোর মধ্যে সাধারণভাবে শুধু কিছু (যেমন Safari এর JavaScriptCore) এটি বাস্তবায়ন করেছে; V8 (Chrome, Node.js) সাধারণভাবে করে না। তাই এর ওপর নির্ভর করা যায় না।\n\nনির্ভরযোগ্য উপায়: (১) loop এ রূপান্তর, (২) explicit stack/queue ব্যবহার করে iterative traversal, (৩) **trampoline** — function thunk ফেরত দেয়, বাইরের `while` loop সেগুলো চালায়, (৪) input এর depth সীমিত করা ও বড় data কে ভাগ করা।",
    },
    {
      q: "Memoization কী? Naive recursive fibonacci কে কীভাবে উন্নত করবেন, এবং সীমাবদ্ধতা কী?",
      a: "Memoization হলো function এর আগের ফল (argument অনুযায়ী) cache এ রেখে একই argument এ আবার হিসাব না করা। Naive `fib(n)` এ একই `fib(k)` বারবার হিসাব হয় (overlapping subproblems), ফলে call সংখ্যা প্রায় সূচকীয়। একটি `Map` cache যোগ করলে প্রতিটি `n` এর জন্য হিসাব একবারই হয় — সময় প্রায় রৈখিক।\n\nসীমাবদ্ধতা: (১) function কে **pure** হতে হবে, নইলে cache ভুল ফল দেবে। (২) Cache এর জন্য memory লাগে, এবং না সরালে তা বাড়তেই থাকে (memory leak এর ঝুঁকি; `WeakMap` বা সীমিত-আকারের cache ভাবা যায়)। (৩) Argument যদি object হয়, cache key বানানো জটিল। (৪) যেখানে overlapping subproblem নেই (যেমন tree traversal) সেখানে কোনো লাভ নেই। (৫) Memoized recursion এও গভীরতার stack সীমা থাকে।",
    },
    {
      q: "কখন recursion আর কখন iteration ব্যবহার করবেন?",
      a: "Recursion পছন্দ করুন যখন data বা সমস্যা নিজেই **স্বয়ংসম্পূর্ণ ছোট অংশে ভাগ হয়** এবং গভীরতা সীমিত ও অনুমানযোগ্য: tree/nested structure (DOM, file system, comment thread, AST), divide-and-conquer, backtracking। কোড অনেক সময় অনেক পরিষ্কার ও সংক্ষিপ্ত হয়।\n\nIteration পছন্দ করুন যখন কাজ সরল পুনরাবৃত্তি, গভীরতা বিশাল বা user-নিয়ন্ত্রিত, কিংবা performance/memory sensitive — কারণ loop এ প্রতি ধাপে frame বানাতে হয় না এবং stack overflow এর ঝুঁকি নেই। যেকোনো recursion কে explicit stack দিয়ে iterative করা যায়, তবে কোড প্রায়ই জটিল হয়। বাস্তবে সিদ্ধান্ত নেয় স্পষ্টতা বনাম গভীরতার ঝুঁকি।",
    },
    {
      q: "Mutual recursion কী? একটি বাস্তব ব্যবহার বলুন।",
      a: "Mutual (পারস্পরিক) recursion এ দুটি বা বেশি function একে অপরকে ডাকে, কোনোটিই সরাসরি নিজেকে নয়। ক্লাসিক উদাহরণ `isEven(n)` যা `isOdd(n - 1)` ডাকে এবং `isOdd(n)` যা `isEven(n - 1)` ডাকে।\n\nবাস্তব ব্যবহার: recursive descent parser এ `parseExpression` → `parseTerm` → `parseFactor`, আর parenthesis পেলে `parseFactor` আবার `parseExpression` ডাকে; state machine; AST visitor যেখানে বিভিন্ন node type এর handler একে অপরকে ডাকে। নিয়ম একই — প্রতিটি চক্রে অন্তত একটি base case ও সঠিক progress থাকতে হবে, এবং stack সীমা এখানেও প্রযোজ্য।",
    },
  ],

  summary: {
    takeaways: [
      "প্রতিটি recursion এ **base case** ও progress করা **recursive case** — দুটোই লাগে।",
      "Call stack এ প্রতি call এ একটি frame জমে (building), return এ খুলে যায় (unwinding); প্রতিটি frame এর নিজস্ব variable।",
      "Stack সীমিত — অতি গভীর বা base case-হীন recursion এ `RangeError`। JavaScript এ tail call optimization নিশ্চিত নয়।",
      "Naive `fib` এ duplicate কাজ হয়; **memoization** (pure function এ) তা কমায়।",
      "Nested data (tree, JSON, directory, comment thread) এ recursion সবচেয়ে স্বাভাবিক; user-নিয়ন্ত্রিত depth এ সতর্ক থাকুন।",
      "Accumulator, mutual recursion ও trampoline হলো সহায়ক কৌশল; গভীর/বিশাল কাজে loop বা explicit stack নিরাপদ।",
    ],
    syntax: `function solve(input) {
  if (isBase(input)) return baseAnswer;     // base case
  return combine(input, solve(smaller(input))); // recursive case
}

// accumulator
function sum(n, acc = 0) {
  return n === 0 ? acc : sum(n - 1, acc + n);
}

// memoization
function memoFib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const v = memoFib(n - 1, memo) + memoFib(n - 2, memo);
  memo.set(n, v);
  return v;
}`,
    whenToUse: [
      "Tree/nested data যেখানে গভীরতা অজানা (flatten, clone, size, traversal)।",
      "সমস্যা নিজেই ছোট অনুরূপ সমস্যায় ভাঙে (divide and conquer, parser)।",
      "Overlapping subproblem থাকলে memoization সহ।",
      "গভীরতা বিশাল বা user-নিয়ন্ত্রিত হলে recursion নয় — loop/explicit stack।",
    ],
    next: [
      "IIFE — function দিয়ে scope তৈরির পুরোনো ও নতুন ব্যবহার",
      "Closures ও Scope Chain — memoization cache এর ভিত্তি",
      "Module 13: Recursion ও Backtracking (DSA ভিত্তিক গভীর আলোচনা)",
    ],
  },

  compatibility:
    "Recursion ভাষার মৌলিক বৈশিষ্ট্য — সব browser ও Node.js এ কাজ করে। Stack এর সর্বোচ্চ গভীরতা engine, memory সেটিং ও frame এর আকারের ওপর নির্ভর করে (Chrome/Node এর V8, Firefox এর SpiderMonkey, Safari এর JavaScriptCore এ আলাদা), তাই নির্দিষ্ট সংখ্যার ওপর নির্ভর করবেন না। Proper tail calls ES2015 spec এ থাকলেও সাধারণভাবে শুধু Safari এ বাস্তবায়িত; V8 এ নেই। `Map`, `structuredClone`, `Array.prototype.flat` আধুনিক runtime এ উপলব্ধ। এই Playground browser-like Web Worker এ চলে।",
};
