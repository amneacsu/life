const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');
const cells = [];
const cellSize = 10;

let brushDown = false;
let w, h;

function resize() {
  setTimeout(function() {
    w = window.innerWidth;
    h = window.innerHeight
    canvas.width = w;
    canvas.height = h;
  }, 10);
};

function togglePaint() {
  brushDown = !brushDown;
}

function paint(e) {
  if (!brushDown) return;
  const x = ~~(e.offsetX / cellSize);
  const y = ~~(e.offsetY / cellSize);
  const cell = cells.find(c => c.x === x && c.y === y);
  !cell && cells.push({ x, y });
}

function update() {
  // 1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.

  // 2. Any live cell with two or three live neighbours lives on to the next generation.

  // 3. Any live cell with more than three live neighbours dies, as if by over-population.

  // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

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
  update();
  clear();
  drawScene();
  window.requestAnimationFrame(tick);
}

window.onresize = resize;
canvas.onmousedown = togglePaint;
canvas.onmouseup = togglePaint;
canvas.onmousemove = paint;

window.onload = function() {
  resize();
  tick();
}
