import React from 'react';
import { useLocation } from 'react-router-dom';
import BooksCard from '../components/home/BooksCard';

const ReadBooksPage = () => {
  const location = useLocation();
  const { books } = location.state || { books: [] };

  const currentlyReadingBooks = books.filter((book) => book.status === 'Want to Read');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Want to Read Books</h1>
        <p className="text-lg text-gray-600">Books you want to read</p>
      </header>

      <div className="mb-8">
        {currentlyReadingBooks.length > 0 ? (
          <BooksCard books={currentlyReadingBooks} />
        ) : (
          <p>No books selected for "Want to Read".</p>
        )}
      </div>
    </div>
  );
};

export default ReadBooksPage;
