import { useEffect, useState } from "react";
import type { UploadType } from "../../interfaces/adminCms.interface";
import { uploadApi } from "../../services/admin/uploadApi";
import { getImageUrl } from "../../utils/getImageUrl";

interface Props {
  label: string;
  value: string | null;
  type: UploadType;
  onChange: (path: string | null) => void;
}
export const ImageUploader = ({ label, value, type, onChange }: Props) => {
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const handleFile = async (file?: File) => {
    if (!file || uploading) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setError("");
    setUploaded(false);
    setUploading(true);
    try {
      onChange(await uploadApi.uploadImage(file, type));
      setUploaded(true);
    } catch {
      URL.revokeObjectURL(local);
      setPreview("");
      setError(
        "Image upload failed. Please use a JPG, PNG or WebP image up to 5 MB.",
      );
    } finally {
      setUploading(false);
    }
  };
  const image = preview || getImageUrl(value);
  return (
    <div className="imageUploader">
      <span className="fieldLabel">{label}</span>
      {image && <img src={image} alt={`${label} preview`} />}
      <div className="imageActions">
        <label className="adminButton secondary">
          {uploading ? "Uploading…" : "Choose image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}/>
        </label>
        {value && (
          <button
            className="adminButton textButton"
            type="button"
            onClick={() => {
              onChange(null);
              setPreview("");
              setUploaded(false);
            }}>
            Remove
          </button>
        )}
      </div>
      {uploaded && (
        <span className="uploadSuccess" role="status">
          Image uploaded. Save changes to use it.
        </span>
      )}
      {error && <span className="fieldError">{error}</span>}
    </div>
  );
};
