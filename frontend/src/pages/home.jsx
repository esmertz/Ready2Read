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
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // If token exists, the user is logged in
    }

    setLoading(true);
    const fetchBooks = async () => {
      try {
        const allBooks = [];
        let startIndex = 0;
        const maxResults = 40;
        const totalBooksToFetch = 100;

        while (startIndex < totalBooksToFetch) {
          const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
              q: 'fiction',
              key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw',
              maxResults,
              startIndex,
            },
          });

          const fetchedBooks = response.data.items;

          if (!fetchedBooks || fetchedBooks.length === 0) break;

          allBooks.push(...fetchedBooks.map((book) => ({ ...book, status: '' })));
          startIndex += maxResults;
        }

        const uniqueBooks = Array.from(
          new Map(allBooks.map((book) => [book.id, book])).values()
        );

        const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
        const updatedBooks = storedBooks.map((book) => {
          const storedBook = storedBooks.find((stored) => stored.id === book.id);
          return storedBook ? { ...book, status: storedBook.status } : book;
        });

        setBooks(updatedBooks); // Set books with restored statuses
        setLoading(false);
      } catch (error) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };

    fetchBooks();
    window.addEventListener('storage', handleStorageChange); // Add event listener

    return () => { // Clean up event listener
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (event) => {
    if (event.key === 'books') {
      const updatedBooks = JSON.parse(event.newValue);
      setBooks(updatedBooks);
    }
  };
  const updateStatus = (bookId, newStatus) => {
    if (!isLoggedIn) return;
  
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status: newStatus } : book // Directly set the new status
    );
  
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setBooks(updatedBooks);
    // Consider refetching data from the backend to ensure consistency
  };

  const filteredBooks = books.filter((book) =>
    book.volumeInfo?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBooks = filteredBooks.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

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
    if (!isLoggedIn) return; // Prevent navigation if not logged in
    navigate('/currently-reading', { state: { books } });
  };

  const goToReadPage = () => {
    if (!isLoggedIn) return; // Prevent navigation if not logged in
    navigate('/read', { state: { books } });
  };

  const goToWantToReadPage = () => {
    if (!isLoggedIn) return; // Prevent navigation if not logged in
    navigate('/want-to-read', { state: { books } });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // Remove the token from localStorage
    setIsLoggedIn(false);              // Update login status to false               // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <header className="text-center mb-12 text-gray-800">
        <h1 className="text-5xl font-extrabold text-shadow-lg mb-3">Welcome to Ready2Read!</h1>
        <p className="text-xl">Manage your reading journey and explore new books.</p>
      </header>

      <div className="flex justify-center mb-8">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 mr-4"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300"
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <div className="relative w-1/2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books..."
            className="w-full px-6 py-3 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="absolute right-4 top-3 text-gray-500">🔍</span>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        {isLoggedIn ? (
          <>
            <button
              onClick={goToCurrentlyReadingPage}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 mx-2"
            >
              Currently Reading
            </button>
            <button
              onClick={goToReadPage}
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300 mx-2"
            >
              Read
            </button>
            <button
              onClick={goToWantToReadPage}
              className="px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-all duration-300 mx-2"
            >
              Want to Read
            </button>
          </>
        ) : (
          <p className="text-gray-800">Please log in to manage your reading list.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Books List</h2>

        {loading ? (
          <p className="text-gray-800">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredBooks.length > 0 ? (
          <>
            <BooksCard books={currentBooks} updateStatus={updateStatus} />

            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={prevPage}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition-all duration-300"
                disabled={currentPage === 0}
              >
                &#8592; Prev
              </button>
              <button
                onClick={nextPage}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition-all duration-300"
                disabled={(currentPage + 1) * booksPerPage >= filteredBooks.length}
              >
                Next &#8594;
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-800">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
