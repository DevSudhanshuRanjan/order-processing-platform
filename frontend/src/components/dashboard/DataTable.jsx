import React from 'react';
import clsx from 'clsx';
import { SkeletonTable } from './SkeletonLoader';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyIcon = 'table_rows',
  emptyTitle = 'No data found',
  emptyDescription = 'There is no data to display here yet.',
  emptyAction = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange = null,
  className
}) => {

  if (loading) {
    return <SkeletonTable cols={columns.length} rows={5} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className={clsx("bg-[#141b2b]/40 border border-white/5 rounded-2xl w-full", className)}>
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />
      </div>
    );
  }

  return (
    <div className={clsx("bg-[#141b2b]/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#141b2b]/50 border-b border-outline-variant/10 text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={col.key || idx} className={clsx("p-4 font-medium", col.className, idx === 0 && "pl-6", idx === columns.length - 1 && "pr-6")}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-on-secondary font-body-md text-sm">
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="border-b border-outline-variant/5 hover:bg-white/5 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={col.key || colIndex} className={clsx("p-4", col.cellClassName, colIndex === 0 && "pl-6", colIndex === columns.length - 1 && "pr-6")}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && onPageChange && (
        <div className="p-4 border-t border-outline-variant/10 flex justify-between items-center bg-[#141b2b]/20">
          <span className="text-xs text-on-primary-container font-label-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange} 
          />
        </div>
      )}
    </div>
  );
};

export default DataTable;
