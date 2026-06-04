import React from 'react';

const DeviceAvatar = ({ name, status, size = "md" }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`;
  
  const ringColors = {
    safe: 'ring-green-500',
    warning: 'ring-amber-500',
    threat: 'ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse',
    quarantined: 'ring-purple-500',
    offline: 'ring-slate-300',
  };

  const sizes = {
    sm: 'w-10 h-10 p-1',
    md: 'w-16 h-16 p-1.5',
    lg: 'w-32 h-32 p-3',
  };

  return (
    <div className={`relative inline-block rounded-full ring-2 ${ringColors[status] || ringColors.offline} ${sizes[size]} bg-white`}>
      <img src={avatarUrl} alt={name} className="w-full h-full rounded-full bg-slate-50" />
      {status === 'threat' && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      )}
    </div>
  );
};

export default DeviceAvatar;
