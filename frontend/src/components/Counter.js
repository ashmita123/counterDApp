import React, { useState, useEffect } from "react";
import useContract from "../hooks/useContract";
import countryData from "../data/flags.json"; // Ensure the path is correct

const CounterComponent = () => {
  const { initializeCounter, incrementCounter, decrementCounter, getCurrentValue, contract } = useContract();
  const [currentValue, setCurrentValue] = useState(null);
  const [currentFlag, setCurrentFlag] = useState('');
  const [countryName, setCountryName] = useState('');

  useEffect(() => {
    const fetchCurrentValue = async () => {
      if (contract) {
        try {
          const value = await getCurrentValue();
          updateStateBasedOnValue(value.toNumber());
        } catch (error) {
          console.error("Error fetching the current value:", error);
        }
      }
    };
    fetchCurrentValue();
  }, [contract, getCurrentValue]);

  const updateStateBasedOnValue = (value) => {
    setCurrentValue(value);
    if (value < countryData.length) {
      const matchedCountry = countryData[value];
      setCurrentFlag(matchedCountry.flag);
      setCountryName(matchedCountry.name);
    } else {
      setCurrentFlag('');
      setCountryName('');
    }
  };

  const handleFetchCurrentValue = async () => {
    try {
      const value = await getCurrentValue();
      updateStateBasedOnValue(value.toNumber());
    } catch (error) {
      console.error("Error fetching the current value:", error);
    }
  };

  const handleInitialize = async () => {
    const initialValue = prompt("Enter initial value:");
    if (initialValue !== null) {
      try {
        await initializeCounter(parseInt(initialValue, 10));
        handleFetchCurrentValue();
      } catch (error) {
        console.error("Initialization Error:", error);
      }
    }
  };

  const handleIncrement = async () => {
    const incrementValue = prompt("Enter increment value:");
    if (incrementValue !== null) {
      try {
        await incrementCounter(parseInt(incrementValue, 10));
        handleFetchCurrentValue();
      } catch (error) {
        console.error("Increment Error:", error);
      }
    }
  };

  const handleDecrement = async () => {
    const decrementValue = prompt("Enter decrement value:");
    if (decrementValue !== null) {
      try {
        await decrementCounter(parseInt(decrementValue, 10));
        handleFetchCurrentValue();
      } catch (error) {
        console.error("Decrement Error:", error);
      }
    }
  };

  return (
    <div className="counter">
      <span className="flag">{currentFlag}</span>
      <p className="country-name">{countryName}</p>
      <p className={currentValue !== null ? "" : "get-value-message"}>
        {currentValue !== null ? currentValue : 'Click Get Counter'}
      </p>
      <div className="button-group">
        <button onClick={handleFetchCurrentValue}>Get Counter</button>
        <button onClick={handleInitialize}>Initialize Counter</button>
        <button onClick={handleIncrement}>Increment Counter</button>
        <button onClick={handleDecrement}>Decrement Counter</button>
      </div>
    </div>
  );
  
  
};

export default CounterComponent;
