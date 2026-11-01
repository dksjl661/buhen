import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "min-stack",
  chapter: "栈与队列",
  title: "最小栈",
  solved: "最小 2",
  thesis: "再配一个辅助栈，它的栈顶永远是当前最小值。入栈时，辅助栈压入“新值和旧最小值里更小的那个”。弹出时两个栈一起弹，最小值就能跟着退回去。",
  complexity: "每次操作 O(1)，空间 O(n)。",
  build() {
    const stack = [];
    const mins = [];
    const frames = [];
    const snap = (title, note) => {
      frames.push(
        lanes(
          [
            { name: "数据", items: stack.slice(), hot: "end" },
            { name: "最小", items: mins.slice(), hot: "end" },
          ],
          { title, note },
        ),
      );
    };
    const push = (value) => {
      stack.push(value);
      mins.push(mins.length ? Math.min(value, mins.at(-1)) : value);
      snap(`压入 ${value}`, `这一层的最小值是 ${mins.at(-1)}。辅助栈和数据栈一样高。`);
    };
    const pop = () => {
      const value = stack.pop();
      mins.pop();
      snap(`弹出 ${value}`, `辅助栈一起弹。最小值退回到 ${mins.at(-1)}。`);
    };
    push(2);
    push(1);
    push(3);
    snap("最小 1", "问最小值只看辅助栈的栈顶，不用把数据栈翻一遍。");
    pop();
    snap("最小 1", "3 弹出了。1 还在，最小值仍然是 1。");
    pop();
    snap("最小 2", "1 也弹出了。辅助栈退回到 2，最小值跟着回去。");
    return frames;
  },
});
