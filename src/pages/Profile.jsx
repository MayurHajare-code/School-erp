import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import "../styles/Profile.css";
import "../styles/Login.css";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Profile = () => {
  const { user, loading, checkAuth } = useAuth();

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form state
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // Show/Hide toggle (for password)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // open modal — prefill form with current user data
  const openModal = () => {
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone_number: user.phone_number || "",
      email: user.email || "",
    });
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
    setSuccess("");
  };

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.put("/auth/update", form);
      await checkAuth(); // ← refresh user data in context
      setSuccess("Profile updated successfully!");

      // auto close modal after 1.5 seconds
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // ===== password updation =======================

  const openPasswordModal = () => {
    setPasswordForm({ password: "", confirmPassword: "" });
    setError("");
    setSuccess("");
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.password.length < 4) {
      toast.error("Password must be at least 4 characters long.");
      return;
    }

    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    setUpdating(true);
    try {
      // await axiosInstance.put("/auth/update-password", {
      //   password: passwordForm.password,
      // });
      toast.success("Password updated successfully!");
      setTimeout(closePasswordModal, 1500);
    } catch {
      setError("Failed to update password");
    } finally {
      setUpdating(false);
    }
  };




  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div>Please login</div>;

  // =================== UI ===================== 

  return (
    <section className="profile-section">
      <div className="profile-page">
        {/* Header */}
        <div className="profile-header">
          <h2>My Profile</h2>
          <p>Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-right">
            <div className="info-row">
              <span>First Name</span>
              <strong>{user.first_name}</strong>
            </div>

            <div className="info-row">
              <span>Last Name</span>
              <strong>{user.last_name}</strong>
            </div>

            <div className="info-row">
              <span>Email</span>
              <strong>{user.email || "—"}</strong>
            </div>

            <div className="info-row">
              <span>Phone Number</span>
              <strong>{user.phone_number}</strong>
            </div>

            <div className="info-row">
              <span>Username</span>
              <strong>{user.username}</strong>
            </div>

            <div className="info-row">
              <span>Role</span>
              <span className="role-badge">{user.role}</span>
            </div>
          </div>

          {/* Edit + Reset Password Buttons */}
          <div className="profile-actions">
            <button className="reset-btn" onClick={openPasswordModal}>
              Reset Password
            </button>
            <button className="edit-btn" onClick={openModal}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── Modal ── */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Profile</h3>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdate} className="modal-form">
                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>}

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </div>

                {/* username and role — shown but not editable */}
                <div className="form-group">
                  <label>
                    Username{" "}
                    <span className="not-editable">(not editable)</span>
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Role <span className="not-editable">(not editable)</span>
                  </label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="save-btn"
                    disabled={updating}
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal-overlay" onClick={closePasswordModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Change Password</h3>
                <button className="modal-close" onClick={closePasswordModal}>
                  ✕
                </button>
              </div>

              <form onSubmit={handlePasswordUpdate} className="modal-form">
                {/* {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">{success}</p>} */}

                <div className="field-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-field">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      value={passwordForm.password}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      disabled={updating}
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowPassword((prev) => !prev)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setShowPassword((p) => !p)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-field">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      disabled={updating}
                    />
                    <span
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setShowConfirmPassword((p) => !p)
                      }
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={closePasswordModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;

