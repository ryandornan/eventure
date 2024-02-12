import React from "react";
import { useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("term");
  const category = query.get("category");
  const location = query.get("location");

  

  return (
    <div>
      <h2>Search Results</h2>
      {/* Display your search results here */}
    </div>
  );
};

export default SearchResults;
