import { lesson, tree } from "../snap.js";

function make(value, left = null, right = null) {
  return { value, left, right, tone: "" };
}

function layout(root) {
  const nodes = [];
  const edges = [];
  let serial = 0;
  function walk(node, depth, left, right, parent) {
    if (!node) return;
    serial += 1;
    const id = String(serial);
    nodes.push({
      id,
      label: String(node.value),
      x: (left + right) / 2,
      y: 14 + depth * 30,
      tone: node.tone,
    });
    if (parent) edges.push([parent, id]);
    walk(node.left, depth + 1, left, (left + right) / 2, id);
    walk(node.right, depth + 1, (left + right) / 2, right, id);
  }
  walk(root, 0, 8, 92, null);
  return { nodes, edges };
}

function clearTones(node) {
  if (!node) return;
  node.tone = "";
  clearTones(node.left);
  clearTones(node.right);
}

export default lesson({
  id: "invert-tree",
  chapter: "二叉树",
  title: "翻转二叉树",
  solved: "4 7 9 6 2 3 1",
  thesis: "翻转就是交换每个结点的左右孩子。孩子的整棵子树跟着走。先换自己，再换左右子树，镜像就出来了。",
  complexity: "时间 O(n)，每个结点交换一次。",
  build() {
    const root = make(4, make(2, make(1), make(3)), make(7, make(6), make(9)));
    const frames = [];
    const preorder = (node, out = []) => {
      if (!node) return out;
      out.push(node.value);
      preorder(node.left, out);
      preorder(node.right, out);
      return out;
    };
    const shoot = (node, title, note) => {
      clearTones(root);
      if (node) node.tone = "on";
      frames.push(tree(layout(root), { title, note }));
    };
    const invert = (node) => {
      if (!node) return;
      [node.left, node.right] = [node.right, node.left];
      shoot(node, `交换 ${node.value} 的左右子树`, "子树整个对调，不用把叶子一颗颗搬。");
      invert(node.left);
      invert(node.right);
    };
    shoot(root, "从根开始", "镜像只改左右，不改谁是谁的祖先。");
    invert(root);
    const order = preorder(root).join(" ");
    shoot(null, order, `翻转之后的前序是 ${order}。原来的左子树现在整棵在右边。`);
    return frames;
  },
});
