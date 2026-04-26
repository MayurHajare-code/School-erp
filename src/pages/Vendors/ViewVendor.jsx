import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { FiUser } from "react-icons/fi";

const ViewVendor = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axiosInstance.get(`/vendor/${id}`);
        setVendor(res.data);
        console.log(res.data)
      } catch (err) {
        console.error(err);
      }
    };
    fetchVendor();
  }, [id]);

  if (!vendor) return <p>Loading...</p>;

  return (
    <div className="review-container">
      <div className="review-header">
        <h2>Vendor Details</h2>
      </div>

      <div className="review-card full-width">
        <h3 className="section-title">
          <FiUser className="section-icon" />
          Vendor Information
        </h3>

        <div className="info-grid">
          <p>
            <strong>Vendor Name:</strong> {vendor.name}
          </p>
          <p>
            <strong>Contact Person:</strong> {vendor.contact_person}
          </p>
          <p>
            <strong>Phone:</strong> {vendor.phone}
          </p>
          <p>
            <strong>Email:</strong> {vendor.email}
          </p>
          <p>
            <strong>Address:</strong> {vendor.address}
          </p>
          <p>
            <strong>PAN ID:</strong> {vendor.pan_id}
          </p>
          <p>
            <strong>GST ID:</strong> {vendor.gst_id}
          </p>
          <p>
            <strong>Description:</strong> {vendor.description}
          </p>
        </div>
      </div>

      <button className="primary-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ViewVendor;