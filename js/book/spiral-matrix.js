import { lesson, matrix } from "../snap.js";

export default lesson({
  id: "spiral-matrix",
  chapter: "数组",
  title: "螺旋矩阵",
  solved: "1 2 3 6 9 8 7 4 5",
  thesis: "用四条边界把还没走过的矩形圈起来。先从左到右吃掉上边，再从上到下吃掉右边，然后下边、左边。每吃完一条，那条边界就作废。",
  complexity: "时间 O(mn)，每个格子进结果一次。",
  build() {
    const grid = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];
    const frames = [];
    const seen = grid.map((row) => row.map(() => false));
    const order = [];
    let top = 0;
    let bottom = 2;
    let left = 0;
    let right = 2;
    const snap = (r, c, title, note) => {
      const off = [];
      seen.forEach((row, rr) => row.forEach((flag, cc) => {
        if (flag && !(rr === r && cc === c)) off.push([rr, cc]);
      }));
      frames.push(matrix(grid, { title, note, on: [[r, c]], off }));
    };
    while (top <= bottom && left <= right) {
      for (let c = left; c <= right; c += 1) {
        seen[top][c] = true;
        order.push(grid[top][c]);
        snap(top, c, `向右取 ${grid[top][c]}`, `上边界这一行走完就作废。已经取出 ${order.join(" ")}。`);
      }
      top += 1;
      for (let r = top; r <= bottom; r += 1) {
        seen[r][right] = true;
        order.push(grid[r][right]);
        snap(r, right, `向下取 ${grid[r][right]}`, `右边界这一列走完就作废。已经取出 ${order.join(" ")}。`);
      }
      right -= 1;
      if (top > bottom || left > right) break;
      for (let c = right; c >= left; c -= 1) {
        seen[bottom][c] = true;
        order.push(grid[bottom][c]);
        snap(bottom, c, `向左取 ${grid[bottom][c]}`, `下边界从右往左。已经取出 ${order.join(" ")}。`);
      }
      bottom -= 1;
      for (let r = bottom; r >= top; r -= 1) {
        seen[r][left] = true;
        order.push(grid[r][left]);
        snap(r, left, `向上取 ${grid[r][left]}`, `左边界从下往上。已经取出 ${order.join(" ")}。`);
      }
      left += 1;
    }
    frames.push(matrix(grid, { title: "1 2 3 6 9 8 7 4 5", note: "矩形被一层层剥完。顺时针的顺序就是这个。", off: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] }));
    return frames;
  },
});
