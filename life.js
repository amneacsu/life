const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const cellSize = 10;
const interval = 200;

let cells = [];
let brushDown = false;
let w, h;

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
    h = window.innerHeight
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

const spawn = cell => !find(cell) && cells.push(cell);
const offset = (cell, offs) => ({ x: cell.x + offs.x, y: cell.y + offs.y });

const isDead = cell => !find(cell);
const isComfy = cell => [2, 3].indexOf(liveNeighbours(cell)) > -1;
const isRipe = cell => liveNeighbours(cell) === 3;

const id = c => c;
const liveNeighbours = cell => neighbourhood.map(pos => find(offset(cell, pos))).filter(id).length;
const deadNeighbours = cell => neighbourhood.map(pos => offset(cell, pos)).filter(isDead);

const getSpace = cells => {
  return cells.reduce((space, cell) => {
    const deads = deadNeighbours(cell);
    const uniqDeads = deads.filter(cell => {
      return !space.find(c => c.x === cell.x && c.y === cell.y);
    });
    return space.concat(uniqDeads);
  }, []);
}

function update() {
  const survivors = cells.filter(isComfy);
  const newCells = getSpace(cells).filter(isRipe);
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
  tick();
}
