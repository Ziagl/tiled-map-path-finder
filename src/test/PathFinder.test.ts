import { PathFinder } from '../main/PathFinder';

test('initialize', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  const result = pf.print_unstructured();
  expect(result).not.toBeNull();
});
test('findPath', () => {
  const exampleMap: number[][] = [[1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1]];
  const pf = new PathFinder(exampleMap, 4, 4);
  const path = pf.computePathOffsetCoordinates({ x: 0, y: 0 }, { x: 3, y: 3 }, 0);
  expect(path.length).toBe(7);
});
test('findComplexPath', () => {
  const exampleMap: number[][] = [[1, 1, 2, 3, 1, 2, 1, 3, 2, 4, 8, 1, 3, 1, 2, 1]];
  const pf = new PathFinder(exampleMap, 4, 4);
  const path = pf.computePathOffsetCoordinates({ x: 0, y: 0 }, { x: 3, y: 3 }, 0);
  expect(path.length).toBe(6);
});
test('noPossiblePath', () => {
  const exampleMap: number[][] = [[1, 1, 2, 1, 1, 2, 3, 3, 2, 2, 8, 0, 1, 1, 0, 1]];
  const pf = new PathFinder(exampleMap, 4, 4);
  const path = pf.computePathOffsetCoordinates({ x: 0, y: 0 }, { x: 3, y: 3 }, 0);
  expect(path.length).toBe(0);
});
test('reachableTiles', () => {
  const exampleMap: number[][] = [[1, 1, 2, 3, 1, 2, 1, 3, 2, 4, 8, 1, 3, 1, 2, 1]];
  const pf = new PathFinder(exampleMap, 4, 4);
  const reachableTiles = pf.reachableTiles({ q: 0, r: 0, s: 0 }, 2, 0);
  expect(reachableTiles.length).toBe(7);
});
test('reachableTiles2', () => {
  const exampleMap: number[][] = [[8, 8, 8, 3, 8, 1, 1, 4, 8, 8, 1, 1, 3, 9, 1, 2]];
  const pf = new PathFinder(exampleMap, 4, 4);
  const reachableTiles = pf.reachableTiles({ q: 1, r: 1, s: -2 }, 2, 0);
  expect(reachableTiles.length).toBe(12);
});
test('reachableTilesLayers', () => {
  const exampleMap: number[][] = [
    [1, 2, 0, -1, 2, 1, -1, -1, 2, 1, -1, -1, 1, 1, -1, -1],
    [2, 2, 2, -1, 1, -1, -1, -1, 2, -1, -1, -1, -1, 0, -1, -1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  const pf = new PathFinder(exampleMap, 4, 4);
  const reachableTiles = pf.reachableTiles({ q: 1, r: 1, s: -2 }, 2, 2);
  expect(reachableTiles.length).toBe(15);
});
test('wrongLayer', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  const reachableTiles = pf.reachableTiles({ q: 1, r: 1, s: -2 }, 2, 10);
  expect(reachableTiles.length).toBe(0);
});
test('neighborTilesMinNeighbors', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  const neighbors = pf.neighborTiles({ q: 0, r: 0, s: 0 });
  expect(neighbors.length).toBe(2);
  expect(neighbors[0]!.q).toBe(1); // 1, 0, -1
  expect(neighbors[1]!.q).toBe(0); // 0, 1, -1
});
test('neighborTilesMaxNeighbors', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  const neighbors = pf.neighborTiles({ q: 1, r: 1, s: -2 });
  expect(neighbors[0]!.q).toBe(2); // 2, 0, -2
  expect(neighbors[1]!.q).toBe(2); // 2, 1, -3
  expect(neighbors[2]!.q).toBe(1); // 1, 2, -3
  expect(neighbors[3]!.q).toBe(0); // 0, 2, -2
  expect(neighbors[4]!.q).toBe(0); // 0, 1, -1
  expect(neighbors[5]!.q).toBe(1); // 1, 0, -1
});
test('cubeToOffset', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  let offsetCoords = pf.cubeToOffset({ q: 0, r: 0, s: 0 });
  expect(offsetCoords.x).toBe(0);
  expect(offsetCoords.y).toBe(0);
  offsetCoords = pf.cubeToOffset({ q: 1, r: 1, s: -2 });
  expect(offsetCoords.x).toBe(1);
  expect(offsetCoords.y).toBe(1);
  offsetCoords = pf.cubeToOffset({ q: 2, r: 2, s: -4 });
  expect(offsetCoords.x).toBe(3);
  expect(offsetCoords.y).toBe(2);
});
test('offsetToCube', () => {
  const exampleMap: number[][] = [];
  exampleMap[0] = Array(16).fill(0);
  const pf = new PathFinder(exampleMap, 4, 4);
  let cubeCoords = pf.offsetToCube({ x: 0, y: 0 });
  expect(cubeCoords.q).toBe(0);
  expect(cubeCoords.r).toBe(0);
  expect(cubeCoords.s).toBe(-0);
  cubeCoords = pf.offsetToCube({ x: 1, y: 1 });
  expect(cubeCoords.q).toBe(1);
  expect(cubeCoords.r).toBe(1);
  expect(cubeCoords.s).toBe(-2);
  cubeCoords = pf.offsetToCube({ x: 3, y: 2 });
  expect(cubeCoords.q).toBe(2);
  expect(cubeCoords.r).toBe(2);
  expect(cubeCoords.s).toBe(-4);
});