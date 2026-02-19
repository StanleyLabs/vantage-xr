import { useEffect, useMemo, useState } from "react";

function cn(...x: Array<string | false | null | undefined>) {
  return x.filter(Boolean).join(" ");
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(Boolean(m.matches));
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/75">
      {children}
    </span>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/70">
            <div className="font-display tracking-[0.22em] text-white">VANTAGE XR</div>
            <div className="mt-1">WebXR marketing + training experiences.</div>
            <div className="mt-2 text-xs text-white/45">Stanley Labs</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-white/70 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-white/70 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("vantage_static");
    if (v === "1") setStaticMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("vantage_static", staticMode ? "1" : "0");
  }, [staticMode]);

  const arcs = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);

  return (
    <div className="min-h-dvh bg-void text-paper">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-void/60 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="inline-flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="font-mono text-xs text-cyan">VX</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm tracking-[0.22em] text-white">VANTAGE XR</div>
                <div className="font-mono text-[11px] text-white/55">Futuristic marketing sample</div>
              </div>
            </a>

            <nav className="hidden items-center gap-6 sm:flex">
              <a href="#use" className="text-sm text-white/70 hover:text-white">
                Use cases
              </a>
              <a href="#platform" className="text-sm text-white/70 hover:text-white">
                Platform
              </a>
              <a href="#proof" className="text-sm text-white/70 hover:text-white">
                Proof
              </a>
              <a href="#demo" className="rounded-md bg-iris px-4 py-2 text-sm font-semibold text-white hover:bg-iris/90">
                Request demo
              </a>
            </nav>

            <a href="#demo" className="sm:hidden rounded-md bg-iris px-3 py-2 text-sm font-semibold text-white">
              Demo
            </a>
          </div>
        </Container>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="stars absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.22),transparent_55%),radial-gradient(900px_circle_at_70%_80%,rgba(251,113,133,0.10),transparent_55%)]" />

          <Container>
            <div className="relative grid gap-10 py-16 sm:grid-cols-2 sm:items-center sm:py-24">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Pill>WebXR-ready</Pill>
                  <Pill>Instant fallback</Pill>
                  <Pill>Motion-safe</Pill>
                </div>

                <h1 className="mt-6 font-display text-4xl leading-[1.02] tracking-tight text-white sm:text-6xl">
                  Spatial experiences—without slow websites.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                  This sample site prioritizes speed and readability first. The “3D” moment is optional,
                  subtle, and never blocks the page.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center rounded-md bg-cyan px-6 py-3 text-sm font-semibold text-void hover:bg-cyan/90"
                  >
                    Request demo
                  </a>
                  <button
                    type="button"
                    onClick={() => setStaticMode((s) => !s)}
                    className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    {staticMode ? "Enable motion" : "Static visuals"}
                  </button>
                </div>

                <div className="mt-8 text-xs text-white/55">
                  Tip: this toggle simulates progressive enhancement controls for real WebGL.
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glow">
                  <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_30%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(700px_circle_at_80%_70%,rgba(168,85,247,0.20),transparent_55%)]" />

                  {/* orbital UI arcs */}
                  {arcs.map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                        "border border-white/10",
                        !reduced && !staticMode && "animate-[spin_24s_linear_infinite]"
                      )}
                      style={{
                        width: 220 + i * 70,
                        height: 220 + i * 70,
                        opacity: 0.22 - i * 0.02,
                        animationDuration: `${22 + i * 6}s`,
                      }}
                    />
                  ))}

                  {/* core object */}
                  <div
                    className={cn(
                      "absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[38px]",
                      "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.90),rgba(168,85,247,0.85),rgba(251,113,133,0.70),rgba(34,211,238,0.90))]",
                      !reduced && !staticMode && "animate-[pulse_7s_ease-in-out_infinite]"
                    )}
                    style={{ filter: "blur(0.2px)" }}
                  />

                  {/* HUD labels */}
                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-void/40 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur">
                    LATENCY: 18ms
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-void/40 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur">
                    RENDER: FALLBACK
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="use" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Use cases</h2>
            <p className="mt-2 max-w-2xl text-white/70">Four obvious wins for spatial experiences.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { t: "Training & safety", d: "Scenario-based learning with completion metrics." },
                { t: "Product visualization", d: "Interactive inspection—lightweight and fast." },
                { t: "Remote assistance", d: "Guided flows with overlays and checkpoints." },
                { t: "Events & activations", d: "A brand moment that still behaves like a site." },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                >
                  <div className="font-display text-lg text-white">{x.t}</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/70">{x.d}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="platform" className="py-16 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:p-10">
              <h2 className="font-display text-2xl text-white sm:text-3xl">Platform</h2>
              <p className="mt-2 max-w-2xl text-white/70">
                A tabbed feature block (no scroll-jacking). Swap this for real screenshots later.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Author", "Deploy", "Measure", "Integrate"].map((x) => (
                  <Pill key={x}>{x}</Pill>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section id="proof" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Proof</h2>
            <p className="mt-2 max-w-2xl text-white/70">Sample case study tiles with results.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["−34% errors", "+22% retention", "2-week rollout"].map((x) => (
                <div key={x} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  <div className="font-mono text-xs text-white/60">Result</div>
                  <div className="mt-3 font-display text-2xl text-white">{x}</div>
                  <div className="mt-2 text-sm text-white/70">Replace with a real story + numbers.</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="demo" className="py-16 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,211,238,0.14),transparent_55%)] p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:p-10">
              <h2 className="font-display text-2xl text-white sm:text-3xl">Request a demo</h2>
              <p className="mt-2 max-w-2xl text-white/70">
                Sample form layout. Wire to a real endpoint later.
              </p>

              <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Name</span>
                  <input
                    className="h-11 rounded-md border border-white/10 bg-void/50 px-3 text-white outline-none ring-iris/40 focus:ring-2"
                    placeholder="Jane"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-white/70">Email</span>
                  <input
                    className="h-11 rounded-md border border-white/10 bg-void/50 px-3 text-white outline-none ring-iris/40 focus:ring-2"
                    placeholder="jane@company.com"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm text-white/70">Goal</span>
                  <textarea
                    className="min-h-28 rounded-md border border-white/10 bg-void/50 p-3 text-white outline-none ring-iris/40 focus:ring-2"
                    placeholder="We need a training sim for onboarding..."
                  />
                </label>
                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-iris px-6 py-3 text-sm font-semibold text-white hover:bg-iris/90"
                    type="submit"
                  >
                    Send request
                  </button>
                  <div className="text-xs text-white/55">Response within 1 business day.</div>
                </div>
              </form>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
