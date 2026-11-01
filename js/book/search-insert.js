import { cells, lesson } from "../snap.js";

export default lesson({
  id: "search-insert",
  chapter: "数组",
  title: "搜索插入位置",
  solved: "下标 1",
  thesis: "有序数组里，目标不一定存在。二分收缩到空区间时，左边界停着的位置，就是它该插入的下标。",
  complexity: "时间 O(log n)，空间 O(1)。",
  build() {
    const arr = [1, 3, 5, 6];
    const target = 2;
    const frames = [];
    let lo = 0;
    let hi = arr.length - 1;
    const snap = (title, note, mid) => {
      const tags = {};
      if (lo >= 0 && lo < arr.length) tags[lo] = "左";
      if (hi >= 0 && hi < arr.length) tags[hi] = tags[hi] ? `${tags[hi]} 右` : "右";
      if (mid !== null && mid >= 0 && mid < arr.length) tags[mid] = tags[mid] ? `${tags[mid]} 中` : "中";
      const on = [lo, hi, mid].filter((index) => index !== null && index >= 0 && index < arr.length);
      frames.push(cells(arr, { title, note, on, tags }));
    };
    snap("在 [1, 3, 5, 6] 里找 2 该放哪", "找不到也要给出位置。左边界最后会停在第一个不小于 2 的数上。", null);
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < target) {
        snap(`中点 ${arr[mid]} 比 2 小`, "左边可以丢掉，左边界收到中点右边。", mid);
        lo = mid + 1;
      } else {
        snap(`中点 ${arr[mid]} 不小于 2`, "这个位置可能就是答案，先往左再确认还有没有更靠左的。", mid);
        hi = mid - 1;
      }
    }
    frames.push(
      cells(arr, {
        title: "插在下标 1",
        note: "区间空了。下标 1 上的 3 是第一个不小于 2 的数，2 就插在它前面。",
        on: [1],
        tags: { 1: "插入" },
      }),
    );
    return frames;
  },
});
