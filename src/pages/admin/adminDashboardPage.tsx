import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  ContactRound,
  LayoutTemplate,
  MessageSquare,
  Package,
  Tags,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { FormFeedback } from "../../components/admin/formFeedback";
import type {
  Enquiry,
  EnquiryStatus,
} from "../../interfaces/admin/enquiry.interface";
import type { AdminProduct } from "../../interfaces/catalogueAdmin.interface";
import { brandAdminApi } from "../../services/admin/brandAdminApi";
import { categoryAdminApi } from "../../services/admin/categoryAdminApi";
import { enquiryApi } from "../../services/admin/enquiryApi";
import { productAdminApi } from "../../services/admin/productAdminApi";
import { formatDateTime } from "../../utils/formatDateTime";

const quickLinks = [
  {
    label: "Products",
    description: "Manage catalogue products",
    to: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    description: "Organize the product catalogue",
    to: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Home Content",
    description: "Manage public homepage sections",
    to: "/admin/home-sections",
    icon: LayoutTemplate,
  },
  {
    label: "Enquiries",
    description: "Review customer enquiries",
    to: "/admin/enquiries",
    icon: MessageSquare,
  },
  {
    label: "Contact Settings",
    description: "Update public contact information",
    to: "/admin/contact",
    icon: ContactRound,
  },
] as const;

const enquiryStatuses: EnquiryStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "CLOSED",
];

const statusLabels: Record<EnquiryStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  CONTACTED: "Contacted",
  CLOSED: "Closed",
};

