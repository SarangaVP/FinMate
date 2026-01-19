import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex justify-between items-end mb-8 text-left">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-3">{children}</div>}
    </div>
  );
};

export default PageHeader;