export type ColumnMetadata = {
    name: string; // arrow format e.g. 'x' 
    text: string; // human friendly e.g. 't-SNE 1'
    type: string; // float64 | categorical | boolean | string, etc
    min: number
    max: number
    is_sidecar: boolean
    domain: [number, number]
}

export type ColumnsMetadata = {
    [key: string]: ColumnMetadata
}

export type Metadata = {
    column_metadata: ColumnMetadata;
    dataset_name: string;
    embedding_columns?: string[];
    sidecar_columns?: string[];
    label_name?: string;
    n_points?: number;
    seed?: number;
    target_dir?: string;
    tile_size?: number;
    tiles_dir?: string;
}


export type PlotAPIArgs = {
    zoom_call: ZoomCall;
    encoding: EncodingChannels;
};

// NOTE: this is never defined in the codebase, but is used in the type definitions.
export type ZoomAlign = undefined | 'right' | 'left' | 'top' | 'bottom' | 'center';

// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL217C2-L222C5
export type ZoomCall = {
    bbox: {
        x: [number, number];
        y: [number, number];
    };
};
  

export type constant = number | string | boolean | undefined 

// NOTE: these are never defined in the codebase
export type range  = [number, number];
export type domain = [number, number];

type BasicColorRange = string[] | string;
type CategoricalColorRange = string[] | string;
type CategoricalColorDomain = string[];


export type Range  = range | BasicColorRange | CategoricalColorRange;
export type Domain = domain | CategoricalColorDomain;

// NOTE: never defiend
export type SingleArgumentConditonal = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq';
export type TwoArgumentConditional = 'between' | 'within';
export type Conditional = SingleArgumentConditonal | TwoArgumentConditional;
// NOTE: never exported
// NOTE: I renamed these / tweaked them 
// https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#L21-L73
export type ConditionalChannel = {
    field: string;
    a: number;
    b?: number;
    op: Conditional;
}

export type LambdaChannel = {
    field: string;
    lambda: string;
    domain: domain;
    range: range;
}

export type FunctionalChannel = LambdaChannel | ConditionalChannel;



// NOTE this is defined in the code base but never exported
// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL71C2-L71C58
export type Transform = 'log' | 'sqrt' | 'linear' | 'literal';

export interface BasicChannel {
    field: string;
    /**
     * A transformation to apply on the field.
     * 'literal' maps in the implied dataspace set by 'x', 'y', while
     * 'linear' transforms the data by the range and domain.
     */
    transform?: Transform;
    // The domain over which the data extends
    domain?: [number, number];
    // The range into which to map the data.
    range?: [number, number];
}

type ConstantBool = {
    constant: boolean;
};

export type ConstantNumber = {
    constant: number;
};

export type ConstantColorChannel = {
    constant: string;
};

export type ConstantChannel =
    | ConstantBool
    | ConstantNumber
    | ConstantColorChannel;


export type BooleanChannel = FunctionalChannel | ConstantBool;

export interface CategoricalChannel {
    field: string;
}


export type BasicColorChannel = BasicChannel & {
    range?: string[] | string;
    domain?: [number, number];
};


export type CategoricalColorChannel = CategoricalChannel & {
    range?: string | string[];
    domain?: string[];
};

export type ColorChannel =
    | BasicColorChannel
    | CategoricalColorChannel
    | ConstantColorChannel;


export type RootChannel = 
    | BooleanChannel
    | BasicChannel
    | string
    | ConditionalChannel
    | ConstantColorChannel
    | ConstantChannel
    | LambdaChannel;


export type JitterRadiusMethod = | 'None' | 'spiral' | 'uniform' | 'normal' | 'circle' | 'time';


export type JitterChannel = RootChannel & {
    /**
     * Jitter channels have a method.
     * 'spiral' animates along a log spiral.
     * 'uniform' jitters around a central point.
     * 'normal' jitters around a central point biased towards the middle.
     * 'circle' animates a circle around the point.
     * 'time' lapses the point in and out of view.
     */
    method: JitterRadiusMethod;
};


export type EncodingKey = 'x' | 'y' | 'color' | 'size' | 'shape' 
    | 'filter' | 'filter2' | 'jitter_radius' | 'jitter_speed' 
    | 'x0' | 'y0' | 'position' | 'position0' | 'foreground';
    
export type EncodingVal = RootChannel | ColorChannel |FunctionalChannel | JitterChannel | string | null | undefined;

export type Encoding = {
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

export type EncodingChannels = Encoding | {
    [K in EncodingKey]?: EncodingVal;
}// & Encoding
