import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "eval-rpn",
  chapter: "栈与队列",
  title: "逆波兰表达式",
  solved: "9",
  thesis: "数字入栈。遇到运算符，就弹出两个数，先弹出的是右操作数，后弹出的是左操作数，算完再压回去。表达式扫完，栈里只剩答案。",
  complexity: "时间 O(n)，空间 O(n)。",
  build() {
    const tokens = ["2", "1", "+", "3", "*"];
    const stack = [];
    const frames = [];
    const ops = {
      "+": (a, b) => a + b,
      "*": (a, b) => a * b,
    };
    tokens.forEach((token) => {
      if (ops[token]) {
        const right = stack.pop();
        const left = stack.pop();
        const value = ops[token](left, right);
        stack.push(value);
        frames.push(
          lanes([{ name: "栈", items: stack.slice(), hot: "end" }], {
            title: `${left} ${token} ${right} = ${value}`,
            note: "先弹出的是右边的数。算完的结果马上入栈，留给后面的运算符。",
          }),
        );
      } else {
        stack.push(Number(token));
        frames.push(lanes([{ name: "栈", items: stack.slice(), hot: "end" }], { title: `${token} 入栈`, note: "数字先攒着，运算符来了再算。" }));
      }
    });
    frames.push(lanes([{ name: "答案", items: [stack[0]], hot: 0 }], { title: "9", note: "(2 + 1) * 3。逆波兰把运算符写在两个数后面，所以不用括号。"}));
    return frames;
  },
});
