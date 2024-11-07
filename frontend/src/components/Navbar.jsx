import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ books }) => {
  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Ready2Read</h1>
      <div>
        <Link to="/" className="px-4 hover:underline">Home</Link>
        <Link to="/read" state={{ books }} className="px-4 hover:underline">Read</Link>
        <Link to="/currently-reading" state={{ books }} className="px-4 hover:underline">Currently Reading</Link>
        <Link to="/want-to-read" state={{ books }} className="px-4 hover:underline">Want to Read</Link>
      </div>
    </nav>
  );
};

export default Navbar;
