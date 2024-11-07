import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import CreateBooks from './pages/createBooks';
import DeleteBooks from './pages/deleteBooks';
import EditBooks from './pages/editBooks';
import ShowBook from './pages/showBook';
import Signup from "./components/Signup";
import Login from "./components/Login";
import ReadBooksPage from "./pages/ReadBooksPage.jsx";
import CurrentlyReadingPage from "./pages/CurrentlyReadingPage.jsx";
import WantToReadPage from "./pages/WantToReadPage.jsx";
import SearchBar from './components/SearchBar';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  
  return (
    
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Search Bar - Available on all pages */}
        <SearchBar setSearchResults={setSearchResults} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home searchResults={searchResults} />} />
          <Route path="/books/create" element={<CreateBooks />} />
          <Route path="/books/details/:id" element={<ShowBook />} />
          <Route path="/books/edit/:id" element={<EditBooks />} />
          <Route path="/books/delete/:id" element={<DeleteBooks />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/read" element={<ReadBooksPage />} />
          <Route path="/currently-reading" element={<CurrentlyReadingPage />} />
          <Route path="/want-to-read" element={<WantToReadPage />} />
        </Routes>
      </div>
    
  );
}

export default App;
