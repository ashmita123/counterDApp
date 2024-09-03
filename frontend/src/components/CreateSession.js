import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/InstructorPanel.css";
import { ethers } from "ethers"; 

const CreateSession = () => {
  const { createSession } = useContract();
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionDetails, setSessionDetails] = useState(null);

  const handleCreateSession = async () => {
    try {
      const startTimestamp = new Date(startTime).getTime() / 1000;
      const endTimestamp = new Date(endTime).getTime() / 1000;
      const id = await createSession(title, startTimestamp, endTimestamp);


      const sessionId = ethers.BigNumber.from(id).toString();

      setSessionDetails({
        id: sessionId,
        title,
        startTime: new Date(startTimestamp * 1000).toLocaleString(),
        endTime: new Date(endTimestamp * 1000).toLocaleString(),
      });

      setTitle("");
      setStartTime("");
      setEndTime("");
      
      alert(`Session created with ID: ${sessionId}`);
    } catch (error) {
      console.error("Failed to create session:", error);
      alert("Failed to create session");
    }
  };

  return (
    <div className="instructor-panel">
      <h3>Create Session</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleCreateSession}>Create Session</button>

      {sessionDetails && (
        <div className="session-details">
          <h4>Session Created</h4>
          <p><strong>ID:</strong> {sessionDetails.id}</p>
          <p><strong>Title:</strong> {sessionDetails.title}</p>
          <p><strong>Start Time:</strong> {sessionDetails.startTime}</p>
          <p><strong>End Time:</strong> {sessionDetails.endTime}</p>
        </div>
      )}
    </div>
  );
};

export default CreateSession;
