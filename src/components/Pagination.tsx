import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 0) return null;

  // 5개 단위 블록 계산
  const blockSize = 5;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);
  const startPage = currentBlock * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-1.5 py-6 select-none">
      {/* << : 맨 처음 페이지 */}
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(1)}
        className={`p-2 rounded-xl border text-[12px] transition-colors ${
          isFirst
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-900 shadow-sm'
        }`}
        title="맨 처음 페이지"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* < : 이전 페이지 */}
      <button
        type="button"
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        className={`p-2 rounded-xl border text-[12px] transition-colors ${
          isFirst
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-900 shadow-sm'
        }`}
        title="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 리스트 (5개 단위) */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-8 h-8 px-2.5 rounded-xl text-[12px] font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 bg-slate-900 border border-slate-700/80'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* > : 다음 페이지 */}
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        className={`p-2 rounded-xl border text-[12px] transition-colors ${
          isLast
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-900 shadow-sm'
        }`}
        title="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* >> : 맨 끝 페이지 */}
      <button
        type="button"
        disabled={isLast}
        onClick={() => onPageChange(totalPages)}
        className={`p-2 rounded-xl border text-[12px] transition-colors ${
          isLast
            ? 'border-slate-800 text-slate-600 cursor-not-allowed bg-slate-900/40'
            : 'border-slate-700 text-slate-300 hover:bg-slate-800 bg-slate-900 shadow-sm'
        }`}
        title="맨 끝 페이지"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};
