import { binaryTree, lesson, tree } from "../snap.js";

const LABELS = [null, 4, 2, 7, 1, 3, 6, 9];

export default lesson({
  id: "max-depth",
  chapter: "二叉树",
  title: "最大深度",
  solved: "深度 3",
  thesis: "空树深度是 0。一棵树的深度等于较高的那棵子树再加 1。后序从叶子把答案送回来，根最后才知道自己有多深。",
  complexity: "时间 O(n)。",
  build() {
    const frames = [];
    const depth = (index) => {
      if (LABELS[index] == null) return 0;
      frames.push(tree(binaryTree(LABELS, { [index]: "on" }), { title: `进入 ${LABELS[index]}`, note: "先问左孩子有多深，再问右孩子。自己是两者更大的那个加 1。" }));
      const left = depth(index * 2);
      const right = depth(index * 2 + 1);
      const answer = Math.max(left, right) + 1;
      frames.push(
        tree(binaryTree(LABELS, { [index]: "pick" }), {
          title: `${LABELS[index]} 的深度是 ${answer}`,
          note: `左 ${left}，右 ${right}。取较大的再加自己这一层。`,
        }),
      );
      return answer;
    };
    const answer = depth(1);
    frames.push(tree(binaryTree(LABELS, { 1: "on" }), { title: "深度 3", note: `根的深度是 ${answer}。最长的路径上有 3 个结点。` }));
    return frames;
  },
});
