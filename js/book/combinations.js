import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "combinations",
  chapter: "回溯",
  title: "组合",
  solved: "6 个组合",
  thesis: "从 n 个数里拿 k 个，顺序无所谓，所以搜索时只往更大的数走，避免 1,2 和 2,1 被当成两个。路径长度到 k 就收割。",
  complexity: "组合数 C(n, k) 个答案。",
  build() {
    const n = 4;
    const k = 2;
    const frames = [];
    const path = [];
    const answers = [];
    const snap = (title, note) => {
      frames.push(lanes([{ name: "路径", items: path.slice(), hot: "end" }], { title, note }));
    };
    const walk = (start) => {
      if (path.length === k) {
        answers.push(path.slice());
        snap(`收下 ${path.join(",")}`, `这是第 ${answers.length} 个。长度已经是 ${k}，不再往下加。`);
        return;
      }
      for (let value = start; value <= n; value += 1) {
        path.push(value);
        snap(`加上 ${value}`, `还差 ${k - path.length} 个数。下一次只能从 ${value + 1} 开始，保证递增。`);
        walk(value + 1);
        path.pop();
      }
    };
    walk(1);
    frames.push(lanes([{ name: "个数", items: [String(answers.length)], hot: 0 }], { title: "6 个组合", note: "C(4, 2) = 6。分别是 12、13、14、23、24、34。" }));
    return frames;
  },
});
