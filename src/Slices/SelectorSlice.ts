import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [] as string[], // Example: Array of layer names
};

export const selectorSlice = createSlice({
  name: "selector",
  initialState,
  reducers: {
    toggleLayer: (state, action) => {
      const index = state.layers.indexOf(action.payload);
      if (index > -1) {
        state.layers.splice(index, 1); // Remove layer if it exists
      } else {
        state.layers.push(action.payload); // Add layer if it doesn't exist
      }
    },
  },
});

// Export the action creators and reducer
export const { toggleLayer } = selectorSlice.actions;
export default selectorSlice.reducer;
