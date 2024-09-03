// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attendance {
    address public mainInstructor;  // The deploying address is the first instructor
    mapping(address => bool) public isInstructor;  // Mapping to track instructor addresses
    uint256 public sessionCounter = 0; // Counter to ensure unique session IDs

    struct Session {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        address[] attendees;
    }

    mapping(uint256 => Session) public sessions;
    mapping(uint256 => mapping(address => bool)) public attendance;

    event AttendanceMarked(uint256 sessionId, address student, bool status);
    event InstructorAdded(address instructor);
    event SessionCreated(uint256 sessionId, string title, uint256 startTime, uint256 endTime);
    event SessionClosed(uint256 sessionId);

    modifier onlyInstructor() {
        require(isInstructor[msg.sender], "Only an instructor can perform this action");
        _;
    }

    modifier sessionIsOpen(uint256 sessionId) {
        require(sessions[sessionId].isActive, "Attendance session is not open");
        _;
    }

    constructor() {
        mainInstructor = msg.sender;
        isInstructor[msg.sender] = true;  // The deployer is the first instructor
    }

    function addInstructor(address instructor) external onlyInstructor {
        require(!isInstructor[instructor], "Already an instructor");
        isInstructor[instructor] = true;
        emit InstructorAdded(instructor);
    }

    function createSession(string memory title, uint256 startTime, uint256 endTime) external onlyInstructor returns (uint256) {
        sessionCounter++;
        uint256 sessionId = sessionCounter;

        Session storage newSession = sessions[sessionId];
        newSession.id = sessionId;
        newSession.title = title;
        newSession.startTime = startTime;
        newSession.endTime = endTime;
        newSession.isActive = false;

        emit SessionCreated(sessionId, title, startTime, endTime);
        return sessionId;
    }

    function openSession(uint256 sessionId) external onlyInstructor {
        require(!sessions[sessionId].isActive, "Session is already open");
        sessions[sessionId].isActive = true;
    }

    function closeSession(uint256 sessionId) external onlyInstructor {
        require(sessions[sessionId].isActive, "Session is not open");
        sessions[sessionId].isActive = false;
        emit SessionClosed(sessionId);
    }

    function markAttendance(uint256 sessionId) external sessionIsOpen(sessionId) {
        require(!attendance[sessionId][msg.sender], "Attendance already marked for this session");
        
        attendance[sessionId][msg.sender] = true;
        sessions[sessionId].attendees.push(msg.sender);

        emit AttendanceMarked(sessionId, msg.sender, true);
    }

    function getTotalAttendance(uint256 sessionId) external view onlyInstructor returns (uint256) {
        return sessions[sessionId].attendees.length;
    }

    function getAttendanceStatus(uint256 sessionId) external view returns (bool) {
        return attendance[sessionId][msg.sender];
    }

    function getSessionDetails(uint256 sessionId) external view returns (string memory, uint256, uint256, bool, address[] memory) {
        Session storage session = sessions[sessionId];
        return (session.title, session.startTime, session.endTime, session.isActive, session.attendees);
    }

    function getStudentAttendanceHistory(address student) external view returns (uint256[] memory) {
        uint256[] memory attendedSessions = new uint256[](sessionCounter);
        uint256 count = 0;

        for (uint256 i = 1; i <= sessionCounter; i++) {
            if (attendance[i][student]) {
                attendedSessions[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = attendedSessions[i];
        }

        return result;
    }
}
