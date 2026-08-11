import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { HomeSectionForm } from "../../components/admin/homeSectionForm";
import { HomeSectionItemForm } from "../../components/admin/homeSectionItemForm";
import { DynamicIcon } from "../../components/common/dynamicIcon";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminHomeSection,
  AdminHomeSectionItem,
  HomeSectionForm as SectionValues,
  HomeSectionItemForm as ItemValues,
} from "../../interfaces/adminCms.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { homeSectionApi } from "../../services/admin/homeSectionApi";
import { getImageUrl } from "../../utils/getImageUrl";

const emptySection: SectionValues = {
  sectionKey: "",
  title: null,
  subtitle: null,
  description: null,
  imageUrl: null,
  backgroundImageUrl: null,
  buttonText: null,
  buttonLink: null,
  sectionType: "CONTENT",
  displayOrder: 0,
  isVisible: true,
};
const emptyItem: ItemValues = {
  title: "",
  subtitle: null,
  description: null,
  imageUrl: null,
  iconName: null,
  buttonText: null,
  buttonLink: null,
  displayOrder: 1,
  isVisible: true,
};
const sectionValues = ({
  sectionKey,
  title,
  subtitle,
  description,
  imageUrl,
  backgroundImageUrl,
  buttonText,
  buttonLink,
  sectionType,
  displayOrder,
  isVisible,
}: AdminHomeSection): SectionValues => ({
  sectionKey,
  title,
  subtitle,
  description,
  imageUrl,
  backgroundImageUrl,
  buttonText,
  buttonLink,
  sectionType,
  displayOrder,
  isVisible,
});
const itemValues = ({
  title,
  subtitle,
  description,
  imageUrl,
  iconName,
  buttonText,
  buttonLink,
  displayOrder,
  isVisible,
}: AdminHomeSectionItem): ItemValues => ({
  title,
  subtitle,
  description,
  imageUrl,
  iconName,
  buttonText,
  buttonLink,
  displayOrder,
  isVisible,
});

