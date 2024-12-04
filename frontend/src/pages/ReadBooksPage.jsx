import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import BooksCard from '../components/home/BooksCard';
import axios from 'axios';

const ReadBooksPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function
  const [books, setBooks] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]); // Initialize finishedBooks as an empty array
  const [loading, setLoading] = useState(true); // Add a loading state

 // Filter for finished books

  const handleBack = () => {
    navigate('/'); // Navigate back to the Home page
  };
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let allBooks = [];

        const cachedBooks = localStorage.getItem('books');
        if (cachedBooks) {
          try {
            allBooks = JSON.parse(cachedBooks);
          } catch (parseError) {
            console.error("Error parsing cached books:", parseError);
            localStorage.removeItem('books'); // Remove invalid data from localStorage
          }
        }

        if (!allBooks || allBooks.length === 0) { // Fetch from API if localStorage is empty or invalid
          const response = await axios.get('http://localhost:5555/api/books');
          allBooks = response.data.data;
          localStorage.setItem('books', JSON.stringify(allBooks));
        }

        setBooks(allBooks);
        const filteredBooks = allBooks.filter((book) => book.status === 'Finished');
        setFinishedBooks(filteredBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  const handleStatusChange = (bookId, newStatus) => {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status: newStatus } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    setFinishedBooks(updatedBooks.filter(book => book.status === 'Finished')); // Update finishedBooks

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'books',
      newValue: JSON.stringify(updatedBooks),
    }));
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
      {Array.isArray(finishedBooks) && finishedBooks.length > 0 ? ( // Check if finishedBooks is an array and has elements
          <BooksCard books={finishedBooks} onStatusChange={handleStatusChange} />
        ) : (
          <p>No books selected for "Read".</p>
        )}
      </div>
    </div>
  );
};

export default ReadBooksPage;
