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
            <div className="font-display tracking-[0.22em] text-white">STANLEY LABS</div>
            <div className="mt-1">Websites, web apps, and 3D experiences.</div>
            <div className="mt-2 text-xs text-white/45">Nashville + remote</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#services" className="text-white/70 hover:text-white">
              Services
            </a>
            <a href="#contact" className="text-white/70 hover:text-white">
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
    const v = localStorage.getItem("sl_static");
    if (v === "1") setStaticMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sl_static", staticMode ? "1" : "0");
  }, [staticMode]);

  const arcs = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);

  return (
    <div className="min-h-dvh bg-void text-paper">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-void/60 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="inline-flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-md bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="font-mono text-xs text-cyan">SL</span>
              </div>
              <div className="leading-tight">
                <div className="font-display text-sm tracking-[0.22em] text-white">STANLEY LABS</div>
                <div className="font-mono text-[11px] text-white/55">3D + web studio</div>
              </div>
            </a>

            <nav className="hidden items-center gap-6 sm:flex">
              <a href="#services" className="text-sm text-white/70 hover:text-white">
                Services
              </a>
              <a href="#process" className="text-sm text-white/70 hover:text-white">
                Process
              </a>
              <a href="#work" className="text-sm text-white/70 hover:text-white">
                Work
              </a>
              <a
                href="#contact"
                className="rounded-md bg-iris px-4 py-2 text-sm font-semibold text-white hover:bg-iris/90"
              >
                Book a call
              </a>
            </nav>

            <a href="#contact" className="sm:hidden rounded-md bg-iris px-3 py-2 text-sm font-semibold text-white">
              Book
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
                  <Pill>Fast sites</Pill>
                  <Pill>Web apps</Pill>
                  <Pill>3D / WebGL</Pill>
                </div>

                <h1 className="mt-6 font-display text-4xl leading-[1.02] tracking-tight text-white sm:text-6xl">
                  Premium websites and software—built like a system.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                  Stanley Labs designs and builds cinematic web experiences, practical dashboards,
                  and lightweight 3D moments that don’t wreck performance.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-md bg-cyan px-6 py-3 text-sm font-semibold text-void hover:bg-cyan/90"
                  >
                    Book a call
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
                  The toggle simulates progressive enhancement controls for real WebGL content.
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glow">
                  <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_30%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(700px_circle_at_80%_70%,rgba(168,85,247,0.20),transparent_55%)]" />

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

                  <div
                    className={cn(
                      "absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-[38px]",
                      "bg-[conic-gradient(from_180deg_at_50%_50%,rgba(34,211,238,0.90),rgba(168,85,247,0.85),rgba(251,113,133,0.70),rgba(34,211,238,0.90))]",
                      !reduced && !staticMode && "animate-[pulse_7s_ease-in-out_infinite]"
                    )}
                    style={{ filter: "blur(0.2px)" }}
                  />

                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-void/40 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur">
                    PERF BUDGET: ON
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-void/40 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur">
                    3D: OPTIONAL
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="services" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Services</h2>
            <p className="mt-2 max-w-2xl text-white/70">Focused offers, built for speed and quality.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  t: "Landing pages",
                  d: "High-conversion pages with premium UI, fast load, and clean analytics.",
                },
                {
                  t: "Websites",
                  d: "Multi-page sites with a real design system and performance-first implementation.",
                },
                {
                  t: "Web apps",
                  d: "Dashboards, portals, prototypes → production builds with reliable UX.",
                },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                >
                  <div className="font-display text-lg text-white">{x.t}</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/70">{x.d}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>React</Pill>
                    <Pill>TypeScript</Pill>
                    <Pill>Tailwind</Pill>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Want a 3D moment? We add it as progressive enhancement: static first, WebGL later.
            </div>
          </Container>
        </section>

        <section id="process" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Process</h2>
            <p className="mt-2 max-w-2xl text-white/70">Simple steps. Crisp deliverables. No chaos.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {[
                { n: "01", t: "Discover", d: "Scope, audience, content, constraints." },
                { n: "02", t: "Design", d: "Hierarchy + system → premium UI." },
                { n: "03", t: "Build", d: "Fast, responsive, accessible implementation." },
                { n: "04", t: "Launch", d: "Ship, measure, iterate." },
              ].map((x) => (
                <div
                  key={x.n}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                >
                  <div className="font-mono text-xs text-white/55">{x.n}</div>
                  <div className="mt-2 font-display text-lg text-white">{x.t}</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/70">{x.d}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="work" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-white sm:text-3xl">Work</h2>
            <p className="mt-2 max-w-2xl text-white/70">
              A couple examples that align with what we build.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {["Product demo microsite", "Client dashboard", "3D interactive hero"].map((x) => (
                <div key={x} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  <div className="font-mono text-xs text-white/55">Case study</div>
                  <div className="mt-3 font-display text-xl text-white">{x}</div>
                  <div className="mt-2 text-sm text-white/70">
                    Replace with real screenshots + metrics once you choose a project to write up.
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill>Performance</Pill>
                    <Pill>Clean UI</Pill>
                    <Pill>Systems</Pill>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="contact" className="py-16 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(34,211,238,0.14),transparent_55%)] p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] sm:p-10">
              <h2 className="font-display text-2xl text-white sm:text-3xl">Book a call</h2>
              <p className="mt-2 max-w-2xl text-white/70">
                Sample form layout. Wire to Calendly/email later.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="mailto:hello@stanleylabs.co?subject=Stanley%20Labs%20Inquiry"
                  className="inline-flex items-center justify-center rounded-md bg-iris px-6 py-3 text-sm font-semibold text-white hover:bg-iris/90"
                >
                  Email hello@stanleylabs.co
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Add Calendly link
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
