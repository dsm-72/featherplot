import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';

// Define the type for the store state
import type {
  PlotArgs, ZoomCall, PlotStore, 
  
  Encoding, EncodingKey, 
  EncodingVal, EncodingChannels, 
  RootChannel, ColorChannel,
  FunctionalChannel, JitterChannel, DatasetMetadata,
  // EncodingChannel
} from './types.ts';

import {defaultAPICall} from './defaults.ts'

import {
  isEncodingValueString, isEncodingValueEmpty, isEncodingValueChannels
} from './types.ts'

export const prepareUpdateRootChannel = (state:PlotStore, name:EncodingKey, channel?: EncodingVal) => {
  let encoding = {...state.args.encoding}
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

export const updateArgs = (state:PlotStore, key: keyof PlotArgs, val: any) => {
  let args = {...state.args}
  args[key] = {...args[key], ...val}
  return {...state, args}
}

export const updateEncodingChannel = (state:PlotStore, name: keyof EncodingChannels, val: any) => {
  let encoding = prepareUpdateRootChannel(state, name, val)
  return updateArgs(state, 'encoding', encoding)
}


export const updateMeta = (state:PlotStore, key: keyof DatasetMetadata, val: any) => {
  let meta = {...state.meta}
  meta[key] = {...meta[key], ...val} as DatasetMetadata
  return {...state, meta} as PlotStore
}

export const updateArgsFromMeta = (state:PlotStore, meta?:DatasetMetadata) => {  
  if (meta) {
    let update = {...state, meta:{...state?.meta, ...meta}}
  }
  
  let oldArgs = state.args
  let newMeta = state.meta
  
  let newArgs = {
    ...oldArgs,
    max_points: (newMeta?.n_points) ? newMeta.n_points : oldArgs.max_points
  }

  return {args:newArgs, meta:newMeta}
}


const createPlotAPI = () => {

  const { subscribe, set, update } = writable<PlotStore>({args:defaultAPICall} as PlotStore);

  let state = {
    subscribe,
    set,
    update,

    updateMeta,
    overwriteMeta: (meta:DatasetMetadata) => {
      update((state) => (updateArgsFromMeta({...state, meta})));
    },
    updateMetaKey: (key: keyof DatasetMetadata, val:any) => {
      update((state) => updateMeta(state, key, val));
    },
    updateArgs,
    prepareUpdateRootChannel,
    updateEncodingChannel,
    updateArgsFromMeta,


    updateMaxPoints: (value:number) => {
      update((state) => updateArgs(state, 'max_points', value));
    },

    updateZoomCall: (zoom: ZoomCall) => {
      update((state) => updateArgs(state, 'zoom', zoom));      
    },

    updateEncodingKey: (name:EncodingKey, channel:EncodingVal) => {
      update((state) => updateEncodingChannel(state, name, channel))
    },

    updateEncodingX: (channel: RootChannel) => {
      update((state) => updateEncodingChannel(state, 'x', channel))
    },

    updateEncodingY: (channel: RootChannel) => {
      update((state) => updateEncodingChannel(state, 'y', channel))      
    },

    updateEncodingColor: (channel: RootChannel) => {
      update((state) => updateEncodingChannel(state, 'color', channel))
    },

    // subToMaxPoints: (val:number) => {
    //   const unsub = state.subscribe(value => {
    //     val = 
    //   })
    //   onDestroy(unsub)
    // }
    
  };
  return state
}

export const plotStore = createPlotAPI();