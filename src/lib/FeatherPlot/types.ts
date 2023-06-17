// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Type Aliases
// ------------------------------------------------------------------------------------------------------------------
// NOTE this is defined in the code base but never exported
// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL71C2-L71C58
export type Transform = 'log' | 'sqrt' | 'linear' | 'literal';

export type constant = number | string | boolean | undefined 

// NOTE: these are never defined in the codebase
export type MinMax = [number, number]// | [string, string];

export type Range  = [number, number];
export type Domain = [number, number];

export type StringOrStrings = string | string[];

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Points and Extents
// ------------------------------------------------------------------------------------------------------------------

// NOTE: these are all custom / new (not derived like above)
export type Points = Record<string, number | string>[]

export type Extents = {
    x?: Domain
    y?: Domain
    z?: Domain
}

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Events
// ------------------------------------------------------------------------------------------------------------------

export interface DeepScatterReadyEvent {
    ready: boolean
}

export interface DeepScatterExtentEvent {
    extents: Extents
}

export interface DeepScatterSampleEvent {
    points: Points
}

export interface DeepScatterFieldsEvent {
    fields?: string[]
}

export interface DeepScatterSchemaEvent {
    schema?: any
}


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Zoom
// ------------------------------------------------------------------------------------------------------------------

// NOTE: this is never defined in the codebase, but is used in the type definitions.
export type ZoomAlign = undefined | 'right' | 'left' | 'top' | 'bottom' | 'center';

// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL217C2-L222C5
export type ZoomCall = {
    bbox: BBox
};

export type BBox = {
    x: [number, number];
    y: [number, number];    
}


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Background Options
// ------------------------------------------------------------------------------------------------------------------

// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#L75
export type BackgroundOptions = {
    color?: string;
    opacity?: number | MinMax;
    size?: number | MinMax;
    mouseover?: boolean;
};


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Labels
// ------------------------------------------------------------------------------------------------------------------

// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL245-L267C55
export type Label = {
    x: number;
    y: number;
    text: string;
};

export type LabelOptions = {
    useColorScale?: boolean; // Whether the colors of text should inherit from the active color scale.
    margin?: number; // The number of pixels around each box. Default 30.
    draggable_labels?: boolean; // Should labels be draggable in place?
};


export type LabelCall = LabelSet | URLLabels | null;


interface LabelBase {
    options?: LabelOptions;
}

export type URLLabels = LabelBase & {
    url: string;
    label_field: string;
    size_field: string;
};

export type LabelSet = LabelBase & {
    labels: Label[];
    name: string;
};

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Constant Channels
// ------------------------------------------------------------------------------------------------------------------

export type BaseConstantChannel<T> = {
    constant: T;
};

export type ConstantBool = BaseConstantChannel<boolean>;
export type ConstantNumber = BaseConstantChannel<number>;
export type ConstantColorChannel = BaseConstantChannel<string>;

export type ConstantChannel = ConstantBool | ConstantNumber | ConstantColorChannel;


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Conditional & Functional Channels
// ------------------------------------------------------------------------------------------------------------------
export interface ChannelBase {
    field: string;
    [name: string]: any;
}

// NOTE: never defiend
export type SingleArgumentConditonal = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq';
export type TwoArgumentConditional = 'between' | 'within';
export type Conditional = SingleArgumentConditonal | TwoArgumentConditional;

// NOTE: never exported
// NOTE: I renamed these / tweaked them 
// https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#L21-L73
export interface ConditionalChannel extends ChannelBase {
    a: number;
    b?: number;
    op: Conditional;
}

export interface LambdaChannel extends ChannelBase {
    lambda: string;
    domain: Domain;
    range: Range;
}

export type FunctionalChannel = LambdaChannel | ConditionalChannel;

export type BooleanChannel = FunctionalChannel | ConstantBool;

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Channels
// ------------------------------------------------------------------------------------------------------------------



export interface BasicChannel extends ChannelBase {
    transform?: Transform;
    domain?: MinMax;
    range?: MinMax;
    [name: string]: any;
}

export interface CategoricalChannel extends ChannelBase {}


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Color Channels
// ------------------------------------------------------------------------------------------------------------------

export interface ColorChannelBase extends ChannelBase {
    range?: StringOrStrings;
}

export type BasicColorChannel = BasicChannel & ColorChannelBase;
export type CategoricalColorChannel = CategoricalChannel & ColorChannelBase & { domain?: string[]; };

export type ColorChannel =
    | BasicColorChannel
    | CategoricalColorChannel
    | ConstantColorChannel;



// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Root Channels
// ------------------------------------------------------------------------------------------------------------------

export type RootChannel = 
    | BooleanChannel
    | BasicChannel
    | string
    | ConditionalChannel
    | ConstantColorChannel
    | ConstantChannel
    | LambdaChannel;


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Jitter Channels
// ------------------------------------------------------------------------------------------------------------------

export type JitterRadiusMethod = | 'None' | 'spiral' | 'uniform' | 'normal' | 'circle' | 'time';

export type JitterChannel = RootChannel & {
    method: JitterRadiusMethod;
};
    

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter Encoding
// ------------------------------------------------------------------------------------------------------------------

export type EncodingKey = 'x' | 'y' | 'color' | 'size' | 'shape' 
    | 'filter' | 'filter2' | 'jitter_radius' | 'jitter_speed' 
    | 'x0' | 'y0' | 'position' | 'position0' | 'foreground';


export type EncodingVal = RootChannel | ColorChannel | FunctionalChannel | JitterChannel | string | null;

export type EncodingBase = {
    [K in EncodingKey]?: EncodingVal;
}

export type Encoding = EncodingBase & {
    x?: RootChannel;
    y?: RootChannel;
    color?: null | ColorChannel;
    size?: null | RootChannel;
    shape?: null | RootChannel;
    filter?: null | FunctionalChannel;
    filter2?: null | FunctionalChannel;
    jitter_radius?: null | JitterChannel;
    jitter_speed?: null | RootChannel;
    x0?: null | RootChannel;
    y0?: null | RootChannel;
    position?: string;
    position0?: string;
    foreground?: null | FunctionalChannel;
};

// ------------------------------------------------------------------------------------------------------------------
// DeepScatter PlotArgs
// ------------------------------------------------------------------------------------------------------------------

export type PlotArgs = {    
    zoom?: ZoomCall;
    zoom_align?: ZoomAlign;
    /** The magnification coefficient for a zooming item */
    zoom_balance?: number;

    encoding?: Encoding;

    /** The length of time to take for the transition to this state. */
    duration?: number;

    /** The base point size for aes is modified */
    point_size?: number;

    /** The maximum number of points to load */
    max_points?: number;

    /** Overall screen saturation target at average point density */
    alpha?: number;

    /** A function defind as a string that takes implied argument 'datum' */
    click_function?: string;

    labels?: LabelCall;
    background_options?: BackgroundOptions;  
    [name: string]: any;
};

// ------------------------------------------------------------------------------------------------------------------
// Dataset and MetaData
// ------------------------------------------------------------------------------------------------------------------

export type DatasetMetadata = null | {
    // label column between main data and sidecar data, e.g. "label" / "barcode"
    index: string

    // total number of datapoints
    n_points: number; 

    // seed used to make data
    seed?: number;

    // where dataset was stored
    target_dir?: string;

    // size of tiles when using quadfeather
    tile_size?: number;

    // the relative path (eventually static URL) that deepscatter will be pointed to
    tiles_dir: string;

    // list of all columns
    columns: string[]
    
    // list of embeding columns
    embedding: string[]

    // list of explict sidecar columns
    sidecars: string[]

    // map of {colname: metadata} needed for formatting channels
    columns_metadata: ColumnsMetadata    
    [name: string]: any;
}

export type MetaType = 'number' | 'category' | 'boolean' | 
    'LambdaChannel' | 'ConditionalChannel' | 'ConditionalChannel' |
    'BasicBooleanChannel' | 'CategoricalColorChannel' | 'BasicChannel'

export type ColumnMetadata = {
    // name of column (internal)
    field: string

    // human readable column label
    human?: string
    type?:  MetaType
    is_sidecar?: boolean

    min?: number | string
    max?: number | string
    domain?: Domain
    [name: string]: any;
}

export type ColumnsMetadata = {
    [key: string]: ColumnMetadata;    
}


// ------------------------------------------------------------------------------------------------------------------
// DeepScatter PlotStore
// ------------------------------------------------------------------------------------------------------------------

export type PlotStore = {
    args: PlotArgs;
    meta: DatasetMetadata | null;    
    [name: string]: any;
}



// ------------------------------------------------------------------------------------------------------------------
// FeatherPlot PlotStore
// ------------------------------------------------------------------------------------------------------------------
export type DebugDetails = {
    status: string;
    event?: Event;
};
export type DebugMisc = any[];

export type DebugMethod = (details: DebugDetails, ...misc: DebugMisc) => void;