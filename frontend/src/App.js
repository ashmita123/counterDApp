import React from "react";
import MarkAttendance from "./components/MarkAttendance";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <h1>Attendance DApp</h1>
      {/* Single Component for the New Contract */}
      <MarkAttendance />
    </div>
  );
}

export default App;
