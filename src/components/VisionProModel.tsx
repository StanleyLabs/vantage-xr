import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/apple-vision-pro.glb");
useGLTF.preload("/models/apple-macbook-pro.glb");
useGLTF.preload("/models/apple-mac-mini.glb");

interface Props {
  scrollRef: React.RefObject<number>;
}

/**
 * Scroll-driven product showcase.
 *
 * Layout (revised):
 *   0.00–0.40  Vision Pro solo, centered, gentle spin
 *   0.40–0.60  MacBook enters from below; VP rises above it
 *   0.60–0.85  Mac Mini enters from right; MacBook exits left; VP stays top-center
 *   0.85–1.00  VP top-center + Mac Mini center-right, closing
 *
 * Key fix: rotations use accumulated deltas (clamped) instead of
 * clock.elapsedTime, so returning to a backgrounded tab won't cause
 * wild spin catch-up.
 */
export default function ProductShowcase({ scrollRef }: Props) {
  const vpGroup = useRef<THREE.Group>(null!);
  const mbGroup = useRef<THREE.Group>(null!);
  const mmGroup = useRef<THREE.Group>(null!);

  // Accumulated rotation angles — delta-based, no elapsedTime dependency
  const vpRotAcc = useRef(0);
  const mbRotAcc = useRef(Math.PI - 0.4);
  const mmRotAcc = useRef(Math.PI + 0.5);

  const vp = useGLTF("/models/apple-vision-pro.glb");
  const mb = useGLTF("/models/apple-macbook-pro.glb");
  const mm = useGLTF("/models/apple-mac-mini.glb");

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
    // Clamp delta so a long gap (tab hidden) doesn't cause huge jumps
    const delta = Math.min(rawDelta, 0.05);
    const sp = scrollRef.current ?? 0;

    // Mobile detection via viewport width (three.js units)
    const isMobile = state.viewport.width < 6;
    const lerpSpeed = 4;

    // Accumulate gentle auto-rotation (clamped delta means no catch-up)
    vpRotAcc.current += delta * 0.15;
    mbRotAcc.current += delta * 0.1;
    mmRotAcc.current += delta * 0.08;

    // ── Vision Pro ──
    if (vpGroup.current) {
      const vpTargetRotY = sp * Math.PI * 1.5 + vpRotAcc.current;
      const vpTargetRotX = Math.sin(sp * Math.PI) * 0.15;

      let vpX = 0,
        vpY = 0,
        vpScale = isMobile ? 0.8 : 1;

      // Phase 2: VP rises above as MacBook enters
      if (sp > 0.4) {
        const p = THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1);
        vpY = THREE.MathUtils.lerp(0, isMobile ? 1.6 : 1.5, p);
        vpScale = THREE.MathUtils.lerp(isMobile ? 0.8 : 1, isMobile ? 0.55 : 0.65, p);
      }

      // Phase 3: VP stays top-center, slightly smaller
      if (sp > 0.6) {
        const p = THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1);
        vpX = THREE.MathUtils.lerp(0, isMobile ? 0 : -0.3, p);
        vpY = THREE.MathUtils.lerp(isMobile ? 1.6 : 1.5, isMobile ? 1.8 : 1.6, p);
        vpScale = THREE.MathUtils.lerp(isMobile ? 0.55 : 0.65, isMobile ? 0.5 : 0.55, p);
      }

      vpGroup.current.position.x = THREE.MathUtils.lerp(vpGroup.current.position.x, vpX, delta * lerpSpeed);
      vpGroup.current.position.y = THREE.MathUtils.lerp(vpGroup.current.position.y, vpY, delta * lerpSpeed);
      vpGroup.current.scale.setScalar(THREE.MathUtils.lerp(vpGroup.current.scale.x, vpScale, delta * lerpSpeed));
      vpGroup.current.rotation.y = THREE.MathUtils.lerp(vpGroup.current.rotation.y, vpTargetRotY, delta * 2);
      vpGroup.current.rotation.x = THREE.MathUtils.lerp(vpGroup.current.rotation.x, vpTargetRotX, delta * 2);
    }

    // ── MacBook Pro ──
    if (mbGroup.current) {
      const enter = THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1);
      const ease = enter * enter * (3 - 2 * enter);

      let mbX = THREE.MathUtils.lerp(0, 0, ease); // enters centered
      let mbY = THREE.MathUtils.lerp(-4, isMobile ? -0.3 : -0.2, ease);
      let mbScale = THREE.MathUtils.lerp(0, isMobile ? 0.6 : 0.8, ease);
      const mbTargetRotY = mbRotAcc.current;

      // Phase 3: MacBook slides left and out as Mac Mini enters
      if (sp > 0.6) {
        const p = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
        mbX = THREE.MathUtils.lerp(0, isMobile ? -5 : -6, p);
        mbScale = THREE.MathUtils.lerp(isMobile ? 0.6 : 0.8, 0, p);
      }

      mbGroup.current.position.x = THREE.MathUtils.lerp(mbGroup.current.position.x, mbX, delta * lerpSpeed);
      mbGroup.current.position.y = THREE.MathUtils.lerp(mbGroup.current.position.y, mbY, delta * lerpSpeed);
      mbGroup.current.scale.setScalar(THREE.MathUtils.lerp(mbGroup.current.scale.x, mbScale, delta * lerpSpeed));
      mbGroup.current.rotation.y = THREE.MathUtils.lerp(mbGroup.current.rotation.y, mbTargetRotY, delta * 2);
      mbGroup.current.rotation.x = THREE.MathUtils.lerp(mbGroup.current.rotation.x, 0.35, delta * 2);
    }

    // ── Mac Mini ──
    if (mmGroup.current) {
      const enter = THREE.MathUtils.clamp((sp - 0.55) / 0.15, 0, 1);
      const ease = enter * enter * (3 - 2 * enter);

      const mmX = THREE.MathUtils.lerp(isMobile ? 4 : 6, isMobile ? 0 : 0, ease);
      const mmY = THREE.MathUtils.lerp(0, isMobile ? -0.3 : -0.5, ease);
      const mmScale = THREE.MathUtils.lerp(0, isMobile ? 0.7 : 0.9, ease);
      const mmTargetRotY = mmRotAcc.current;

      mmGroup.current.position.x = THREE.MathUtils.lerp(mmGroup.current.position.x, mmX, delta * lerpSpeed);
      mmGroup.current.position.y = THREE.MathUtils.lerp(mmGroup.current.position.y, mmY, delta * lerpSpeed);
      mmGroup.current.scale.setScalar(THREE.MathUtils.lerp(mmGroup.current.scale.x, mmScale, delta * lerpSpeed));
      mmGroup.current.rotation.y = THREE.MathUtils.lerp(mmGroup.current.rotation.y, mmTargetRotY, delta * 2);
      mmGroup.current.rotation.x = THREE.MathUtils.lerp(mmGroup.current.rotation.x, 0.3, delta * 2);
    }

    // ── Camera ──
    let camZ = isMobile ? 5 : 4;
    if (sp > 0.4) {
      const p = THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1);
      camZ = THREE.MathUtils.lerp(isMobile ? 5 : 4, isMobile ? 6 : 5, p);
    }
    if (sp > 0.6) {
      const p = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
      camZ = THREE.MathUtils.lerp(isMobile ? 6 : 5, isMobile ? 6.5 : 5.5, p);
    }
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, delta * 2);
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#2997FF" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#BF5AF2" distance={8} />
      <spotLight position={[0, 5, 0]} angle={0.4} penumbra={1} intensity={0.6} />

      {/* Vision Pro — hero, centered then rises above */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={vpGroup}>
          <primitive object={vp.scene} />
        </group>
      </Float>

      {/* MacBook Pro — enters from below, then exits left */}
      <group ref={mbGroup} position={[0, -4, 0]} scale={0}>
        <primitive object={mb.scene} />
      </group>

      {/* Mac Mini — enters from right */}
      <group ref={mmGroup} position={[6, 0, 0]} scale={0}>
        <primitive object={mm.scene} />
      </group>
    </>
  );
}
