import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { FiPackage } from "react-icons/fi";
import "../../styles/ViewPage.css";

const ViewItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventoryItem, setInventoryItem] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);

  const fetchInventoryItem = useCallback(async () => {
    try {
      setPageLoading(true);
      const res = await axiosInstance.get(`/inventory-items/${id}`);
      setInventoryItem(res.data);
    } catch (err) {
      const msg = err.response?.status === 404
        ? "Item not found"
        : err.response?.status === 403
          ? "You don't have permission to view this item"
          : "Failed to load inventory item";
      toast.error(msg);
      navigate("/app/items-list");
    } finally {
      setPageLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInventoryItem();
  }, [fetchInventoryItem]);

  if (pageLoading) return <div>Loading...</div>;
  if (!inventoryItem) return null;

  const details = inventoryItem.itemId;

  return (
    <div className="review-container">
      <div className="review-header">
        <h2>Inventory Item Details</h2>
      </div>

      <div className="review-card full-width">
        <h3 className="section-title">
          <FiPackage className="section-icon" />
          Item Details
        </h3>
        <div className="info-grid">
          <p>
            <strong>Name:</strong> {details.name}
          </p>
          <p>
            <strong>Type:</strong> {details.type}
          </p>
          <p>
            <strong>Category:</strong> {details.category?.name}
          </p>
          <p>
            <strong>Department:</strong> {details.department?.name}
          </p>
          <p>
            <strong>Unit:</strong> {details.unit}
          </p>
          <p>
            <strong>Description:</strong> {details.description}
          </p>
        </div>
      </div>

      <div className="review-card full-width">
        <h3 className="section-title">
          📦 Inventory Details
        </h3>
        <div className="info-grid">
          <p><strong>Available Quantity:</strong> {inventoryItem.availableQuantity}</p>
          <p><strong>Total Quantity:</strong> {inventoryItem.totalQuantity}</p>
          <p><strong>Minimum Quantity Level:</strong> {inventoryItem.minimumQuantity}</p>
        </div>
      </div>

      <button className="primary-btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default ViewItem;
