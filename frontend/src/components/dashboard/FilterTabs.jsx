import React from 'react';
import clsx from 'clsx';

const FilterTabs = ({ tabs = [], activeTab, onChange, className }) => {
  return (
    <div className={clsx("flex gap-2 overflow-x-auto pb-2 hide-scrollbar", className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              "px-4 py-2 rounded-full text-xs font-label-md whitespace-nowrap transition-all",
              isActive 
                ? "bg-white text-black" 
                : "bg-white/5 text-on-primary-container hover:bg-white/10 border border-white/10"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
