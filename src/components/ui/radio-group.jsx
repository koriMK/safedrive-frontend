import React, { createContext, useContext } from 'react';

const RadioGroupContext = createContext();

export const RadioGroup = ({ value, onValueChange, children, className, ...props }) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

export const RadioGroupItem = ({ value, id, className, ...props }) => {
  const context = useContext(RadioGroupContext);
  
  return (
    <input
      type="radio"
      id={id}
      checked={context.value === value}
      onChange={() => context.onValueChange(value)}
      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};