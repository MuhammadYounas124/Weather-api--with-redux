import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../redux/weatherSlice';
import { RootState, AppDispatch } from '../redux/store';
import "admin-lte/dist/css/adminlte.min.css";

const WeatherButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const weather = useSelector((state: RootState) => state.weather);

  const handleFetch = (country: 'pakistan' | 'saudiArabia') => {
    dispatch(fetchWeatherData(country));
  };

  return (
    <div>
      <h1>Weather App</h1>
      <button onClick={() => handleFetch('pakistan')}>Get Weather for Pakistan</button>
      <button onClick={() => handleFetch('saudiArabia')}>Get Weather for Saudi Arabia</button>

      <div>
        <h2>Weather Data:</h2>
        {weather.status === 'loading' && <p>Loading...</p>}
        {weather.status === 'failed' && <p>Error: {weather.error}</p>}
        
        {weather.pakistan && (
          <div>
            <h3>Pakistan</h3>
            <pre>{JSON.stringify(weather.pakistan, null, 2)}</pre>
          </div>
        )}
        
        {weather.saudiArabia && (
          <div>
            <h3>Saudi Arabia</h3>
            <pre>{JSON.stringify(weather.saudiArabia, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherButton;

