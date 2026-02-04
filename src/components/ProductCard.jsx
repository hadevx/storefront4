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
        {/* Image block: BIG + NO extra margins */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={primaryImage}
            alt={name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          <img
            src={hoverImage}
            alt={`${name} alternate view`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Optional subtle overlay (no fake spacing) */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.10)",
            }}
          />
        </div>

        {/* Text: compact padding so grid stays tight */}
        <div className="px-3 py-3 space-y-1">
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
