const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const neighbourhood = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const cellSize = 12;
const gap = 3;
let grid = [];

const rand = (min, max) => ~~(Math.random() * (max - min + 1)) + min;
const spawn = (list, cell) => !find(list, cell) && list.push(cell);
const find = (list, cell) => list.find(c => c.x === cell.x && c.y === cell.y);
const offset = (cell, offs) => ({ x: cell.x + offs[0], y: cell.y + offs[1] });
const area = cell => neighbourhood.map(offs => offset(cell, offs));
const liveNeighbours = (list, cell) => area(cell).filter(n => find(list, n)).length;
const countNeighbours = (cell, i, list) => cell.n = liveNeighbours(list, cell);
const uncrowded = cell => [2, 3].indexOf(cell.n) > -1;
const fertile = cell => cell.n === 3;

function freeSpace(space, cell, index, list) {
  const newSpace = [];

  area(cell).forEach(function getSpace(pos) {
    if (!find(list, pos)) {
      const d = find(space, pos);
      if (d) d.n += 1;
      else newSpace.push({ x: pos.x, y: pos.y, n: 1 });
    }
  });

  return space.concat(newSpace);
}

function tick(list) {
  list.forEach(countNeighbours);
  const survivors = list.filter(uncrowded);
  const newCells = list.reduce(freeSpace, []).filter(fertile);
  return survivors.concat(newCells);
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

function render() {
  drawContext.fillStyle = '#f93';
  drawContext.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach(cell => drawContext.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize - gap, cellSize - gap));
  window.requestAnimationFrame(render);
}

setInterval(() => grid = tick(grid), 100);
window.onresize = resize;
resize();
render();

for (let i = 0; i < 1000; i++) {
  spawn(grid, { x: rand(0, ~~(canvas.width / cellSize)), y: rand(0, ~~(canvas.height / cellSize)) });
}
