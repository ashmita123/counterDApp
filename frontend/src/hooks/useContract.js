import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Attendance from "../contracts/Attendance.json";

const useContract = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      setSigner(signer);

      const contract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        Attendance.abi,
        signer
      );
      setContract(contract);
    };

    loadProvider();
  }, []);

  const createSession = async (title, startTime, endTime) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const tx = await contract.createSession(title, startTime, endTime);
      const receipt = await tx.wait();
      const sessionId = receipt.events[0].args.sessionId;
      return sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const openSession = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const tx = await contract.openSession(sessionId);
      await tx.wait();
    } catch (error) {
      console.error("Error opening session:", error);
      throw error;
    }
  };

  const closeSession = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const tx = await contract.closeSession(sessionId);
      await tx.wait();
    } catch (error) {
      console.error("Error closing session:", error);
      throw error;
    }
  };

  const markAttendance = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const tx = await contract.markAttendance(sessionId);
      await tx.wait();
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  };

  const getSessionDetails = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const details = await contract.getSessionDetails(sessionId);
      return {
        title: details[0],
        startTime: details[1].toNumber(),
        endTime: details[2].toNumber(),
        isActive: details[3],
        attendees: details[4],
      };
    } catch (error) {
      console.error("Error getting session details:", error);
      throw error;
    }
  };

  const getTotalAttendance = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const total = await contract.getTotalAttendance(sessionId);
      return total.toNumber();
    } catch (error) {
      console.error("Error getting total attendance:", error);
      throw error;
    }
  };

  const getAttendanceStatus = async (sessionId) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const status = await contract.getAttendanceStatus(sessionId);
      return status;
    } catch (error) {
      console.error("Error getting attendance status:", error);
      throw error;
    }
  };

  const getStudentAttendanceHistory = async (studentAddress) => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const history = await contract.getStudentAttendanceHistory(studentAddress);
      return history.map((sessionId) => sessionId.toNumber());
    } catch (error) {
      console.error("Error getting student attendance history:", error);
      throw error;
    }
  };

  return {
    contract,
    provider,
    signer,
    createSession,
    openSession,
    closeSession,
    markAttendance,
    getSessionDetails,
    getTotalAttendance,
    getAttendanceStatus,
    getStudentAttendanceHistory,
  };
};

export default useContract;
