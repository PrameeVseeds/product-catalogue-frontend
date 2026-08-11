import { useMemo, useState } from "react";
import type { Product } from "../../interfaces/product.interface";
import { getImageUrl } from "../../utils/getImageUrl";

export const ProductGallery = ({ product }: { product: Product }) => {
  const images = useMemo(
    () =>
      [
        ...(product.mainImageUrl
          ? [
              {
                id: "main",
                imageUrl: product.mainImageUrl,
                altText: product.name,
              },
            ]
          : []),
        ...product.galleryImages,
      ].filter(
        (image, index, all) =>
          all.findIndex(
            (candidate) => candidate.imageUrl === image.imageUrl,
          ) === index,
      ),
    [product],
  );
  const [selected, setSelected] = useState(0);
  if (!images.length)
    return (
      <div
        className="productImagePlaceholder"
        aria-label="No product image available"
      />
    );
  const current = images[Math.min(selected, images.length - 1)];
  return (
    <div className="productGalleryViewer">
      <img
        className="productMainImage"
        src={getImageUrl(current.imageUrl)}
        alt={current.altText ?? product.name}
      />
      {images.length > 1 && (
        <div className="productThumbnails" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={`${image.id}-${index}`}
              type="button"
              className={index === selected ? "isSelected" : ""}
              onClick={() => setSelected(index)}
              aria-label={`View ${image.altText ?? product.name}`}
              aria-pressed={index === selected}
            >
              <img src={getImageUrl(image.imageUrl)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
