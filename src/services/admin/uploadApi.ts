import type { UploadType } from "../../interfaces/adminCms.interface";
import { apiClient } from "../apiClient";
import { asRecord, getText, unwrapData } from "../responseNormalizers";
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
};
