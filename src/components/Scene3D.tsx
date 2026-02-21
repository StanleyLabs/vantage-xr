import { Suspense } from "react";
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
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <ProductShowcase scrollRef={scrollRef} />
        </Canvas>
      </Suspense>
    </div>
  );
}
