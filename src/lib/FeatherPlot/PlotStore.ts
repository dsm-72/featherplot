import { onMount, onDestroy } from 'svelte';
import { writable, get, derived } from "svelte/store";
import { createEventDispatcher } from 'svelte';
import { BROWSER } from 'esm-env';
const browser = BROWSER;

import { defaultAPICall } from "./defaults.ts";

import type {
  PlotStore,
  PlotArgs,
  EncodingVal,
  ColumnMetadata,
  EncodingKey,
  ZoomCall,
  ZoomAlign,
  BackgroundOptions,
  LabelCall,
  DatasetMetadata,
  Extents, ChannelBase,
  CategoricalColorChannel,
  EncodingBase,

  RootChannel,
  ColorChannel,
  FunctionalChannel,
  JitterChannel,
  ConstantChannel,
  LambdaChannel,
  BooleanChannel,
  ConditionalChannel,
  Encoding, StringOrStrings,

  DebugDetails, DebugMisc, DebugMethod, 


  DeepScatterReadyEvent, DeepScatterExtentEvent, DeepScatterSampleEvent, 
  DeepScatterFieldsEvent, DeepScatterSchemaEvent, MinMax, BBox,

  ColumnsMetadata,
  BasicChannel,
} from "./types.ts";

import { 
  isConstantChannel,
  isLambdaChannel,
  isConditionalChannel,
  isColorChannel,
  isFunctionalChannel,
  isJitterChannel,
  isRootChannel,
  isStringOrNull,
  isStringOrStrings,
} from "./guards.ts";

import {
  isObject,
  destroyWebGLInstances
} from './utils.ts'

/**
 * 
 * NOTE: these are missing from initial implementation
  let clearing = false;
  let plottingTimer: ReturnType<typeof setTimeout>;
  let clearingTimer: ReturnType<typeof setTimeout>;
  doDestroy
  doDraw
  destroy
  debounceDestroy
  debounceDraw
 * 
 */

export type FeatherStore = {
  id: string;
  url?: string;
  debug: boolean;
  pause: boolean;

  plot: any | null;
  ready: boolean;
  
  // ------------------------------------------------------------------------------------------------------------------
  // Managing dynamic widths and heights
  // ------------------------------------------------------------------------------------------------------------------
  autofit: boolean;
  w?: number;
  h?: number;
  width?: number;
  height?: number;
  autofitWidth?: number;
  autofitHeight?: number;


  // ------------------------------------------------------------------------------------------------------------------
  // plotAPI Args
  // ------------------------------------------------------------------------------------------------------------------
  zoom?: ZoomCall;
  zoomAlign?: ZoomAlign;
  /** The magnification coefficient for a zooming item */
  zoomBalance?: number;
  encoding?: Encoding;
  /** The length of time to take for the transition to this state. */
  duration?: number;
  /** The base point size for aes is modified */
  pointSize?: number;
  /** The maximum number of points to load */
  maxPoints?: number;
  /** Overall screen saturation target at average point density */
  alpha?: number;
  /** A function defind as a string that takes implied argument 'datum' */
  clickFunction?: string;
  labels?: LabelCall;
  backgroundOptions?: BackgroundOptions;

  // ------------------------------------------------------------------------------------------------------------------
  // Metadata
  // ------------------------------------------------------------------------------------------------------------------
  
  // map of {colname: metadata} needed for formatting channels
  columns?: ColumnsMetadata

  // list of explict sidecar columns
  sidecars?: string[]

  // list of embeding columns
  embedding?: string[]

  totalPoints?: number

  // field names for the x, y, and color channels
  // xField?: string
  // yField?: string
  // cField?: string
}

