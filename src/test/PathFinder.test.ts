import { PathFinder } from "../main/PathFinder";

test('initialize', () => {
    const exampleMap:number [] = Array(16).fill(0);      
    const pf = new PathFinder();
    pf.initialize(exampleMap, 4, 4);
    const result = pf.print_unstructured();
    expect(result).not.toBeNull();
});