import { useMemo, useState, useEffect, useRef } from "react";
import Reveal from "./Reveal";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { motion, useMotionValue, animate } from "framer-motion";
import clsx from "clsx";
import gsap from "gsap";

const formatLabel = (name = "") => String(name).trim() || "Unknown";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * ENHANCED CollectionStrip
 * - Adds luxury animated SVG hairlines (very subtle)
 * - Adds GSAP hover parallax (image + sheen) on cards
 * - Adds snap-to-card on resize and better drag end snapping
 * - Keeps your dark hero-consistent design
 */
export function CollectionStrip() {
  const { data: products } = useGetAllProductsQuery();
  const { data: categoryTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts } = useGetMainCategoriesWithCountsQuery();
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const tree = Array.isArray(categoryTree) ? categoryTree : [];
    const prods = Array.isArray(products) ? products : [];
    const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

    return tree.map((category) => {
      const label = formatLabel(category?.name);
      const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

      const firstProduct = prods.find((p) => String(p.category) === String(category._id));
      const image = category?.image || firstProduct?.image?.[0]?.url || "/fallback.jpg";

      const price =
        firstProduct?.hasDiscount && firstProduct?.discountedPrice != null
          ? Number(firstProduct.discountedPrice)
          : firstProduct?.price != null
            ? Number(firstProduct.price)
            : null;

      const from = price != null && !Number.isNaN(price) ? `${price.toFixed(2)} KD` : null;

      return { id: category._id, label, count, image, from };
    });
  }, [categoryTree, products, mainCategoriesWithCounts]);

  const hasMany = categories.length > 1;

  const [page, setPage] = useState(0);
  const maxPage = Math.max(0, categories.length - 1);

  const prev = () => setPage((p) => clamp(p - 1, 0, maxPage));
  const next = () => setPage((p) => clamp(p + 1, 0, maxPage));

  // responsive card width
  const [cardW, setCardW] = useState(340);
  useEffect(() => {
    const setByBp = () => {
      const w = window.innerWidth;
      if (w >= 1024) setCardW(460);
      else if (w >= 640) setCardW(380);
      else setCardW(320);
    };
    setByBp();
    window.addEventListener("resize", setByBp);
    return () => window.removeEventListener("resize", setByBp);
  }, []);

  const gap = 16;
  const x = useMotionValue(0);

  useEffect(() => {
    const to = -(page * (cardW + gap));
    const controls = animate(x, to, { type: "spring", stiffness: 140, damping: 26 });
    return () => controls.stop();
  }, [page, cardW, x]);

  // keep page valid if categories count changes
  useEffect(() => {
    setPage((p) => clamp(p, 0, maxPage));
  }, [maxPage]);

  // swipe feel
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const swipeConfidenceThreshold = 8000;

  // snap helper
  const snapToNearest = () => {
    const current = x.get();
    const nearest = Math.round(Math.abs(current) / (cardW + gap));
    setPage(clamp(nearest, 0, maxPage));
  };

  return (
    <section dir="ltr" className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Background dotted grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Vignette + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 55% 45%, rgba(255,255,255,0.07), transparent 60%), radial-gradient(700px 520px at 40% 60%, rgba(249,115,22,0.12), transparent 55%), radial-gradient(900px 520px at 50% 65%, rgba(0,0,0,0.2), rgba(0,0,0,0.85) 70%)",
        }}
      />

      {/* Luxury hairline SVG */}
      <LuxuryHairlines />

      <Reveal>
        <div className="relative mx-auto max-w-7xl px-6 py-14 lg:py-32">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Collections • Browse categories
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Shop by category
              </h2>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70">
                Explore essentials by category—clean, fast, and built for daily wear.
              </p>
            </div>

            {/* Arrows */}
            {hasMany && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={page === 0}
                  className={clsx(
                    "grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10",
                    page === 0 && "opacity-40 cursor-not-allowed hover:bg-white/5",
                  )}
                  aria-label="Previous"
                  title="Previous">
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={next}
                  disabled={page === maxPage}
                  className={clsx(
                    "grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10",
                    page === maxPage && "opacity-40 cursor-not-allowed hover:bg-white/5",
                  )}
                  aria-label="Next"
                  title="Next">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-4"
                style={{ x }}
                drag={hasMany ? "x" : false}
                dragConstraints={{ left: -(maxPage * (cardW + gap)), right: 0 }}
                dragElastic={0.08}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) next();
                  else if (swipe > swipeConfidenceThreshold) prev();
                  else snapToNearest();
                }}>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/category/${c.id}`)}
                    style={{ width: cardW }}
                    className="shrink-0 text-left"
                    aria-label={`Open category ${c.label}`}
                    title={c.label}>
                    <HeroConsistentCategoryCard item={c} />
                  </button>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between text-[10px] font-semibold text-white/45">
            <span>WEBSCHEMA</span>
            <span>★</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ Luxury Hairlines (SVG) ------------------------------ */

function LuxuryHairlines() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const glints = el.querySelectorAll("[data-glint]");
    gsap.set(glints, { opacity: 0.12 });

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    tl.to(glints, { x: 18, opacity: 0.28, duration: 3.6, stagger: 0.25 }, 0).to(
      glints,
      { x: 0, opacity: 0.12, duration: 3.6, stagger: 0.25 },
      3.6,
    );

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      tl.pause(0);
      gsap.set(glints, { opacity: 0.12, x: 0 });
    }

    return () => tl.kill();
  }, []);

  return (
    <svg
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      aria-hidden="true">
      <path d="M40 120 H1160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <path d="M40 520 H1160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />

      <path
        d="M0 260 C 260 214, 520 298, 780 248 S 1020 214, 1200 252"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="1"
        fill="none"
      />

      <g data-glint>
        <circle cx="520" cy="298" r="2.2" fill="rgba(255,255,255,0.28)" />
        <circle cx="520" cy="298" r="12" fill="rgba(249,115,22,0.10)" />
      </g>
      <g data-glint>
        <circle cx="880" cy="248" r="2.2" fill="rgba(255,255,255,0.25)" />
        <circle cx="880" cy="248" r="12" fill="rgba(249,115,22,0.08)" />
      </g>
      <g data-glint>
        <circle cx="1010" cy="252" r="2.2" fill="rgba(255,255,255,0.22)" />
        <circle cx="1010" cy="252" r="12" fill="rgba(249,115,22,0.07)" />
      </g>
    </svg>
  );
}

/* ------------------------------ Card (Enhanced) ------------------------------ */

function HeroConsistentCategoryCard({ item }) {
  const metaText = item.from ? `From ${item.from}` : `${item.count} items`;

  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const sheenRef = useRef(null);

  useEffect(() => {
    // set initial
    gsap.set(imgRef.current, { scale: 1.02 });
    gsap.set(sheenRef.current, { xPercent: -120, opacity: 0.0 });
  }, []);

  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.06, duration: 0.7, ease: "power3.out" });
    gsap.to(sheenRef.current, { xPercent: 120, opacity: 0.22, duration: 0.9, ease: "power2.out" });
    gsap.to(cardRef.current, { y: -3, duration: 0.35, ease: "power2.out" });
  };

  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1.02, duration: 0.7, ease: "power3.out" });
    gsap.to(sheenRef.current, { xPercent: -120, opacity: 0.0, duration: 0.6, ease: "power2.out" });
    gsap.to(cardRef.current, { y: 0, duration: 0.35, ease: "power2.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={clsx(
        "group relative overflow-hidden rounded-[28px]",
        "bg-white/5 ring-1 ring-white/12 backdrop-blur-2xl",
        "shadow-[0_40px_120px_rgba(0,0,0,0.70)] transition",
      )}>
      {/* grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
        }}
      />

      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            ref={imgRef}
            src={item.image}
            alt={item.label}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
            loading="lazy"
          />

          {/* luxury sheen */}
          <div
            ref={sheenRef}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.12) 35%, rgba(249,115,22,0.08) 50%, rgba(255,255,255,0.10) 65%, transparent 100%)",
              mixBlendMode: "screen",
            }}
          />

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          <div className="absolute inset-0 shadow-[inset_0_-140px_180px_rgba(0,0,0,0.55)]" />

          {/* top row */}
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white ring-1 ring-white/12 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              {metaText}
            </div>

            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/12 backdrop-blur transition hover:bg-white/15">
              <Heart className="h-4 w-4" />
            </div>
          </div>

          {/* bottom text */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl font-semibold tracking-tight text-white">{item.label}</h3>
            <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-white/70">
              VIEW COLLECTION
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
