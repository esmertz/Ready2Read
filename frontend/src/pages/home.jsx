import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    setLoading(true);
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'subject:fiction',
            maxResults: 20,
            key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw' , // Use your actual API key
          },
        });
        setBooks(response.data.items);
        setLoading(false);
      } catch (error) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Ready2Read!</h1>
        <p className="text-lg text-gray-600">Manage your reading journey and explore new books</p>
      </header>

      {/* Sign Up and Login Links */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
          onClick={() => navigate('/signup')} // Navigate to the Sign Up page
        >
          Sign Up
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
          onClick={() => navigate('/login')} // Navigate to the Login page
        >
          Log In
        </button>
      </div>

      {/* Book Categories */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Books List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : searchResults.length > 0 ? (
          <>
            <div className="flex justify-center gap-6 mb-8">
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
                onClick={() => setShowType('table')}
              >
                Table View
              </button>
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
                onClick={() => setShowType('card')}
              >
                Card View
              </button>
            </div>
            {showType === 'table' ? (
              <BooksTable books={searchResults} />
            ) : (
              <BooksCard books={searchResults} />
            )}
          </>
        ) : books.length > 0 ? (
          <>
            <div className="flex justify-center gap-6 mb-8">
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
                onClick={() => setShowType('table')}
              >
                Table View
              </button>
              <button
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-6 rounded-md shadow-lg transition-all duration-300"
                onClick={() => setShowType('card')}
              >
                Card View
              </button>
            </div>
            {showType === 'table' ? (
              <BooksTable books={books} />
            ) : (
              <BooksCard books={books} />
            )}
          </>
        ) : (
          <p>No books found.</p>
        )}
      </div>

      <div className="flex justify-end mb-6">
        <MdOutlineAddBox className="text-sky-800 text-4xl hover:text-sky-600 transition-all duration-300" />
      </div>
    </div>
  );
};

export default Home;
