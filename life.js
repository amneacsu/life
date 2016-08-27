const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const cellSize = 10;
const interval = 200;

let cells = [];
let brushDown = false;
let w, h;

const rand = (min, max) => ~~(Math.random() * (max - min + 1)) + min;
const spawn = cell => !find(cell) && cells.push(cell);
const offset = (cell, offs) => ({ x: cell.x + offs.x, y: cell.y + offs.y });

const neighbourhood = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];

function resize() {
  setTimeout(function() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }, 10);
};

function togglePaint(e) {
  brushDown = !brushDown;
  brushDown && paint(e) || tick();
}

function find(cell) {
  return cells.find(c => c.x === cell.x && c.y === cell.y);
}

function paint(e) {
  if (!brushDown) return;
  const x = ~~(e.offsetX / cellSize);
  const y = ~~(e.offsetY / cellSize);
  spawn({ x, y });
  drawScene();
}

const liveNeighbours = cell => neighbourhood.map(n => offset(cell, n)).filter(n => find(n)).length;

function freeSpace(space, cell) {
  const area = neighbourhood.map(offs => offset(cell, offs));

  area.forEach(function(pos) {
    let cell = find(pos);

    if (cell)
      cell.n += 1;

    if (!cell) {
      const d = space.find(ds => ds.x === pos.x && ds.y === pos.y);
      if (d) d.n += 1;
      else space.push({ x: pos.x, y: pos.y, n: 1 });
    }
  });

  return space;
}

const countNeighbours = cell => cell.n = liveNeighbours(cell);
const isComfy = cell => [2, 3].indexOf(cell.n) > -1;
const isRipe = cell => cell.n === 3;

function update() {
  cells.forEach(countNeighbours);
  const survivors = cells.filter(isComfy);
  const newCells = cells.reduce(freeSpace, []).filter(isRipe);
  return survivors.concat(newCells);
}

function clear() {
  drawContext.fillStyle = '#000';
  drawContext.fillRect(0, 0, w, h);
}

function drawScene() {
  drawContext.fillStyle = '#fff';
  cells.map(drawCell);
}

function drawCell(cell) {
  drawContext.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize - 1, cellSize - 1);
}

function tick() {
  cells = update();

  clear();
  drawScene();
  !brushDown && setTimeout(tick, interval);
}

window.onresize = resize;
canvas.onmousedown = togglePaint;
canvas.onmouseup = togglePaint;
canvas.onmousemove = paint;

window.onload = function() {
  resize();

  for (let i = cells.length; i < 500; i++) {
    let x = rand(0, 100);
    let y = rand(0, 100);
    spawn({ x, y });
  }

  tick();
};
