import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  layers: [] as string[], // Example: Array of layer names
};

const distinctLayers = [
  "clouds",
  "temperature",
  "precipitation",
  "pressure",
  "wind",
  // "stations",
];

export const selectorSlice = createSlice({
  name: "selector",
  initialState,
  reducers: {
    toggleLayer: (state, action) => {
      const selectedLayer = action.payload;
      if (state.layers.includes(selectedLayer)) {
        // Remove the layer if it exists
        state.layers = state.layers.filter(layer => layer !== selectedLayer);
      } else {
        // Remove all other layers and add the selected layer
        state.layers = [selectedLayer];
      }
    },
  },
});

// Export the action creators and reducer
export const { toggleLayer } = selectorSlice.actions;
export default selectorSlice.reducer;
