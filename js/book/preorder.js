import { binaryTree, lesson, tree } from "../snap.js";

const LABELS = [null, 4, 2, 7, 1, 3, 6, 9];

export default lesson({
  id: "preorder",
  chapter: "二叉树",
  title: "前序遍历",
  solved: "4 2 1 3 7 6 9",
  thesis: "前序是根、左、右。用栈模拟时，先压右孩子再压左孩子，这样下一轮弹出来的才是左孩子。",
  complexity: "时间 O(n)，每个结点进出栈一次。",
  build() {
    const frames = [];
    const seen = [];
    const stack = [1];
    const draw = (current, title, note) => {
      const tones = {};
      seen.forEach((index) => {
        tones[index] = "pick";
      });
      if (current) tones[current] = "on";
      frames.push(tree(binaryTree(LABELS, tones), { title, note }));
    };
    draw(null, "根先走", "栈里先放根。弹出一个，就把它算进答案，再把它的孩子压回去。");
    while (stack.length) {
      const current = stack.pop();
      seen.push(current);
      const right = current * 2 + 1;
      const left = current * 2;
      if (LABELS[right] != null) stack.push(right);
      if (LABELS[left] != null) stack.push(left);
      draw(current, `访问 ${LABELS[current]}`, `顺序目前是 ${seen.map((index) => LABELS[index]).join(" ")}。先压右再压左，下一轮才会先去左边。`);
    }
    draw(null, "4 2 1 3 7 6 9", "根左右。左子树整棵走完，才轮到右子树。");
    return frames;
  },
});
