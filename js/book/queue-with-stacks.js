import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "queue-with-stacks",
  chapter: "栈与队列",
  title: "用栈实现队列",
  solved: "弹出 1",
  thesis: "一个栈只负责进，一个栈只负责出。出栈空了，才把进栈里的东西全部倒过来。倒一次，顺序就从后进先出变成了先进先出。",
  complexity: "每个元素最多进一次、倒一次、出一次，摊还是 O(1)。",
  build() {
    const inbox = [];
    const outbox = [];
    const frames = [];
    const snap = (title, note) => {
      frames.push(
        lanes(
          [
            { name: "进栈", items: inbox.slice(), hot: "end" },
            { name: "出栈", items: outbox.slice(), hot: "end" },
          ],
          { title, note },
        ),
      );
    };
    [1, 2, 3].forEach((value) => {
      inbox.push(value);
      snap(`${value} 进入进栈`, "队列的入队只往进栈压，先不倒。");
    });
    if (!outbox.length) {
      while (inbox.length) outbox.push(inbox.pop());
      snap("出栈是空的，把进栈倒过来", "1 最先进来，倒完之后它在出栈的栈顶。");
    }
    const value = outbox.pop();
    snap("弹出 1", `出栈弹出 ${value}。这就是队列的出队：先进来的先出去。2 和 3 还在出栈里等着。`);
    return frames;
  },
});
