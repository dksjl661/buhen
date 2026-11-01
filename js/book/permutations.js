import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "permutations",
  chapter: "回溯",
  title: "全排列",
  solved: "6 个排列",
  thesis: "排列在乎顺序。每一层从还没用过的数里挑一个放进路径，用过的做标记。路径长度等于数组长度，就是一个排列。",
  complexity: "n! 个排列。",
  build() {
    const nums = [1, 2, 3];
    const frames = [];
    const path = [];
    const used = [false, false, false];
    const answers = [];
    const snap = (title, note) => {
      frames.push(lanes([{ name: "路径", items: path.slice(), hot: "end" }], { title, note }));
    };
    const walk = () => {
      if (path.length === nums.length) {
        answers.push(path.slice());
        snap(`排列 ${path.join("")}`, `第 ${answers.length} 个。退回去，把最后一位换成别的数。`);
        return;
      }
      nums.forEach((value, index) => {
        if (used[index]) return;
        used[index] = true;
        path.push(value);
        snap(`放入 ${value}`, "用过的数这一支里不能再拿。回来时取消标记。");
        walk();
        path.pop();
        used[index] = false;
      });
    };
    walk();
    frames.push(lanes([{ name: "个数", items: [String(answers.length)], hot: 0 }], { title: "6 个排列", note: "3! = 6。123、132、213、231、312、321。" }));
    return frames;
  },
});
