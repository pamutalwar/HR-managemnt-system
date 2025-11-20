import React, { useState } from "react";
import "./HRQueries.css";

const HRQueries = () => {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
  });

  const [queries, setQueries] = useState([
    {
      id: 1,
      subject: "Salary clarification",
      message: "I need a breakdown of my latest payslip.",
      status: "Pending",
    },
    {
      id: 2,
      subject: "Leave extension request",
      message: "Can I extend my medical leave by 2 more days?",
      status: "Resolved",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuery = {
      id: queries.length + 1,
      subject: formData.subject,
      message: formData.message,
      status: "Pending",
    };
    setQueries([newQuery, ...queries]);
    setFormData({ subject: "", message: "" });
  };

  return (
    <div className="hr-container">
      <div className="hr-box">
        <h2 className="hr-title">HR Queries</h2>

        <form onSubmit={handleSubmit} className="hr-form">
          <div>
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Message</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Submit Query</button>
        </form>

        <hr />

        <h3>Your Queries</h3>
        <ul className="query-list">
          {queries.map((q) => (
            <li key={q.id} className="query-item">
              <div>
                <p className="query-subject">{q.subject}</p>
                <p className="query-message">{q.message}</p>
              </div>
              <span className={`status ${q.status === "Resolved" ? "resolved" : "pending"}`}>
                {q.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HRQueries;
