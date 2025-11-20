import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./LeaveApplicationForm.css";

export default function LeaveApplicationForm() {
  const [formData, setFormData] = useState({
    contactNumber: "",
    startDate: "",
    endDate: "",
    leaveType: "",
    days: 0,
    reason: "",
    documents: [],
  });

  const [submittedLeaves, setSubmittedLeaves] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFormData({ ...formData, documents: acceptedFiles });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 * 1024,
  });

  const handleSubmit = () => {
    if (
      !formData.contactNumber ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.leaveType ||
      !formData.reason
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const newLeave = {
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: formData.days,
      reason: formData.reason,
      status: "Pending",
    };

    setSubmittedLeaves([...submittedLeaves, newLeave]);

    setFormData({
      contactNumber: "",
      startDate: "",
      endDate: "",
      leaveType: "",
      days: 0,
      reason: "",
      documents: [],
    });
  };

  return (
    <div className="form-container">
      <div className="layout">
        {/* Sidebar */}
        <div className="calendar-sidebar">
          <h2>📅 June, 2025</h2>
          <div className="calendar-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="day-label">{d}</div>
            ))}
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className={i === 16 ? "day-selected" : "day"}>{i + 1}</div>
            ))}
          </div>
          <hr />
          <div className="legend">
            <div><span className="color-box red"></span>Holiday</div>
            <div><span className="color-box yellow"></span>Planned Leave</div>
            <div><span className="color-box green"></span>Approved Leave</div>
            <div><span className="color-box blue"></span>Pending Leave</div>
          </div>
          <p className="note"><strong>Rath Yatra:</strong> Fri, 27 June</p>
        </div>

        {/* Form */}
        <div className="form-section">
          <h2>Leave Application</h2>
          <label>Contact Number*</label>
          <input
            type="text"
            value={formData.contactNumber}
            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
          />

          <div className="form-row">
            <div>
              <label>Start Date*</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label>End Date*</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div>
              <label>Leave Type*</label>
              <select
                value={formData.leaveType}
                onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
              >
                <option value="">Select</option>
                <option value="CL">Casual Leave</option>
                <option value="SL">Sick Leave</option>
                <option value="EL">Earned Leave</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>No. of Days</label>
              <input
                type="number"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
              />
            </div>
            <div>
              <label>Reason*</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>

          <label>Upload Documents</label>
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drop files here or click to upload</p>
          </div>

          <div className="btn-row">
            <button className="submit" onClick={handleSubmit}>Submit</button>
            <button className="draft">Save As Draft</button>
            <button className="reset" onClick={() =>
              setFormData({
                contactNumber: "",
                startDate: "",
                endDate: "",
                leaveType: "",
                days: 0,
                reason: "",
                documents: [],
              })
            }>Reset All</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <h2>Leave Application Status</h2>
        {submittedLeaves.length === 0 ? (
          <p>No leave applications submitted yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submittedLeaves.map((leave, idx) => (
                <tr key={idx}>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>{leave.days}</td>
                  <td>{leave.reason}</td>
                  <td className="pending">{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
