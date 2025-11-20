import { useNavigate } from "react-router-dom";
import "./EmployeeHome.css";

const EmployeeHome = () => {
  const navigate = useNavigate();

  const tiles = [
    { label: "Apply for Leave", color: "#1abc9c", route: "/employee/leave-request" },
    { label: "Profile Management", color: "#3498db", route: "/employee/profile" },
    { label: "Payslip", color: "#9b59b6", route: "/employee/payslip" },
    { label: "Performance", color: "#e67e22", route: "/employee/performance" },
    { label: "HR queries", color: "#e74c3c", route: "/employee/hr-queries" },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Employee Dashboard</h1>
      <div className="tile-grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            style={{ backgroundColor: tile.color }}
            onClick={() => navigate(tile.route)}
          >
            {tile.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeHome;
