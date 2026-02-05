// ProductCard.jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const id = product?._id;
  const name = product?.name || "Product";

  const category = useMemo(() => {
    return (
      product?.category?.name ||
      product?.category?.title ||
      product?.category ||
      product?.brand ||
      "Collection"
    );
  }, [product]);

  const oldPrice = Number(product?.price ?? 0);
  const price = product?.hasDiscount ? Number(product?.discountedPrice ?? oldPrice) : oldPrice;

  const primaryImage =
    product?.image?.[0]?.url || product?.image?.url || product?.image || "/placeholder.svg";

  const hoverImage =
    product?.hoverImage?.url ||
    product?.hoverImage ||
    product?.image?.[1]?.url ||
    product?.image?.[0]?.url ||
    "/placeholder.svg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="h-full">
      <Link
        to={`/product/${id}`}
        className="group block h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {/* IMAGE (mobile: overlays live INSIDE image) */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Primary */}
          <img
            src={primaryImage}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Hover */}
          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* gradient for readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:hidden" />

          {/* MOBILE overlay text INSIDE image */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/85">
              {String(category)}
            </p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <h3 className="line-clamp-2 truncate font-serif text-sm leading-tight text-white">
                {name}
              </h3>
              <div className="shrink-0 text-[12px] font-semibold text-white/95">
                {product?.hasDiscount ? (
                  <span>{price.toFixed(3)} KD</span>
                ) : (
                  <span>{price.toFixed(3)} KD</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP text BELOW image */}
        <div className="hidden px-3 py-3 space-y-1 md:block">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {String(category)}
          </p>

          <h3 className="font-serif text-lg leading-snug">{name}</h3>

          <div className="text-sm text-muted-foreground tracking-wide">
            {product?.hasDiscount ? (
              <>
                <span className="line-through mr-2">{oldPrice.toFixed(3)} KD</span>
                <span className="text-foreground">{price.toFixed(3)} KD</span>
              </>
            ) : (
              <span>Starting at {price.toFixed(3)} KD</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
