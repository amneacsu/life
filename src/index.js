const canvas = document.querySelector('#canvas');
const drawContext = canvas.getContext('2d');

const cellSize = 12;
const gap = 3;

import createGame from './game.js';
const game = createGame();

let brushDown = false;
let w, h;

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
  brushDown && paint(e);
}

function paint(e) {
  if (!brushDown) return;
  const x = ~~(e.offsetX / cellSize);
  const y = ~~(e.offsetY / cellSize);
  game.spawn({ x, y });
}

function clear() {
  drawContext.fillStyle = '#000';
  drawContext.fillRect(0, 0, w, h);
}

function drawScene() {
  drawContext.fillStyle = '#f93';
  game.cells.forEach(drawCell);
}

function drawCell(cell) {
  drawContext.fillRect(cell.x * cellSize, cell.y * cellSize, cellSize - gap, cellSize - gap);
}

function tick() {
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
};
