"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/utils/styling";

interface D10DiceProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onRoll?: (v: number) => void;
  disabled?: boolean;
}

/* ---------------------------------------------------------------------- */
/*  geometry                                                              */
/* ---------------------------------------------------------------------- */

type Face = {
  centroid: THREE.Vector3;
  normal: THREE.Vector3;
  number: number; // 0-9
};

function makeD10(): { geometry: THREE.BufferGeometry; faces: Face[] } {
  /* tunable dimensions -------------------------------------------------- */
  const r = 1; // radius of both pentagon rings
  const zRing = 0.4; // z of the rings
  const zApex = 1.1; // z of the two apices

  /* vertices ------------------------------------------------------------ */
  const verts: number[] = [];

  // 0 : top apex      1 : bottom apex
  verts.push(0, 0, zApex); // 0
  verts.push(0, 0, -zApex); // 1

  // 2-6 : top pentagon  (angle 0 … 288° step 72°)
  for (let i = 0; i < 5; i++) {
    const θ = (2 * Math.PI * i) / 5;
    verts.push(r * Math.cos(θ), r * Math.sin(θ), zRing);
  }

  // 7-11 : bottom pentagon (rotated 36°)
  for (let i = 0; i < 5; i++) {
    const θ = (2 * Math.PI * i) / 5 + Math.PI / 5;
    verts.push(r * Math.cos(θ), r * Math.sin(θ), -zRing);
  }

  /* faces (10 kites → 20 triangles) ------------------------------------ */
  const idx: number[] = [];
  const faces: Face[] = [];

  for (let i = 0; i < 5; i++) {
    const iTop = 2 + i; // current top-ring vertex
    const iTopNext = 2 + ((i + 1) % 5); // next on top ring
    const iBot = 7 + i; // matching bottom-ring vertex
    const iBotPrev = 7 + ((i + 4) % 5); // previous on bottom ring

    /* kite that touches the TOP apex ----------------------------------- */
    // triangles (0, iTop, iBot)  (0, iBot, iTopNext)
    idx.push(0, iTop, iBot);
    idx.push(0, iBot, iTopNext);

    {
      const v0 = new THREE.Vector3(verts[0], verts[1], verts[2]); // top apex
      const v1 = new THREE.Vector3(verts[iTop * 3], verts[iTop * 3 + 1], verts[iTop * 3 + 2]);
      const v2 = new THREE.Vector3(verts[iBot * 3], verts[iBot * 3 + 1], verts[iBot * 3 + 2]);
      const v3 = new THREE.Vector3(verts[iTopNext * 3], verts[iTopNext * 3 + 1], verts[iTopNext * 3 + 2]);

      const centroid = new THREE.Vector3().add(v0).add(v1).add(v2).add(v3).divideScalar(4);

      const n = new THREE.Vector3().subVectors(v1, v0).cross(new THREE.Vector3().subVectors(v3, v0)).normalize();
      if (n.dot(centroid) < 0) n.negate();

      faces.push({ centroid, normal: n, number: i }); // 0-4
    }

    /* kite that touches the BOTTOM apex -------------------------------- */
    // triangles (1, iBot, iTop)  (1, iTop, iBotPrev)
    idx.push(1, iBot, iTop);
    idx.push(1, iTop, iBotPrev);

    {
      const v0 = new THREE.Vector3(verts[3], verts[4], verts[5]); // bottom apex
      const v1 = new THREE.Vector3(verts[iBot * 3], verts[iBot * 3 + 1], verts[iBot * 3 + 2]);
      const v2 = new THREE.Vector3(verts[iTop * 3], verts[iTop * 3 + 1], verts[iTop * 3 + 2]);
      const v3 = new THREE.Vector3(verts[iBotPrev * 3], verts[iBotPrev * 3 + 1], verts[iBotPrev * 3 + 2]);

      const centroid = new THREE.Vector3().add(v0).add(v1).add(v2).add(v3).divideScalar(4);

      const n = new THREE.Vector3().subVectors(v2, v0).cross(new THREE.Vector3().subVectors(v3, v0)).normalize();
      if (n.dot(centroid) < 0) n.negate();

      faces.push({ centroid, normal: n, number: i + 5 }); // 5-9
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();

  return { geometry: geo, faces };
}

/* ---------------------------------------------------------------------- */
/*  main component                                                        */
/* ---------------------------------------------------------------------- */

const sizeMap = {
  sm: { scale: 0.8, canvas: "w-20 h-20" },
  md: { scale: 1, canvas: "w-32 h-32" },
  lg: { scale: 1.2, canvas: "w-40 h-40" },
  xl: { scale: 1.5, canvas: "w-48 h-48" },
} as const;

export function D10Dice({ className, size = "md", onRoll, disabled = false }: D10DiceProps) {
  /* ---------- state ---------------------------------------------------- */
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);

  /* ---------- geometry (built once) ----------------------------------- */
  const { geometry, faces } = useMemo(makeD10, []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const { scale, canvas } = sizeMap[size];

  /* ---------- click handler ------------------------------------------- */
  const handleClick = () => {
    if (disabled || rolling) return;
    setResult(Math.floor(Math.random() * 10)); // 0-9
    setRolling(true);
  };

  const finishRoll = () => {
    setRolling(false);
    setHasRolled(true);
    if (result !== null) onRoll?.(result);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={cn(canvas, "cursor-pointer")}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Roll d10"
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Scene
            geometry={geometry}
            faces={faces}
            rolling={rolling}
            result={result}
            onRollComplete={finishRoll}
            scale={scale}
            autoRotate={!rolling && !hasRolled}
          />
        </Canvas>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  R3F sub-components                                                    */
/* ---------------------------------------------------------------------- */

function Scene({
  geometry,
  faces,
  rolling,
  result,
  onRollComplete,
  scale,
  autoRotate,
}: {
  geometry: THREE.BufferGeometry;
  faces: Face[];
  rolling: boolean;
  result: number | null;
  onRollComplete: () => void;
  scale: number;
  autoRotate: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -3, -3]} intensity={0.4} color="#e0e7ff" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#F59E0B" />

      <DiceMesh
        geometry={geometry}
        faces={faces}
        rolling={rolling}
        result={result}
        onRollComplete={onRollComplete}
        scale={scale}
      />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={!rolling}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
      />
    </>
  );
}

function DiceMesh({
  geometry,
  faces,
  rolling,
  result,
  onRollComplete,
  scale,
}: {
  geometry: THREE.BufferGeometry;
  faces: Face[];
  rolling: boolean;
  result: number | null;
  onRollComplete: () => void;
  scale: number;
}) {
  const group = useRef<THREE.Group>(null);
  const startQ = useRef(new THREE.Quaternion());
  const finalQ = useRef(new THREE.Quaternion());
  const axis = useRef(new THREE.Vector3());
  const startT = useRef(0);
  const spins = useRef(0);
  const done = useRef(false);
  const { camera } = useThree();

  /* ---------- prep each roll ----------------------------------------- */
  useEffect(() => {
    if (!rolling || result === null || !group.current) return;

    startQ.current.copy(group.current.quaternion);
    startT.current = performance.now() / 1000;
    done.current = false;

    axis.current.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    spins.current = 4 + Math.random() * 6;

    const face = faces.find((f) => f.number === result);
    if (face) {
      const camDir = camera.position.clone().normalize();
      const align = new THREE.Quaternion().setFromUnitVectors(face.normal, camDir);
      const twist = new THREE.Quaternion().setFromAxisAngle(camDir, Math.random() * Math.PI * 2);
      finalQ.current.copy(twist).multiply(align);
    }
  }, [rolling, result, faces, camera]);

  /* ---------- animation loop ------------------------------------------ */
  useFrame(() => {
    const g = group.current;
    if (!g || !rolling) return;

    const t = performance.now() / 1000 - startT.current;
    const dur = 2.4;
    if (t < dur) {
      const p = t / dur;
      const ease = 1 - Math.pow(1 - p, 4);

      const q = startQ.current.clone().slerp(finalQ.current, ease);
      const ang = (1 - ease) * spins.current * Math.PI * 2;
      const spinQ = new THREE.Quaternion().setFromAxisAngle(axis.current, ang);

      q.multiply(spinQ);
      g.quaternion.copy(q);
    } else if (!done.current) {
      g.quaternion.copy(finalQ.current);
      done.current = true;
      onRollComplete();
    }
  });

  /* ---------- render --------------------------------------------------- */
  return (
    <group scale={scale}>
      <group ref={group}>
        <mesh geometry={geometry}>
          <meshStandardMaterial color="#F59E0B" roughness={0.7} metalness={0.15} toneMapped={false} />
        </mesh>

        {faces.map((f) => {
          const pos = f.centroid.clone().addScaledVector(f.normal, 0.1);
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), f.normal);

          return (
            <Text
              key={f.number}
              position={[pos.x, pos.y, pos.z]}
              quaternion={[q.x, q.y, q.z, q.w]}
              fontSize={0.35}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.045}
              outlineColor="#000"
              material-toneMapped={false}
            >
              {f.number}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
