import React from "react";
import "./TrainingCertificates.css";

const TrainingCertificates = () => {
  const trainings = [
    {
      id: 1,
      title: "React Fundamentals",
      provider: "Coursera",
      date: "2025-05-20",
      status: "Completed",
      certificateLink: "#"
    },
    {
      id: 2,
      title: "Spring Boot API Development",
      provider: "Udemy",
      date: "2025-06-10",
      status: "In Progress",
      certificateLink: null
    },
    {
      id: 3,
      title: "Effective Communication Skills",
      provider: "TCS iON",
      date: "2025-04-05",
      status: "Completed",
      certificateLink: "#"
    }
  ];

  return (
    <div className="training-container">
      <div className="training-box">
        <h2 className="training-title">Training & Certifications</h2>
        <table className="training-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Status</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((course) => (
              <tr key={course.id}>
                <td>{course.title}</td>
                <td>{course.provider}</td>
                <td>{course.date}</td>
                <td>
                  <span
                    className={`status-badge ${
                      course.status === "Completed"
                        ? "completed"
                        : "in-progress"
                    }`}
                  >
                    {course.status}
                  </span>
                </td>
                <td>
                  {course.certificateLink ? (
                    <a
                      href={course.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certificate-link"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <span className="no-certificate">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingCertificates;
