import { useEffect, useRef, useState, Suspense } from "react";
import Lenis from "lenis";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import IntroStatement from "./components/IntroStatement";
import Features from "./components/Features";
import Specs from "./components/Specs";
import Experience from "./components/Experience";
import Quote from "./components/Quote";
import Footer from "./components/Footer";
import Canvas3D from "./components/Canvas3D";

export default function App() {
  const [heroVisible, setHeroVisible] = useState(false);
  const scrollRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const navBgRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth-scroll anchor links via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: 0 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    // Scroll progress — direct DOM updates, no React re-renders
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      scrollRef.current = progress;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress * 100}%`;
      }

      if (navBgRef.current) {
        const nav = navBgRef.current;
        if (progress > 0.02) {
          nav.classList.add("bg-void/70", "backdrop-blur-xl");
          nav.classList.remove("bg-transparent");
        } else {
          nav.classList.remove("bg-void/70", "backdrop-blur-xl");
          nav.classList.add("bg-transparent");
        }
      }
    });

    setTimeout(() => setHeroVisible(true), 200);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-void text-white">
      <Navbar navBgRef={navBgRef} progressBarRef={progressBarRef} />

      {/* 3D Zone: sticky canvas behind Hero + Features */}
      <div className="relative">
        <div className="sticky top-0 z-0 h-dvh w-full">
          <Suspense fallback={null}>
            <Canvas3D scrollRef={scrollRef} />
          </Suspense>
        </div>

        <Hero visible={heroVisible} />
        <IntroStatement />
        <Features />

        {/* Spacer so the 3D canvas stays sticky until just before Specs */}
        <div className="relative h-[50vh]" />
      </div>

      <Specs />
      <Experience />
      <Quote />
      <Footer />
    </div>
  );
}
