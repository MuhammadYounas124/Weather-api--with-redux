import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../redux/weatherslice';
import { RootState, AppDispatch } from '../redux/store';

const Weather: React.FC = () => {
  const [city, setCity] = useState('London');
  const dispatch = useDispatch<AppDispatch>();
  const weatherState = useSelector((state: RootState) => state.weather);

  const handleSearch = () => {
    if (city) {
      dispatch(fetchWeatherData(city));
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Weather App</h1>
      <div className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {weatherState.status === 'loading' && <p>Loading...</p>}
      {weatherState.status === 'failed' && <p className="text-danger">{weatherState.error}</p>}

      {weatherState.currentWeather && (
        <div className="text-center">
          <h2>Weather in {weatherState.location}</h2>
          <p>Temperature: {weatherState.currentWeather.temp}°C</p>
          <p>Condition: {weatherState.currentWeather.description}</p>
          <p>Local Time: {weatherState.time}</p>

          <h3 className="mt-4">7-Day Forecast</h3>
          <div className="d-flex flex-wrap justify-content-center">
            {weatherState.forecast.map((day, index) => (
              <div key={index} className="card m-2" style={{ width: '150px' }}>
                <div className="card-body text-center">
                  <p>{day.date}</p>
                  <img src={day.condition.icon} alt={day.condition.text} />
                  <p>{day.condition.text}</p>
                  <p>{day.avgTemp}°C</p>
                  <p>Max: {day.maxTemp}°C</p>
                  <p>Min: {day.minTemp}°C</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;

