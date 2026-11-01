import { cells, lesson } from "../snap.js";

export default lesson({
  id: "erase-overlap",
  chapter: "贪心",
  title: "无重叠区间",
  solved: "去掉 1 段",
  thesis: "要删掉最少的区间，让剩下的互不重叠。按终点排序，每次保留终点更早的那段：它给后面留的空位更大。新区间的起点如果还没超过上一段终点，就重叠，删掉新的。",
  complexity: "时间 O(n log n)。",
  build() {
    const raw = [
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 3],
    ];
    const items = raw.slice().sort((a, b) => a[1] - b[1]);
    const labels = items.map(([a, b]) => `${a}-${b}`);
    const frames = [];
    let end = items[0][1];
    let removed = 0;
    const kept = [0];
    frames.push(cells(labels, { title: "按终点排序", note: "终点早的优先保留。它结束得早，后面更容易接上别的区间。", on: [0] }));
    for (let index = 1; index < items.length; index += 1) {
      if (items[index][0] < end) {
        removed += 1;
        frames.push(cells(labels, { title: `${labels[index]} 重叠，删掉`, note: `起点 ${items[index][0]} 还小于已保留区间的终点 ${end}。删这段，不动终点更早的那条。`, on: [index], off: kept }));
      } else {
        end = items[index][1];
        kept.push(index);
        frames.push(cells(labels, { title: `${labels[index]} 接得上，保留`, note: `终点更新成 ${end}。`, on: [index] }));
      }
    }
    frames.push(cells(labels, { title: "去掉 1 段", note: `删掉 ${removed} 段之后，剩下的区间终点一个比一个靠后，互不重叠。`, on: kept }));
    return frames;
  },
});
