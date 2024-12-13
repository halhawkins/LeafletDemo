import { configureStore } from "@reduxjs/toolkit";
import { selectorSlice } from "./Slices/SelectorSlice";

export const store = configureStore({
    reducer: {
        selector: selectorSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
