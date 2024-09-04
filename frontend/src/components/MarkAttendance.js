import React, { useState } from "react";
import useContract from "../hooks/useContract";

const MarkAttendance = () => {
  const { markAttendance, getNumberAttending } = useContract();
  const [numberAttending, setNumberAttending] = useState(0);

  const handleMarkAttendance = async () => {
    try {
      await markAttendance();
      const total = await getNumberAttending();
      setNumberAttending(total);
      alert("Attendance marked successfully");
    } catch (error) {
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="mark-attendance">
      <h2>Attendance</h2>
      <button onClick={handleMarkAttendance}>I'm Here</button>
      <p>Total Attending: {numberAttending}</p>
    </div>
  );
};

export default MarkAttendance;
