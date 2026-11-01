import { cells, lesson } from "../snap.js";

export default lesson({
  id: "first-equal",
  chapter: "数组",
  title: "查找第一个等于目标的位置",
  solved: "下标 3",
  thesis: "有重复值时，普通二分可能停在任意一个目标上。要第一个，就在等于的时候继续往左收，同时记住这个下标。",
  complexity: "时间 O(log n)，空间 O(1)。",
  build() {
    const arr = [5, 7, 7, 8, 8, 10];
    const target = 8;
    const frames = [];
    let lo = 0;
    let hi = arr.length - 1;
    let answer = -1;
    const snap = (title, note, mid) => {
      const tags = {};
      if (lo < arr.length) tags[lo] = "左";
      if (hi >= 0 && hi < arr.length) tags[hi] = tags[hi] ? `${tags[hi]} 右` : "右";
      if (mid !== null && mid >= 0 && mid < arr.length) tags[mid] = "中";
      if (answer >= 0) tags[answer] = tags[answer] ? `${tags[answer]} 答` : "答";
      frames.push(cells(arr, { title, note, on: [mid].filter((index) => index !== null && index >= 0), pick: answer >= 0 ? [answer] : [], tags }));
    };
    snap("找第一个 8", "数组里有两个 8。等于的时候不能停，还要看左边还有没有。", null);
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] >= target) {
        if (arr[mid] === target) answer = mid;
        snap(
          arr[mid] === target ? `中点正好是 8，先记下下标 ${mid}` : `中点 ${arr[mid]} 更大`,
          "右边界收到中点左边，逼自己去找更靠左的 8。",
          mid,
        );
        hi = mid - 1;
      } else {
        snap(`中点 ${arr[mid]} 太小`, "左边没有 8，左边界收到中点右边。", mid);
        lo = mid + 1;
      }
    }
    frames.push(
      cells(arr, {
        title: "下标 3",
        note: "更左边已经没有 8 了。第一个等于目标的位置是下标 3。",
        on: [3],
        tags: { 3: "第一个" },
      }),
    );
    return frames;
  },
});
