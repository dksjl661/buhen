import { chain, lesson } from "../snap.js";

export default lesson({
  id: "remove-linked-val",
  chapter: "链表",
  title: "移除链表元素",
  solved: "1 → 2 → 3",
  thesis: "哑结点的下一个才是真的头。这样头结点如果正好等于要删的值，也不用单独写。当前结点的下一个等于目标，就把下一个跳过。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const nodes = [
      { label: "哑", points: "1" },
      { label: "1", points: "2" },
      { label: "2", points: "6" },
      { label: "6", points: "3" },
      { label: "3", points: "6" },
      { label: "6", points: "空" },
    ];
    const frames = [];
    const alive = nodes.map(() => true);
    const draw = (curr, title, note) => {
      frames.push(
        chain(
          nodes.map((node, index) => ({
            label: node.label,
            points: node.points,
            tag: index === curr ? "当前" : "",
            tone: !alive[index] ? "off" : index === curr ? "on" : "",
          })),
          { title, note },
        ),
      );
    };
    draw(0, "删掉所有 6", "从哑结点出发，永远检查下一个，而不是检查自己。");
    let curr = 0;
    while (nodes[curr].points !== "空") {
      const nxtLabel = nodes[curr].points;
      const nxt = nodes.findIndex((node, index) => alive[index] && node.label === nxtLabel && index > curr);
      if (nodes[nxt].label === "6") {
        alive[nxt] = false;
        nodes[curr].points = nodes[nxt].points;
        draw(curr, `下一个是 6，让 ${nodes[curr].label} 改指向 ${nodes[curr].points}`, "当前不动，因为新的下一个也许还是 6。");
      } else {
        draw(curr, `下一个是 ${nodes[nxt].label}，保留`, "不是目标，当前才前进。");
        curr = nxt;
      }
    }
    draw(curr, "1 → 2 → 3", "两个 6 都被跳过。哑结点的下一个就是新的头。");
    return frames;
  },
});
