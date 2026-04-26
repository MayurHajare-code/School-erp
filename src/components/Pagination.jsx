// src/components/common/Pagination.jsx
import React from "react";

const Pagination = ({
  totalRecords,
  currentPage,
  totalPages,
  recordsPerPage,
  setCurrentPage,
  setRecordsPerPage,
  indexOfFirstItem,
  indexOfLastItem,
  recordsPerPageOptions = [5, 10, 50],
  showInfo = true,
  showPageSize = true,
  showNavigation = true,
}) => {
  return (
    <div className="pagination-wrapper">
      {/* Top Section: Info + Records Per Page */}
      {(showInfo || showPageSize) && (
        <div className="pagination-container">
          {showInfo && (
            <div className="pagination-info">
              <span>
                Showing{" "}
                {totalRecords === 0
                  ? 0
                  : `${indexOfFirstItem + 1}–${Math.min(
                      indexOfLastItem,
                      totalRecords
                    )}`}{" "}
                of {totalRecords} records
              </span>
            </div>
          )}

          {showPageSize && (
            <div className="pagination-controls">
              <div className="records-per-page">
                <label>Records per page: </label>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  {recordsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Navigation Buttons */}
      {showNavigation && (
        <div className="pagination-container">
          <div className="pagination-buttons">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>

            <span className="page-number">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;