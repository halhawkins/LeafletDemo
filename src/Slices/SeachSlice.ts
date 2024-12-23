import { createSlice } from "@reduxjs/toolkit";

interface LocalNames { 
    [key: string]: string; // an arbitrary array of strings
} 

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
    searchResults: Location[];
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