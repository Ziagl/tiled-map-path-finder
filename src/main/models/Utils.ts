import { CubeCoordinates, Direction, Grid, Hex, hexToOffset } from "honeycomb-grid";
import { Tile } from "./Tile";

export class Utils {
    // get all neighbors of given tile (pointy layout)
    public static neighbors(grid: Grid<Tile>, coordinates: CubeCoordinates) :Tile[] {
        let neighbors:Tile[] = [];
        const directions:Direction[] = [Direction.NE, Direction.E, Direction.SE, Direction.SW, Direction.W, Direction.NW];

        directions.forEach(direction => {
            if(grid.neighborOf(coordinates, direction, { allowOutside: false }) !== undefined) {
                let tile = grid.neighborOf(coordinates, direction);
                switch(direction) {
                    case Direction.NE: tile.coordinates = {
                        q: coordinates.q + 1, 
                        r: coordinates.r - 1,
                        s: coordinates.s,
                    }; break;
                    case Direction.E: tile.coordinates = {
                        q: coordinates.q + 1, 
                        r: coordinates.r,
                        s: coordinates.s - 1,
                    }; break;
                    case Direction.SE:  tile.coordinates = {
                        q: coordinates.q, 
                        r: coordinates.r + 1,
                        s: coordinates.s - 1,
                    };break;
                    case Direction.SW: tile.coordinates = {
                        q: coordinates.q - 1, 
                        r: coordinates.r + 1,
                        s: coordinates.s,
                    }; break;
                    case Direction.W: tile.coordinates = {
                        q: coordinates.q - 1, 
                        r: coordinates.r,
                        s: coordinates.s + 1,
                    }; break;
                    case Direction.NW: tile.coordinates = {
                        q: coordinates.q, 
                        r: coordinates.r - 1,
                        s: coordinates.s + 1,
                    }; break;
                }
                neighbors.push(tile);
            }
        });

        return neighbors;
    }

    // get all walkable neightbors
    public static walkableNeighbors(allNeighbors:Tile[], map:number[][]) :Tile[] {
        let neighbors:Tile[] = [];

        // filter out all not walkable neighbors
        allNeighbors.forEach((neighbor) => {
            const hex = new Hex([neighbor.coordinates.q, neighbor.coordinates.r]);
            const offset = hexToOffset(hex);
            const cost = map[offset.row]?.[offset.col];
            if(cost != undefined && cost > 0) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

    // converts a 1d array of numbers to a 2d array of numbers
    public static convertTo2DArray(map: number[], rows: number, cols: number): number[][] {
        const twoDArray: number[][] = [];
        for (let i = 0; i < rows; i++) {
            twoDArray[i] = map.slice(i * cols, (i + 1) * cols);
        }
        return twoDArray;
    }

    // randomly shuffles an array
    public static shuffle<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j]!;
            array[j] = temp!;
        }
    }
}