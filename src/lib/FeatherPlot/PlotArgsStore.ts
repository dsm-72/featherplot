import { writable } from 'svelte/store';

// Define the type for the store state
import type {
  PlotAPIArgs, ZoomCall, 
  RootChannel, 
  Encoding, EncodingKey, 
  EncodingVal, EncodingChannels,
  // EncodingChannel
} from './types.ts';


// Create the initial state
const initialState: PlotAPIArgs = {
  zoom_call: {
    bbox: {
      x: [0.00, 0.00],
      y: [0.00, 0.00],
    },
  },
  encoding: {

  }
};

// Create the store
export const plotAPIArgs = writable<PlotAPIArgs>(initialState);


export const calcUpdateRootChannel = (state:PlotAPIArgs, name:EncodingKey, channel?: EncodingVal) => {
  let encoding = {...state.encoding}
  encoding[name] = channel
  return encoding
}

const createPlotAPI = () => {
  const { subscribe, set, update } = writable<PlotAPIArgs>(initialState);

  let state = {
    subscribe,
    set,
    update,

    updateZoomCall: (zoom_call: ZoomCall) => {
      update((state) => ({ ...state, zoom_call }));
    },

    calcUpdateRootChannel,

    updateEncodingKey: (name:EncodingKey, channel:EncodingVal) => {
      update((state) => ({
        ...state,  encoding: calcUpdateRootChannel(state, name, channel),          
      }))
    },

    updateEncodingX: (channel: RootChannel) => {
      update((state) => ({
          ...state, encoding: calcUpdateRootChannel(state, 'x', channel),          
        }))
    },

    updateEncodingY: (channel: RootChannel) => {
      update((state) => ({
          ...state, encoding: calcUpdateRootChannel(state, 'x', channel),          
        }))
    },
    
  };
  return state
}

export const plotArgs = createPlotAPI();