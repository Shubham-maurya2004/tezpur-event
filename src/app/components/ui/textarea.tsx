import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-navy-700">{label}</label>}
      <textarea
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none ${className}`}
        rows={4}
        {...props}
      />
    </div>
  );
};
