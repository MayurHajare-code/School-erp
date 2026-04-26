import { useState } from "react";
import "../styles/Login.css";
import axiosInstance from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const validate = () => {
    if (!username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return false;
    }
    return true;
  };

  const loginWithCredentials = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const loginRes = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      // localStorage.setItem("token", response.data.token);
      console.log("✅ Login success:", loginRes.data);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 401
          ? "Invalid username or password."
          : status === 403
          ? "Access denied. Contact your administrator."
          : "Something went wrong. Please try again.";
      toast.error(msg, { id: toastId });
      setLoading(false);
      return;
    }

    try {
      await checkAuth();
    } catch (err) {
      toast.error("Session error. Please try again.", { id: toastId });
      setLoading(false);
      return;
    }

    toast.success("Welcome back!", { id: toastId });
    setLoading(false);
    navigate("/app/dashboard");
  };

  return (
    <>
      {/* <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        }}
      /> */}
      <section className="login-section">
        <div className="login-page">
          <form className="form" noValidate onSubmit={loginWithCredentials}>
            <img className="logo" src="/assets/school.png" alt="school logo" />
            <h3>Ataraxia School ERP</h3>
            <p className="subtitle">Smart Inventory & Management System</p>

            <div className="field-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setShowPassword((p) => !p)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible />
                  ) : (
                    <AiOutlineEye />
                  )}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
        <div className="copyright">
          Copyright &copy; {new Date().getFullYear()} Ataraxia Development
          Group. All rights reserved.
        </div>
      </section>
    </>
  );
};

export default Login;



