import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const WantToReadPage = () => {
  const location = useLocation();
  const { book } = location.state || {}; // Extract book data from the state

  if (!book) {
    return <p>No book selected.</p>; // Fallback if no book is passed
  }

  return (
    <div>
      <h2>Want to Read</h2>
      <div>
        <h3>{book.volumeInfo.title}</h3>
        <p>{book.volumeInfo.authors.join(", ")}</p>
        <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
        <p>{book.volumeInfo.description}</p>
      </div>
    </div>
  );
};

export default WantToReadPage;
