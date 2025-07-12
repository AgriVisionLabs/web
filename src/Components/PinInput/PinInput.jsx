import React, { useRef, useEffect, useState } from 'react';

const PinInput = ({ 
  values = [], 
  onChange, 
  onFocus, 
  autoFocus = false, 
  validBorderColor = "rgb(30,105,48)", 
  focusBorderColor = "rgb(30,105,48)", 
  errorBorderColor = "rgb(239,68,68)", 
  placeholder = "", 
  inputClassName = "",
  length = 6 
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newValues = [...values];
    newValues[index] = value;
    
    // Call onChange with the new values
    if (onChange) {
      onChange(value, index, newValues);
    }
    
    // Auto-focus next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const getBorderColor = (index) => {
    if (focusedIndex === index) {
      return focusBorderColor;
    }
    if (values[index]) {
      return validBorderColor;
    }
    return "#e5e7eb"; // Default gray
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          value={values[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg transition-colors duration-200 focus:outline-none ${inputClassName}`}
          style={{ borderColor: getBorderColor(index) }}
          maxLength={1}
        />
      ))}
    </div>
  );
};

export default PinInput;
