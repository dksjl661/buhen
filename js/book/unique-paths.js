import { lesson, matrix } from "../snap.js";

export default lesson({
  id: "unique-paths",
  chapter: "动态规划",
  title: "不同路径",
  solved: "6",
  thesis: "只能往右或往下。到达一个格子的走法，等于上面那个格子的走法加上左边那个格子的走法。第一行和第一列都只有一条直路。",
  complexity: "时间 O(mn)，空间可以压成一行。",
  build() {
    const rows = 3;
    const cols = 3;
    const grid = Array.from({ length: rows }, () => Array(cols).fill(1));
    const frames = [];
    frames.push(matrix(grid, { title: "边上只有一条路", note: "第一行只能一直向右，第一列只能一直向下。", on: [[0, 0]] }));
    for (let r = 1; r < rows; r += 1) {
      for (let c = 1; c < cols; c += 1) {
        grid[r][c] = grid[r - 1][c] + grid[r][c - 1];
        frames.push(
          matrix(grid, {
            title: r === rows - 1 && c === cols - 1 ? "6" : `格子 (${r},${c}) 有 ${grid[r][c]} 种`,
            note: `上面是 ${grid[r - 1][c]}，左边是 ${grid[r][c - 1]}。到达这里的走法是两者相加。`,
            on: [[r, c]],
            pick: [[r - 1, c], [r, c - 1]],
          }),
        );
      }
    }
    return frames;
  },
});
