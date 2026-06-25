import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const SearchInput = ({ placeholder = 'Search...', value, onChange, className }) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync if value prop changes externally
  useEffect(() => {
    if (value !== undefined && value !== localValue) {
      setLocalValue(value);
    }
  }, [value]); // Removed localValue to avoid infinite loop if external update happens

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={clsx("relative flex items-center w-full max-w-sm", className)}>
      <span className="material-symbols-outlined absolute left-3 text-on-primary-container text-[20px] pointer-events-none">search</span>
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm font-body-md text-white focus:outline-none focus:border-[#dce2f7] focus:ring-1 focus:ring-[#dce2f7]/50 transition-all placeholder:text-on-primary-container"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-on-primary-container hover:text-white transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
