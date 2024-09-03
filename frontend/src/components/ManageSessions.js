import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/InstructorPanel.css";

const ManageSessions = () => {
  const { openSession, closeSession, getSessionDetails } = useContract();
  const [sessionId, setSessionId] = useState("");
  const [sessionDetails, setSessionDetails] = useState(null);

  const handleOpenSession = async () => {
    try {
      await openSession(sessionId);
      alert(`Session ${sessionId} opened successfully`);
      handleViewSessionDetails();
    } catch (error) {
      console.error("Failed to open session:", error);
    }
  };

  const handleCloseSession = async () => {
    try {
      await closeSession(sessionId);
      alert(`Session ${sessionId} closed successfully`);
      setSessionDetails(null);
    } catch (error) {
      console.error("Failed to close session:", error);
    }
  };

  const handleViewSessionDetails = async () => {
    try {
      const details = await getSessionDetails(sessionId);
      setSessionDetails({
        title: details.title,
        startTime: new Date(details.startTime * 1000).toLocaleString(),
        endTime: new Date(details.endTime * 1000).toLocaleString(),
      });
    } catch (error) {
      console.error("Failed to get session details:", error);
    }
  };

  return (
    <div className="instructor-panel">
      <h3>Manage Sessions</h3>
      <input
        type="text"
        placeholder="Enter Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button onClick={handleOpenSession}>Open Session</button>
      <button onClick={handleCloseSession}>Close Session</button>
      <button onClick={handleViewSessionDetails}>View Details</button>

      {sessionDetails && (
        <div className="session-details">
          <h4>Session Details</h4>
          <p><strong>Title:</strong> {sessionDetails.title}</p>
          <p><strong>Start Time:</strong> {sessionDetails.startTime}</p>
          <p><strong>End Time:</strong> {sessionDetails.endTime}</p>
        </div>
      )}
    </div>
  );
};

export default ManageSessions;