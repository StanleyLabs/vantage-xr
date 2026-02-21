import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
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

export default function Scene3D({ scrollRef }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Force a resize event after mount so the Canvas picks up its dimensions.
  // Without this, the Canvas can initialize with 0 size in certain layouts
  // (sticky + negative margin) and never start its render loop until
  // something else triggers a resize (like opening devtools).
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        dpr={[1, 2]}
        frameloop="always"
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
