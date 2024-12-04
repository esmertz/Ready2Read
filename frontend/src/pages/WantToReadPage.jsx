import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import BooksCard from '../components/home/BooksCard';

const ReadBooksPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function
  const { books } = location.state || { books: [] };

  const wantToReadBooks = books.filter((book) => book.status === 'Want to Read'); // Filter for "Want to Read" books

  const handleBack = () => {
    navigate('/'); // Navigate back to the Home page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Want to Read Books</h1>
        <p className="text-lg text-gray-600">Books you want to read</p>
      </header>

      {/* Back button */}
      <div className="flex justify-start mb-8">
        <button
          onClick={handleBack}
          className="px-4 py-2 border rounded-md bg-gray-600 text-white"
        >
          Back
        </button>
      </div>

      <div className="mb-8">
        {wantToReadBooks.length > 0 ? (
          <BooksCard books={wantToReadBooks} />
        ) : (
          <p>No books selected for "Want to Read".</p>
        )}
      </div>
    </div>
  );
};

export default ReadBooksPage;
