import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, 
  type = 'text', 
  placeholder,
  className = '',
  compact = false,
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-bold text-gray-400 uppercase ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-3.5 text-gray-400" size={18} />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full bg-gray-50 border border-gray-100 rounded-2xl 
            ${compact ? 'py-3' : 'py-3.5'} 
            ${Icon ? 'pl-12' : 'pl-4'} pr-4 
            outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;