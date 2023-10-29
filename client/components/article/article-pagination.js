import React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination size-7 d-flex justify-content-center">
      <button
        className="btn prev border-0"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <GrFormPrevious />
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          className={`btn ${
            currentPage === index + 1 ? "active me-1" : "me-1"
          }`}
          onClick={() => handlePageClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className="btn next border-0"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <GrFormNext />
      </button>
    </div>
  );
}
