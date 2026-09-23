export const getProductModels = (modelNumber?: string | null) =>
  (modelNumber ?? "")
    .split(/\r?\n|,/)
    .map((model) => model.trim())
    .filter(Boolean);

export const serialiseProductModels = (models: string[]) => {
  const value = models.map((model) => model.trim()).filter(Boolean).join("\n");
  return value || null;
};
