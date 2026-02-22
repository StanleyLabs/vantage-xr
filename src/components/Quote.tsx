import ScrollReveal from "./ScrollReveal";

export default function Quote() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <blockquote className="font-display text-xl font-light italic leading-relaxed text-white/60 sm:text-3xl sm:leading-relaxed">
            "It's the most extraordinary piece of electronics I have ever seen."
          </blockquote>
          <div className="mt-6 text-sm text-white/30">- Marques Brownlee</div>
        </ScrollReveal>
      </div>
    </section>
  );
}
