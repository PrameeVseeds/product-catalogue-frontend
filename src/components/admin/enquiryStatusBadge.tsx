import type { EnquiryStatus } from "../../interfaces/admin/enquiry.interface";
const labels: Record<EnquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};
export const EnquiryStatusBadge = ({ status }: { status: EnquiryStatus }) => (
  <span className={`enquiryStatus enquiryStatus${status}`}>
    {labels[status]}
  </span>
);
