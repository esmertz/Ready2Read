import React from 'react';
import { useLocation } from 'react-router-dom';
import BooksCard from '../components/home/BooksCard';

const CurrentlyReadingPage = () => {
  const location = useLocation();
  const books = location.state?.books || [];

  const currentlyReadingBooks = books.filter((book) => book.status === 'Currently Reading');

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold">Currently Reading</h1>
      <BooksCard books={currentlyReadingBooks} />
    </div>
  );
};

export default CurrentlyReadingPage;
