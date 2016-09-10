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
const spawn = (list, cell) => !find(list, cell) && list.push(cell);
const offset = (cell, offs) => ({ x: cell.x + offs.x, y: cell.y + offs.y });
const area = cell => neighbourhood.map(offs => offset(cell, offs));

const liveNeighbours = (list, cell) => area(cell).filter(n => find(list, n)).length;
const countNeighbours = (cell, i, list) => cell.n = liveNeighbours(list, cell);
const isComfy = cell => [2, 3].indexOf(cell.n) > -1;
const isRipe = cell => cell.n === 3;

const find = (list, cell) => list.find(c => c.x === cell.x && c.y === cell.y);

function freeSpace(space, cell, index, list) {
  const newSpace = [];

  area(cell).forEach(function getSpace(pos) {
    let cell = find(list, pos);

    if (!cell) {
      const d = find(space, pos);
      if (d) d.n += 1;
      else newSpace.push({ x: pos.x, y: pos.y, n: 1 });
    }
  });

  return space.concat(newSpace);
}

function populate(list, n) {
  for (let i = list.length; i < n; i++) {
    let x = rand(0, 100);
    let y = rand(0, 100);
    spawn(list, { x, y });
  }
}

function tick(list) {
  list.forEach(countNeighbours);
  const survivors = list.filter(isComfy);
  const newCells = list.reduce(freeSpace, []).filter(isRipe);
  return survivors.concat(newCells);
}

export default function(seedSize = 1000, interval = 100) {
  let _grid = [];

  populate(_grid, seedSize);

  setInterval(function() {
    _grid = tick(_grid);
  }, interval);

  return {
    spawn(cell) {
      spawn(_grid, cell);
    },
    get cells() {
      return _grid;
    },
  };
}
