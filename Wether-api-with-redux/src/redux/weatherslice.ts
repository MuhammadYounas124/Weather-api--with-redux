import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use your actual API key
const WEATHER_API_KEY = 'fe84f3f94dda4b2e917171154242812';

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: string, { rejectWithValue }) => {
    if (!WEATHER_API_KEY) {
      return rejectWithValue('API key is missing or invalid');
    }

    try {
      // Fetching the current weather and forecast data from WeatherAPI
      const weatherUrl = `http://api.weatherapi.com/v1/current.json?q=${city}&key=${WEATHER_API_KEY}`;
      const forecastUrl = `http://api.weatherapi.com/v1/forecast.json?q=${city}&key=${WEATHER_API_KEY}&days=7`;

      const weatherResponse = await axios.get(weatherUrl);
      const forecastResponse = await axios.get(forecastUrl);

      const { current, location } = weatherResponse.data;
      const { forecastday } = forecastResponse.data.forecast;

      // Extract current weather data
      const currentWeather = {
        temp: current.temp_c,
        description: current.condition.text,
        icon: current.condition.icon,
      };

      const time = location.localtime; // API provides localtime as a string

      // Extract 7-day forecast data
      const forecast = forecastday.map((day: any) => ({
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
      return {
        currentWeather,
        time,
        location: location.name,
        forecast,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
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
