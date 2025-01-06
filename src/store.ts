import { configureStore } from "@reduxjs/toolkit";
import { selectorSlice } from "./Slices/SelectorSlice";
import { mapStateSlice } from "./MapCompoment/MapStateSlice";
import { searchSlice } from "./Slices/SearchSlice";

export const store = configureStore({
    reducer: {
        selector: selectorSlice.reducer,
        mapState: mapStateSlice.reducer,
        search: searchSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
