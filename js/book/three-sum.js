import { cells, lesson } from "../snap.js";

export default lesson({
  id: "three-sum",
  chapter: "双指针",
  title: "三数之和",
  solved: "-1,-1,2",
  thesis: "先排序，三数之和就变成：固定一个数，剩下的部分用两端夹，凑它的相反数。和太大就收右端，太小就收左端。",
  complexity: "时间 O(n²)，排序之后每个固定点配一次双指针。",
  build() {
    const arr = [-1, 0, 1, 2, -1, -4].slice().sort((a, b) => a - b);
    const frames = [];
    frames.push(cells(arr, { title: "先排序", note: "排序之后，重复的数会挨在一起，双指针才知道该往哪边收。", on: arr.map((_, index) => index) }));
    let found = null;
    for (let i = 0; i < arr.length && !found; i += 1) {
      if (i > 0 && arr[i] === arr[i - 1]) continue;
      let left = i + 1;
      let right = arr.length - 1;
      while (left < right && !found) {
        const sum = arr[i] + arr[left] + arr[right];
        frames.push(
          cells(arr, {
            title: `${arr[i]} + ${arr[left]} + ${arr[right]} = ${sum}`,
            note: sum === 0 ? "和是 0，这就是一组。" : sum > 0 ? "和太大，右指针左移，换一个更小的。" : "和太小，左指针右移，换一个更大的。",
            on: [i, left, right],
            tags: { [i]: "固定", [left]: "左", [right]: "右" },
          }),
        );
        if (sum === 0) found = [arr[i], arr[left], arr[right]];
        else if (sum > 0) right -= 1;
        else left += 1;
      }
    }
    frames.push(cells(found, { title: "-1,-1,2", note: "固定 -1 之后，另一个 -1 和 2 刚好凑成 0。排序之后重复值挨在一起，真写的时候还要跳过重复组合。", on: [0, 1, 2] }));
    return frames;
  },
});
