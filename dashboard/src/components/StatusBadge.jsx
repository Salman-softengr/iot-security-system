import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    safe: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    threat: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
    quarantined: 'bg-purple-100 text-purple-700 border-purple-200',
    offline: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.offline}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
