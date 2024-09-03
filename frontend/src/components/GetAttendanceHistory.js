import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/StudentStatus.css";

const GetAttendanceHistory = () => {
  const { getStudentAttendanceHistory } = useContract();
  const [studentAddress, setStudentAddress] = useState("");
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const handleGetAttendanceHistory = async () => {
    try {
      const history = await getStudentAttendanceHistory(studentAddress);
      setAttendanceHistory(history);
    } catch (error) {
      console.error("Failed to retrieve attendance history:", error);
    }
  };

  return (
    <div className="student-status">
      <h3>Get Attendance History</h3>
      <input
        type="text"
        placeholder="Student Address"
        value={studentAddress}
        onChange={(e) => setStudentAddress(e.target.value)}
      />
      <button onClick={handleGetAttendanceHistory}>Get History</button>
      {attendanceHistory.length > 0 && (
        <div className="attendance-history">
          <h4>Attendance History:</h4>
          <ul>
            {attendanceHistory.map((sessionId) => (
              <li key={sessionId}>Session ID: {sessionId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetAttendanceHistory;