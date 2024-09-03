import React from "react";
import AddInstructor from "./components/AddInstructor";
import CreateSession from "./components/CreateSession";
import ManageSessions from "./components/ManageSessions";
import MarkAttendance from "./components/MarkAttendance";
import GetAttendanceStatus from "./components/GetAttendanceStatus";
import GetAttendanceHistory from "./components/GetAttendanceHistory";
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <h1>Attendance DApp</h1>
      
      {/* Instructor Section */}
      <section>
        <h2>Instructor Section</h2>
        <AddInstructor />
        <CreateSession />
        <ManageSessions />
      </section>

      {/* Student Section */}
      <section>
        <h2>Student Section</h2>
        <MarkAttendance />
        <GetAttendanceStatus />
        <GetAttendanceHistory />
      </section>
    </div>
  );
}

export default App;
