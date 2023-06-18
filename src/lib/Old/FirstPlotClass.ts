import { writable, get, derived } from 'svelte/store';
import type { 
  PlotStore, PlotArgs, EncodingVal, ColumnMetadata, EncodingKey, 
  RootChannel, ColorChannel, FunctionalChannel, JitterChannel, 
  ZoomCall, BackgroundOptions, DatasetMetadata,
  ConstantChannel, LambdaChannel, ConditionalChannel
} from './types.ts';

function isObject(val: any): val is object {
  return val !== null && typeof val === 'object';
}

class PlotStoreCreator {    
    private store;

    constructor(initialState: PlotStore) {
        this.store = writable<PlotStore>(initialState);
        this.subscribe = this.store.subscribe;
        this.setPlotArg = this.setPlotArg.bind(this);
        this.setEncoding = this.setEncoding.bind(this);
        this.getColumnMetadata = this.getColumnMetadata.bind(this);
        this.updateZoom = this.updateZoom.bind(this);
        this.updatePointSize = this.updatePointSize.bind(this);
        this.updateMaxPoints = this.updateMaxPoints.bind(this);
        this.updateAlpha = this.updateAlpha.bind(this);
        this.updateBackgroundOptions = this.updateBackgroundOptions.bind(this);
        this.setField = this.setField.bind(this);
        this.reset = this.reset.bind(this);
    }

    subscribe: (run: (value: PlotStore) => void) => void;

    setPlotArg(key: keyof PlotArgs, value: any) {
        this.store.update(state => {
            state.args[key] = value;
            return state;
        });
    }

    isConstantChannel = (val: any): val is ConstantChannel => {
      return isObject(val) && 'constant' in val;
    }
  
    isLambdaChannel = (val: any): val is LambdaChannel => {
      return isObject(val) && 'lambda' in val;
    }
  
    isConditionalChannel = (val: any): val is ConditionalChannel => {
      return isObject(val) && 'op' in val;
    }
  
    isColorChannel = (val: any): val is ColorChannel => {
      return isObject(val) && "Range" in val;
    }
  
    isFunctionalChannel = (val: any): val is FunctionalChannel => {
      return isObject(val) && "Domain" in val && "Range" in val;
    }
  
    isJitterChannel = (val: any): val is JitterChannel => {
      return isObject(val) && "method" in val;
    }

    isRootChannel = (val: any): val is RootChannel => {
      return typeof val === "object" && "field" in val;
    }
      
    isStringOrNull = (val: any): val is string | null => {
      return typeof val === "string" || val === null;
    }

    setEncoding(key: EncodingKey, value: EncodingVal) {
      this.store.update(state => {
          if (this.isConstantChannel(value)) {
              // Handle ConstantChannel
              state.args.encoding[key] = value;
              
          } else if (this.isLambdaChannel(value)) {
              // Handle LambdaChannel
              state.args.encoding[key] = value;
              
          } else if (this.isConditionalChannel(value)) {
              // Handle ConditionalChannel
              state.args.encoding[key] = value;

          } else if (this.isColorChannel(value)) {
              // Handle ColorChannel
              state.args.encoding.color = value;

          } else if (this.isFunctionalChannel(value)) {
              // Handle FunctionalChannel
              state.args.encoding.filter = value;
              state.args.encoding.filter2 = value;

          } else if (this.isJitterChannel(value)) {
              // Handle JitterChannel
              state.args.encoding.jitter_radius = value;

          } else if (this.isStringOrNull(value)) {
              // Handle string or null
              state.args.encoding[key] = value;
          }
          return state;
      });
    }



    // setEncoding(key: EncodingKey, value: EncodingVal) {
    //     this.store.update(state => {
    //         state.args.encoding[key] = value;
    //         return state;
    //     });
    // }

    getColumnMetadata(columnName: string): ColumnMetadata | undefined {
        let state = get(this.store);
        return state.meta?.columns_metadata[columnName];
    }

    updateZoom(value: ZoomCall) {
        this.store.update(state => {
            state.args.zoom = value;
            return state;
        });
    }

    updatePointSize(value: number) {
        this.store.update(state => {
            state.args.point_size = value;
            return state;
        });
    }

