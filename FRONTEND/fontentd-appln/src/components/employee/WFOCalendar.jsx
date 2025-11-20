import React from "react";
import "./WFOCalendar.css";

const calendarData = [
  { date: "02", status: "office", hours: "7-9", location: "Siruseri,Chennai" },
  { date: "03", status: "office", hours: "7-9", location: "Siruseri,Chennai" },
  { date: "04", status: "office", hours: "7-9", location: "Siruseri,Chennai" },
  { date: "05", status: "office", hours: "7-9", location: "Siruseri,Chennai" },
  { date: "06", status: "office", hours: "5-7", location: "Siruseri,Chennai" },
  { date: "09", status: "noshow" },
  { date: "10", status: "noshow" },
  { date: "11", status: "leave" },
  { date: "12", status: "leave" },
  { date: "13", status: "office", hours: "7-9", location: "Siruseri,Chennai" },
  { date: "16", status: "awaited" },
];

const getStatusClass = (status) => {
  switch (status) {
    case "office":
      return "day office";
    case "noshow":
      return "day noshow";
    case "leave":
      return "day leave";
    case "awaited":
      return "day awaited";
    default:
      return "day";
  }
};

const WFOCalendar = () => {
  return (
    <div className="calendar-container">
      <h1>My WFO - June 2025</h1>
      <div className="calendar-grid">
        {Array.from({ length: 30 }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          const data = calendarData.find((d) => d.date === day);
          return (
            <div key={day} className={getStatusClass(data?.status)}>
              <div className="date">{day}</div>
              {data && (
                <>
                  {data.status === "office" && (
                    <>
                      <div className="info">At Office | {data.hours} Hrs</div>
                      <div className="info">{data.location}</div>
                    </>
                  )}
                  {data.status === "noshow" && <div className="info red">No Show</div>}
                  {data.status === "leave" && <div className="info">Leave</div>}
                  {data.status === "awaited" && <div className="info">Details Awaited</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="note">
        <ul>
          <li>If status is shown as “No Show”, raise WFO Exception in GESS.</li>
          <li>Attendance at multiple locations is shown as "Location ++".</li>
          <li>Leaves must be approved before the 12th of next month to be counted.</li>
        </ul>
      </div>
    </div>
  );
};

export default WFOCalendar;
