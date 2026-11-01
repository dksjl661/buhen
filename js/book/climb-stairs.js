import { dp, lesson } from "../snap.js";

export default lesson({
  id: "climb-stairs",
  chapter: "动态规划",
  title: "爬楼梯",
  solved: "8",
  thesis: "到第 n 级，最后一步要么从 n-1 跨 1 级，要么从 n-2 跨 2 级。两种走法互不重叠，所以 f(n) = f(n-1) + f(n-2)。这就是斐波那契，只是从楼梯的角度说。",
  complexity: "时间 O(n)，只保留前两项的话空间 O(1)。",
  build() {
    const n = 5;
    const values = [0, 1, 2];
    const frames = [];
    const show = (index, title, note) => {
      frames.push(
        dp(
          {
            head: ["台阶", ...Array.from({ length: n }, (_, i) => String(i + 1))],
            rows: [{ label: "走法", cells: Array.from({ length: n }, (_, i) => (values[i + 1] === undefined ? "" : String(values[i + 1]))) }],
            on: [[0, index - 1]],
          },
          { title, note },
        ),
      );
    };
    show(1, "1 级只有 1 种", "只能跨一步。");
    show(2, "2 级有 2 种", "一步一步，或者直接跨两级。");
    for (let index = 3; index <= n; index += 1) {
      values[index] = values[index - 1] + values[index - 2];
      show(index, index === n ? "8" : `${index} 级有 ${values[index]} 种`, `f(${index}) = f(${index - 1}) + f(${index - 2}) = ${values[index - 1]} + ${values[index - 2]}。`);
    }
    return frames;
  },
});
