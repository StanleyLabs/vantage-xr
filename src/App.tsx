import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lenis from "lenis";
import ScrollSection from "./components/ScrollSection";

const Scene3D = lazy(() => import("./components/Scene3D"));

/* ── Helpers ── */
function cn(...x: Array<string | false | null | undefined>) {
  return x.filter(Boolean).join(" ");
}

/* ── Feature data ── */
const features = [
  {
    label: "SPATIAL COMPUTING",
    title: "Your apps live\nin your world.",
    desc: "Apple Vision Pro seamlessly blends digital content with your physical space. Apps scale to the perfect size, and you can spread them around you — beyond the limits of any display.",
    accent: "from-apple-blue/20 to-transparent",
  },
  {
    label: "EYESIGHT",
    title: "Present, even\nwhile immersed.",
    desc: "A revolutionary outward display reveals your eyes to those around you, letting people know when you're using apps or fully immersed in an experience.",
    accent: "from-apple-purple/20 to-transparent",
  },
  {
    label: "MICRO‑OLED",
    title: "23 million pixels.\nTwo displays.",
    desc: "More pixels than a 4K TV — for each eye. Apple's custom micro‑OLED display system delivers stunning resolution with wide color and HDR support.",
    accent: "from-cyan/20 to-transparent",
  },
  {
    label: "R1 CHIP",
    title: "Virtually zero lag\nfor real‑time experiences.",
    desc: "A new Apple chip dedicated to real‑time sensor processing. R1 streams images to the displays within 12 milliseconds — 8× faster than the blink of an eye.",
    accent: "from-rose-500/20 to-transparent",
  },
  {
    label: "SPATIAL AUDIO",
    title: "Sound placed\nexactly where it belongs.",
    desc: "Dual-driver audio pods deliver personalized spatial audio based on your head and ear geometry, making sounds feel like they're part of your environment.",
    accent: "from-emerald-500/20 to-transparent",
  },
];

const specs = [
  { label: "Display", value: "Micro‑OLED" },
  { label: "Pixels", value: "23M total" },
  { label: "Chips", value: "M2 + R1" },
  { label: "Tracking", value: "Eye + Hand" },
  { label: "Audio", value: "Spatial" },
  { label: "Weight", value: "~600g" },
];

