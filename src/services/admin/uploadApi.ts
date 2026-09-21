import type { UploadType } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { asRecord, getText, unwrapData } from "../responseNormalizers";

const getUploadPath = (response: unknown): string | null => {
  const data = asRecord(unwrapData(response));
  const directPath = getText(
    data,
    "path",
    "url",
    "fileUrl",
    "file_url",
    "datasheetFileUrl",
    "datasheet_file_url",
    "specificationFileUrl",
    "specification_file_url",
  );
  if (directPath) return directPath;

  const file = asRecord(data.file);
  return getText(file, "path", "url", "fileUrl", "file_url");
};

export const uploadApi = {
  async uploadImage(file: File, type: UploadType): Promise<string> {
    const form = new FormData();
    form.append("type", type);
    form.append("image", file);
    const { data } = await apiClient.post<unknown>(
      "/admin/uploads/image",
      form,
    );
    const path = getText(asRecord(unwrapData(data)), "path");
    if (!path) throw new Error("INVALID_UPLOAD_RESPONSE");
    return path;
  },
  async uploadDatasheet(file: File): Promise<string> {
    const form = new FormData();
    form.append("datasheet", file);
    const { data } = await apiClient.post<unknown>(
      "/admin/uploads/datasheet",
      form,
      { timeout: 60_000 },
    );
    const path = getUploadPath(data);
    if (!path) throw new Error("INVALID_UPLOAD_RESPONSE");
    return path;
  },
  async uploadSpecificationPdf(file: File): Promise<string> {
    const form = new FormData();
    form.append("specificationPdf", file);
    const { data } = await apiClient.post<unknown>(
      "/admin/uploads/specification-pdf",
      form,
      { timeout: 60_000 },
    );
    const path = getUploadPath(data);
    if (!path) throw new Error("INVALID_UPLOAD_RESPONSE");
    return path;
  },
};
