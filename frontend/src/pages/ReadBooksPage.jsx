import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import BooksCard from '../components/home/BooksCard';

const ReadBooksPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function
  const { books } = location.state || { books: [] };

  const finishedBooks = books.filter((book) => book.status === 'Finished'); // Filter for finished books

  const handleBack = () => {
    navigate('/'); // Navigate back to the Home page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Read Books</h1>
        <p className="text-lg text-gray-600">Books you have read</p>
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
        {finishedBooks.length > 0 ? (
          <BooksCard books={finishedBooks} />
        ) : (
          <p>No books selected for "Read".</p>
        )}
      </div>
    </div>
  );
};

export default ReadBooksPage;
