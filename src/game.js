let cells = [];

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

const rand = (min, max) => ~~(Math.random() * (max - min + 1)) + min;
const spawn = cell => !find(cell) && cells.push(cell);
const offset = (cell, offs) => ({ x: cell.x + offs.x, y: cell.y + offs.y });
const area = cell => neighbourhood.map(offs => offset(cell, offs));

const liveNeighbours = cell => area(cell).filter(n => find(n)).length;
const countNeighbours = cell => cell.n = liveNeighbours(cell);
const isComfy = cell => [2, 3].indexOf(cell.n) > -1;
const isRipe = cell => cell.n === 3;

const find = cell => cells.find(c => c.x === cell.x && c.y === cell.y);

function freeSpace(space, cell) {
  const newSpace = [];

  area(cell).forEach(function getSpace(pos) {
    let cell = find(pos);

    if (cell)
      cell.n += 1;

    if (!cell) {
      const d = space.find(ds => ds.x === pos.x && ds.y === pos.y);
      if (d) d.n += 1;
      else newSpace.push({ x: pos.x, y: pos.y, n: 1 });
    }
  });

  return space.concat(newSpace);
}

function populate(n) {
  for (let i = cells.length; i < n; i++) {
    let x = rand(0, 100);
    let y = rand(0, 100);
    spawn({ x, y });
  }
}

function tick() {
  cells.forEach(countNeighbours);
  const survivors = cells.filter(isComfy);
  const newCells = cells.reduce(freeSpace, []).filter(isRipe);
  cells = survivors.concat(newCells);
}

export default function(seedSize = 1000, interval = 100) {
  populate(seedSize);
  setInterval(tick, interval);

  return {
    spawn,
    get cells() {
      return cells;
    },
  };
}
