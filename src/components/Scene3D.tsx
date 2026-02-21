import { useEffect, useRef, useState, Suspense } from "react";
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
  const [mounted, setMounted] = useState(false);

  // Only mount the Canvas once the container has actual dimensions.
  // This prevents WebGL context creation on a 0-size element,
  // which some browsers immediately mark as "context lost."
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function check() {
      const { width, height } = el!.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setMounted(true);
      } else {
        requestAnimationFrame(check);
      }
    }

    check();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {mounted ? (
        <Suspense fallback={<Loader />}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 50 }}
            dpr={[1, 2]}
            frameloop="always"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              const canvas = gl.domElement;
              canvas.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                console.warn("WebGL context lost — will restore");
              });
              canvas.addEventListener("webglcontextrestored", () => {
                console.log("WebGL context restored");
              });
            }}
            style={{ background: "transparent" }}
          >
            <ProductShowcase scrollRef={scrollRef} />
          </Canvas>
        </Suspense>
      ) : (
        <Loader />
      )}
    </div>
  );
}
