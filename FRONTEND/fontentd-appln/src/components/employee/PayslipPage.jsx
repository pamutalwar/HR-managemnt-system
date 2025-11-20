import React, { useEffect, useState } from "react";
import "./PayslipPage.css";

const PayslipPage = () => {
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    const dummyData = [
      { month: "January 2025", amount: 45000, status: "Paid" },
      { month: "February 2025", amount: 45500, status: "Paid" },
      { month: "March 2025", amount: 46000, status: "Processing" },
    ];
    setPayslips(dummyData);
  }, []);

  return (
    <div className="payslip-container">
      <div className="payslip-card">
        <h1 className="payslip-title">Payslip Details</h1>
        <table className="payslip-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr key={i}>
                <td>{p.month}</td>
                <td>₹{p.amount.toLocaleString()}</td>
                <td>
                  <span
                    className={`status-badge ${
                      p.status === "Paid" ? "paid" : "processing"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                    className="download-button"
                    onClick={() => alert(`Downloading payslip for ${p.month}`)}
                  >
                    ⬇ Download
                  </button>
                </td>
              </tr>
            ))}
            {payslips.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No payslip records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayslipPage;
