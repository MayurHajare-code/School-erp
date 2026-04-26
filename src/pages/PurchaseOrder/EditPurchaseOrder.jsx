import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/FormPage.css";
import "../../styles/PerchaseOrderPage.css";

const EditPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [poData, setPoData] = useState({
    vendorCode: "",
    notes: "",
    expectedDeliveryDate: "",
    items: [],
  });

  useEffect(() => {
    fetchVendors();
    fetchItems();
    fetchPO();
  }, []);

  const fetchVendors = async () => {
    const res = await axiosInstance.get("/vendor/all");
    setVendors(res.data);
  };

  const fetchItems = async () => {
    const res = await axiosInstance.get("/items/all");
    setItemsList(res.data);
  };

  const fetchPO = async () => {
    try {
      const res = await axiosInstance.get(`/purchase-orders/get/${id}`);
      const data = res.data;

      console.log("PO DATA by Id:", data);

      const items = (data.items || []).map((item) => ({
        id: item.id,
        itemId: item.item?.id || "",
        quantity: item.quantity || "",
        unitPrice: item.unitPrice || "",
      }));

      setPoData({
        vendorCode: data.vendor?.vendorCode || "",
        notes: data.notes || "",
        expectedDeliveryDate: data.expectedDeliveryDate || "",
        items: items,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemChange = (index, e) => {
    const updated = [...poData.items];
    updated[index][e.target.name] = e.target.value;
    setPoData({ ...poData, items: updated });
  };

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

    try {
      setLoading(true);
      const items = poData.items.map((item) => ({
        id: item.id,
        itemId: Number(item.itemId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      }));

      const finalData = {
        vendorCode: poData.vendorCode,
        notes: poData.notes,
        expectedDeliveryDate: poData.expectedDeliveryDate,
        items,
      };

      await axiosInstance.put(`/purchase-orders/update/${id}`, finalData);

      toast.success("Purchase Order Updated");
      navigate("/app/purchase-order-list");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update PO");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirement-container">
      <h2>Edit Purchase Order</h2>

      <form onSubmit={handleSubmit} className="requirement-form">
        <div className="form-grid-container">
          <div className="form-input">
            <label>
              Vendor <span className="mandatory">*</span>{" "}
            </label>
            <select
              value={poData.vendorCode}
              onChange={(e) =>
                setPoData({ ...poData, vendorCode: e.target.value })
              }
            >
              <option value="">Select Vendor</option>

              {vendors.map((v) => (
                <option key={v.vendorCode} value={v.vendorCode}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery */}
          <div className="form-input">
            <label>Expected Delivery</label>
            <input
              type="date"
              value={poData.expectedDeliveryDate}
              onChange={(e) =>
                setPoData({ ...poData, expectedDeliveryDate: e.target.value })
              }
            />
          </div>

          {/* Notes */}
          <div className="form-input full-width">
            <label>Comment</label>
            <textarea
              value={poData.notes}
              onChange={(e) => setPoData({ ...poData, notes: e.target.value })}
            />
          </div>
        </div>

        {/* Items */}

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
              >
                <option value="">Select Item</option>

                {itemsList.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
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
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>

            <div>
              <label>Price Per Unit</label>
              <input
                type="number"
                name="unitPrice"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, e)}
              />
            </div>
            <div style={{ marginTop: "25px" }}>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="primary-btn"
          style={{ marginLeft: "15px", marginBottom: "15px" }}
        >
          + Add Item
        </button>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Purchase Order"}
        </button>
      </form>
    </div>
  );
};

export default EditPurchaseOrder;
