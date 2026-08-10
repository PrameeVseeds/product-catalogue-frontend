import { Link } from "react-router-dom";
import type { AdminProduct } from "../../interfaces/catalogueAdmin.interface";
import { getImageUrl } from "../../utils/getImageUrl";
interface Props {
  items: AdminProduct[];
  brandName: (item: AdminProduct) => string;
  subcategoryName: (item: AdminProduct) => string;
  onEdit: (item: AdminProduct) => void;
  onDelete: (id: number) => void;
}
export const ProductsTable = ({
  items,
  brandName,
  subcategoryName,
  onEdit,
  onDelete,
}: Props) => (
  <div className="adminTableWrapper">
    <table className="adminTable productTable">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Model</th>
          <th>Brand</th>
          <th>Subcategory</th>
          <th>Featured</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>
              {item.mainImageUrl ? (
                <img
                  className="tableImage"
                  src={getImageUrl(item.mainImageUrl)}
                  alt={item.name}
                />
              ) : (
                <span className="emptyCell">No image</span>
              )}
            </td>
            <td>
              <strong>{item.name}</strong>
              <small>/{item.slug}</small>
            </td>
            <td>{item.modelNumber || "—"}</td>
            <td>{brandName(item)}</td>
            <td>{subcategoryName(item)}</td>
            <td>{item.isFeatured ? "Yes" : "No"}</td>
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
                <Link
                  className="adminButton secondary"
                  to={`/admin/products/${item.id}/manage`}
                >
                  Manage
                </Link>
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
