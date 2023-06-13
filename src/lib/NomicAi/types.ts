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

// NOTE: this is never defined in the codebase, but is used in the type definitions.
export type ZoomAlign = undefined | 'right' | 'left' | 'top' | 'bottom' | 'center';

// NOTE this is defined in the code base but never exported
// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL71C2-L71C58
export type Transform = 'log' | 'sqrt' | 'linear' | 'literal';

// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#LL217C2-L222C5
export type ZoomCall = {
    bbox: {
      x: [number, number];
      y: [number, number];
    };
  };


// URL: https://github.com/nomic-ai/deepscatter/blob/main/src/global.d.ts#L75
export type BackgroundOptions = {
    // The color of background points. Hex codes or HTML
    // colors are accepted.
    color?: string;

    // A multiplier against the point's opacity otherwise.
    // A single value describes the background; an array
    // describes the foreground and background separately.
    opacity?: number | [number, number];

    // A multiplier against the point's size. Default 0.66.
    // A single value describes the background; an array
    // describes the foreground and background separately.

    size?: number | [number, number];

    // Whether the background points should respond on mouseover.
    mouseover?: boolean;
};


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

export type URLLabels = {
    url: string;
    options: LabelOptions;
    label_field: string;
    size_field: string;
};

export type Labelset = {
    labels: Label[];
    name: string;
    options?: LabelOptions;
};

export type Labelcall = Labelset | URLLabels | null;



// NOTE: these are all custom / new (not derived like above)
type Points = Record<string, number | string>[]

type Extent = [number, number]

type Extents = {
    x?: Extent
    y?: Extent
    z?: Extent
}

export interface DeepScatterReadyEvent {
    ready: boolean
}

interface DeepScatterExtentEvent {
    extents: Extents
}

interface DeepScatterSampleEvent {
    points: Points
}

interface DeepScatterFieldsEvent {
    fields?: string[]
}