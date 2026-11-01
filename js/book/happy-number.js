import { cells, lesson } from "../snap.js";

export default lesson({
  id: "happy-number",
  chapter: "哈希表",
  title: "快乐数",
  solved: "是快乐数",
  thesis: "把每位数字的平方加起来，得到下一个数。快乐数会走到 1。不快乐的会绕进一个圈。用集合记住见过的数，一旦重复，就是圈，不是快乐数。",
  complexity: "位数很短，实际上很快就进圈或到 1。",
  build() {
    const frames = [];
    const seen = [];
    let value = 19;
    const digits = (n) => String(n).split("").map(Number);
    while (!seen.includes(value) && value !== 1) {
      seen.push(value);
      const parts = digits(value);
      const next = parts.reduce((sum, digit) => sum + digit * digit, 0);
      frames.push(
        cells(parts, {
          title: `${value} 的数位平方和是 ${next}`,
          note: parts.map((digit) => `${digit}²`).join(" + ") + ` = ${next}。`,
          on: parts.map((_, index) => index),
          below: seen.map(String),
          belowLabel: "见过",
        }),
      );
      value = next;
    }
    frames.push(
      cells(["1"], {
        title: "是快乐数",
        note: "19 → 82 → 68 → 100 → 1。走到 1 就停。如果在见到 1 之前回到旧数字，那就在绕圈。",
        on: [0],
      }),
    );
    return frames;
  },
});
