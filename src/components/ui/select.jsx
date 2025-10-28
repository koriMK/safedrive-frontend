import React, { useState } from 'react';

export const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          value, 
          onValueChange, 
          isOpen, 
          setIsOpen 
        })
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className, isOpen, setIsOpen, ...props }) => (
  <button
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {children}
    <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
);

export const SelectValue = ({ placeholder, value }) => (
  <span>{value || placeholder}</span>
);

export const SelectContent = ({ children, isOpen, setIsOpen, onValueChange }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
      {React.Children.map(children, child =>
        React.cloneElement(child, { onValueChange, setIsOpen })
      )}
    </div>
  );
};

export const SelectItem = ({ children, value, onValueChange, setIsOpen }) => (
  <button
    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100"
    onClick={() => {
      onValueChange(value);
      setIsOpen(false);
    }}
  >
    {children}
  </button>
);