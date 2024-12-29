import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
// createSlice is used to define a Redux slice that contains both the state and reducers.
// createAsyncThunk is used to handle asynchronous actions, such as fetching weather data from an API.
import axios from 'axios'; // A promise-based HTTP client used for making requests to external APIs (in this case, the Weather API).

// Use your actual API key
const WEATHER_API_KEY = 'fe84f3f94dda4b2e917171154242812';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData', // The name of the action.
  async (city: string, { rejectWithValue }) => { // The function that performs the asynchronous task. 
  // It takes the city name as a parameter and an optional rejectWithValue to handle errors.
    if (!WEATHER_API_KEY) { // Before making the API request, it checks if the WEATHER_API_KEY is available. 
      return rejectWithValue('API key is missing or invalid');// If not, it immediately returns an error using rejectWithValue.
    }

    try {
      // Fetching the current weather and forecast data from WeatherAPI
      const weatherUrl = `http://api.weatherapi.com/v1/current.json?q=${city}&key=${WEATHER_API_KEY}`; 
      // Fetches the current weather data.
      const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?q=${city}&key=${WEATHER_API_KEY}&days=7`;
     // Fetches the 7-day forecast data.
      const weatherResponse = await axios.get(weatherUrl);
      const forecastResponse = await axios.get(forecastUrl);
      // axios.get(weatherUrl) and axios.get(forecastUrl) make HTTP requests to the 
      // Weather API and fetch the current weather and forecast data.
      const { current, location } = weatherResponse.data;
      const { forecastday } = forecastResponse.data.forecast;

      // Extract current weather data
      const currentWeather = {
        temp: current.temp_c, // currentWeather: Contains the temperature (temp_c), 
        // description (condition.text), and the icon URL (condition.icon).
        description: current.condition.text,
        icon: current.condition.icon,
      };

      const time = location.localtime; // API provides localtime as a string

      // Extract 7-day forecast data
      const forecast = forecastday.map((day: any) => ({ 
        // forecast: A list of 7-day forecasts, each containing the date, average temperature,
        //  condition (text and icon), maximum and minimum temperatures.
        date: day.date,
        avgTemp: day.day.avgtemp_c,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon,
        },
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c,
      }));

      // Return necessary weather data and forecast
      return { // The relevant data (current weather, time, location, and forecast) is returned in an object.
      //  This will be used to update the Redux state.
        currentWeather,
        time,
        location: location.name,
        forecast,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
      // If an error occurs during the API request (e.g., network error, API limit exceeded), 
      // the rejectWithValue function is called with the error message, which will be used to update the Redux state.
    }
  }
);

interface WeatherState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  currentWeather: { temp: number; description: string; icon: string } | null;
  time: string | null;
  location: string | null;
  forecast: Array<{
    date: string;
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    condition: { text: string; icon: string };
  }>;
  error: string | null;
}

const initialState: WeatherState = {
  status: 'idle',
  currentWeather: null,
  time: null,
  location: null,
  forecast: [],
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentWeather = action.payload.currentWeather;
        state.time = action.payload.time;
        state.location = action.payload.location;
        state.forecast = action.payload.forecast;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
