import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/MarkAttendance.css";

const MarkAttendance = () => {
  const { contract } = useContract();
  const [sessionId, setSessionId] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);

  const markAttendance = async () => {
    try {
      await contract.markAttendance(sessionId);
      setSuccessMessage(`Attendance for session ID ${sessionId} marked successfully!`);
      setSessionId("");
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      setSuccessMessage("Failed to mark attendance. Please try again.");
    }
  };

  return (
    <div className="mark-attendance">
      <h2>Mark Attendance</h2>
      <div>
        <label>Session ID:</label>
        <input
          type="number"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <button onClick={markAttendance}>Mark Attendance</button>
      </div>

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
