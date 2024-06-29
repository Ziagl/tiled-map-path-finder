import { CubeCoordinates, Grid, HexOffset, Orientation, defineHex, hexToOffset, line, offsetToCube, rectangle } from "honeycomb-grid";
import { Utils } from "./models/Utils";
import { Tile } from "./models/Tile";

export class PathFinder
{
    private _map:number[][] = [];
    private _map_columns:number = 0;
    private _map_rows:number = 0;
    private _grid:Grid<Tile>;
    private _hexSetting;
    private _hexDefinition;

    constructor(map:number[], rows:number, columns:number) {
        this._map = Utils.convertTo2DArray(map, rows, columns);
        this._map_columns = columns;
        this._map_rows = rows;

        // initilize grid and definition to convert offset -> cube coordinates
        this._grid = new Grid(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
        this._hexSetting = {offset: -1 as HexOffset, orientation: Orientation.POINTY};
        this._hexDefinition = defineHex(this._hexSetting);
    }

    // computes path with lowest costs from start to end
    public computePath(start:CubeCoordinates, end:CubeCoordinates):CubeCoordinates[] {
        // initilize grid
        this._grid = new Grid(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
        let path:CubeCoordinates[] = [];

        // initialize AStar
        let openList:Tile[] = [];
        let closedList:Tile[] = [];
        let tile = new Tile();
        tile.coordinates = start;
        tile.movementCost = 0;
        tile.estimatedMovementCost = this.calculateDistance(start, end);
        openList.push(tile);

        // compute AStar algorithm
        let pathFound = false;
        do {
            // remove tile from open list
            const tile = openList.pop()!;
            // add it to closed list
            closedList.push(tile);
            // if tile is end, break
            if(tile.coordinates.q == end.q && tile.coordinates.r == end.r) {
                pathFound = true;
                break;
            }
            // get neighbors walkable neighbors
            let neighbors = Utils.neighbors(this._grid, tile.coordinates);
            let walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map);
            // for every walkable neighbor
            walkableNeighbors.forEach(neighbor => {
                // if neighbor is in closed list, skip it
                if(closedList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r) != undefined) {
                    return;
                }
                // if neighbor is not in open list, add it
                if(openList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r) == undefined) {
                    const tileMovementCost = this.movementCosts(neighbor.coordinates);
                    neighbor.movementCost = tile.movementCost + tileMovementCost;
                    neighbor.estimatedMovementCost = this.calculateDistance(neighbor.coordinates, end);
                    neighbor.sum = neighbor.movementCost + neighbor.estimatedMovementCost;
                    openList.unshift(neighbor);
                }
                // if neighbor is in open list and has a lower cost, update it
                else {
                    let existing = openList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r);
                    const tileMovementCost = this.movementCosts(neighbor.coordinates);
                    if(existing != undefined && existing.movementCost > tile.movementCost + tileMovementCost) {
                        const tileMovementCost = this.movementCosts(neighbor.coordinates);
                        existing.movementCost = tile.movementCost + tileMovementCost;
                        existing.estimatedMovementCost = this.calculateDistance(neighbor.coordinates, end);
                        existing.sum = existing.movementCost + existing.estimatedMovementCost;
                    }
                }
            });
        } while(openList.length > 0 && pathFound == false);

        // reconstruct path
        if(pathFound == true) {
            let current = closedList.pop();
            while(current != undefined) {
                // add end coordinates
                path.push(current.coordinates);
                // if start is reached end loop
                if(current.coordinates.q == start.q && current.coordinates.r == start.r) {
                    // stop if start is reached
                    current = undefined;
                } else {
                    const neighbors = Utils.neighbors(this._grid, current.coordinates);
                    const walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map);
                    for (const neighbor of walkableNeighbors) {
                        const nextTile = closedList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r);
                        if(nextTile != undefined) {
                            if(neighbor.movementCost < current?.movementCost!) {
                                current = nextTile;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return path.reverse();
    }

    // additional computePath method for offset coordinates
    public computePathOffsetCoordinates(start:{x:number, y:number}, end:{x:number, y:number}):{x:number, y:number}[] {
        let path:{x:number, y:number}[] = [];

        // convert offset coordinates to cube coordinates
        const startCube = offsetToCube(this._hexSetting, {col: start.x, row: start.y});
        const endCube = offsetToCube(this._hexSetting, {col: end.x, row: end.y});

        // compute path
        const computedPath = this.computePath(startCube, endCube);

        // convert resultin path back to offset coordinates
        if(computedPath.length > 0) {
            computedPath.forEach(coord => {
                const hex = new this._hexDefinition([coord.q, coord.r]);
                const offset = hexToOffset(hex);
                path.push({x:offset.row, y:offset.col});
            });
        }

        return path; 
    }

    // returns all tiles that are in range
    public reachableTiles(start:CubeCoordinates, maxcost:number):CubeCoordinates[] {
        // initilize grid
        this._grid = new Grid(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
        let reachableTiles:CubeCoordinates[] = [];

        // initialize
        let openList:Tile[] = [];
        let closedList:Tile[] = [];
        let tile = new Tile();
        tile.coordinates = start;
        tile.movementCost = 0;
        openList.push(tile);

        // compute
        do {
            // remove tile from open list
            const tile = openList.pop()!;
            // add it to closed list
            closedList.push(tile);
            // get neighbors walkable neighbors
            let neighbors = Utils.neighbors(this._grid, tile.coordinates);
            let walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map);
            // for every walkable neighbor
            walkableNeighbors.forEach(neighbor => {
                // if neighbor is in closed list, skip it
                if(closedList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r) != undefined) {
                    return;
                }
                // if neighbor is not in open list, add it
                if(openList.find(t => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r) == undefined) {
                    const tileMovementCost = this.movementCosts(neighbor.coordinates);
                    neighbor.movementCost = tile.movementCost + tileMovementCost;
                    if(tile.movementCost < maxcost) {
                        openList.unshift(neighbor);
                    }
                }
            });
        } while(openList.length > 0);

        // fill reachable tiles
        closedList.forEach(tile => {
            reachableTiles.push(tile.coordinates);
        });

        return reachableTiles;
    }

    // print map structured (one row as one line)
    public print() :string {
        let response: string = "";
        for (let i=0; i < this._map_columns; ++i) {
            const row = this._map[i];
            response += (row?.join(' '));
            if(i < this._map_columns - 1) {
                response += '\n';
            }
        }
        return response;
    }
    
    // print map unstructured
    public print_unstructured() :string {
        return this._map.flat().join(" ");
    }

    // calculates Manhattan distance
    private calculateDistance(start:CubeCoordinates, end:CubeCoordinates):number {
        const lineBetween = line<Tile>({ start: [start.q, start.r], stop: [end.q, end.r] });
        return this._grid.traverse(lineBetween).size;
    }

    // get movement costs for a given tile
    private movementCosts(coordinates:CubeCoordinates):number {
        const hex = new this._hexDefinition([coordinates.q, coordinates.r]);
        const offset = hexToOffset(hex);
        return this._map[offset.row]?.[offset.col]!;
    }
};