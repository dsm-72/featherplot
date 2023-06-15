import { writable } from 'svelte/store';

// Define the type for the store state
import type {
  PlotArgs, ZoomCall, 
  RootChannel, 
  Encoding, EncodingKey, 
  EncodingVal, EncodingChannels,
  // EncodingChannel
} from './types.ts';

import {defaultAPICall} from './defaults.ts'

export const calcUpdateRootChannel = (state:PlotArgs, name:EncodingKey, channel?: EncodingVal) => {
  let encoding = {...state.encoding}
  encoding[name] = channel
  return encoding
}

const createPlotAPI = () => {
  const { subscribe, set, update } = writable<PlotArgs>(defaultAPICall);

  let state = {
    subscribe,
    set,
    update,

    updateMaxPoints: (value:number) => {
      update((state) => ({ ...state, max_points: value }));
    },

    updateZoomCall: (zoom: ZoomCall) => {
      update((state) => ({ ...state, zoom }));
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