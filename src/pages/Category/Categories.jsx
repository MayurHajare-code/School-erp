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
import toast from "react-hot-toast";
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

const Category = () => {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    departmentId: "",
  });

  /* ==============================
     HOOKS
  ============================== */

  const {
    search,
    handleSearchChange,
    resetFilter,
    isFilterActive,
    filteredData,
  } = useFilter(categories, ["name", "description"]);

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

  /* ==============================
     FETCH CATEGORIES
  ============================== */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/categories/all");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDepartments();
  }, []);

  /* ==============================
     ADD CATEGORY
  ============================== */

  const handleAdd = async () => {
    if (!formData.departmentId) {
      toast.error("Please select a department");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        department: {
          id: Number(formData.departmentId),
        },
      };

      const res = await axiosInstance.post("/categories/add", payload);
      setCategories((prev) => [...prev, res.data]);
      setFormData({ name: "", description: "", departmentId: "" });
      setShowAddModal(false);
      toast.success("Category added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    }
  };

  /* ==============================
     DELETE CATEGORY
  ============================== */

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await axiosInstance.delete(`/categories/${id}`);
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  /* ==============================
     UPDATE CATEGORY
  ============================== */

  const handleUpdate = async () => {
    try {
      setUpdatingId(editCategory.id);
      setCategories((prev) =>
        prev.map((c) => (c.id === editCategory.id ? editCategory : c)),
      );
      await axiosInstance.put(
        `/categories/update/${editCategory.id}`,
        editCategory,
      );
      setEditCategory(null);
      setShowAddModal(false);
      toast.success("Category updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ==============================
     FETCH DEPARTMENTS
  ============================== */

  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const res = await axiosInstance.get("/departments/all");
      setDepartments(res.data);
    } catch (error) {
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  /* ==============================
     UI
  ============================== */

  return (
    <div className="module-page">
      {/* ================= HEADER ================= */}

      <div className="module-header">
        <h2>Categories List</h2>
        {user && user.role === "ADMIN" && (
          <button className="primary-btn" onClick={() => setShowAddModal(true)}>
            <span>+</span> Add Category
          </button>
        )}
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
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search categories..."
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
        <span>
          Showing {filteredData.length === 0 ? 0 : indexOfFirstItem + 1}–
          {Math.min(indexOfLastItem, filteredData.length)} of{" "}
          {filteredData.length} records
        </span>

        <div className="records-per-page ">
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
                style={{ textAlign: "center" }}
                onClick={() => handleSort("id")}
                className={sortConfig.key === "id" ? "active-sort" : ""}
              >
                <div className="th-content">
                  ID {renderSortIcon("id", sortConfig)}
                </div>
              </th>

              <th
                style={{ textAlign: "left", paddingLeft: "10px" }}
                onClick={() => handleSort("name")}
                className={sortConfig.key === "name" ? "active-sort" : ""}
              >
                <div className="th-content">
                  Name {renderSortIcon("name", sortConfig)}
                </div>
              </th>

              {user && user.role === "ADMIN" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Loading Categories...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>{cat.name}</td>
                  {/* <td>{cat.description}</td> */}

                  {user && user.role === "ADMIN" && (
                    <td>
                      <button
                        className="edit-btn action-btn"
                        title="Edit Item"
                        disabled={
                          updatingId === cat.id || deletingId === cat.id
                        }
                        onClick={() => setEditCategory(cat)}
                      >
                        {updatingId === cat.id ? (
                          "Updating..."
                        ) : (
                          <HiOutlinePencil />
                        )}
                      </button>

                      <button
                        className="delete-btn action-btn"
                        title="Delete Item"
                        disabled={deletingId === cat.id}
                        onClick={() => handleDelete(cat.id)}
                      >
                        {deletingId === cat.id ? (
                          "Deleting..."
                        ) : (
                          <HiOutlineTrash />
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No Categories Found
                </td>
              </tr>
            )}
            {/* )} */}
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

          <span>
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

      {editCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Category</h3>
            <div className="field-group">
              <label htmlFor="name">Category Name</label>
              <input
                value={editCategory.name}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field-group">
              <label htmlFor="description">Department Name</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }

              >
                <option value="">
                  {editCategory.department?.name}
                </option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="description">Category Description</label>
              <input
                value={editCategory.description}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleUpdate}>
                Update
              </button>

              <button
                className="secondary-btn"
                onClick={() => setEditCategory(null)}
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
            <h3>Add Category</h3>

            <div className="field-group">
              <label htmlFor="name">Category Name</label>
              <input
                placeholder="Category Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="field-group">
              <label htmlFor="description">Department Name</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
                disabled={loadingDepartments}
              >
                <option value="">
                  {loadingDepartments
                    ? "Loading departments..."
                    : departments.length === 0
                      ? "No departments found"
                      : "Select Department"}
                </option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="description">Category Description</label>
              <input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="primary-btn" onClick={handleAdd}>
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

export default Category;
