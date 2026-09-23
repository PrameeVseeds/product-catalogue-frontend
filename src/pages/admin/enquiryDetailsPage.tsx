import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminPageHeader";
import { EnquiryStatusBadge } from "../../components/admin/enquiryStatusBadge";
import { FormFeedback } from "../../components/admin/formFeedback";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import type {EnquiryDetail,EnquiryStatus,} from "../../interfaces/admin/enquiry.interface";
import { getAdminApiError } from "../../services/admin/adminApiError";
import { enquiryApi } from "../../services/admin/enquiryApi";
import { formatDateTime } from "../../utils/formatDateTime";

const emailCustomerHref = (enquiry: EnquiryDetail) => {
  const topic = enquiry.productName
    ? `your enquiry about ${enquiry.productName}`
    : "your enquiry";
  const originalSubject = enquiry.subject || "Website enquiry";
  const body = [
    `Hello ${enquiry.name},`,
    "",
    `Thank you for contacting SEEDS PVT LTD regarding ${topic}.`,
    "",
    "[Write your response here]",
    "",
    "Kind regards,",
    "SEEDS PVT LTD",
    "",
    "--- Original enquiry ---",
    `Subject: ${originalSubject}`,
    enquiry.message,
  ].join("\n");
  return `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(`Re: ${originalSubject}`)}&body=${encodeURIComponent(body)}`;
};

export const EnquiryDetailsPage = () => {
  const { id } = useParams();
  const enquiryId = Number(id);
  const [enquiry, setEnquiry] = useState<EnquiryDetail | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>("NEW");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const load = useCallback(async () => {
    if (!Number.isInteger(enquiryId) || enquiryId <= 0) {
      setFeedback({ error: "Enquiry ID is invalid.", success: "" });
      setLoading(false);
      return;
    }
    try {
      const result = await enquiryApi.getEnquiryById(enquiryId);
      setEnquiry(result);
      setSelectedStatus(result.status);
    } catch (reason) {
      setFeedback({
        error: getAdminApiError(reason, "Unable to load enquiry."),
        success: "",
      });
    } finally {
      setLoading(false);
    }
  }, [enquiryId]);
  useEffect(() => {
    void load();
  }, [load]);
  const updateStatus = async () => {
    if (!enquiry || saving || selectedStatus === enquiry.status) return;
    setSaving(true);
    setFeedback({ error: "", success: "" });
    try {
      const updated = await enquiryApi.updateEnquiryStatus(
        enquiry.id,
        selectedStatus,
      );
      setEnquiry(updated);
      setSelectedStatus(updated.status);
      setFeedback({
        error: "",
        success: "Enquiry status updated successfully.",
      });
    } catch (reason) {
      setFeedback({
        error: getAdminApiError(reason, "Unable to update enquiry status."),
        success: "",
      });
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (!enquiry) return <FormFeedback error={feedback.error} />;
  const phoneHref = enquiry.phone?.replace(/[^+\d]/g, "");
  const emailHref = emailCustomerHref(enquiry);
  return (
    <>
      <AdminPageHeader
        title={`Enquiry #${enquiry.id}`}
        description="Review the original customer enquiry and update its status."
        action={
          <Link className="adminButton secondary backButton" to="/admin/enquiries">
            <ArrowLeft aria-hidden="true" />
            Back to Enquiries
          </Link>
        }
      />
      <FormFeedback {...feedback} />
      <div className="enquiryDetailsGrid">
        <section className="adminPanel detailSection">
          <h2>Enquiry</h2>
          <dl className="detailList">
            <div>
              <dt>ID</dt>
              <dd>#{enquiry.id}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>
                {enquiry.enquiryType === "PRODUCT" ? "Product" : "General"}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <EnquiryStatusBadge status={enquiry.status} />
              </dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{formatDateTime(enquiry.createdAt)}</dd>
            </div>
          </dl>
        </section>
        <section className="adminPanel detailSection">
          <h2>Customer</h2>
          <dl className="detailList">
            <div>
              <dt>Name</dt>
              <dd>{enquiry.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{enquiry.email}</dd>
            </div>
            {enquiry.phone && (
              <div>
                <dt>Phone</dt>
                <dd>{enquiry.phone}</dd>
              </div>
            )}
          </dl>
          <div className="customerActions">
            <a
              className="adminButton secondary"
              href={emailHref}
            >
              Email Customer
            </a>
            {phoneHref && (
              <a className="adminButton secondary" href={`tel:${phoneHref}`}>
                Call Customer
              </a>
            )}
          </div>
        </section>
      </div>
      <section className="adminPanel detailSection">
        <h2>Message</h2>
        {enquiry.subject && <h3>{enquiry.subject}</h3>}
        <p className="enquiryMessage">{enquiry.message}</p>
      </section>
      {enquiry.enquiryType === "PRODUCT" && enquiry.productName && (
        <section className="adminPanel detailSection">
          <h2>Product</h2>
          <h3>{enquiry.productName}</h3>
          {enquiry.modelNumber && <p>Model: {enquiry.modelNumber}</p>}
          <div className="listActions">
            {enquiry.productSlug && (
              <Link
                className="adminButton secondary"
                to={`/products/${enquiry.productSlug}`}
                target="_blank"
              >
                Open Product
              </Link>
            )}
            {enquiry.productId && (
              <Link
                className="adminButton secondary"
                to={`/admin/products/${enquiry.productId}/manage`}
              >
                Manage Product
              </Link>
            )}
          </div>
        </section>
      )}
      <section className="adminPanel detailSection statusEditor">
        <h2>Update Status</h2>
        <label htmlFor="enquiry-status">Status</label>
        <select
          id="enquiry-status"
          value={selectedStatus}
          onChange={(event) =>
            setSelectedStatus(event.target.value as EnquiryStatus)
          }
        >
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button
          className="adminButton primary"
          type="button"
          disabled={saving || selectedStatus === enquiry.status}
          onClick={() => void updateStatus()}
        >
          {saving ? "Updating…" : "Update Status"}
        </button>
      </section>
    </>
  );
};
