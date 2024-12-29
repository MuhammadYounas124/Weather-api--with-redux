import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeatherData } from '../redux/weatherslice';
import { RootState, AppDispatch } from '../redux/store';

const Weather: React.FC = () => {
  // The component handles fetching weather data for a city input by the user and displays the data in a user-friendly format.
  const [city, setCity] = useState('');  //  It represents the city for which the weather will be fetched.
  // setCity updates the city state when the user types in the input field.
  // useState and useDispatch from React:
  // useState is used to manage the city state (the city for which weather data will be fetched).
  const dispatch = useDispatch<AppDispatch>(); // useDispatch allows dispatching actions to the Redux store.
  const weatherState = useSelector((state: RootState) => state.weather); // RootState represents the structure of the Redux store’s state.
   // useSelector is used to access the Redux store’s state, specifically the weather state

  const handleSearch = () => {
    if (city) {
      dispatch(fetchWeatherData(city)); // The dispatch function from Redux is used to trigger the fetchWeatherData(city) action, 
      // which fetches the weather data for the provided city.
      // This is an action creator that will fetch weather data based on the city input. 
      // It's assumed that the weatherslice Redux slice contains logic for handling weather data fetching.
    }
    // The fetchWeatherData action is assumed to make an API call and dispatch the result to the Redux store.
    //The component responds to changes in the Redux store’s weather state (weatherState) 
    // and renders the appropriate UI based on the current status (loading, error, or successful data).
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
        <button className="btn btn-primary" onClick={handleSearch}
        // This function is triggered when the user clicks the search button. 
        // It checks if the city input is not empty, and if so, it dispatches the fetchWeatherData(city) action to the Redux store.
        >
          Search
        </button>
      </div>

      {weatherState.status === 'loading' && <p>Loading...</p>
  // When weatherState.status is 'loading', a "Loading..." message is displayed to indicate the weather data is being fetched.
      } 
      {weatherState.status === 'failed' && <p className="text-danger">{weatherState.error}</p> 
      // If weatherState.status is 'failed', an error message (weatherState.error) is shown.

      }

      {weatherState.currentWeather && ( // Current Weather: The current temperature, weather condition, and local time for the city.
        <div className="text-center">
          <h2>Weather in {weatherState.location}</h2>
          <p>Temperature: {weatherState.currentWeather.temp}°C</p>
          <p>Condition: {weatherState.currentWeather.description}</p>
          <p>Local Time: {weatherState.time}</p>

          <h3 className="mt-4">7-Day Forecast</h3>
          {/* A list of forecasted weather data for the next 7 days.
           Each day’s forecast is displayed in a card format with the following details:*/}

          <div className="d-flex flex-wrap justify-content-center">
            {weatherState.forecast.map((day, index) => ( 
  // The 7-day forecast is displayed using a .
  // map() function to iterate over the forecast array and display a card for each day with the corresponding weather data.
              <div key={index} className="card m-2" style={{ width: '150px' }}>
                <div className="card-body text-center">
                  <p>{day.date}</p>
                  <img src={day.condition.icon} alt={day.condition.text} 
                  // A weather icon is fetched using day.condition.icon, 
                  // which is likely a URL to an image representing the weather condition (e.g., a sun, cloud, rain).
// The weather description (day.condition.text), average temperature (day.avgTemp), max temperature (day.maxTemp),
//  and min temperature (day.minTemp) are displayed for each day.
                  />
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

