import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import BooksCard from '../components/home/BooksCard';

const CurrentlyReadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function
  const { books } = location.state || { books: [] };

  const currentlyReadingBooks = books.filter((book) => book.status === 'Currently Reading');

  const handleBack = () => {
    navigate('/'); // Navigate back to the Home page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Currently Reading</h1>
        <p className="text-lg text-gray-600">Books you are currently reading</p>
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
