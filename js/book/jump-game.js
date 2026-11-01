import { cells, lesson } from "../snap.js";

export default lesson({
  id: "jump-game",
  chapter: "贪心",
  title: "跳跃游戏",
  solved: "到得了",
  thesis: "维护当前能到达的最远下标。扫到一个点时，如果它已经超出最远距离，说明中间断了。每个点都用自己的步数更新最远距离，能覆盖终点就行。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const nums = [2, 3, 1, 1, 4];
    const frames = [];
    let far = 0;
    for (let index = 0; index < nums.length; index += 1) {
      if (index > far) {
        frames.push(cells(nums, { title: "到不了", note: `下标 ${index} 已经超出最远的 ${far}。`, on: [index] }));
        return frames;
      }
      far = Math.max(far, index + nums[index]);
      frames.push(
        cells(nums, {
          title: far >= nums.length - 1 ? "到得了" : `最远到下标 ${far}`,
          note: `站在下标 ${index}，这一格能跳 ${nums[index]} 步，最远更新成 ${far}。`,
          on: [index],
          pick: far < nums.length ? [far] : [nums.length - 1],
        }),
      );
      if (far >= nums.length - 1) break;
    }
    return frames;
  },
});
