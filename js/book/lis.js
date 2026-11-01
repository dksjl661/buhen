import { cells, lesson } from "../snap.js";

export default lesson({
  id: "lis",
  chapter: "动态规划",
  title: "最长递增子序列",
  solved: "长度 4",
  thesis: "dp[i] 表示以第 i 个数结尾的最长递增子序列长度。它等于左边所有比它小的数的 dp 再加 1，取最大。最后答案是 dp 里的最大值，不一定以最后一个数结尾。",
  complexity: "朴素做法时间 O(n²)。",
  build() {
    const nums = [10, 9, 2, 5, 3, 7, 101, 18];
    const dp = Array(nums.length).fill(1);
    const frames = [];
    nums.forEach((value, index) => {
      for (let prev = 0; prev < index; prev += 1) {
        if (nums[prev] < value) dp[index] = Math.max(dp[index], dp[prev] + 1);
      }
      frames.push(
        cells(nums, {
          title: index === nums.length - 1 ? "长度 4" : `以 ${value} 结尾，长度 ${dp[index]}`,
          note: `在它左边找比 ${value} 小的数接上。当前整段的最长是 ${Math.max(...dp)}。`,
          on: [index],
          below: dp.map(String),
          belowLabel: "以这里结尾的长度",
          belowOn: [index],
        }),
      );
    });
    return frames;
  },
});
