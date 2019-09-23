export enum AngleType {
  deg,
  rad
}

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number, radius?: number) {
    if (radius) {
      this.x = radius + x;
      this.y = radius - y;
    } else {
      this.x = x;
      this.y = -y;
    }
  }
}

export class Angle {
  public deg: number;
  public rad: number;

  constructor(value: number, type?: AngleType) {
    if (type === AngleType.deg) {
      this.deg = value;
      this.rad = Math.round(value * (Math.PI / 180));
    } else {
      this.deg = Math.round((180 * value) / Math.PI);
      this.rad = value;
    }
  }

  add(angle: Angle): Angle {
    return new Angle(this.rad + angle.rad);
  }

  subtract(angle: Angle): Angle {
    return new Angle(this.rad - angle.rad);
  }
}

export const pi = Math.PI;

export function getSliceAngle(sliceCount: number, sliceIndex: number): number {
  // 360° (2π) is a full clockwise rotation starting at the rightmost point -> divided by player for one-slice-angle
  // Subtract 90° (π/2) for a quarter counterclockwise rotation so that all rotations start from the top
  return sliceIndex * (360 / sliceCount); // - 90;
}

export function getAngleForPoint(point: Point): Angle {
  let theta = new Angle(Math.atan2(point.y, point.x), AngleType.rad);
  return theta.deg > 0 ? theta : theta.add(new Angle(2 * pi));
}

export function getPointForAngle(angle: Angle, radius: number, offset?: number): Point {
  let x = Math.round(radius * Math.cos(angle.rad));
  let y = Math.round(radius * Math.sin(angle.rad));

  return new Point(x, y, offset || radius);
}
