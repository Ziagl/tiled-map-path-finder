export class Utils {
    // normalizes given map
    public static normalize(map:number[][]) {
        let minimum:number = Number.MAX_VALUE;
        let maximum:number = Number.MIN_VALUE;
        // find min and max values
        map.forEach(row => {
            row.forEach(element => {
                if(element > maximum) {
                    maximum = element;
                }
                if(element < minimum) {
                    minimum = element;
                }
            });
        });
        // normalize
        map.forEach(row => {
            row.forEach(element => {
                element = (element * minimum) / maximum;
            });
        });
    }
}