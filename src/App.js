import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackgroundMap from './BackgroundMap';
import SearchBox from './SearchBox';
import NewsSection from './NewsSection';

function App() {
  const [data, setData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({
    name: 'London',
    coord: { lat: 51.5071, lon: -0.12 },
    sys: { country: 'GB' },
  });
  const [mapCoordinates, setMapCoordinates] = useState([51.5071, -0.12]); // Default to London coordinates
  const [activeTab, setActiveTab] = useState('weather'); // Default to weather tab on start up

  useEffect(() => {
    // Fetch initial weather data
    const initialUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${selectedLocation.coord.lat}&lon=${selectedLocation.coord.lon}&appid=46c470cb5e6246d2b8da77ff21c55322`;

    axios.get(initialUrl)
      .then((response) => {
        setData(response.data);
        console.log('Initial weather data for London:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching initial weather data for London:', error);
      });
  }, []);

  const handleLocationSelect = (location) => {
    // Update the map immediately with coordinates
    setMapCoordinates([location.coord.lat, location.coord.lon]);

    // Save selected location for the news section
    setSelectedLocation(location);

    // Fetch the weather data for the selected location
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.coord.lat}&lon=${location.coord.lon}&appid=46c470cb5e6246d2b8da77ff21c55322`;

    axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  };

  return (
    <div className="app">
      <BackgroundMap coordinates={mapCoordinates} />

      <div className="search-container">
        <SearchBox onLocationSelect={handleLocationSelect} />
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            Weather
          </button>
          <button
            className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
        </div>
      </div>

      <div className="content-container">
        {activeTab === 'weather' && (
          <div className="container">
            <div className="top">
              <div className="location">
                <p>{data.name}{data.sys && `, ${data.sys.country}`}</p>
              </div>
              <div className="temperature">
                {data.main ? <h1>{Math.round(data.main.temp - 273.15)}°C</h1> : null}
              </div>
              <div className="description">
                {data.weather ? (
                  <p>
                    {data.weather[0].main === 'Clouds'
                      ? 'Cloudy'
                      : data.weather[0].main === 'Smoke'
                      ? 'Smoky'
                      : data.weather[0].main}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="bottom">
              <div className="feels">
                <p>Feels like</p>
                {data.main ? <p className="bold">{Math.round(data.main.feels_like - 273.15)}°C</p> : null}
              </div>
              <div className="humidity">
                <p>Humidity</p>
                {data.main ? <p className="bold">{data.main.humidity}%</p> : null}
              </div>
              <div className="wind">
                <p>Wind Speed</p>
                {data.wind ? <p className="bold">{data.wind.speed.toFixed()} MPH</p> : null}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && selectedLocation && (
          <div className="news-container">
            <NewsSection location={selectedLocation} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;