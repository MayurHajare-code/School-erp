import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import {
  HiSelector,
  HiChevronUp,
  HiChevronDown,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Model.css";

import useFilter from "../../hooks/useFilter";
import useSort from "../../hooks/useSort";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const renderSortIcon = (columnKey, sortConfig) => {
  if (sortConfig.key !== columnKey)
    return <HiSelector className="sort-icon-neutral" />;
  return sortConfig.direction === "asc" ? (
    <HiChevronUp className="sort-icon-active" />
  ) : (
    <HiChevronDown className="sort-icon-active" />
  );
};

const Department = () => {
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [name, setName] = useState("");

  /* ==============================
     HOOKS
  ============================== */

  const {
    search,
    handleSearchChange,
    resetFilter,
    isFilterActive,
    filteredData,
  } = useFilter(departments, ["name"]);

  const { sortConfig, handleSort, sortedData } = useSort(filteredData);

  const {
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems,
  } = usePagination(sortedData);

  // ================= FETCH =================

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/departments/all");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ================= ADD =================

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/departments/add", { name });

      setDepartments((prev) => [...prev, res.data]);

      setName("");
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  // ================= DELETE =================

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      await axiosInstance.delete(`/departments/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // ================= UPDATE =================

  const handleUpdate = async () => {
    try {
      setUpdatingId(editDepartment.id);
      setDepartments((prev) =>
        prev.map((d) => (d.id === editDepartment.id ? editDepartment : d)),
      );
      await axiosInstance.put(
        `/departments/update/${editDepartment.id}`,
        editDepartment,
      );

      setEditDepartment(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ================= UI =================

  return (
    <div className="module-page">
      <div className="module-header">
        <h2>Department List</h2>

        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <span>+</span> Add Department
        </button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="filter-container">
        <div className="filter-card">
          <div className="filter-requirements-grid-2">
            <div className="filter-group">
              <div className="filter-field">
                <label>What are you looking for?</label>
                <input
                  className="search-bar"
                  type="text"
                  name="search"
                  placeholder="Search department..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <div>
                {isFilterActive && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={resetFilter}
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
            Showing {filteredData.length === 0 ? 0 : indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} records
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
      </div> */}

      <Pagination
        totalRecords={filteredData.length}
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
                onClick={() => handleSort("id")}
                className={sortConfig.key === "id" ? "active-sort" : ""}
              >
                <div className="th-content">
                  ID {renderSortIcon("id", sortConfig)}
                </div>
              </th>

              <th
                onClick={() => handleSort("name")}
                className={sortConfig.key === "name" ? "active-sort" : ""}
              >
                <div className="th-content">
                  Name {renderSortIcon("name", sortConfig)}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading Departments...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>

                  <td>
                    <button
                      className="edit-btn action-btn"
                      disabled={
                        updatingId === dept.id || deletingId === dept.id
                      }
                      onClick={() => setEditDepartment(dept)}
                    >
                      {updatingId === dept.id ? (
                        "Updating..."
                      ) : (
                        <HiOutlinePencil />
                      )}
                    </button>

                    <button
                      className="delete-btn action-btn"
                      disabled={deletingId === dept.id}
                      onClick={() => handleDelete(dept.id)}
                    >
                      {deletingId === dept.id ? (
                        "Deleting..."
                      ) : (
                        <HiOutlineTrash />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Departments Found
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
        totalRecords={filteredData.length}
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

      {/* ================= EDIT MODAL ================= */}

      {editDepartment && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Department</h3>

            <div className="form-input">
              <label>Name</label>

              <input
                type="text"
                value={editDepartment.name}
                onChange={(e) =>
                  setEditDepartment({
                    ...editDepartment,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleUpdate}>
                {updatingId === editDepartment?.id ? "Updating..." : "Update"}
              </button>

              <button
                className="secondary-btn"
                onClick={() => setEditDepartment(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD MODAL ================= */}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Department</h3>

            <div className="form-input">
              <label>Name</label>

              <input
                type="text"
                placeholder="Department Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="primary-btn"
                onClick={handleAdd}
                disabled={!name.trim()}
              >
                Add
              </button>

              <button
                className="secondary-btn"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
