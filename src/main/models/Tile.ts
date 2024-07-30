import { BaseTile } from '@ziagl/tiled-map-utils';

export class Tile extends BaseTile {
  // additional values
  movementCost: number = 0;
  estimatedMovementCost: number = 0;
  sum: number = 0;
}
