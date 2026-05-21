import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-navy-700">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
