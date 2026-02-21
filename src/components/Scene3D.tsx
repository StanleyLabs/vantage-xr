import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ProductShowcase from "./VisionProModel";

interface Scene3DProps {
  scrollRef: React.RefObject<number>;
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  );
}

/**
 * Pre-validate that all GLB files are fetchable before mounting the Canvas.
 * This avoids useGLTF/Suspense hanging silently on failed fetches.
 */
function useModelsReady(paths: string[]) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loader = new GLTFLoader();
    Promise.all(paths.map((p) => loader.loadAsync(p)))
      .then(() => setReady(true))
      .catch((err) => {
        console.error("Failed to load models:", err);
        // Show scene anyway so it doesn't hang forever
        setReady(true);
      });
  }, []);

  return ready;
}

export default function Scene3D({ scrollRef }: Scene3DProps) {
  const ready = useModelsReady([
    "/models/apple-vision-pro.glb",
    "/models/apple-macbook-pro.glb",
    "/models/apple-mac-mini.glb",
  ]);

  if (!ready) return <Loader />;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ProductShowcase scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
