import { chain, lesson } from "../snap.js";

export default lesson({
  id: "reverse-list",
  chapter: "链表",
  title: "反转链表",
  solved: "4 → 3 → 2 → 1",
  thesis: "三个指针就够：prev 是已经反转好的前一段，curr 是正在翻转的结点，next 先记住原来的后继，不然一改指针链表就断了。",
  complexity: "时间 O(n)，空间 O(1)。",
  build() {
    const labels = ["1", "2", "3", "4"];
    const nextOf = [1, 2, 3, null];
    const frames = [];
    let prev = null;
    let curr = 0;
    const draw = (title, note) => {
      frames.push(
        chain(
          labels.map((label, index) => ({
            label,
            tag: index === prev ? "prev" : index === curr ? "curr" : "",
            tone: index === curr ? "on" : index === prev ? "pick" : "",
            points: nextOf[index] === null ? "空" : labels[nextOf[index]],
          })),
          { title, note },
        ),
      );
    };
    draw("1 → 2 → 3 → 4", "prev 开始是空。curr 指着 1。每一步只改 curr 的下一个指针。");
    while (curr !== null) {
      const nxt = nextOf[curr];
      nextOf[curr] = prev;
      draw(
        `让 ${labels[curr]} 改指向 ${prev === null ? "空" : labels[prev]}`,
        nxt === null ? "后面没有结点了，这一步改完就可以收尾。" : `下一步要处理的是 ${labels[nxt]}，所以得先记住它。`,
      );
      prev = curr;
      curr = nxt;
    }
    const order = [];
    let cursor = prev;
    const guard = new Set();
    while (cursor !== null && !guard.has(cursor)) {
      guard.add(cursor);
      order.push(labels[cursor]);
      cursor = nextOf[cursor];
    }
    draw("4 → 3 → 2 → 1", `prev 停在新的头结点。整条链现在是 ${order.join(" → ")}。`);
    return frames;
  },
});
