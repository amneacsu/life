const sampleSize = 2000;
const iterations = 100;
const multi = 2000;
const stringGrid = [];
const objGrid = [];
const rand = (min, max) => ~~(Math.random() * (max - min + 1)) + min;

function bench(f) {
  let start = performance.now();
  f();
  let stop = performance.now();
  return stop - start;
}

function findObj(cell) {
  return objGrid.find(c => c.x === cell.x && c.y === cell.y);
}

function findString(cell) {
  return objGrid.indexOf(cell) > -1;
}

for (let i = 0; i < sampleSize; i++) {
  let x = rand(0, 100);
  let y = rand(0, 100);
  stringGrid.push(`${x},${y}`);
  objGrid.push({ x, y });
}

function benchAvg(name, f) {
  let total = 0;

  for (let i = 0; i < iterations; i++) {
    total += bench(function() {
      for (let m = 0; m < multi; m++) {
        f();
      }
    });
  }

  console.log(`${name}: ${total / iterations}`);
}

benchAvg('Objects', function() {
  findObj({ x: 1, y: 1 });
});

benchAvg('Strings', function() {
  findString('1,1');
});

benchAvg('Strings with offset', function() {
  let c = '1,1'.split(',');
  let c2 = [c[0] + 1, c[1] + 1].join(',');
  findString(c2);
});
