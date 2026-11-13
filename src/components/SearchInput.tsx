import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '역량 또는 프로그램 검색...',
  onSearch,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    if (onSearch) onSearch(newVal);
  };

  const handleClear = () => {
    setValue('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-[12px] placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="검색어 지우기"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
