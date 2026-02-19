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

function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="group inline-flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-md bg-graphite shadow-insetHairline">
              <span className="font-mono text-xs text-fog">VR</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm tracking-[0.18em] text-paper">
                VANTAGE XR
              </div>
              <div className="font-mono text-[11px] text-fog/80">Spatial product studio</div>
            </div>
          </a>

          <nav className="hidden items-center gap-6 sm:flex">
            <a href="#platform" className="text-sm text-fog/90 hover:text-paper">
              Platform
            </a>
            <a href="#use-cases" className="text-sm text-fog/90 hover:text-paper">
              Use cases
            </a>
            <a href="#pricing" className="text-sm text-fog/90 hover:text-paper">
              Pricing
            </a>
            <a
              href="#demo"
              className="rounded-md bg-electric px-4 py-2 text-sm font-medium text-white hover:bg-electric/90"
            >
              Request demo
            </a>
          </nav>

          <a
            href="#demo"
            className="sm:hidden rounded-md bg-electric px-3 py-2 text-sm font-medium text-white"
          >
            Demo
          </a>
        </div>
      </Container>
    </header>
  );
}

function FeatureCard({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-insetHairline">
      <div className="font-mono text-xs text-fog/70">{eyebrow}</div>
      <div className="mt-2 font-display text-lg text-paper">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-fog/85">{desc}</div>
    </div>
  );
}

