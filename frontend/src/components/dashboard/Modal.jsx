import React from 'react';
import clsx from 'clsx';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions, 
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div 
        className={clsx(
          "bg-[#141b2b] border border-white/10 rounded-2xl w-full overflow-hidden animate-reveal",
          maxWidth
        )}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a2333]/50">
          <h3 className="font-headline-lg text-headline-lg text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-on-primary-container hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 text-on-secondary font-body-md max-h-[70vh] overflow-y-auto hide-scrollbar">
          {children}
        </div>
        
        {actions && (
          <div className="p-6 border-t border-white/10 bg-[#1a2333]/30 flex justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
