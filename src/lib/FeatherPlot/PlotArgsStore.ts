import { writable } from 'svelte/store';

// Define the type for the store state
import type {
  PlotArgs, ZoomCall, 
  
  Encoding, EncodingKey, 
  EncodingVal, EncodingChannels, 
  RootChannel, ColorChannel,
  FunctionalChannel, JitterChannel,
  // EncodingChannel
} from './types.ts';

import {defaultAPICall} from './defaults.ts'

import {
  isEncodingValueString, isEncodingValueEmpty, isEncodingValueChannels
} from './types.ts'

export const calcUpdateRootChannel = (state:PlotArgs, name:EncodingKey, channel?: EncodingVal) => {
  let encoding = {...state.encoding}
  if (isEncodingValueString(channel) || isEncodingValueString(encoding[name])) {
    // just a string, overwrite with no spread
    encoding[name] = channel
  } else if (isEncodingValueEmpty(channel) || isEncodingValueEmpty(encoding[name])) {
    // one of these is empty, no spread
    encoding[name] = channel
  } else if (
    isEncodingValueChannels(channel) &&  !isEncodingValueString(channel)    
  ) {
    // channel is a channels object, spread and overwrite
    encoding[name] = {...encoding?.[name], ...channel}  
  } else {
    // default to overwrite
    encoding[name] = channel
  }
  return encoding
}

const createPlotAPI = () => {
  const { subscribe, set, update } = writable<PlotArgs>(defaultAPICall as PlotArgs);

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
          ...state, encoding: calcUpdateRootChannel(state, 'y', channel),          
        }))
    },

    updateEncodingColor: (channel: RootChannel) => {
      update((state) => ({
          ...state, encoding: calcUpdateRootChannel(state, 'color', channel),          
        }))
    },
    
  };
  return state
}

export const plotArgs = createPlotAPI();