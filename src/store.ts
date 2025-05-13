import { configureStore } from "@reduxjs/toolkit";
import { selectorSlice } from "./Slices/SelectorSlice";
import { mapStateSlice } from "./MapCompoment/MapStateSlice";
import { searchSlice } from "./Slices/SearchSlice";
import { satelliteDataSlice } from "./MapCompoment/SatelliteSlice";

export const store = configureStore({
    reducer: {
        selector: selectorSlice.reducer,
        mapState: mapStateSlice.reducer,
        search: searchSlice.reducer,
        satalliteState: satelliteDataSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
