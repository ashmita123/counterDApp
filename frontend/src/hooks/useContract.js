import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Counter from "../contracts/Counter.json";

const useContract = (walletAddress) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (window.ethereum && walletAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const loadedContract = new ethers.Contract(
            process.env.REACT_APP_CONTRACT_ADDRESS,
            Counter.abi,
            signer
          );
          setContract(loadedContract);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    };

    loadContract();
  }, [walletAddress]);

  const performAction = useCallback(
    async (action, value) => {
      if (!contract) {
        console.error("Contract is not loaded");
        throw new Error("Contract is not loaded");
      }
      try {
        const tx = await contract[action](value);
        await tx.wait();
        return await contract.value();
      } catch (error) {
        console.error(`${action} Error:`, error);
        throw error;
      }
    },
    [contract]
  );

  return {
    initializeCounter: (value) => performAction("initialize", value),
    incrementCounter: (value) => performAction("increment", value),
    decrementCounter: (value) => performAction("decrement", value),
    getCurrentValue: async () => {
      if (!contract) {
        console.error("Contract is not loaded");
        throw new Error("Contract is not loaded");
      }
      return await contract.value();
    },
  };
};

export default useContract;
