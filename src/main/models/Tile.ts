import { CubeCoordinates, Orientation, defineHex } from 'honeycomb-grid';

export class Tile extends defineHex({
  dimensions: 1,
  orientation: Orientation.POINTY,
  origin: 'topLeft',
  offset: -1,
}) {
  // additional values
  coordinates: CubeCoordinates = { q: 0, r: 0, s: 0 };
  movementCost: number = 0;
  estimatedMovementCost: number = 0;
  sum: number = 0;
}
