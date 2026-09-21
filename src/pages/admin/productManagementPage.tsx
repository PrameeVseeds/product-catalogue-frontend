import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { ProductFeatureManager } from "../../components/admin/productFeatureManager";
import { ProductGalleryManager } from "../../components/admin/productGalleryManager";
import { ProductSpecificationManager } from "../../components/admin/productSpecificationManager";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type { AdminProductDetail } from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productAdminApi } from "../../services/admin/productAdminApi";

export const ProductManagementPage = () => {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!Number.isInteger(productId) || productId <= 0) {
      setError("Product ID is invalid.");
      setLoading(false);
      return;
    }
    try {
      const summary = (await productAdminApi.getAll()).find(
        (item) => item.id === productId,
      );
      if (!summary) throw new Error("NOT_FOUND");
      setProduct(await productAdminApi.getDetail(summary.slug));
      setError("");
    } catch (e) {
      setError(
        getAdminApiError(
          e,
          "Unable to load product management data. The product must be active for its public detail data to be available.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);
  useEffect(() => {
    void load();
  }, [load]);
  const saveSpecificationPdf = async (specificationFileUrl: string | null) => {
    if (!product) return;
    try {
      await productAdminApi.update(product.id, { ...product, specificationFileUrl });
      await load();
    } catch (reason) {
      setError(getAdminApiError(reason, "Specification PDF uploaded but could not be linked to this product."));
      throw reason;
    }
  };
  if (loading) return <LoadingSpinner />;
  if (!product) return <FormFeedback error={error} />;
  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Manage gallery images, features and specifications."
        action={
          <Link className="adminButton secondary" to="/admin/products">
            Back to Products
          </Link>
        }
      />
      <FormFeedback error={error} />
      <nav className="managementNav" aria-label="Product management sections">
        <a href="#general">General</a>
        <a href="#gallery">Gallery</a>
        <a href="#features">Features</a>
        <a href="#specifications">Specifications</a>
      </nav>
      <section id="general" className="adminPanel managementSection">
        <h2>General</h2>
        <p>Edit the main product record from the products list.</p>
        <div className="listActions">
          <Link className="adminButton secondary" to="/admin/products">
            Edit Product
          </Link>
          <Link
            className="adminButton secondary"
            to={`/products/${product.slug}`}
            target="_blank"
          >
            Open Public Page
          </Link>
          <a
            className="adminButton secondary"
            href={productAdminApi.getDatasheetUrl(product.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Datasheet
          </a>
        </div>
      </section>
      <div id="gallery">
        <ProductGalleryManager
          productId={product.id}
          items={product.galleryImages}
          onRefresh={load}
        />
      </div>
      <div id="features">
        <ProductFeatureManager
          productId={product.id}
          items={product.features}
          onRefresh={load}
        />
      </div>
      <div id="specifications">
        <ProductSpecificationManager
          productId={product.id}
          items={product.specifications}
          specificationFileUrl={product.specificationFileUrl}
          onSpecificationFileChange={saveSpecificationPdf}
          onRefresh={load}
        />
      </div>
    </>
  );
};
