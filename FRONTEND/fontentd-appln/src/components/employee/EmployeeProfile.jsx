import React, { useState } from "react";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    name: "Arun Kumar",
    email: "arun@example.com",
    phone: "9876543210",
    department: "Engineering",
    designation: "Software Engineer",
    location: "Bangalore",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Employee Profile</h2>

        <div className="profile-grid">
          {[
            { label: "Full Name", name: "name" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone Number", name: "phone" },
            { label: "Department", name: "department" },
            { label: "Designation", name: "designation" },
            { label: "Location", name: "location" },
          ].map((field) => (
            <div key={field.name} className="profile-field">
              <label>{field.label}</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={profile[field.name]}
                onChange={handleChange}
                disabled={!isEditing}
                className={isEditing ? "editable" : "readonly"}
              />
            </div>
          ))}
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <button className="btn update-btn" onClick={handleUpdate}>
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
