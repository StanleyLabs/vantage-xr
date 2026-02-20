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

    // Track scroll progress via Lenis — direct DOM updates, no React re-renders
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      scrollRef.current = progress;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${progress * 100}%`;
      }
      if (navBgRef.current) {
        if (progress > 0.02) {
          navBgRef.current.classList.add("bg-void/70", "backdrop-blur-xl");
          navBgRef.current.classList.remove("bg-transparent");
        } else {
          navBgRef.current.classList.remove("bg-void/70", "backdrop-blur-xl");
          navBgRef.current.classList.add("bg-transparent");
        }
      }
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
          ref={navBgRef}
          className={cn(
            "mx-auto flex h-12 max-w-7xl items-center justify-between px-6 transition-all duration-500",
            "bg-transparent"
          )}
        >
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative size-7">
              <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-apple-blue to-apple-purple opacity-80 group-hover:opacity-100 transition" />
              <div className="absolute inset-[2px] rounded-[1px] bg-void grid place-items-center">
                <span className="font-mono text-[9px] font-bold text-white/90">V</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[11px] font-semibold tracking-[0.25em] text-white/80">VANTAGE</span>
              <span className="font-mono text-[11px] font-semibold tracking-[0.25em] text-apple-blue">XR</span>
            </div>
          </a>

          <div className="hidden items-center gap-1 sm:flex">
            <a href="#features" className="relative px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white transition group">
              <span className="relative z-10">Features</span>
              <div className="absolute inset-0 rounded-sm bg-white/0 group-hover:bg-white/5 transition" />
            </a>
            <a href="#specs" className="relative px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white transition group">
              <span className="relative z-10">Specs</span>
              <div className="absolute inset-0 rounded-sm bg-white/0 group-hover:bg-white/5 transition" />
            </a>
            <a href="#experience" className="relative px-4 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white transition group">
              <span className="relative z-10">Experience</span>
              <div className="absolute inset-0 rounded-sm bg-white/0 group-hover:bg-white/5 transition" />
            </a>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-sm border border-apple-blue/40 px-5 py-1.5 text-[11px] font-mono uppercase tracking-[0.15em] text-apple-blue hover:text-white transition group"
            >
              <div className="absolute inset-0 bg-apple-blue/0 group-hover:bg-apple-blue transition" />
              <span className="relative z-10">Apple.com ↗</span>
            </a>
          </div>
        </div>

        {/* Scroll progress — edge-to-edge line */}
        <div className="h-px w-full bg-white/[0.03]">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-apple-blue via-apple-purple to-cyan"
            style={{ width: "0%" }}
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
            <Scene3D scrollRef={scrollRef} />
          </Suspense>
        </div>

        {/* Hero text */}
        <div
          className={cn(
            "relative z-10 mx-auto max-w-5xl px-6 text-center transition-all duration-1000",
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="mb-6 inline-flex items-center gap-3 border-l-2 border-apple-blue/60 pl-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">A showcase by</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-apple-blue">Vantage XR</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.0] tracking-tight sm:text-7xl lg:text-[6.5rem]">
            <span className="gradient-text">Apple</span>
            <br />
            <span className="text-white">Vision <span className="text-apple-blue">Pro</span></span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl font-mono text-sm leading-relaxed text-white/40 sm:text-base">
            Welcome to the era of spatial computing — an infinite canvas beyond
            the limits of traditional displays.
          </p>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center overflow-hidden rounded-sm bg-apple-blue px-8 py-3 text-[12px] font-mono uppercase tracking-[0.2em] text-white transition hover:shadow-lg hover:shadow-apple-blue/25"
            >
              <span className="relative z-10">Learn more ↗</span>
              <div className="absolute inset-0 bg-gradient-to-r from-apple-blue to-apple-purple opacity-0 group-hover:opacity-100 transition" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center rounded-sm border border-white/10 px-8 py-3 text-[12px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-white hover:border-white/25 transition"
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
            <Scene3D scrollRef={scrollRef} />
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
                        "inline-block rounded-sm bg-gradient-to-r px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.3em]",
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
                <div className="glass rounded-sm p-6 text-center">
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
                className="group relative inline-flex items-center overflow-hidden rounded-sm bg-white px-8 py-3 text-[12px] font-mono uppercase tracking-[0.2em] text-void transition hover:shadow-lg hover:shadow-white/10"
              >
                <span className="relative z-10">Visit Apple.com ↗</span>
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
              <div className="flex items-center gap-3">
                <div className="relative size-7">
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-apple-blue to-apple-purple opacity-80" />
                  <div className="absolute inset-[2px] rounded-[1px] bg-void grid place-items-center">
                    <span className="font-mono text-[9px] font-bold text-white/90">V</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.25em] text-white/80">VANTAGE</span>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.25em] text-apple-blue">XR</span>
                </div>
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
