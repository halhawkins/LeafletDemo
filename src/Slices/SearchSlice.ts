import { createSlice } from "@reduxjs/toolkit";

interface LocalNames { 
    [key: string]: string; // an arbitrary array of strings
} 
interface Datasource {
    sourcename: string;
    attribution: string;
    license: string;
    url: string;
}

interface Timezone {
    name: string;
    offset_STD: string;
    offset_STD_seconds: number;
    offset_DST: string;
    offset_DST_seconds: number;
    abbreviation_STD: string;
    abbreviation_DST: string;
}

interface Rank {
    importance: number;
    confidence: number;
    confidence_city_level: number;
    match_type: string;
}

interface Properties {
    datasource: Datasource;
    country: string;
    country_code: string;
    state: string;
    county: string;
    city: string;
    lon: number;
    lat: number;
    state_code: string;
    result_type: string;
    formatted: string;
    address_line1: string;
    address_line2: string;
    category: string;
    timezone: Timezone;
    plus_code: string;
    plus_code_short: string;
    rank: Rank;
    place_id: string;
}

interface Geometry {
    type: string;
    coordinates: [number, number];
}

interface Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
    bbox: [number, number, number, number];
}

export type FeatureCollection = Feature[];

interface Location { 
    name: string; 
    local_names?: 
    LocalNames; 
    lat: number; 
    lon: number; 
    country: string; 
    state?: string;
}

interface SearchState {
    searchResults: Feature[];
    searchQuery: string;
    inSearch: boolean;
}

const initialState: SearchState = {
    searchResults: [],
    searchQuery: "",
    inSearch: false,
};

export const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        addSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        toggleInSearch: (state, action) => {
            state.inSearch = action.payload;
        },
    },
})

export const { addSearchResults, setSearchQuery, toggleInSearch } = searchSlice.actions;

export default searchSlice.reducer;