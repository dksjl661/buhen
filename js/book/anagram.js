import { cells, lesson } from "../snap.js";

export default lesson({
  id: "anagram",
  chapter: "哈希表",
  title: "有效的字母异位词",
  solved: "是异位词",
  thesis: "异位词就是每种字母的个数都一样，只是顺序不同。用一张计数表：第一串加，第二串减。最后全是 0，才是异位词。",
  complexity: "时间 O(n)，空间是字母表大小，这里是常数。",
  build() {
    const a = "eat".split("");
    const b = "tea".split("");
    const count = { e: 0, a: 0, t: 0 };
    const frames = [];
    const show = (title, note, onIndex, source) => {
      frames.push(
        cells(source, {
          title,
          note,
          on: [onIndex],
          below: ["e", "a", "t"].map((key) => `${key}:${count[key]}`),
          belowLabel: "计数",
        }),
      );
    };
    a.forEach((char, index) => {
      count[char] += 1;
      show(`第一串的 ${char} 加一`, "eat 负责加。计数变成正，表示这个字母还欠着第二串来对上。", index, a);
    });
    b.forEach((char, index) => {
      count[char] -= 1;
      show(`第二串的 ${char} 减一`, "tea 负责减。减完如果没有负数，并且最后全是 0，两边就一样多。", index, b);
    });
    const ok = Object.values(count).every((value) => value === 0);
    frames.push(
      cells(["e:0", "a:0", "t:0"], {
        title: ok ? "是异位词" : "不是异位词",
        note: "e、a、t 都回到 0。eat 和 tea 用的字母种类和个数完全一样。",
        on: [0, 1, 2],
      }),
    );
    return frames;
  },
});
