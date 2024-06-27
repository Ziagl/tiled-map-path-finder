import { PathFinder } from "../main/PathFinder";

test('initialize', () => {
    const exampleMap:number [] = Array(16).fill(0);      
    const pf = new PathFinder(exampleMap, 4, 4);
    const result = pf.print_unstructured();
    expect(result).not.toBeNull();
});
test('findPath', () => {
    const exampleMap:number [] = [
        1, 1, 1, 1,
        1, 0, 0, 1,
        1, 0, 0, 1,
        1, 1, 1, 1
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    const path = pf.computePathOffsetCoordinates({x:0,y:0}, {x:3,y:3});
    expect(path.length).toBe(7);
});
test('findComplexPath', () => {
    const exampleMap:number [] = [
        1, 1, 2, 3,
        1, 2, 1, 3,
        2, 4, 8, 1,
        3, 1, 2, 1
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    const path = pf.computePathOffsetCoordinates({x:0,y:0}, {x:3,y:3});
    expect(path.length).toBe(6);
});
test('noPossiblePath', () => {
    const exampleMap:number [] = [
        1, 1, 2, 1,
        1, 2, 3, 3,
        2, 2, 8, 0,
        1, 1, 0, 1
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    const path = pf.computePathOffsetCoordinates({x:0,y:0}, {x:3,y:3});
    expect(path.length).toBe(0);
});
test('reachableTiles', () => {
    const exampleMap:number [] = [
        1, 1, 2, 3,
        1, 2, 1, 3,
        2, 4, 8, 1,
        3, 1, 2, 1
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    const reachableTiles = pf.reachableTiles({q:0, r:0, s:0}, 2);
    expect(reachableTiles.length).toBe(7);
});
test('reachableTiles2', () => {
    const exampleMap:number [] = [
        8, 8, 8, 3,
        8, 1, 1, 4,
        8, 8, 1, 1,
        3, 9, 1, 2
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    const reachableTiles = pf.reachableTiles({q:1, r:1, s:-2}, 2);
    expect(reachableTiles.length).toBe(12);
});