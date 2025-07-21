"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { cn } from "@/utils/styling";

interface D10DiceProps {
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

function createD10Faces(): FaceData[] {
  // Create a pentagonal trapezohedron approximation using cylinder
  const faces: FaceData[] = [];
  const radius = 1;
  // const height = 1.5;

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10;
    const nextAngle = ((i + 1) * Math.PI * 2) / 10;

    // Calculate face normal pointing outward
    const midAngle = (angle + nextAngle) / 2;
    const normal = new THREE.Vector3(Math.cos(midAngle), 0, Math.sin(midAngle)).normalize();

    // Calculate centroid (center of trapezoid face)
    const centroid = normal.clone().multiplyScalar(radius * 0.8);

    faces.push({
      centroid,
      normal,
      number: i,
    });
  }

  return faces;
}

export function D10Dice({ className, size = "md", onRoll, disabled = false }: D10DiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [hasRolled, setHasRolled] = useState(false);

  const faces = useMemo(createD10Faces, []);
  const { scale, canvas } = sizeMap[size];

  const rollDice = () => {
    if (disabled || isRolling) return;
    setResult(Math.floor(Math.random() * 10));
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
        aria-label="Roll D10 dice"
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
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#F59E0B" />

      <D10Mesh faces={faces} isRolling={isRolling} result={result} onRollComplete={onRollComplete} scale={scale} />
    </>
  );
}

function D10Mesh({
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
          <cylinderGeometry args={[1, 0.3, 1.5, 10]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.1} roughness={0.7} toneMapped={false} />
        </mesh>

        {faces.map((face) => {
          const textPos = face.centroid.clone().addScaledVector(face.normal, 0.001);
          const textQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), face.normal);

          return (
            <Text
              key={face.number}
              position={[textPos.x, textPos.y, textPos.z]}
              quaternion={[textQuat.x, textQuat.y, textQuat.z, textQuat.w]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#000000"
              material-toneMapped={false}
            >
              {face.number}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
