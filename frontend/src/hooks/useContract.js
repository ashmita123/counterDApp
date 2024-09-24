import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Counter from '../contracts/Counter.json';

const useContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const loadedContract = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_ADDRESS,
          Counter.abi,
          signer
        );
        setContract(loadedContract);
      } else {
        console.error('Ethereum provider not available');
      }
    };

    loadContract();
  }, []);

  const performAction = useCallback(async (action, value) => {
    if (!contract) {
      console.error("Contract is not loaded");
      return;
    }
    try {
      const tx = await contract[action](value);
      await tx.wait();
      return await contract.value();  // Fetch updated value after transaction
    } catch (error) {
      console.error(`${action} Error:`, error);
    }
  }, [contract]);

  return {
    initializeCounter: (value) => performAction('initialize', value),
    incrementCounter: (value) => performAction('increment', value),
    decrementCounter: (value) => performAction('decrement', value),
    getCurrentValue: async () => {
      if (!contract) {
        console.error("Contract is not loaded");
        return;
      }
      return await contract.value();
    }
  };
};

export default useContract;
