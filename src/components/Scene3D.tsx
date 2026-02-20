import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import VisionProModel from "./VisionProModel";

interface Scene3DProps {
  scrollProgress: number;
}

function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
    </div>
  );
}

export default function Scene3D({ scrollProgress }: Scene3DProps) {
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
        >
          <VisionProModel scrollProgress={scrollProgress} />
        </Canvas>
      </Suspense>
    </div>
  );
}
