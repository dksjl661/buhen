import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "merge-lists",
  chapter: "链表",
  title: "合并两个有序链表",
  solved: "1 → 1 → 2 → 3 → 4 → 4",
  thesis: "两条链都是从小到大。每次只比较两个头，把更小的那个摘下来接到结果尾部。某条链空了，就把另一条剩下的整段接上。",
  complexity: "时间 O(m + n)，空间 O(1)，只是改指针。",
  build() {
    const a = [1, 2, 4];
    const b = [1, 3, 4];
    const frames = [];
    const out = [];
    let i = 0;
    let j = 0;
    const snap = (title, note) => {
      frames.push(
        lanes(
          [
            { name: "甲", items: a.slice(i), hot: a.length > i ? 0 : null },
            { name: "乙", items: b.slice(j), hot: b.length > j ? 0 : null },
            { name: "结果", items: out.slice(), hot: out.length ? "end" : null },
          ],
          { title, note },
        ),
      );
    };
    snap("两条有序链", "结果从空开始。每一步只看两条链当前的头。");
    while (i < a.length && j < b.length) {
      if (a[i] <= b[j]) {
        out.push(a[i]);
        snap(`甲的 ${a[i]} 更小或一样，接上`, "一样大时先接甲，这样相等元素保持原来的相对顺序。");
        i += 1;
      } else {
        out.push(b[j]);
        snap(`乙的 ${b[j]} 更小，接上`, "甲的头先留着，下一轮再比。");
        j += 1;
      }
    }
    while (i < a.length) {
      out.push(a[i]);
      i += 1;
    }
    while (j < b.length) {
      out.push(b[j]);
      j += 1;
    }
    snap("1 → 1 → 2 → 3 → 4 → 4", "乙先空，甲剩下的 4 直接接上。两条有序链并成一条有序链。");
    return frames;
  },
});
