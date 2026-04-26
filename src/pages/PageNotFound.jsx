import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px",
      marginBottom: "100px",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "80px", margin: 0, color: "#111" }}>404</h1>
      <h2 style={{ color: "#374151", margin: "12px 0 8px" }}>Oops! Page Not Found</h2>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
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
          background: "#111",
          color: "#fff",
        }}
      >
        Go to Login
      </button>
    </div>
  );
}

export default PageNotFound;