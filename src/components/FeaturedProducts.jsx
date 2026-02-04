// FeaturedProducts.jsx
import { useMemo } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { ArrowRight, Sparkles } from "lucide-react";
import clsx from "clsx";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function FeaturedProducts({ products, isLoading }) {
  const items = useMemo(() => (Array.isArray(products) ? products : []), [products]);
  console.log(products);
  if (isLoading) return <Loader />;

  const shown = items.slice(0, 8);

  return (
    <section
      dir="ltr"
      id="featured-products"
      className="relative w-full overflow-hidden bg-background text-foreground">
      {/* Subtle paper grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Soft editorial vignette / highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 30%, rgba(0,0,0,0.05), transparent 60%), radial-gradient(700px 520px at 40% 55%, rgba(249,115,22,0.10), transparent 55%), linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.95))",
          mixBlendMode: "normal",
        }}
      />

      <div className="relative mx-auto max-w-6xl lg:max-w-full lg:px-5 px-0 py-14 lg:py-20">
        {/* Header */}
        <Reveal>
          <div className="mb-10 flex flex-col px-2 gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/70 ring-1 ring-foreground/10">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Featured • Top picks
              </div>

              <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight sm:text-5xl">
                Shop the highlights
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                A refined selection of our best items—updated regularly for clean, effortless fits.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        {shown.length === 0 ? (
          <div className="relative overflow-hidden rounded-[28px] bg-white/70 p-10 text-center ring-1 ring-foreground/10 backdrop-blur">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
              style={{
                backgroundImage:
                  "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
              }}
            />

            <div className="relative">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-foreground/[0.04] ring-1 ring-foreground/10">
                <Sparkles className="h-5 w-5 text-foreground/70" />
              </div>

              <p className="mt-5 text-lg font-semibold text-foreground">No featured products yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                New drops are coming soon. Check back shortly.
              </p>

              <Link
                to="/all-products"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[0_18px_50px_rgba(0,0,0,0.18)] hover:opacity-95 transition">
                View all products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Grid: BIG images + NO spaces */}
            <motion.div
              className="grid grid-cols-2 gap-0 md:grid-cols-3 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={container}>
              {shown.map((product) => (
                <motion.div key={product._id} variants={item}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom CTA (clean editorial card) */}
            <div className="mt-12 lg:mt-20 px-2">
              <div className="relative overflow-hidden bg-white ring-1 ring-black/10">
                {/* subtle grain */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
                  }}
                />

                <div className="relative flex flex-col gap-8 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10">
                  {/* Copy */}
                  <div className="max-w-xl">
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      Full collection
                    </p>

                    <h3 className="mt-3 font-serif text-2xl leading-tight text-foreground">
                      Explore the complete catalog
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Discover all styles, seasonal drops, and timeless essentials curated for
                      effortless everyday wear.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      to="/all-products"
                      className="group inline-flex items-center justify-center border border-foreground bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90">
                      View all products
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    <Link
                      to="/all-products"
                      className="group inline-flex items-center justify-center border border-foreground/20 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-foreground/5">
                      Browse lookbook
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
