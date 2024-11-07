// src/components/StatusSelector.jsx

import React, { useState } from 'react';

const StatusSelector = () => {
  const statuses = ['Reading', 'Want to Read', 'Finished'];
  const [selectedStatus, setSelectedStatus] = useState({});

  const toggleStatus = (status) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [status]: !prevStatus[status]
    }));
  };

  return (
    <div>
      <h2>Select a status:</h2>
      <div className="flex gap-4">
        {statuses.map((status) => (
          <button
            key={status}
            className={`p-2 rounded ${selectedStatus[status] ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => toggleStatus(status)}
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
