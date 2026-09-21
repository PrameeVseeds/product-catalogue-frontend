import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { getApiErrorMessage } from "../../services/apiClient";
import { uploadApi } from "../../services/admin/uploadApi";
import { getImageUrl } from "../../utils/getImageUrl";

interface DatasheetUploaderProps {
  value: string | null;
  onChange: (path: string | null) => void;
  type: "datasheet" | "specification";
  extracting?: boolean;
  onExtract?: () => void;
}

const getFilename = (value: string) =>
  decodeURIComponent(value.split("/").pop() || "datasheet.pdf");

export const DatasheetUploader = ({
  value,
  onChange,
  type,
  extracting,
  onExtract,
}: DatasheetUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const pdfLabel = type === "datasheet" ? "Datasheet" : "Specification";

  const handleFile = async (file?: File) => {
    if (!file || uploading) return;
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Choose a valid PDF file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(`${pdfLabel} PDF must be 10 MB or smaller.`);
      return;
    }
    setUploading(true);
    setUploaded(false);
    setError("");
    try {
      onChange(type === "datasheet" ? await uploadApi.uploadDatasheet(file) : await uploadApi.uploadSpecificationPdf(file));
      setUploaded(true);
    } catch (reason) {
      const message = getApiErrorMessage(reason);
      setError(
        message === "Something went wrong while loading the content."
          ? `${pdfLabel} PDF upload failed. Please use a PDF up to 10 MB.`
          : message,
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="datasheetUploader">
      <span className="fieldLabel">Upload {pdfLabel} PDF</span>
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
            View Current {pdfLabel} PDF
          </a>
        </div>
      ) : (
        <p className="fieldHint">
          {type === "datasheet" ? "No custom datasheet uploaded. The generated datasheet will be used." : "No specification PDF uploaded for automatic extraction."}
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
        {value && type === "specification" && onExtract && (
          <button className="adminButton primary" type="button" disabled={uploading || extracting} onClick={onExtract}>
            {extracting ? "Extracting specifications…" : "Extract specifications"}
          </button>
        )}
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
      {uploaded && <span className="uploadSuccess" role="status">{pdfLabel} PDF uploaded successfully.</span>}
      {error && <span className="fieldError">{error}</span>}
      {type === "datasheet" && <p className="fieldHint datasheetFallbackHint">If no PDF is uploaded, the system will automatically generate a datasheet using the product information, features and specifications.</p>}
    </div>
  );
};
