import React from 'react';

const ScoreBar = ({ score, showValue = true }) => {
  const getBarColor = (val) => {
    if (val < 0.4) return 'bg-green-500';
    if (val < 0.7) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
        <div 
          className={`h-full transition-all duration-1000 ${getBarColor(score)}`} 
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
      {showValue && <span className="text-[10px] font-mono font-bold text-slate-600">{(score * 100).toFixed(0)}%</span>}
    </div>
  );
};

export default ScoreBar;
