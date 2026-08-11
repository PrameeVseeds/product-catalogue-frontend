import { useEffect, useRef } from "react";
import type { ProductSummary } from "../../interfaces/product.interface";
import { ProductCard } from "./productCard";

export const AutoScrollingProductRow = ({products,}: {products: ProductSummary[];}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const timer = window.setInterval(() => {
      if (pausedRef.current || row.scrollWidth <= row.clientWidth) return;
      const reachedEnd =
        row.scrollLeft >= row.scrollWidth - row.clientWidth - 1;
      row.scrollLeft = reachedEnd ? 0 : row.scrollLeft + 1;
    }, 30);

    return () => window.clearInterval(timer);
  }, [products]);

  return (
    <div
      ref={rowRef}
      className="autoScrollingProductRow"
      aria-label="Featured products"
      tabIndex={0}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocus={() => {
        pausedRef.current = true;
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          pausedRef.current = false;
      }}
      onPointerDown={() => {
        pausedRef.current = true;
      }}
      onPointerUp={() => {
        pausedRef.current = false;
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact />
      ))}
    </div>
  );
};
