export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-white/5 border border-white/10">
                <span className="font-mono text-[10px] font-bold text-apple-blue">VXR</span>
              </div>
              <span className="font-display text-sm font-semibold tracking-widest text-white/90">
                VANTAGE XR
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/30">
              A 3D product experience by Vantage XR. Apple Vision Pro is a trademark of Apple
              Inc. This site is a design showcase and is not affiliated with or endorsed by Apple
              Inc.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-right">
            <a
              href="https://www.apple.com/apple-vision-pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white transition"
            >
              apple.com/apple-vision-pro ↗
            </a>
            <a
              href="https://www.apple.com/legal/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white transition"
            >
              Apple Legal ↗
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-[10px] text-white/20">
          Apple, Apple Vision Pro, and the Apple logo are trademarks of Apple Inc., registered in
          the U.S. and other countries. This is an independent design project by Vantage XR.
          <br />
          © {new Date().getFullYear()} Vantage XR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
