import { useState } from "react";

const useFilter = (data = [], searchFields = []) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => setSearch(e.target.value);
  const resetFilter = () => setSearch("");
  const isFilterActive = search !== "";

  const filteredData = data.filter((item) => {
    const query = search.toLowerCase();
    return searchFields.some((field) =>
      item[field]?.toString().toLowerCase().includes(query)
    );
  });

  return {
    search,
    handleSearchChange,
    resetFilter,
    isFilterActive,
    filteredData,
  };
};

export default useFilter;