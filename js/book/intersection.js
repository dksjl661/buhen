import { cells, lesson } from "../snap.js";

export default lesson({
  id: "intersection",
  chapter: "哈希表",
  title: "两个数组的交集",
  solved: "2",
  thesis: "交集问的是两边都出现过的值。先把较短的一边放进集合，再扫另一边。集合负责去重，所以 2 出现两次也只回答一次。",
  complexity: "时间 O(m + n)，空间 O(min(m, n))。",
  build() {
    const a = [1, 2, 2, 1];
    const b = [2, 2];
    const set = new Set();
    const frames = [];
    a.forEach((value, index) => {
      set.add(value);
      frames.push(
        cells(a, {
          title: `把 ${value} 放进集合`,
          note: `集合里现在是 ${[...set].join("、")}。重复的 1 或 2 不会占两个位子。`,
          on: [index],
          below: [...set],
          belowLabel: "集合",
        }),
      );
    });
    const answer = [];
    b.forEach((value, index) => {
      const hit = set.has(value);
      if (hit) {
        answer.push(value);
        set.delete(value);
      }
      frames.push(
        cells(b, {
          title: hit ? `${value} 在集合里，收进答案` : `${value} 已经收过了`,
          note: hit ? "收进之后从集合删掉，这样第二个 2 不会重复回答。" : "交集里的每个值只要一次。",
          on: [index],
          below: answer,
          belowLabel: "交集",
        }),
      );
    });
    frames.push(cells(answer, { title: "2", note: "两边都出现过的值只有 2。", on: [0] }));
    return frames;
  },
});
