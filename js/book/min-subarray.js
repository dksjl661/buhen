import { cells, lesson } from "../snap.js";

export default lesson({
  id: "min-subarray",
  chapter: "数组",
  title: "长度最小的子数组",
  solved: "长度 2",
  thesis: "窗口右端不断纳入新数。一旦和已经不小于目标，就尽量把左端吐出去。每一轮都问：以当前右端结尾的最短窗口有多长。",
  complexity: "时间 O(n)，左右指针各自最多走 n 步。",
  build() {
    const arr = [2, 3, 1, 2, 4, 3];
    const target = 7;
    const frames = [];
    let left = 0;
    let sum = 0;
    let best = Infinity;
    let bestRange = null;
    const snap = (right, title, note) => {
      const on = [];
      for (let index = left; index <= right && index < arr.length; index += 1) on.push(index);
      const tags = { [left]: "左" };
      if (right >= 0 && right < arr.length) tags[right] = tags[right] ? `${tags[right]} 右` : "右";
      frames.push(cells(arr, { title, note, on, tags }));
    };
    snap(-1, "找和至少为 7 的最短一段", "右指针负责扩大，左指针负责在够了之后收缩。");
    for (let right = 0; right < arr.length; right += 1) {
      sum += arr[right];
      snap(right, `纳入 ${arr[right]}，窗口和是 ${sum}`, sum >= target ? "已经够了，试着丢掉左边。" : "还不够，继续往右扩。");
      while (sum >= target) {
        if (right - left + 1 < best) {
          best = right - left + 1;
          bestRange = [left, right];
        }
        snap(
          right,
          `记下长度 ${right - left + 1}`,
          `当前最短是 ${best}。然后丢掉左端的 ${arr[left]}，看还能不能更短。`,
        );
        sum -= arr[left];
        left += 1;
      }
    }
    frames.push(
      cells(arr, {
        title: "长度 2",
        note: `最短的一段是下标 ${bestRange[0]} 到 ${bestRange[1]}，也就是 ${arr[bestRange[0]]} 和 ${arr[bestRange[1]]}，和正好是 7。`,
        on: [bestRange[0], bestRange[1]],
        tags: { [bestRange[0]]: "左", [bestRange[1]]: "右" },
      }),
    );
    return frames;
  },
});
