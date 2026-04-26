import {
  FiMenu,
  FiX,
  FiHome,
  FiClipboard,
  FiUsers,
  FiBriefcase,
  FiFolder,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
import { useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { user, loading } = useAuth();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="logo-text">Ataraxia ERP</h2>}
        <div className="menu-btn" onClick={toggleSidebar}>
          {collapsed ? <FiMenu /> : <FiX />}
        </div>
      </div>

      {/* Navigation */}
      <ul className="nav-list">
        <li>
          <NavLink
            to="/app/dashboard"
            className="nav-item"
            title={collapsed ? "Dashboard" : ""}
          >
            <FiHome />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/app/items-list"
            className="nav-item"
            title={collapsed ? "Dashboard" : ""}
          >
            <FiClipboard className="nav-icon" />
            {!collapsed && <span>Inventory</span>}
          </NavLink>
        </li>

        {user &&
          (user.role === "ADMIN") && (
            <li>
              <NavLink
                to="/app/category"
                className="nav-item"
                title={collapsed ? "Dashboard" : ""}
              >
                <FiFolder className="nav-icon" />
                {!collapsed && <span>Category</span>}
              </NavLink>
            </li>
          )}

        {user && user.role === "ADMIN" && (
          <li>
            <NavLink
              to="/app/department"
              className="nav-item"
              title={collapsed ? "Dashboard" : ""}
            >
              <FiHome className="nav-icon" />
              {!collapsed && <span>Department</span>}
            </NavLink>
          </li>
        )}

        {user &&
          (user.role === "ADMIN" ||
            user.role === "STORE_MANAGER") && (
            <li>
              <NavLink
                to="/app/vendors-list"
                className="nav-item"
                title={collapsed ? "Dashboard" : ""}
              >
                <FiBriefcase className="nav-icon" />
                {!collapsed && <span>Vendors</span>}
              </NavLink>
            </li>
          )}

        {user && user.role === "ADMIN" && (
          <li>
            <NavLink
              to="/app/users-list"
              className="nav-item"
              title={collapsed ? "Dashboard" : ""}
            >
              <FiUsers className="nav-icon" />
              {!collapsed && <span>Users</span>}
            </NavLink>
          </li>
        )}

        {user &&
          (user.role === "ADMIN" ||
            user.role === "STORE_MANAGER") && (
            <li>
              <NavLink
                to="/app/purchase-order-list"
                className="nav-item"
                title={collapsed ? "Dashboard" : ""}
              >
                <FaFileInvoice className="nav-icon" />
                {!collapsed && <span>purchase order</span>}
              </NavLink>
            </li>
          )}
      </ul>
    </aside>
  );
};

export default Sidebar;
