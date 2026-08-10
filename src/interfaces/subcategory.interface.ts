export interface SubcategorySummary {
  id: number;
  categoryBrandId: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
}
