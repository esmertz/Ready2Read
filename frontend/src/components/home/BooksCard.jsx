import React, { useState, useEffect } from 'react';

const BooksCard = ({ books }) => {
  const [bookStatuses, setBookStatuses] = useState({});

  // Load saved statuses from localStorage when component mounts
  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem('bookStatuses')) || {};
    setBookStatuses(savedStatuses);
  }, []);

  // Save book statuses to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookStatuses', JSON.stringify(bookStatuses));
  }, [bookStatuses]);

  // Function to handle status changes
  const handleStatusChange = (bookId, status) => {
    setBookStatuses(prevStatuses => ({
      ...prevStatuses,
      [bookId]: status, // Set the status for the book by its ID
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {books.map((book) => {
        const { id, volumeInfo } = book;
        const { title, authors, imageLinks } = volumeInfo;
        const imageUrl = imageLinks?.large || imageLinks?.thumbnail;

        // Get the current status of the book (if any)
        const currentStatus = bookStatuses[id];

        return (
          <div key={id} className="border p-4 rounded-lg shadow-md">
            {/* Book Image */}
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}

            {/* Book Title */}
            <h3 className="font-semibold text-lg">{title}</h3>

            {/* Authors */}
            {authors && <p className="text-gray-600">By: {authors.join(', ')}</p>}

            {/* Status Selection */}
            <div className="mt-4">
              <p className="font-semibold">Status:</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleStatusChange(id, 'Read')}
                  className={`${
                    currentStatus === 'Read' ? 'bg-green-500' : 'bg-gray-300'
                  } text-white px-4 py-2 rounded-md`}
                >
                  Read
                </button>
                <button
                  onClick={() => handleStatusChange(id, 'Currently Reading')}
                  className={`${
                    currentStatus === 'Currently Reading'
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  } text-white px-4 py-2 rounded-md`}
                >
                  Currently Reading
                </button>
                <button
                  onClick={() => handleStatusChange(id, 'Want to Read')}
                  className={`${
                    currentStatus === 'Want to Read'
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  } text-white px-4 py-2 rounded-md`}
                >
                  Want to Read
                </button>
              </div>
            </div>

            {/* Display the selected status */}
            {currentStatus && (
              <p className="mt-2 text-sm text-gray-500">Status: {currentStatus}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BooksCard;
