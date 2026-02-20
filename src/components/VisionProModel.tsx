import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Preload standardized models
useGLTF.preload("/models/apple-vision-pro.glb");
useGLTF.preload("/models/apple-macbook-pro.glb");
useGLTF.preload("/models/apple-mac-mini.glb");

interface Props {
  scrollRef: React.RefObject<number>;
}

/**
 * Scroll-driven product showcase with standardized models (~1-3 units each):
 *   VP:  2.7 x 1.0 x 1.8
 *   MB:  3.1 x 2.1 x 3.0
 *   MM:  1.2 x 0.5 x 1.2
 *
 * Timeline:
 *   0.00–0.45  Vision Pro solo, gentle rotation
 *   0.45–0.65  MacBook Pro slides in, VP shifts left
 *   0.65–0.85  Mac Mini appears, camera pulls back
 *   0.85–1.00  All visible, closing
 */
export default function ProductShowcase({ scrollRef }: Props) {
  const vpGroup = useRef<THREE.Group>(null!);
  const mbGroup = useRef<THREE.Group>(null!);
  const mmGroup = useRef<THREE.Group>(null!);

  const vp = useGLTF("/models/apple-vision-pro.glb");
  const mb = useGLTF("/models/apple-macbook-pro.glb");
  const mm = useGLTF("/models/apple-mac-mini.glb");

  const { camera } = useThree();

  // Boost env map on all meshes
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

  useFrame((state, delta) => {
    const sp = scrollRef.current ?? 0;
    const t = state.clock.elapsedTime;

    // ── Vision Pro ──
    if (vpGroup.current) {
      const vpRotY = sp * Math.PI * 1.5 + t * 0.15;
      const vpRotX = Math.sin(sp * Math.PI) * 0.15;

      // Position & scale transitions
      let vpX = 0, vpY = 0, vpScale = 1;
      if (sp > 0.4) {
        const p = THREE.MathUtils.clamp((sp - 0.4) / 0.15, 0, 1);
        vpX = THREE.MathUtils.lerp(0, -2, p);
        vpScale = THREE.MathUtils.lerp(1, 0.7, p);
      }
      if (sp > 0.6) {
        const p = THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1);
        vpX = THREE.MathUtils.lerp(-2, -1.5, p);
        vpY = THREE.MathUtils.lerp(0, 1, p);
        vpScale = THREE.MathUtils.lerp(0.7, 0.55, p);
      }

      vpGroup.current.position.x = THREE.MathUtils.lerp(vpGroup.current.position.x, vpX, delta * 3);
      vpGroup.current.position.y = THREE.MathUtils.lerp(vpGroup.current.position.y, vpY, delta * 3);
      vpGroup.current.scale.setScalar(THREE.MathUtils.lerp(vpGroup.current.scale.x, vpScale, delta * 3));
      vpGroup.current.rotation.y = THREE.MathUtils.lerp(vpGroup.current.rotation.y, vpRotY, delta * 2);
      vpGroup.current.rotation.x = THREE.MathUtils.lerp(vpGroup.current.rotation.x, vpRotX, delta * 2);
    }

    // ── MacBook Pro ──
    if (mbGroup.current) {
      const enter = THREE.MathUtils.clamp((sp - 0.4) / 0.2, 0, 1);
      const ease = enter * enter * (3 - 2 * enter); // smoothstep

      let mbX = THREE.MathUtils.lerp(6, 1.5, ease);
      let mbY = 0;
      let mbScale = THREE.MathUtils.lerp(0, 0.8, ease);
      const mbRotY = Math.PI - 0.4 + t * 0.1;

      if (sp > 0.6) {
        const p = THREE.MathUtils.clamp((sp - 0.6) / 0.15, 0, 1);
        mbX = THREE.MathUtils.lerp(1.5, 0.3, p);
        mbY = THREE.MathUtils.lerp(0, -0.3, p);
        mbScale = THREE.MathUtils.lerp(0.8, 0.6, p);
      }

      mbGroup.current.position.x = THREE.MathUtils.lerp(mbGroup.current.position.x, mbX, delta * 3);
      mbGroup.current.position.y = THREE.MathUtils.lerp(mbGroup.current.position.y, mbY, delta * 3);
      mbGroup.current.scale.setScalar(THREE.MathUtils.lerp(mbGroup.current.scale.x, mbScale, delta * 3));
      mbGroup.current.rotation.y = THREE.MathUtils.lerp(mbGroup.current.rotation.y, mbRotY, delta * 2);
      mbGroup.current.rotation.x = THREE.MathUtils.lerp(mbGroup.current.rotation.x, 0.35, delta * 2);
    }

    // ── Mac Mini ──
    if (mmGroup.current) {
      const enter = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
      const ease = enter * enter * (3 - 2 * enter);

      const mmX = THREE.MathUtils.lerp(0, 1.8, ease);
      const mmY = THREE.MathUtils.lerp(-3, -0.8, ease);
      const mmScale = THREE.MathUtils.lerp(0, 0.9, ease);
      const mmRotY = Math.PI + 0.5 + t * 0.08;

      mmGroup.current.position.x = THREE.MathUtils.lerp(mmGroup.current.position.x, mmX, delta * 3);
      mmGroup.current.position.y = THREE.MathUtils.lerp(mmGroup.current.position.y, mmY, delta * 3);
      mmGroup.current.scale.setScalar(THREE.MathUtils.lerp(mmGroup.current.scale.x, mmScale, delta * 3));
      mmGroup.current.rotation.y = THREE.MathUtils.lerp(mmGroup.current.rotation.y, mmRotY, delta * 2);
      mmGroup.current.rotation.x = THREE.MathUtils.lerp(mmGroup.current.rotation.x, 0.3, delta * 2);
    }

    // ── Camera — pull back for multi-product view ──
    let camZ = 4;
    if (sp > 0.6) {
      const p = THREE.MathUtils.clamp((sp - 0.6) / 0.2, 0, 1);
      camZ = THREE.MathUtils.lerp(4, 5.5, p);
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

      {/* Vision Pro — hero product, centered */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <group ref={vpGroup}>
          <primitive object={vp.scene} />
        </group>
      </Float>

      {/* MacBook Pro — enters from right */}
      <group ref={mbGroup} position={[6, 0, 0]} scale={0}>
        <primitive object={mb.scene} />
      </group>

      {/* Mac Mini — enters from below */}
      <group ref={mmGroup} position={[0, -3, 0]} scale={0}>
        <primitive object={mm.scene} />
      </group>
    </>
  );
}
