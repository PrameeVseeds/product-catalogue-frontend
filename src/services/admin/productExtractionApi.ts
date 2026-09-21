import type { ProductExtractionResult } from "../../interfaces/catalogueAdmin.interface";
import { apiClient } from "../apiClient";
import { asArray, asRecord, getText, unwrapData } from "../responseNormalizers";

const stringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : [];

const extractionResult = (value: unknown): ProductExtractionResult => {
  const record = asRecord(unwrapData(value));
  const specifications = asArray(record.specifications)
    .map(asRecord)
    .map((item) => ({
      name: getText(item, "name") ?? "",
      value: getText(item, "value") ?? "",
      unit: getText(item, "unit"),
    }))
    .filter((item) => item.name && item.value);

  return {
    productName: getText(record, "productName"),
    modelNumber: getText(record, "modelNumber"),
    brand: getText(record, "brand"),
    description: getText(record, "description"),
    features: stringArray(record.features),
    specifications,
    warnings: stringArray(record.warnings),
  };
};

export const productExtractionApi = {
  async extract(specificationFileUrl: string): Promise<ProductExtractionResult> {
    const { data } = await apiClient.post<unknown>(
      "/admin/products/extract-specifications",
      { specificationFileUrl },
      { timeout: 60_000 },
    );
    return extractionResult(data);
  },
};
