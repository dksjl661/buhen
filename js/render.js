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

function caption(text) {
  const node = document.createElement("p");
  node.className = "caption";
  node.textContent = text;
  return node;
}

function legend(html) {
  const node = document.createElement("div");
  node.className = "legend";
  node.innerHTML = html;
  return node;
}

export function prepareStage(stage, lesson, state) {
  stage.replaceChildren();
  if (lesson.view === "binary") {
    const tiles = document.createElement("div");
    tiles.className = "tiles";
    tiles.id = "tiles";
    state.binaryArray.forEach((value, index) => {
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
    stage.append(tiles, caption("有序数组。朱砂是这一步看的中点，发灰的格子已经被扔掉。点一个数就改去找它。"));
    return;
  }
  if (lesson.view === "sort") {
    const bars = document.createElement("div");
    bars.className = "bars";
    bars.id = "bars";
    stage.append(
      bars,
      legend(
        '<span><i class="swatch cinnabar"></i>正在看</span><span><i class="swatch indigo"></i>已经固定</span><span><i class="swatch ink"></i>还没排好</span>',
      ),
    );
    return;
  }
  if (lesson.view === "graph") {
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
    stage.append(
      svg,
      frontier,
      legend(
        '<span><i class="swatch cinnabar"></i>当前</span><span><i class="swatch indigo"></i>走过</span><span><i class="swatch ring"></i>还在容器里</span>',
      ),
      caption("无向图。离开一个点时，按写好的邻居顺序看：A 看 B、C；B 看 A、D、E；C 看 A、E、F；E 看 B、C、G。"),
    );
  }
}

function cell(value, index, tag, className) {
  const node = document.createElement("div");
  node.className = className;
  const tags = document.createElement("span");
  tags.className = "tags";
  tags.textContent = tag || "";
  const val = document.createElement("span");
  val.className = "val";
  val.textContent = value;
  const idx = document.createElement("span");
  idx.className = "idx";
  idx.textContent = index === undefined || index === null ? "" : String(index);
  node.append(tags, val, idx);
  return node;
}

function paintCells(stage, frame) {
  const wrap = document.createElement("div");
  const row = document.createElement("div");
  row.className = "cells";
  frame.values.forEach((value, index) => {
    const classes = ["cell"];
    if (frame.on?.includes(index)) classes.push("is-on");
    if (frame.pick?.includes(index)) classes.push("is-pick");
    if (frame.off?.includes(index)) classes.push("is-off");
    row.appendChild(cell(value, index, frame.tags?.[index] || frame.tags?.[String(index)], classes.join(" ")));
  });
  wrap.appendChild(row);
  if (frame.below) {
    const label = document.createElement("p");
    label.className = "caption";
    label.textContent = frame.belowLabel || "结果";
    const under = document.createElement("div");
    under.className = "cells";
    frame.below.forEach((value, index) => {
      const classes = ["cell"];
      if (frame.belowOn?.includes(index)) classes.push("is-pick");
      under.appendChild(cell(String(value), index, "", classes.join(" ")));
    });
    wrap.append(label, under);
  }
  stage.replaceChildren(wrap);
}

function paintMatrix(stage, frame) {
  const grid = document.createElement("div");
  grid.className = "matrix";
  frame.rows.forEach((row, r) => {
    const line = document.createElement("div");
    line.className = "cells";
    row.forEach((value, c) => {
      const hit = frame.on?.some(([rr, cc]) => rr === r && cc === c);
      const dim = frame.off?.some(([rr, cc]) => rr === r && cc === c);
      const classes = ["cell", "is-matrix"];
      if (hit) classes.push("is-on");
      if (dim) classes.push("is-off");
      line.appendChild(cell(value, "", "", classes.join(" ")));
    });
    grid.appendChild(line);
  });
  stage.replaceChildren(grid);
}

function paintLanes(stage, frame) {
  const wrap = document.createElement("div");
  wrap.className = "lane-board";
  frame.rows.forEach((lane) => {
    const row = document.createElement("div");
    row.className = "lane";
    const name = document.createElement("span");
    name.className = "lane-name";
    name.textContent = lane.name;
    row.appendChild(name);
    if (!lane.items.length) {
      const empty = document.createElement("span");
      empty.className = "chip is-empty";
      empty.textContent = "空";
      row.appendChild(empty);
    }
    lane.items.forEach((item, index) => {
      const chipNode = document.createElement("span");
      const hot = lane.hot === index || (lane.hot === "end" && index === lane.items.length - 1) || (lane.hot === "start" && index === 0);
      chipNode.className = hot ? "chip is-hot" : "chip";
      chipNode.textContent = String(item);
      row.appendChild(chipNode);
    });
    wrap.appendChild(row);
  });
  stage.replaceChildren(wrap);
}

function paintChain(stage, frame) {
  const row = document.createElement("div");
  row.className = "chain";
  frame.nodes.forEach((node, index) => {
    const card = document.createElement("div");
    const classes = ["cell"];
    if (node.tone === "on") classes.push("is-on");
    if (node.tone === "pick") classes.push("is-pick");
    if (node.tone === "off") classes.push("is-off");
    card.className = classes.join(" ");
    const tags = document.createElement("span");
    tags.className = "tags";
    tags.textContent = node.tag || "";
    const val = document.createElement("span");
    val.className = "val";
    val.textContent = String(node.label);
    const points = document.createElement("span");
    points.className = "idx";
    points.textContent = node.points === undefined ? "" : `→ ${node.points}`;
    card.append(tags, val, points);
    row.appendChild(card);
    if (index < frame.nodes.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "chain-arrow";
      arrow.textContent = "→";
      row.appendChild(arrow);
    }
  });
  stage.replaceChildren(row);
}

function paintTree(stage, frame) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 640 420");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", frame.label || "二叉树");
  const sx = (value) => (Number(value) / 100) * 640;
  const sy = (value) => (Number(value) / 100) * 400 + 10;
  const pos = Object.fromEntries(frame.nodes.map((node) => [node.id, node]));
  frame.edges.forEach(([from, to]) => {
    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", sx(pos[from].x));
    line.setAttribute("y1", sy(pos[from].y));
    line.setAttribute("x2", sx(pos[to].x));
    line.setAttribute("y2", sy(pos[to].y));
    line.setAttribute("class", "edge");
    svg.appendChild(line);
  });
  frame.nodes.forEach((node) => {
    const group = document.createElementNS(SVG_NS, "g");
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", sx(node.x));
    circle.setAttribute("cy", sy(node.y));
    circle.setAttribute("r", "22");
    const classes = ["node-dot"];
    if (node.tone === "on") classes.push("is-current");
    else if (node.tone === "pick") classes.push("is-visited");
    else if (node.tone === "wait") classes.push("is-frontier");
    circle.setAttribute("class", classes.join(" "));
    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", sx(node.x));
    text.setAttribute("y", sy(node.y) + 6);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", node.tone === "on" || node.tone === "pick" ? "on-fill" : "");
    text.textContent = String(node.label);
    group.append(circle, text);
    svg.appendChild(group);
  });
  stage.replaceChildren(svg);
}

