import React, { useState } from "react";
import useContract from "../hooks/useContract";
import "../styles/InstructorPanel.css";

const AddInstructor = () => {
  const { contract } = useContract();
  const [instructorAddress, setInstructorAddress] = useState("");

  const handleAddInstructor = async () => {
    try {
      await contract.addInstructor(instructorAddress);
      alert(`Instructor added: ${instructorAddress}`);
      setInstructorAddress("");
    } catch (error) {
      console.error("Failed to add instructor:", error);
      alert("Failed to add instructor");
    }
  };

  return (
    <div className="instructor-panel">
      <h3>Add Instructor</h3>
      <input
        type="text"
        placeholder="Instructor Address"
        value={instructorAddress}
        onChange={(e) => setInstructorAddress(e.target.value)}
      />
      <button onClick={handleAddInstructor}>Add Instructor</button>
    </div>
  );
};

export default AddInstructor;
