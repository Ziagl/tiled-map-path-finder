export class PathFinder
{
    private _map:number[][] = [];
    private _map_x:number = 0;
    //private _map_y:number = 0;

    public initialize(map:number[][], rows:number, columns:number) {
        this._map = map;
        this._map_x = columns;
        //this._map_y = rows;
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
};