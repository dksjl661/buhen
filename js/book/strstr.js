import { cells, lesson } from "../snap.js";

export default lesson({
  id: "strstr",
  chapter: "字符串",
  title: "找出第一个匹配",
  solved: "下标 2",
  thesis: "针短、草垛长。对齐每一个可能的起点，逐字比较。有一个字不同就换下一个起点。全部对上，那个起点就是答案。",
  complexity: "朴素比较是 O(n·m)。针和草垛都不长时，这已经够用。",
  build() {
    const hay = "hello".split("");
    const needle = "ll".split("");
    const frames = [];
    let found = -1;
    for (let start = 0; start <= hay.length - needle.length; start += 1) {
      let ok = true;
      for (let k = 0; k < needle.length; k += 1) {
        ok = hay[start + k] === needle[k];
        frames.push(
          cells(hay, {
            title: ok ? `${hay[start + k]} 对上了` : `${hay[start + k]} 对不上 ${needle[k]}`,
            note: `起点是下标 ${start}，正在对针的第 ${k + 1} 个字。`,
            on: [start + k],
            pick: [start],
            below: needle,
            belowLabel: "要找的针",
          }),
        );
        if (!ok) break;
      }
      if (ok) {
        found = start;
        break;
      }
    }
    frames.push(
      cells(hay, {
        title: "下标 2",
        note: `hello 从下标 ${found} 开始的两个字是 ll。再往前的起点都在中途对不上。`,
        on: [found, found + 1],
      }),
    );
    return frames;
  },
});
