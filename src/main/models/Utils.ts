import { Direction, Grid, Hex, hexToOffset } from "honeycomb-grid";
import { Tile } from "./Tile";

export class Utils {
    // normalizes given map
    public static normalize(map:number[][]) {
        const flattened = map.flat();
        const minimum = Math.min(...flattened);
        const maximum = Math.max(...flattened);

        map.forEach((row) => {
            row.forEach((value, index) => {
                row[index] = (value - minimum) / (maximum - minimum);
            });
        });
    }

    // get all neighbors of given tile
    public static neighbors(grid: Grid<Tile>, coordinates: [q: number, r: number]) :Tile[] {
        let neighbors:Tile[] = [];

        /* not used for pointy orientation
        if(grid.neighborOf(coordinates, Direction.N, { allowOutside: false }) !== undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.N));
        }
        */
        if(grid.neighborOf(coordinates, Direction.NE, { allowOutside: false }) !== undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.NE));
        }
        if(grid.neighborOf(coordinates, Direction.E, { allowOutside: false }) != undefined) {
           neighbors.push(grid.neighborOf(coordinates, Direction.E)); 
        }
        if(grid.neighborOf(coordinates, Direction.SE, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.SE));
        }
        /* not used for pointy orientation
        if(grid.neighborOf(coordinates, Direction.S, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.S));
        }*/
        if(grid.neighborOf(coordinates, Direction.SW, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.SW));
        }
        if(grid.neighborOf(coordinates, Direction.W, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.W));
        }
        if(grid.neighborOf(coordinates, Direction.NW, { allowOutside: false }) != undefined) {
            neighbors.push(grid.neighborOf(coordinates, Direction.NW));
        }

        return neighbors;
    }

    // get all walkable neightbors
    public static walkableNeighbors(allNeighbors:Tile[], map:number[][]) :Tile[] {
        let neighbors:Tile[] = [];

        // filter out all not walkable neighbors
        allNeighbors.forEach((neighbor) => {
            const hex = new Hex([neighbor.coordinates.q, neighbor.coordinates.r]);
            const offset = hexToOffset(hex);
            if((map[offset.row]?.[offset.col] as number) > 0) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }
}