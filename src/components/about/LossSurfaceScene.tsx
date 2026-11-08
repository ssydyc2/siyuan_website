import { useEffect, useImperativeHandle, useMemo, useRef, useState, type Ref } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import {
  CONTOUR_LEVELS,
  buildContour,
  buildDescentIterates,
  buildDescentPath,
  buildSurfaceGrid,
  type Vec3,
} from './lossSurface';

interface SceneProps {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}

interface Palette {
  rule: string;
  inkFaint: string;
  accent: string;
}

const SAMPLES_PER_STEP = 14;

/** Camera poses across the story: overview at the summary, mid-descent, then top-down at x* as the timeline ends. */
const KEYFRAMES: Array<{ position: Vec3; target: Vec3 }> = [
  { position: [7.5, 6, 7.5], target: [0, 0.6, 0] },
  { position: [-1.6, 4.2, 7.6], target: [-0.6, 0.35, 0.4] },
  { position: [0, 10.5, 1.6], target: [0, 0, 0] },
];

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim() || '#888888';
  return { rule: read('--rule-strong'), inkFaint: read('--ink-faint'), accent: read('--accent') };
}

/** Theme tokens from CSS, refreshed whenever the root `dark` class flips. */
function usePalette(): Palette {
  const [palette, setPalette] = useState(readPalette);

  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return palette;
}

/** Screen-space thick line (Three.js Line2); WebGL `linewidth` is always 1px otherwise. */
function ThickLine({
  points,
  color,
  lineWidth,
  opacity = 1,
  ref,
}: {
  points: Vec3[];
  color: string;
  lineWidth: number;
  opacity?: number;
  ref?: Ref<Line2>;
}) {
  const line = useMemo(() => {
    const geometry = new LineGeometry();
    geometry.setPositions(points.flat());
    const material = new LineMaterial({ linewidth: lineWidth, transparent: opacity < 1, opacity });
    return new Line2(geometry, material);
  }, [lineWidth, opacity, points]);

  useImperativeHandle(ref, () => line, [line]);

  useEffect(() => {
    line.material.color.set(color);
  }, [color, line]);

  useEffect(() => {
    return () => {
      line.geometry.dispose();
      line.material.dispose();
    };
  }, [line]);

  return <primitive object={line} />;
}

const smoothstep =(t: number) => t * t * (3 - 2 * t);

function poseAt(progress: number, out: { position: THREE.Vector3; target: THREE.Vector3 }, zoom: number) {
  const scaled = THREE.MathUtils.clamp(progress, 0, 1) * (KEYFRAMES.length - 1);
  const index = Math.min(Math.floor(scaled), KEYFRAMES.length - 2);
  const t = smoothstep(scaled - index);
  const from = KEYFRAMES[index];
  const to = KEYFRAMES[index + 1];

  out.position.fromArray(from.position).lerp(new THREE.Vector3().fromArray(to.position), t);
  out.target.fromArray(from.target).lerp(new THREE.Vector3().fromArray(to.target), t);
  out.position.sub(out.target).multiplyScalar(zoom).add(out.target);
}

function LossSurface({ progress, reduceMotion }: SceneProps) {
  const palette = usePalette();
  const { camera, size, invalidate } = useThree();
  const group = useRef<THREE.Group>(null);
  const pathLine = useRef<Line2>(null);
  const ball = useRef<THREE.Mesh>(null);
  const markers = useRef<Array<THREE.Mesh | null>>([]);

  const grid = useMemo(() => buildSurfaceGrid(), []);
  const contours = useMemo(() => CONTOUR_LEVELS.map((level) => buildContour(level)), []);
  const iterates = useMemo(() => buildDescentIterates(), []);
  const path = useMemo(() => buildDescentPath(iterates, SAMPLES_PER_STEP), [iterates]);

  const isNarrow = size.width < 800;
  const zoom = isNarrow ? 1.5 : 1.45;
  const desired = useMemo(() => ({ position: new THREE.Vector3(), target: new THREE.Vector3() }), []);
  const current = useMemo(() => {
    const pose = { position: new THREE.Vector3(), target: new THREE.Vector3() };
    poseAt(progress.get(), pose, zoom);
    return pose;
    // Only the first frame's pose; later frames damp toward `desired`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const reveal = useRef(progress.get());

  // On wide screens, shift the projection so the surface sits right of the text column.
  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    if (isNarrow) {
      perspective.clearViewOffset();
    } else {
      perspective.setViewOffset(size.width, size.height, -size.width * 0.25, 0, size.width, size.height);
    }
    invalidate();
  }, [camera, invalidate, isNarrow, size.height, size.width]);

  // In reduced-motion mode the canvas renders on demand, so redraw on scroll.
  useEffect(() => {
    if (!reduceMotion) return;
    return progress.on('change', () => invalidate());
  }, [invalidate, progress, reduceMotion]);

  useFrame((state, delta) => {
    const p = progress.get();
    poseAt(p, desired, zoom);

    if (reduceMotion) {
      current.position.copy(desired.position);
      current.target.copy(desired.target);
      reveal.current = p;
    } else {
      const factor = 1 - Math.exp(-4 * Math.min(delta, 0.1));
      current.position.lerp(desired.position, factor);
      current.target.lerp(desired.target, factor);
      reveal.current += (p - reveal.current) * factor;
      if (group.current) {
        group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.06;
      }
    }

    camera.position.copy(current.position);
    camera.lookAt(current.target);

    // Reveal the descent path as the reader scrolls: it reaches x* by the education chapter.
    const fraction = THREE.MathUtils.clamp(0.06 + reveal.current * 1.05, 0, 1);
    const segments = path.length - 1;
    const exact = fraction * segments;
    const shown = Math.max(1, Math.floor(exact));

    if (pathLine.current) {
      pathLine.current.geometry.instanceCount = shown;
    }

    if (ball.current) {
      const i = Math.min(shown, segments - 1);
      const t = Math.min(exact - i, 1);
      const a = path[i];
      const b = path[Math.min(i + 1, segments)];
      ball.current.position.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }

    markers.current.forEach((marker, index) => {
      if (marker) marker.visible = index * SAMPLES_PER_STEP <= exact;
    });
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[grid, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={palette.rule} transparent opacity={0.75} />
      </lineSegments>

      {contours.map((points, index) => (
        <ThickLine
          key={CONTOUR_LEVELS[index]}
          points={points}
          color={index === 0 ? palette.accent : palette.inkFaint}
          lineWidth={index === 0 ? 1.6 : 1.1}
          opacity={index === 0 ? 0.95 : 0.7}
        />
      ))}

      <ThickLine ref={pathLine} points={path} color={palette.accent} lineWidth={2.4} />

      {iterates.slice(0, -1).map((point, index) => (
        <mesh
          key={index}
          ref={(node) => {
            markers.current[index] = node;
          }}
          position={[point[0], point[1] + 0.03, point[2]]}
        >
          <sphereGeometry args={[0.055, 16, 12]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={0.55} />
        </mesh>
      ))}

      <mesh ref={ball}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshBasicMaterial color={palette.accent} />
      </mesh>
    </group>
  );
}

export default function LossSurfaceScene({ progress, reduceMotion }: SceneProps) {
  return (
    <div className="about-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reduceMotion ? 'demand' : 'always'}
        camera={{ fov: 35, near: 0.1, far: 100, position: KEYFRAMES[0].position }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none' }}
      >
        <LossSurface progress={progress} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
