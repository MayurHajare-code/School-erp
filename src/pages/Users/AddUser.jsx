import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import "../../styles/FormPage.css";

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^[0-9]{10}$/;

  const [user, setUser] = useState({
    userName: "",
    userFirstName: "",
    userLastName: "",
    email: "",
    userRole: "",
    contact: "",
    isActive: true,
  });

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

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.userName.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!user.userFirstName.trim()) {
      toast.error("First Name is required");
      return;
    }

    if (!user.userLastName.trim()) {
      toast.error("Last Name is required");
      return;
    }

    if (!user.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!user.contact.trim()) {
      toast.error("Contact is required");
      return;
    }

    if (!emailRegex.test(user.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!contactRegex.test(user.contact)) {
      toast.error("Invalid contact number");
      return;
    }

    try {
      setLoading(true);

      const formattedData = {
        username: user.userName,
        email: user.email,
        first_name: user.userFirstName,
        last_name: user.userLastName,
        role: {
          id: user.userRole,
        },
        phone_number: user.contact,
        is_active: 1,
      };

      await axiosInstance.post("/user/add", formattedData);

      toast.success("User created successfully!");
      navigate("/app/users-list");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Add User</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
        <div className="form-grid-container">
          <div className="form-input">
            <label>
              Username <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={user.userName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-input">
            <label>
              Email <span className="mandatory">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="form-input">
            <label>
              First Name <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="userFirstName"
              value={user.userFirstName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-input">
            <label>
              Last Name <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="userLastName"
              value={user.userLastName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-input">
            <label>
              Contact <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>
              User Role <span className="mandatory">*</span>
            </label>
            <select
              name="userRole"
              value={user.userRole}
              onChange={handleChange}
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
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Saving..." : "Save User"}
        </button>

        <Link to="/app/users-list" className="back-link">
          Back to Users
        </Link>
      </form>
    </div>
  );
};

export default AddUser;
