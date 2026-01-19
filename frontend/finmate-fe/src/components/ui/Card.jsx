import React from 'react';

export const Card = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white border border-gray-100 shadow-sm',
    dark: 'bg-gray-900 text-white shadow-xl',
    gradient: 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-lg',
  };

  return (
    <div className={`rounded-2xl ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ icon: Icon, title, iconColor = 'text-blue-600' }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon size={20} className={iconColor} />}
    <h3 className="font-bold text-gray-800">{title}</h3>
  </div>
);