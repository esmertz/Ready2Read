// BooksCard.js
import React from 'react';

const BooksCard = ({ books, updateStatus }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {books.map((book) => (
        <div key={book.id} className="p-4 border rounded-md">
          {/* Book Cover */}
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={`${book.volumeInfo.title} cover`}
              className="w-full h-48 object-cover mb-4 rounded-md"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded-md">
              <p>No Image Available</p>
            </div>
          )}

          {/* Book Title and Author */}
          <h3 className="text-xl font-semibold">{book.volumeInfo.title}</h3>
          <p className="text-sm text-gray-600">{book.volumeInfo.authors?.join(', ')}</p>
          
          {/* Status Buttons */}
         
          <div className="flex justify-center mt-4"> {/* Container for styled select */}
            <select
              value={book.status}
              onChange={(e) => updateStatus(book.id, e.target.value)}
              className={`px-4 py-2 mx-2 border rounded-md text-white ${
                book.status === 'Currently Reading'
                  ? 'bg-blue-500'
                  : book.status === 'Want to Read'
                  ? 'bg-yellow-500'
                  : book.status === 'Finished'
                  ? 'bg-green-500'
                  : 'bg-gray-400' // Default style if no status is selected
              }`}
            >
              <option value="">None</option>
              <option value="Currently Reading">Currently Reading</option>
              <option value="Want to Read">Want to Read</option>
              <option value="Finished">Finished</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksCard;
