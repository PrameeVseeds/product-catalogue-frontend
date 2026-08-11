import type { AdminSubcategory } from "../../interfaces/catalogueAdmin.interface";
import { getImageUrl } from "../../utils/getImageUrl";
interface Props {
  items: AdminSubcategory[];
  relationshipName: (id: number | null, categoryId: number) => string;
  onEdit: (item: AdminSubcategory) => void;
  onDelete: (id: number) => void;
}
export const SubcategoriesTable = ({
  items,
  relationshipName,
  onEdit,
  onDelete,
}: Props) => (
  <div className="adminTableWrapper">
    <table className="adminTable">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Category - Brand (optional)</th>
          <th>Slug</th>
          <th>Order</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>
              {item.imageUrl ? (
                <img
                  className="tableImage"
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                />
              ) : (
                <span className="emptyCell">No image</span>
              )}
            </td>
            <td>
              <strong>{item.name}</strong>
            </td>
            <td>{relationshipName(item.categoryBrandId, item.categoryId)}</td>
            <td>/{item.slug}</td>
            <td>{item.displayOrder}</td>
            <td>
              <span
                className={`statusPill ${item.isActive ? "active" : "inactive"}`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td>
              <div className="tableActions">
                <button
                  className="adminButton secondary"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="adminButton danger"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
