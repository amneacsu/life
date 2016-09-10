export function benchmark(f) {
  let start = performance.now();
  f();
  let stop = performance.now();

  return stop - start;
}
