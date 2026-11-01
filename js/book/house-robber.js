import { cells, lesson } from "../snap.js";

export default lesson({
  id: "house-robber",
  chapter: "动态规划",
  title: "打家劫舍",
  solved: "12",
  thesis: "相邻的房子不能都偷。到第 i 家时，要么偷它加上 i-2 的最好结果，要么不偷它、沿用 i-1 的最好结果。取更大的那个。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const nums = [2, 7, 9, 3, 1];
    const frames = [];
    let prev2 = 0;
    let prev1 = 0;
    nums.forEach((money, index) => {
      const take = prev2 + money;
      const skip = prev1;
      const best = Math.max(take, skip);
      frames.push(
        cells(nums, {
          title: index === nums.length - 1 ? "12" : `前 ${index + 1} 家最多 ${best}`,
          note: `偷这家得 ${take}，不偷得 ${skip}。取 ${best}。下一家不能和这家同时偷。`,
          on: [index],
          below: [String(best)],
          belowLabel: "目前最多",
        }),
      );
      prev2 = prev1;
      prev1 = best;
    });
    return frames;
  },
});
