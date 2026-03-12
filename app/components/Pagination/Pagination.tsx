import React, { useEffect, useState } from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="btn btn-secondary"
        onClick={handlePrevious}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span aria-current="page">Page {page} of {totalPages}</span>
      <button
        className="btn btn-secondary"
        onClick={handleNext}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;

