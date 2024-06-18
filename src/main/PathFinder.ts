import { Hex, offsetToCube } from "honeycomb-grid";
import { Utils } from "./Utils";

export class PathFinder
{
    private _map:number[][] = [];
    private _map_x:number = 0;
    //private _map_y:number = 0;

    public initialize(map:number[], rows:number, columns:number) {
        this._map = this.convertTo2DArray(map, rows, columns);
        this._map_x = columns;
        //this._map_y = rows;

        Utils.normalize(this._map);
    }

    // computes path with lowest costs from start to end
    public computePath(start:Hex, end:Hex):Hex[] {
        let path:Hex[] = [];

        // TODO implement path finding

        return path;
    }

    public computePathOffsetCoordinates(start:{x:number, y:number}, end:{x:number, y:number}):{x:number, y:number}[] {
        let path:{x:number, y:number}[] = [];
        
        // TODO implement conversion

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