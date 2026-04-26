import { useState, useEffect } from "react";

const usePagination = (data = []) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const totalPages = Math.ceil(data.length / recordsPerPage);
  const indexOfLastItem = currentPage * recordsPerPage;
  const indexOfFirstItem = indexOfLastItem - recordsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to valid page if data shrinks
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [data.length, totalPages]);

  return {
    currentPage,
    setCurrentPage,
    recordsPerPage,
    setRecordsPerPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems,
  };
};

export default usePagination;