export const AdminDashboardPage = () => {
  const { admin } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [enquiryTotal, setEnquiryTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const loadDashboard = async () => {
      setLoading(true);
      const results = await Promise.allSettled([
        productAdminApi.getAll(),
        categoryAdminApi.getAll(),
        brandAdminApi.getAll(),
        enquiryApi.getEnquiries({ page: 1, limit: 100 }),
      ]);
      if (cancelled) return;

      if (results[0].status === "fulfilled") setProducts(results[0].value);
      if (results[1].status === "fulfilled") {
        setCategoryCount(
          results[1].value.filter((item) => item.isActive).length,
        );
      }
      if (results[2].status === "fulfilled") {
        setBrandCount(results[2].value.filter((item) => item.isActive).length);
      }
      if (results[3].status === "fulfilled") {
        setEnquiries(results[3].value.items);
        setEnquiryTotal(results[3].value.pagination.total);
      }

      setError(
        results.some((result) => result.status === "rejected")
          ? "Some dashboard data could not be loaded. Refresh the page to try again."
          : "",
      );
      setLoading(false);
    };
    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeProducts = products.filter((product) => product.isActive).length;
  const featuredProducts = products.filter(
    (product) => product.isFeatured,
  ).length;
  const productCoverage = products.length
    ? Math.round((activeProducts / products.length) * 100)
    : 0;
  const statusCounts = useMemo(
    () =>
      enquiries.reduce<Record<EnquiryStatus, number>>(
        (counts, enquiry) => ({
          ...counts,
          [enquiry.status]: counts[enquiry.status] + 1,
        }),
        { NEW: 0, IN_PROGRESS: 0, CONTACTED: 0, CLOSED: 0 },
      ),
    [enquiries],
  );
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1);
  const recentEnquiries = [...enquiries]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <section className="adminDashboard">
      <header className="adminPageHeader">
        <p>Dashboard</p>
        <h1>Welcome, {admin?.name}</h1>
        <span>Choose an area below to manage your catalogue and website.</span>
      </header>
      <FormFeedback error={error} />

      <section className="adminKpiGrid" aria-label="Catalogue overview">
        <article className="adminKpiCard">
          <span className="adminKpiIcon">
            <Package aria-hidden="true" />
          </span>
          <div>
            <span>Total products</span>
            <strong>{loading ? "—" : products.length}</strong>
          </div>
          <small>
            {loading ? "Loading data" : `${activeProducts} currently active`}
          </small>
        </article>
        <article className="adminKpiCard">
          <span className="adminKpiIcon">
            <Tags aria-hidden="true" />
          </span>
          <div>
            <span>Active categories</span>
            <strong>{loading ? "—" : categoryCount}</strong>
          </div>
          <small>
            {loading ? "Loading data" : `${brandCount} active brands`}
          </small>
        </article>
        <article className="adminKpiCard">
          <span className="adminKpiIcon">
            <UsersRound aria-hidden="true" />
          </span>
          <div>
            <span>Customer enquiries</span>
            <strong>{loading ? "—" : enquiryTotal}</strong>
          </div>
          <small>
            {loading
              ? "Loading data"
              : `${statusCounts.NEW} awaiting a response`}
          </small>
        </article>
        <article className="adminKpiCard">
          <span className="adminKpiIcon">
            <BarChart3 aria-hidden="true" />
          </span>
          <div>
            <span>Featured products</span>
            <strong>{loading ? "—" : featuredProducts}</strong>
          </div>
          <small>
            {loading
              ? "Loading data"
              : `${productCoverage}% of products are live`}
          </small>
        </article>
      </section>

      <section
        className="adminDashboardInsights"
        aria-label="Dashboard insights"
      >
        <article className="adminPanel adminChartPanel">
          <div className="adminPanelHeading">
            <div>
              <h2>Catalogue health</h2>
              <p>Published products and content coverage.</p>
            </div>
            <Link to="/admin/products">
              Manage products <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="adminProgressList">
            <div>
              <span>Active products</span>
              <strong>
                {activeProducts} / {products.length}
              </strong>
            </div>
            <div className="adminProgressTrack">
              <span style={{ width: `${productCoverage}%` }} />
            </div>
            <div>
              <span>Featured products</span>
              <strong>
                {featuredProducts} / {products.length}
              </strong>
            </div>
            <div className="adminProgressTrack">
              <span
                style={{
                  width: `${products.length ? Math.round((featuredProducts / products.length) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        </article>
        <article className="adminPanel adminChartPanel">
          <div className="adminPanelHeading">
            <div>
              <h2>Enquiry pipeline</h2>
              <p>Breakdown of the latest {enquiries.length} enquiries.</p>
            </div>
            <Link to="/admin/enquiries">
              View enquiries <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="adminBarChart">
            {enquiryStatuses.map((status) => (
              <div className="adminBarRow" key={status}>
                <span>{statusLabels[status]}</span>
                <div className="adminBarTrack">
                  <span
                    style={{
                      width: `${(statusCounts[status] / maxStatusCount) * 100}%`,
                    }}
                  />
                </div>
                <strong>{statusCounts[status]}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="adminPanel adminRecentEnquiries">
        <div className="adminPanelHeading">
          <div>
            <h2>Recent enquiries</h2>
            <p>Latest messages received from your website.</p>
          </div>
          <Link to="/admin/enquiries">
            See all <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <p className="adminEmptyState">Loading recent enquiries…</p>
        ) : recentEnquiries.length ? (
          <div className="adminRecentList">
            {recentEnquiries.map((enquiry) => (
              <Link key={enquiry.id} to={`/admin/enquiries/${enquiry.id}`}>
                <span className="adminRecentAvatar" aria-hidden="true">
                  {enquiry.name.charAt(0).toUpperCase() || "?"}
                </span>
                <span>
                  <strong>{enquiry.name}</strong>
                  <small>
                    {enquiry.subject ||
                      (enquiry.enquiryType === "PRODUCT"
                        ? "Product enquiry"
                        : "General enquiry")}
                  </small>
                </span>
                <time dateTime={enquiry.createdAt}>
                  {formatDateTime(enquiry.createdAt)}
                </time>
              </Link>
            ))}
          </div>
        ) : (
          <p className="adminEmptyState">
            No enquiries yet. New messages will appear here.
          </p>
        )}
      </section>

      <h2 className="adminQuickLinksHeading">Quick actions</h2>
      <div className="adminQuickGrid">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.to} to={link.to}>
              <span className="adminQuickLinkIcon" aria-hidden="true">
                <Icon />
              </span>
              <span className="adminQuickLinkContent">
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </span>
              <ArrowUpRight
                className="adminQuickLinkArrow"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};
