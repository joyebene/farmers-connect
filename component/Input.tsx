import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline ${className}`}
      {...props}
    />
  );
};

export default Input;