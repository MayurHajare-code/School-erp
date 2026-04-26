import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import usePagination from "../../hooks/usePagination";
import { FiDownload } from "react-icons/fi";
import useSort from "../../hooks/useSort";
import Pagination from "../../components/Pagination";

const VendorLists = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ==============================
       SORTING
    ============================== */

  const { sortConfig, handleSort, renderSortIcon, sortedData } = useSort(vendors);

  // ================= DOWNLOAD REPORT =================

  const handleDownloadReport = () => {
    // trigger your export/download logic here
    // e.g. exportToCSV({ ...filters })
  };

  /* ==============================
       FILTERS
    ============================== */

  const [filters, setFilters] = useState({
    search: "",
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
    });
    setCurrentPage(1);
  };

  const isFilterActive = filters.search !== "";

  // ================= FETCH DATA =================

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/vendor/all");
      setVendors(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vendor?",
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/vendor/${id}`);
      setVendors((prev) => prev.filter((v) => v.id !== id));
      toast.success("Vendor deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete vendor.");
    }
  };

  /* ==============================
     FILTER DATA
  ============================== */

  const filteredVendors = sortedData.filter((vendor) => {
    const query = filters.search.toLowerCase();

    return (
      vendor.vendorCode?.toLowerCase().includes(query) ||
      vendor.name?.toLowerCase().includes(query) ||
      vendor.contact_person?.toLowerCase().includes(query) ||
      vendor.phone?.toString().toLowerCase().includes(query)
    );
  });

  /* ==============================
     PAGINATION LOGIC
  ============================== */

  const {
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems: currentVendors,
  } = usePagination(filteredVendors);

  // ================= UI =================

  return (
    <div className="module-page">
      <div className="module-header">
        <h2>Vendor List</h2>

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
              onClick={() => navigate("/app/add-vendor-form")}
            >
              <span>+</span> Add Vendor
            </button>
          )}
        </div>


      </div>

      {/* ================= SEARCH ================= */}

      <div className="filter-container">
        <div className="filter-card">
          {/* <h4>Filters</h4> */}
          <div className="filter-requirements-grid-2">
            {/* <div className="filter-group">
              sdcd
            </div> */}
            <div className="filter-group">
              <div className="filter-field">
                <label>What are you looking for?</label>
                <input
                  className="search-bar"
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by vendor code, name, contact person or phone..."
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

      {/* <div className="pagination-container">
        <div className="pagination-info">
          <span>
            Showing {filteredVendors.length === 0 ? 0 : indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, filteredVendors.length)} of{" "}
            {filteredVendors.length} records
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
      </div> */}

      <Pagination
        totalRecords={filteredVendors.length}
        currentPage={currentPage}
        totalPages={totalPages}
        recordsPerPage={recordsPerPage}
        setCurrentPage={setCurrentPage}
        setRecordsPerPage={setRecordsPerPage}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        showNavigation={false}
      />

      {/* ================= TABLE ================= */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th
                className={sortConfig.key === "id" ? "active-sort" : ""}
                onClick={() => handleSort("id")}
              >
                <div className="th-content">
                  ID {renderSortIcon("id")}
                </div>
              </th>
              <th
                className={sortConfig.key === "name" ? "active-sort" : ""}
                onClick={() => handleSort("name")}
              >
                <div className="th-content">
                  Vendor Name {renderSortIcon("name")}
                </div>
              </th>
              <th
                className={
                  sortConfig.key === "contact_person" ? "active-sort" : ""
                }
                onClick={() => handleSort("contact_person")}
              >
                <div className="th-content">
                  Contact Person Name{renderSortIcon("contact_person")}
                </div>
              </th>
              <th
                className={sortConfig.key === "phone" ? "active-sort" : ""}
                onClick={() => handleSort("phone")}
              >
                <div className="th-content">
                  Phone {renderSortIcon("phone")}
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
                  Loading Vendors...
                </td>
              </tr>
            ) : currentVendors.length > 0 ? (
              currentVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td style={{ textAlign: "center" }}>
                    {vendor.id}
                  </td>

                  <td style={{ textAlign: "center", paddingLeft: "10px" }}>
                    {vendor.name}
                  </td>
                  <td style={{ textAlign: "center", paddingLeft: "10px" }}>
                    {vendor.contact_person}
                  </td>
                  <td style={{ textAlign: "center" }}>{vendor.phone}</td>

                  <td>
                    <button
                      className="action-btn review-btn"
                      title="View Item"
                      onClick={() => navigate(`/app/vendor/${vendor.id}`)}
                    >
                      {/* View */}
                      <HiOutlineEye />
                    </button>
                    {["STORE_MANAGER"].includes(user?.role) && (
                      <button
                        className="edit-btn action-btn"
                        title="Edit Item"
                        onClick={() =>
                          navigate(`/app/edit-vendor/${vendor.id}`)
                        }
                      >
                        {/* Edit */}
                        <HiOutlinePencil />
                      </button>
                    )}
                    {["STORE_MANAGER"].includes(user?.role) && (
                      <button
                        className="action-btn delete-btn"
                        title="Delete Item"
                        onClick={() => handleDelete(vendor.id)}
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
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Vendors Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      {/* <div className="pagination-container">
      
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
   
      </div> */}

      <Pagination
        totalRecords={filteredVendors.length}
        currentPage={currentPage}
        totalPages={totalPages}
        recordsPerPage={recordsPerPage}
        setCurrentPage={setCurrentPage}
        setRecordsPerPage={setRecordsPerPage}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
        showInfo={false}
        showPageSize={false}
      />
    </div>
  );
};

export default VendorLists;


