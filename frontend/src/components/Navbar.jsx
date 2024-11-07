import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="flex justify-between">
        <Link to="/" className="text-2xl font-bold">
          Ready2Read
        </Link>
        <div className="flex space-x-4">
          <Link to="/currently-reading" className="hover:text-gray-200">Currently Reading</Link>
          <Link to="/want-to-read" className="hover:text-gray-200">Want to Read</Link>
          <Link to="/read" className="hover:text-gray-200">Read</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
