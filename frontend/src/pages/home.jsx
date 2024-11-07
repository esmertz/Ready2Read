import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BooksCard from '../components/home/BooksCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [books, setBooks] = useState([]); // Full list of books
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query
  const [currentPage, setCurrentPage] = useState(0); // Current page index
  const [booksPerPage] = useState(6); // Number of books per page

  useEffect(() => {
    setLoading(true);
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'fiction', // Default query (could be dynamic)
            key: 'AIzaSyDw67LwavPSZ63XUPRF0csGJ0yW82XaJYw' , // Your API key
          },
        });
        const fetchedBooks = response.data.items;

        // Initialize books with empty status
        const updatedBooks = fetchedBooks.map(book => ({
          ...book,
          status: '', // Initially, status is empty
        }));

        setBooks(updatedBooks); // Store the fetched books
        setLoading(false);
      } catch (error) {
        setError('Failed to load books.');
        setLoading(false);
      }
    };

    fetchBooks(); // Fetch books initially
  }, []);
  const updateStatus = (bookId, status) => {
    if (!status) return; // Prevents errors if no status is passed
  
    // Update the status of the selected book
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status } : book
    );
    setBooks(updatedBooks); // Update the books state with the new status
  };
  

  // Filter books based on the search query
  const filteredBooks = books.filter((book) =>
    book.volumeInfo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the current page's books
  const currentBooks = filteredBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  // Handle pagination
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Navbar /> {/* Navbar stays for navigation */}

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

      {/* Status Buttons */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => updateStatus('currently-reading')}
          className="px-4 py-2 mx-2 border rounded-md bg-blue-500 text-white"
        >
          Currently Reading
        </button>
        <button
          onClick={() => updateStatus('want-to-read')}
          className="px-4 py-2 mx-2 border rounded-md bg-yellow-500 text-white"
        >
          Want to Read
        </button>
        <button
          onClick={() => updateStatus('read')}
          className="px-4 py-2 mx-2 border rounded-md bg-green-500 text-white"
        >
          Finished
        </button>
      </div>

      {/* Book List */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Books List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : filteredBooks.length > 0 ? (
          <>
            <BooksCard books={currentBooks} updateStatus={updateStatus} />

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
    </div>
  );
};

export default Home;
