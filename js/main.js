import { allLessons, catalog } from "./catalog.js";
import { BINARY_ARRAY, BINARY_TARGETS, SORT_PRESETS } from "./foundations.js";
import { paintFrame, prepareStage } from "./render.js";

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
  binaryArray: BINARY_ARRAY,
};

const toc = document.querySelector("#toc");
const variants = document.querySelector("#variants");
const stage = document.querySelector("#stage");
const note = document.querySelector(".note");

function lessons() {
  return allLessons();
}

function current() {
  return lessons().find((item) => item.id === state.lesson) || lessons()[0];
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
  state.frames = current().build(state);
  state.frame = Math.min(state.frame, Math.max(0, state.frames.length - 1));
}

function renderToc() {
  toc.replaceChildren();
  let count = 0;
  catalog().forEach((chapter) => {
    const heading = document.createElement("p");
    heading.className = "toc-chapter";
    heading.textContent = chapter.title;
    toc.appendChild(heading);
    chapter.lessons.forEach((item) => {
      count += 1;
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.lesson = item.id;
      button.classList.toggle("is-on", item.id === current().id);
      const num = document.createElement("span");
      num.className = "toc-num";
      num.textContent = String(count).padStart(2, "0");
      const name = document.createElement("span");
      name.className = "toc-name";
      name.textContent = item.title;
      button.append(num, name);
      toc.appendChild(button);
    });
  });
  document.querySelector("#colophon").textContent = `二〇二六 · ${count} 题`;
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
  const lesson = current();
  if (lesson.view === "binary") {
    BINARY_TARGETS.forEach((target) => {
      const missing = !BINARY_ARRAY.includes(target);
      variants.appendChild(chip(missing ? `${target} · 没有` : String(target), { target }, target === state.target));
    });
    const hint = document.createElement("span");
    hint.className = "variant-note";
    hint.textContent = "或点数组里的数";
    variants.appendChild(hint);
    return;
  }
  if (lesson.view === "sort") {
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
  if (lesson.view === "graph") {
    variants.appendChild(chip("广度优先", { graph: "bfs" }, state.graphMode === "bfs"));
    variants.appendChild(chip("深度优先", { graph: "dfs" }, state.graphMode === "dfs"));
  }
}

function renderHead() {
  const lesson = current();
  document.querySelector("#kicker").textContent = lesson.chapter;
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#thesis").textContent = lesson.thesis;
  document.querySelector("#complexity").textContent = lesson.complexity || "";
  renderToc();
  renderVariants();
  const active = toc.querySelector("button.is-on");
  if (active) active.scrollIntoView({ block: "nearest" });
}

function paint() {
  const frame = state.frames[state.frame];
  const lesson = current();
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
  paintFrame(stage, lesson, frame, state);
}

function enterLesson() {
  stop();
  state.frame = 0;
  const lesson = current();
  if (location.hash !== `#${lesson.id}`) history.replaceState(null, "", `#${lesson.id}`);
  renderHead();
  prepareStage(stage, lesson, state);
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
  if (!tile || current().view !== "binary") return;
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
  const target = event.target;
  if (target instanceof Element && target.closest("button") && (event.key === " " || event.key === "Enter")) return;
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
  if (current().view === "sort") paint();
});

window.addEventListener("hashchange", () => {
  const id = location.hash.slice(1);
  if (!id || id === state.lesson || !lessons().some((item) => item.id === id)) return;
  state.lesson = id;
  enterLesson();
});

const initial = location.hash.slice(1);
if (initial && lessons().some((item) => item.id === initial)) state.lesson = initial;
enterLesson();
