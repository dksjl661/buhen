import { dp, lesson } from "../snap.js";

export default lesson({
  id: "knapsack",
  chapter: "动态规划",
  title: "0-1 背包",
  solved: "35",
  thesis: "每件物品只有拿和不拿。容量从大到小倒着更新，这样一件物品不会在同一轮被用两次。dp[容量] 表示这个容量下能装出的最大价值。",
  complexity: "时间 O(物品数 × 容量)，空间可以压成一维。",
  build() {
    const weights = [1, 3, 4];
    const values = [15, 20, 30];
    const cap = 4;
    const best = Array(cap + 1).fill(0);
    const frames = [];
    const show = (title, note, mark) => {
      frames.push(
        dp(
          {
            head: ["容量", ...best.map((_, index) => String(index))],
            rows: [{ label: "价值", cells: best.map(String) }],
            on: [[0, mark]],
          },
          { title, note },
        ),
      );
    };
    show("背包还是空的", "容量 4。物品重量 1、3、4，价值 15、20、30。", 0);
    weights.forEach((weight, index) => {
      for (let room = cap; room >= weight; room -= 1) {
        const take = best[room - weight] + values[index];
        if (take > best[room]) best[room] = take;
      }
      show(
        index === weights.length - 1 ? "35" : `考虑完价值 ${values[index]} 的这件`,
        `重量 ${weight} 的这件要么不拿，要么占用 ${weight} 的容量换 ${values[index]} 的价值。倒着更新，避免一件被拿两次。`,
        cap,
      );
    });
    return frames;
  },
});
