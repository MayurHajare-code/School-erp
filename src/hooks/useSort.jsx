import { useState } from "react";
import { HiSelector, HiChevronUp, HiChevronDown } from "react-icons/hi";

const useSort = (data = []) => {
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <HiSelector className="sort-icon-neutral" />;
    return sortConfig.direction === "asc"
      ? <HiChevronUp className="sort-icon-active" />
      : <HiChevronDown className="sort-icon-active" />;
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === "string") { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return { sortConfig, handleSort, renderSortIcon, sortedData };
};

export default useSort;