/* ── App ── */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const scrollRef = useRef(0);

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

    // Intercept anchor clicks for smooth scrolling via Lenis
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

    // Track scroll progress via Lenis for silky-smooth updates
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      scrollRef.current = progress;
      setScrollProgress(progress);
    });

    // Hero reveal
    setTimeout(() => setHeroVisible(true), 200);

    return () => {
      lenis.destroy();
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-void text-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 z-50 w-full">
        <div
          className={cn(
            "mx-auto flex h-14 max-w-7xl items-center justify-between px-6 transition-all duration-500",
            scrollProgress > 0.02 ? "bg-void/70 backdrop-blur-xl" : "bg-transparent"
          )}
        >
          <a href="#" className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] font-bold text-apple-blue">VXR</span>
            </div>
            <span className="font-display text-sm font-semibold tracking-widest text-white/90">
              VANTAGE XR
            </span>
          </a>

          <div className="hidden items-center gap-8 sm:flex">
            <a href="#features" className="text-xs text-white/60 hover:text-white transition">
              Features
            </a>
            <a href="#specs" className="text-xs text-white/60 hover:text-white transition">
              Specs
            </a>
            <a href="#experience" className="text-xs text-white/60 hover:text-white transition">
              Experience
            </a>
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-apple-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-apple-blue/90 transition"
            >
              Apple.com
            </a>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="h-[1px] w-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-apple-blue to-apple-purple transition-[width] duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
        <div className="stars" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(41,151,255,0.12),transparent)]" />

        {/* 3D Scene — sticky behind content */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Scene3D scrollProgress={scrollProgress} />
          </Suspense>
        </div>

        {/* Hero text */}
        <div
          className={cn(
            "relative z-10 mx-auto max-w-5xl px-6 text-center transition-all duration-1000",
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
            <span className="text-xs text-white/60">Presented by</span>
            <span className="text-xs font-semibold text-white">Vantage XR</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text">Apple</span>
            <br />
            <span className="text-white">Vision Pro</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
            Welcome to the era of spatial computing. An infinite canvas for apps that scales beyond
            the limits of a traditional display. An immersive way to experience entertainment.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-apple-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-apple-blue/20 hover:bg-apple-blue/90 transition"
            >
              Learn more at Apple.com ↗
            </a>
            <a
              href="#features"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
            >
              Explore features
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-20 flex flex-col items-center gap-2 text-white/30">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
            <div className="h-8 w-[1px] bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Intro Statement ── */}
      <section className="relative py-32 sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(41,151,255,0.06),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <ScrollSection>
            <p className="font-display text-2xl font-light leading-relaxed text-white/70 sm:text-4xl sm:leading-relaxed">
              Apple Vision Pro is Apple's first spatial computer.
              It lets you navigate simply by{" "}
              <span className="text-white font-medium">looking at items</span>, tapping your fingers
              to <span className="text-white font-medium">select</span>, and using a{" "}
              <span className="text-white font-medium">natural hand gesture</span> to scroll.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* ── 3D Sticky Scroll Section ── */}
      <section id="features" className="relative">
        {/* Sticky 3D model */}
        <div className="sticky top-0 z-0 h-dvh w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/95 to-void" />
          <Suspense fallback={null}>
            <Scene3D scrollProgress={scrollProgress} />
          </Suspense>
        </div>

        {/* Overlaid scroll sections */}
        <div className="relative z-10 -mt-[100vh]">
          {features.map((f, i) => (
            <div key={i} className="flex min-h-dvh items-center">
              <div className="mx-auto w-full max-w-7xl px-6">
                <div
                  className={cn(
                    "max-w-lg",
                    i % 2 === 0 ? "mr-auto" : "ml-auto text-right"
                  )}
                >
                  <ScrollSection delay={100}>
                    <div
                      className={cn(
                        "inline-block rounded-full bg-gradient-to-r px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em]",
                        f.accent
                      )}
                    >
                      {f.label}
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-white sm:text-5xl whitespace-pre-line">
                      {f.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                      {f.desc}
                    </p>
                  </ScrollSection>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Specs Grid ── */}
      <section id="specs" className="relative py-32 sm:py-40">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollSection>
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
                Built different.
              </h2>
              <p className="mt-3 text-white/50">The most advanced personal electronics device ever.</p>
            </div>
          </ScrollSection>

          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs.map((s, i) => (
              <ScrollSection key={s.label} delay={i * 80}>
                <div className="glass rounded-2xl p-6 text-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {s.label}
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
                    {s.value}
                  </div>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Immersive Experience CTA ── */}
      <section id="experience" className="relative overflow-hidden py-32 sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(191,90,242,0.12),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <ScrollSection>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-apple-purple">
              The experience
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-6xl">
              The ultimate theater.
              <br />
              <span className="text-white/50">Wherever you are.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
              Transform any room into a personal movie theater with a screen that feels 100 feet
              wide. Watch Apple Immersive Video and experience stories like never before.
            </p>

            <div className="mt-10">
              <a
                href="https://www.apple.com/apple-vision-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-white/90 transition"
              >
                Visit Apple.com ↗
              </a>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollSection>
            <blockquote className="font-display text-xl font-light italic leading-relaxed text-white/60 sm:text-3xl sm:leading-relaxed">
              "It's the most extraordinary piece of electronics I have ever seen."
            </blockquote>
            <div className="mt-6 text-sm text-white/30">— Marques Brownlee</div>
          </ScrollSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-lg bg-white/5 border border-white/10">
                  <span className="font-mono text-[10px] font-bold text-apple-blue">VXR</span>
                </div>
                <span className="font-display text-sm font-semibold tracking-widest text-white/90">
                  VANTAGE XR
                </span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/30">
                A 3D product experience by Vantage XR. Apple Vision Pro is a trademark of Apple
                Inc. This site is a design showcase and is not affiliated with or endorsed by Apple
                Inc.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-right">
              <a
                href="https://www.apple.com/apple-vision-pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition"
              >
                apple.com/apple-vision-pro ↗
              </a>
              <a
                href="https://www.apple.com/legal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white transition"
              >
                Apple Legal ↗
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-[10px] text-white/20">
            Apple, Apple Vision Pro, and the Apple logo are trademarks of Apple Inc., registered in
            the U.S. and other countries. This is an independent design project by Vantage XR.
            <br />
            © {new Date().getFullYear()} Vantage XR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
