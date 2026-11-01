import { binaryTree, lanes, lesson, tree } from "../snap.js";

const LABELS = [null, 4, 2, 7, 1, 3, 6, 9];

export default lesson({
  id: "level-order",
  chapter: "二叉树",
  title: "层序遍历",
  solved: "4 / 2 7 / 1 3 6 9",
  thesis: "队列保证先来的先走。每一轮把当前队列里的结点全部弹出，它们就是同一层；它们的孩子排到队尾，成为下一层。",
  complexity: "时间 O(n)，空间是这一层最多有多少个结点。",
  build() {
    const frames = [];
    const lines = [];
    let queue = [1];
    while (queue.length) {
      const layer = queue;
      queue = [];
      const values = [];
      layer.forEach((index) => {
        values.push(LABELS[index]);
        if (LABELS[index * 2] != null) queue.push(index * 2);
        if (LABELS[index * 2 + 1] != null) queue.push(index * 2 + 1);
      });
      lines.push(values.join(" "));
      const tones = {};
      layer.forEach((index) => {
        tones[index] = "on";
      });
      frames.push(tree(binaryTree(LABELS, tones), { title: `这一层 ${values.join(" ")}`, note: `下一层在队列里等着：${queue.map((index) => LABELS[index]).join(" ") || "没有了"}。` }));
      frames.push(lanes([{ name: "本层", items: values, hot: null }], { title: lines.join(" / "), note: "一层结束再开始下一层，所以答案天然按层分开。" }));
    }
    return frames;
  },
});
