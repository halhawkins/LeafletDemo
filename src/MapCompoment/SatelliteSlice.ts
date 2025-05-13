import { createSlice } from "@reduxjs/toolkit";
// satalliteStateSlice
export interface SatelliteData {
    radarTimeline: Array<{time:number, path: string}>;
    infraredTimeline: Array<{time:number, path: string}>;
    currentFrame: number;
    playing: boolean;
}

const initialState: SatelliteData = {
    radarTimeline: [],
    infraredTimeline: [],
    currentFrame: 0,
    playing: false,
};

export const satelliteDataSlice = createSlice({
    name: "satelliteState",
    initialState,
    reducers: {
        addRadarData: (state, action) => {
            state.radarTimeline = [...state.radarTimeline, action.payload];
        },
        addInfraredData: (state, action) => {
            state.infraredTimeline = [...state.infraredTimeline, action.payload];
        },
        resetSatelliteData: (state) => {
            state.radarTimeline = [];
            state.infraredTimeline = [];
            state.currentFrame = 0;
            state.playing = false;
        },
        setCurrentFrame: (state, action) => {
            state.currentFrame = action.payload;
        },
        setPlaying: (state, action) => {
            state.playing = action.payload;
        },
    },
});

export const { addRadarData, addInfraredData, resetSatelliteData, setCurrentFrame, setPlaying } = satelliteDataSlice.actions;

export default satelliteDataSlice.reducer;