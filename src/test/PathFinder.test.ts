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
    console.log("findComplexPath");
    const exampleMap:number [] = [
        1, 1, 2, 3,
        1, 2, 1, 3,
        2, 4, 8, 1,
        3, 1, 2, 1
    ];
    const pf = new PathFinder(exampleMap, 4, 4);
    console.log(pf.print());
    const path = pf.computePathOffsetCoordinates({x:0,y:0}, {x:3,y:3});
    expect(path.length).toBe(6);
});