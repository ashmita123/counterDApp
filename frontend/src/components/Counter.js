import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import useContract from "../hooks/useContract";
import countryData from "../data/flags.json";
import "../styles/App.css";

const CounterComponent = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [initializationError, setInitializationError] = useState(null);

  const {
    initializeCounter,
    incrementCounter,
    decrementCounter,
    getCurrentValue,
    contract,
  } = useContract(walletAddress);

  const [currentValue, setCurrentValue] = useState(null);
  const [currentFlag, setCurrentFlag] = useState("");
  const [countryName, setCountryName] = useState("");

  const assignFlagToAddress = (address) => {
    if (!address) return;
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(address));
    const num = parseInt(hash.slice(-8), 16);
    const index = num % countryData.length;
    const assignedCountry = countryData[index];
    setCurrentFlag(assignedCountry.flag);
    setCountryName(assignedCountry.name);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setWalletAddress(account);
        assignFlagToAddress(account);
        setError(null);
        setInitializationError(null);
      } catch (err) {
        setError("Connection rejected by user.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to use this app.");
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            const account = ethers.utils.getAddress(accounts[0]);
            setWalletAddress(account);
            assignFlagToAddress(account);
            setError(null);
            setInitializationError(null);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const account = ethers.utils.getAddress(accounts[0]);
          setWalletAddress(account);
          assignFlagToAddress(account);
          setError(null);
          setInitializationError(null);
        } else {
          setWalletAddress(null);
          setCurrentFlag("");
          setCountryName("");
          setError("Please connect to MetaMask.");
          setInitializationError(null);
        }
      };

      const handleChainChanged = (_chainId) => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  useEffect(() => {
    const fetchCurrentValue = async () => {
      if (contract) {
        try {
          const value = await getCurrentValue();
          setCurrentValue(value.toNumber());
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCurrentValue();
  }, [contract, getCurrentValue]);

  const handleFetchCurrentValue = async () => {
    try {
      const value = await getCurrentValue();
      setCurrentValue(value.toNumber());
      setInitializationError(null);
    } catch (error) {
      setInitializationError("Failed to fetch the counter value.");
      setTimeout(() => {
        setInitializationError(null);
      }, 5000);
    }
  };

  const handleInitialize = async () => {
    const initialValue = prompt("Enter initial value:");
    if (initialValue !== null) {
      try {
        await initializeCounter(parseInt(initialValue, 10));
        handleFetchCurrentValue();
        setInitializationError(null);
      } catch (error) {
        if (error.message.includes("organizer") || error.message.toLowerCase().includes("only owner")) {
          setInitializationError("Only contract deployer can initialize the counter.");
        } else {
          setInitializationError("Failed to initialize the counter.");
        }
        setTimeout(() => {
          setInitializationError(null);
        }, 5000);
      }
    }
  };

  const handleIncrement = async () => {
    const incrementValue = prompt("Enter increment value:");
    if (incrementValue !== null) {
      try {
        await incrementCounter(parseInt(incrementValue, 10));
        handleFetchCurrentValue();
        setInitializationError(null);
      } catch (error) {
        setInitializationError("Failed to increment the counter.");
        setTimeout(() => {
          setInitializationError(null);
        }, 5000);
      }
    }
  };

  const handleDecrement = async () => {
    const decrementValue = prompt("Enter decrement value:");
    if (decrementValue !== null) {
      try {
        await decrementCounter(parseInt(decrementValue, 10));
        handleFetchCurrentValue();
        setInitializationError(null);
      } catch (error) {
        setInitializationError("Failed to decrement the counter.");
        setTimeout(() => {
          setInitializationError(null);
        }, 5000);
      }
    }
  };

  return (
    <div className="counter-component">
      <div className="header">
        <h1 className="title">Counter DApp</h1>
        <div className="wallet-section">
          {!walletAddress ? (
            <button className="connect-button" onClick={connectWallet}>
              Connect to MetaMask
            </button>
          ) : (
            <p className="wallet-address">Connected: {walletAddress}</p>
          )}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="main-content">
        <div className="counter">
          <span className="flag">{currentFlag}</span>
          <p className="country-name">{countryName}</p>
          <p className={currentValue !== null ? "current-value" : "get-value-message"}>
            {currentValue !== null ? `Counter Value: ${currentValue}` : ""}
          </p>
          <div className="button-group">
            <button onClick={handleFetchCurrentValue}>Get Counter</button>
            <button onClick={handleInitialize}>Initialize Counter</button>
            <button onClick={handleIncrement}>Increment Counter</button>
            <button onClick={handleDecrement}>Decrement Counter</button>
          </div>
        </div>
      </div>

      {initializationError && <p className="initialization-error">{initializationError}</p>}
    </div>
  );
};

export default CounterComponent;
