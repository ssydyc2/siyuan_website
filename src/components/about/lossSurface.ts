// Geometry for the About page loss surface: a convex quadratic bowl,
// its level sets, and a gradient-descent path that zigzags down to x*.

export type Vec3 = [number, number, number];

const SCALE = 0.18;
const A = 1.6; // x² weight
const B = 0.7; // z² weight
const C = 0.6; // xz weight

export const EXTENT = 3;

export function loss(x: number, z: number): number {
  return SCALE * (A * x * x + B * z * z + C * x * z);
}

function gradient(x: number, z: number): [number, number] {
  return [SCALE * (2 * A * x + C * z), SCALE * (2 * B * z + C * x)];
}

/** Grid lines draped over the surface, as pairs of points for lineSegments. */
export function buildSurfaceGrid(lines = 13, samples = 48): Float32Array {
  const points: number[] = [];
  const push = (x: number, z: number) => points.push(x, loss(x, z), z);

  for (let i = 0; i < lines; i += 1) {
    const fixed = -EXTENT + (2 * EXTENT * i) / (lines - 1);

    for (let j = 0; j < samples; j += 1) {
      const a = -EXTENT + (2 * EXTENT * j) / samples;
      const b = -EXTENT + (2 * EXTENT * (j + 1)) / samples;
      push(a, fixed);
      push(b, fixed);
      push(fixed, a);
      push(fixed, b);
    }
  }

  return new Float32Array(points);
}

/** Closed level set {f = level}, lifted to its height on the surface. */
export function buildContour(level: number, samples = 96): Vec3[] {
  const points: Vec3[] = [];

  for (let i = 0; i <= samples; i += 1) {
    const theta = (2 * Math.PI * i) / samples;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const q = SCALE * (A * cos * cos + B * sin * sin + C * cos * sin);
    const r = Math.sqrt(level / q);
    points.push([r * cos, level + 0.01, r * sin]);
  }

  return points;
}

// The outermost level stays inside the sampled grid (min curvature ≈ 0.11, extent 3).
export const CONTOUR_LEVELS = [0.06, 0.24, 0.5, 0.85];

/** Gradient-descent iterates, ending at the minimizer x* = (0, 0). */
export function buildDescentIterates(start: [number, number] = [-2.6, 2.5], step = 2.8, count = 14): Vec3[] {
  const iterates: Vec3[] = [];
  let [x, z] = start;

  for (let i = 0; i < count; i += 1) {
    iterates.push([x, loss(x, z), z]);
    const [gx, gz] = gradient(x, z);
    x -= step * gx;
    z -= step * gz;
  }

  iterates.push([0, 0, 0]);
  return iterates;
}

/** Densely sampled path between iterates, lifted onto the surface. */
export function buildDescentPath(iterates: Vec3[], samplesPerStep = 14): Vec3[] {
  const path: Vec3[] = [];

  for (let i = 0; i < iterates.length - 1; i += 1) {
    const [x0, , z0] = iterates[i];
    const [x1, , z1] = iterates[i + 1];

    for (let s = 0; s < samplesPerStep; s += 1) {
      const t = s / samplesPerStep;
      const x = x0 + (x1 - x0) * t;
      const z = z0 + (z1 - z0) * t;
      path.push([x, loss(x, z) + 0.03, z]);
    }
  }

  const last = iterates[iterates.length - 1];
  path.push([last[0], last[1] + 0.03, last[2]]);
  return path;
}