const initialState: FeatherStore = {
  id: 'deepscatter',
  // url: '',
  debug: true,
  pause: false,
  plot: null,
  ready: false,

  // ------------------------------------------------------------------------------------------------------------------
  // Managing dynamic widths and heights
  // ------------------------------------------------------------------------------------------------------------------
  autofit: true,  
  width: 600,
  height: 400,
  autofitWidth: 600,
  autofitHeight: 400,

  // ------------------------------------------------------------------------------------------------------------------
  // plotAPI Args
  // ------------------------------------------------------------------------------------------------------------------
  // zoom: ,
  zoomAlign: 'center',
  zoomBalance: 0.35,
  encoding: {},
  duration: 1000,
  pointSize: 3,
  maxPoints: 500,
  alpha: 40,
  // clickFunction: ,
  // labels: ,
  backgroundOptions: {
    color: 'white',
    opacity: [.2, 1],
    size: [0.66, 1],
    mouseover: false
  }


  // ------------------------------------------------------------------------------------------------------------------
  // Metadata
  // ------------------------------------------------------------------------------------------------------------------
  // columns
  // sidecars
  // embedding
  // totalPoints
}

declare global {
  interface Window {
      plot:any;
  }
}

class PlotState {
  private store;
  private autofitUnsubscribe : any;
  public browser = browser;
  public Deepscatter: any;
  public async LoadDeepscatter() {
    const Scatterplot = await import('deepscatter'); 
    this.Deepscatter = Scatterplot.default; 
    this.debug({ status: 'Deepscatter imported'}, Scatterplot);
  }

  deconstructor() {
    this.autofitUnsubscribe();
  }



  constructor(initialState: FeatherStore) {
    this.store = writable<FeatherStore>(initialState);
    this.subscribe = this.store.subscribe;
    // this.update = this.store.update;
    // this.set = this.store.set;
    this.reset = this.reset.bind(this);    
    // this.dispatch = createEventDispatcher();
    this.debug = this.debug.bind(this);    

    this.autofitUnsubscribe = this.subscribe(store => {      
      store.w = this.autofit ? this.autofitWidth : this.width;
      store.h = this.autofit ? this.autofitHeight : this.height;
    })
    
  }

  

  // ------------------------------------------------------------------------------------------------------------------
  // KEY STORE FUNCTIONS
  // ------------------------------------------------------------------------------------------------------------------
  subscribe: (run: (value: FeatherStore) => void) => void;
  // TODO: fill in
  // update: 
  // TODO: fill in
  // set: 
  reset() {
    this.store.set(get(this.store));
  }
  // dispatch: (type: string, detail?: any) => void;
  debug(details?: DebugDetails, ...misc: DebugMisc) {
    let { debug } = get(this.store);
    
    if (!debug) return;
    console.debug(details?.status);

    if (Array.isArray(misc) && misc.length > 0) {
      console.debug(misc);
      // console.table(misc);
    }
  }

  public samplePoints() {}
  public reinitializeZoom() {}
  
  public destroyWebGLInstances() {
    let { debug } = get(this.store);
    destroyWebGLInstances(debug);
  }

  // ------------------------------------------------------------------------------------------------------------------
  // GETTERS FOR ARGS
  // ------------------------------------------------------------------------------------------------------------------
  get zoom() {
    let { zoom } = get(this.store);
    return zoom;
  }  
  get zoomAlign() {
    let { zoomAlign } = get(this.store);
    return zoomAlign;
  }
  get zoomBalance() {
    let { zoomBalance } = get(this.store);
    return zoomBalance;
  }
  get encoding() {
    let { encoding } = get(this.store);
    return encoding;
  }
  get duration() {
    let { duration } = get(this.store);
    return duration;
  }
  get pointSize() {
    let { pointSize } = get(this.store);
    return pointSize;
  }
  get maxPoints() {
    let { maxPoints } = get(this.store);
    return maxPoints;
  }
  get alpha() {
    let { alpha } = get(this.store);
    return alpha;
  }
  get clickFunction() {
    let { clickFunction } = get(this.store);
    return clickFunction;
  }
  get labels() {
    let { labels } = get(this.store);
    return labels;
  }
  
  
  
  // ----------------------------------------
  // deconstruct background options
  // ----------------------------------------
  get backgroundOptions() {
    let { backgroundOptions } = get(this.store);
    return backgroundOptions;
  }

  get backgroundColor() {
    if (!this.backgroundOptions) return undefined;
    let { color } = this.backgroundOptions;
    return color;
  }
  get backgroundOpacity(): number | MinMax | undefined {
    if (!this.backgroundOptions) return undefined;
    let { opacity } = this.backgroundOptions;
    return opacity;
  }
  get backgroundSize(): number | MinMax | undefined  {
    if (!this.backgroundOptions) return undefined;
    let { size } = this.backgroundOptions;
    return size;
  }
  get backgroundMouseover() {
    if (!this.backgroundOptions) return undefined;
    let { mouseover } = this.backgroundOptions;
    return mouseover;
  }


