import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { ConfirmDialog } from "../../components/admin/confirmDialog";
import { FormFeedback } from "../../components/admin/formFeedback";
import { FormField } from "../../components/admin/formField";
import { SocialPlatformPicker } from "../../components/admin/socialPlatformPicker";
import { StatusToggle } from "../../components/admin/statusToggle";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import {
  getSocialPlatform,
  normalizeSocialPlatform,
} from "../../config/socialPlatformConfig";
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

const formValues = (link: AdminSocialMedia): SocialMediaForm => ({
  platform: normalizeSocialPlatform(link.platform) ?? link.platform,
  displayName: link.displayName,
  profileUrl: link.profileUrl,
  iconName: link.iconName,
  displayOrder: link.displayOrder,
  isActive: link.isActive,
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
    const platform = normalizeSocialPlatform(edit.value.platform);
    if (!platform) {
      setError("Choose a supported social platform.");
      return;
    }
    if (!isHttpUrl(edit.value.profileUrl)) {
      setError("Enter a valid HTTP or HTTPS profile URL.");
      return;
    }
    const selected = getSocialPlatform(platform);
    const value: SocialMediaForm = {
      ...edit.value,
      platform,
      displayName: edit.value.displayName || selected?.label || null,
      iconName: platform,
    };
    setSaving(true);
    setError("");
    try {
      if (edit.id) await socialMediaApi.update(edit.id, value);
      else await socialMediaApi.create(value);
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
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <div className="formGrid">
            <FormField label="Platform / Icon" required>
              <SocialPlatformPicker
                value={edit.value.platform}
                onChange={(platform) => {
                  const option = getSocialPlatform(platform);
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      platform,
                      iconName: platform,
                      displayName:
                        edit.value.displayName || option?.label || null,
                    },
                  });
                }}
              />
            </FormField>
            <FormField label="Display name">
              <input
                value={edit.value.displayName ?? ""}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      displayName: optionalText(event.target.value),
                    },
                  })
                }
              />
            </FormField>
            <FormField label="Profile URL" required>
              <input
                type="url"
                value={edit.value.profileUrl}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    value: { ...edit.value, profileUrl: event.target.value },
                  })
                }
              />
            </FormField>
            <FormField label="Display order">
              <input
                type="number"
                value={edit.value.displayOrder}
                onChange={(event) =>
                  setEdit({
                    ...edit,
                    value: {
                      ...edit.value,
                      displayOrder: Number(event.target.value),
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
        <table className="adminTable socialMediaTable">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Profile</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const platform = getSocialPlatform(link.platform);
              const PlatformIcon = platform?.icon;
              return (
                <tr key={link.id}>
                  <td>
                    <span className="adminSocialPlatform">
                      {platform && PlatformIcon && (
                        <span
                          className="socialPlatformIcon"
                          style={{
                            backgroundColor: platform.brandColor,
                            color: platform.iconColor,
                          }}
                        >
                          <PlatformIcon aria-hidden="true" />
                        </span>
                      )}
                      <strong>
                        {link.displayName || platform?.label || link.platform}
                      </strong>
                    </span>
                  </td>
                  <td>
                    <a
                      className="tableLink socialProfileUrl"
                      href={link.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.profileUrl}
                    </a>
                  </td>
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
                        aria-label={`Edit ${link.displayName || link.platform}`}
                        onClick={() =>
                          setEdit({ id: link.id, value: formValues(link) })
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="adminButton danger"
                        type="button"
                        aria-label={`Delete ${link.displayName || link.platform}`}
                        onClick={() => setDeleteId(link.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
