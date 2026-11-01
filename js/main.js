import {
  bfsFrames,
  binarySearchFrames,
  bubbleFrames,
  dfsFrames,
  insertionFrames,
  selectionFrames,
} from "./algo.js";

const LESSONS = [
  {
    id: "binary",
    index: "01",
    kicker: "查找",
    title: "二分查找",
    thesis:
      "只在有序的数据里成立。每次只问正中间那一个数，然后把不可能的一半扔掉。人能做对，靠的是左右边界，不是把整排再扫一遍。比较次数大约是 log₂n。",
  },
  {
    id: "sort",
    index: "02",
    kicker: "排序",
    title: "三种入门排序",
    thesis:
      "同一排数，三种手法。冒泡动的是邻居，选择每一轮只交换一次，插入守着一段始终有序的前缀。这三种都是 O(n²)，这里看的是不变量，不是谁的常数更小。换算法时，数据保持不动。",
  },
  {
    id: "graph",
    index: "03",
    kicker: "图",
    title: "广度与深度",
    thesis:
      "图没有从左到右。走法由容器决定：队列让近的先走完，栈让一条路先走到底。点和边没变，变的是谁先被看见。工作量都跟着点和边的数量走，差别在顺序。",
  },
];

const BINARY_ARRAY = [3, 7, 12, 18, 21, 27, 33, 42, 48, 55, 61, 70, 76, 84, 91];
const BINARY_TARGETS = [42, 7, 91, 27, 50];

const SORT_PRESETS = {
  mixed: [72, 18, 90, 34, 12, 63, 45, 27],
  nearly: [12, 18, 34, 27, 45, 63, 72, 90],
  reverse: [90, 72, 63, 45, 34, 27, 18, 12],
};

const SORT_ALGOS = {
  bubble: bubbleFrames,
  selection: selectionFrames,
  insertion: insertionFrames,
};

const SVG_NS = "http://www.w3.org/2000/svg";
const GRAPH_NODES = [
  { id: "A", x: 320, y: 48 },
  { id: "B", x: 168, y: 148 },
  { id: "C", x: 472, y: 148 },
  { id: "D", x: 78, y: 268 },
  { id: "E", x: 292, y: 276 },
  { id: "F", x: 528, y: 268 },
  { id: "G", x: 292, y: 386 },
];
const GRAPH_EDGES = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "E"],
  ["C", "F"],
  ["E", "G"],
];

const state = {
  lesson: "binary",
  frame: 0,
  frames: [],
  playing: false,
  timer: null,
  speed: 560,
  target: 42,
  sortAlgo: "bubble",
  sortPreset: "mixed",
  sortData: SORT_PRESETS.mixed.slice(),
  graphMode: "bfs",
};

const toc = document.querySelector("#toc");
const variants = document.querySelector("#variants");
const stage = document.querySelector("#stage");
const note = document.querySelector(".note");

function lessonMeta() {
  return LESSONS.find((item) => item.id === state.lesson);
}

function stop() {
  state.playing = false;
  clearTimeout(state.timer);
}

function shuffle(values) {
  const next = values.slice();
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  if (next.every((value, index) => value === values[index]) && next.length > 1) {
    [next[0], next[1]] = [next[1], next[0]];
  }
  return next;
}

function rebuildFrames() {
  if (state.lesson === "binary") {
    state.frames = binarySearchFrames(BINARY_ARRAY, state.target);
  } else if (state.lesson === "sort") {
    state.frames = SORT_ALGOS[state.sortAlgo](state.sortData);
  } else {
    state.frames = state.graphMode === "bfs" ? bfsFrames() : dfsFrames();
  }
  state.frame = Math.min(state.frame, state.frames.length - 1);
}

function renderToc() {
  toc.replaceChildren();
  LESSONS.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lesson = item.id;
    button.classList.toggle("is-on", item.id === state.lesson);
    const num = document.createElement("span");
    num.className = "toc-num";
    num.textContent = item.index;
    const name = document.createElement("span");
    const title = document.createElement("span");
    title.className = "toc-name";
    title.textContent = item.title;
    const kicker = document.createElement("span");
    kicker.className = "toc-kicker";
    kicker.textContent = item.kicker;
    name.append(title, kicker);
    button.append(num, name);
    toc.appendChild(button);
  });
}

