import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "sans-serif",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: "80px", margin: 0, color: "#111" }}>403</h1>
      <h2 style={{ color: "#374151", margin: "12px 0 8px" }}>
        Access Denied
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        You don’t have permission to view this page. Please contact your
        administrator or return to a safe location.
      </p>

      <div>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#111",
          }}
        >
          ← Go Back
        </button>



        <button
          onClick={() => navigate("/login")}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
          }}
        >
          Login with Different Account
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;