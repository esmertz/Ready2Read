import React from 'react';
import { useLocation } from 'react-router-dom';
import BooksCard from '../components/home/BooksCard';

const CurrentlyReadingPage = () => {
  const location = useLocation();
  const { books } = location.state || { books: [] }; // Get the books from location state

  // Filter out only books that have the "Currently Reading" status
  const currentlyReadingBooks = books.filter(book => book.status === 'Currently Reading');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Currently Reading</h1>
        <p className="text-lg text-gray-600">Books you are currently reading</p>
      </header>

      {/* Display the books that are currently being read */}
      <div className="mb-8">
        {currentlyReadingBooks.length > 0 ? (
          <BooksCard books={currentlyReadingBooks} />
        ) : (
          <p>No books selected for "Currently Reading".</p>
        )}
      </div>
    </div>
  );
};

export default CurrentlyReadingPage;
