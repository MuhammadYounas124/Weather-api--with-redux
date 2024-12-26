import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


type WeatherState = {
  pakistan: any | null;
  saudiArabia: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

// Initial State
const initialState: WeatherState = {
  pakistan: null,
  saudiArabia: null,
  status: 'idle',
  error: null,
};

// Public Weather API URLs
const API_URLS: Record<string, string> = {
  pakistan: 'https://api.open-meteo.com/v1/forecast?latitude=33.6844&longitude=73.0479&hourly=temperature_2m',
  saudiArabia: 'https://api.open-meteo.com/v1/forecast?latitude=24.7136&longitude=46.6753&hourly=temperature_2m',
};

// Async thunk to fetch weather data
export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (country: string) => {
    const url = API_URLS[country];
    const response = await axios.get(url);
    return { country, data: response.data };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherData.fulfilled, (state, action: PayloadAction<{ country: string; data: any }>) => {
        state.status = 'succeeded';
        state[action.payload.country as keyof WeatherState] = action.payload.data;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default weatherSlice.reducer;
