import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useGetAllProductsQuery,
  useGetCategoriesTreeQuery,
  useGetMainCategoriesWithCountsQuery,
} from "../redux/queries/productApi";
import { useNavigate } from "react-router-dom";

const formatLabel = (name = "") => String(name).trim() || "Unknown";

function buildCategories(categoryTree, products, mainCategoriesWithCounts) {
  const tree = Array.isArray(categoryTree) ? categoryTree : [];
  const prods = Array.isArray(products) ? products : [];
  const counts = Array.isArray(mainCategoriesWithCounts) ? mainCategoriesWithCounts : [];

  return tree
    .map((category) => {
      const label = formatLabel(category?.name);
      const count = counts.find((c) => String(c._id) === String(category._id))?.count || 0;

      const firstProduct = prods.find((p) => String(p.category) === String(category._id));
      const image =
        category?.image ||
        firstProduct?.image?.[0]?.url ||
        "https://images.unsplash.com/photo-1520975682071-a2d7b69f1b17?auto=format&fit=crop&w=2400&q=80";

      const price =
        firstProduct?.hasDiscount && firstProduct?.discountedPrice != null
          ? Number(firstProduct.discountedPrice)
          : firstProduct?.price != null
            ? Number(firstProduct.price)
            : null;

      const from = price != null && !Number.isNaN(price) ? `${price.toFixed(2)} KD` : null;

      return { id: category._id, label, count, image, from };
    })
    .filter(Boolean);
}

export default function CollectionsScrollCards() {
  const { data: products, isLoading: loadingProducts } = useGetAllProductsQuery();
  const { data: categoryTree, isLoading: loadingTree } = useGetCategoriesTreeQuery();
  const { data: mainCategoriesWithCounts, isLoading: loadingCounts } =
    useGetMainCategoriesWithCountsQuery();

  const navigate = useNavigate();

  const categories = useMemo(
    () => buildCategories(categoryTree, products, mainCategoriesWithCounts),
    [categoryTree, products, mainCategoriesWithCounts],
  );

  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const ticking = useRef(false);

  const totalCards = categories.length;

  // ✅ Controls how much scroll is needed to move through cards
  // Smaller = faster changes. Try 0.45 (very fast) → 0.75 (mild).
  const SCROLL_SPEED = 0.55;

  // Keep section height comfortable
  const wrapperVh = Math.max(3, totalCards + 1);
  const wrapperStyle = { height: `${wrapperVh * 100}vh` };

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;

      window.requestAnimationFrame(() => {
        if (!sectionRef.current) return;

        const rect = sectionRef.current.getBoundingClientRect();
        const vh = window.innerHeight;

        // ✅ Faster: reduce scrollDistance using SCROLL_SPEED
        const baseDistance = vh * (wrapperVh - 1);
        const scrollDistance = Math.max(1, baseDistance * SCROLL_SPEED);

        let progress = 0;
        if (rect.top <= 0) {
          progress = Math.min(1, Math.max(0, Math.abs(rect.top) / scrollDistance));
        }

        if (totalCards > 0) {
          setActiveIndex(Math.min(totalCards - 1, Math.floor(progress * totalCards)));
        }

        ticking.current = false;
      });

      ticking.current = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [totalCards, wrapperVh]);

  const metaText = (c) => (c?.from ? `From ${c.from}` : `${c?.count ?? 0} items`);
  const loading = loadingProducts || loadingTree || loadingCounts;

  const BgLayer = ({ url }) => (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.18), rgba(0,0,0,.86)), url('${url}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );

  const CardTag = ({ children }) => (
    <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white ring-1 ring-white/15">
      <span className="text-sm font-medium">{children}</span>
    </div>
  );

  const progressPct = totalCards > 0 ? ((activeIndex + 1) / totalCards) * 100 : 0;

  return (
    <div ref={sectionRef} className="relative" style={wrapperStyle}>
      <section className="sticky top-0 w-full h-screen overflow-hidden bg-white">
        <div className="mx-auto h-full max-w-7xl px-6 lg:px-8 py-10 md:py-16 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Shop by collection</h2>
            <p className="mt-2 text-black/60">
              Scroll to explore categories. Tap any card to enter.
            </p>

            {/* Horizontal progress line */}
            <div className="mt-6 w-full max-w-2xl">
              <div className="relative h-1 w-full rounded-full bg-black/15 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-black transition-[width] duration-200"
                  style={{ width: `${progressPct}%` }}
                />
                <div
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-black transition-[left] duration-200"
                  style={{ left: `calc(${progressPct}% - 4px)` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-black/60">
                  {loading ? "Loading…" : `${activeIndex + 1} / ${Math.max(1, totalCards)}`}
                </span>
                <span className="font-semibold text-black/70 truncate max-w-[70%] text-right">
                  {categories[activeIndex]?.label || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="relative flex-1">
            {!loading &&
              categories.map((c, i) => {
                const offset = i - activeIndex;
                if (Math.abs(offset) > 2) return null;

                const translateY = offset === 0 ? 10 : offset === 1 ? 55 : offset === -1 ? 95 : 200;
                const scale = offset === 0 ? 1 : offset === 1 ? 0.96 : 0.92;
                const opacity = offset === 0 ? 1 : offset === 1 ? 0.95 : 0.55;
                const zIndex = 50 - Math.abs(offset) * 10;

                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/category/${c.id}`)}
                    className="absolute inset-0 cursor-pointer overflow-hidden rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.22)]"
                    style={{
                      zIndex,
                      transform: `translateY(${translateY}px) scale(${scale})`,
                      opacity,
                      transition:
                        "transform 420ms cubic-bezier(0.19,1,0.22,1), opacity 420ms cubic-bezier(0.19,1,0.22,1)",
                      willChange: "transform, opacity",
                      pointerEvents: opacity > 0.8 ? "auto" : "none",
                    }}>
                    <BgLayer url={c.image} />

                    <div className="absolute top-4 right-4 z-20">
                      <CardTag>{metaText(c)}</CardTag>
                    </div>

                    <div className="relative z-10 h-full flex items-end p-6 sm:p-8">
                      <div className="max-w-xl">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold">
                          {c.label}
                        </h3>
                        <p className="mt-3 text-white/80 max-w-lg">
                          Discover pieces curated for{" "}
                          <span className="font-semibold text-white">{c.label}</span>.
                        </p>
                      </div>
                    </div>

                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')",
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