  // ------------------------------------------------------------------------------------------------------------------
  // SETTERS FOR ARGS
  // ------------------------------------------------------------------------------------------------------------------

  // ----------------------------------------
  // deconstruct background options
  // ----------------------------------------
  set zoom(z: ZoomCall | undefined) {
    this.store.update(store => {
      store.zoom = z;
      return store;
    });
  }

  set zoomBBox(b:BBox) {
    this.store.update(store => {
      if (!store.zoom) store.zoom = {bbox: b};
      store.zoom.bbox = b;
      return store;
    });
  }

  set zoomAlign(z: ZoomAlign | undefined) {
    this.store.update(store => {
      store.zoomAlign = z;
      return store;
    });
  }
  set zoomBalance(z: number | undefined) {
    this.store.update(store => {
      store.zoomBalance = z;
      return store;
    });
  }
  set encoding(e: Encoding | undefined) {
    this.store.update(store => {
      store.encoding = e;
      return store;
    });
  }
  set duration(d: number | undefined) {
    this.store.update(store => {
      store.duration = d;
      return store;
    });
  }
  set pointSize(p: number | undefined) {
    this.store.update(store => {
      store.pointSize = p;
      return store;
    });
  }
  set maxPoints(m: number | undefined) {
    this.store.update(store => {
      store.maxPoints = m;
      this.totalPoints = m
      return store;
    });
  }
  set alpha(a: number | undefined) {
    this.store.update(store => {
      store.alpha = a;
      return store;
    });
  }
  set clickFunction(c: string | undefined) {
    this.store.update(store => {
      store.clickFunction = c;
      return store;
    });
  }
  set labels(l: LabelCall | undefined) {
    this.store.update(store => {
      store.labels = l;
      return store;
    });
  }

  // ----------------------------------------
  // deconstruct background options
  // ----------------------------------------
  set backgroundOptions(b: BackgroundOptions | undefined) {
    this.store.update(store => {
      store.backgroundOptions = b;
      return store;
    });
  }
  set backgroundColor(c: string | undefined) {
    this.store.update(store => {
      if (!store.backgroundOptions) store.backgroundOptions = {};
      store.backgroundOptions.color = c;
      return store;
    });
  }
  set backgroundOpacity(o: [number, number] | undefined) {
    this.store.update(store => {
      if (!store.backgroundOptions) store.backgroundOptions = {};
      store.backgroundOptions.opacity = o;
      return store;
    });
  }
  set backgroundSize(s: [number, number] | undefined) {
    this.store.update(store => {
      if (!store.backgroundOptions) store.backgroundOptions = {};
      store.backgroundOptions.size = s;
      return store;
    });
  }
  set backgroundMouseover(m: boolean | undefined) {
    this.store.update(store => {
      if (!store.backgroundOptions) store.backgroundOptions = {};
      store.backgroundOptions.mouseover = m;
      return store;
    });
  }



  // ------------------------------------------------------------------------------------------------------------------
  // GETTERS& SETTERS FOR STATE
  // ------------------------------------------------------------------------------------------------------------------
  get id() {
    let { id } = get(this.store);
    return id;
  }
  set id(i: string) {
    this.store.update(store => {
      store.id = i;
      return store;
    });
  }

  get url() {
    let { url } = get(this.store);
    return url;
  }
  set url(u: string | undefined) {
    this.store.update(store => {
      store.url = u;
      if (u) {
       // TODO: CASCADE 
      }
      return store;
    });
  }

  get isDebug() {
    let { debug } = get(this.store);
    return debug;
  }
  set isDebug(d: boolean) {
    this.store.update(store => {
      store.debug = d;
      return store;
    });
  }

  get isPause() {
    let { pause } = get(this.store);
    return pause;
  }
  set isPause(p: boolean) {
    this.store.update(store => {
      store.pause = p;
      return store;
    });
  }
  
