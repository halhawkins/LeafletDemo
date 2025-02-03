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

export interface place {
    lat: number;
    lng: number;
    name: string;
}

const initialState = {
    lat: 0, 
    lng: 0,
    east: 0,
    west: 0,
    north: 0,
    south: 0,
    recentLocation: [
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
        {
            name: "",
            lat: 0,
            lng: 0,
        },
    ],
    weatherData: null as WeatherData | null,
};

const shiftRecentLocations = (recentPlaces:place[], targetLat:number, targetLng:number) => {
    const recentPlaces: place[];
    let index = recentPlaces.findIndex(p => p.lat === targetLat && p.lng === targetLng);
    if (index === -1) return recentPlaces; // If not found, return the original array
    
    let foundElement = recentPlaces.splice(index, 1)[0]; // Remove the found element
    recentPlaces.unshift(foundElement); // Insert it at the beginning
    
    return recentPlaces;
}

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
    addRecentLocation: (state, action) => {
        const newRecentLocation = [...state.recentLocation];
        const sameSpot = newRecentLocation.findIndex((location) => location.lat === action.payload.lat && location.lng === action.payload.lng)
        if (sameSpot !== -1) {
            state.recentLocation.splice(sameSpot, 1);
        }
    }
  },
});

// Export the action creators and reducer
export const { setLocation, setBounds, setWeatherData } = mapStateSlice.actions;
export default mapStateSlice.reducer;