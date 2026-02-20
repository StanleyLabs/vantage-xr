import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * Stylized Apple Vision Pro headset built from Three.js geometry.
 * Uses a curved visor (extruded rounded-rect shape) + body shell.
 */
function VisorGlass() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const visorShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 2.4;
    const h = 1.1;
    const r = 0.45;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.04,
      bevelSegments: 8,
      curveSegments: 48,
    }),
    []
  );

  return (
    <mesh ref={meshRef} position={[0, 0, 0.45]}>
      <extrudeGeometry args={[visorShape, extrudeSettings]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={0.4}
        chromaticAberration={0.15}
        anisotropy={0.2}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.1}
        ior={1.5}
        color="#8B8B9E"
        attenuationColor="#C8C8D4"
        attenuationDistance={0.6}
        roughness={0.05}
        transmission={0.95}
        clearcoat={1}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

function BodyShell() {
  const shellShape = useMemo(() => {
    const shape = new THREE.Shape();
    const w = 2.5;
    const h = 1.2;
    const r = 0.5;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.65,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 48,
    }),
    []
  );

  return (
    <mesh position={[0, 0, -0.15]}>
      <extrudeGeometry args={[shellShape, extrudeSettings]} />
      <meshPhysicalMaterial
        color="#E8E8ED"
        metalness={0.9}
        roughness={0.15}
        clearcoat={0.8}
        clearcoatRoughness={0.1}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function HeadbandStrap() {
  return (
    <>
      {/* Left strap connector */}
      <mesh position={[-1.35, 0, 0.15]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.35, 0.1]} />
        <meshPhysicalMaterial color="#D4D4D8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right strap connector */}
      <mesh position={[1.35, 0, 0.15]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.15, 0.35, 0.1]} />
        <meshPhysicalMaterial color="#D4D4D8" metalness={0.8} roughness={0.2} />
      </mesh>
    </>
  );
}

function DigitalCrown() {
  return (
    <mesh position={[1.42, 0.35, 0.25]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.06, 0.06, 0.08, 32]} />
      <meshPhysicalMaterial color="#C0C0C8" metalness={0.95} roughness={0.1} />
    </mesh>
  );
}

interface VisionProModelProps {
  scrollRef: React.RefObject<number>;
}

export default function VisionProModel({ scrollRef }: VisionProModelProps) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Scroll-driven rotation
    const sp = scrollRef.current ?? 0;
    const targetRotY = sp * Math.PI * 2;
    const targetRotX = Math.sin(sp * Math.PI) * 0.3;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      delta * 3
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      delta * 3
    );

    // Scale breathing
    const scale = 1 + Math.sin(sp * Math.PI * 4) * 0.03;
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#2997FF" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#BF5AF2" distance={8} />
      <spotLight
        position={[0, 5, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.6}
        color="#ffffff"
      />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={groupRef}>
          <VisorGlass />
          <BodyShell />
          <HeadbandStrap />
          <DigitalCrown />
        </group>
      </Float>
    </>
  );
}
