import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BooksCard from '../components/home/BooksCard';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [booksPerPage] = useState(6);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status
  const navigate = useNavigate();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);  // Set to true if token exists
    }

    setLoading(true);
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: { q: 'fiction', key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw' },
        });
        const fetchedBooks = response.data.items;

        const updatedBooks = fetchedBooks.map((book) => ({
          ...book,
          status: '',
        }));

        setBooks(updatedBooks);
        setLoading(false);
      } catch (error) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const updateStatus = (bookId, status) => {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status } : book
    );
    setBooks(updatedBooks);
  };

  const filteredBooks = books.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBooks = filteredBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  const nextPage = () => {
    if ((currentPage + 1) * booksPerPage < filteredBooks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToCurrentlyReadingPage = () => {
    navigate('/currently-reading', { state: { books } });
  };
  const goToReadPage = () => {
    navigate('/read', { state: { books } });
  };
  const goToWantToReadPage = () => {
    navigate('/want-to-read', { state: { books } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    setIsLoggedIn(false); // Update login status
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Ready2Read!</h1>
        <p className="text-lg text-gray-600">Manage your reading journey and explore new books</p>
      </header>

      <div className="flex justify-center mb-8">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-md bg-blue-600 text-white"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border rounded-md bg-blue-600 text-white mr-4"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 border rounded-md bg-green-600 text-white"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for books..."
          className="px-4 py-2 border rounded-md w-1/3"
        />
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={goToCurrentlyReadingPage}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white"
        >
          View Currently Reading
        </button>
        <button
          onClick={goToReadPage}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white"
        >
          View Read
        </button>
        <button
          onClick={goToWantToReadPage}
          className="px-4 py-2 border rounded-md bg-blue-600 text-white"
        >
          View Want to Read
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Books List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredBooks.length > 0 ? (
          <>
            <BooksCard books={currentBooks} updateStatus={updateStatus} />

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevPage}
                className="bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded-full"
                disabled={currentPage === 0}
              >
                &#8592; Prev
              </button>
              <button
                onClick={nextPage}
                className="bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded-full"
                disabled={(currentPage + 1) * booksPerPage >= filteredBooks.length}
              >
                Next &#8594;
              </button>
            </div>
          </>
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
