import React from 'react';
import { useLocation } from 'react-router-dom';
import BooksCard from '../components/home/BooksCard';

const ReadBooksPage = () => {
  const location = useLocation();
  const books = location.state?.books || []; // Get books from state passed via the Navbar

  const readBooks = books.filter((book) => book.status === 'Read');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold">Read Books</h1>
      <BooksCard books={readBooks} />
    </div>
  );
};

export default ReadBooksPage;
