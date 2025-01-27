import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-screen flex gap-2">
      <div className="relative w-[90vh] md:w-[50vh]">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 "
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <button 
              onClick={handleSubmit} 
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
            >
              Search
      </button>

    </form>
  );
};