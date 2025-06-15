"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import { cn } from "@/utils/styling";

interface D20DiceProps {
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
  md: { scale: 1,   canvas: "w-32 h-32" },
  lg: { scale: 1.2, canvas: "w-40 h-40" },
  xl: { scale: 1.5, canvas: "w-48 h-48" }
};

// Build each triangular face (centroid + outward normal), then
// pair opposites so numbers sum to 21
function createIcosahedronFaces(): FaceData[] {
  const geom = new THREE.IcosahedronGeometry(1, 0).toNonIndexed();
  const pos = geom.attributes.position;
  const faceCount = pos.count / 3; // 20 faces

  // 1) gather raw centroids & normals
  const raw = Array.from({ length: faceCount }, (_, i) => {
    const a = new THREE.Vector3().fromBufferAttribute(pos, i*3+0);
    const b = new THREE.Vector3().fromBufferAttribute(pos, i*3+1);
    const c = new THREE.Vector3().fromBufferAttribute(pos, i*3+2);
    const centroid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
    const normal = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    // ensure it points outward
    if (normal.dot(centroid) < 0) normal.negate();
    return { centroid, normal, index: i };
  });

  // 2) pair opposite faces by nearly opposite normals
  const used = new Array(faceCount).fill(false);
  const opposite = new Array<number>(faceCount);
  for (let i = 0; i < faceCount; i++) {
    if (used[i]) continue;
    for (let j = i+1; j < faceCount; j++) {
      if (!used[j] && raw[i].normal.dot(raw[j].normal) < -0.9999) {
        used[i] = used[j] = true;
        opposite[i] = j;
        opposite[j] = i;
        break;
      }
    }
  }

  // 3) assign numbers 1 to 20 so opposites sum to 21
  const numMap = new Array<number>(faceCount);
  let label = 1;
  for (let i = 0; i < faceCount; i++) {
    if (numMap[i] == null) {
      const j = opposite[i];
      numMap[i] = label;
      numMap[j] = 21 - label;
      label++;
    }
  }

  geom.dispose();
  return raw.map(f => ({
    centroid: f.centroid,
    normal: f.normal,
    number: numMap[f.index]
  }));
}

export function D20Dice({
  className,
  size = "md",
  onRoll,
  disabled = false
}: D20DiceProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number|null>(null);
  const [hasRolled, setHasRolled] = useState(false);
  const [hasError, setHasError] = useState(false);

  const faces = useMemo(createIcosahedronFaces, []);
  const { scale, canvas } = sizeMap[size];

  const rollDice = () => {
    if (disabled || isRolling) return;
    // pick a result
    setResult(Math.floor(Math.random() * 20) + 1);
    setIsRolling(true);
  };

  const handleRollComplete = () => {
    setIsRolling(false);
    setHasRolled(true);
    if (result != null) onRoll?.(result);
  };

  if (hasError) {
    // fallback 2D
    return (
      <div className={cn("relative inline-block", className)}>
        <div
          className={cn(
            canvas,
            "cursor-pointer flex items-center justify-center",
            "bg-primary/10 rounded-lg border-2 border-primary/20"
          )}
          onClick={rollDice}
        >
          <span className="text-primary font-bold">D20</span>
        </div>
        <div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground text-center whitespace-nowrap"
        >
          {isRolling ? "Rolling..." : "Click to roll"}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <div className={cn(canvas, "cursor-pointer")} onClick={rollDice}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          onError={e => {
            console.error("Canvas error:", e);
            setHasError(true);
          }}
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
  scale
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
      <directionalLight
        position={[-3, -3, -3]}
        intensity={0.4}
        color="#e0e7ff"
      />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#8B5CF6" />

      <D20Mesh
        faces={faces}
        isRolling={isRolling}
        result={result}
        onRollComplete={onRollComplete}
        scale={scale}
      />
    </>
  );
}

function D20Mesh({
  faces,
  isRolling,
  result,
  onRollComplete,
  scale
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
    if (isRolling && result != null && groupRef.current) {
      startQuat.current.copy(groupRef.current.quaternion);
      startTime.current = Date.now() / 1000;
      finishedRef.current = false;

      // random spin axis/count
      spinAxis.current.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      spinCount.current = 4 + Math.random() * 6;

      // compute final orientation: face.normal -> camera direction
      const face = faces.find((f) => f.number === result)!;
      const camDir = camera.position.clone().normalize();
      const mapQ = new THREE.Quaternion().setFromUnitVectors(
        face.normal,
        camDir
      );
      const twistQ = new THREE.Quaternion().setFromAxisAngle(
        camDir,
        Math.random() * Math.PI * 2
      );
      finalQuat.current.copy(twistQ).multiply(mapQ);
    }
  }, [isRolling, result, faces, camera]);

  useFrame(() => {
    const grp = groupRef.current!;
    if (isRolling) {
      const t = Date.now() / 1000 - startTime.current;
      const dur = 2.5;
      if (t < dur) {
        const p = t / dur;
        const ease = 1 - Math.pow(1 - p, 4);

        // 1) slerp start → final
        const q = startQuat.current.clone().slerp(finalQuat.current, ease);

        // 2) add decaying spin
        const angle = (1 - ease) * spinCount.current * Math.PI * 2;
        const spinQ = new THREE.Quaternion().setFromAxisAngle(
          spinAxis.current,
          angle
        );
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
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#8B52A6"
            metalness={0.01}
            roughness={0.8}
            toneMapped={false}
          />
        </mesh>

        {faces.map((face) => {
          // base text position (just above triangle plane)
          const textPos = face.centroid
            .clone()
            .addScaledVector(face.normal, 0.001);

          // align text +Z to face normal
          const textQuat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            face.normal
          );

          // if 6 or 9, append a combining dot-below (U+0323)
          const label =
            face.number === 6 || face.number === 9
              ? `${face.number}.`
              : `${face.number}`;

          return (
            <Text
              key={face.number}
              position={[textPos.x, textPos.y, textPos.z]}
              quaternion={[textQuat.x, textQuat.y, textQuat.z, textQuat.w]}
              fontSize={0.45}
              color="white"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.04}
              outlineColor="#000000"
              material-toneMapped={false}
            >
              {label}
            </Text>
          );
        })}
      </group>
    </group>
  );
}