import { cn } from "../utils/cn";

interface Props {
  visible: boolean;
}

export default function Hero({ visible }: Props) {
  return (
    <section className="relative -mt-[100vh] flex min-h-dvh items-center justify-center overflow-hidden">
      <div className="stars" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(41,151,255,0.12),transparent)]" />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-5xl px-6 text-center transition-all duration-1000",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
          <span className="text-xs text-white/60">Presented by</span>
          <span className="text-xs font-semibold text-white">Vantage XR</span>
        </div>

        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
          <span className="gradient-text">Apple</span>
          <br />
          <span className="text-white">Vision Pro</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          Welcome to the era of spatial computing. An infinite canvas that scales beyond
          the limits of a traditional display — and pairs with the devices you already love.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://www.apple.com/apple-vision-pro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-apple-blue px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-apple-blue/20 hover:bg-apple-blue/90 transition"
          >
            Learn more at Apple.com ↗
          </a>
          <a
            href="#features"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
          >
            Explore features
          </a>
        </div>

        <div className="mt-20 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
