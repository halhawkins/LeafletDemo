import { createSlice } from "@reduxjs/toolkit";
import { LatLng } from "leaflet";

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
      dt: number;
      sunrise: number;
      sunset: number;
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      dew_point: number;
      uvi: number;
      clouds: number;
      visibility: number;
      wind_speed: number;
      wind_deg: number;
      wind_gust: number;
      weather: Array<{
          id: number;
          main: string;
          description: string;
          icon: string;
      }>;
  };
  minutely: Array<{
      dt: number;
      precipitation: number;
  }>;
  hourly: Array<{
      dt: number;
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      dew_point: number;
      uvi: number;
      clouds: number;
      visibility: number;
      wind_speed: number;
      wind_deg: number;
      wind_gust: number;
      weather: Array<{
          id: number;
          main: string;
          description: string;
          icon: string;
      }>;
      pop: number;
  }>;
  daily: Array<{
      dt: number;
      sunrise: number;
      sunset: number;
      moonrise: number;
      moonset: number;
      moon_phase: number;
      summary: string;
      temp: {
          day: number;
          min: number;
          max: number;
          night: number;
          eve: number;
          morn: number;
      };
      feels_like: {
          day: number;
          night: number;
          eve: number;
          morn: number;
      };
      pressure: number;
      humidity: number;
      dew_point: number;
      wind_speed: number;
      wind_deg: number;
      wind_gust: number;
      weather: Array<{
          id: number;
          main: string;
          description: string;
          icon: string;
      }>;
      clouds: number;
      pop: number;
      rain?: number;
      uvi: number;
  }>;
  alerts?: Array<{
      sender_name: string;
      event: string;
      start: number;
      end: number;
      description: string;
      tags: Array<string>;
  }>;
}

const initialState = {
  lat: 0, 
  lng: 0,
  east: 0,
  west: 0,
  north: 0,
  south: 0,
  weatherData: null as WeatherData | null,
};

export const mapStateSlice = createSlice({
  name: "mapState",
  initialState,
  reducers: {
    setLocation: (state, action) => {
        state.lat = action.payload.lat;
        state.lng = action.payload.lng;
    },
    setBounds: (state, action) => {
        state.east = action.payload.east;
        state.west = action.payload.west;
        state.north = action.payload.north;
        state.south = action.payload.south;
    },
    setWeatherData: (state, action) => {
        state.weatherData = action.payload;
    },
  },
});

// Export the action creators and reducer
export const { setLocation, setBounds, setWeatherData } = mapStateSlice.actions;
export default mapStateSlice.reducer;