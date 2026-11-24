import type { Lesson } from "@/types/lesson";

export const lesson: Lesson = {
  objectives: [
    "Browser কীভাবে HTML ও CSS থেকে **DOM**, **CSSOM** ও render tree বানিয়ে Layout → Paint → Composite পর্যন্ত যায় — এবং JavaScript এই পাইপলাইনের কোথায় বসে — তা ব্যাখ্যা করতে পারবেন।",
    "`<script>`, `defer`, `async` ও `type=\"module\"` এর আচরণ (parser blocking, execution order) আলাদা করে সঠিক টি বেছে নিতে পারবেন।",
    "DOM কী, কেন এটি ভাষার অংশ নয় বরং browser এর host API, এবং DOM বদলালে কখন Layout/Paint এর খরচ আসে — তা বুঝে layout thrashing এড়াতে পারবেন।",
    "Event এর তিন ধাপ (capture → target → bubble), **event delegation**, `stopPropagation` ও `preventDefault` এর পার্থক্য ব্যবহার করতে পারবেন।",
    "Browser এর নিরাপত্তা-ভিত্তি (same-origin policy, CSP, XSS) বুঝে নিরাপদ DOM কোড লিখতে এবং ভারী কাজ Web Worker এ সরানোর সিদ্ধান্ত নিতে পারবেন।",
  ],

  concept: [
    { type: "h3", text: "Browser কোন কোন অংশ নিয়ে গঠিত?" },
    {
      type: "p",
      text: "Browser শুধু একটি JavaScript engine নয়। এটি একটি বড় অ্যাপ্লিকেশন, যার ভেতরে থাকে: নেটওয়ার্ক স্তর (HTTP, cache), **HTML ও CSS parser**, **layout ও painting ইঞ্জিন**, **JavaScript engine** (Chrome এ V8, Firefox এ SpiderMonkey, Safari এ JavaScriptCore), এবং Web APIs (`document`, `fetch`, `localStorage`, `addEventListener`, `requestAnimationFrame` ইত্যাদি)। আপনার JavaScript এই সবকিছুর একটি অংশ মাত্র — সে engine এ চলে, আর Web APIs এর মাধ্যমে বাকি browser কে নিয়ন্ত্রণ করে।",
    },
    {
      type: "p",
      text: "এই কারণে ‘JavaScript কীভাবে browser এ কাজ করে’ প্রশ্নের উত্তর দুই অংশে ভাগ: (১) **browser পাতাটি কীভাবে বানায়** (rendering pipeline), এবং (২) **JavaScript সেই প্রক্রিয়ায় কখন ও কীভাবে ঢোকে** (script loading, DOM, event)।",
    },
    { type: "h3", text: "পাতা তৈরির ধাপ (Critical Rendering Path)" },
    {
      type: "ol",
      items: [
        "**Network:** URL এর জন্য HTTP request যায়, HTML text ফিরে আসে (stream আকারে — পুরোটা আসার আগেই parsing শুরু হতে পারে)।",
        "**HTML parsing → DOM:** Parser tag গুলোকে tree আকারের object এ রূপ দেয় — একে বলে **DOM (Document Object Model)**। প্রতিটি tag একটি node, text ও একটি node।",
        "**CSS parsing → CSSOM:** CSS (`<link>`, `<style>`) থেকে তৈরি হয় আরেকটি tree — **CSSOM**।",
        "**Style:** DOM ও CSSOM মিলিয়ে ঠিক হয় প্রতিটি দৃশ্যমান element এর computed style কী। (এখান থেকে যা আঁকা হবে তার render tree তৈরি হয়।)",
        "**Layout (reflow):** প্রতিটি element এর আকার ও অবস্থান (কত px, কোথায়) গণনা হয়।",
        "**Paint:** element গুলোকে আঁকার নির্দেশ তৈরি হয় (রং, text, border, ছবি)।",
        "**Composite:** আলাদা layer গুলো জুড়ে স্ক্রিনে দেখানো হয়। `transform` ও `opacity` এর মতো কিছু পরিবর্তন সাধারণত শুধু এই ধাপেই সীমাবদ্ধ থাকতে পারে বলে animation এ সস্তা।",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "JavaScript কোথায় ঢোকে?",
      text: "JavaScript এই পাইপলাইনের প্রায় যেকোনো মুহূর্তে ঢুকে DOM বা style বদলাতে পারে। যখনই বদলায়, browser কে প্রয়োজন অনুযায়ী Style, Layout, Paint আবার চালাতে হয় — তাই DOM এ কাজ করার খরচ আছে। আর এই সব ধাপ ও আপনার JavaScript প্রধানত **একই main thread** এ চলে, তাই ভারী JS মানে পাতা আঁকতে দেরি।",
    },
    { type: "h3", text: "Script কীভাবে load হয় — parser blocking ও defer/async" },
    {
      type: "p",
      text: "HTML parser উপর থেকে নিচে পড়তে পড়তে `<script>` পেলে কী করবে? এটি নির্ভর করে script এর ধরনের ওপর। কারণ script DOM বদলাতে পারে (এমনকি `document.write` দিয়ে HTML ও ঢোকাতে পারে), তাই **classic script** পেলে parser থেমে যায়: script download করে, চালায়, তারপর আবার parsing। এতে পাতা দেখাতে দেরি হয়।",
    },
    {
      type: "compare",
      headers: ["ধরন", "Download", "কখন চলে", "Parser", "ক্রম"],
      rows: [
        ["`<script src>` (classic)", "পেলেই শুরু", "download শেষ হলেই", "**আটকে থাকে**", "document ক্রমে"],
        ["`<script defer src>`", "parsing এর সাথে সমান্তরালে", "parsing শেষে, `DOMContentLoaded` এর আগে", "আটকায় না", "**document ক্রম** মেনে"],
        ["`<script async src>`", "parsing এর সাথে সমান্তরালে", "download শেষ হওয়া মাত্র (parsing এর মাঝেও হতে পারে)", "চলার সময় থামে", "**নিশ্চয়তা নেই** — যেটি আগে নামবে সেটি আগে"],
        ["`<script type=\"module\">`", "সমান্তরালে (import সহ)", "ডিফল্টভাবে defer এর মতো — parsing শেষে", "আটকায় না", "document ক্রম; `async` দিলে async এর মতো"],
      ],
    },
    {
      type: "code",
      caption: "শুধু browser এ — HTML ফাইলে লেখা হয়, এই Playground এ চলবে না",
      code: `<!-- সাধারণ নিয়ম: নিজের app কোড দিতে module বা defer ব্যবহার করুন -->
<script type="module" src="/main.js"></script>

<!-- স্বাধীন, অন্য script এর ওপর নির্ভর করে না (analytics ইত্যাদি) -->
<script async src="/analytics.js"></script>

<!-- পুরোনো ধরনের script যার একটি অন্যটির ওপর নির্ভর করে: ক্রম লাগে → defer -->
<script defer src="/lib.js"></script>
<script defer src="/app.js"></script>`,
    },
    {
      type: "ul",
      items: [
        "**`defer` শুধু external script (`src` আছে এমন) এ কাজ করে**; inline classic script এ এটি প্রভাবহীন।",
        "**Module script** সবসময় strict mode এ চলে, নিজস্ব scope পায় (top-level variable global হয় না) এবং `import`/`export`/top-level `await` সমর্থন করে।",
        "**`DOMContentLoaded`** ফায়ার হয় HTML parsing ও defer/module script চলার পরে (ছবি/stylesheet এর অপেক্ষা না করে); **`load`** ফায়ার হয় ছবি, stylesheet ইত্যাদি সব resource আসার পরে।",
        "Script এর আগে `<link rel=\"stylesheet\">` থাকলে browser সাধারণত সেই CSS আসার অপেক্ষা করে (কারণ script computed style পড়তে পারে) — তাই CSS ও script এর ক্রম পাতার গতিতে প্রভাব ফেলে।",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "ভুল ধারণা: ‘async মানে defer এর চেয়ে ভালো / দ্রুত’",
      text: "দুটি আলাদা উদ্দেশ্যের জন্য। `async` script যেকোনো সময় চলতে পারে — এমনকি HTML parsing এর মাঝখানে — এবং ক্রমের নিশ্চয়তা দেয় না। তাই যে script DOM এ element খোঁজে বা অন্য script এর ওপর নির্ভর করে, সেখানে `async` ভাঙা কোড তৈরি করতে পারে (পরীক্ষায় কাজ করবে, ধীর network এ ভাঙবে)। নিজের app এর জন্য `type=\"module\"` বা `defer` ই সাধারণত নিরাপদ পছন্দ।",
    },
    { type: "h3", text: "DOM — HTML এর ‘জীবন্ত’ রূপ" },
    {
      type: "p",
      text: "DOM হলো HTML document কে একটি **tree এর object model** হিসেবে প্রকাশ করার API। `<h1>Hi</h1>` এর জন্য browser একটি `HTMLHeadingElement` object বানায়, যার properties (`textContent`, `className`, `style`) ও methods (`addEventListener`, `append`) আছে। JavaScript এই object গুলোর মাধ্যমেই পাতা পড়ে ও বদলায়। মনে রাখুন: **DOM ECMAScript এর অংশ নয়** — এটি `document` এর মাধ্যমে browser host এর দেওয়া API, তাই Node.js বা Web Worker এ নেই।",
    },
    {
      type: "p",
      text: "DOM আর ‘HTML source’ এক জিনিস নয়। Parser ভুল HTML ঠিক করে নেয় (যেমন বন্ধ না করা tag), আর JavaScript চালানোর পর DOM মূল HTML ফাইল থেকে আলাদা হয়ে যেতে পারে। ‘View Source’ দেখায় মূল HTML, আর DevTools এর Elements ট্যাব দেখায় বর্তমান DOM।",
    },
    {
      type: "code",
      caption: "শুধু browser এ (এই Playground এ চলবে না — DOM দরকার)",
      code: `const list = document.querySelector("#todos");

// নতুন element তৈরি — তখনও পাতায় নেই
const li = document.createElement("li");
li.textContent = "JavaScript শেখা"; // নিরাপদ: text হিসেবে বসে

list.append(li); // এখন DOM এ ঢুকলো → browser পরবর্তী rendering এ আঁকবে`,
    },
    {
      type: "callout",
      tone: "warn",
      title: "ভুল ধারণা: ‘DOM বদলালেই সাথে সাথে স্ক্রিনে আঁকা হয়’",
      text: "DOM বদলানো একটি synchronous in-memory পরিবর্তন; পর্দায় আঁকা হয় পরবর্তী rendering সুযোগে — যা আপনার বর্তমান JS কোড (এবং microtask) শেষ হওয়ার পরে আসে। তাই এক task এ ১০০ বার DOM বদলালেও সাধারণত শেষ অবস্থাটিই একবার আঁকা হয়। কিন্তু কিছু property পড়লে (`offsetHeight`, `getBoundingClientRect()` ইত্যাদি) browser কে সাথে সাথে layout চালাতে হতে পারে — লিখে-পড়ে-লিখে-পড়া (**layout thrashing**) তাই ধীর। নিয়ম: আগে সব পড়ুন, পরে সব লিখুন।",
    },
    { type: "h3", text: "Event: user ও browser এর সাথে কথোপকথন" },
    {
      type: "p",
      text: "Click, input, scroll, `DOMContentLoaded` — এগুলো **event**। আপনি `addEventListener` দিয়ে function (listener) নিবন্ধন করেন। Event ঘটলে browser সেই listener কে event loop এর একটি task হিসেবে ডাকে (আগের lesson এর মডেল)। অর্থাৎ listener ধীর হলে সেই সময় UI আটকে থাকে।",
    },
    {
      type: "p",
      text: "Event DOM tree তে তিন ধাপে ভ্রমণ করে: **Capture** (root থেকে target এর দিকে নামা), **Target** (যে element এ ঘটল), **Bubble** (target থেকে উপরে root এর দিকে ওঠা)। ডিফল্টে `addEventListener` bubble ধাপে শোনে; তৃতীয় argument এ `{ capture: true }` দিলে capture ধাপে।",
    },
    {
      type: "code",
      caption: "শুধু browser এ — event delegation (এই Playground এ চলবে না)",
      code: `const list = document.querySelector("#todos");

// প্রতিটি li তে আলাদা listener না দিয়ে parent এ একটি listener
list.addEventListener("click", (event) => {
  const item = event.target.closest("li"); // target = আসলে যেটিতে click পড়েছে
  if (!item || !list.contains(item)) return;
  item.classList.toggle("done");
});
// নতুন করে যোগ হওয়া li ও স্বয়ংক্রিয়ভাবে কাজ করবে`,
    },
    {
      type: "ul",
      items: [
        "**`event.target`** — যে element এ আসলে event ঘটেছে; **`event.currentTarget`** — যে element এ listener বসানো।",
        "**`stopPropagation()`** — event কে আর উপরে/নিচে যেতে দেয় না। **`preventDefault()`** — browser এর ডিফল্ট কাজ (যেমন link এ navigation, form submit) আটকায়। দুটি সম্পূর্ণ আলাদা কাজ।",
        "**Event delegation** — অনেক child এর জন্য একটি parent listener: কম memory, গতিশীল (পরে যোগ হওয়া) element এর জন্যও কাজ করে।",
        "সব event bubble করে না (যেমন `focus`/`blur` করে না; বিকল্প `focusin`/`focusout`) — documentation দেখে নিন।",
      ],
    },
    { type: "h3", text: "Browser এ JavaScript এর সীমা ও Web Worker" },
    {
      type: "p",
      text: "Main thread এ JS, style, layout ও (বেশিরভাগ) painting এর কাজ ভাগ হয়ে চলে। একটি task ~৫০ ms এর বেশি নিলে সেটি ‘long task’ — ব্যবহারকারী আটকে থাকা টের পায়। ভারী গণনা (বড় data প্রসেসিং, ছবি রূপান্তর) **Web Worker** এ সরানো যায়: এটি আলাদা thread ও আলাদা event loop এ চলে, কিন্তু **DOM এ হাত দিতে পারে না**; main thread এর সাথে `postMessage` এ data আদান-প্রদান করে (structured clone এর মাধ্যমে copy হয়)। এই platform এর Playground ও ঠিক এই কারণেই Web Worker এ চলে — তাই সেখানে `document` নেই।",
    },
    {
      type: "compare",
      headers: ["বিষয়", "Browser main thread", "Web Worker", "Node.js"],
      rows: [
        ["DOM / `document`", "আছে", "নেই", "নেই"],
        ["`window`", "আছে", "নেই (`self` আছে)", "নেই (`globalThis` আছে)"],
        ["UI আটকায় কি?", "হ্যাঁ, ভারী কাজে", "না — আলাদা thread", "—"],
        ["`fetch`, timers", "আছে", "আছে", "আছে (আধুনিক সংস্করণে `fetch` ও)"],
        ["File system", "নেই (সীমিত API ছাড়া)", "নেই", "আছে (`node:fs`)"],
      ],
    },
    { type: "h3", text: "Browser এর নিরাপত্তা-ভিত্তি" },
    {
      type: "ul",
      items: [
        "**Same-origin policy:** এক origin (scheme + host + port) এর script ডিফল্টভাবে অন্য origin এর data পড়তে পারে না। সার্ভার **CORS** header দিয়ে নির্দিষ্ট ক্ষেত্রে অনুমতি দিতে পারে — CORS হলো শিথিল করার ব্যবস্থা, নিরাপত্তার মূল ঢাল নয়।",
        "**Sandbox:** page এর JS ব্যবহারকারীর file system বা OS এ সরাসরি যেতে পারে না।",
        "**Content Security Policy (CSP):** সার্ভার header দিয়ে বলতে পারে কোন উৎসের script চলবে — inline script ও `eval` সীমিত বা বন্ধ করা যায়।",
      ],
    },
    {
      type: "code",
      caption: "শুধু browser এ — XSS এর ঝুঁকি (এই Playground এ চলবে না)",
      code: `const comment = '<img src=x onerror="stealCookies()">'; // কোনো user এর লেখা

// বিপজ্জনক: string কে HTML হিসেবে parse করে DOM এ বসায়
box.innerHTML = comment;

// নিরাপদ: string কে text হিসেবে বসায়, HTML হিসেবে নয়
box.textContent = comment;`,
    },
    {
      type: "callout",
      tone: "danger",
      title: "Security note: XSS, তৃতীয়-পক্ষের script ও localStorage",
      text: "**XSS (Cross-Site Scripting):** user এর লেখা string কে `innerHTML`, `outerHTML`, `insertAdjacentHTML` বা `document.write` দিয়ে বসালে আক্রমণকারী নিজের JavaScript চালাতে পারে। (`innerHTML` এ বসানো `<script>` tag চলে না, কিন্তু `<img onerror=...>` এর মতো event attribute চলে — তাই ‘script tag ফিল্টার’ যথেষ্ট নয়।) নিয়ম: user text → `textContent`; HTML সত্যিই লাগলে প্রমাণিত sanitizer (যেমন DOMPurify) বা browser এর Sanitizer API সমর্থন থাকলে সেটি। তাছাড়া তৃতীয়-পক্ষের `<script src>` আপনার page এর পূর্ণ ক্ষমতা পায় — অবিশ্বস্ত উৎস থেকে script লোড করবেন না। `localStorage` এর data যেকোনো XSS script পড়তে পারে, তাই সংবেদনশীল token সেখানে রাখার আগে ঝুঁকি বিবেচনা করুন (প্রায়ই `HttpOnly` cookie নিরাপদ বিকল্প)।",
    },
    { type: "h3", text: "বাস্তব কাজে এই জ্ঞান কখন লাগে" },
    {
      type: "ul",
      items: [
        "পাতা ধীর ‘দেখা’ যাচ্ছে — head এর classic script ও বড় CSS দায়ী কি না ভাবতে (render-blocking)।",
        "`null` পাওয়া: `document.querySelector(...)` `null` দিচ্ছে — script কি element parse হওয়ার আগে চলছে? (`defer`/module দিয়ে সমাধান।)",
        "Scroll/animation জড়তা: layout thrashing, long task, ভুল property animate করা।",
        "ডায়নামিক list এ কাজ: event delegation। নিরাপত্তা review: প্রতিটি `innerHTML` সন্দেহের চোখে।",
      ],
    },
  ],

  analogy: [
    {
      type: "p",
      text: "ধরুন একটি **নির্মাণ-প্রকল্পে বাড়ি তৈরি হচ্ছে** — আর আপনার HTML হলো স্থপতির নকশা, CSS হলো সাজসজ্জার নির্দেশিকা, এবং JavaScript হলো এমন একজন **ঠিকাদার** যিনি কাজ চলাকালীনই নকশা বদলাতে বা নতুন কিছু যোগ করতে পারেন।",
    },
    {
      type: "ul",
      items: [
        "**HTML parser = নকশা পড়া রাজমিস্ত্রি।** ওপর থেকে নিচে নকশা পড়ে কাঠামো (DOM) দাঁড় করান। ঠিকাদারের নোট (`<script>`) পেলে — classic হলে — তিনি কাজ থামিয়ে নোট পড়েন, সেই অনুযায়ী কাজ করেন, তারপর আবার নকশায় ফেরেন। এজন্য ভারী নোট মানে দেরি।",
        "**`defer` = ‘কাঠামো শেষ হলে আমাকে ডাকবেন’।** ঠিকাদার আগেই তাঁর সরঞ্জাম এনে রাখেন (download সমান্তরালে), কিন্তু রাজমিস্ত্রির কাজ শেষ হলে, পাতা দেখানোর আগে, পরপর (ক্রম মেনে) নিজের কাজ করেন। **`async` = ‘আমি যখন তৈরি তখনই ঢুকে পড়ব’** — কখনো মাঝপথে রাজমিস্ত্রিকে থামিয়ে দেন, আর কে আগে আসবে ঠিক নেই।",
        "**DOM = দাঁড়ানো বাড়ির বর্তমান কাঠামো** (আসল দালান), নকশার কাগজ নয়। ঠিকাদার দেয়াল ভেঙে নতুন জানালা বসাতে পারেন — তখন আর নকশার কাগজের সাথে বাড়ি মেলে না (View Source বনাম Elements ট্যাব)।",
        "**Layout/Paint = মাপজোখ ও রং করা।** ঠিকাদার একটি দেয়াল সরালে (layout বদলালে) পুরো ঘরের মাপ নতুন করে নিতে হয় — ব্যয়বহুল। শুধু দেয়ালের রং বদলালে (paint) সস্তা; আর শুধু একটি পর্দা সরালে (transform) সবচেয়ে সস্তা। প্রতিটি ছোট পরিবর্তনের পর ‘এখন মাপ কত?’ জিজ্ঞেস করলে ঠিকাদারকে বারবার মাপতে হয় — এটিই layout thrashing; ভালো অভ্যাস: আগে সব মাপ নিন, তারপর সব পরিবর্তন করুন।",
        "**Event = কলিং-বেল।** বেল বাজলে (click) সংকেতটি প্রথমে বাড়ির বাইরের গেট থেকে নিচে নামে (capture), দরজায় পৌঁছায় (target), তারপর ভেতরের মহল ধরে উপরের দিকে ওঠে (bubble)। প্রত্যেক মহলের দারোয়ান (listener) সংকেত থামাতে পারেন (`stopPropagation`) বা বেল বাজার ডিফল্ট ফল (দরজা খোলা) আটকাতে পারেন (`preventDefault`)।",
        "**Web Worker = দূরের কারখানায় অর্ডার দেওয়া।** ভারী কাজ ঠিকাদার সাইটে করেন না — কারখানায় পাঠান। কারখানার লোক সাইটের দেয়ালে সরাসরি হাত দিতে পারে না (DOM নেই), শুধু চিঠি (`postMessage`) বিনিময় হয়।",
      ],
    },
    {
      type: "p",
      text: "আর **same-origin policy** হলো প্রতিটি বাড়ির নিজস্ব তালা — এক বাড়ির ঠিকাদার অন্য বাড়ির জিনিসপত্র ডিফল্টভাবে ঘেঁটে দেখতে পারেন না; মালিক চাইলে (CORS) নির্দিষ্ট দরজা খুলে দিতে পারেন।",
    },
  ],

  visuals: [
    {
      kind: "flow-steps",
      title: "Rendering pipeline: HTML থেকে পিক্সেল পর্যন্ত",
      nodes: [
        { id: "html", label: "HTML → DOM", sub: "parser" },
        { id: "css", label: "CSS → CSSOM", sub: "stylesheet" },
        { id: "style", label: "Style", sub: "computed style" },
        { id: "layout", label: "Layout", sub: "আকার ও অবস্থান" },
        { id: "paint", label: "Paint + Composite", sub: "আঁকা ও জোড়া" },
      ],
      steps: [
        {
          active: ["html"],
          items: { html: ["<h1>Hi</h1>", "DOM: html > body > h1 > 'Hi'"] },
          note: "HTML আসতে থাকে; parser tag গুলোকে tree আকারের **DOM** এ রূপ দেয়। Network থেকে পুরো HTML আসার আগেই parsing শুরু হতে পারে।",
        },
        {
          active: ["html"],
          items: { html: ["<script src='a.js'>", "classic হলে parser থামে ⏸", "download → চালানো → আবার parse"] },
          note: "Parser একটি classic `<script src>` পেল। Script DOM বদলাতে পারে বলে parser **থেমে** যায়, script আনে ও চালায়। `defer`/`type=\"module\"` হলে এই অপেক্ষা থাকত না।",
        },
        {
          active: ["css"],
          items: { css: ["h1 { color: teal }", "CSSOM: h1 → color: teal"] },
          note: "CSS parse হয়ে তৈরি হয় **CSSOM**। Browser সাধারণত CSS আসা পর্যন্ত পাতা আঁকে না — আর পরের script ও CSS এর অপেক্ষায় আটকাতে পারে।",
        },
        {
          active: ["style"],
          items: { style: ["h1: color teal, font-size 32px", "(DOM + CSSOM মিলিয়ে)"] },
          note: "DOM ও CSSOM মিলিয়ে প্রতিটি দৃশ্যমান element এর **computed style** নির্ধারিত হয়। `display: none` element আঁকার তালিকায় আসে না।",
        },
        {
          active: ["layout"],
          items: { layout: ["h1 → x:8, y:8, w:1024, h:37"] },
          note: "**Layout (reflow):** viewport এর মাপ অনুযায়ী প্রতিটি box এর সঠিক আকার ও অবস্থান গণনা হয়। এটি তুলনামূলক ব্যয়বহুল ধাপ।",
        },
        {
          active: ["paint"],
          items: { paint: ["text আঁকা, রং বসানো", "layer গুলো জোড়া (composite)"] },
          output: "পাতা স্ক্রিনে দেখা গেল",
          note: "**Paint** এ আঁকার নির্দেশ তৈরি হয়, **Composite** এ layer গুলো জুড়ে স্ক্রিনে যায়। এখন ব্যবহারকারী পাতা দেখতে পায়।",
        },
        {
          active: ["style", "layout", "paint"],
          items: { layout: ["JS: el.style.width = '50%'", "→ আবার layout!"] },
          note: "পরে JavaScript `el.style.width` বদলালে Style → Layout → Paint আবার চলে। `transform`/`opacity` বদলালে সাধারণত Layout এড়ানো যায় — তাই animation এ সেগুলো পছন্দ করা হয়।",
        },
      ],
      caption: "JavaScript পাইপলাইনের যেকোনো সময় DOM/style বদলাতে পারে; সেই খরচ কোন ধাপ থেকে ফিরতে হয় তার ওপর নির্ভর করে।",
    },
    {
      kind: "flow-steps",
      title: "Script load: classic বনাম defer বনাম async",
      nodes: [
        { id: "parser", label: "HTML Parser", sub: "DOM তৈরি করে" },
        { id: "net", label: "Network", sub: "script download" },
        { id: "exec", label: "JS Execute", sub: "main thread" },
        { id: "dcl", label: "DOMContentLoaded", sub: "event" },
      ],
      steps: [
        {
          active: ["parser"],
          items: { parser: ["<body>…</body> parse চলছে", "<script …> পেল"] },
          note: "সব ক্ষেত্রেই শুরু একই: parser উপর থেকে পড়তে পড়তে একটি `<script src=\"app.js\">` তে এল। এরপর কী হবে নির্ভর করে attribute এর ওপর।",
        },
        {
          active: ["parser", "net", "exec"],
          items: { parser: ["⏸ থেমে আছে"], net: ["app.js download"], exec: ["app.js চলছে"] },
          note: "**Classic:** parser থামে → download → execute → তারপর parser ফেরে। যতক্ষণ script আসছে, বাকি পাতা তৈরি হচ্ছে না।",
        },
        {
          active: ["parser", "net"],
          items: { parser: ["parse চলছে ✔"], net: ["app.js download (সমান্তরালে)"] },
          note: "**defer:** parser থামে না। Script একই সময়ে download হতে থাকে।",
        },
        {
          active: ["parser", "exec", "dcl"],
          items: { parser: ["parse শেষ ✔"], exec: ["defer script গুলো document ক্রমে চলে"], dcl: ["এরপর ফায়ার হয়"] },
          note: "Parsing শেষ হলে defer script গুলো **document ক্রমে** চলে, তারপর `DOMContentLoaded`। DOM তখন সম্পূর্ণ — `querySelector` নিরাপদ।",
        },
        {
          active: ["net", "exec", "parser"],
          items: { net: ["app.js নামল (parsing চলার সময়)"], exec: ["async: নামামাত্র চলে"], parser: ["⏸ কিছুক্ষণের জন্য"] },
          note: "**async:** parser থামে না, কিন্তু download শেষ হওয়া মাত্র script চলে — প্রায়ই parsing এর মাঝখানে, parser কে সাময়িক থামিয়ে। ক্রমের কোনো নিশ্চয়তা নেই।",
        },
        {
          active: ["parser", "exec"],
          note: "**সিদ্ধান্ত:** DOM বা ক্রমের ওপর নির্ভরশীল app কোডের জন্য `type=\"module\"` বা `defer`। শুধুমাত্র স্বাধীন, কোথাও নির্ভর না করা script (analytics) এর জন্য `async`।",
        },
      ],
      caption: "`type=\"module\"` ডিফল্টে defer এর মতো আচরণ করে।",
    },
  ],

  examples: [
    {
      level: "beginner",
      title: "DOM হলো tree — plain object দিয়ে মডেল",
      description: "আসল DOM এই Playground এ নেই (Web Worker)। কিন্তু DOM এর কাঠামো আসলে একটি tree। এখানে সাধারণ object দিয়ে একটি ছোট tree বানিয়ে recursion দিয়ে ঘুরে দেখছি — ঠিক যেমন browser ও DOM tree traverse করে।",
      code: `const dom = {
  tag: "html",
  children: [
    { tag: "head", children: [{ tag: "title", text: "My page", children: [] }] },
    {
      tag: "body",
      children: [
        { tag: "h1", text: "Hello", children: [] },
        { tag: "ul", children: [
          { tag: "li", text: "One", children: [] },
          { tag: "li", text: "Two", children: [] },
        ] },
      ],
    },
  ],
};

function walk(node, depth = 0) {
  const label = node.text ? node.tag + ' "' + node.text + '"' : node.tag;
  console.log("  ".repeat(depth) + label);
  for (const child of node.children) walk(child, depth + 1);
}

walk(dom);`,
    },
    {
      level: "intermediate",
      title: "Script loading এর সময়-মডেল (সরলীকৃত)",
      description: "পরিসংখ্যান কাল্পনিক ও সরলীকৃত (HTTP cache, parse chunk ইত্যাদি বাদ), কিন্তু classic বনাম defer বনাম async এর মূল তফাৎ — parser কতক্ষণ আটকে থাকল ও DOM কখন প্রস্তুত — পরিষ্কার দেখায়। সংখ্যাগুলো বদলে নিজে পরীক্ষা করুন।",
      code: `// সব সময় ms এ — script টি head এ, parsing শুরুর মুহূর্তে (t=0) পাওয়া গেছে
const parseTotal = 40;   // পুরো HTML parse করতে সময়
const download = 30;     // script download
const execute = 5;       // script execute

// classic: parser থামে, download + execute শেষে আবার parse
const classicDone = download + execute + parseTotal;

// defer: download সমান্তরালে; parse ও download দুটি শেষ হলে execute
const deferDone = Math.max(parseTotal, download) + execute;

// async: download শেষে (parse চলাকালীন) execute — parser সাময়িক থামে
const asyncDone = parseTotal + execute; // এখানে download < parseTotal ধরে নেওয়া

console.log("classic -> DOM প্রস্তুত:", classicDone, "ms");
console.log("defer   -> DOM প্রস্তুত:", deferDone, "ms");
console.log("async   -> DOM প্রস্তুত:", asyncDone, "ms (script আগেই চলে গেছে — ক্রমের নিশ্চয়তা নেই)");
console.log("classic এ parser আটকে ছিল:", download + execute, "ms; defer এ:", 0, "ms");`,
    },
    {
      level: "real-world",
      title: "Layout thrashing এর মডেল: লিখে-পড়ে-লিখে-পড়া বনাম আগে সব পড়া",
      description: "এটি আসল DOM নয়, ছোট একটি মডেল: কোনো মাপ (read) চাওয়ার সময় যদি আগে কিছু বদলানো থাকে (dirty), browser কে সাথে সাথে layout চালাতে হয় — মডেলটি সেই নিয়ম অনুসরণ করে। layout কতবার চলল দেখুন।",
      code: `class PageModel {
  dirty = false;
  layouts = 0;

  write() { this.dirty = true; }          // style/DOM বদলানো — layout পুরোনো হয়ে গেল
  read() {                                 // offsetHeight এর মতো পড়া
    if (this.dirty) { this.layouts++; this.dirty = false; } // জোর করে layout
    return 100;
  }
  render() {                               // browser এর নিজস্ব rendering সুযোগ
    if (this.dirty) { this.layouts++; this.dirty = false; }
  }
}

const items = [1, 2, 3, 4, 5];

// ✘ লিখে-পড়ে-লিখে-পড়ে (thrashing)
const a = new PageModel();
for (const _ of items) { a.write(); a.read(); }
a.render();

// ✔ আগে সব পড়া, তারপর সব লেখা
const b = new PageModel();
const heights = items.map(() => b.read());
for (const _ of items) b.write();
b.render();

console.log("thrashing -> layout চলেছে:", a.layouts, "বার");
console.log("batched   -> layout চলেছে:", b.layouts, "বার");
console.log("পড়া মান:", heights);`,
    },
  ],

  playground: [
    {
      label: "খালি editor — নিজে লিখুন",
      code: `// এখানে নিজের কোড লিখুন, তারপর Run চাপুন (Ctrl/⌘ + Enter)
console.log("Hello, Browser!");
`,
    },
    {
      label: "এই Playground কোন পরিবেশে চলছে? (Web Worker)",
      code: `console.log("document:", typeof document);
console.log("window:", typeof window);
console.log("localStorage:", typeof localStorage);
console.log("self আছে:", typeof self !== "undefined");
console.log("self === globalThis:", typeof self !== "undefined" && self === globalThis);
console.log("fetch:", typeof fetch);
console.log("setTimeout:", typeof setTimeout);
console.log("URL:", typeof URL);

// Worker এ DOM নেই — তাই ভারী কাজ এখানে করলে UI আটকায় না।
// তবে ফলাফল দেখাতে main thread এ postMessage করতে হয়।`,
    },
    {
      label: "Document ক্রমে চলা vs download ক্রমে চলা",
      code: `const scripts = [
  { name: "lib.js", download: 50 },
  { name: "app.js", download: 10 },
];

// document ক্রম (classic এবং defer)
const documentOrder = scripts.map((s) => s.name);

// async: যেটি আগে নামে সেটি আগে চলে
const asyncOrder = [...scripts].sort((x, y) => x.download - y.download).map((s) => s.name);

console.log("classic/defer ক্রম:", documentOrder);
console.log("async ক্রম     :", asyncOrder);
console.log("app.js যদি lib.js এর ওপর নির্ভর করে, async এ ভাঙবে:", asyncOrder[0] !== "lib.js");`,
    },
    {
      label: "URL ও query string (Web API, Worker এও চলে)",
      code: `const url = new URL("https://example.com:8080/shop/items?cat=books&page=2#reviews");

console.log(url.origin);     // scheme + host + port — same-origin এর ভিত্তি
console.log(url.pathname);
console.log(url.searchParams.get("cat"));
console.log(url.searchParams.get("page"));
console.log(url.hash);

const other = new URL("https://example.com/shop");
console.log("একই origin?", url.origin === other.origin);

// নিরাপদে query বানানো — নিজে string জুড়বেন না
const params = new URLSearchParams({ q: "a&b=c", lang: "bn" });
console.log(params.toString());`,
    },
    {
      label: "Event propagation এর ক্রম (মডেল)",
      code: `const log = [];
const path = ["html", "body", "form", "button"]; // root থেকে target

// capture: root থেকে target এর দিকে
for (const n of path.slice(0, -1)) log.push("capture " + n);
// target
log.push("target " + path.at(-1));
// bubble: target এর parent থেকে root এ
for (const n of path.slice(0, -1).reverse()) log.push("bubble " + n);

console.log(log.join("\\n"));`,
    },
  ],

  debugging: [
    {
      title: "TypeError: element null — script খুব আগে চলেছে",
      bad: `// মডেল: parser এখনো element বানায়নি, কিন্তু script আগেই চলছে
const page = { elements: {} };

function runScript() {
  page.elements.app.text = "Hello"; // #app এখনো নেই
}

runScript(); // script আগে চলল!
console.log("parse শেষ");`,
      why: "Classic script head এ থাকলে সেটি চলে HTML parse হওয়ার আগেই — তখন `document.getElementById(\"app\")` `null` দেয়, আর `null.textContent = ...` এ TypeError আসে। এখানে সেই পরিস্থিতিটির মডেল: `elements.app` তখনো নেই। সমাধান: script কে DOM প্রস্তুত হওয়ার পরে চালানো — `defer`, `type=\"module\"`, script কে `</body>` এর আগে রাখা, বা `DOMContentLoaded` এ কাজ করা।",
      fix: `const page = { elements: {} };

function parseHtml() {
  page.elements.app = { text: "" }; // parser element বানাল
}

function runScript() {
  page.elements.app.text = "Hello";
}

parseHtml();  // আগে parse (defer/module এর মতো)
runScript();  // তারপর script
console.log(page.elements.app.text);`,
    },
    {
      title: "XSS: user এর লেখা সরাসরি HTML এ বসানো",
      bad: `// মডেল: innerHTML এর মতো — string কে HTML হিসেবে ধরা হচ্ছে
const comment = '<img src=x onerror="alert(1)">';

const html = "<p>" + comment + "</p>";
console.log(html); // browser এ এটি একটি সত্যিকারের <img> element হতো ও onerror চলত`,
      why: "String কে `innerHTML` দিয়ে বসালে browser সেটিকে HTML হিসেবে parse করে। উপরের comment এ একটি ভাঙা ছবি ও `onerror` handler আছে — ছবি লোড না হলেই আক্রমণকারীর JavaScript চলে। (`innerHTML` এ বসানো `<script>` tag চলে না, কিন্তু এমন event attribute চলে।) সমাধান: user text কে `textContent` এ বসানো, বা অন্তত HTML এর বিশেষ character escape করা।",
      fix: `function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const comment = '<img src=x onerror="alert(1)">';
const html = "<p>" + escapeHtml(comment) + "</p>";
console.log(html); // এখন এটি শুধু text — কোনো element নয়
// browser এ সরাসরি: element.textContent = comment;`,
    },
    {
      title: "Event handler এ this হারিয়ে যাওয়া",
      bad: `const counter = {
  count: 0,
  inc() {
    this.count++;
    console.log("count =", this.count);
  },
};

// button.addEventListener("click", counter.inc) এর মতো — method কে আলাদা করে পাঠানো
const handler = counter.inc;
handler();`,
      why: "Method কে `counter.` ছাড়া আলাদা variable এ রাখলে call করার সময় `this` আর `counter` থাকে না। Strict mode এ `this` হয় `undefined` (TypeError), sloppy mode এ global object (ফলে `NaN` আসে)। Browser এ listener হিসেবে সরাসরি method দিলে `this` হয় সেই element (`currentTarget`) — আপনার object নয়। সমাধান: arrow function দিয়ে wrap, বা `bind`।",
      fix: `const counter = {
  count: 0,
  inc() {
    this.count++;
    console.log("count =", this.count);
  },
};

const handler = () => counter.inc(); // সঠিক receiver দিয়ে ডাকা
handler();
handler();

// বিকল্প: const handler2 = counter.inc.bind(counter);`,
    },
    {
      title: "async script এর ক্রম-নির্ভরতা ভাঙা",
      bad: `const download = (name, ms) => new Promise((resolve) => setTimeout(() => resolve(name), ms));

// async এর মতো: যেটি আগে নামে সেটিই আগে চলে
const order = [];
await Promise.all([
  download("lib.js", 30).then((n) => order.push(n)),
  download("app.js", 10).then((n) => order.push(n)),
]);

console.log(order);
if (order[0] !== "lib.js") {
  throw new Error("app.js আগে চলেছে, কিন্তু lib.js এর ওপর নির্ভর করে!");
}`,
      why: "`async` script গুলোর ক্রমের নিশ্চয়তা নেই — ছোট ফাইল আগে নামে এবং আগে চলে। যে script অন্য script এর ওপর নির্ভর করে সে `lib` না থাকায় ভেঙে যায়। এই ধরনের bug নির্ভর করে network গতির ওপর, তাই কখনো কাজ করে, কখনো করে না। সমাধান: ক্রম প্রয়োজন হলে `defer` বা module `import` ব্যবহার করুন।",
      fix: `const download = (name, ms) => new Promise((resolve) => setTimeout(() => resolve(name), ms));

// defer / module এর মতো: নির্ভরতার ক্রম মেনে চালানো
const order = [];
const files = [["lib.js", 30], ["app.js", 10]];

const downloads = files.map(([name, ms]) => download(name, ms)); // সমান্তরালে নামানো
for (const d of downloads) order.push(await d);                  // ক্রম মেনে চালানো

console.log(order);`,
    },
  ],

  practice: [
    {
      level: "beginner",
      title: "DOM tree তে পথ খুঁজুন",
      prompt: "`dom` একটি tree। `html → body → h1` পথ ধরে `h1` এর `tag` মানটি `console.log` দিয়ে print করুন (`h1`)।",
      starter: `const dom = {
  tag: "html",
  children: [
    { tag: "head", children: [] },
    { tag: "body", children: [{ tag: "h1", children: [] }] },
  ],
};

// TODO: dom.children[...] ধরে h1 এর tag print করুন`,
      expected: "h1",
      hints: ["`body` হলো `dom.children[1]`।", "`h1` হলো body এর `children[0]`।"],
      solution: `const dom = {
  tag: "html",
  children: [
    { tag: "head", children: [] },
    { tag: "body", children: [{ tag: "h1", children: [] }] },
  ],
};

console.log(dom.children[1].children[0].tag);`,
    },
    {
      level: "beginner",
      title: "HTML string এ <li> গুনুন",
      prompt: "`html` string এ কয়টি `<li>` খোলার tag আছে তা print করুন (`3`)। (আসল DOM এ এটি `querySelectorAll(\"li\").length` হতো।)",
      starter: `const html = "<ul><li>A</li><li>B</li><li>C</li></ul>";

// TODO`,
      expected: "3",
      hints: ["`html.match(/<li>/g)` একটি array ফেরত দেয় (মিল না পেলে `null`)।", "তারপর `.length` নিন।"],
      solution: `const html = "<ul><li>A</li><li>B</li><li>C</li></ul>";

const matches = html.match(/<li>/g);
console.log(matches.length);`,
      explanation: "`/g` flag সব মিল খোঁজে। মিল না থাকলে `match` `null` দেয়, তাই বাস্তব কোডে `matches?.length ?? 0` নিরাপদ। (বাস্তব HTML parse করতে regex নয়, DOM parser ব্যবহার করুন — এখানে শুধু শেখার জন্য।)",
    },
    {
      level: "beginner",
      title: "HTML escape — XSS থেকে প্রথম সুরক্ষা",
      prompt: "`escapeHtml` লিখুন যা `&`, `<`, `>` কে যথাক্রমে `&amp;`, `&lt;`, `&gt;` এ বদলায় (`&` কে **প্রথমে** বদলাতে হবে)। `<b>hi</b>` এর ফল হবে `&lt;b&gt;hi&lt;/b&gt;`।",
      starter: `function escapeHtml(s) {
  return s; // TODO
}

console.log(escapeHtml("<b>hi</b>"));`,
      expected: "&lt;b&gt;hi&lt;/b&gt;",
      hints: ["`s.replaceAll(\"&\", \"&amp;\")` দিয়ে শুরু করুন।", "`&` আগে না বদলালে নতুন তৈরি `&lt;` এর `&` ও আবার বদলে যাবে।"],
      solution: `function escapeHtml(s) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

console.log(escapeHtml("<b>hi</b>"));`,
      explanation: "`&` কে আগে বদলানোর কারণ: পরে বসানো `&lt;` এর ভেতরের `&` যেন আবার `&amp;lt;` না হয়ে যায়। বাস্তবে `textContent` ব্যবহার করলে এই escape নিজে করতেই হয় না।",
    },
    {
      level: "intermediate",
      title: "Tree এর মোট node সংখ্যা",
      prompt: "`countNodes(node)` recursion দিয়ে একটি tree এর মোট node (root সহ) গুনুক। নিচের tree তে ফল হবে `7`।",
      starter: `function countNodes(node) {
  // TODO
  return 0;
}

const tree = {
  tag: "html",
  children: [
    { tag: "head", children: [{ tag: "title", children: [] }] },
    { tag: "body", children: [
      { tag: "h1", children: [] },
      { tag: "p", children: [{ tag: "span", children: [] }] },
    ] },
  ],
};

console.log(countNodes(tree));`,
      expected: "7",
      hints: ["নিজেকে ১ গণনা করুন, তারপর প্রতিটি child এর `countNodes` যোগ করুন।", "`reduce` বা `for...of` যেকোনোটি চলবে।"],
      solution: `function countNodes(node) {
  let total = 1;
  for (const child of node.children) {
    total += countNodes(child);
  }
  return total;
}

const tree = {
  tag: "html",
  children: [
    { tag: "head", children: [{ tag: "title", children: [] }] },
    { tag: "body", children: [
      { tag: "h1", children: [] },
      { tag: "p", children: [{ tag: "span", children: [] }] },
    ] },
  ],
};

console.log(countNodes(tree));`,
      explanation: "DOM এ `querySelectorAll(\"*\")` এই কাজই করে। Tree এর recursion এর base case এখানে implicit: children না থাকলে loop চলেই না।",
    },
    {
      level: "intermediate",
      title: "Event bubbling এর পথ",
      prompt: "`bubblePath(target)` লিখুন যা target থেকে শুরু করে `parent` ধরে root পর্যন্ত element এর নাম একটি array তে ফেরত দেয়। ফল: `[ 'button', 'form', 'body', 'html' ]`।",
      starter: `function makeNode(name, parent) {
  return { name, parent };
}

const html = makeNode("html", null);
const body = makeNode("body", html);
const form = makeNode("form", body);
const button = makeNode("button", form);

function bubblePath(target) {
  // TODO
  return [];
}

console.log(bubblePath(button));`,
      expected: "[ 'button', 'form', 'body', 'html' ]",
      hints: ["`let node = target; while (node) { ...; node = node.parent; }`।", "root এর `parent` হলো `null`, তাই loop সেখানে থামে।"],
      solution: `function makeNode(name, parent) {
  return { name, parent };
}

const html = makeNode("html", null);
const body = makeNode("body", html);
const form = makeNode("form", body);
const button = makeNode("button", form);

function bubblePath(target) {
  const path = [];
  let node = target;
  while (node) {
    path.push(node.name);
    node = node.parent;
  }
  return path;
}

console.log(bubblePath(button));`,
      explanation: "Browser ও event dispatch এর সময় একইভাবে target থেকে parent ধরে একটি ‘event path’ বানায়। Bubble ধাপ এই পথ ধরে উপরে যায়, capture ধাপ একই পথ উল্টো দিকে।",
    },
    {
      level: "challenge",
      title: "Event dispatch: capture → target → bubble",
      prompt: "`dispatch(target)` লিখুন যা ক্রমানুসারে (১) root থেকে target এর parent পর্যন্ত প্রতিটি element এর `capture` handler, (২) target এর `bubble` handler (target ধাপ), (৩) target এর parent থেকে root পর্যন্ত `bubble` handler চালায়। কোনো handler `\"stop\"` ফেরত দিলে propagation সাথে সাথে থামবে (`stopPropagation` এর মতো)। Handler না থাকলে (null) এড়িয়ে যাবে।",
      starter: `function makeNode(name, parent) {
  return { name, parent, capture: null, bubble: null };
}

const html = makeNode("html", null);
const body = makeNode("body", html);
const button = makeNode("button", body);

html.capture = () => console.log("capture: html");
body.capture = () => console.log("capture: body");
button.bubble = () => console.log("target: button");
body.bubble = () => {
  console.log("bubble: body");
  return "stop"; // এখানে propagation থামুক
};
html.bubble = () => console.log("bubble: html"); // এটি চলবে না

function dispatch(target) {
  // TODO
}

dispatch(button);`,
      expected: "capture: html\ncapture: body\ntarget: button\nbubble: body",
      hints: ["আগে parent চেইন বানান (target এর parent থেকে root, `unshift` করলে root থেকে নিচের ক্রম পাবেন)।", "Capture লুপ সেই array সামনে থেকে, bubble লুপ পেছন থেকে।", "প্রতিটি handler ডাকার পর `=== \"stop\"` পরীক্ষা করে `return` করুন।"],
      solution: `function makeNode(name, parent) {
  return { name, parent, capture: null, bubble: null };
}

const html = makeNode("html", null);
const body = makeNode("body", html);
const button = makeNode("button", body);

html.capture = () => console.log("capture: html");
body.capture = () => console.log("capture: body");
button.bubble = () => console.log("target: button");
body.bubble = () => {
  console.log("bubble: body");
  return "stop";
};
html.bubble = () => console.log("bubble: html");

function dispatch(target) {
  const ancestors = []; // root ... target এর parent
  for (let n = target.parent; n; n = n.parent) ancestors.unshift(n);

  // ১) capture: উপর থেকে নিচে
  for (const n of ancestors) {
    if (n.capture && n.capture() === "stop") return;
  }

  // ২) target
  if (target.bubble && target.bubble() === "stop") return;

  // ৩) bubble: নিচ থেকে উপরে
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const n = ancestors[i];
    if (n.bubble && n.bubble() === "stop") return;
  }
}

dispatch(button);`,
      explanation: "আসল DOM এর `dispatchEvent` এর কাঠামো মোটামুটি এটিই: একটি event path তৈরি, capture ধাপ নিচের দিকে, target, তারপর bubble উপরের দিকে, আর `stopPropagation` পরের node এ যাওয়া বন্ধ করে। (আসলে target এ capture ও bubble দুই ধরনের listener ই চলতে পারে এবং `stopImmediatePropagation` ও আছে — এখানে সরলীকৃত।) Event delegation এই bubbling এর ওপরই দাঁড়িয়ে।",
    },
  ],

  assessment: {
    mcqs: [
      {
        question: "`<script src=\"app.js\" defer></script>` সম্পর্কে কোনটি সঠিক?",
        options: ["Download এর সময় HTML parser কে আটকে রাখে", "HTML parsing শেষ হওয়ার পর, `DOMContentLoaded` এর আগে, document ক্রম মেনে চলে", "Download শেষ হওয়া মাত্র চলে এবং ক্রমের কোনো নিশ্চয়তা নেই", "Inline script এও (`src` ছাড়া) একই ভাবে কাজ করে"],
        answer: 1,
        explanation: "`defer` সমান্তরালে download করে এবং parsing শেষে document ক্রমে চালায়। প্রথম অপশনটি classic script এর বর্ণনা, তৃতীয়টি `async` এর। চতুর্থটি ভুল — `defer` শুধু `src` আছে এমন external script এ কাজ করে।",
      },
      {
        question: "নিচের কোনটি **DOM** এর সঠিক বর্ণনা?",
        options: ["JavaScript ভাষার একটি built-in object যা সব পরিবেশে আছে", "CSS ফাইল থেকে তৈরি tree", "Node.js এ HTML parse করার একটি module", "HTML document কে tree আকারের object model হিসেবে প্রকাশ করা browser এর API, যার মাধ্যমে JS পাতা পড়ে ও বদলায়"],
        answer: 3,
        explanation: "DOM হলো browser host এর API; ECMAScript এর অংশ নয় (তাই প্রথম অপশন ভুল)। CSS থেকে তৈরি tree হলো CSSOM (দ্বিতীয় অপশন ভুল)। Node.js এ DOM নেই, এটি browser এর জিনিস (তৃতীয় অপশন ভুল)।",
      },
      {
        question: "Browser এর rendering pipeline এর সঠিক ক্রম কোনটি?",
        options: ["Paint → Layout → Style → Composite", "Layout → Style → Paint → Composite", "Style → Layout → Paint → Composite", "Composite → Paint → Layout → Style"],
        answer: 2,
        explanation: "আগে Style (কোন element এর কী style), তারপর Layout (আকার ও অবস্থান), তারপর Paint (আঁকার নির্দেশ), শেষে Composite (layer জোড়া)। অন্য ক্রমগুলোতে এমন ধাপ আগে এসেছে যার ইনপুট পরের ধাপের আউটপুটের ওপর নির্ভরশীল — যেমন আকার না জেনে আঁকা যায় না।",
      },
      {
        question: "`<body>` এর ভেতর `<form>`, তার ভেতর `<button>` এ click হলো। তিনটিতেই সাধারণ (bubble) listener আছে। listener গুলো কোন ক্রমে চলে?",
        options: ["body → form → button", "শুধু button এর listener চলে", "form → button → body", "button → form → body"],
        answer: 3,
        explanation: "Bubble ধাপে event target থেকে উপরের দিকে ওঠে: button, তারপর form, তারপর body। প্রথম অপশনটি capture ধাপের ক্রম (যদি capture listener হতো)। দ্বিতীয় অপশন ভুল কারণ বেশিরভাগ event bubble করে। তৃতীয়টির কোনো ভিত্তি নেই।",
      },
      {
        question: "User এর লেখা text পাতায় দেখানোর সবচেয়ে নিরাপদ উপায় কোনটি?",
        options: ["`element.textContent = text`", "`element.innerHTML = text`", "`document.write(text)`", "`eval(\"element.append('\" + text + \"')\")`"],
        answer: 0,
        explanation: "`textContent` string কে সাধারণ text হিসেবে বসায়, HTML হিসেবে parse করে না — তাই XSS হয় না। `innerHTML` ও `document.write` string কে HTML হিসেবে parse করে, যাতে `<img onerror=...>` চলতে পারে। `eval` সবচেয়ে বিপজ্জনক কারণ এটি string কেই কোড বানায়।",
      },
    ],
    coding: [
      {
        title: "Tree থেকে HTML string বানান",
        prompt: "`render(node)` লিখুন যা `{ tag, text?, children }` tree কে HTML string এ রূপ দেয় (text থাকলে tag এর ভেতরে প্রথমে text, তারপর children)। Expected: `<ul><li>A</li><li>B</li></ul>`।",
        starter: `function render(node) {
  // TODO
  return "";
}

const tree = {
  tag: "ul",
  children: [
    { tag: "li", text: "A", children: [] },
    { tag: "li", text: "B", children: [] },
  ],
};

console.log(render(tree));`,
        expected: "<ul><li>A</li><li>B</li></ul>",
        solution: `function render(node) {
  const inner = (node.text ?? "") + node.children.map(render).join("");
  return "<" + node.tag + ">" + inner + "</" + node.tag + ">";
}

const tree = {
  tag: "ul",
  children: [
    { tag: "li", text: "A", children: [] },
    { tag: "li", text: "B", children: [] },
  ],
};

console.log(render(tree));`,
      },
      {
        title: "URL থেকে তথ্য বের করুন",
        prompt: "`URL` ও `searchParams` ব্যবহার করে `hostname`, `item`, `qty` ও `hash` চারটি আলাদা লাইনে print করুন।",
        starter: `const url = new URL("https://example.com/shop?item=book&qty=3#reviews");

// TODO`,
        expected: "example.com\nbook\n3\n#reviews",
        solution: `const url = new URL("https://example.com/shop?item=book&qty=3#reviews");

console.log(url.hostname);
console.log(url.searchParams.get("item"));
console.log(url.searchParams.get("qty"));
console.log(url.hash);`,
      },
    ],
  },

  interview: [
    {
      q: "Browser এ একটি পাতা লোড হওয়ার সময় HTML পাওয়া থেকে পর্দায় আঁকা পর্যন্ত কী কী ঘটে?",
      a: "মূল ধাপ (Critical Rendering Path): (১) network থেকে HTML আসে; (২) parser তা থেকে **DOM** বানায়; (৩) CSS থেকে **CSSOM** তৈরি হয়; (৪) দুটি মিলিয়ে প্রতিটি দৃশ্যমান element এর computed style ঠিক হয়; (৫) **Layout** — আকার ও অবস্থান গণনা; (৬) **Paint** — আঁকার নির্দেশ; (৭) **Composite** — layer জুড়ে স্ক্রিনে প্রদর্শন।\n\nসাথে বলুন JavaScript কোথায় ঢোকে: classic script parser আটকায়, DOM বদলালে Style/Layout/Paint আবার চালাতে হয়। বিস্তারিত বাস্তবায়ন browser ভেদে কিছুটা আলাদা, তাই ধাপগুলো ধারণাগত মডেল হিসেবে বলাই নিরাপদ।",
    },
    {
      q: "`<script>`, `async`, `defer` ও `type=\"module\"` এর পার্থক্য কী? কোনটি কখন ব্যবহার করবেন?",
      a: "Classic `<script src>` parser থামিয়ে download ও execute করে। `defer` সমান্তরালে download করে এবং parsing শেষে, `DOMContentLoaded` এর আগে, document ক্রমে চালায় (শুধু external script এ)। `async` সমান্তরালে download করে ও নামামাত্র চালায় — ক্রম অনিশ্চিত, parsing এর মাঝেও চলতে পারে। `type=\"module\"` ডিফল্টে defer এর মতো, তাছাড়া strict mode, নিজস্ব scope, `import`/`export` ও top-level `await` দেয়।\n\nব্যবহার: নিজের app এর জন্য module (বা defer); স্বাধীন তৃতীয়-পক্ষ script (analytics) এ async; ক্রম-নির্ভর পুরোনো script এ defer। আজকের নতুন কোডে classic blocking script প্রায় কখনো নয়।",
    },
    {
      q: "Reflow (layout) ও repaint এর পার্থক্য কী? Layout thrashing কী এবং কীভাবে এড়ান?",
      a: "**Layout/reflow** হলো element এর আকার-অবস্থান পুনর্গণনা (যেমন `width`, `margin`, DOM এ element যোগ করা)। **Repaint** শুধু চেহারা (রং, `background`) পুনরায় আঁকা — layout লাগে না। `transform` ও `opacity` সাধারণত composite ধাপেই সীমাবদ্ধ থাকতে পারে, তাই animation এর জন্য সবচেয়ে সস্তা।\n\n**Layout thrashing:** লুপের ভেতর বারবার ‘style লেখা → layout-নির্ভর property পড়া (`offsetHeight`, `getBoundingClientRect()`)’ করলে প্রতিবার browser কে জোর করে layout চালাতে হয়। এড়ানোর উপায়: আগে সব পড়ুন, পরে সব লিখুন (batch); animation এ `requestAnimationFrame` ব্যবহার করুন; CSS class বদলে একসাথে অনেক style পরিবর্তন করুন।",
    },
    {
      q: "Event bubbling, capturing ও event delegation কী? `stopPropagation` ও `preventDefault` এর পার্থক্য কী?",
      a: "Event তিন ধাপে চলে: **capture** (root থেকে target এ), **target**, **bubble** (target থেকে root এ)। ডিফল্টে `addEventListener` bubble ধাপে শোনে; `{ capture: true }` দিলে capture ধাপে। **Event delegation** হলো অনেক child এর জন্য parent এ একটি listener বসানো এবং `event.target` (বা `closest`) দিয়ে আসল element চেনা — কম memory লাগে এবং পরে যোগ হওয়া element এও কাজ করে।\n\n`stopPropagation()` event কে আরও এগোতে দেয় না (একই element এর বাকি listener চলে; সেটিও আটকাতে `stopImmediatePropagation()`)। `preventDefault()` ব্রাউজারের ডিফল্ট ক্রিয়া (link এ navigate, form submit) বন্ধ করে — propagation বন্ধ করে না। দুটি স্বাধীন।",
    },
    {
      q: "XSS কী এবং কীভাবে প্রতিরোধ করবেন? Same-origin policy ও CORS এর সাথে এর সম্পর্ক কী?",
      a: "**XSS** হলো আক্রমণকারীর লেখা JavaScript আপনার page এর origin এ চালিয়ে ফেলা — সাধারণত user input কে `innerHTML`, `document.write`, বা অনিরাপদ template এ HTML হিসেবে বসানোর ফলে। প্রতিরোধ: text এর জন্য `textContent`; HTML দরকার হলে sanitizer (DOMPurify বা browser এর Sanitizer API সমর্থন থাকলে সেটি), প্রসঙ্গ অনুযায়ী output encoding, এবং **Content Security Policy** দিয়ে inline script/`eval` সীমিত করা। সংবেদনশীল cookie তে `HttpOnly` রাখলে script তা পড়তে পারে না।\n\n**Same-origin policy** এক origin এর script কে অন্য origin এর data পড়া থেকে আটকায় — কিন্তু XSS হলে আক্রমণকারীর কোড *আপনার* origin এই চলে, তাই এই নীতি তখন সাহায্য করে না। **CORS** হলো সেই নীতি শিথিল করার সার্ভার-নিয়ন্ত্রিত ব্যবস্থা, নিরাপত্তার ঢাল নয়।",
    },
    {
      q: "Browser এ JavaScript কেন UI আটকে দিতে পারে? Web Worker কী সমাধান দেয়, আর তার সীমা কী?",
      a: "JavaScript, style গণনা, layout ও (প্রধানত) painting একই main thread এ ভাগাভাগি করে চলে। একটি ভারী synchronous task (প্রায় ৫০ ms এর বেশি হলে ‘long task’) সেই সময় event handling ও rendering আটকে রাখে — তাই UI freeze হয়।\n\n**Web Worker** আলাদা thread ও আলাদা event loop এ কোড চালায়, তাই ভারী গণনা সেখানে সরালে main thread মুক্ত থাকে। সীমা: Worker এ **DOM নেই** (`document`, `window` নেই), data আদান-প্রদান `postMessage` দিয়ে (structured clone — copy হয়, বড় data এ খরচ আছে, `Transferable` দিয়ে কমানো যায়)। হালকা কাজের জন্য chunking বা `requestIdleCallback`/scheduling কৌশলও আছে।",
    },
    {
      q: "`DOMContentLoaded` ও `load` event এর পার্থক্য কী?",
      a: "`DOMContentLoaded` ফায়ার হয় যখন HTML সম্পূর্ণ parse হয়েছে এবং defer ও module script চলে গেছে — ছবি, stylesheet, iframe এর অপেক্ষা করে না। DOM ভিত্তিক initialization এর জন্য এটিই সাধারণত যথেষ্ট ও দ্রুত। `load` ফায়ার হয় পাতার সব resource (ছবি, stylesheet, ফন্ট ইত্যাদি) লোড হওয়ার পরে — তাই এটি দেরিতে আসে।\n\nআজকাল `defer` বা `type=\"module\"` script ব্যবহার করলে আলাদা করে `DOMContentLoaded` এর অপেক্ষা করার প্রয়োজন প্রায়ই পড়ে না, কারণ সেগুলো DOM প্রস্তুত হওয়ার পরেই চলে।",
    },
  ],

  summary: {
    takeaways: [
      "Browser = network + HTML/CSS parser + layout/paint + JS engine + Web APIs; JavaScript একটি অংশ মাত্র।",
      "পাইপলাইন: HTML → DOM, CSS → CSSOM → Style → Layout → Paint → Composite; JS বদলালে প্রয়োজন অনুযায়ী ধাপ আবার চলে।",
      "Classic script parser আটকায়; `defer`/`type=\"module\"` DOM শেষে ক্রম মেনে চলে; `async` ক্রম-নিরপেক্ষ ও যেকোনো সময়ে।",
      "DOM ECMAScript এর অংশ নয় — browser এর host API; Worker ও Node.js এ নেই।",
      "লিখে-পড়ে-লিখে-পড়া (layout thrashing) এড়াতে আগে সব পড়ুন, পরে সব লিখুন; animation এ `transform`/`opacity` পছন্দ করুন।",
      "Event: capture → target → bubble; delegation, `stopPropagation` ও `preventDefault` ভিন্ন জিনিস।",
      "User text → `textContent`, কখনো সরাসরি `innerHTML`/`eval` নয় (XSS); CSP ও `HttpOnly` cookie অতিরিক্ত সুরক্ষা।",
      "ভারী কাজ main thread এ UI আটকায় — Web Worker এ সরান (DOM নেই, `postMessage` এ যোগাযোগ)।",
    ],
    syntax: `// শুধু browser এ (HTML ও DOM)
// <script type="module" src="/main.js"></script>
// <script defer src="/lib.js"></script>
// <script async src="/analytics.js"></script>

// document.querySelector("#list").addEventListener("click", (e) => {
//   const li = e.target.closest("li");   // delegation
//   if (li) li.classList.toggle("done");
// });
// el.textContent = userText;             // নিরাপদ

// Worker এ ও চলে (DOM ছাড়া Web API)
const url = new URL("https://example.com/a?x=1");
console.log(url.searchParams.get("x"));`,
    whenToUse: [
      "নিজের app script এর জন্য `type=\"module\"` বা `defer`; স্বাধীন tracking script এ `async`।",
      "ডায়নামিক list/table এ event delegation; user text এর জন্য `textContent`।",
      "পাতায় অনেক DOM পরিবর্তন: layout-পড়া ও লেখা আলাদা ব্যাচে, animation এ `transform`/`opacity`।",
      "ভারী গণনা বা বড় data প্রসেসিং: Web Worker, অথবা কাজ chunk করা।",
    ],
    next: [
      "DOM Manipulation ও Selectors (পরবর্তী module)",
      "Events ও Event Delegation এর গভীর আলোচনা",
      "Asynchronous JavaScript — fetch, Promise, async/await",
      "Web Security Basics — XSS, CSP, CORS",
    ],
  },

  compatibility:
    "এই lesson এর DOM, event, `<script>` সংক্রান্ত অংশ **শুধু browser এর window context** এর জন্য; Node.js এ `document`/`window` নেই। `defer`, `async`, `type=\"module\"`, `addEventListener`, `closest` সব আধুনিক browser এ সমর্থিত; `replaceAll` (ES2021), `Array.prototype.at` (ES2022), class field সব আধুনিক browser ও Node.js এ আছে। `URL` ও `URLSearchParams` Web Worker ও Node.js এ কাজ করে। এই Playground একটি Web Worker এ চলে — তাই এখানে `document`, `window`, `localStorage` নেই, শুধু pure JS ও Worker-সমর্থিত Web API (`URL`, timers ইত্যাদি) চলে; DOM সংক্রান্ত কোড lesson এর ব্যাখ্যায় শুধু পড়ার জন্য দেওয়া হয়েছে।",
};