function chip(label, attrs, on) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  Object.entries(attrs).forEach(([key, value]) => {
    button.dataset[key] = value;
  });
  button.classList.toggle("is-on", on);
  return button;
}

function renderVariants() {
  variants.replaceChildren();
  if (state.lesson === "binary") {
    BINARY_TARGETS.forEach((target) => {
      const missing = !BINARY_ARRAY.includes(target);
      variants.appendChild(
        chip(missing ? `${target} · 没有` : String(target), { target }, target === state.target),
      );
    });
    const hint = document.createElement("span");
    hint.className = "variant-note";
    hint.textContent = "或点数组里的数";
    variants.appendChild(hint);
    return;
  }
  if (state.lesson === "sort") {
    [
      ["bubble", "冒泡"],
      ["selection", "选择"],
      ["insertion", "插入"],
    ].forEach(([id, label]) => {
      variants.appendChild(chip(label, { algo: id }, state.sortAlgo === id));
    });
    [
      ["mixed", "乱序"],
      ["nearly", "几乎有序"],
      ["reverse", "逆序"],
    ].forEach(([id, label]) => {
      variants.appendChild(chip(label, { preset: id }, state.sortPreset === id));
    });
    variants.appendChild(chip("打乱", { shuffle: "1" }, state.sortPreset === "shuffle"));
    return;
  }
  variants.appendChild(chip("广度优先", { graph: "bfs" }, state.graphMode === "bfs"));
  variants.appendChild(chip("深度优先", { graph: "dfs" }, state.graphMode === "dfs"));
}

function renderHead() {
  const meta = lessonMeta();
  document.querySelector("#kicker").textContent = meta.kicker;
  document.querySelector("#lesson-title").textContent = meta.title;
  document.querySelector("#thesis").textContent = meta.thesis;
  renderToc();
  renderVariants();
}

function caption(text) {
  const node = document.createElement("p");
  node.className = "caption";
  node.textContent = text;
  return node;
}

function buildStage() {
  stage.replaceChildren();
  if (state.lesson === "binary") {
    const tiles = document.createElement("div");
    tiles.className = "tiles";
    tiles.id = "tiles";
    BINARY_ARRAY.forEach((value, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.dataset.index = String(index);
      tile.dataset.value = String(value);
      const tags = document.createElement("span");
      tags.className = "tags";
      const val = document.createElement("span");
      val.className = "val";
      val.textContent = String(value);
      const idx = document.createElement("span");
      idx.className = "idx";
      idx.textContent = String(index);
      tile.append(tags, val, idx);
      tiles.appendChild(tile);
    });
    stage.append(
      tiles,
      caption("有序数组。朱砂是这一步看的中点，发灰的格子已经被扔掉。点一个数就改去找它。"),
    );
    return;
  }
  if (state.lesson === "sort") {
    const bars = document.createElement("div");
    bars.className = "bars";
    bars.id = "bars";
    const legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML =
      '<span><i class="swatch cinnabar"></i>正在看</span><span><i class="swatch indigo"></i>已经固定</span><span><i class="swatch ink"></i>还没排好</span>';
    stage.append(bars, legend);
    return;
  }
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 640 440");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "一张七个点的图，从 A 出发");
  const pos = Object.fromEntries(GRAPH_NODES.map((node) => [node.id, node]));
  GRAPH_EDGES.forEach(([from, to]) => {
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", pos[from].x);
    line.setAttribute("y1", pos[from].y);
    line.setAttribute("x2", pos[to].x);
    line.setAttribute("y2", pos[to].y);
    line.setAttribute("class", "edge");
    svg.appendChild(line);
  });
  GRAPH_NODES.forEach((node) => {
    const group = document.createElementNS(SVG_NS, "g");
    group.dataset.id = node.id;
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", node.x);
    circle.setAttribute("cy", node.y);
    circle.setAttribute("r", "26");
    circle.setAttribute("class", "node-dot");
    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", node.x);
    text.setAttribute("y", node.y + 7);
    text.setAttribute("text-anchor", "middle");
    text.textContent = node.id;
    group.append(circle, text);
    svg.appendChild(group);
  });
  const frontier = document.createElement("div");
  frontier.className = "frontier";
  frontier.id = "frontier";
  const legend = document.createElement("div");
  legend.className = "legend";
  legend.innerHTML =
    '<span><i class="swatch cinnabar"></i>当前</span><span><i class="swatch indigo"></i>走过</span><span><i class="swatch ring"></i>还在容器里</span>';
  stage.append(
    svg,
    frontier,
    legend,
    caption("无向图。离开一个点时，按写好的邻居顺序看：A 看 B、C；B 看 A、D、E；C 看 A、E、F；E 看 B、C、G。"),
  );
}

