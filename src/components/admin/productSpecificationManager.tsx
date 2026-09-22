import { useState } from "react";
import type {ProductSpecification,ProductSpecificationForm,} from "../../interfaces/catalogueAdmin.interface";
import type { ExtractedProductSpecification, ProductExtractionResult } from "../../interfaces/catalogueAdmin.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { productSpecificationApi } from "../../services/admin/productSpecificationApi";
import { productFeatureApi } from "../../services/admin/productFeatureApi";
import { productExtractionApi } from "../../services/admin/productExtractionApi";
import { ConfirmDialog } from "./confirmDialog";
import { FormFeedback } from "./formFeedback";
import { FormField } from "./formField";
import { DatasheetUploader } from "./datasheetUploader";
export const ProductSpecificationManager = ({
  productId,
  items,
  specificationFileUrl,
  onSpecificationFileChange,
  onRefresh,
}: {
  productId: number;
  items: ProductSpecification[];
  specificationFileUrl: string | null;
  onSpecificationFileChange: (specificationFileUrl: string | null) => Promise<void>;
  onRefresh: () => Promise<void>;
}) => {
  const [edit, setEdit] = useState<{
    id?: number;
    value: ProductSpecificationForm;
  } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ProductExtractionResult | null>(null);
  const [reviewedSpecifications, setReviewedSpecifications] = useState<ExtractedProductSpecification[]>([]);
  const [reviewedFeatures, setReviewedFeatures] = useState<string[]>([]);
  const save = async () => {
    if (
      !edit ||
      !edit.value.specificationName.trim() ||
      !edit.value.specificationValue.trim()
    )
      return setError("Specification name and value are required.");
    setBusy(true);
    try {
      if (edit.id) await productSpecificationApi.update(edit.id, edit.value);
      else await productSpecificationApi.create(edit.value);
      setEdit(null);
      setError("");
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to save specification."));
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (deleting === null) return;
    setBusy(true);
    try {
      await productSpecificationApi.delete(deleting);
      setDeleting(null);
      await onRefresh();
    } catch (e) {
      setError(getAdminApiError(e, "Unable to delete specification."));
    } finally {
      setBusy(false);
    }
  };
  const extract = async (fileUrl = specificationFileUrl) => {
    if (!fileUrl || extracting) return;
    setExtracting(true);
    try {
      const result = await productExtractionApi.extract(fileUrl);
      setExtracted(result);
      setReviewedSpecifications(result.specifications);
      setReviewedFeatures(result.features);
      setError("");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to extract specifications from this PDF. You can enter them manually."));
    } finally {
      setExtracting(false);
    }
  };
  const handleSpecificationFileChange = async (fileUrl: string | null) => {
    await onSpecificationFileChange(fileUrl);
    if (fileUrl) await extract(fileUrl);
    else {
      setExtracted(null);
      setReviewedSpecifications([]);
      setReviewedFeatures([]);
    }
  };
  const saveExtractedSpecifications = async () => {
    const specifications = reviewedSpecifications
      .map((item, displayOrder) => ({
        productId,
        specificationName: item.name.trim(),
        specificationValue: [item.value.trim(), item.unit?.trim()].filter(Boolean).join(" "),
        displayOrder: items.length + displayOrder,
      }))
      .filter((item) => item.specificationName && item.specificationValue);
    const features = reviewedFeatures
      .map((featureText, displayOrder) => ({ productId, featureText: featureText.trim(), displayOrder }))
      .filter((item) => item.featureText);
    if (!specifications.length && !features.length) return setError("Add at least one complete extracted item before saving.");
    setBusy(true);
    try {
      await Promise.all([
        ...specifications.map((item) => productSpecificationApi.create(item)),
        ...features.map((item) => productFeatureApi.create(item)),
      ]);
      setExtracted(null);
      setReviewedSpecifications([]);
      setReviewedFeatures([]);
      setError("");
      await onRefresh();
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to save extracted specifications."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="managementSection">
      <div className="adminSubheader">
        <h2>Specifications</h2>
        <button
          className="adminButton primary addButton"
          onClick={() =>
            setEdit({
              value: {
                productId,
                specificationName: "",
                specificationValue: "",
                displayOrder: 0,
              },
            })
          }
        >
          Add Specification
        </button>
      </div>
      <FormFeedback error={error} />
      <div className="datasheetSpecificationExtraction">
        <DatasheetUploader
          type="specification"
          value={specificationFileUrl}
          onChange={(value) => {
            void handleSpecificationFileChange(value).catch((reason) =>
              setError(getAdminApiError(reason, "Unable to prepare the specification PDF.")),
            );
          }}
          extracting={extracting}
          onExtract={() => void extract()}
        />
        {extracted && (
          <div className="extractedContentEditor">
            <div className="formFeedback successFeedback" role="status">
              Specifications extracted from datasheet. Please review before saving.
              {extracted.warnings.map((warning) => <p key={warning}>{warning}</p>)}
            </div>
            <div className="adminList extractedSpecificationList">
              {reviewedSpecifications.map((item, index) => (
                <article className="adminListCard" key={`${item.name}-${index}`}>
                  <div className="formGrid extractedSpecificationRow">
                    <FormField label="Name"><input value={item.name} onChange={(event) => setReviewedSpecifications(reviewedSpecifications.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: event.target.value } : entry))} /></FormField>
                    <FormField label="Value"><input value={item.value} onChange={(event) => setReviewedSpecifications(reviewedSpecifications.map((entry, entryIndex) => entryIndex === index ? { ...entry, value: event.target.value } : entry))} /></FormField>
                    <FormField label="Unit"><input value={item.unit ?? ""} onChange={(event) => setReviewedSpecifications(reviewedSpecifications.map((entry, entryIndex) => entryIndex === index ? { ...entry, unit: event.target.value || null } : entry))} /></FormField>
                  </div>
                  <button className="adminButton textButton" type="button" onClick={() => setReviewedSpecifications(reviewedSpecifications.filter((_, entryIndex) => entryIndex !== index))}>Remove</button>
                </article>
              ))}
            </div>
            <div className="nestedEditor">
              <div className="adminSubheader"><h3>Extracted features</h3><button className="adminButton secondary addButton" type="button" onClick={() => setReviewedFeatures([...reviewedFeatures, ""])}>Add feature</button></div>
              {reviewedFeatures.map((feature, index) => (
                <div className="extractedRow" key={`feature-${index}`}>
                  <input aria-label={`Feature ${index + 1}`} value={feature} onChange={(event) => setReviewedFeatures(reviewedFeatures.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry))} />
                  <button className="adminButton textButton" type="button" onClick={() => setReviewedFeatures(reviewedFeatures.filter((_, entryIndex) => entryIndex !== index))}>Remove</button>
                </div>
              ))}
            </div>
            <div className="formActions">
              <button className="adminButton secondary addButton" type="button" onClick={() => setReviewedSpecifications([...reviewedSpecifications, { name: "", value: "", unit: null }])}>Add extracted specification</button>
              <button className="adminButton primary saveButton" type="button" disabled={busy} onClick={() => void saveExtractedSpecifications()}>Save reviewed content</button>
            </div>
          </div>
        )}
      </div>
      {edit && (
        <form
          className="nestedEditor"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div className="formGrid">
            <FormField label="Name" required>
              <input
                value={edit.value.specificationName}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, specificationName: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Value" required>
              <input
                value={edit.value.specificationValue}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      specificationValue: e.target.value,
                    },
                  })
                }
              />
            </FormField>
            <FormField label="Display order">
              <input
                type="number"
                value={edit.value.displayOrder}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      displayOrder: Number(e.target.value),
                    },
                  })
                }
              />
            </FormField>
          </div>
          <div className="formActions">
            <button
              className="adminButton secondary"
              type="button"
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
            <button className="adminButton primary" disabled={busy}>
              Save Specification
            </button>
          </div>
        </form>
      )}
      <div className="adminList">
        {items.map((item) => (
          <article className="adminListCard" key={item.id}>
            <div>
              <strong>{item.specificationName}</strong>
              <p>
                {item.specificationValue} · Order {item.displayOrder}
              </p>
            </div>
            <div className="listActions">
              <button
                className="adminButton secondary"
                onClick={() =>
                  setEdit({
                    id: item.id,
                    value: {
                      productId,
                      specificationName: item.specificationName,
                      specificationValue: item.specificationValue,
                      displayOrder: item.displayOrder,
                    },
                  })
                }
              >
                Edit
              </button>
              <button
                className="adminButton danger"
                onClick={() => setDeleting(item.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete specification?"
        message="This specification will be permanently removed."
        busy={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void remove()}
      />
    </section>
  );
};
