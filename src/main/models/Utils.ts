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
            console.log("walkableNeighbors q:"+neighbor.coordinates.q+" r:"+neighbor.coordinates.r+" s:"+neighbor.coordinates.s);
            const hex = new Hex([neighbor.coordinates.q, neighbor.coordinates.r]);
            const offset = hexToOffset(hex);
            const cost = map[offset.col]?.[offset.row];
            console.log("offset x: "+offset.col+" y: "+offset.row+" cost:"+cost);
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
        console.log("convertTo2DArray: ");
        console.log(twoDArray);
        return twoDArray;
    }
}