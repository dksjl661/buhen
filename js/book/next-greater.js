import { cells, lanes, lesson } from "../snap.js";

export default lesson({
  id: "next-greater",
  chapter: "单调栈",
  title: "下一个更大元素",
  solved: "4,2,4,-1,-1",
  thesis: "栈里存还没找到更大元素的下标，并且保持对应的值从栈底到栈顶递减。新来的数如果比栈顶大，栈顶的下一个更大元素就是它，弹出。比栈顶小，就压进去继续等。",
  complexity: "每个下标进出栈一次，时间 O(n)。",
  build() {
    const nums = [2, 1, 2, 4, 3];
    const answer = Array(nums.length).fill(-1);
    const stack = [];
    const frames = [];
    const snap = (title, note, on) => {
      frames.push(
        cells(nums, {
          title,
          note,
          on,
          below: answer.map(String),
          belowLabel: "下一个更大",
        }),
      );
      frames.push(lanes([{ name: "栈", items: stack.map((index) => nums[index]), hot: "end" }], { title, note }));
    };
    nums.forEach((value, index) => {
      while (stack.length && nums[stack.at(-1)] < value) {
        const prev = stack.pop();
        answer[prev] = value;
        snap(`${nums[prev]} 的下一个更大是 ${value}`, "栈顶比新数小，它等到的就是这个新数。", [prev, index]);
      }
      stack.push(index);
      snap(`${value} 入栈`, "它自己的下一个更大还不知道，先等后面更大的数。", [index]);
    });
    frames.push(cells(answer, { title: "4,2,4,-1,-1", note: "4 和 3 右边没有比自己更大的，答案是 -1。栈里剩下的都是这种。", on: [0, 1, 2, 3, 4] }));
    return frames;
  },
});
