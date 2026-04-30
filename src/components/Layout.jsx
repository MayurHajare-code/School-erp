import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";
import Footer from "./Footer";
import "../styles/layout.css";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`layout ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      <div className="main-content">
        <Navbar  />
        <div className="page-content">
          <Outlet />
        </div>
        <Footer className="footer"/>
      </div>
    </div>
  );
};

export default Layout;
