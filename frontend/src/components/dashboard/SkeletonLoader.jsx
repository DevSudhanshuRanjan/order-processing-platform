import React from 'react';
import clsx from 'clsx';

export const SkeletonCard = ({ className }) => (
  <div className={clsx("bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden", className)}>
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-lg bg-white/10 animate-pulse"></div>
    </div>
    <div className="w-1/2 h-4 bg-white/10 animate-pulse rounded mb-4"></div>
    <div className="w-3/4 h-8 bg-white/10 animate-pulse rounded mb-4"></div>
    <div className="w-1/3 h-3 bg-white/10 animate-pulse rounded"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-[#141b2b]/40 border border-white/5 rounded-2xl overflow-hidden w-full">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#141b2b]/50 border-b border-outline-variant/10">
            {Array(cols).fill(0).map((_, i) => (
              <th key={i} className="p-4"><div className="h-4 bg-white/10 animate-pulse rounded"></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows).fill(0).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-outline-variant/5">
              {Array(cols).fill(0).map((_, colIndex) => (
                <td key={colIndex} className="p-4">
                  <div className="h-4 bg-white/5 animate-pulse rounded w-3/4"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonChart = ({ height = '300px' }) => (
  <div className="bg-[#141b2b]/40 border border-white/5 rounded-2xl p-6 w-full flex flex-col">
    <div className="w-1/4 h-6 bg-white/10 animate-pulse rounded mb-2"></div>
    <div className="w-1/3 h-4 bg-white/10 animate-pulse rounded mb-8"></div>
    <div className="flex-1 w-full bg-white/5 animate-pulse rounded-lg" style={{ height }}></div>
  </div>
);
