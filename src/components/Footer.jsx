import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import webschema from "/images/webschema.png";

/**
 * Dark animated "out-of-the-box" luxury footer (React JS + Tailwind)
 * - Hidden on /profile
 * - Animated gradient + floating orbs + shimmer hairline
 * - No links
 * - Mobile stacked / Desktop 12-col
 * - Respects prefers-reduced-motion
 */
export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  const orb1 = useRef(null);
  const orb2 = useRef(null);
  const orb3 = useRef(null);

  // Subtle parallax drift for orbs (no deps)
  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    const start = performance.now();

    const tick = (t) => {
      const time = (t - start) / 1000;

      const set = (el, x, y, s) => {
        if (!el) return;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;
      };

      set(orb1.current, Math.sin(time * 0.5) * 18, Math.cos(time * 0.35) * 14, 1.0);
      set(orb2.current, Math.cos(time * 0.42) * 22, Math.sin(time * 0.38) * 16, 1.05);
      set(orb3.current, Math.sin(time * 0.33) * 16, Math.sin(time * 0.26) * 12, 1.02);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  return (
    <footer className={clsx(pathname === "/profile" && "hidden")}>
      {/* keyframes (self-contained, out-of-the-box) */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-120%); opacity: .0; }
          15% { opacity: .55; }
          50% { opacity: .30; }
          100% { transform: translateX(120%); opacity: .0; }
        }
        @keyframes floatUpDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div className="relative overflow-hidden border-t border-white/10 bg-neutral-950 text-white">
        {/* animated gradient layer */}
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute inset-0 opacity-90",
            !reduceMotion && "will-change-transform",
          )}
          style={{
            backgroundImage:
              "radial-gradient(900px 520px at 20% 25%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(900px 520px at 75% 40%, rgba(249,115,22,0.16), transparent 58%), radial-gradient(900px 520px at 55% 85%, rgba(59,130,246,0.10), transparent 55%), linear-gradient(120deg, rgba(0,0,0,0.9), rgba(20,20,20,0.95), rgba(0,0,0,0.9))",
            backgroundSize: "220% 220%",
            backgroundPosition: "0% 50%",
            animation: reduceMotion ? "none" : "gradientShift 12s ease-in-out infinite",
          }}
        />

        {/* grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
          }}
        />

        {/* floating orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            ref={orb1}
            className={clsx(
              "absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl",
              reduceMotion ? "" : "animate-[floatUpDown_6s_ease-in-out_infinite]",
            )}
            style={{ background: "rgba(249,115,22,0.18)" }}
          />
          <div
            ref={orb2}
            className={clsx(
              "absolute -bottom-28 left-1/3 h-96 w-96 rounded-full blur-3xl",
              reduceMotion ? "" : "animate-[floatUpDown_7.5s_ease-in-out_infinite]",
            )}
            style={{ background: "rgba(255,255,255,0.10)" }}
          />
          <div
            ref={orb3}
            className={clsx(
              "absolute -top-28 right-[-120px] h-80 w-80 rounded-full blur-3xl",
              reduceMotion ? "" : "animate-[floatUpDown_8.5s_ease-in-out_infinite]",
            )}
            style={{ background: "rgba(59,130,246,0.14)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 py-12 sm:py-14">
          {/* GRID */}
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            {/* BIG WORDMARK */}
            <div className="md:col-span-7 text-center md:text-left">
              <div className="leading-[0.85]">
                <div className="font-serif tracking-[-0.04em] text-[clamp(44px,12vw,82px)] md:text-[6.2rem] lg:text-[7.2rem]">
                  WEBSCHEMA
                </div>
              </div>

              <div className="mt-4 h-px w-20 bg-white/10 mx-auto md:mx-0 md:w-28" />

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 mx-auto md:mx-0">
                Modern commerce, crafted with taste. Curated essentials, seamless checkout, and a
                premium experience end-to-end.
              </p>

              {/* subtle “signature” strip */}
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 ring-1 ring-white/10 backdrop-blur mx-auto md:mx-0">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                <span className="text-xs tracking-[0.22em] text-white/70 uppercase">
                  Built for Kuwait • Delivered fast
                </span>
              </div>
            </div>

            {/* RIGHT META */}
            <div className="md:col-span-5 md:justify-self-end">
              <div className="grid gap-3 text-center md:text-right">
                <div className="text-xs uppercase tracking-[0.22em] text-white/50">
                  Kuwait • Online Store
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-end gap-3 sm:gap-4">
                  <div className="text-sm text-white/65">© {currentYear} WebSchema</div>

                  {/* creator mark (no link) */}
                  <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 ring-1 ring-white/10 backdrop-blur mx-auto md:ml-auto md:mr-0">
                    <img src={webschema} alt="webschema" className="h-5 w-5" draggable={false} />
                    <span className="text-xs text-white/70">Crafted with care</span>
                  </div>
                </div>

                {/* micro-copy */}
                <div className="text-[11px] text-white/45">
                  Secure payments • Fast support • Clean experience
                </div>
              </div>
            </div>
          </div>

          {/* animated shimmer hairline */}
          <div className="relative mt-10 h-px w-full bg-white/10 overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), rgba(249,115,22,0.25), rgba(255,255,255,0.25), transparent)",
                animation: reduceMotion ? "none" : "shimmer 3.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
