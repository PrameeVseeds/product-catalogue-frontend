import { useEffect, useState } from "react";
import type { Product } from "../interfaces/product.interface";
import { getApiErrorMessage } from "../services/apiClient";
import { productApi } from "../services/productApi";
export const useProductDetails = (slug?: string) => {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    if (!slug) {
      setError("Product not found.");
      setLoading(false);
      return;
    }
    productApi
      .getProductBySlug(slug)
      .then((product) => {
        if (active) setData(product);
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  return { data, loading, error };
};
