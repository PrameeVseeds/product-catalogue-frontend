import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { FormFeedback } from "../../components/admin/formFeedback";
import { ProductFeatureManager } from "../../components/admin/productFeatureManager";
import { ProductGalleryManager } from "../../components/admin/productGalleryManager";
import { ProductModelManager } from "../../components/admin/productModelManager";
import { ProductSpecificationManager } from "../../components/admin/productSpecificationManager";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type { AdminProductDetail } from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productAdminApi } from "../../services/admin/productAdminApi";

const ManagementAccordion = ({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) => (
  <section id={id} className={`managementAccordion${open ? " isOpen" : ""}`}>
    <button
      className="managementAccordionTrigger"
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-content`}
      onClick={onToggle}
    >
      <span>{title}</span>
    </button>
    {open && (
      <div id={`${id}-content`} className="managementAccordionContent">
        {children}
      </div>
    )}
  </section>
);

export const ProductManagementPage = () => {
  const { id } = useParams();
  const productId = Number(id);
  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState("general");
  const toggleSection = (section: string) =>
    setOpenSection((current) => (current === section ? "" : section));
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
      await productAdminApi.update(product.id, {
        ...product,
        specificationFileUrl,
      });
      await load();
    } catch (reason) {
      setError(
        getAdminApiError(
          reason,
          "Specification PDF uploaded but could not be linked to this product.",
        ),
      );
      throw reason;
    }
  };
  const saveModels = async (modelNumber: string | null) => {
    if (!product) return;
    try {
      await productAdminApi.update(product.id, { ...product, modelNumber });
      await load();
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to update product models."));
      throw reason;
    }
  };
  if (loading) return <LoadingSpinner />;
  if (!product) return <FormFeedback error={error} />;
  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Manage models, gallery images, features and specifications."
        action={
          <Link
            className="adminButton secondary backButton"
            to="/admin/products"
          >
            <ArrowLeft aria-hidden="true" />
            Back to Products
          </Link>
        }
      />
      <FormFeedback error={error} />
      <div className="productManagementAccordions">
        <ManagementAccordion
          id="general"
          title="General"
          open={openSection === "general"}
          onToggle={() => toggleSection("general")}
        >
          <div className="managementSection">
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
          </div>
        </ManagementAccordion>
        <ManagementAccordion
          id="models"
          title="Models"
          open={openSection === "models"}
          onToggle={() => toggleSection("models")}
        >
          <ProductModelManager
            modelNumber={product.modelNumber}
            onSave={saveModels}
          />
        </ManagementAccordion>
        <ManagementAccordion
          id="gallery"
          title="Gallery"
          open={openSection === "gallery"}
          onToggle={() => toggleSection("gallery")}
        >
          <ProductGalleryManager
            productId={product.id}
            items={product.galleryImages}
            onRefresh={load}
          />
        </ManagementAccordion>
        <ManagementAccordion
          id="features"
          title="Features"
          open={openSection === "features"}
          onToggle={() => toggleSection("features")}
        >
          <ProductFeatureManager
            productId={product.id}
            items={product.features}
            onRefresh={load}
          />
        </ManagementAccordion>
        <ManagementAccordion
          id="specifications"
          title="Specifications"
          open={openSection === "specifications"}
          onToggle={() => toggleSection("specifications")}
        >
          <ProductSpecificationManager
            productId={product.id}
            items={product.specifications}
            specificationFileUrl={product.specificationFileUrl}
            onSpecificationFileChange={saveSpecificationPdf}
            onRefresh={load}
          />
        </ManagementAccordion>
      </div>
    </>
  );
};
