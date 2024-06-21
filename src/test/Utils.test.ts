import { PathFinder } from "../main";
import { Utils } from "../main/models/Utils";

test('normalize', () => {
    let exampleMap:number [][] = [
        [2, 1],
        [1, 0],
    ];
    Utils.normalize(exampleMap);
    expect(exampleMap).not.toBeNull();
    expect(exampleMap[0]?.[0]).toBe(1);
    expect(exampleMap[0]?.[1]).toBe(0.5);
    expect(exampleMap[1]?.[1]).toBe(0);
});
test('neighbors', () => {
    const exampleMap:number [] = Array(16).fill(0);      
    const pf = new PathFinder(exampleMap, 4, 4);
    // a hex field has normally 6 neighbors
    let neighbors = Utils.neighbors(pf['_grid'], [1, 1]);
    expect(neighbors.length).toBe(6);
    // expext on the corner
    neighbors = Utils.neighbors(pf['_grid'], [0, 0]);
    expect(neighbors.length).toBe(2);
    // or borders
    neighbors = Utils.neighbors(pf['_grid'], [1, 0]);
    expect(neighbors.length).toBe(4);
});