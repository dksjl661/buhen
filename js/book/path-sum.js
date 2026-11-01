import { binaryTree, lesson, tree } from "../snap.js";

const LABELS = [null, 4, 2, 7, 1, 3, 6, 9];

export default lesson({
  id: "path-sum",
  chapter: "二叉树",
  title: "路径总和",
  solved: "4 → 2 → 1",
  thesis: "从根往下减。到了叶子，剩下的目标如果刚好是叶子的值，这条根到叶子的路径就成立。不是叶子，就把剩下的目标交给左右孩子。",
  complexity: "时间 O(n)，最坏把每条根到叶子的路径都看一遍。",
  build() {
    const frames = [];
    const path = [];
    let found = null;
    const walk = (index, remain) => {
      if (LABELS[index] == null || found) return;
      path.push(LABELS[index]);
      const next = remain - LABELS[index];
      const left = index * 2;
      const right = index * 2 + 1;
      const leaf = LABELS[left] == null && LABELS[right] == null;
      frames.push(
        tree(binaryTree(LABELS, { [index]: "on" }), {
          title: leaf ? `叶子 ${LABELS[index]}，还差 ${next}` : `走到 ${LABELS[index]}，还差 ${next}`,
          note: leaf ? (next === 0 ? "差刚好是 0，这条根到叶子的路成立。" : "叶子对不上，退回去试别的路。") : "还没到叶子，不能现在宣布成功。",
        }),
      );
      if (leaf && next === 0) found = path.slice();
      walk(left, next);
      walk(right, next);
      path.pop();
    };
    walk(1, 7);
    frames.push(
      tree(binaryTree(LABELS, { 1: "pick", 2: "pick", 4: "on" }), {
        title: "4 → 2 → 1",
        note: `目标 7。${found.join(" + ")} = 7，而且 1 是叶子。`,
      }),
    );
    return frames;
  },
});
