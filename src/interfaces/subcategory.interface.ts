export interface SubcategorySummary {
  id: number;
  categoryId: number;
  categoryBrandId: number | null;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}