function paintDp(stage, frame) {
  const table = document.createElement("table");
  table.className = "dp";
  const head = document.createElement("tr");
  frame.head.forEach((label) => {
    const th = document.createElement("th");
    th.textContent = String(label);
    head.appendChild(th);
  });
  table.appendChild(head);
  frame.rows.forEach((row, r) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = String(row.label);
    tr.appendChild(th);
    row.cells.forEach((value, c) => {
      const td = document.createElement("td");
      td.textContent = value === "" || value === undefined ? "" : String(value);
      if (frame.on?.some(([rr, cc]) => rr === r && cc === c)) td.classList.add("is-on");
      if (frame.pick?.some(([rr, cc]) => rr === r && cc === c)) td.classList.add("is-pick");
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  stage.replaceChildren(table);
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

function paintSort(stage, frame, state) {
  const wrap = stage.querySelector("#bars");
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

function paintGraph(stage, frame) {
  const waiting = new Set(frame.frontier);
  stage.querySelectorAll("g").forEach((group) => {
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
  const row = stage.querySelector("#frontier");
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

export function paintFrame(stage, lesson, frame, state) {
  if (!frame) return;
  if (lesson.view === "binary") paintBinary(frame);
  else if (lesson.view === "sort") paintSort(stage, frame, state);
  else if (lesson.view === "graph") paintGraph(stage, frame);
  else if (frame.view === "cells") paintCells(stage, frame);
  else if (frame.view === "matrix") paintMatrix(stage, frame);
  else if (frame.view === "lanes") paintLanes(stage, frame);
  else if (frame.view === "chain") paintChain(stage, frame);
  else if (frame.view === "tree") paintTree(stage, frame);
  else if (frame.view === "dp") paintDp(stage, frame);
}
