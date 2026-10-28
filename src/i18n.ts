export type Locale = "zh" | "en";
let locale: Locale = "zh";
const messages: readonly (readonly [string, string])[] = [
  [
    "咪咕看见小黑，回到首页",
    "Migu CHN, home"
  ],
  [
    "咪咕看见小黑",
    "Migu CHN"
  ],
  [
    "探索方向",
    "Explore"
  ],
  [
    "我的作品",
    "Projects"
  ],
  [
    "关于我",
    "About"
  ],
  [
    "打个招呼",
    "Say hello"
  ],
  [
    "主导航",
    "Main navigation"
  ],
  [
    "打开导航菜单",
    "Open navigation menu"
  ],
  [
    "关闭导航菜单",
    "Close navigation menu"
  ],
  [
    "移动端导航",
    "Mobile navigation"
  ],
  [
    "好奇心，",
    "Curiosity"
  ],
  [
    "没有",
    "knows no "
  ],
  [
    "边界",
    "bounds"
  ],
  [
    "。",
    "."
  ],
  [
    "把 AI、代码和奇思妙想，做成能用、也好玩的作品。",
    "Turning AI, code and curious ideas into things that are useful—and fun."
  ],
  [
    "这里没有标准路线，跟着好奇心往前走就好。",
    "There’s no set route here. Just follow your curiosity."
  ],
  [
    "开始漫游",
    "Take a wander"
  ],
  [
    "看看作品",
    "See my projects"
  ],
  [
    "向下滑动，进入奇想世界",
    "Scroll into a world of wonder"
  ],
  [
    "探索 AI 科技，分享无限乐趣",
    "Exploring AI. Sharing the joy of discovery."
  ],
  [
    "在不可能的地方，发现可能。",
    "Finding possibilities in impossible places."
  ],
  [
    "小岛互动",
    "Island interactions"
  ],
  [
    "和小黑打招呼",
    "Say hello to Xiaohei"
  ],
  [
    "打开小岛的门",
    "Open the island door"
  ],
  [
    "关上小岛的门",
    "Close the island door"
  ],
  [
    "切换到小岛夜景",
    "Switch the island to night"
  ],
  [
    "切换到小岛日景",
    "Switch the island to day"
  ],
  [
    "切换小岛昼夜",
    "Switch between day and night"
  ],
  [
    "点点小黑，或试试开门和昼夜。",
    "Say hi to Xiaohei, open the door, or try nightfall."
  ],
  [
    "方向不必一样，好奇心可以同路。",
    "Different paths. A shared curiosity."
  ],
  [
    "点点小黑，也试试小岛上的门",
    "Say hi to Xiaohei. See what’s behind the door."
  ],
  [
    "向下滑动，进入小黑的奇想世界",
    "Scroll into Xiaohei’s world of wonder"
  ],
  [
    "保持好奇，让想法发生。",
    "Stay curious. Bring ideas to life."
  ],
  [
    "世界很大，值得探索的事情很多。",
    "There’s a whole world worth exploring."
  ],
  [
    "我从三个方向出发：探索 AI、动手创造、分享发现。",
    "My way in: explore AI, build things, and share what I find."
  ],
  [
    "探索 AI 的可能",
    "Explore what AI can do"
  ],
  [
    "走近新工具，也追问它能解决什么。",
    "Try new tools. Ask what they can really help with."
  ],
  [
    "从一次对话，到一个真正有用的应用。",
    "From a first conversation to something truly useful."
  ],
  [
    "把想法变成作品",
    "Make ideas real"
  ],
  [
    "灵感不只留在备忘录。",
    "Ideas deserve more than a note on a screen."
  ],
  [
    "用代码搭起来，用起来，再慢慢打磨。",
    "Build them, use them, and keep making them better."
  ],
  [
    "分享路上的发现",
    "Share the discoveries"
  ],
  [
    "记录踩过的坑，也收藏偶然的惊喜。",
    "Keep the lessons from wrong turns and unexpected finds."
  ],
  [
    "让一个人的探索，成为彼此的启发。",
    "What one person discovers can spark an idea in someone else."
  ],
  [
    "把想法，做成作品。",
    "Ideas, out in the world."
  ],
  [
    "去 GitHub 串个门",
    "Visit my GitHub"
  ],
  [
    "给 AI 对话一条时间线。让灵感、提问与回答，都有迹可循。",
    "A timeline for your AI conversations, so you can find your way back to every idea, question and answer."
  ],
  [
    "浏览器扩展",
    "Browser extension"
  ],
  [
    "让 AI 成为代码的另一双眼睛，把注意力留给更值得思考的事。",
    "An extra pair of AI eyes on your code, so you can focus on the decisions that need you."
  ],
  [
    "AI · 开源工具",
    "AI · Open source"
  ],
  [
    "把探索中有用的方法，变成可复用的 AI 技能。少一点重复，多一点创造。",
    "Useful discoveries turned into reusable AI skills. Less repetition, more room to create."
  ],
  [
    "Agent · 技能集",
    "Agent · Skills"
  ],
  [
    "小黑 / THE CURIOUS ONE",
    "XIAOHEI / THE CURIOUS ONE"
  ],
  [
    "好奇心常驻 ✳",
    "Curiosity lives here ✳"
  ],
  [
    "灵感偶尔出没",
    "Ideas wander in"
  ],
  [
    "认真探索，",
    "Serious about exploring."
  ],
  [
    "也认真好玩。",
    "And having fun."
  ],
  [
    "我是小黑。这里是我在互联网搭起的一座小岛，收留关于 AI、代码与创造的奇思妙想，也分享一路上的发现和乐趣。",
    "I’m Xiaohei. This is my little island on the internet—a home for curious ideas about AI, code and making things, and a place to share the discoveries and fun along the way."
  ],
  [
    "我喜欢把复杂的东西拆开，看看里面的齿轮；也喜欢把零散的灵感拼起来，做出一点新东西。",
    "I like taking complex things apart to see how they work, and piecing stray ideas together to make something new."
  ],
  [
    "不一定知道下一站在哪，但总想去看看。",
    "I don’t always know where I’m heading next. I’m curious to find out."
  ],
  [
    "AI 探索者",
    "AI explorer"
  ],
  [
    "独立创造",
    "Independent maker"
  ],
  [
    "终身好奇",
    "Always curious"
  ],
  [
    "有个有趣的想法？",
    "Got an interesting idea?"
  ],
  [
    "一起让它发生。",
    "Let’s bring it to life."
  ],
  [
    "聊 AI、聊创造，或者，只是打个招呼。",
    "Talk AI, talk making things, or just say hello."
  ],
  [
    "内容交流与商务合作，欢迎来信。",
    "For exchanging ideas or working together, drop me a line."
  ],
  [
    "复制商务合作邮箱",
    "Copy contact email"
  ],
  [
    "复制邮箱",
    "Copy email"
  ],
  [
    "保持好奇，下次见。",
    "Stay curious. See you around."
  ],
  [
    "回到顶部",
    "Back to top"
  ],
  [
    "回到小岛的起点",
    "Back to where the island begins"
  ],
  [
    "小黑的奇想漫游",
    "Xiaohei’s curious journey"
  ],
  [
    "保持好奇",
    "Stay curious"
  ],
  [
    "换个角度",
    "A fresh perspective"
  ],
  [
    "创造与分享",
    "Create & share"
  ],
  [
    "还没有路，",
    "No path ahead?"
  ],
  [
    "那就",
    "Let’s "
  ],
  [
    "搭一条。",
    "build one."
  ],
  [
    "每个有趣的东西，都从一个「要不试试」开始。",
    "Every interesting thing starts with “what if we tried?”"
  ],
  [
    "继续向下，让散落的灵感长成阶梯。",
    "Keep scrolling. Watch scattered ideas become stepping stones."
  ],
  [
    "转个方向，",
    "A different angle."
  ],
  [
    "就有",
    ""
  ],
  [
    "新可能。",
    "New possibilities."
  ],
  [
    "转动的不是世界，是看世界的方式。",
    "The world hasn’t changed. Your perspective has."
  ],
  [
    "让好奇心，连接两个不可能的地方。",
    "Let curiosity bridge places that seemed impossible to connect."
  ],
  [
    "让不可能，",
    "Turn the impossible"
  ],
  [
    "变成作品。",
    "into something real."
  ],
  [
    "从一次尝试，到一个真正可用的作品。",
    "From a first experiment to something people can use."
  ],
  [
    "把路上的发现留下，也分享给下一个好奇的人。",
    "Leave a little of what you’ve learned for the next curious soul."
  ],
  [
    "向下滚动，世界随你而动",
    "Scroll, and the world moves with you"
  ],
  [
    "漫游章节",
    "Journey chapters"
  ],
  [
    "起点",
    "Begin"
  ],
  [
    "转念",
    "Reimagine"
  ],
  [
    "创造",
    "Create"
  ],
  [
    "小黑的小岛，可与小黑和拱门互动",
    "Xiaohei’s island. Say hello to Xiaohei or open the archway."
  ],
  [
    "喵，发现你了。",
    "Meow. There you are."
  ],
  [
    "你也在找有趣的东西吗？",
    "Looking for something interesting, too?"
  ],
  [
    "伸个懒腰，再逛一会儿。",
    "A little stretch. A little more exploring."
  ],
  [
    "晚安，宇宙。好奇心还醒着。",
    "Goodnight, universe. Curiosity is still awake."
  ],
  [
    "门里亮着灯，欢迎好奇的人。",
    "There’s a light inside. Curious souls welcome."
  ],
  [
    "轻轻关门，留住一点暖光。",
    "Close it gently. Keep a little warmth inside."
  ],
  [
    "邮箱已复制，期待你的来信。",
    "Email copied. I’d love to hear from you."
  ],
  [
    "请手动复制邮箱：miguchn@gmail.com",
    "Please copy the email address: miguchn@gmail.com"
  ],
  [
    "跳到主要内容",
    "Skip to main content"
  ]
];
const ordered = [...messages].sort((a, b) => b[0].length - a[0].length);
export function translate(text: string, target: Locale = locale): string {
  if (target === "zh") return text;
  // A single pass prevents shorter entries from translating parts of an earlier result.
  return text.replace(new RegExp(ordered.map(([zh]) => zh.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g"), match => ordered.find(([zh]) => zh === match)![1]);
}
const originals = new WeakMap<Node, string>();
const rendered = new WeakMap<Node, string>();
const attributes = new WeakMap<Element, Map<string, string>>();
export function setLocale(next: Locale) {
  locale = next;
  document.documentElement.lang = next === "en" ? "en" : "zh-CN";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest("script, style, .language-switch")) continue;
    const value = node.textContent!;
    const original = rendered.get(node) === value ? originals.get(node)! : ordered.find(([, en]) => en === value)?.[0] ?? value;
    originals.set(node, original);
    node.textContent = translate(original);
    rendered.set(node, node.textContent);
  }
  document.querySelectorAll("[aria-label], [title]").forEach(element => {
    if (element.closest(".language-switch")) return;
    let saved = attributes.get(element);
    if (!saved) { saved = new Map(); attributes.set(element, saved); }
    for (const name of ["aria-label", "title"]) {
      const value = element.getAttribute(name);
      if (value === null) continue;
      // Interactive labels can change between switches. Recover the Chinese source.
      const original = ordered.find(([, en]) => en === value)?.[0] ?? value;
      if (/[\u3400-\u9fff]/.test(original)) saved.set(name, original);
      element.setAttribute(name, translate(saved.get(name) ?? original));
    }
  });
  document.querySelectorAll<HTMLButtonElement>("[data-locale]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.locale === next)));
  document.querySelectorAll<HTMLMetaElement>('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach(meta => {
    if (!meta.dataset.zh) meta.dataset.zh = meta.content;
    meta.content = next === "en" ? "Exploring AI and code, turning curious ideas into useful, playful projects, and sharing the discoveries along the way." : meta.dataset.zh;
  });
  document.title = next === "en" ? "Migu CHN | Curiosity knows no bounds" : "咪咕看见小黑｜好奇心，没有边界";
  document.querySelectorAll<HTMLMetaElement>('meta[property="og:title"], meta[name="twitter:title"]').forEach(meta => { meta.content = document.title; });
  const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = next === "en" ? "en_US" : "zh_CN";
  try { localStorage.setItem("migu-locale", next); } catch { /* Storage may be disabled. */ }
}
export function initLocale() {
  let preferred: Locale = "zh";
  try {
    const saved = localStorage.getItem("migu-locale");
    preferred = saved === "en" || saved === "zh" ? saved : navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  } catch { preferred = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"; }
  document.querySelectorAll<HTMLButtonElement>("[data-locale]").forEach(button => button.addEventListener("click", () => setLocale(button.dataset.locale as Locale)));
  setLocale(preferred);
}
