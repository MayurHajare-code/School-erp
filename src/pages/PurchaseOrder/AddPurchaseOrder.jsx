import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/FormPage.css";
import "../../styles/PerchaseOrderPage.css";

const AddPurchaseOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vendors, setVendors] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [poData, setPoData] = useState({
    vendorCode: "",
    departmentId: "",
    notes: "",
    expectedDeliveryDate: "",
    items: [{ itemId: "", quantity: "", unitPrice: "" }],
  });

  useEffect(() => {
    fetchVendors();
    fetchItems();
    fetchDepartments();
  }, []);

  const fetchVendors = async () => {
    const res = await axiosInstance.get("/vendor/all");
    setVendors(res.data);
  };

  const fetchItems = async () => {
    const res = await axiosInstance.get("/items/all");
    setItemsList(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axiosInstance.get("/departments/all");
    setDepartments(res.data);
  };

  const handleVendorChange = (e) => {
    setPoData({ ...poData, vendorCode: e.target.value });
  };

  const handleDepartmentChange = (e) => {
    setPoData({ ...poData, departmentId: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const updated = [...poData.items];
    updated[index][e.target.name] = e.target.value;

    setPoData({ ...poData, items: updated });
  };

  // const handleReasonChange = (e) => {
  //   setPoData({ ...poData, reason: e.target.value });
  // };

  const addRow = () => {
    setPoData({
      ...poData,
      items: [...poData.items, { itemId: "", quantity: "", unitPrice: "" }],
    });
  };

  const removeRow = (index) => {
    const updated = [...poData.items];
    updated.splice(index, 1);
    setPoData({ ...poData, items: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User not loaded");
      return;
    }

    if (!poData.vendorCode) {
      toast.error("Vendor is required");
      return;
    }

    if (poData.items.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    // Validate items
    for (let i = 0; i < poData.items.length; i++) {
      const item = poData.items[i];

      if (!item.itemId) {
        toast.error(`Item is required in row ${i + 1}`);
        return;
      }

      if (!item.quantity || item.quantity <= 0) {
        toast.error(`Quantity must be greater than 0 in row ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      const items = poData.items.map((item) => ({
        itemId: Number(item.itemId),
        quantity: Number(item.quantity),
        unitPrice: parseFloat(item.unitPrice || 0),
      }));

      const totalAmount = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );

      const finalData = {
        orderDate: new Date().toISOString().split("T")[0],
        expectedDeliveryDate: poData.expectedDeliveryDate,

        notes: poData.notes,
        // createdBy: user.id,
        vendorCode: poData.vendorCode,
        // departmentId: poData.departmentId || null,

        items,
      };

      await axiosInstance.post("/purchase-orders/create", finalData);

      toast.success("Purchase Order Created");
      navigate("/app/purchase-order-list");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create PO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Add Purchase Order</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
        <div className="form-grid-container">
          {/* Vendor */}
          <div className="form-input">
            <label>
              Vendor <span className="mandatory">*</span>
            </label>
            <select value={poData.vendorCode} onChange={handleVendorChange}>
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorCode} value={vendor.vendorCode}>
                  {vendor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-input">
            <label>Expected Delivery Date</label>
            <input
              type="date"
              value={poData.expectedDeliveryDate}
              onChange={(e) =>
                setPoData({ ...poData, expectedDeliveryDate: e.target.value })
              }
            />
          </div>

          {/* Reason */}
          <div className="form-input full-width">
            <label>Comment</label>
            <textarea
              value={poData.notes}
              onChange={(e) =>
                setPoData({ ...poData, notes: e.target.value })
              }
            />
          </div>
        </div>
        {poData.items.map((item, index) => (
          <div key={index} className="item-row">
            <div>
              <label>
                Item <span className="mandatory">*</span>
              </label>
              <select
                name="itemId"
                value={item.itemId}
                onChange={(e) => handleItemChange(index, e)}
                required
              >
                <option value="">Select Item </option>
                {itemsList.map((itm) => (
                  <option key={itm.id} value={itm.id}>
                    {itm.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>
                Quantity <span className="mandatory">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                // placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                required
              />
            </div>

            <div>
              <label>Price Per Unit</label>
              <input
                type="number"
                name="unitPrice"
                // placeholder="Price / Unit"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <div style={{ marginTop: "25px" }}>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeRow(index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="primary-btn"
          style={{ marginLeft: "15px", marginBottom: "15px" }}
          onClick={addRow}
        >
          + Add Item
        </button>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Purchase Order"}
        </button>
      </form>
    </div>
  );
};

export default AddPurchaseOrder;