  get plot() {
    let { plot } = get(this.store);
    return plot;
  }
  set plot(p: any) {
    this.store.update(store => {
      store.plot = p;
      return store;
    });
  }


  get ready() {
    let { ready } = get(this.store);
    return ready;
  }
  set ready (r: boolean) {
    this.store.update(store => {      
      store.ready = r;
      // this.dispatch('udpate-ready', {ready:r} as DeepScatterReadyEvent);
      return store;
    });
  }

  // ------------------------------------------------------------------------------------------------------------------
  // Managing dynamic widths and heights
  // ------------------------------------------------------------------------------------------------------------------  
  get autofit() {
    let { autofit } = get(this.store);
    return autofit;
  }
  set autofit(a: boolean) {
    this.store.update(store => {
      store.autofit = a;
      return store;
    });
  }
  
  get width() {
    let { width } = get(this.store);
    return width;
  }
  get height() {
    let { height } = get(this.store);
    return height;
  }
  get autofitWidth() {
    let { autofitWidth } = get(this.store);
    return autofitWidth;
  }
  set autofitWidth(w: number | undefined) {
    this.store.update(store => {
      // this.debug({ status: 'Inside autofit update'}, {w})
      store.autofitWidth = w;
      // store.w = this.autofit ? this.autofitWidth : this.width;
      return store;
    });
  }
  get autofitHeight() {
    let { autofitHeight } = get(this.store);
    return autofitHeight;
  }
  set autofitHeight(h: number | undefined) {
    this.store.update(store => {
      store.autofitHeight = h;     
      // store.h = this.autofit ? this.autofitHeight : this.height; 
      return store;
    });    
  }
  
  get w() {    
    let { w } = get(this.store);    
    return w;
  }
  get h() {
    let { h } = get(this.store);
    return h;
  }



  // ------------------------------------------------------------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------------------------------------------------------------
  get args() {
    let args: PlotArgs = {}
    if (this.url) args.source_url = this.url;
    if (this.zoom) args.zoom = this.zoom;
    if (this.zoomAlign) args.zoom_align = this.zoomAlign;
    if (this.zoomBalance) args.zoom_balance = this.zoomBalance;
    if (this.encoding) args.encoding = this.encoding;
    if (this.duration) args.duration = this.duration;
    if (this.pointSize) args.point_size = this.pointSize;
    if (this.maxPoints) args.max_points = this.maxPoints;
    if (this.alpha) args.alpha = this.alpha;
    if (this.clickFunction) args.click_function = this.clickFunction;
    if (this.labels) args.labels = this.labels;
    if (this.backgroundOptions) args.background_options = this.backgroundOptions;
    if (this.backgroundColor) args.background_color = this.backgroundColor;
    if (this.backgroundOpacity) args.background_opacity = this.backgroundOpacity;
    return args;
  }


  private _plotting = false  
  get plotting() {
    return this._plotting;
  }
  set plotting(p: boolean) {
    this._plotting = p;
  }


  private _schema: any | null = null;
  get schema() {
    return this._schema;
  }
  set schema(s: any | null) {
    this._schema = s;
  }

  get fields() {
    return (this.ready ? this.plot?._root?.schema?.fields : []);
  }
  get extents() {
    return (this.ready ? this.plot?._root?._extents : {}) as Extents;
  }
  get xExtent() { return this.extents?.x || null; }
  get yExtent() { return this.extents?.y || null; }
  get zExtent() { return this.extents?.z || null; }

  public async updateAPI() {

  }

  public async updatePlot() {
    this.debug(
      { status: 'Inside updatePlot'}, 
      {what:'widths', w:this.w, h:this.h, autoW:this.autofitWidth, autoH:this.autofitHeight},
      {args: this.args}
    )
    try {
      await this.plot?.plotAPI({...this.args}, this.w, this.h)
      .then(() => {
        this.ready = true; 
        this.plotting = false;
      })
      .then(() => {
        // NOTE: this is were I was adding new identifier columns
      })
      .then(() => {
        // NOTE: since we are in debug mode we will add plot to the window
        window.plot = this.isDebug ? this.plot : null;
      })
      .then(() => {
        // NOTE: keep track about whether we are plotting or not
        // this variable is used when _debouncing_ the updatePlot function
        this.plotting = false
      })
      .then(async () => {
        this.schema = await this.plot?._root.schema();
        // this.dispatch('udpate-schema', {schema:this.schema} as DeepScatterSchemaEvent);
        // this.dispatch('udpate-fields', {fields:this.fields} as DeepScatterFieldsEvent);
        // this.dispatch('udpate-extents', {extents:this.extents} as DeepScatterExtentEvent);
      });
      // .then(() => plot._zoom.initialize_zoom())
      // .then( () => destroyWebGLInstances())
    } catch (error) {
      console.error(error);
    }
    
  }

