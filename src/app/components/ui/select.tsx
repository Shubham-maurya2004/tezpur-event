import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-navy-700">{label}</label>}
      <select
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent bg-white ${className}`}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
