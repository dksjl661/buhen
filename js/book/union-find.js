import { cells, lesson } from "../snap.js";

export default lesson({
  id: "union-find",
  chapter: "图论",
  title: "省份数量",
  solved: "2 个省",
  thesis: "每个人一开始自成一组，父结点指向自己。两个人是朋友，就把两组并到同一个根上。根的个数就是省份数。查找时顺便把路径压扁，下次就不用再爬一遍。",
  complexity: "接近 O(1) 每次合并，总共差不多是线性。",
  build() {
    const parent = [0, 1, 2, 3, 4];
    const frames = [];
    const find = (x) => {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    };
    const snap = (title, note, on) => {
      frames.push(cells(parent.map(String), { title, note, on, tags: { 0: "0", 1: "1", 2: "2", 3: "3", 4: "4" } }));
    };
    const unite = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) parent[ra] = rb;
      snap(
        ra === rb ? `${a} 和 ${b} 已经同组` : `合并 ${a} 和 ${b}`,
        `根分别是 ${ra} 和 ${rb}。父结点数组现在表示谁和谁连通。`,
        [a, b],
      );
    };
    snap("五个人各自一组", "下标就是人。父结点先指向自己，所以有 5 个省。", []);
    unite(0, 1);
    unite(1, 2);
    unite(3, 4);
    const roots = new Set(parent.map((_, index) => find(index)));
    snap("2 个省", `0、1、2 连成一组，3、4 连成另一组。不同的根有 ${roots.size} 个。`, [0, 3]);
    return frames;
  },
});