  public initializePlot() {
    this.plot = new this.Deepscatter(`#${this.id}`, this.w, this.h);
    this.debug({ status: 'Plot initialized' }, this.plot);
    this.updatePlot();
  }




  // columns
  // sidecars
  // embedding
  // totalPoints
  get columns() {
    let { columns } = get(this.store);
    return columns;
  }
  set columns(c: ColumnsMetadata | undefined) {
    this.store.update(store => {
      store.columns = c;
      return store;
    });
  }
  get sidecars() {
    let { sidecars } = get(this.store);
    return sidecars;
  }
  set sidecars(s: string[] | undefined) {
    this.store.update(store => {
      store.sidecars = s;
      return store;
    });
  }
  get embedding() {
    let { embedding } = get(this.store);
    return embedding;
  }
  set embedding(e: string[] | undefined) {
    this.store.update(store => {
      store.embedding = e;
      return store;
    });
  }
  get totalPoints() {
    let { totalPoints } = get(this.store);
    return totalPoints;
  }
  set totalPoints(t: number | undefined) {
    let mp = this.maxPoints ? this.maxPoints : 0;
    let tp = this.totalPoints ? this.totalPoints : 0;
    let nt = Math.max(mp, tp, t ? t : 0);
    // console.log('setting total points', mp, tp, t, nt)
    this.store.update(store => {
      store.totalPoints = nt;
      return store;
    });
  }


  // ------------------------------------------------------------------------------------------------------------------
  // UTILITIES FOR ENCODINGS
  // ------------------------------------------------------------------------------------------------------------------



  public getEncodingField(key: EncodingKey): EncodingKey | undefined {
    const encodings = this.encoding;
    if (!encodings) return undefined;
  
    const encoding = encodings[key];
    if (!encoding || typeof encoding === 'string') return undefined;
    try {
      return encoding?.field;
    } catch (error) {
      return undefined;
    }
  }
  
  get xField() {
    return this.getEncodingField('x');
  }
  
  set xField(x: string | undefined) {
    this.setEncoding('x', this.getColumnAsEncoding(x));
  }
  
  get yField() {
    return this.getEncodingField('y');
  }
  
  set yField(y: string | undefined) {
    this.setEncoding('y', this.getColumnAsEncoding(y));
  }
  
  get cField() {
    return this.getEncodingField('color');
  }
  
  set cField(c: string | undefined) {
    this.setEncoding('color', this.getColumnAsEncoding(c));
  }
  
  public setEncoding(key: EncodingKey, value: EncodingVal | undefined) {
    this.store.update(store => {
      if (!store.encoding) store.encoding = {};
  
      // Update encoding in store
      // store.encoding = { ...store.encoding, [key]: value };
      store.encoding[key] = value 
      // if (key === 'conditions') this.debug({ status: 'Inside getColumnAsEncoding'}, {key, value})
      
  
      // Auto update columns if they are out of date
      let field
      try {
        field = value?.field;
      } catch (error) {
        field = undefined;
      }
      
      if (field && store.columns && !(field in store.columns)) {
        store.columns[field] = value as ColumnMetadata;
      }
      return store;
    });
  }







  // get xField() {
  //   let { xField } = get(this.store);
  //   return xField;
  // }
  // set xField(x: string | undefined) {     
  //   this.store.update(store => {
  //     store.xField = x;
  //     let enc = this.getColumnAsEncoding(x)
  //     this.setEncoding('x', enc)
  //     return store;
  //   });
  // }
  // get yField() {
  //   let { yField } = get(this.store);
  //   return yField;
  // }
  // set yField(y: string | undefined) {
  //   this.store.update(store => {
  //     store.yField = y;
  //     let enc = this.getColumnAsEncoding(y)
  //     this.setEncoding('y', enc)
  //     return store;
  //   });
  // }
  // get cField() {
  //   let { cField } = get(this.store);
  //   return cField;
  // }
  // set cField(c: string | undefined) {
  //   this.store.update(store => {
  //     store.cField = c;
  //     let enc = this.getColumnAsEncoding(c)
  //     this.setEncoding('color', enc)
  //     return store;
  //   });
  // }

