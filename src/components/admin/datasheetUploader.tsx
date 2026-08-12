import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { getApiErrorMessage } from "../../services/apiClient";
import { uploadApi } from "../../services/admin/uploadApi";
import { getImageUrl } from "../../utils/getImageUrl";

interface DatasheetUploaderProps {
  value: string | null;
  onChange: (path: string | null) => void;
}

const getFilename = (value: string) =>
  decodeURIComponent(value.split("/").pop() || "datasheet.pdf");

export const DatasheetUploader = ({
  value,
  onChange,
}: DatasheetUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file || uploading) return;
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a valid PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Datasheet PDF must not exceed 10 MB.");
      return;
    }
    setUploading(true);
    setUploaded(false);
    setError("");
    try {
      onChange(await uploadApi.uploadDatasheet(file));
      setUploaded(true);
    } catch (reason) {
      const message = getApiErrorMessage(reason);
      setError(
        message === "Something went wrong while loading the content."
          ? "Datasheet upload failed. Please use a PDF up to 10 MB."
          : message,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="datasheetUploader">
      <span className="fieldLabel">Upload Datasheet PDF</span>
      {value ? (
        <div className="currentDatasheet">
          <FileText aria-hidden="true" />
          <span>{getFilename(value)}</span>
          <a
            className="adminButton secondary"
            href={getImageUrl(value)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Current Datasheet
          </a>
        </div>
      ) : (
        <p className="fieldHint">
          No custom datasheet uploaded. The generated datasheet will be used.
        </p>
      )}
      <div className="imageActions">
        <label className="adminButton secondary">
          <Upload aria-hidden="true" />
          {uploading ? "Uploading…" : value ? "Replace PDF" : "Choose PDF"}
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={uploading}
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {value && (
          <button
            className="adminButton textButton"
            type="button"
            disabled={uploading}
            onClick={() => {
              onChange(null);
              setUploaded(false);
              setError("");
            }}
          >
            Remove
          </button>
        )}
      </div>
      {uploaded && <span className="uploadSuccess" role="status">PDF uploaded. Save the product to use it.</span>}
      {error && <span className="fieldError">{error}</span>}
      <p className="fieldHint datasheetFallbackHint">
        If no PDF is uploaded, the system will automatically generate a
        datasheet using the product information, features and specifications.
      </p>
    </div>
  );
};
