import React from 'react';
import clsx from 'clsx';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  className
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  
  // Logic to show limited pages if totalPages is large
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-lg text-on-primary-container hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center border border-transparent"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>

      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-label-md text-on-primary-container hover:bg-white/5 hover:text-white transition-colors">1</button>
          {startPage > 2 && <span className="text-on-primary-container opacity-50 px-1">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-label-md transition-all",
            currentPage === page 
              ? "bg-white text-black font-bold shadow-sm" 
              : "text-on-primary-container hover:bg-white/5 hover:text-white border border-transparent"
          )}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-on-primary-container opacity-50 px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-label-md text-on-primary-container hover:bg-white/5 hover:text-white transition-colors">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-lg text-on-primary-container hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center border border-transparent"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
};

export default Pagination;
