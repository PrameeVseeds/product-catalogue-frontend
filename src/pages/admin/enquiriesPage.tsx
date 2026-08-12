import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { EnquiryStatusBadge } from "../../components/admin/enquiryStatusBadge";
import { FormFeedback } from "../../components/admin/formFeedback";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {Enquiry,EnquiryFilters,EnquiryStatus,EnquiryType,} from "../../interfaces/admin/enquiry.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { enquiryApi } from "../../services/admin/enquiryApi";
import { formatDateTime } from "../../utils/formatDateTime";

export const EnquiriesPage = () => {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [enquiryType, setEnquiryType] = useState<EnquiryType | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const filters: EnquiryFilters = {
      page,
      limit: 20,
      ...(status && { status }),
      ...(enquiryType && { enquiryType }),
    };
    try {
      const result = await enquiryApi.getEnquiries(filters);
      setItems(result.items);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    } catch (reason) {
      setError(getAdminApiError(reason, "Unable to load enquiries."));
    } finally {
      setLoading(false);
    }
  }, [status, enquiryType, page]);
  useEffect(() => {
    void load();
  }, [load]);
  const changeStatus = (value: EnquiryStatus | "") => {
    setStatus(value);
    setPage(1);
  };
  const changeType = (value: EnquiryType | "") => {
    setEnquiryType(value);
    setPage(1);
  };
  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description={`${total} customer enquiries`}
      />
      <FormFeedback error={error} />
      <div className="adminPanel enquiryFilters">
        <label>
          Status
          <select
            value={status}
            onChange={(event) =>
              changeStatus(event.target.value as EnquiryStatus | "")
            }
          >
            <option value="">All</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CONTACTED">Contacted</option>
            <option value="CLOSED">Closed</option>
          </select>
        </label>
        <label>
          Enquiry Type
          <select
            value={enquiryType}
            onChange={(event) =>
              changeType(event.target.value as EnquiryType | "")
            }
          >
            <option value="">All</option>
            <option value="GENERAL">General</option>
            <option value="PRODUCT">Product</option>
          </select>
        </label>
      </div>
      {loading ? (
        <div className="enquiryLoading">
          <LoadingSpinner />
        </div>
      ) : items.length === 0 ? (
        <div className="adminPanel emptyState">No enquiries found.</div>
      ) : (
        <div className="adminTableWrapper">
          <table className="adminTable enquiryTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Subject</th>
                <th>Product</th>
                <th>Status</th>
                <th>Received</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>
                    {item.enquiryType === "PRODUCT" ? "Product" : "General"}
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.email}</small>
                  </td>
                  <td>{item.phone || "-"}</td>
                  <td>{item.subject || "-"}</td>
                  <td>
                    {item.enquiryType === "PRODUCT" ? "Product enquiry" : "-"}
                  </td>
                  <td>
                    <EnquiryStatusBadge status={item.status} />
                  </td>
                  <td>{formatDateTime(item.createdAt)}</td>
                  <td>
                    <Link
                      className="tableViewAction"
                      to={`/admin/enquiries/${item.id}`}
                      aria-label={`View enquiry ${item.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="paginationControls">
        <button
          className="adminButton secondary"
          disabled={loading || page <= 1}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          className="adminButton secondary"
          disabled={loading || page >= totalPages}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
};
