import { forwardRef } from "react";
import { cn } from "../utils/cn";

interface Props {
  navBgRef: React.RefObject<HTMLDivElement | null>;
  progressBarRef: React.RefObject<HTMLDivElement | null>;
}

const Navbar = forwardRef<HTMLElement, Props>(({ navBgRef, progressBarRef }) => {
  return (
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
          <a href="#features" className="text-xs text-white/60 hover:text-white transition">
            Features
          </a>
          <a href="#specs" className="text-xs text-white/60 hover:text-white transition">
            Specs
          </a>
          <a href="#experience" className="text-xs text-white/60 hover:text-white transition">
            Experience
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

      <div className="h-[1px] w-full bg-white/5">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-apple-blue to-apple-purple"
          style={{ width: "0%" }}
        />
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;
