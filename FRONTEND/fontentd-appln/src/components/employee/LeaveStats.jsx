import React from "react";
import "./LeaveStats.css";

const LeaveStats = () => {
  const leaveData = {
    casual: 12,
    earned: 15,
    sick: 8,
    usedCasual: 5,
    usedEarned: 7,
    usedSick: 2,
    pendingLeaves: 2,
    currentMonth: {
      approved: 3,
      pending: 1,
    },
  };

  const remaining = {
    casual: leaveData.casual - leaveData.usedCasual,
    earned: leaveData.earned - leaveData.usedEarned,
    sick: leaveData.sick - leaveData.usedSick,
  };

  return (
    <div className="leave-stats-container">
      <h2>Leave Balance & Stats</h2>

      <div className="leave-summary">
        <div className="stat-box casual">
          <h3>Casual Leave</h3>
          <p>Available: {remaining.casual}</p>
          <p>Used: {leaveData.usedCasual}</p>
        </div>

        <div className="stat-box earned">
          <h3>Earned Leave</h3>
          <p>Available: {remaining.earned}</p>
          <p>Used: {leaveData.usedEarned}</p>
        </div>

        <div className="stat-box sick">
          <h3>Sick Leave</h3>
          <p>Available: {remaining.sick}</p>
          <p>Used: {leaveData.usedSick}</p>
        </div>
      </div>

      <div className="status-summary">
        <div className="status-card pending">
          <h4>Pending Leaves</h4>
          <span>{leaveData.pendingLeaves}</span>
        </div>

        <div className="status-card approved">
          <h4>Current Month Approved</h4>
          <span>{leaveData.currentMonth.approved}</span>
        </div>

        <div className="status-card in-progress">
          <h4>Current Month Pending</h4>
          <span>{leaveData.currentMonth.pending}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveStats;
