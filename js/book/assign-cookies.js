import { cells, lesson } from "../snap.js";

export default lesson({
  id: "assign-cookies",
  chapter: "贪心",
  title: "分发饼干",
  solved: "2 个孩子",
  thesis: "胃口小的孩子更容易满足。两边都从小到大排序，用当前最小的饼干去试当前胃口最小的孩子。够就发给他，不够就换一块更大的饼干，孩子先别跳过。",
  complexity: "时间 O(n log n)，排序占主导。",
  build() {
    const kids = [1, 2];
    const cookies = [1, 2, 3];
    const frames = [];
    let child = 0;
    let cookie = 0;
    let fed = 0;
    const snap = (title, note) => {
      frames.push(
        cells(kids, {
          title,
          note,
          on: child < kids.length ? [child] : [],
          below: cookies,
          belowLabel: "饼干",
          belowOn: cookie < cookies.length ? [cookie] : [],
        }),
      );
    };
    snap("孩子胃口 1、2，饼干 1、2、3", "小饼干优先拿去满足胃口小的孩子。能用 1 满足的人，就不要把 3 浪费在他身上。");
    while (child < kids.length && cookie < cookies.length) {
      if (cookies[cookie] >= kids[child]) {
        fed += 1;
        snap(`饼干 ${cookies[cookie]} 够胃口 ${kids[child]}`, `发给这个孩子。已经满足 ${fed} 个。`);
        child += 1;
        cookie += 1;
      } else {
        snap(`饼干 ${cookies[cookie]} 不够胃口 ${kids[child]}`, "这块饼干谁也满足不了更饿的，丢掉，换下一块。");
        cookie += 1;
      }
    }
    frames.push(cells([String(fed)], { title: "2 个孩子", note: "饼干 1 给胃口 1，饼干 2 给胃口 2。第三块用不上。两个孩子都分到了。" }));
    return frames;
  },
});
