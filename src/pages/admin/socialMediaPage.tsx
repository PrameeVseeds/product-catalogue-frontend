import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {
  AdminSocialMedia,
  SocialMediaForm,
} from "../../interfaces/adminCms.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { socialMediaApi } from "../../services/admin/socialMediaApi";
import { isHttpUrl, optionalText } from "../../utils/formValidation";

const emptyLink: SocialMediaForm = {
  platform: "",
  displayName: null,
  profileUrl: "",
  iconName: null,
  displayOrder: 0,
  isActive: true,
};
const formValues = ({
  platform,
  displayName,
  profileUrl,
  iconName,
  displayOrder,
  isActive,
}: AdminSocialMedia): SocialMediaForm => ({
  platform,
  displayName,
  profileUrl,
  iconName,
  displayOrder,
  isActive,
});
export const SocialMediaPage = () => {
  const [links, setLinks] = useState<AdminSocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [edit, setEdit] = useState<{
    id?: number;
    value: SocialMediaForm;
  } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      setLinks(await socialMediaApi.getAll());
      setError("");
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to load social links."));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const save = async () => {
    if (!edit || saving) return;
    if (!edit.value.platform.trim()) {
      setError("Platform is required.");
      return;
    }
    if (!isHttpUrl(edit.value.profileUrl)) {
      setError("Enter a valid HTTP or HTTPS profile URL.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (edit.id) await socialMediaApi.update(edit.id, edit.value);
      else await socialMediaApi.create(edit.value);
      setEdit(null);
      setSuccess("Social link saved successfully.");
      await load();
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to save social link."));
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (deleteId === null || saving) return;
    setSaving(true);
    try {
      await socialMediaApi.delete(deleteId);
      setDeleteId(null);
      setSuccess("Social link deleted.");
      await load();
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to delete social link."));
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  return (
    <>
      <AdminPageHeader
        title="Social Media"
        description="Manage social links displayed on the public website."
        action={
          <button
            className="adminButton primary"
            type="button"
            onClick={() => setEdit({ value: emptyLink })}
          >
            Add Social Link
          </button>
        }
      />
      <FormFeedback error={error} success={success} />
      {edit && (
        <form
          className="adminPanel adminForm editorPanel"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div className="formGrid">
            <FormField label="Platform">
              <input
                value={edit.value.platform}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, platform: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Display name">
              <input
                value={edit.value.displayName ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      displayName: optionalText(e.target.value),
                    },
                  })
                }
              />
            </FormField>
            <FormField label="Profile URL">
              <input
                type="url"
                value={edit.value.profileUrl}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, profileUrl: e.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Icon name">
              <input
                value={edit.value.iconName ?? ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      iconName: optionalText(e.target.value),
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
          <StatusToggle
            label="Active"
            checked={edit.value.isActive}
            onChange={(isActive) =>
              setEdit({ ...edit, value: { ...edit.value, isActive } })
            }
          />
          <div className="formActions">
            <button
              className="adminButton secondary"
              type="button"
              onClick={() => setEdit(null)}
            >
              Cancel
            </button>
            <button
              className="adminButton primary"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Link"}
            </button>
          </div>
        </form>
      )}
      <div className="adminTableWrapper">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Display Name</th>
              <th>Profile</th>
              <th>Icon</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>
                  <strong>{link.platform}</strong>
                </td>
                <td>{link.displayName || "—"}</td>
                <td>
                  <a
                    className="tableLink"
                    href={link.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open profile
                  </a>
                </td>
                <td>{link.iconName || "—"}</td>
                <td>{link.displayOrder}</td>
                <td>
                  <span
                    className={`statusPill ${link.isActive ? "active" : "inactive"}`}
                  >
                    {link.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="tableActions">
                    <button
                      className="adminButton secondary"
                      type="button"
                      onClick={() =>
                        setEdit({ id: link.id, value: formValues(link) })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="adminButton danger"
                      type="button"
                      onClick={() => setDeleteId(link.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete social link?"
        message="This social link will be permanently removed."
        busy={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </>
  );
};