function OrbFallback({ reduced }: { reduced: boolean }) {
  const rings = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(800px_circle_at_20%_10%,rgba(45,107,255,0.22),transparent_55%),radial-gradient(700px_circle_at_85%_30%,rgba(255,59,59,0.12),transparent_55%)] shadow-insetHairline">
      <div className={cn("grain absolute inset-0")}></div>

      <div
        className={cn(
          "absolute left-1/2 top-1/2 size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full",
          "bg-[radial-gradient(circle_at_30%_30%,rgba(238,242,255,0.95),rgba(45,107,255,0.65),rgba(11,13,18,0.0))]",
          !reduced && "animate-[pulse_6s_ease-in-out_infinite]"
        )}
        style={{ filter: "blur(0.2px)" }}
      />

      {rings.map((i) => (
        <div
          key={i}
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            "border border-white/10",
            !reduced &&
              "animate-[spin_18s_linear_infinite] [animation-direction:alternate]"
          )}
          style={{
            width: 260 + i * 60,
            height: 260 + i * 60,
            opacity: 0.22 - i * 0.02,
            animationDuration: `${16 + i * 5}s`,
          }}
        />
      ))}

      <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-ink/50 px-3 py-1 font-mono text-xs text-fog/80 backdrop-blur">
        3D loads instantly (fallback mode)
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-fog/80">
            <div className="font-display tracking-[0.18em] text-paper">VANTAGE XR</div>
            <div className="mt-1">VR/AR experiences for product & training.</div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#platform" className="text-fog/90 hover:text-paper">
              Platform
            </a>
            <a href="#demo" className="text-fog/90 hover:text-paper">
              Demo
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default function App() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="min-h-dvh bg-ink text-paper">
      <TopNav />

      <main>
        <section className="relative overflow-hidden">
          <div className="grain absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_15%_10%,rgba(45,107,255,0.22),transparent_55%),radial-gradient(900px_circle_at_90%_35%,rgba(255,59,59,0.14),transparent_55%)]" />

          <Container>
            <div className="relative grid gap-10 py-16 sm:grid-cols-2 sm:items-center sm:py-24">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-fog/80">
                  <span className="text-green-400">●</span> WebXR-ready, deploy anywhere
                </div>

                <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] tracking-tight text-paper sm:text-6xl">
                  VR/AR marketing that ships fast—and feels premium.
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-fog/90 sm:text-lg">
                  Vantage XR is a sample VR/AR tech website: cinematic UI, progressive enhancement,
                  and an instant-loading 3D hero with a graceful fallback.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#demo"
                    className="inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-semibold text-white hover:bg-electric/90"
                  >
                    Request a demo
                  </a>
                  <a
                    href="#platform"
                    className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10"
                  >
                    Explore platform
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {["Instant load", "WebXR-ready", "Design system"].map((x) => (
                    <div
                      key={x}
                      className="rounded-xl border border-white/10 bg-white/5 p-3 text-center shadow-insetHairline"
                    >
                      <div className="font-mono text-xs text-fog/70">{x}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <OrbFallback reduced={reduced} />
              </div>
            </div>
          </Container>
        </section>

        <section id="platform" className="py-16 sm:py-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl text-paper sm:text-3xl">Platform</h2>
                <p className="mt-2 max-w-2xl text-fog/85">
                  Built for speed. Designed for delight. Ready for real product content.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                eyebrow="01"
                title="Progressive enhancement"
                desc="3D is optional: instant fallback, lazy-loaded scene, reduced-motion friendly." 
              />
              <FeatureCard
                eyebrow="02"
                title="Crisp, cinematic UI"
                desc="Tight typography, subtle grain, and microinteractions without heavy libraries." 
              />
              <FeatureCard
                eyebrow="03"
                title="Practical UX"
                desc="Clear sections, strong CTAs, and a conversion-ready demo form layout." 
              />
            </div>
          </Container>
        </section>

        <section id="use-cases" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-paper sm:text-3xl">Use cases</h2>
            <p className="mt-2 max-w-2xl text-fog/85">
              Product visualization, onboarding & training, interactive sales, and trade shows.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Interactive product demos",
                  desc: "Spin, inspect, and explainer overlays—without hurting page speed.",
                },
                {
                  title: "Training simulations",
                  desc: "Task flows + checkpoints. Future-ready for auth and analytics.",
                },
                {
                  title: "Immersive landing pages",
                  desc: "A brand moment that still behaves like a normal, accessible website.",
                },
                {
                  title: "WebXR prototypes",
                  desc: "Clickable proof-of-concepts you can send to stakeholders instantly.",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-insetHairline"
                >
                  <div className="font-display text-lg text-paper">{x.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-fog/85">{x.desc}</div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="pricing" className="py-16 sm:py-20">
          <Container>
            <h2 className="font-display text-2xl text-paper sm:text-3xl">Pricing</h2>
            <p className="mt-2 max-w-2xl text-fog/85">
              Sample pricing blocks. Swap in your real packages.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Launch",
                  price: "$4,500+",
                  bullets: ["Single page", "3D hero (optional)", "Analytics + SEO", "1 week"],
                },
                {
                  title: "Campaign",
                  price: "$9,500+",
                  bullets: ["Multi-page", "Interactive sections", "Case study layout", "2–3 weeks"],
                },
                {
                  title: "XR Build",
                  price: "$18,000+",
                  bullets: ["WebXR prototype", "CMS content", "Performance budget", "4–6 weeks"],
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-insetHairline"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-display text-lg text-paper">{p.title}</div>
                      <div className="mt-1 font-mono text-xs text-fog/70">Starting at</div>
                    </div>
                    <div className="font-display text-2xl text-paper">{p.price}</div>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm text-fog/85">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[2px] text-electric">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#demo"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-electric px-4 py-2 text-sm font-semibold text-white hover:bg-electric/90"
                  >
                    Talk to sales
                  </a>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section id="demo" className="py-16 sm:py-20">
          <Container>
            <div className="rounded-2xl border border-white/10 bg-[radial-gradient(800px_circle_at_20%_10%,rgba(45,107,255,0.18),transparent_55%)] p-8 shadow-insetHairline sm:p-10">
              <h2 className="font-display text-2xl text-paper sm:text-3xl">Request a demo</h2>
              <p className="mt-2 max-w-2xl text-fog/85">
                This is a sample layout—wire it to your CRM/email provider later.
              </p>

              <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <label className="grid gap-2">
                  <span className="text-sm text-fog/80">Name</span>
                  <input
                    className="h-11 rounded-md border border-white/10 bg-ink/50 px-3 text-paper outline-none ring-electric/40 focus:ring-2"
                    placeholder="Jane"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm text-fog/80">Email</span>
                  <input
                    className="h-11 rounded-md border border-white/10 bg-ink/50 px-3 text-paper outline-none ring-electric/40 focus:ring-2"
                    placeholder="jane@company.com"
                  />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm text-fog/80">What are you building?</span>
                  <textarea
                    className="min-h-28 rounded-md border border-white/10 bg-ink/50 p-3 text-paper outline-none ring-electric/40 focus:ring-2"
                    placeholder="A product demo for a headset launch..."
                  />
                </label>
                <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-electric px-6 py-3 text-sm font-semibold text-white hover:bg-electric/90"
                    type="submit"
                  >
                    Send request
                  </button>
                  <div className="text-xs text-fog/70">We’ll respond within 1 business day.</div>
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
