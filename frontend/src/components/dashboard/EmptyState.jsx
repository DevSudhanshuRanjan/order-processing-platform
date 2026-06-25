import React from 'react';

const EmptyState = ({ icon = 'inbox', title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
        <span className="material-symbols-outlined text-[40px] text-on-primary-container">{icon}</span>
      </div>
      <h3 className="font-headline-lg text-headline-lg text-white mb-2">{title}</h3>
      <p className="font-body-md text-on-primary-container max-w-sm mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
