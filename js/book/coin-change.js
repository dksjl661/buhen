import { dp, lesson } from "../snap.js";

export default lesson({
  id: "coin-change",
  chapter: "动态规划",
  title: "零钱兑换",
  solved: "3",
  thesis: "凑出金额 x 的最少硬币数，等于所有“凑出 x-coin 再加一枚 coin”里最小的那个。金额从小到大填，大金额才能用上小金额的答案。",
  complexity: "时间 O(金额 × 硬币种数)。",
  build() {
    const coins = [1, 2, 5];
    const amount = 11;
    const best = Array(amount + 1).fill(Infinity);
    best[0] = 0;
    const frames = [];
    const show = (mark, title, note) => {
      frames.push(
        dp(
          {
            head: ["金额", ...best.map((_, index) => String(index))],
            rows: [{ label: "枚数", cells: best.map((value) => (value === Infinity ? "·" : String(value))) }],
            on: [[0, mark]],
          },
          { title, note },
        ),
      );
    };
    show(0, "凑 0 元要 0 枚", "没有金额就不用硬币。后面的金额都从这里推。");
    for (let value = 1; value <= amount; value += 1) {
      coins.forEach((coin) => {
        if (value >= coin && best[value - coin] + 1 < best[value]) {
          best[value] = best[value - coin] + 1;
        }
      });
      if (value === amount || value % 3 === 0) {
        show(value, value === amount ? "3" : `凑 ${value} 最少 ${best[value]} 枚`, `用 1、2、5 去试。能从某个更小的金额再加一枚得到，就更新。`);
      }
    }
    return frames;
  },
});
