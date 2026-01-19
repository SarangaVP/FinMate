import React from 'react';

const ProgressBar = ({ value, max, color = 'bg-blue-500', showOverflow = true }) => {
  const percent = (value / max) * 100;
  const isOver = value > max;

  return (
    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 ${isOver && showOverflow ? 'bg-red-500' : color}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;