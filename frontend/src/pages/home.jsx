import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksCard from '../components/home/BooksCard';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [books, setBooks] = useState([]); // Full list of books
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [filteredBooks, setFilteredBooks] = useState([]); // Filtered books list
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [booksPerPage] = useState(6); // Number of books per page (can be adjusted)
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchBooks = async (query = '') => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: query || 'fiction', // Use query or default to 'fiction' if searchQuery is empty
            key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw', // Your actual API key
          },
        });
        setBooks(response.data.items); // Store the fetched books
        setFilteredBooks(response.data.items); // Initially, show all books
        setLoading(false);
      } catch (error) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };

    fetchBooks(); // Initially fetch books with no search query (defaults to fiction)
  }, []);

  // Filter books based on the search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredBooks(books); // Show all books if no search query
    } else {
      const filtered = books.filter((book) => {
        const { title, authors } = book.volumeInfo;
        return (
          title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (authors && authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())))
        );
      });
      setFilteredBooks(filtered); // Update the filtered books list
      setCurrentPage(0); // Reset to the first page when a new search is made
    }
  }, [searchQuery, books]);

  // Fetch books again when searchQuery changes
  useEffect(() => {
    if (searchQuery !== '') {
      // Fetch books based on the new search query
      const fetchBooksBySearch = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
            params: {
              q: searchQuery, // Use search query to search across all books
              maxResults: 40,
              key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw',
            },
          });
          setBooks(response.data.items);
          setFilteredBooks(response.data.items);
          setLoading(false);
        } catch (error) {
          setError('Failed to load books.');
          setLoading(false);
        }
      };

      fetchBooksBySearch(); // Trigger fetch based on search query
    }
  }, [searchQuery]); // Runs whenever searchQuery changes

  // Get the current page's books
  const currentBooks = filteredBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  // Handle the next page
  const nextPage = () => {
    if ((currentPage + 1) * booksPerPage < filteredBooks.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle the previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar />

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Ready2Read!</h1>
        <p className="text-lg text-gray-600">Manage your reading journey and explore new books</p>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
          placeholder="Search for books..."
          className="px-4 py-2 border rounded-md w-1/3"
        />
      </div>

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
        ) : filteredBooks.length > 0 ? (
          <>
           
              <BooksCard books={currentBooks} />
          

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevPage}
                className="bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded-full"
                disabled={currentPage === 0} // Disable when on the first page
              >
                &#8592; Prev
              </button>
              <button
                onClick={nextPage}
                className="bg-gray-300 hover:bg-gray-400 text-white py-2 px-4 rounded-full"
                disabled={(currentPage + 1) * booksPerPage >= filteredBooks.length} // Disable when on the last page
              >
                Next &#8594;
              </button>
            </div>
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
