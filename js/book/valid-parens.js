import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "valid-parens",
  chapter: "栈与队列",
  title: "有效的括号",
  solved: "有效",
  thesis: "左括号入栈。右括号必须和栈顶的左括号成对，成对就把栈顶弹出。扫完栈还是空的，才是有效的。后出现的左括号，要先被关上。",
  complexity: "时间 O(n)，空间 O(n)。",
  build() {
    const text = "()[]{}".split("");
    const pair = { ")": "(", "]": "[", "}": "{" };
    const stack = [];
    const frames = [];
    let ok = true;
    text.forEach((char) => {
      if (!pair[char]) {
        stack.push(char);
        frames.push(lanes([{ name: "栈", items: stack.slice(), hot: "end" }], { title: `${char} 入栈`, note: "左括号先记着，等对应的右括号来关。" }));
      } else if (stack.at(-1) === pair[char]) {
        stack.pop();
        frames.push(lanes([{ name: "栈", items: stack.slice(), hot: "end" }], { title: `${char} 配对，弹出`, note: `栈顶正是 ${pair[char]}。后进的先关，这就是栈。` }));
      } else {
        ok = false;
        frames.push(lanes([{ name: "栈", items: stack.slice(), hot: "end" }], { title: `${char} 对不上`, note: "栈顶不是它要的左括号，或者栈已经空了。" }));
      }
    });
    frames.push(
      lanes([{ name: "栈", items: stack.slice(), hot: null }], {
        title: ok && stack.length === 0 ? "有效" : "无效",
        note: "三种括号都按后进先出关上，栈空了。",
      }),
    );
    return frames;
  },
});
