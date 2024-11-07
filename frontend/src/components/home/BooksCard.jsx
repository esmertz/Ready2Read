import React, { useState, useEffect } from 'react';

const BooksCard = ({ books, updateStatus }) => {
  const [bookStatuses, setBookStatuses] = useState({});

  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem('bookStatuses')) || {};
    setBookStatuses(savedStatuses);
  }, []);

  useEffect(() => {
    localStorage.setItem('bookStatuses', JSON.stringify(bookStatuses));
  }, [bookStatuses]);

  const handleStatusChange = (bookId, status) => {
    setBookStatuses((prevStatuses) => ({
      ...prevStatuses,
      [bookId]: prevStatuses[bookId] === status ? '' : status, // Toggle or clear status
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {books.map((book) => {
        const { id, volumeInfo } = book;
        const { title, authors, imageLinks } = volumeInfo;
        const imageUrl = imageLinks?.large || imageLinks?.thumbnail;
        const currentStatus = bookStatuses[id];

        return (
          <div key={id} className="border p-4 rounded-lg shadow-md">
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

            <h3 className="font-semibold text-lg">{title}</h3>
            {authors && <p className="text-gray-600">By: {authors.join(', ')}</p>}

            <div className="mt-4">
              <p className="font-semibold">Status:</p>
              <div className="flex gap-2 mt-2">
                {/* Button to update status to "Read" */}
                <button
                  onClick={() => handleStatusChange(id, 'Read')}
                  className={`${
                    currentStatus === 'Read' ? 'bg-green-500' : 'bg-gray-300'
                  } text-white px-4 py-2 rounded-md`}
                >
                  Read
                </button>

                {/* Button to update status to "Currently Reading" */}
                <button
                  onClick={() => {
                    handleStatusChange(id, 'Currently Reading'); // Update local status
                    updateStatus(id, 'currently-reading'); // Also notify parent component
                  }}
                  className={`${
                    currentStatus === 'Currently Reading'
                      ? 'bg-yellow-500'
                      : 'bg-gray-300'
                  } text-white px-4 py-2 rounded-md`}
                >
                  Currently Reading
                </button>

                {/* Button to update status to "Want to Read" */}
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
