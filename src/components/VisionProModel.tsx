import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

const MODEL_VP = `/models/apple-vision-pro.glb?v=${__APP_VERSION__}`;
const MODEL_MB = `/models/apple-macbook-pro.glb?v=${__APP_VERSION__}`;
const MODEL_MM = `/models/apple-mac-mini.glb?v=${__APP_VERSION__}`;

useGLTF.preload(MODEL_VP);
useGLTF.preload(MODEL_MB);
useGLTF.preload(MODEL_MM);

interface Props {
  scrollRef: React.RefObject<number>;
}

/** Smoothstep helper */
function smoothstep(x: number) {
  return x * x * (3 - 2 * x);
}

/**
 * Scroll-driven product showcase.
 *
 * Positions and scales are set directly from scroll progress (no lerp lag),
 * so the layout is identical whether scrolling down or up.
 * Only rotations use lerp for smooth visual spinning.
 */
export default function ProductShowcase({ scrollRef }: Props) {
  const vpGroup = useRef<THREE.Group>(null!);
  const mbGroup = useRef<THREE.Group>(null!);
  const mmGroup = useRef<THREE.Group>(null!);

  const vpRotAcc = useRef(0);
  const mbRotAcc = useRef(Math.PI - 0.4);
  const mmRotAcc = useRef(Math.PI + 0.5);

  const vp = useGLTF(MODEL_VP);
  const mb = useGLTF(MODEL_MB);
  const mm = useGLTF(MODEL_MM);

  const { camera } = useThree();

  useEffect(() => {
    [vp, mb, mm].forEach((model) => {
      model.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat) mat.envMapIntensity = 1.5;
        }
      });
    });
  }, [vp, mb, mm]);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const sp = scrollRef.current ?? 0;
    // Smooth blend factor: 0 = desktop (wide), 1 = mobile (narrow).
    // Transitions smoothly between viewport width 5–7 (three.js units)
    // instead of a hard threshold that causes flickering at boundary sizes.
    const vw = state.viewport.width;
    const m = THREE.MathUtils.clamp((7 - vw) / 2, 0, 1);

    // Accumulate gentle auto-rotation
    vpRotAcc.current += delta * 0.15;
    mbRotAcc.current += delta * 0.1;
    mmRotAcc.current += delta * 0.08;

    // Helper: blend between desktop (d) and mobile (m) values
    const mix = (desktop: number, mobile: number) =>
      THREE.MathUtils.lerp(desktop, mobile, m);

    // ── Vision Pro ──
    if (vpGroup.current) {
      const vpTargetRotY = sp * Math.PI * 1.5 + vpRotAcc.current;
      const vpTargetRotX = Math.sin(sp * Math.PI) * 0.15;

      let vpX = 0;
      let vpY = 0;
      let vpScale = mix(1, 0.8);

      if (sp > 0.4) {
        const p = smoothstep(THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1));
        vpY = THREE.MathUtils.lerp(0, mix(1.0, 1.1), p);
        vpScale = THREE.MathUtils.lerp(mix(1, 0.8), mix(0.65, 0.55), p);
      }

      if (sp > 0.6) {
        const p = smoothstep(THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1));
        vpX = 0;
        vpY = THREE.MathUtils.lerp(mix(1.0, 1.1), mix(0.7, 0.8), p);
        vpScale = THREE.MathUtils.lerp(mix(0.65, 0.55), mix(0.85, 0.7), p);
      }

      vpGroup.current.position.x = vpX;
      vpGroup.current.position.y = vpY;
      vpGroup.current.scale.setScalar(vpScale);
      vpGroup.current.rotation.y = THREE.MathUtils.lerp(vpGroup.current.rotation.y, vpTargetRotY, delta * 2);
      vpGroup.current.rotation.x = THREE.MathUtils.lerp(vpGroup.current.rotation.x, vpTargetRotX, delta * 2);
    }

    // ── MacBook Pro ──
    if (mbGroup.current) {
      const enter = smoothstep(THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1));

      let mbX = 0;
      let mbY = THREE.MathUtils.lerp(-4, -1.0, enter);
      let mbScale = THREE.MathUtils.lerp(0, mix(0.8, 0.6), enter);

      if (sp > 0.6) {
        const p = smoothstep(THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1));
        mbX = THREE.MathUtils.lerp(0, mix(-6, -5), p);
        mbScale = THREE.MathUtils.lerp(mix(0.8, 0.6), 0, p);
      }

      mbGroup.current.position.x = mbX;
      mbGroup.current.position.y = mbY;
      mbGroup.current.scale.setScalar(mbScale);
      mbGroup.current.rotation.y = THREE.MathUtils.lerp(mbGroup.current.rotation.y, mbRotAcc.current, delta * 2);
      mbGroup.current.rotation.x = THREE.MathUtils.lerp(mbGroup.current.rotation.x, 0.35, delta * 2);
    }

    // ── Mac Mini ──
    if (mmGroup.current) {
      const enter = smoothstep(THREE.MathUtils.clamp((sp - 0.55) / 0.15, 0, 1));

      const mmX = THREE.MathUtils.lerp(mix(6, 4), 0, enter);
      const mmY = THREE.MathUtils.lerp(0, mix(-0.5, -0.3), enter);
      const mmScale = THREE.MathUtils.lerp(0, mix(0.9, 0.7), enter);

      mmGroup.current.position.x = mmX;
      mmGroup.current.position.y = mmY;
      mmGroup.current.scale.setScalar(mmScale);
      mmGroup.current.rotation.y = THREE.MathUtils.lerp(mmGroup.current.rotation.y, mmRotAcc.current, delta * 2);
      mmGroup.current.rotation.x = THREE.MathUtils.lerp(mmGroup.current.rotation.x, 0.3, delta * 2);
    }

    // ── Camera ──
    let camZ = mix(4, 5);
    if (sp > 0.4) {
      const p = smoothstep(THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1));
      camZ = THREE.MathUtils.lerp(mix(4, 5), mix(5, 6), p);
    }
    if (sp > 0.6) {
      const p = smoothstep(THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1));
      camZ = THREE.MathUtils.lerp(mix(5, 6), mix(5.5, 6.5), p);
    }
    camera.position.z = camZ;
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#2997FF" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#BF5AF2" distance={8} />
      <spotLight position={[0, 5, 0]} angle={0.4} penumbra={1} intensity={0.6} />

      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={vpGroup}>
          <primitive object={vp.scene} />
        </group>
      </Float>

      <group ref={mbGroup} position={[0, -4, 0]} scale={0}>
        <primitive object={mb.scene} />
      </group>

      <group ref={mmGroup} position={[6, 0, 0]} scale={0}>
        <primitive object={mm.scene} />
      </group>
    </>
  );
}
