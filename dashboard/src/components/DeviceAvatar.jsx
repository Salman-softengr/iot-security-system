import React from 'react';

const DeviceAvatar = ({ name, status, size = "md", imageUrl }) => {
  const avatarUrl = imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`;
  
  const ringColors = {
    safe: 'ring-green-500',
    warning: 'ring-amber-500',
    threat: 'ring-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse',
    quarantined: 'ring-purple-500',
    offline: 'ring-slate-300',
  };

  const sizes = {
    sm: 'w-10 h-10 p-0.5',
    md: 'w-20 h-20 p-1',
    lg: 'w-40 h-40 p-2',
  };

  return (
    <div className={`relative inline-block rounded-3xl ring-2 ${ringColors[status] || ringColors.offline} ${sizes[size]} bg-white overflow-hidden shadow-inner`}>
      <img 
        src={avatarUrl} 
        alt={name} 
        className="w-full h-full object-cover rounded-2xl bg-slate-50" 
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`;
        }}
      />
      {status === 'threat' && (
        <span className="absolute top-2 right-2 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </div>
  );
};

export default DeviceAvatar;
