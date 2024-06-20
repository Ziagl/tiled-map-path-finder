import { CubeCoordinates, HexOffset, Orientation, defineHex, hexToOffset, offsetToCube } from "honeycomb-grid";
import { Utils } from "./Utils";

export class PathFinder
{
    private _map:number[][] = [];
    private _map_x:number = 0;
    //private _map_y:number = 0;

    // TODO one should be able to change that config
    private _offset:HexOffset = -1;
    private _orientation:Orientation = Orientation.POINTY;

    public initialize(map:number[], rows:number, columns:number) {
        this._map = this.convertTo2DArray(map, rows, columns);
        this._map_x = columns;
        //this._map_y = rows;

        Utils.normalize(this._map);
    }

    // computes path with lowest costs from start to end
    public computePath(start:CubeCoordinates, end:CubeCoordinates):CubeCoordinates[] {
        let path:CubeCoordinates[] = [];

        // TODO implement path finding

        return path;
    }

    // additional computePath method for offset coordinates
    public computePathOffsetCoordinates(start:{x:number, y:number}, end:{x:number, y:number}):{x:number, y:number}[] {
        let path:{x:number, y:number}[] = [];
        
        // convert offset coordinates to cube coordinates
        const hexSetting = {offset: this._offset, orientation: this._orientation};
        const startCube = offsetToCube(hexSetting, {col: start.x, row: start.y});
        const endCube = offsetToCube(hexSetting, {col: end.x, row: end.y})

        // compute path
        const computedPath = this.computePath(startCube, endCube);

        // convert resultin path back to offset coordinates
        if(path.length > 0) {
            const Hex = defineHex(hexSetting);
            computedPath.forEach(coord => {
                const hex = new Hex([coord.q, coord.r]);
                const offset = hexToOffset(hex);
                path.push({x:offset.row, y:offset.col});
            });
        }

        return path; 
    }

    // print map structured (one row as one line)
    public print() :string {
        let response: string = "";
        for (let i=0; i < this._map_x; ++i) {
            const row = this._map[i];
            response += (row?.join(' '));
            if(i < this._map_x - 1) {
                response += '\n';
            }
        }
        return response;
    }
    
    // print map unstructured
    public print_unstructured() :string {
        return this._map.flat().join(" ");
    }

    private convertTo2DArray(map: number[], rows: number, cols: number): number[][] {
        const twoDArray: number[][] = [];
        for (let i = 0; i < rows; i++) {
            twoDArray[i] = map.slice(i * cols, (i + 1) * cols);
        }
        return twoDArray;
    }
};