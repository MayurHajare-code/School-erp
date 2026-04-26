import { useState, useEffect, useCallback } from "react";  
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import "../../styles/FormPage.css";

const EditInventoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inventoryItem, setInventoryItem] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInventoryItem((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { totalQuantity, availableQuantity, minimumQuantity } = inventoryItem;

    if (availableQuantity > totalQuantity) {
      toast.error("Available quantity cannot exceed total quantity");
      return;
    }
    if (minimumQuantity > totalQuantity) {
      toast.error("Minimum quantity cannot exceed total quantity");
      return;
    }

    try {
      setSubmitting(true);
      const payload = { totalQuantity, availableQuantity, minimumQuantity }; 
      await axiosInstance.put(`/inventory-items/${id}`, payload);
      toast.success("Inventory item updated successfully");
      navigate("/app/items-list");
    } catch (err) {
      const msg = err.response?.status === 404   
        ? "Item no longer exists"
        : err.response?.status === 403
          ? "You don't have permission to edit this item"
          : err.response?.status === 400
            ? err.response.data?.message || "Invalid data submitted"
            : "Failed to update inventory item";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) return <div>Loading...</div>;
  if (!inventoryItem) return null;

  return (

    <div className="requirement-container">
      <h2>Edit Inventory Item</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
        <div className="form-grid-container">

          {/* Department */}
          <div className="form-input">
            <label>Department</label>
            <input
              type="text"
              value={inventoryItem.itemId.department.name}
              readOnly
              disabled
            />
          </div>

          {/* Category */}
          <div className="form-input">
            <label>Category</label>
            <input
              type="text"
              value={inventoryItem.itemId.category.name}
              readOnly
              disabled
            />
          </div>

          {/* Item Name */}
          <div className="form-input">
            <label>Item Name</label>
            <input
              type="text"
              value={inventoryItem.itemId.name}
              readOnly
              disabled
            />
          </div>

          {/* Unit */}
          <div className="form-input">
            <label>Unit</label>
            <input
              type="text"
              value={inventoryItem.itemId.unit}
              readOnly
              disabled
            />
          </div>

          {/* Type */}
          <div className="form-input">
            <label>Type</label>
            <input
              type="text"
              value={inventoryItem.itemId.type}
              readOnly
              disabled
            />
          </div>

          {/* Total Quantity */}
          <div className="form-input">
            <label>Total Quantity <span className="mandatory">*</span></label>
            <input
              type="number"
              name="totalQuantity"
              value={inventoryItem.totalQuantity}
              onChange={handleChange}
              required
              min={0}
            />
          </div>

          {/* Available Quantity */}
          <div className="form-input">
            <label>Available Quantity <span className="mandatory">*</span></label>
            <input
              type="number"
              name="availableQuantity"
              value={inventoryItem.availableQuantity}
              onChange={handleChange}
              min={0}
            />
          </div>

          {/* Minimum Quantity */}
          <div className="form-input">
            <label>Minimum Quantity <span className="mandatory">*</span></label>
            <input
              type="number"
              name="minimumQuantity"
              value={inventoryItem.minimumQuantity}
              onChange={handleChange}
              min={0}
            />
          </div>

        </div>

        <button type="submit" className="add-btn" disabled={submitting}>
          {submitting ? "Updating..." : "Update"}
        </button>

        <Link to="/app/items-list" className="back-link" >
          Back to Inventory Items
        </Link>

      </form>
    </div>

  );
};

export default EditInventoryItem;