  public getColumnMetadata(colname?: string) {
    if (!colname) return undefined;
    let { columns } = get(this.store);
    if (!columns) return undefined;
    let col = columns[colname];
    return col;
  }

  public getColumnAsEncoding(colname?: string) {
    if (!colname) return undefined;
    let column = this.getColumnMetadata(colname);
    let encoding = {} as ChannelBase;
    

    // Step 1: get values from column metadata if it exists
    // these includ field and domain
    // if (colname === 'conditions') this.debug({ status: 'Inside getColumnAsEncoding'}, {colname, column})

    
    if (column?.field) encoding.field = column.field;

    if (isStringOrStrings(column?.domain)) encoding = encoding as CategoricalColorChannel;
    if (column?.domain) encoding.domain = column.domain;

    // Step 2: get values from encoding if it exists
    let encs = this.encoding
    if (!encs) return encoding;
    for (const [key, val] of Object.entries(encs)) {
      if (!val) continue;
      else if (typeof val === 'string') continue;
      else if ('field' in val && val.field === colname) {
        encoding = {...encoding, ...val}
        break
      }      
    }
    return encoding; 
  }


  public getColumnsMetadata(names?: string[]) {
    if (!names) return {};
    let items = names.map((n) => [n, this.getColumnMetadata(n)])
    let cols = Object.fromEntries(items)
    return cols
  }

  public getColumnsAsEncodings(names?: string[]) {
    if (!names) return {};
    let items = names.map((n) => [n, this.getColumnAsEncoding(n)])
    let cols = Object.fromEntries(items)
    return cols
  }





  get x() {
    if (!this.xField) return undefined;
    if (!this.columns) return undefined;
    return this.getColumnAsEncoding(this.xField as EncodingKey);
  }
  get y() {
    if (!this.yField) return undefined;
    if (!this.columns) return undefined;
    return this.getColumnAsEncoding(this.yField as EncodingKey);
  }
  get color() {
    if (!this.cField) return undefined;
    if (!this.columns) return undefined;
    return this.getColumnAsEncoding(this.cField as EncodingKey);
  }

  // public setEncoding(key: EncodingKey, value: EncodingVal | undefined) {
  //   this.store.update(store => {
  //     if (!store.encoding) store.encoding = {};
  //     let current = store.encoding[key]
  //     this.encoding = {...this.encoding, [key]: value}
  //     store.encoding = {...store.encoding, [key]: value}
      

  //     // auto update xField, yField, cField if they are out of date
  //     let field 
  //     try {
        
  //       field = value ? value?.field : undefined
  //     } catch (error) {
  //       field = undefined
  //     }

  //     if (field) {
  //       if (key === 'x' && this.xField !== field) this.xField = field
  //       if (key === 'y' && this.yField !== field) this.yField = field
  //       if (key === 'color' && this.cField !== field) this.cField = field

  //       // if new column that we don't know about
  //       this.addToColumns(field, value as ColumnMetadata)
  //     }

  //     return store;  
  //   });
  // }

  public addToColumns(name: string, metadata: ColumnMetadata) {
    this.store.update(store => {
      if (!store.columns) store.columns = {};
      if (!(name in store.columns)) {
        store.columns[name] = metadata;
      }
      return store;  
    });
  }


  public setEncodingSubkey(key: EncodingKey, subkey: string, value: any) {
    this.store.update(store => {
      if (!store.encoding) store.encoding = {};
      let current = store.encoding[key]
      if (!current) current = {} as ChannelBase
      current[subkey] = value
      this.encoding = {...this.encoding, [key]: current}
      store.encoding = {...store.encoding, [key]: current}
      return store;  
    });
  }
}


export const plotStore = new PlotState(initialState);
