export function getSlicePath(size: number, sliceCount: number, sliceIndex: number): number[][] {
  // Initialize point array with the center of the svg (around which we'll rotate)
  let radius: number = size / 2;
  let centralAngle: number = getSliceAngle(sliceCount, sliceIndex);

  // Second point is the spot on the circle that we reach by going as far as the radius a specific angle
  // See https://en.wikipedia.org/wiki/Unit_circle for the math
  // Add radius constant to start from circle center
  let targetX = radius + radius * 10 * Math.cos(rad(centralAngle + 8));
  let targetY = radius + radius * 10 * Math.sin(rad(centralAngle + 8));

  let nextTargetX = radius + radius * Math.SQRT2 * Math.cos(rad((centralAngle + centralAngle / sliceIndex)));
  let nextTargetY = radius + radius * Math.SQRT2 * Math.sin(rad((centralAngle + centralAngle / sliceIndex)));


  let origin = [radius, radius]
  let target = [targetX, targetY];
  let nextTarget = [nextTargetX, nextTargetY];

  return [
    origin, target, nextTarget
  ];
}

export function getSliceAngle(sliceCount: number, sliceIndex: number): number {
  // 360° (2π) is a full clockwise rotation starting at the rightmost point -> divided by player for one-slice-angle
  // Subtract 90° (π/2) for a quarter counterclockwise rotation so that all rotations start from the top
  return sliceIndex * (360 / sliceCount) //- 90;
}

export function getAngleFromPoint(radius: number, x: number, y: number): number {
  let dy = y - radius;
  let dx = x - radius;
  let theta = deg(Math.atan2(dy, dx));

  return theta > 0 ? theta : theta + 360;
}

function deg(rad: number): number {
  return (180 * rad) / Math.PI;
}

function rad(deg: number): number {
  return deg * (Math.PI / 180)
}