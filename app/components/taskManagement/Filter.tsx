import React, { useState, ChangeEvent } from 'react';

interface FilterProps {
  onStatusChange: (selectedStatus: string) => void;
  onDateChange: (selectedDate: string) => void;
  onUserChange: (selectedUser: string) => void;
  onApplyFilters: () => void; 
}

const Filter: React.FC<FilterProps> = ({
  onStatusChange,
  onDateChange,
  onUserChange,
  onApplyFilters, 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('all');

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const user = e.target.value;
    setSelectedUser(user);
    onUserChange(user);
  };

  const handleApplyFilters = () => {
    onApplyFilters(); // Trigger the filter action
  };

  return (
    <div className="mx-auto bg-white p-6 rounded shadow mb-4">
      <h1 className="text-2xl font-bold text-black mb-5">Task Filters</h1>
      <div className="flex space-x-4">
        <div className="flex-grow">
          <label htmlFor="dateFilter" className="text-gray-700 block font-bold">
            Filter by Date:
          </label>
          <input
            type="date"
            id="dateFilter"
            className="border border-gray-300 p-2 rounded w-full text-black"
            onChange={handleDateChange}
          />
        </div>

       
        <div className="flex-shrink-0">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none mt-6"
            onClick={handleApplyFilters} // Add this line
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
