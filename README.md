# tiled-map-path-finder
A path finding library for hexagon maps.

## Sample images of usage in possible environment

This image shows how reachableTiles is used on a map with different tiles (tiles with different movement costs). In this example reachableTiles computes all tiles that can be reached with movement value of 6 (up to 6 tiles). Plain and Sand costs 1, Wood and Hills costs 2, Mountains are unpassable.
![Alt text](example_images/reachableTiles.png?raw=true "Reachable Tiles example")

With computePath it is possible to find shortest (with the lowest costs) path.
![Alt text](example_images/computePath.png?raw=true "Compute Path example")

It ignores tiles that are not passable. If no path is possible, it returns an empty path.
![Alt text](example_images/computePath2.png?raw=true "Different Compute Path example")

## Sample code

```typescript
const exampleMap:number [] = [
    1, 1, 2, 3,
    1, 2, 1, 3,
    2, 4, 8, 1,
    3, 1, 2, 1
];
const pf = new PathFinder(exampleMap, 4, 4);
const reachableTiles = pf.reachableTiles({q:0, r:0, s:0}, 2);
// reachableTiles.length is 7
```

Example usage of reachableTiles. It is important to initialize the component with a heatmap (a 2D map of all tiles used with movement value 0 -> not passable, >1 cost for passing). reachableTiles is called with a starting coordinate in cube coordinate system and a max cost value.

```typescript
const exampleMap:number [] = [
    1, 1, 2, 3,
    1, 2, 1, 3,
    2, 4, 8, 1,
    3, 1, 2, 1
];
const pf = new PathFinder(exampleMap, 4, 4);
const path = pf.computePathOffsetCoordinates({x:0,y:0}, {x:3,y:3});
// path.length is 6
```

Example usage of computePath. Compute path is called with 2 cube coordinates for start and end. A second version computePathOffsetCoordinates does the same, but start and end can be passed as offset coordinates (normal x and y values in 2D space). It returns all tiles of shortest path.