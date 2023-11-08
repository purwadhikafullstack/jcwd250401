import React, { useState, useRef } from "react";

const OtpInput = ({ numInputs = 6, value, onChange }) => {
  const inputRefs = useRef(new Array(numInputs));
  const [inputValues, setInputValues] = useState(Array(numInputs).fill(""));

  const handleOtpChange = (e, index) => {
    const newValue = e.target.value;
    const newInputValues = [...inputValues];
    newInputValues[index] = newValue;
    setInputValues(newInputValues);

    if (newValue === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        newInputValues[index - 1] = "";
      }
    } else if (index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Notify the parent component of the updated OTP value
    onChange(newInputValues);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && inputValues[index] === "") {
      inputRefs.current[index - 1]?.focus();
      const newInputValues = [...inputValues];
      newInputValues[index - 1] = "";
      setInputValues(newInputValues);

      // Notify the parent component of the updated OTP value
      onChange(newInputValues);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedArray = pastedData.split("");
    if (pastedArray.length !== numInputs) {
      return;
    }
    setInputValues(pastedArray);
    onChange(pastedArray);
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length: numInputs }).map((_, index) => (
        <input
          key={index}
          type="text"
          value={inputValues[index]}
          onChange={(e) => handleOtpChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(ref) => (inputRefs.current[index] = ref)}
          maxLength="1"
        className="w-10 h-10 text-center border rounded-md shadow-md shadow-gray-400 focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
        />
      ))}
    </div>
  );
};

export default OtpInput;
