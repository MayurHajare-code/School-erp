import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import "../../styles/FormPage.css";

const AddVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  

  const [vendor, setVendor] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    pan_id: "",
    gst_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  const generateVendorCode = () => {
    return "VEND-" + Date.now();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      { field: "name", label: "Vendor Name" },
      { field: "phone", label: "Phone" },
      { field: "email", label: "Email" },
      { field: "contact_person", label: "Contact Person" },
      { field: "address", label: "Address" },
    ];

    for (let { field, label } of requiredFields) {
      if (!vendor[field]?.trim()) {
        toast.error(`${label} is required`);
        return;
      }
    }

    try {
      setLoading(true);

      const formattedData = {
        // vendorCode: generateVendorCode(),
        name: vendor.name,
        contact_person: vendor.contact_person,
        phone: vendor.phone,
        email: vendor.email,
        address: vendor.address,

        description: vendor.description,
        pan_id: vendor.pan_id,
        gst_id: vendor.gst_id,
      };

      await axiosInstance.post("/vendor/add", formattedData);

      toast.success("Vendor created successfully!");

      navigate("/app/Vendors-list");
    } catch (error) {
      const errorMessage =
        error.response?.headers?.["x-message"] || "Failed to create vendor.";

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Add Vendor (Supplier)</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
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
              disabled={loading}
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
            <label>Pan Id</label>
            <input
              type="text"
              name="pan_id"
              value={vendor.pan_id}
              onChange={handleChange}
            />
          </div>

          <div className="form-input">
            <label>Gst Id</label>
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
          {loading ? "Saving..." : "Save Vendor"}
        </button>

        <Link to="/app/vendors-list" className="back-link">
          Back to Vendors
        </Link>
      </form>
    </div>
  );
};

export default AddVendor;
