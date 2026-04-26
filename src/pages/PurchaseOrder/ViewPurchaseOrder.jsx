import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { FiShoppingCart, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "../../styles/ViewPage.css";
import toast from "react-hot-toast";

const ViewPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [requiredQties, setRequiredQties] = useState({});

  const fetchPO = async () => {
    try {
      const res = await axiosInstance.get(`/purchase-orders/get/${id}`);
      setPo(res.data);
      setComment(res.data.notes || "");
      setRequiredQties(
        res.data.items.reduce((acc, it) => {
          acc[it.id] = it.requiredQuantity ?? 0;
          return acc;
        }, {}));
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get(
        `/purchase-orders/activity-log/${id}`,
      );
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPO();
    fetchLogs();
  }, [id]);

  const submitPO = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/purchase-orders/${id}/submit`);
      toast.success("PO Submitted");
      fetchPO();
      await fetchLogs();
    } catch {
      toast.error("Submit failed");
    } finally {
      setLoading(false);
    }
  };

  const approvePO = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/purchase-orders/${id}/approve`);
      toast.success("PO Approved");
      fetchPO();
      await fetchLogs();
    } catch {
      toast.error("Approve failed");
    } finally {
      setLoading(false);
    }
  };

  const cancelPO = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/purchase-orders/${id}/reject`);
      toast.success("PO Cancelled");
      fetchPO();
      await fetchLogs();
    } catch {
      toast.error("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================== Update Received Qty + Comment + Status ====================

  // const updateReceivedQtyAndStatus = async (newStatus) => {
  //   try {
  //     setLoading(true);

  //     const payload = {
  //       notes: comment,
  //       status: newStatus,
  //       items: Object.entries(requiredQties).map(([itemId, qty]) => ({
  //         itemId: parseInt(itemId),
  //         receivedQuantity: qty,
  //       })),
  //     };

  //     await axiosInstance.patch(`/statusupdate/${id}`, payload);

  //     toast.success(`PO marked as ${newStatus.replace("_", " ")}`);
  //     fetchPO();
  //     await fetchLogs();
  //   } catch {
  //     toast.error("Failed to update purchase order");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const updateReceivedQtyAndStatus = async (newStatus) => {
    try {
      setLoading(true);

      const payload = {
        
        notes: comment,
        status: newStatus,
        items: Object.entries(requiredQties).map(([itemId, qty]) => ({
          id: parseInt(itemId),       // ✅ matches itemReq.getId()
          received_quantity: qty,     // ✅ matches itemReq.getReceived_quantity()
        })),
      };

      await axiosInstance.put(`/purchase-orders/statusupdate/${id}`, payload);  // ✅ PUT + correct URL

      toast.success(`PO marked as ${newStatus.replace("_", " ")}`);
      fetchPO();
      await fetchLogs();
    } catch {
      toast.error("Failed to update purchase order");
    } finally {
      setLoading(false);
    }
  };

  //================= Sorting Activity Logs =================

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.changedAt) - new Date(a.changedAt),
  );

  if (!po) return <p>Loading...</p>;

  return (
    <div className="review-container">
      <div className="review-header">
        <h2>Purchase Order Details</h2>{" "}
        <span className={`status-badge ${po.status.toLowerCase()}`}>
          {po.status}
        </span>
      </div>

      {/* Purchase Order Section */}
      <div className="review-card full-width">
        <h3 className="section-title">
          <FiShoppingCart className="section-icon" />
          Order Information
        </h3>

        <div className="info-grid">
          <p>
            <strong>PO Number:</strong> {po.poNumber}
          </p>
          <p>
            <strong>Order Date:</strong> {po.orderDate}
          </p>
          <p>
            <strong>Expected Delivery:</strong> {po.expectedDeliveryDate}
          </p>
          <p>
            <strong>Status:</strong> {po.status}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹{po.totalAmount}
          </p>
          {/* <p>
            <strong>Comment:</strong> {po.notes}
          </p> */}

        </div>
      </div>

      {/* Vendor Section */}
      <div className="review-card full-width">
        <h3 className="section-title">
          <FiUser className="section-icon" />
          Vendor Information
        </h3>

        <div className="info-grid">
          <p>
            <strong>Name:</strong> {po.vendor?.name}
          </p>
          <p>
            <strong>Vendor Code:</strong> {po.vendor?.vendorCode}
          </p>
          <p>
            <strong>Contact Person:</strong> {po.vendor?.contact_person}
          </p>
          <p>
            <strong>Phone:</strong> {po.vendor?.phone}
          </p>
          <p>
            <strong>Email:</strong> {po.vendor?.email}
          </p>
          <p>
            <strong>Address:</strong> {po.vendor?.address}
          </p>
          <p>
            <strong>GST ID:</strong> {po.vendor?.gst_id}
          </p>
          <p>
            <strong>PAN ID:</strong> {po.vendor?.pan_id}
          </p>
        </div>
      </div>

      <div className="review-card full-width">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 className="section-title">Items</h3>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Recieved Qty</th>
              <th>Unit Price</th>
              <th>Total</th>

            </tr>
          </thead>

          <tbody>
            {po.items?.map((it) => (
              <tr key={it.id}>
                <td>{it.item?.name ?? "—"}</td>
                <td>{it.item?.unit ?? "—"}</td>
                <td>{it.quantity}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={requiredQties[it.id] ?? 0}
                    onChange={(e) =>
                      setRequiredQties((prev) => ({
                        ...prev,
                        [it.id]: parseInt(e.target.value) || 0,
                      }))
                    }
                    disabled={po.status === "CANCELLED" || po.status === "DRAFT"}
                    style={{
                      width: "80px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #d1d5db",
                      textAlign: "center",
                      fontSize: "14px",
                      backgroundColor: po.status === "CANCELLED" || po.status === "CLOSED" ? "#f3f4f6" : "#ffffff",
                    }}
                  />
                </td>
                <td>₹{it.unitPrice}</td>
                <td>₹{it.totalPrice}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <div className="review-card full-width">
        <h3 className="section-title">Audit Info</h3>

        <div className="info-grid">
          <p>
            <strong>Created By:</strong> {po.createdBy?.first_name}
          </p>
          <p>
            <strong>Approved By:</strong> {po.approvedBy?.first_name}
          </p>
          <p>
            <strong>Created At:</strong> {po.createdAt}
          </p>
          <p>
            <strong>Updated At:</strong> {po.updatedAt}
          </p>
        </div>
        {/* Comment */}
        <div className="comment-section">
          <div className="comment-input-wrapper">
            <label className="comment-label">Comment:</label>
            <textarea
              className="comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Add a comment..."
              disabled={po.status === "CANCELLED" || po.status === "CLOSED"}
            />
          </div>
        </div>
      </div>

      {showLogs && (
        <div className="review-card full-width">
          <h3 className="section-title">Activity Log Info</h3>

          {sortedLogs.length > 0 ? (
            sortedLogs.map((log) => (
              <div key={log.id} className="log-item">
                <p>
                  <strong>{log.description}</strong>
                </p>
                <p>By: {log.changedBy?.first_name}</p>
                <p>On: {new Date(log.changedAt).toLocaleString()}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No activity logs found</p>
          )}
        </div>
      )}

      <div className="btn-group">
        <div>
          <button className="primary-btn" onClick={() => navigate(-1)}>
            Back
          </button>

          <button
            className="secondary-btn"
            onClick={() => setShowLogs((prev) => !prev)}
          >
            {showLogs ? "Hide Activity Log" : "Show Activity Log"}
          </button>
        </div>




        <div className="action-buttons">

          {/* ===== STORE MANAGER ACTIONS ===== */}

          {/* DRAFT — Submit & Cancel */}
          {po.status === "DRAFT" && ["STORE_MANAGER"].includes(user?.role) && (
            <>
              <button className="primary-btn" onClick={submitPO} disabled={loading}>
                Submit
              </button>
              <button className="cancel-btn" onClick={cancelPO} disabled={loading}>
                Cancel
              </button>
            </>
          )}

          {/* REJECTED — Resubmit */}
          {po.status === "REJECTED" && ["STORE_MANAGER"].includes(user?.role) && (
            <button className="primary-btn"
              // onClick={resubmitPO} 
              disabled={loading}>
              Resubmit
            </button>
          )}

          {/* ===== ADMIN ACTIONS ===== */}

          {/* SUBMITTED — Approve & Reject */}
          {po.status === "SUBMITTED" && ["ADMIN"].includes(user?.role) && (
            <>
              <button className="primary-btn" onClick={approvePO} disabled={loading}>
                Approve
              </button>
              <button className="cancel-btn" 
              onClick={cancelPO} 
              disabled={loading}>
                Reject
              </button>
            </>
          )}

          {/* ===== ADMIN & STORE MANAGER ACTIONS ===== */}

          {/* APPROVED — Partial Received & Not Completed */}
          {po.status === "APPROVED" && ["ADMIN", "STORE_MANAGER"].includes(user?.role) && (
            <>
              <button
                className="primary-btn"
                onClick={() => updateReceivedQtyAndStatus("PARTIALLY_COMPLETED")}
                disabled={loading}
              >
                Mark Partial Completed
              </button>

              <button
                className="cancel-btn"
                onClick={() => updateReceivedQtyAndStatus("NOT_COMPLETED")}
                disabled={loading}
              >
                Mark Not Completed
              </button>

              <button
                className="primary-btn"
                onClick={() => updateReceivedQtyAndStatus("COMPLETED")}
                disabled={loading}
              >
                Mark Completed
              </button>
            </>
          )}

          {/* ===== TERMINAL STATES — No Actions ===== */}
          {["COMPLETED", "NOT_COMPLETED", "CANCELLED"].includes(po.status) && (
            <span style={{ fontSize: "14px", color: "#6b7280" }}>
              No actions available for {po.status.replace("_", " ")} orders.
            </span>
          )}

        </div>

      </div>
    </div>
  );
};

export default ViewPurchaseOrder;
