import { useState, useRef, useEffect } from "react";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const { user, loading, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <div className="logo-container">
          <img
            src="/assets/school.png"
            alt="Ataraxia School ERP"
            className="logo"
          />
          <h1>Ataraxia School ERP</h1>
        </div>

        <div className="user-menu">
          <div
            className="user-button"
            onClick={() => navigate("/app/profile")}
          >
            <div className="avatar">
              <HiOutlineUserCircle size={20} />
            </div>
            <span>{user?.first_name || "Account"}</span>
            <span className="arrow">▾</span>
          </div>

          <div className="dropdown">
            <div className="dropdown-header">
              <span>{user?.first_name || "Account"}</span>
              <p>{user?.email || "admin@email.com"}</p>
            </div>
            <div className="dropdown-divider" />

            <button className="dropdown-item logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