export const HomeSectionsPage = () => {
  const [sections, setSections] = useState<AdminHomeSection[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(""),
    [saving, setSaving] = useState(false);
  const [sectionEdit, setSectionEdit] = useState<{
    id?: number;
    value: SectionValues;
  } | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState<number | null>(
      null,
    ),
    [expandedItemId, setExpandedItemId] = useState<number | null>(null);
  const [itemEdit, setItemEdit] = useState<{
    id?: number;
    value: ItemValues;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    kind: "section" | "item";
    id: number;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      setSections(await homeSectionApi.getAll());
      setError("");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to load home sections."));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const loadItems = async (section: AdminHomeSection) => {
    if (section.sectionType !== "CARDS") return;
    const items = await homeSectionApi.getItems(section.id);
    setSections((current) =>
      current.map((entry) =>
        entry.id === section.id ? { ...entry, items } : entry,
      ),
    );
  };
  const toggleSection = async (section: AdminHomeSection) => {
    if (expandedSectionId === section.id) {
      setExpandedSectionId(null);
      setExpandedItemId(null);
      setItemEdit(null);
      return;
    }
    setExpandedSectionId(section.id);
    setExpandedItemId(null);
    setItemEdit(null);
    try {
      await loadItems(section);
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to load section items."));
    }
  };
  const saveSection = async () => {
    if (!sectionEdit || saving) return;
    if (!sectionEdit.value.sectionKey.trim()) {
      setError("Section key is required.");
      return;
    }
    setSaving(true);
    try {
      if (sectionEdit.id)
        await homeSectionApi.update(sectionEdit.id, sectionEdit.value);
      else await homeSectionApi.create(sectionEdit.value);
      setSectionEdit(null);
      setSuccess("Section saved successfully.");
      await load();
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to save section."));
    } finally {
      setSaving(false);
    }
  };
  const saveItem = async () => {
    if (!itemEdit || expandedSectionId === null || saving) return;
    if (!itemEdit.value.title.trim()) {
      setError("Item title is required.");
      return;
    }
    setSaving(true);
    try {
      if (itemEdit.id)
        await homeSectionApi.updateItem(itemEdit.id, itemEdit.value);
      else await homeSectionApi.createItem(expandedSectionId, itemEdit.value);
      const parent = sections.find(
        (section) => section.id === expandedSectionId,
      );
      if (parent) await loadItems(parent);
      setItemEdit(null);
      setExpandedItemId(null);
      setSuccess("Section item saved successfully.");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to save section item."));
    } finally {
      setSaving(false);
    }
  };
  const confirmDelete = async () => {
    if (!deleteTarget || saving) return;
    setSaving(true);
    try {
      if (deleteTarget.kind === "section") {
        await homeSectionApi.delete(deleteTarget.id);
        setExpandedSectionId(null);
        await load();
      } else {
        await homeSectionApi.deleteItem(deleteTarget.id);
        const parent = sections.find(
          (section) => section.id === expandedSectionId,
        );
        if (parent) await loadItems(parent);
      }
      setDeleteTarget(null);
      setSuccess("Deleted successfully.");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to delete this record."));
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <>
      <AdminPageHeader
        title="Home Sections"
        description="Manage homepage sections and their nested items."
        action={
          <button
            className="adminButton primary"
            type="button"
            onClick={() => setSectionEdit({ value: emptySection })}
          >
            Add Section
          </button>
        }
      />
      <FormFeedback error={error} success={success} />
      {sectionEdit && !sectionEdit.id && (
        <HomeSectionForm
          value={sectionEdit.value}
          saving={saving}
          onChange={(value) => setSectionEdit({ ...sectionEdit, value })}
          onSubmit={() => void saveSection()}
          onCancel={() => setSectionEdit(null)}
        />
      )}
      <div className="sectionAccordionList">
        {sections.map((section) => {
          const expanded = expandedSectionId === section.id;
          return (
            <article
              className={`sectionAccordion${expanded ? " isExpanded" : ""}`}
              key={section.id}
            >
              <div className="accordionHeader">
                <button
                  className="accordionSummary"
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`section-panel-${section.id}`}
                  onClick={() => void toggleSection(section)}
                >
                  <span className="accordionChevron" aria-hidden="true">
                    ›
                  </span>
                  <span>
                    <span className="statusBadge">{section.sectionType}</span>
                    <strong>{section.title || section.sectionKey}</strong>
                    <small>
                      Order {section.displayOrder} ·{" "}
                      {section.isVisible ? "Visible" : "Hidden"}
                    </small>
                  </span>
                </button>
                <div className="listActions">
                  <button
                    className="adminButton secondary"
                    type="button"
                    onClick={() => {
                      setExpandedSectionId(section.id);
                      setSectionEdit({
                        id: section.id,
                        value: sectionValues(section),
                      });
                      void loadItems(section);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="adminButton danger"
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ kind: "section", id: section.id })
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expanded && (
                <div
                  className="accordionPanel"
                  id={`section-panel-${section.id}`}
                >
                  {sectionEdit?.id === section.id && (
                    <HomeSectionForm
                      value={sectionEdit.value}
                      saving={saving}
                      onChange={(value) =>
                        setSectionEdit({ ...sectionEdit, value })
                      }
                      onSubmit={() => void saveSection()}
                      onCancel={() => setSectionEdit(null)}
                    />
                  )}
                  {section.sectionType === "CARDS" && (
                    <div className="nestedItems">
                      <div className="adminSubheader">
                        <h3>Section items</h3>
                        <button
                          className="adminButton primary"
                          type="button"
                          onClick={() => {
                            setExpandedItemId(null);
                            setItemEdit({
                              value: {
                                ...emptyItem,
                                displayOrder:
                                  Math.max(
                                    0,
                                    ...section.items.map(
                                      (item) => item.displayOrder,
                                    ),
                                  ) + 1,
                              },
                            });
                          }}
                        >
                          Add Item
                        </button>
                      </div>
                      {itemEdit && !itemEdit.id && (
                        <HomeSectionItemForm
                          value={itemEdit.value}
                          saving={saving}
                          onChange={(value) =>
                            setItemEdit({ ...itemEdit, value })
                          }
                          onSubmit={() => void saveItem()}
                          onCancel={() => setItemEdit(null)}
                        />
                      )}
                      <div className="itemAccordionList">
                        {section.items.map((item) => {
                          const itemExpanded = expandedItemId === item.id;
                          return (
                            <article
                              className={`itemAccordion${itemExpanded ? " isExpanded" : ""}`}
                              key={item.id}
                            >
                              <div className="accordionHeader">
                                <button
                                  className="accordionSummary itemAccordionSummary"
                                  type="button"
                                  aria-expanded={itemExpanded}
                                  aria-controls={`item-panel-${item.id}`}
                                  onClick={() => {
                                    setExpandedItemId(
                                      itemExpanded ? null : item.id,
                                    );
                                    setItemEdit(null);
                                  }}
                                >
                                  <span
                                    className="accordionChevron"
                                    aria-hidden="true"
                                  >
                                    ›
                                  </span>
                                  {item.imageUrl ? (
                                    <img
                                      src={getImageUrl(item.imageUrl)}
                                      alt=""
                                      loading="lazy"
                                    />
                                  ) : item.iconName ? (
                                    <span className="adminItemIcon">
                                      <DynamicIcon
                                        name={item.iconName}
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                  <span>
                                    <strong>{item.title}</strong>
                                    {item.subtitle && (
                                      <span className="itemListSubtitle">
                                        {item.subtitle}
                                      </span>
                                    )}
                                    <small>
                                      Order {item.displayOrder} ·{" "}
                                      {item.isVisible ? "Visible" : "Hidden"}
                                    </small>
                                  </span>
                                </button>
                                <div className="listActions">
                                  <button
                                    className="adminButton secondary"
                                    type="button"
                                    onClick={() => {
                                      setExpandedItemId(item.id);
                                      setItemEdit({
                                        id: item.id,
                                        value: itemValues(item),
                                      });
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="adminButton danger"
                                    type="button"
                                    onClick={() =>
                                      setDeleteTarget({
                                        kind: "item",
                                        id: item.id,
                                      })
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              {itemExpanded && (
                                <div
                                  className="accordionPanel"
                                  id={`item-panel-${item.id}`}
                                >
                                  {itemEdit?.id === item.id ? (
                                    <HomeSectionItemForm
                                      value={itemEdit.value}
                                      saving={saving}
                                      onChange={(value) =>
                                        setItemEdit({ ...itemEdit, value })
                                      }
                                      onSubmit={() => void saveItem()}
                                      onCancel={() => setItemEdit(null)}
                                    />
                                  ) : (
                                    item.description && (
                                      <p className="accordionDescription">
                                        {item.description}
                                      </p>
                                    )
                                  )}
                                </div>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Confirm deletion"
        message="This action cannot be undone."
        busy={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
      />
    </>
  );
};
