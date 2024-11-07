import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const StatusSelector = ({ book }) => { // Receive the book prop
  const statuses = ['Reading', 'Want to Read', 'Finished'];
  const [selectedStatus, setSelectedStatus] = useState({});
  const navigate = useNavigate();

  const toggleStatus = (status) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [status]: !prevStatus[status],
    }));

    // Navigate to the respective page with the book data
    if (status === 'Reading') {
      navigate('/currently-reading', { state: { book } }); // Passing the book info via state
    } else if (status === 'Want to Read') {
      navigate('/want-to-read', { state: { book } }); // Passing the book info via state
    } else if (status === 'Finished') {
      navigate('/read', { state: { book } }); // Passing the book info via state
    }
  };

  return (
    <div>
      <h2>Select a status:</h2>
      <div className="flex gap-4">
        {statuses.map((status) => (
          <button
            key={status}
            className={`p-2 rounded ${
              selectedStatus[status] ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => toggleStatus(status)} // Trigger the toggle and navigation
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h3>Selected Statuses:</h3>
        <ul>
          {Object.entries(selectedStatus)
            .filter(([_, isSelected]) => isSelected)
            .map(([status, _]) => (
              <li key={status}>{status}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default StatusSelector;