function paintBinary(frame) {
  document.querySelectorAll(".tile").forEach((tile) => {
    const index = Number(tile.dataset.index);
    const inRange = index >= frame.lo && index <= frame.hi;
    tile.classList.toggle("is-out", !inRange);
    tile.classList.toggle("is-mid", frame.mid === index && !frame.found);
    tile.classList.toggle("is-found", Boolean(frame.found) && frame.mid === index);
    const tags = [];
    if (index === frame.lo && index === frame.hi) tags.push("界");
    else {
      if (index === frame.lo) tags.push("左");
      if (index === frame.hi) tags.push("右");
    }
    if (index === frame.mid) tags.push("中");
    tile.querySelector(".tags").textContent = tags.join(" ");
  });
}

function paintSort(frame) {
  const wrap = document.querySelector("#bars");
  const signature = state.sortData.join(",");
  if (wrap.dataset.sig !== signature) {
    wrap.dataset.sig = signature;
    wrap.replaceChildren();
    frame.items.forEach((item) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.dataset.id = String(item.id);
      const label = document.createElement("span");
      label.textContent = String(item.value);
      bar.appendChild(label);
      wrap.appendChild(bar);
    });
  }
  const count = frame.items.length;
  const gap = 10;
  const width = wrap.clientWidth || wrap.getBoundingClientRect().width;
  const barWidth = Math.max(16, (width - gap * (count - 1)) / count);
  const values = frame.items.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  frame.items.forEach((item, index) => {
    const bar = wrap.querySelector(`[data-id="${item.id}"]`);
    const ratio = max === min ? 1 : (item.value - min) / (max - min);
    const focused = frame.focus.includes(index);
    bar.style.width = `${barWidth}px`;
    bar.style.height = `${24 + ratio * 66}%`;
    bar.style.transform = `translateX(${index * (barWidth + gap)}px)`;
    bar.classList.toggle("is-focus", focused);
    bar.classList.toggle("is-sorted", frame.sorted[index] && !focused);
  });
}

function paintGraph(frame) {
  const waiting = new Set(frame.frontier);
  document.querySelectorAll("#stage g").forEach((group) => {
    const id = group.dataset.id;
    const circle = group.querySelector("circle");
    const text = group.querySelector("text");
    const current = frame.current === id;
    const visited = frame.visited.includes(id);
    circle.classList.toggle("is-current", current);
    circle.classList.toggle("is-visited", visited && !current);
    circle.classList.toggle("is-frontier", waiting.has(id) && !visited && !current);
    text.classList.toggle("on-fill", current || (visited && !current));
  });
  const row = document.querySelector("#frontier");
  row.replaceChildren();
  const label = document.createElement("span");
  label.className = "frontier-label";
  label.textContent = frame.structure === "queue" ? "队列" : "栈";
  row.appendChild(label);
  if (!frame.frontier.length) {
    const empty = document.createElement("span");
    empty.className = "chip is-empty";
    empty.textContent = "空";
    row.appendChild(empty);
  } else {
    frame.frontier.forEach((id, index) => {
      const chipNode = document.createElement("span");
      const hot = frame.structure === "queue" ? index === 0 : index === frame.frontier.length - 1;
      chipNode.className = hot ? "chip is-hot" : "chip";
      chipNode.textContent = id;
      row.appendChild(chipNode);
    });
  }
  const hint = document.createElement("span");
  hint.className = "frontier-hint";
  hint.textContent = frame.structure === "queue" ? "左边先出" : "右边是顶";
  row.appendChild(hint);
}

