import { cn } from "../utils/cn";
import { features } from "../data/features";
import ScrollReveal from "./ScrollReveal";

export default function Features() {
  return (
    <section id="features" className="relative">
      <div className="relative z-10">
        {features.map((f, i) => (
          <div key={i} className="flex min-h-dvh items-center">
            <div className="mx-auto w-full max-w-7xl px-6">
              <div
                className={cn(
                  "max-w-lg",
                  i % 2 === 0 ? "mr-auto" : "ml-auto text-right"
                )}
              >
                <ScrollReveal delay={100}>
                  <div className="rounded-2xl bg-void/60 backdrop-blur-md p-6 sm:p-8">
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
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
