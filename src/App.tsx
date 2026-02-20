import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Lenis from "lenis";
import ScrollSection from "./components/ScrollSection";

const Scene3D = lazy(() => import("./components/Scene3D"));

/* ── Helpers ── */
function cn(...x: Array<string | false | null | undefined>) {
  return x.filter(Boolean).join(" ");
}

/* ── Ecosystem modes ── */
const modes = [
  {
    label: "STANDALONE",
    title: "Vision Pro.\nUnleashed.",
    desc: "Use Vision Pro on its own for an immersive spatial experience. Browse the web, watch films on a 100-foot screen, run apps in your living room — no other device needed. The M2 chip handles everything.",
    accent: "from-apple-blue/20 to-transparent",
    color: "text-apple-blue",
  },
  {
    label: "ON THE GO",
    title: "MacBook Pro\nmeets infinite display.",
    desc: "Pair Vision Pro with your MacBook Pro and your laptop screen becomes a massive, private workspace that travels with you. Code on the plane. Design in a hotel room. Your Mac, projected into space.",
    accent: "from-apple-purple/20 to-transparent",
    color: "text-apple-purple",
  },
  {
    label: "MAX PERFORMANCE",
    title: "Mac Mini.\nDesktop power, spatial scale.",
    desc: "Connect to Mac Mini with M4 Pro and unlock extreme performance in a spatial environment. Render 3D scenes, compile massive projects, run pro apps — all on a display that wraps around you.",
    accent: "from-cyan/20 to-transparent",
    color: "text-cyan",
  },
];

const products = [
  { name: "Vision Pro", chip: "M2 + R1", role: "Spatial Display", link: "https://www.apple.com/apple-vision-pro/" },
  { name: "MacBook Pro", chip: "M4 Pro/Max", role: "Portable Power", link: "https://www.apple.com/macbook-pro/" },
  { name: "Mac Mini", chip: "M4 / M4 Pro", role: "Desktop Engine", link: "https://www.apple.com/mac-mini/" },
];

const specs = [
  { label: "Vision Pro Display", value: "23M pixels" },
  { label: "Vision Pro Chips", value: "M2 + R1" },
  { label: "MacBook Pro", value: "Up to M4 Max" },
  { label: "Mac Mini", value: "Up to M4 Pro" },
  { label: "Connection", value: "Wireless" },
  { label: "Latency", value: "Ultra‑low" },
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
            "mx-auto flex h-14 max-w-7xl flex-col items-center justify-center gap-0.5 px-6 transition-all duration-500 sm:h-16 sm:flex-row sm:gap-8",
            "bg-transparent"
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

          <div className="hidden items-center gap-6 sm:flex">
            <span className="text-white/15">|</span>
            <a href="#ecosystem" className="text-xs text-white/60 hover:text-white transition">
              Ecosystem
            </a>
            <a href="#specs" className="text-xs text-white/60 hover:text-white transition">
              Specs
            </a>
            <a href="#setup" className="text-xs text-white/60 hover:text-white transition">
              Your Setup
            </a>
            <span className="text-white/15">|</span>
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-apple-blue px-4 py-1.5 text-xs font-semibold text-white hover:bg-apple-blue/90 transition"
            >
              Apple.com ↗
            </a>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div className="h-[1px] w-full bg-white/5">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-apple-blue to-apple-purple"
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
            <span className="text-xs text-white/60">Three devices.</span>
            <span className="text-xs font-semibold text-white">One experience.</span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="gradient-text">The Apple</span>
            <br />
            <span className="text-white">Spatial Ecosystem</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/50 sm:text-lg">
            Vision Pro. MacBook Pro. Mac Mini. Each one powerful alone — but together they create a
            seamless spatial computing experience that adapts to how you work, create, and play.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#ecosystem"
              className="inline-flex items-center rounded-full bg-apple-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-apple-blue/20 hover:bg-apple-blue/90 transition"
            >
              Explore the ecosystem
            </a>
            <a
              href="#setup"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
            >
              Build your setup
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
              Use Vision Pro <span className="text-white font-medium">standalone</span> for immersive
              entertainment. Pair it with a{" "}
              <span className="text-white font-medium">MacBook Pro</span> for a portable infinite
              workspace. Connect to a{" "}
              <span className="text-white font-medium">Mac Mini</span> for raw desktop power in
              spatial scale.
            </p>
          </ScrollSection>
        </div>
      </section>

      {/* ── Ecosystem Modes — 3D Sticky Scroll ── */}
      <section id="ecosystem" className="relative">
        {/* Sticky 3D model */}
        <div className="sticky top-0 z-0 h-dvh w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/95 to-void" />
          <Suspense fallback={null}>
            <Scene3D scrollRef={scrollRef} />
          </Suspense>
        </div>

        {/* Overlaid scroll sections — three modes */}
        <div className="relative z-10 -mt-[100vh]">
          {modes.map((m, i) => (
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
                        m.accent
                      )}
                    >
                      {m.label}
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-white sm:text-5xl whitespace-pre-line">
                      {m.title}
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-white/50 sm:text-lg">
                      {m.desc}
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
                The specs that matter.
              </h2>
              <p className="mt-3 text-white/50">Three devices, engineered to work as one.</p>
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

      {/* ── Your Setup — Product Cards ── */}
      <section id="setup" className="relative overflow-hidden py-32 sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(191,90,242,0.12),transparent)]" />
        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollSection>
            <div className="text-center">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-apple-purple">
                Build your setup
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-6xl">
                Choose your mode.
                <br />
                <span className="text-white/50">Scale when you need to.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
                Start with Vision Pro standalone. Add a MacBook Pro for portable productivity.
                Go all-in with Mac Mini for maximum power. The ecosystem grows with you.
              </p>
            </div>
          </ScrollSection>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {products.map((p, i) => (
              <ScrollSection key={p.name} delay={i * 120}>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-2xl p-8 block group hover:border-white/20 transition-all duration-300"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                    {p.role}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white group-hover:text-apple-blue transition">
                    {p.name}
                  </h3>
                  <div className="mt-2 text-sm text-white/50">{p.chip}</div>
                  <div className="mt-6 text-xs text-white/30 group-hover:text-white/60 transition">
                    Learn more ↗
                  </div>
                </a>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Statement ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollSection>
            <p className="font-display text-xl font-light italic leading-relaxed text-white/60 sm:text-3xl sm:leading-relaxed">
              One headset. One laptop. One desktop.
              <br />
              <span className="text-white/80">Infinite possibilities.</span>
            </p>
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
                An Apple ecosystem experience by Vantage XR. All product names are trademarks of
                Apple Inc. This site is a design showcase and is not affiliated with or endorsed by
                Apple Inc.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-right">
              <a href="https://www.apple.com/apple-vision-pro/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white transition">
                Vision Pro ↗
              </a>
              <a href="https://www.apple.com/macbook-pro/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white transition">
                MacBook Pro ↗
              </a>
              <a href="https://www.apple.com/mac-mini/" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white transition">
                Mac Mini ↗
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-[10px] text-white/20">
            Apple, Apple Vision Pro, MacBook Pro, Mac Mini, and the Apple logo are trademarks of Apple Inc.,
            registered in the U.S. and other countries. This is an independent design project by Vantage XR.
            <br />
            © {new Date().getFullYear()} Vantage XR. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