function paint() {
  const frame = state.frames[state.frame];
  if (!frame) return;
  document.querySelector("#note-kicker").textContent = `第 ${state.frame + 1} 步`;
  document.querySelector("#note-title").textContent = frame.title;
  document.querySelector("#note-body").textContent = frame.note;
  document.querySelector("#counter").textContent = `${state.frame + 1} / ${state.frames.length}`;
  const play = document.querySelector("#play");
  play.textContent = state.playing ? "暂停" : "播放";
  play.setAttribute("aria-pressed", String(state.playing));
  document.querySelector("#prev").disabled = state.frame === 0;
  document.querySelector("#next").disabled = state.frame === state.frames.length - 1;
  note.classList.remove("is-fresh");
  void note.offsetWidth;
  note.classList.add("is-fresh");
  if (state.lesson === "binary") paintBinary(frame);
  else if (state.lesson === "sort") paintSort(frame);
  else paintGraph(frame);
}

function enterLesson() {
  stop();
  state.frame = 0;
  renderHead();
  buildStage();
  rebuildFrames();
  paint();
}

function schedule() {
  clearTimeout(state.timer);
  state.timer = setTimeout(() => {
    if (!state.playing) return;
    if (state.frame >= state.frames.length - 1) {
      stop();
      paint();
      return;
    }
    state.frame += 1;
    paint();
    schedule();
  }, state.speed);
}

function togglePlay() {
  if (state.playing) {
    stop();
    paint();
    return;
  }
  if (state.frame >= state.frames.length - 1) state.frame = 0;
  state.playing = true;
  paint();
  schedule();
}

function step(delta) {
  const next = state.frame + delta;
  if (next < 0 || next >= state.frames.length) return;
  stop();
  state.frame = next;
  paint();
}

toc.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.dataset.lesson === state.lesson) return;
  state.lesson = button.dataset.lesson;
  enterLesson();
});

variants.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.target) state.target = Number(button.dataset.target);
  if (button.dataset.algo) state.sortAlgo = button.dataset.algo;
  if (button.dataset.preset) {
    state.sortPreset = button.dataset.preset;
    state.sortData = SORT_PRESETS[state.sortPreset].slice();
  }
  if (button.dataset.shuffle) {
    state.sortPreset = "shuffle";
    state.sortData = shuffle(state.sortData);
  }
  if (button.dataset.graph) state.graphMode = button.dataset.graph;
  enterLesson();
});

stage.addEventListener("click", (event) => {
  const tile = event.target.closest(".tile");
  if (!tile) return;
  const value = Number(tile.dataset.value);
  if (value === state.target) return;
  state.target = value;
  enterLesson();
});

document.querySelector("#prev").addEventListener("click", () => step(-1));
document.querySelector("#next").addEventListener("click", () => step(1));
document.querySelector("#play").addEventListener("click", togglePlay);
document.querySelector(".speeds").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  state.speed = Number(button.dataset.speed);
  document.querySelectorAll(".speeds button").forEach((item) => {
    item.classList.toggle("is-on", item === button);
  });
  if (state.playing) {
    clearTimeout(state.timer);
    schedule();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.target.closest("button") && (event.key === " " || event.key === "Enter")) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    step(1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    step(-1);
  } else if (event.key === " ") {
    event.preventDefault();
    togglePlay();
  }
});

window.addEventListener("resize", () => {
  if (state.lesson === "sort") paint();
});

enterLesson();
