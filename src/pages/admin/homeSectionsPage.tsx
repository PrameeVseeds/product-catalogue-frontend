import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { HomeSectionForm } from "../../components/admin/homeSectionForm";
import { HomeSectionItemForm } from "../../components/admin/homeSectionItemForm";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminHomeSection,
  AdminHomeSectionItem,
  HomeSectionForm as SectionValues,
  HomeSectionItemForm as ItemValues,
} from "../../interfaces/adminCms.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { homeSectionApi } from "../../services/admin/homeSectionApi";

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
  displayOrder: 0,
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
  const [sections, setSections] = useState<AdminHomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [sectionEdit, setSectionEdit] = useState<{
    id?: number;
    value: SectionValues;
  } | null>(null);
  const [itemParent, setItemParent] = useState<number | null>(null);
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
  const openItems = async (section: AdminHomeSection) => {
    setItemParent(section.id);
    setItemEdit(null);
    try {
      const items = await homeSectionApi.getItems(section.id);
      setSections((current) =>
        current.map((entry) =>
          entry.id === section.id ? { ...entry, items } : entry,
        ),
      );
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to load section items."));
    }
  };
  const saveItem = async () => {
    if (!itemEdit || itemParent === null || saving) return;
    if (!itemEdit.value.title.trim()) {
      setError("Item title is required.");
      return;
    }
    setSaving(true);
    try {
      if (itemEdit.id)
        await homeSectionApi.updateItem(itemEdit.id, itemEdit.value);
      else await homeSectionApi.createItem(itemParent, itemEdit.value);
      setItemEdit(null);
      setSuccess("Section item saved successfully.");
      const parent = sections.find((s) => s.id === itemParent);
      if (parent) await openItems(parent);
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
        setItemParent(null);
        await load();
      } else {
        await homeSectionApi.deleteItem(deleteTarget.id);
        const parent = sections.find((s) => s.id === itemParent);
        if (parent) await openItems(parent);
      }
      setSuccess("Deleted successfully.");
      setDeleteTarget(null);
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to delete this record."));
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  const activeSection = sections.find((section) => section.id === itemParent);
  return (
    <>
      <AdminPageHeader
        title="Home Sections"
        description="Manage ordered sections and card items on the homepage."
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
      {sectionEdit && (
        <HomeSectionForm
          value={sectionEdit.value}
          saving={saving}
          onChange={(value) => setSectionEdit({ ...sectionEdit, value })}
          onSubmit={() => void saveSection()}
          onCancel={() => setSectionEdit(null)}
        />
      )}
      <div className="adminList">
        {sections.map((section) => (
          <article className="adminListCard" key={section.id}>
            <div>
              <span className="statusBadge">{section.sectionType}</span>
              <h2>{section.title || section.sectionKey}</h2>
              <p>
                Order {section.displayOrder} ·{" "}
                {section.isVisible ? "Visible" : "Hidden"}
              </p>
            </div>
            <div className="listActions">
              <button
                className="adminButton secondary"
                type="button"
                onClick={() =>
                  setSectionEdit({
                    id: section.id,
                    value: sectionValues(section),
                  })
                }
              >
                Edit
              </button>
              {section.sectionType === "CARDS" && (
                <button
                  className="adminButton secondary"
                  type="button"
                  onClick={() => void openItems(section)}
                >
                  Manage Items
                </button>
              )}
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
          </article>
        ))}
      </div>
      {activeSection && (
        <section className="adminPanel itemManager">
          <div className="adminSubheader">
            <h2>{activeSection.title || activeSection.sectionKey} Items</h2>
            <button
              className="adminButton primary"
              type="button"
              onClick={() => setItemEdit({ value: emptyItem })}
            >
              Add Item
            </button>
          </div>
          {itemEdit && (
            <HomeSectionItemForm
              value={itemEdit.value}
              saving={saving}
              onChange={(value) => setItemEdit({ ...itemEdit, value })}
              onSubmit={() => void saveItem()}
              onCancel={() => setItemEdit(null)}
            />
          )}
          <div className="adminList">
            {activeSection.items.map((item: AdminHomeSectionItem) => (
              <article className="adminListCard" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    Order {item.displayOrder} ·{" "}
                    {item.isVisible ? "Visible" : "Hidden"}
                  </p>
                </div>
                <div className="listActions">
                  <button
                    className="adminButton secondary"
                    type="button"
                    onClick={() =>
                      setItemEdit({ id: item.id, value: itemValues(item) })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="adminButton danger"
                    type="button"
                    onClick={() =>
                      setDeleteTarget({ kind: "item", id: item.id })
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
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
