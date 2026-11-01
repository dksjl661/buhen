import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "combination-sum",
  chapter: "回溯",
  title: "组合总和",
  solved: "2+2+3 和 7",
  thesis: "同一个数可以重复用，所以选了它之后，下一层仍然可以从它开始。和超过目标就剪掉这一支。和刚好等于目标，记下路径。",
  complexity: "有剪枝的搜索。候选越有序，越容易提前停。",
  build() {
    const nums = [2, 3, 6, 7];
    const target = 7;
    const frames = [];
    const path = [];
    const answers = [];
    const snap = (title, note) => {
      const sum = path.reduce((acc, value) => acc + value, 0);
      frames.push(lanes([{ name: "路径", items: path.slice(), hot: "end" }], { title, note: `${note} 当前和是 ${sum}。` }));
    };
    const walk = (start) => {
      const sum = path.reduce((acc, value) => acc + value, 0);
      if (sum === target) {
        answers.push(path.slice());
        snap(`记下 ${path.join("+")}`, "刚好等于 7。");
        return;
      }
      for (let index = start; index < nums.length; index += 1) {
        if (sum + nums[index] > target) break;
        path.push(nums[index]);
        snap(`再加一个 ${nums[index]}`, "还可以继续用同样的数，所以下一层起点不变。");
        walk(index);
        path.pop();
      }
    };
    walk(0);
    frames.push(
      lanes(
        answers.map((path) => ({ name: path.join("+"), items: path, hot: null })),
        { title: "2+2+3 和 7", note: "7 本身是一种。2 用两次再加 3 是另一种。6 怎么加都会超过，被剪掉了。" },
      ),
    );
    return frames;
  },
});
