import {
  CubeCoordinates,
  Grid,
  HexOffset,
  Orientation,
  defineHex,
  hexToOffset,
  line,
  offsetToCube,
  rectangle,
} from 'honeycomb-grid';
import { Tile } from './models/Tile';
import { BaseTile, Utils } from '@ziagl/tiled-map-utils';

export class PathFinder {
  private readonly MAXLOOPS = 10000;
  private _map: number[][][] = [];
  private _map_columns: number = 0;
  private _map_rows: number = 0;
  private _map_layers: number = 0;
  private _grid: Grid<BaseTile>;
  private _hexSetting;
  private _hexDefinition;

  constructor(map: number[][], rows: number, columns: number) {
    for (let i = 0; i < map.length; ++i) {
      this._map.push(Utils.convertTo2DArray(map[i]!, rows, columns));
    }
    this._map_columns = columns;
    this._map_rows = rows;
    this._map_layers = map.length;

    // initilize grid and definition to convert offset -> cube coordinates
    this._grid = new Grid<BaseTile>(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
    this._hexSetting = { offset: -1 as HexOffset, orientation: Orientation.POINTY };
    this._hexDefinition = defineHex(this._hexSetting);
  }

  /**
   * computes path with lowest costs from start to end (A* algorithm)
   * @param start start coordinates
   * @param end end coordinates
   * @param layerIndex layer index
   * @returns path as cube coordinates or empty path if no path was found or layer is out of bounds
   */
  public computePath(start: CubeCoordinates, end: CubeCoordinates, layerIndex: number): CubeCoordinates[] {
    // early exit if layer is out of bounds
    if (layerIndex < 0 || layerIndex >= this._map_layers) {
      return [];
    }
    // initilize grid
    this._grid = new Grid<BaseTile>(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
    let path: CubeCoordinates[] = [];
    // initialize AStar
    let openList: Tile[] = [];
    let closedList: Tile[] = [];
    let tile = new Tile();
    tile.coordinates = start;
    tile.movementCost = 0;
    tile.estimatedMovementCost = this.calculateDistance(start, end);
    openList.push(tile);
    // compute AStar algorithm
    let pathFound = false;
    let loopMax = this.MAXLOOPS;
    do {
      // remove tile from open list
      const tile = openList.pop()!;
      // add it to closed list
      closedList.push(tile);
      // if tile is end, break
      if (tile.coordinates.q == end.q && tile.coordinates.r == end.r) {
        pathFound = true;
        break;
      }
      // if start tile is not passable, break
      if (this.movementCosts(tile.coordinates, layerIndex) == 0) {
        pathFound = false;
        break;
      }
      // get neighbors walkable neighbors
      let neighbors = Utils.neighbors(this._grid, tile.coordinates);
      let walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map[layerIndex]!) as Tile[];
      // for every walkable neighbor
      walkableNeighbors.forEach((neighbor) => {
        // if neighbor is in closed list, skip it
        if (
          closedList.find(
            (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
          ) != undefined
        ) {
          return;
        }
        // if neighbor is not in open list, add it
        if (
          openList.find(
            (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
          ) == undefined
        ) {
          const tileMovementCost = this.movementCosts(neighbor.coordinates, layerIndex);
          neighbor.movementCost = tile.movementCost + tileMovementCost;
          neighbor.estimatedMovementCost = this.calculateDistance(neighbor.coordinates, end);
          neighbor.sum = neighbor.movementCost + neighbor.estimatedMovementCost;
          openList.unshift(neighbor);
        }
        // if neighbor is in open list and has a lower cost, update it
        else {
          let existing = openList.find(
            (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
          );
          const tileMovementCost = this.movementCosts(neighbor.coordinates, layerIndex);
          if (existing != undefined && existing.movementCost > tile.movementCost + tileMovementCost) {
            const tileMovementCost = this.movementCosts(neighbor.coordinates, layerIndex);
            existing.movementCost = tile.movementCost + tileMovementCost;
            existing.estimatedMovementCost = this.calculateDistance(neighbor.coordinates, end);
            existing.sum = existing.movementCost + existing.estimatedMovementCost;
          }
        }
      });
      --loopMax;
    } while (openList.length > 0 && pathFound == false && loopMax > 0);
    // reconstruct path
    if (pathFound == true) {
      let current = closedList.pop();
      loopMax = this.MAXLOOPS;
      while (current != undefined && loopMax > 0) {
        // add end coordinates
        path.push(current.coordinates);
        // if start is reached end loop
        if (current.coordinates.q == start.q && current.coordinates.r == start.r) {
          // stop if start is reached
          current = undefined;
        } else {
          const neighbors = Utils.neighbors(this._grid, current.coordinates);
          const walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map[layerIndex]!) as Tile[];
          Utils.shuffle(walkableNeighbors);
          for (const neighbor of walkableNeighbors) {
            const nextTile = closedList.find(
              (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
            );
            if (nextTile != undefined) {
              if (neighbor.movementCost < current?.movementCost!) {
                current = nextTile;
              }
            }
          }
        }
        --loopMax;
      }
    }
    return path.reverse();
  }

  /**
   * same as computePath, but with interface for offset coordinates
   * @param start start coordinates
   * @param end end coordinates
   * @param layerIndex layer index
   * @returns path as offset coordinates or empty path if no path was found or layer is out of bounds
   */
  public computePathOffsetCoordinates(
    start: { x: number; y: number },
    end: { x: number; y: number },
    layerIndex: number,
  ): { x: number; y: number }[] {
    let path: { x: number; y: number }[] = [];
    // convert offset input coordinates to cube coordinates
    const startCube = offsetToCube(this._hexSetting, { col: start.x, row: start.y });
    const endCube = offsetToCube(this._hexSetting, { col: end.x, row: end.y });
    // call compute path method
    const computedPath = this.computePath(startCube, endCube, layerIndex);
    // convert resulting path back to output offset coordinates
    if (computedPath.length > 0) {
      computedPath.forEach((coord) => {
        path.push(this.cubeToOffset(coord));
      });
    }
    return path;
  }

  /**
   * returns all tiles that are in range
   * @param start start coordinates
   * @param maxcost maximum cost
   * @param layerIndex layer index
   * @returns reachable tiles as cube coordinates or empty path if layer is out of bounds
   */
  public reachableTiles(start: CubeCoordinates, maxcost: number, layerIndex: number): CubeCoordinates[] {
    // early exit if layer is out of bounds
    if (layerIndex < 0 || layerIndex >= this._map_layers) {
      return [];
    }
    // initilize grid
    this._grid = new Grid<BaseTile>(Tile, rectangle({ width: this._map_columns, height: this._map_rows }));
    let reachableTiles: CubeCoordinates[] = [];
    // initialize
    let openList: Tile[] = [];
    let closedList: Tile[] = [];
    let tile = new Tile();
    tile.coordinates = start;
    tile.movementCost = 0;
    openList.push(tile);
    // compute
    let loopMax = this.MAXLOOPS;
    do {
      // remove tile from open list
      const tile = openList.pop()!;
      // add it to closed list
      closedList.push(tile);
      // if start tile is not passable, break
      if (this.movementCosts(tile.coordinates, layerIndex) == 0) {
        break;
      }
      // get neighbors walkable neighbors
      let neighbors = Utils.neighbors(this._grid, tile.coordinates);
      let walkableNeighbors = Utils.walkableNeighbors(neighbors, this._map[layerIndex]!) as Tile[];
      // for every walkable neighbor
      walkableNeighbors.forEach((neighbor) => {
        // if neighbor is in closed list, skip it
        if (
          closedList.find(
            (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
          ) != undefined
        ) {
          return;
        }
        // if neighbor is not in open list, add it
        if (
          openList.find(
            (t) => t.coordinates.q == neighbor.coordinates.q && t.coordinates.r == neighbor.coordinates.r,
          ) == undefined
        ) {
          const tileMovementCost = this.movementCosts(neighbor.coordinates, layerIndex);
          neighbor.movementCost = tile.movementCost + tileMovementCost;
          if (tile.movementCost < maxcost) {
            openList.unshift(neighbor);
          }
        }
      });
      --loopMax;
    } while (openList.length > 0 && loopMax > 0);
    // fill reachable tiles
    closedList.forEach((tile) => {
      reachableTiles.push(tile.coordinates);
    });
    return reachableTiles;
  }

  /**
   * Returns coordinates of all neighbors of a given base tile. 
   * Minimum 2 (map edges), maximum 6.
   * @param base coordinates of a tile on this map
   * @returns list of cubecoordinates of all neighbors
   */
  public neighborTiles(base: CubeCoordinates): CubeCoordinates[] {
    return Utils.neighbors(this._grid, base).map((tile) => tile.coordinates);
  }

  /**
   * Converts cube coordinates to offset coordinates
   * @param coordinate cube coordinates (q, r, s)
   * @returns offset coordinates (x, y)
   */
  public cubeToOffset(coordinate: CubeCoordinates): { x: number; y: number } {
    const hex = new this._hexDefinition([coordinate.q, coordinate.r]);
    const offset = hexToOffset(hex);
    return { x: offset.col, y: offset.row };
  }

  /**
   * Converts offset coordinates to cube coordinates
   * @param coordinate offset coordinates (x, y)
   * @returns cube coordinates (q, r, s)
   */
  public offsetToCube(coordinate: { x: number; y: number }): CubeCoordinates {
    return offsetToCube(this._hexSetting, { col: coordinate.x, row: coordinate.y });
  }

  /**
   * print map structured (one row as one line)
   * @returns map as string
   */
  public print(): string {
    let response: string = '';
    for (let i = 0; i < this._map_columns; ++i) {
      const row = this._map[i];
      response += row?.join(' ');
      if (i < this._map_columns - 1) {
        response += '\n';
      }
    }
    return response;
  }

  /**
   * print map unstructured
   * @returns map as string
   **/
  public print_unstructured(): string {
    return this._map.flat().join(' ');
  }

  // calculates Manhattan distance
  private calculateDistance(start: CubeCoordinates, end: CubeCoordinates): number {
    const lineBetween = line<BaseTile>({ start: [start.q, start.r], stop: [end.q, end.r] });
    return this._grid.traverse(lineBetween).size;
  }

  // get movement costs for a given tile
  private movementCosts(coordinates: CubeCoordinates, layerIndex: number): number {
    const hex = new this._hexDefinition([coordinates.q, coordinates.r]);
    const offset = hexToOffset(hex);
    return this._map[layerIndex]?.[offset.row]?.[offset.col]!;
  }
}
