import { Search } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search Recipe' }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const deferredValue = useDeferredValue(inputValue);

  useEffect(() => {
    onChange(deferredValue);
  }, [deferredValue, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
      />
    </div>
  );
}
