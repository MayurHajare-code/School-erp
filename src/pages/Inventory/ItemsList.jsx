import { useEffect, useState, useMemo, useCallback } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiSelector, HiChevronUp, HiChevronDown } from "react-icons/hi";
import "../../styles/ListPage.css";
import usePagination from "../../hooks/usePagination";

import { HiOutlineEye } from "react-icons/hi";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";

const ItemsList = () => {
  const [inventoryItem, setInventoryItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // raw input value (unDebounced)
  const { user } = useAuth();
  const navigate = useNavigate();

  // ================= DOWNLOAD REPORT =================

  const handleDownloadReport = () => {
    // trigger your export/download logic here
    // e.g. exportToCSV({ ...filters })
  };

  // ================= FETCH DATA =================

  useEffect(() => {
    fetchInventoryItem();
  }, []);

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/inventory-items/all");
      setInventoryItem(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory items.");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?",
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/inventory-items/${id}`);
      setInventoryItem((prev) => prev.filter((item) => item.id !== id));
      toast.success("Inventory item deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete inventory item.",
      );
    }
  };

  // ================= SORTING =================

  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
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

  // ✅ Memoized sort — only recalculates when inventoryItem or sortConfig changes
  const sortedItems = useMemo(() => {
    return [...inventoryItem].sort((a, b) => {
      if (!sortConfig.key) return 0;

      let aValue, bValue;

      if (sortConfig.key === "category") {
        aValue = a.itemId?.category?.name;
        bValue = b.itemId?.category?.name;
      } else if (sortConfig.key === "name") {
        aValue = a.itemId?.name;
        bValue = b.itemId?.name;
      } else if (sortConfig.key === "type") {
        aValue = a.itemId?.type;
        bValue = b.itemId?.type;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [inventoryItem, sortConfig]);

  // ================= FILTERS =================

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    stockStatus: "",
  });

  // ✅ Debounce helper (no external library needed)
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  // ✅ Debounced search — only updates filter after user stops typing for 300ms
  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setFilters((prev) => ({ ...prev, search: value }));
      setCurrentPage(1);
    }, 300),
    [],
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value); // update input instantly (for UI)
    debouncedSetSearch(e.target.value); // update filter with delay
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ search: "", type: "", category: "" });
    setSearchInput("");
  };

  const isFilterActive =
    filters.search !== "" || filters.type !== "" || filters.category !== "";

  // ✅ Memoized filter — only recalculates when sortedItems or filters change
  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      const query = filters.search.toLowerCase();

      const matchesSearch =
        String(item.id).includes(query) ||
        item.itemId?.name?.toLowerCase().includes(query);

      const matchesType =
        filters.type === "" || item.itemId?.type === filters.type;

      const matchesCategory =
        filters.category === "" ||
        item.itemId?.category?.name === filters.category;

      // return matchesSearch && matchesType && matchesCategory;

      const matchesStock =
        filters.stockStatus === "" ||
        (filters.stockStatus === "low" && item.availableQuantity <= item.minimumQuantity);

      return matchesSearch && matchesType && matchesCategory && matchesStock;
    });
  }, [sortedItems, filters]);

  // ✅ Memoized categories — only recalculates when inventoryItem changes
  const categories = useMemo(() => {
    return [
      ...new Set(
        inventoryItem.map((i) => i.itemId?.category?.name).filter(Boolean),
      ),
    ];
  }, [inventoryItem]);

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
  } = usePagination(filteredItems);

  // ================= UI =================

  return (
    <div className="module-page">
      <div className="module-header">
        <h2>Inventory Items</h2>

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
              onClick={() => navigate("/app/add-item")}
            >
              <span>+</span> Add Inventory Item
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
                <label>Type</label>
                <select
                  name="type"
                  className="filter-dropdown"
                  value={filters.type}
                  onChange={handleFilterChange}
                  style={{ width: "150px" }}
                >
                  <option value="">All Types</option>
                  <option value="CONSUMABLE">Consumable</option>
                  <option value="ASSET">Asset</option>
                </select>
              </div>

              <div className="filter-field">
                <label>Category</label>
                <select
                  name="category"
                  className="filter-dropdown"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{ width: "200px" }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-field">
                <label>Stock</label>
                <select name="stockStatus" className="filter-dropdown" value={filters.stockStatus} onChange={handleFilterChange}>
                  <option value="">All Stock</option>
                  <option value="low">Low Stock Only</option>
                </select>
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-field">
                <label>What are you looking for?</label>
                <input
                  className="search-bar"
                  type="text"
                  name="search"
                  value={searchInput} // ✅ use raw input state
                  onChange={handleSearchChange} // ✅ debounced handler
                  placeholder="Search by Name or ID"
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
            Showing {filteredItems.length === 0 ? 0 : indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, filteredItems.length)} of{" "}
            {filteredItems.length} records
          </span>
        </div>

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

      {/* ================= TABLE ================= */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th
                className={sortConfig.key === "id" ? "active-sort" : ""}
                onClick={() => handleSort("id")}
              >
                <div className="th-content">Inv. ID {renderSortIcon("id")}</div>
              </th>

              <th
                className={sortConfig.key === "name" ? "active-sort" : ""}
                onClick={() => handleSort("name")}
              >
                <div className="th-content">Name {renderSortIcon("name")}</div>
              </th>

              <th
                className={sortConfig.key === "type" ? "active-sort" : ""}
                onClick={() => handleSort("type")}
              >
                <div className="th-content">Type {renderSortIcon("type")}</div>
              </th>

              <th
                className={sortConfig.key === "category" ? "active-sort" : ""}
                onClick={() => handleSort("category")}
              >
                <div className="th-content">
                  Category {renderSortIcon("category")}
                </div>
              </th>

              <th
                className={
                  sortConfig.key === "availableQuantity" ? "active-sort" : ""
                }
                onClick={() => handleSort("availableQuantity")}
              >
                <div className="th-content">
                  Available Quantity {renderSortIcon("availableQuantity")}
                </div>
              </th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading Items...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>{item.id}</td>

                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                    {item.itemId?.name}
                  </td>

                  <td style={{ textAlign: "center" }}>{item.itemId?.type}</td>

                  <td style={{ textAlign: "left", paddingLeft: "10px" }}>
                    {item.itemId?.category?.name}
                  </td>

                  <td style={{ textAlign: "center" }}>{item.availableQuantity}</td>

                  <td>
                    <button
                      className="action-btn review-btn"
                      title="View Item"
                      onClick={() => navigate(`/app/item/${item.id}`)}
                    >
                      <HiOutlineEye />
                    </button>

                    {["STORE_MANAGER"].includes(user.role) && (
                      <button
                        className="edit-btn action-btn"
                        title="Edit Item"
                        onClick={() => navigate(`/app/edit-item/${item.id}`)}
                      >
                        <HiOutlinePencil />
                      </button>
                    )}

                    {["STORE_MANAGER"].includes(user.role) && (
                      <button
                        className="action-btn delete-btn"
                        title="Delete Item"
                        onClick={() => handleDelete(item.id)}
                      >
                        <HiOutlineTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Items Found
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

export default ItemsList;
