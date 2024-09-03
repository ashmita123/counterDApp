import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/StudentStatus.css";

const GetAttendanceStatus = () => {
  const { getAttendanceStatus } = useContract();
  const [sessionId, setSessionId] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  const handleGetAttendanceStatus = async () => {
    try {
      const status = await getAttendanceStatus(sessionId);
      setAttendanceStatus(status);
    } catch (error) {
      console.error("Failed to retrieve attendance status:", error);
    }
  };

  return (
    <div className="student-status">
      <h3>Check Attendance Status</h3>
      <input
        type="number"
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button onClick={handleGetAttendanceStatus}>Get Attendance Status</button>
      {attendanceStatus !== null && (
        <p>Your attendance status for session {sessionId} is {attendanceStatus ? "Present" : "Absent"}.</p>
      )}
    </div>
  );
};

export default GetAttendanceStatus;
