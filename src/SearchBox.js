import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBox = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Get city suggestions
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=46c470cb5e6246d2b8da77ff21c55322`
      );
      
      // Format suggestions
      const formattedResults = response.data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
        displayName: city.state 
          ? `${city.name}, ${city.state}, ${city.country}`
          : `${city.name}, ${city.country}`
      }));
      
      setSuggestions(formattedResults);
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce function to limit API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) fetchSuggestions(query);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    
    onLocationSelect({
      name: suggestion.name,
      coord: {
        lat: suggestion.lat,
        lon: suggestion.lon
      },
      country: suggestion.country
    });
  };

  return (
    <div className="search" ref={wrapperRef}>
      <div className="search-input-container">
        <input
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search for a city..."
          type="text"
        />
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li 
              key={`${suggestion.name}-${suggestion.country}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;