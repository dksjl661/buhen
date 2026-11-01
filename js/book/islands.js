import { lesson, matrix } from "../snap.js";

export default lesson({
  id: "islands",
  chapter: "图论",
  title: "岛屿数量",
  solved: "2 座岛",
  thesis: "格子图里，上下左右连着的 1 是同一座岛。扫到一个还没看过的 1，岛屿数加一，然后用深度优先把整座岛淹成 0，避免重复计数。",
  complexity: "时间 O(mn)，每个格子最多进一次搜索。",
  build() {
    const grid = [
      ["1", "1", "0", "0"],
      ["1", "0", "0", "1"],
      ["0", "0", "1", "1"],
    ];
    const frames = [];
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    const snap = (r, c, title, note) => {
      frames.push(matrix(grid, { title, note, on: [[r, c]] }));
    };
    const sink = (r, c) => {
      if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;
      grid[r][c] = "0";
      snap(r, c, `淹没 (${r},${c})`, `这格算进第 ${count} 座岛，改成 0，以后不会再当新岛。`);
      sink(r + 1, c);
      sink(r - 1, c);
      sink(r, c + 1);
      sink(r, c - 1);
    };
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        if (grid[r][c] === "1") {
          count += 1;
          snap(r, c, `发现第 ${count} 座岛`, "从这个 1 出发，把连在一起的陆地都走完。");
          sink(r, c);
        }
      }
    }
    frames.push(matrix(grid, { title: "2 座岛", note: "左上三块连在一起是一座，右下三块是另一座。中间的 0 把它们隔开。", off: [] }));
    return frames;
  },
});
