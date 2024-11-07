import React from 'react';
import { useLocation } from 'react-router-dom';
import BooksCard from '../components/home/BooksCard';

const WantToReadPage = () => {
  const location = useLocation();
  const books = location.state?.books || [];

  const wantToReadBooks = books.filter((book) => book.status === 'Want to Read');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold">Want to Read</h1>
      <BooksCard books={wantToReadBooks} />
    </div>
  );
};

export default WantToReadPage;
