import React, { useState, ChangeEvent, useEffect } from 'react';
import './SearchBar.css';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-bar" role="search">
      <input
        type="search"
        className="search-input"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        aria-label="Search products"
      />
    </div>
  );
};

export default SearchBar;

