import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";



import {
  HiChevronDown,
  HiChevronUp,
  HiOutlinePencil,
  HiSelector,
} from "react-icons/hi";
import Pagination from "../../components/Pagination";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);

  // ================= Fetch Role =================
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/roles");
      setRoles(response.data);
    } catch (error) {
      toast.error("Failed to fetch roles.");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ================= FETCH USERS =================
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/user/all");
      console.log(res.data);

      // Only keep active users
      const mappedUsers = res.data.map((u) => ({
        ...u,
        isActive: u.is_active === 1, // convert 1/0 to true/false
      }));

      setUsers(mappedUsers);
      // setUsers(res.data);
    } catch (error) {
      setError("Failed to fetch users");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ================= DEACTIVATE USER =================
  const handleDeactivate = async (id) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this user?",
    );
    if (!confirmDeactivate) return;

    try {
      await axiosInstance.put(`/user/deactivate/${id}`); // 👈 put + id
      fetchUsers();
      toast.success("User deactivated successfully");
    } catch (error) {
      toast.error("Failed to deactivate user");
      console.error(error);
    }
  };

  // ================= SORTING =================

  const { sortConfig, handleSort, renderSortIcon, sortedData } = useSort(
    users,
    { key: "first_name", direction: "asc" }
  );

  // ================= FILTERS =================

  const [filters, setFilters] = useState({
    search: "",
    role: "",
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
      role: "",
    });
  };

  const isFilterActive = filters.search !== "" || filters.role !== "";

  const filteredUsers = sortedData.filter((user) => {
    const query = filters.search.toLowerCase();

    const matchesSearch =
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.phone_number?.toLowerCase().includes(query);

    //  compare id with id
    const matchesRole =
      filters.role === "" || String(user.role?.id) === filters.role;

    return matchesSearch && matchesRole;
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
  } = usePagination(filteredUsers);

  return (
    <div className="module-page">
      <div className="module-header">
        <h2>Users List</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/app/add-user")}
        >
          <span>+</span> Add User
        </button>
      </div>

      {/* ================= FILTER SECTION ================= */}

      <div className="filter-container">
        <div className="filter-card">
          {/* <h4>Filters</h4> */}

          <div className="filter-requirements-grid">
            <div className="filter-group">
              <div className="filter-field">
                <label>User Role</label>
                <select
                  name="role"
                  className="filter-dropdown"
                  value={filters.role}
                  onChange={handleFilterChange}
                  style={{ width: "200px" }}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
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
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by First name, last name, email, contact"
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
            Showing {filteredUsers.length === 0 ? 0 : indexOfFirstItem + 1}–
            {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
            {filteredUsers.length} records
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
        totalRecords={filteredUsers.length}
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
                <div className="th-content">ID {renderSortIcon("id")}</div>
              </th>
              <th
                className={sortConfig.key === "first_name" ? "active-sort" : ""}
                onClick={() => handleSort("first_name")}
              >
                <div className="th-content">
                  First Name {renderSortIcon("first_name")}
                </div>
              </th>
              <th
                className={sortConfig.key === "last_name" ? "active-sort" : ""}
                onClick={() => handleSort("last_name")}
              >
                <div className="th-content">
                  Last Name {renderSortIcon("last_name")}
                </div>
              </th>
              <th
                className={sortConfig.key === "email" ? "active-sort" : ""}
                onClick={() => handleSort("email")}
              >
                <div className="th-content">
                  Email {renderSortIcon("email")}
                </div>
              </th>
              <th
                className={sortConfig.key === "role" ? "active-sort" : ""}
                onClick={() => handleSort("role")}
              >
                <div className="th-content">Role {renderSortIcon("role")}</div>
              </th>
              <th>Status</th>
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
                  Loading users...
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="table-text">{user.first_name} </td>
                  <td className="table-text">{user.last_name || "---"} </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>

                  <td>
                    <span
                      style={{
                        color: user.isActive ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="edit-btn action-btn"
                      title="Edit Item"
                      onClick={() => navigate(`/app/edit-user/${user.id}`)}
                    >
                      {/* Edit */}
                      <HiOutlinePencil />
                    </button>

                    <button
                      className="action-btn"
                      disabled={!user.isActive}
                      onClick={() => handleDeactivate(user.id)}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No Users Found
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
        totalRecords={filteredUsers.length}
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

export default UsersList;
