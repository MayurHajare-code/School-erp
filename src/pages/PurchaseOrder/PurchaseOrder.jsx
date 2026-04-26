import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiSelector,
  HiChevronUp,
  HiChevronDown,
} from "react-icons/hi";
import "../../styles/ListPage.css";
import usePagination from "../../hooks/usePagination";
import { FiDownload } from "react-icons/fi";

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ================= DOWNLOAD REPORT =================


  const handleDownloadReport = async () => {
    try {
      const params = new URLSearchParams();

      if (filters.status) params.append("status", filters.status);
      if (filters.dateFrom) params.append("fromDate", filters.dateFrom);
      if (filters.dateTo) params.append("toDate", filters.dateTo);

      const response = await axiosInstance.get(
        `/reports/purchaseOrderReport?${params.toString()}`,
        { responseType: "blob" }
      );

      // Try to grab filename from Content-Disposition header, fallback to default
      const disposition = response.headers["content-disposition"];
      const filename = disposition
        ? disposition.split("filename=")[1].replace(/"/g, "")
        : "po-report.xlsx";

      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report");
    }
  };
  
  // ================= FETCH DATA =================

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/purchase-orders/all");
      console.log(res.data);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch PO");
      toast.error("Failed to fetch PO");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      await axiosInstance.delete(`/purchase-orders/delete/${id}`);
      toast.success("Deleted");
      fetchOrders();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= SORTING =================

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <HiSelector className="sort-icon-neutral" />;
    }
    return sortConfig.direction === "asc" ? (
      <HiChevronUp className="sort-icon-active" />
    ) : (
      <HiChevronDown className="sort-icon-active" />
    );
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue;
    let bValue;

    if (sortConfig.key === "vendor") {
      aValue = a.vendor?.name;
      bValue = b.vendor?.name;
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }

    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    } else {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

    return 0;
  });

  // ================= FILTERS =================

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    });
    setSearchInput("");
  };

  const isFilterActive =
    filters.search !== "" ||
    filters.status !== "" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const filteredOrders = sortedOrders.filter((order) => {
    const query = filters.search.toLowerCase();

    const matchesSearch =
      order.poNumber?.toLowerCase().includes(query) ||
      order.vendor?.name?.toLowerCase().includes(query);

    const matchesStatus =
      filters.status === "" || order.status === filters.status;

    // ✅ Date range filter
    const itemDate = order.createdAt ? new Date(order.createdAt) : null;
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;

    if (to) to.setHours(23, 59, 59, 999); // include the full "to" day

    const matchesDateFrom = !from || !itemDate || itemDate >= from;
    const matchesDateTo = !to || !itemDate || itemDate <= to;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  // ================= PAGINATION =================

  const {
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems,
  } = usePagination(filteredOrders);

  // ================= UI =================

  return (
    <div className="module-page">
      <div className="module-header">
        <h2>Purchase Orders</h2>

        <div>
          <button
            type="button"
            className="primary-btn"
            onClick={handleDownloadReport}
          >
            <FiDownload /> Download Report
          </button>

          {["STORE_MANAGER"].includes(user.role) && (
            <button
              className="primary-btn"
              onClick={() => navigate("/app/add-purchase-order")}
            >
              <span>+</span> Add PO
            </button>
          )}
        </div>

      </div>

      {/* ================= FILTER SECTION ================= */}

      <div className="filter-container">
        <div className="filter-card">


          <div className="filter-requirements-grid">
            <div className="filter-group">
              <div className="filter-field">
                <label>Status filter</label>
                <select
                  name="status"
                  className="filter-dropdown"
                  value={filters.status}
                  onChange={handleFilterChange}
                  style={{ width: "200px" }}
                >
                  <option value="">All Status</option>

                  <option value="DRAFT">Draft</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="filter-field">
                  <label>Report date range</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="date"
                      name="dateFrom"
                      className="filter-date-input"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                    />
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>to</span>
                    <input
                      type="date"
                      name="dateTo"
                      className="filter-date-input"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>
            </div>



            <div className="filter-group">
              <div className="filter-field">
                <label>What are you looking for?</label>
                <input
                  className="search-bar"
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by Purchase Order..."
                />
              </div>

              <div>
                {isFilterActive && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ================= PAGINATION INFO ================= */}

      <div className="pagination-container">
        <div className="pagination-info">
          <span>
            Showing {filteredOrders.length === 0 ? 0 : indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, filteredOrders.length)} of{" "}
            {filteredOrders.length} records
          </span>
        </div>

        <div className="pagination-controls">
          <div className="records-per-page">
            <label>Records per page: </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th
                className={sortConfig.key === "poNumber" ? "active-sort" : ""}
                onClick={() => handleSort("poNumber")}
              >
                <div className="th-content">
                  PO No {renderSortIcon("poNumber")}
                </div>
              </th>

              <th
                className={sortConfig.key === "vendor" ? "active-sort" : ""}
                onClick={() => handleSort("vendor")}
              >
                <div className="th-content">
                  Vendor Name {renderSortIcon("vendor")}
                </div>
              </th>

              <th
                className={sortConfig.key === "status" ? "active-sort" : ""}
                onClick={() => handleSort("status")}
              >
                <div className="th-content">
                  Status {renderSortIcon("status")}
                </div>
              </th>

              <th
                className={
                  sortConfig.key === "totalAmount" ? "active-sort" : ""
                }
                onClick={() => handleSort("totalAmount")}
              >
                <div className="th-content">
                  Total {renderSortIcon("totalAmount")}
                </div>
              </th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading POs...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((po) => (
                <tr key={po.id}>
                  <td>{po.poNumber}</td>
                  <td>{po.vendor?.name || "N/A"}</td>
                  <td>{po.status}</td>
                  <td>{po.totalAmount}</td>

                  <td>
                    <button
                      className="action-btn review-btn"
                      title="View Item"
                      onClick={() =>
                        navigate(`/app/view-purchase-order/${po.id}`)
                      }
                    >
                      {/* View */}
                      <HiOutlineEye />
                    </button>

                    {user?.role === "STORE_MANAGER" && po.status === "DRAFT" && (
                      <button
                        className="edit-btn action-btn"
                        title="Edit Item"
                        onClick={() =>
                          navigate(`/app/edit-purchase-order/${po.id}`)
                        }
                      >
                        {/* Edit */}
                        <HiOutlinePencil />
                      </button>
                    )}
                    {user?.role === "STORE_MANAGER" && po.status !== "APPROVED" && po.status !== "SUBMITTED" && (
                      <button
                        className="action-btn delete-btn"
                        title="Delete Item"
                        onClick={() => handleDelete(po.id)}
                      >
                        {/* Delete */}
                        <HiOutlineTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No PO Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="pagination-container">
        <div className="pagination-buttons">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span className="page-number">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrder;