    updateMaxPoints(value: number) {
        this.store.update(state => {
            state.args.max_points = value;
            return state;
        });
    }

    updateAlpha(value: number) {
        this.store.update(state => {
            state.args.alpha = value;
            return state;
        });
    }

    updateBackgroundOptions(value: BackgroundOptions) {
        this.store.update(state => {
            state.args.background_options = value;
            return state;
        });
    }

    setField(key: 'x' | 'y' | 'color', field: string, otherValues: object) {
        this.store.update(state => {
            const channel = state.args.encoding[key];
            if (channel && typeof channel === 'object') {
                state.args.encoding[key] = {field: field, ...otherValues};
            }
            return state;
        });
    }

    reset() {
        this.store.set(get(this.store));
    }

    // provide a new meta object
    setMeta(meta: DatasetMetadata) {
      this.store.update(state => {
          state.meta = meta;
          return state;
      });
    }

    // when store.meta or store.columns_metadata changes, the defaults should change as well
    updateMeta(key: keyof DatasetMetadata, value: any) {
        this.store.update(state => {
            if (state.meta === null) return state
            state.meta[key] = value;
            if(key === 'columns_metadata') {
                // Update defaults here
            }
            return state;
        });
    }

    // getters and setters for the store
    get args() {
        return get(this.store).args;
    }
    
    set args(value: PlotArgs) {
        this.store.update(state => {
            state.args = value;
            return state;
        });
    }
    
    get meta() {
        return get(this.store).meta;
    }
    
    set meta(value: DatasetMetadata) {
        this.store.update(state => {
            state.meta = value;
            return state;
        });
    }

    


    // other methods...

    get max_points() {
      return get(this.store).args.max_points;
  }

  set max_points(value: number) {
      this.store.update(state => {
          state.args.max_points = value;
          return state;
      });
  }

  get point_size() {
      return get(this.store).args.point_size;
  }

  set point_size(value: number) {
      this.store.update(state => {
          state.args.point_size = value;
          return state;
      });
  }

  get zoom() {
      return get(this.store).args.zoom;
  }

  set zoom(value: ZoomCall) {
      this.store.update(state => {
          state.args.zoom = value;
          return state;
      });
  }

  get alpha() {
      return get(this.store).args.alpha;
  }

  set alpha(value: number) {
      this.store.update(state => {
          state.args.alpha = value;
          return state;
      });
  }

  get background_options() {
      return get(this.store).args.background_options;
  }

  set background_options(value: BackgroundOptions) {
      this.store.update(state => {
          state.args.background_options = value;
          return state;
      });
  }

  get encoding() {
      return get(this.store).args.encoding;
  }

  set encoding(value: any) {
      this.store.update(state => {
          state.args.encoding = value;
          return state;
      });
  }

  get columns_metadata() {
    return get(this.store).meta?.columns_metadata;
}

set columns_metadata(value: any) {
    this.store.update(state => {
        if (!state.meta) state.meta = {};
        state.meta.columns_metadata = value;
        return state;
    });
}

get total_rows() {
    return get(this.store).meta?.total_rows;
}

set total_rows(value: number) {
    this.store.update(state => {
        if (!state.meta) state.meta = {};
        state.meta.total_rows = value;
        return state;
    });
}

get total_cols() {
    return get(this.store).meta?.total_cols;
}

set total_cols(value: number) {
    this.store.update(state => {
        if (!state.meta) state.meta = {};
        state.meta.total_cols = value;
        return state;
    });
}

get dtypes() {
    return get(this.store).meta?.dtypes;
}

set dtypes(value: any) {
    this.store.update(state => {
        if (!state.meta) state.meta = {};
        state.meta.dtypes = value;
        return state;
    });
}

get size() {
    return get(this.store).meta?.size;
}

set size(value: any) {
    this.store.update(state => {
        if (!state.meta) state.meta = {};
        state.meta.size = value;
        return state;
    });
}
}

import { defaultAPICall } from './defaults.ts';
export const plotStore = new PlotStoreCreator({
    args: {...defaultAPICall} as PlotArgs,
    meta: null
});

// Shortcut stores for specific fields
// export const fieldX = derived(plotStore, $store => $store.args.encoding.x.field);
