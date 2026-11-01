import { cells, lesson } from "../snap.js";

export default lesson({
  id: "container-water",
  chapter: "双指针",
  title: "盛最多水的容器",
  solved: "49",
  thesis: "面积等于较矮的那根柱子乘上两根的距离。从两端开始，每次丢掉较矮的那根：矮的已经用上了最大宽度，留着它不可能更好。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const frames = [];
    let left = 0;
    let right = height.length - 1;
    let best = 0;
    let bestPair = [0, 0];
    const area = (i, j) => Math.min(height[i], height[j]) * (j - i);
    while (left < right) {
      const now = area(left, right);
      if (now > best) {
        best = now;
        bestPair = [left, right];
      }
      const dropLeft = height[left] <= height[right];
      frames.push(
        cells(height, {
          title: `宽度 ${right - left}，面积 ${now}`,
          note: dropLeft
            ? `左边更矮或一样矮。左边再往里，宽度变小，但也许换到更高的柱子。当前最好是 ${best}。`
            : `右边更矮。丢掉右边这根。当前最好是 ${best}。`,
          on: [left, right],
          tags: { [left]: "左", [right]: "右" },
        }),
      );
      if (dropLeft) left += 1;
      else right -= 1;
    }
    frames.push(
      cells(height, {
        title: "49",
        note: `最好的一对是下标 ${bestPair[0]} 和下标 ${bestPair[1]}，高度 ${height[bestPair[0]]} 和 ${height[bestPair[1]]}，宽 ${bestPair[1] - bestPair[0]}，面积 49。`,
        on: bestPair,
      }),
    );
    return frames;
  },
});
