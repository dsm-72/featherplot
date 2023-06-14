import { writable } from 'svelte/store';

// Define the type for the store state
type PlotAPIArgs = {
  zoom_call: ZoomCall;
};

type ZoomCall = {
  bbox: {
    x: [number, number];
    y: [number, number];
  };
};

// Create the initial state
const initialState: PlotAPIArgs = {
  zoom_call: {
    bbox: {
      x: [0, 0],
      y: [0, 0],
    },
  },
};

// Create the store
export const plotAPIArgs = writable<PlotAPIArgs>(initialState);
