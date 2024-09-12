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

  const markAttendance = async () => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const tx = await contract.IM_HERE(); // No Ether is sent
      await tx.wait();
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  };

  // Function to get the number of attendees
  const getNumberAttending = async () => {
    if (!contract) throw new Error("Contract is not loaded");

    try {
      const total = await contract.numberAttending();
      return total.toNumber();
    } catch (error) {
      console.error("Error getting total attendance:", error);
      throw error;
    }
  };

  return {
    contract,
    provider,
    signer,
    markAttendance,
    getNumberAttending,
  };
};

export default useContract;
