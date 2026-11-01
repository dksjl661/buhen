import { cells, lesson } from "../snap.js";

export default lesson({
  id: "merge-intervals",
  chapter: "数组",
  title: "合并区间",
  solved: "1-6、8-10、15-18",
  thesis: "先按起点排序。然后从左往右扫：如果这一段的起点还没超过上一段的终点，它们重叠，终点取更远的那个；否则上一段就定稿。",
  complexity: "时间 O(n log n)，主要花在排序。",
  build() {
    const raw = [
      [1, 3],
      [2, 6],
      [8, 10],
      [15, 18],
    ];
    const labels = raw.map(([a, b]) => `${a}-${b}`);
    const frames = [];
    const merged = [raw[0].slice()];
    frames.push(cells(labels, { title: "已经按起点排好", note: "只和最近一段还没定稿的区间比，不用回头看更早的。", on: [0], tags: { 0: "当前" } }));
    for (let index = 1; index < raw.length; index += 1) {
      const prev = merged[merged.length - 1];
      const curr = raw[index];
      if (curr[0] <= prev[1]) {
        prev[1] = Math.max(prev[1], curr[1]);
        frames.push(
          cells(labels, {
            title: `${curr[0]} 还没超过 ${prev[0]}-${prev[1] === curr[1] ? curr[1] : prev[1]} 的旧终点`,
            note: `重叠。合并后这一段变成 ${prev[0]}-${prev[1]}。`,
            on: [index],
            pick: [index - 1],
          }),
        );
      } else {
        merged.push(curr.slice());
        frames.push(
          cells(labels, {
            title: `${labels[index]} 接不上`,
            note: `起点 ${curr[0]} 已经大于上一段终点 ${prev[1]}。上一段定稿，新开一段。`,
            on: [index],
          }),
        );
      }
    }
    frames.push(
      cells(["1-6", "8-10", "15-18"], {
        title: "1-6、8-10、15-18",
        note: "1-3 和 2-6 合成 1-6。后面两段互不重叠，原样留下。",
        on: [0, 1, 2],
      }),
    );
    return frames;
  },
});
