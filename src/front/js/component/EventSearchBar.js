import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function EventSearchBar({ placeholder }) {
  const navigate = useNavigate();
  const [wordEntered, setWordEntered] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = async () => {
    // Here you would send the search request to your server
    // For example, using fetch to send a GET request with query parameters
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(wordEntered)}&category=${encodeURIComponent(category)}&location=${encodeURIComponent(location)}`
    );
    const searchData = await response.json();
    // Do something with the search results here
    // For example, navigate to the search results page with the search data
    navigate('/search', { state: searchData });
  };

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = data.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  return (
    <div className="container my-5 event-search">
      <div className="row justify-content-space-between align-items-center event-search-container">
        {/* Event Input */}
        <div className="col-md-3 mb-3">
          <input
            type="text"
            placeholder={placeholder}
            className="form-control form-input"
            value={wordEntered}
            onChange={handleFilter}
          />
        </div>

        {/* Category Dropdown */}
        <div className="col-md-3 mb-3">
          <select
            className="form-control"
            id="categoryInput"
            style={{ fontSize: "14px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Correctly set value and onChange
          >
            <option value="">Select category</option>
            <option value="Music">Music</option>
            <option value="Comedy">Comedy</option>
            <option value="Business">Business</option>
            <option value="Sport">Sport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Location Dropdown */}
        <div className="col-md-3 mb-3">
          <select
            className="form-control"
            id="locationInput"
            style={{ fontSize: "14px" }}
            value={location}
            onChange={(e) => setLocation(e.target.value)} // Correctly set value and onChange
          >
            <option value="">Select location</option>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
            <option value="New York">New York</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="col-md-3 mb-3 p-0">
          <button 
            type="button" 
            className="btn btn-primary custom-btn w-100 ml-2 search-button" 
            onClick={handleSearch} // Bind the button to handleSearch function
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventSearchBar;
