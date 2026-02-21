import ScrollReveal from "./ScrollReveal";

export default function IntroStatement() {
  return (
    <section className="relative py-32 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(41,151,255,0.06),transparent)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <p className="font-display text-2xl font-light leading-relaxed text-white/70 sm:text-4xl sm:leading-relaxed rounded-2xl bg-void/40 px-6 py-6 sm:px-8 sm:py-8">
            Apple Vision Pro is Apple's first spatial computer.
            It lets you navigate simply by{" "}
            <span className="text-white font-medium">looking at items</span>, tapping your fingers
            to <span className="text-white font-medium">select</span>, and using a{" "}
            <span className="text-white font-medium">natural hand gesture</span> to scroll.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
