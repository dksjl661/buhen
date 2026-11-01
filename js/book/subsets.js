import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "subsets",
  chapter: "回溯",
  title: "子集",
  solved: "8 个子集",
  thesis: "每个数只有选和不选两种。沿着“选”走到底，再退回来走“不选”。路径上的每一种状态都是一个子集，包括空集。",
  complexity: "一共 2ⁿ 个子集，每个子集复制进答案要 O(n)。",
  build() {
    const nums = [1, 2, 3];
    const frames = [];
    const path = [];
    const answers = [];
    const snap = (title, note) => {
      frames.push(lanes([{ name: "路径", items: path.length ? path.slice() : ["空"], hot: "end" }], { title, note }));
    };
    const walk = (start) => {
      answers.push(path.slice());
      snap(path.length ? `记下 {${path.join(",")}}` : "记下空集", `目前一共 ${answers.length} 个。接下来从下标 ${start} 往右考虑还要不要加数字。`);
      for (let index = start; index < nums.length; index += 1) {
        path.push(nums[index]);
        snap(`选 ${nums[index]}`, "选了就进入下一层。回来的时候把它删掉，这就是回溯。");
        walk(index + 1);
        path.pop();
      }
    };
    walk(0);
    frames.push(lanes([{ name: "个数", items: [String(answers.length)], hot: 0 }], { title: "8 个子集", note: "3 个数，每个选或不选，2³ = 8。空集也算。" }));
    return frames;
  },
});
