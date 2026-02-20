import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Preload models
useGLTF.preload("/models/apple_vision_pro_1k.glb");
useGLTF.preload("/models/apple_macbook_pro_1k.glb");
useGLTF.preload("/models/apple_mac_mini_1k.glb");

interface Props {
  scrollRef: React.RefObject<number>;
}

/**
 * Scroll-driven product showcase:
 * 0.00–0.45  → Vision Pro solo (features 1-3)
 * 0.45–0.65  → MacBook Pro slides in, VP shifts left
 * 0.65–0.85  → Mac Mini appears, full ecosystem
 * 0.85–1.00  → Closing / pull back
 */
export default function ProductShowcase({ scrollRef }: Props) {
  const vpGroup = useRef<THREE.Group>(null!);
  const mbGroup = useRef<THREE.Group>(null!);
  const mmGroup = useRef<THREE.Group>(null!);

  const vp = useGLTF("/models/apple_vision_pro_1k.glb");
  const mb = useGLTF("/models/apple_macbook_pro_1k.glb");
  const mm = useGLTF("/models/apple_mac_mini_1k.glb");

  const { camera } = useThree();

  // Center and normalize models on first load
  useEffect(() => {
    [vp, mb, mm].forEach((model) => {
      model.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.5;
          }
        }
      });
    });
  }, [vp, mb, mm]);

  useFrame((_state, delta) => {
    const sp = scrollRef.current ?? 0;

    // ── Vision Pro ──
    if (vpGroup.current) {
      // Slow auto-rotate + scroll-driven rotation
      const vpRotY = sp * Math.PI * 1.5 + _state.clock.elapsedTime * 0.15;
      const vpRotX = Math.sin(sp * Math.PI) * 0.15;

      vpGroup.current.rotation.y = THREE.MathUtils.lerp(
        vpGroup.current.rotation.y,
        vpRotY,
        delta * 2
      );
      vpGroup.current.rotation.x = THREE.MathUtils.lerp(
        vpGroup.current.rotation.x,
        vpRotX,
        delta * 2
      );

      // Position: centered early, shifts left when MacBook enters
      let vpX = 0;
      let vpY = 0;
      let vpScale = 6;
      if (sp > 0.4) {
        const t = THREE.MathUtils.clamp((sp - 0.4) / 0.15, 0, 1);
        vpX = THREE.MathUtils.lerp(0, -2, t);
        vpScale = THREE.MathUtils.lerp(6, 4, t);
      }
      if (sp > 0.6) {
        const t = THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1);
        vpX = THREE.MathUtils.lerp(-2, -1.5, t);
        vpY = THREE.MathUtils.lerp(0, 1.2, t);
        vpScale = THREE.MathUtils.lerp(4, 3, t);
      }
      vpGroup.current.position.y = THREE.MathUtils.lerp(vpGroup.current.position.y, vpY, delta * 3);

      vpGroup.current.position.x = THREE.MathUtils.lerp(vpGroup.current.position.x, vpX, delta * 3);
      vpGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(vpGroup.current.scale.x, vpScale, delta * 3)
      );
    }

    // ── MacBook Pro ──
    if (mbGroup.current) {
      // Slides in from the right at ~0.45
      const mbEnter = THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1);
      const mbSmooth = mbEnter * mbEnter * (3 - 2 * mbEnter); // smoothstep

      let mbX = THREE.MathUtils.lerp(6, 1.8, mbSmooth);
      let mbY = 0;
      let mbScale = THREE.MathUtils.lerp(0, 10, mbSmooth);
      const mbRotY = -0.3 + _state.clock.elapsedTime * 0.1;

      // When Mac Mini enters, MacBook shifts
      if (sp > 0.6) {
        const t = THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1);
        mbX = THREE.MathUtils.lerp(1.8, 0, t);
        mbY = THREE.MathUtils.lerp(0, -0.5, t);
        mbScale = THREE.MathUtils.lerp(10, 7, t);
      }

      mbGroup.current.position.x = THREE.MathUtils.lerp(mbGroup.current.position.x, mbX, delta * 3);
      mbGroup.current.position.y = THREE.MathUtils.lerp(mbGroup.current.position.y, mbY, delta * 3);
      mbGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(mbGroup.current.scale.x, mbScale, delta * 3)
      );
      mbGroup.current.rotation.x = THREE.MathUtils.lerp(
        mbGroup.current.rotation.x,
        Math.PI / 2,
        delta * 2
      );
      mbGroup.current.rotation.y = THREE.MathUtils.lerp(
        mbGroup.current.rotation.y,
        mbRotY,
        delta * 2
      );
    }

    // ── Mac Mini ──
    if (mmGroup.current) {
      const mmEnter = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
      const mmSmooth = mmEnter * mmEnter * (3 - 2 * mmEnter);

      const mmX = THREE.MathUtils.lerp(0, 1.8, mmSmooth);
      const mmY = THREE.MathUtils.lerp(-4, -1, mmSmooth);
      const mmScale = THREE.MathUtils.lerp(0, 10, mmSmooth);
      const mmRotY = 0.5 + _state.clock.elapsedTime * 0.08;

      mmGroup.current.position.x = THREE.MathUtils.lerp(mmGroup.current.position.x, mmX, delta * 3);
      mmGroup.current.position.y = THREE.MathUtils.lerp(mmGroup.current.position.y, mmY, delta * 3);
      mmGroup.current.scale.setScalar(
        THREE.MathUtils.lerp(mmGroup.current.scale.x, mmScale, delta * 3)
      );
      mmGroup.current.rotation.y = THREE.MathUtils.lerp(
        mmGroup.current.rotation.y,
        mmRotY,
        delta * 2
      );
    }

    // ── Camera ──
    // Pull back slightly as more products appear
    let camZ = 4;
    if (sp > 0.6) {
      const t = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
      camZ = THREE.MathUtils.lerp(4, 6, t);
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

      {/* Vision Pro — hero product */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={vpGroup}>
          <primitive object={vp.scene} />
        </group>
      </Float>

      {/* MacBook Pro — starts offscreen right */}
      <group ref={mbGroup} position={[6, 0, 0]} scale={0}>
        <primitive object={mb.scene} />
      </group>

      {/* Mac Mini — disabled: model is flat planes, not real 3D. Needs replacement. */}
      <group ref={mmGroup} position={[0, -4, 0]} scale={0} visible={false}>
        <primitive object={mm.scene} />
      </group>
    </>
  );
}
