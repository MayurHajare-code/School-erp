import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";

const EditVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axiosInstance.get(`/vendor/${id}`);
        setVendor(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendor();
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosInstance.put(`/vendor/update/${id}`, vendor);
      toast.success("Vendor updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update vendor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Edit Vendor</h2>

      <form onSubmit={handleSave} className="requirement-form">
        <div className="form-grid-container">
          <div className="form-input ">
            <label>
              Vendor Name <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={vendor.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>
              Contact Person <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="contact_person"
              value={vendor.contact_person}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>
              Phone <span className="mandatory">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={vendor.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>
              Email <span className="mandatory">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={vendor.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>PAN ID</label>
            <input
              type="text"
              name="pan_id"
              value={vendor.pan_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>GST ID</label>
            <input
              type="text"
              name="gst_id"
              value={vendor.gst_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-input full-width">
            <label>
              Address <span className="mandatory">*</span>
            </label>
            <textarea
              name="address"
              value={vendor.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-input full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={vendor.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Vendor"}
        </button>
      </form>

      <Link to="/app/vendors-list" className="back-link">
        Back to Vendors
      </Link>
    </div>
  );
};

export default EditVendor;
