import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>DashBoard</h2>
      </header>
    </div>
  );
};

export default Dashboard;



// import React from "react";
// import "../styles/dashboard.css";
// import { FaBoxes, FaExclamationTriangle, FaTruck, FaFileAlt, FaUsers } from "react-icons/fa";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const purchaseData = [
//   { month: "Jan", amount: 20000 },
//   { month: "Feb", amount: 35000 },
//   { month: "Mar", amount: 18000 },
//   { month: "Apr", amount: 42000 }
// ];

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">

//       {/* Summary Cards */}
//       <div className="grid grid-6">

//         <Card title="Total Items" value="420" icon={<FaBoxes />} />
//         <Card title="Low Stock" value="12" icon={<FaExclamationTriangle />} />
//         <Card title="Pending PO" value="5" icon={<FaTruck />} />
//         <Card title="Purchase Requests" value="8" icon={<FaFileAlt />} />
//         <Card title="Vendors" value="16" icon={<FaUsers />} />
//         <Card title="Purchases (Month)" value="₹42,000" icon={<FaFileAlt />} />

//       </div>

//       {/* Low Stock + Requests */}
//       <div className="grid grid-2">

//         <div className="card">
//           <h2 className="section-title">Low Stock Alerts</h2>

//           <table>
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th>Stock</th>
//                 <th>Min</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td>A4 Paper</td>
//                 <td>20</td>
//                 <td>50</td>
//                 <td className="status-low">Low</td>
//               </tr>

//               <tr>
//                 <td>Lab Gloves</td>
//                 <td>10</td>
//                 <td>30</td>
//                 <td className="status-low">Low</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="card">
//           <h2 className="section-title">Purchase Requests</h2>

//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Department</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td>PR-301</td>
//                 <td>Science</td>
//                 <td className="status-pending">Pending</td>
//               </tr>

//               <tr>
//                 <td>PR-300</td>
//                 <td>Office</td>
//                 <td className="status-approved">Approved</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* Purchase Orders + Vendors */}
//       <div className="grid grid-2">

//         <div className="card">
//           <h2 className="section-title">Recent Purchase Orders</h2>

//           <table>
//             <thead>
//               <tr>
//                 <th>PO</th>
//                 <th>Vendor</th>
//                 <th>Amount</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td>PO-1021</td>
//                 <td>ABC Suppliers</td>
//                 <td>₹12,000</td>
//               </tr>

//               <tr>
//                 <td>PO-1020</td>
//                 <td>Stationery Hub</td>
//                 <td>₹3,200</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="card">
//           <h2 className="section-title">Vendor Overview</h2>

//           <table>
//             <thead>
//               <tr>
//                 <th>Vendor</th>
//                 <th>Orders</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr>
//                 <td>ABC Suppliers</td>
//                 <td>15</td>
//               </tr>

//               <tr>
//                 <td>Stationery Hub</td>
//                 <td>8</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//       </div>

//       {/* Chart */}
//       <div className="card">
//         <h2 className="section-title">Monthly Purchases</h2>

//         <div className="chart-container">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={purchaseData}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3}/>
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//     </div>
//   );
// };

// const Card = ({ title, value, icon }) => {
//   return (
//     <div className="card summary-card">
//       <div>
//         <p>{title}</p>
//         <h3>{value}</h3>
//       </div>

//       <div className="icon">{icon}</div>
//     </div>
//   );
// };

// export default Dashboard;
