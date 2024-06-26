import { PathFinder } from "../main";
import { Utils } from "../main/models/Utils";

test('neighbors', () => {
    const exampleMap:number [] = Array(16).fill(0);      
    const pf = new PathFinder(exampleMap, 4, 4);
    // a hex field has normally 6 neighbors
    let neighbors = Utils.neighbors(pf['_grid'], {q:1, r:1, s:-2});
    expect(neighbors.length).toBe(6);
    // except on the corner
    neighbors = Utils.neighbors(pf['_grid'],  {q:0, r:0, s:0});
    expect(neighbors.length).toBe(2);
    // or borders
    neighbors = Utils.neighbors(pf['_grid'], {q:1, r:0, s:-1});
    expect(neighbors.length).toBe(4);
});
test('walkableNeighbors', () => {
    let exampleMap:number [] = [
        2, 1, 1, 2,
        1, 0, 0, 1,
        2, 0, 0, 1,
        1, 1, 1, 1,
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    // test a tile in the middle
    let neighbors = Utils.neighbors(pf['_grid'], {q:1, r:1, s:-2});
    expect(neighbors.length).toBe(6);
    let walkableNeighbors = Utils.walkableNeighbors(neighbors, pf['_map']);
    expect(walkableNeighbors.length).toBe(3);
    // check border
    neighbors = Utils.neighbors(pf['_grid'], {q:1, r:0, s:-1});
    expect(neighbors.length).toBe(4);
    walkableNeighbors = Utils.walkableNeighbors(neighbors, pf['_map']);
    expect(walkableNeighbors.length).toBe(3);
});
test('shuffle', () => {
    const originalArray = [1, 2, 3, 4, 5];
    const shuffledArray = [...originalArray]; // Create a copy to compare later
    Utils.shuffle(shuffledArray);

    // Check if the shuffled array has the same elements as the original
    expect(shuffledArray).toHaveLength(originalArray.length);
    originalArray.forEach((item) => {
      expect(shuffledArray).toContain(item);
    });
});