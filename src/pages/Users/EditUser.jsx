import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import "../../styles/FormPage.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: "",
    userFirstName: "",
    userLastName: "",
    email: "",
    userRole: "STOREKEEPER",
    phone_number: "",
  });

  // ================= FETCH USER =================
  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/roles");
      setRoles(res.data);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(`/user/${id}`);
      const data = res.data;

      setUser({
        username: data.username || "",
        userFirstName: data.first_name || "",
        userLastName: data.last_name || "",
        email: data.email || "",
        userRole: data.role?.id || "",
        phone_number: data.phone_number || "",
        isActive: data.is_active === 1,
      });
    } catch (error) {
      toast.error("Failed to load user");
      console.error(error);
    }
  };

  // ================= HANDLE INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT FORM =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.userFirstName.trim() || !user.userLastName.trim()) {
      toast.error("First Name and Last Name are required");
      return;
    }

    try {
      setLoading(true);

      const formattedData = {
        email: user.email,
        first_name: user.userFirstName,
        last_name: user.userLastName,
        phone_number: user.phone_number,
        is_active: user.isActive ? 1 : 0,
        role: { id: user.userRole },
      };

      await axiosInstance.put(`/user/update/${id}`, formattedData);

      toast.success("User updated successfully!");
      navigate("/app/users-list");
    } catch (error) {
      toast.error("Failed to update user");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Edit User</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
        <div className="form-grid-container">
          <div className="form-input">
            <label>Username</label>
            <input type="text" name="username" value={user.username} disabled />
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
            />
          </div>
          <div className="form-input ">
            <label>
              First Name <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="userFirstName"
              value={user.userFirstName}
              onChange={handleChange}
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
            />
          </div>

          <div className="form-input">
            <label>
              Contact <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="phone_number"
              value={user.phone_number || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>Role</label>
            <select
              name="userRole"
              value={user.userRole}
              onChange={handleChange}
            >
              <option value="">-- Select Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Updating..." : "Update User"}
        </button>

        <Link to="/app/users-list" className="back-link">
          Back to Users
        </Link>
      </form>
    </div>
  );
};

export default EditUser;
