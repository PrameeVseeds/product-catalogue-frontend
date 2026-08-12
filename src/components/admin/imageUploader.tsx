import { useEffect, useState } from "react";
import type { UploadType } from "../../interfaces/adminCms.interface";
import { uploadApi } from "../../services/admin/uploadApi";
import { getImageUrl } from "../../utils/getImageUrl";

interface Props {
  label: string;
  value: string | null;
  type: UploadType;
  onChange: (path: string | null) => void;
  required?: boolean;
}
export const ImageUploader = ({ label, value, type, onChange, required = false }: Props) => {
  const [preview, setPreview] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [cacheKey, setCacheKey] = useState(() => Date.now());
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  useEffect(
    () => () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    setPreviewFailed(false);
    setCacheKey(Date.now());
  }, [value]);
  const handleFile = async (file?: File) => {
    if (!file || uploading) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setPreviewFailed(false);
    setError("");
    setUploaded(false);
    setUploading(true);
    try {
      const uploadedPath = await uploadApi.uploadImage(file, type);
      onChange(uploadedPath);
      URL.revokeObjectURL(local);
      setPreview(getImageUrl(uploadedPath));
      setCacheKey(Date.now());
      setPreviewFailed(false);
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
  const displayedImage =
    image && !image.startsWith("blob:")
      ? `${image}${image.includes("?") ? "&" : "?"}preview=${cacheKey}`
      : image;
  const backgroundImage = displayedImage
    ? `url("${displayedImage.replace(/["\\]/g, "\\$&")}")`
    : undefined;
  return (
    <div className="imageUploader">
      <span className="fieldLabel">
        {label}
        {required && <span className="requiredMark" aria-hidden="true"> *</span>}
        {required && <span className="visuallyHidden"> (required)</span>}
      </span>
      <div
        className={`imagePreview${image && !previewFailed ? " hasImage" : ""}`}
        style={image && !previewFailed ? { backgroundImage } : undefined}
        role={image && !previewFailed ? "img" : undefined}
        aria-label={image && !previewFailed ? `${label} preview` : undefined}
      >
        {(!image || previewFailed) && (
          <span>{image ? "Preview unavailable" : "No image selected"}</span>
        )}
        {displayedImage && (
          <img
            className="imagePreviewLoader"
            src={displayedImage}
            alt=""
            aria-hidden="true"
            onLoad={() => {
              setPreviewFailed(false);
              setError("");
            }}
            onError={() => {
              setPreviewFailed(true);
              setError("The saved image preview could not be loaded.");
            }}
          />
        )}
      </div>
      <div className="imageActions">
        <label className="adminButton secondary">
          {uploading ? "Uploading…" : "Choose image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
        </label>
        {value && (
          <button
            className="adminButton textButton"
            type="button"
            onClick={() => {
              onChange(null);
              setPreview("");
              setPreviewFailed(false);
              setUploaded(false);
            }}
          >
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
