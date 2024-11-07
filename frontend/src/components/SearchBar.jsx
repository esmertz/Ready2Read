import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: query,  // Search query
            maxResults: 20,
            key: 'YOUR_GOOGLE_API_KEY',  // Add your actual Google API key here
          },
        });
        setSearchResults(response.data.items);  // Set search results in parent component
      } catch (error) {
        console.error('Failed to fetch books', error);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Search for books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-md p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
