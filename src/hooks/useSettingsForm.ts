import { useEffect, useState } from "react";
import { getAdminApiError } from "../services/admin/adminApiError";

export const useSettingsForm = <T>(loader: () => Promise<T>,updater: (value: T) => Promise<T>,) => {
  const [form, setForm] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    let active = true;
    loader()
      .then((data) => {
        if (active) setForm(data);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(getAdminApiError(reason, "Unable to load settings."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loader]);
  const save = async (validate: (value: T) => string | null) => {
    if (!form || saving) return;
    const validation = validate(form);
    setError(validation ?? "");
    setSuccess("");
    if (validation) return;
    setSaving(true);
    try {
      const saved = await updater(form);
      setForm(saved);
      setSuccess("Changes saved successfully.");
    } catch (reason: unknown) {
      setError(getAdminApiError(reason, "Unable to save changes."));
    } finally {
      setSaving(false);
    }
  };
  return { form, setForm, loading, saving, error, success, save };
};
