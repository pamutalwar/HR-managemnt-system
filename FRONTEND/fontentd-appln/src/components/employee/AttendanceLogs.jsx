import React from "react";
import "./AttendanceLogs.css";

const AttendanceLogs = () => {
  const logs = [
    { date: "2025-06-10", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
    { date: "2025-06-11", checkIn: "09:30 AM", checkOut: "06:15 PM", status: "Present" },
    { date: "2025-06-12", checkIn: "", checkOut: "", status: "Absent" },
    { date: "2025-06-13", checkIn: "10:00 AM", checkOut: "05:00 PM", status: "Late" },
  ];

  return (
    <div className="attendance-container">
      <div className="attendance-box">
        <h2 className="attendance-title">Attendance Logs</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.date}</td>
                <td>{log.checkIn || "--"}</td>
                <td>{log.checkOut || "--"}</td>
                <td>
                  <span
                    className={`status-tag ${
                      log.status === "Present"
                        ? "present"
                        : log.status === "Absent"
                        ? "absent"
                        : "late"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLogs;
