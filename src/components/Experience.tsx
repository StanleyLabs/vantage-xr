import ScrollReveal from "./ScrollReveal";

export default function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden py-32 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(191,90,242,0.12),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
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
        </ScrollReveal>
      </div>
    </section>
  );
}
