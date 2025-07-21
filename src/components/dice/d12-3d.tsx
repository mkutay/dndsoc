"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { cn } from "@/utils/styling";

interface D12DiceProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onRoll?: (n: number) => void;
  disabled?: boolean;
}

type FaceData = {
  centroid: THREE.Vector3;
  normal: THREE.Vector3;
  number: number;
};

const sizeMap = {
  sm: { scale: 0.8, canvas: "w-20 h-20" },
  md: { scale: 1, canvas: "w-32 h-32" },
  lg: { scale: 1.2, canvas: "w-40 h-40" },
  xl: { scale: 1.5, canvas: "w-48 h-48" },
};

function createDodecahedronFaces(): FaceData[] {
  // Create vertices for a regular dodecahedron
  const t = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const r = 1 / t;

  const vertices = [
    // (±1, ±1, ±1)
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(1, 1, 1),

    // (0, ±r, ±t)
    new THREE.Vector3(0, -r, -t),
    new THREE.Vector3(0, -r, t),
    new THREE.Vector3(0, r, -t),
    new THREE.Vector3(0, r, t),

    // (±r, ±t, 0)
    new THREE.Vector3(-r, -t, 0),
    new THREE.Vector3(-r, t, 0),
    new THREE.Vector3(r, -t, 0),
    new THREE.Vector3(r, t, 0),

    // (±t, 0, ±r)
    new THREE.Vector3(-t, 0, -r),
    new THREE.Vector3(-t, 0, r),
    new THREE.Vector3(t, 0, -r),
    new THREE.Vector3(t, 0, r),
  ];

  const faces = [
    [0, 8, 10, 2, 16],
    [0, 16, 17, 1, 12],
    [0, 12, 14, 4, 8],
    [1, 17, 3, 11, 9],
    [1, 9, 5, 14, 12],
    [2, 10, 6, 15, 13],
    [2, 13, 3, 17, 16],
    [3, 13, 15, 7, 11],
    [4, 14, 5, 19, 18],
    [4, 18, 6, 10, 8],
    [5, 9, 11, 7, 19],
    [6, 18, 19, 7, 15],
  ];

  // Calculate face centroids and normals
  const faceData: FaceData[] = [];

  faces.forEach((faceIndices, i) => {
    // Get vertices for this face
    const faceVertices = faceIndices.map((idx) => vertices[idx].clone().normalize());

    // Calculate centroid
    const centroid = new THREE.Vector3();
    faceVertices.forEach((vertex) => {
      centroid.add(vertex);
    });
    centroid.divideScalar(faceVertices.length);

    // Calculate normal using the first three vertices
    const v1 = faceVertices[0];
    const v2 = faceVertices[1];
    const v3 = faceVertices[2];
    const normal = new THREE.Vector3()
      .crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1))
      .normalize();

    // Make sure normal points outward
    if (normal.dot(centroid) < 0) {
      normal.negate();
    }

    faceData.push({
      centroid,
      normal,
      number: i + 1, // Will be adjusted later to ensure opposite faces sum to 13
    });
  });

  // Define the standard numbering for a D12
  // Based on the standard opposite face numbering (opposite faces sum to 13)
  const standardNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  faceData.forEach((face, i) => {
    face.number = standardNumbers[i];
  });

  return faceData;
}

export function D12Dice({ className, size = "md", onRoll, disabled = false }: D12DiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);

  const faces = useMemo(createDodecahedronFaces, []);
  const { scale, canvas } = sizeMap[size];

  const rollDice = () => {
    if (disabled || isRolling) return;
    setResult(Math.floor(Math.random() * 12) + 1);
    setIsRolling(true);
  };

  const handleRollComplete = () => {
    setIsRolling(false);
    setHasRolled(true);
    if (result !== null) onRoll?.(result);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div
        className={cn(canvas, "cursor-pointer")}
        onClick={rollDice}
        role="button"
        tabIndex={0}
        aria-label="Roll D12 dice"
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <Scene
            faces={faces}
            isRolling={isRolling}
            result={result}
            onRollComplete={handleRollComplete}
            scale={scale}
          />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={!isRolling}
            autoRotate={!hasRolled && !isRolling}
            autoRotateSpeed={1}
          />
        </Canvas>
      </div>
    </div>
  );
}

function Scene({
  faces,
  isRolling,
  result,
  onRollComplete,
  scale,
}: {
  faces: FaceData[];
  isRolling: boolean;
  result: number | null;
  onRollComplete: () => void;
  scale: number;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -3, -3]} intensity={0.4} color="#e0e7ff" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#7C3AED" />

      <D12Mesh faces={faces} isRolling={isRolling} result={result} onRollComplete={onRollComplete} scale={scale} />
    </>
  );
}

function D12Mesh({
  faces,
  isRolling,
  result,
  onRollComplete,
  scale,
}: {
  faces: FaceData[];
  isRolling: boolean;
  result: number | null;
  onRollComplete: () => void;
  scale: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startQuat = useRef(new THREE.Quaternion());
  const startTime = useRef(0);
  const finishedRef = useRef(false);
  const spinAxis = useRef(new THREE.Vector3());
  const spinCount = useRef(0);
  const finalQuat = useRef(new THREE.Quaternion());
  const { camera } = useThree();

  useEffect(() => {
    if (isRolling && result !== null && groupRef.current) {
      startQuat.current.copy(groupRef.current.quaternion);
      startTime.current = Date.now() / 1000;
      finishedRef.current = false;

      spinAxis.current.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      spinCount.current = 4 + Math.random() * 6;

      const face = faces.find((f) => f.number === result);
      if (face) {
        const camDir = camera.position.clone().normalize();
        const mapQ = new THREE.Quaternion().setFromUnitVectors(face.normal, camDir);
        const twistQ = new THREE.Quaternion().setFromAxisAngle(camDir, Math.random() * Math.PI * 2);
        finalQuat.current.copy(twistQ).multiply(mapQ);
      }
    }
  }, [isRolling, result, faces, camera]);

  useFrame(() => {
    const grp = groupRef.current;
    if (isRolling && grp) {
      const t = Date.now() / 1000 - startTime.current;
      const dur = 2.5;
      if (t < dur) {
        const p = t / dur;
        const ease = 1 - Math.pow(1 - p, 4);

        const q = startQuat.current.clone().slerp(finalQuat.current, ease);
        const angle = (1 - ease) * spinCount.current * Math.PI * 2;
        const spinQ = new THREE.Quaternion().setFromAxisAngle(spinAxis.current, angle);
        q.multiply(spinQ);
        grp.quaternion.copy(q);
      } else if (!finishedRef.current) {
        grp.quaternion.copy(finalQuat.current);
        finishedRef.current = true;
        onRollComplete();
      }
    }
  });

  return (
    <group scale={scale}>
      <group ref={groupRef}>
        <mesh>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7C3AED" metalness={0.1} roughness={0.7} toneMapped={false} />
        </mesh>

        {faces.map((face) => {
          const textPos = face.centroid.clone().addScaledVector(face.normal, 0.01);
          const textQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.normal);

          return (
            <Text
              key={face.number}
              position={[textPos.x, textPos.y, textPos.z]}
              quaternion={[textQuat.x, textQuat.y, textQuat.z, textQuat.w]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#000000"
              material-toneMapped={false}
            >
              {face.number + (face.number === 6 || face.number === 9 ? "." : "")}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
