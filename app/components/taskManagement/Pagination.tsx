import React, { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageSize, totalItems, onPageChange }) => {
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(totalItems / pageSize);

    setTotalPages(calculatedTotalPages);
  }, [totalItems, pageSize]);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`mx-1 px-3 py-2 rounded ${
            i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        className="mx-1 px-3 py-2 rounded bg-gray-300 text-black"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        className="mx-1 px-3 py-2 rounded bg-gray-300 text-black"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
