import { lanes, lesson } from "../snap.js";

export default lesson({
  id: "topo-sort",
  chapter: "图论",
  title: "拓扑排序",
  solved: "0 → 1 → 2 → 3",
  thesis: "有向无环图里，入度为 0 的点没有先修课，可以先学。把它学掉，邻居的入度减一。新出现的入度 0 再进队列。队列排出来的顺序就是一种合法的学习顺序。",
  complexity: "时间 O(点 + 边)。",
  build() {
    const names = ["0", "1", "2", "3"];
    const adj = [[1, 2], [3], [3], []];
    const indegree = [0, 1, 1, 2];
    const frames = [];
    const queue = [0];
    const order = [];
    const snap = (title, note) => {
      frames.push(
        lanes(
          [
            { name: "入度", items: indegree.map(String), hot: null },
            { name: "队列", items: queue.slice(), hot: "start" },
            { name: "顺序", items: order.slice(), hot: "end" },
          ],
          { title, note },
        ),
      );
    };
    snap("0 没有先修课", "边是 0→1、0→2、1→3、2→3。先学入度为 0 的课。");
    while (queue.length) {
      const course = queue.shift();
      order.push(names[course]);
      adj[course].forEach((next) => {
        indegree[next] -= 1;
        if (indegree[next] === 0) queue.push(next);
      });
      snap(
        order.join(" → "),
        `${names[course]} 学完，后继的入度减一。${queue.length ? `接下来可以学 ${queue.join("、")}` : "没有新的课进队列"}。`,
      );
    }
    frames.push(
      lanes([{ name: "顺序", items: order.slice(), hot: null }], {
        title: "0 → 1 → 2 → 3",
        note: "3 要等 1 和 2 都学完。0 必须在最前面。这是一种拓扑序，不是唯一的一种。",
      }),
    );
    return frames;
  },
});
