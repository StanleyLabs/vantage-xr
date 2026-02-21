import { specs } from "../data/features";
import ScrollReveal from "./ScrollReveal";

export default function Specs() {
  return (
    <section id="specs" className="relative pb-32 sm:pb-40">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Built different.
            </h2>
            <p className="mt-3 text-white/50">The most advanced personal electronics device ever.</p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 [&>*]:min-w-0">
          {specs.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80} className="h-full">
              <div className="glass flex h-full min-h-0 flex-col rounded-2xl p-6 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {s.label}
                </div>
                <div className="mt-2 flex flex-1 flex-col justify-center font-display text-2xl font-bold text-white sm:text-3xl">
                  {s.label === "Display" ? (
                    <>Micro-<br className="sm:hidden" />OLED</>
                  ) : (
                    s.value
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
