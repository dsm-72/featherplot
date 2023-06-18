import type {
    RootChannel,
    ColorChannel,
    FunctionalChannel,
    JitterChannel,
    ConstantChannel,
    LambdaChannel,
    ConditionalChannel,
} from "./types.ts";

import { isObject,} from "./utils.ts";

// ------------------------------------------------------------------------------------------------------------------
//  Type Guards
// ------------------------------------------------------------------------------------------------------------------

export const isConstantChannel = (val: any): val is ConstantChannel => {
    return isObject(val) && "constant" in val;
};

export const isLambdaChannel = (val: any): val is LambdaChannel => {
    return isObject(val) && "lambda" in val;
};

export const isConditionalChannel = (val: any): val is ConditionalChannel => {
    return isObject(val) && "op" in val;
};

export const isColorChannel = (val: any): val is ColorChannel => {
    return isObject(val) && "Range" in val;
};

export const isFunctionalChannel = (val: any): val is FunctionalChannel => {
    return isObject(val) && "Domain" in val && "Range" in val;
};

export const isJitterChannel = (val: any): val is JitterChannel => {
    return isObject(val) && "method" in val;
};

export const isRootChannel = (val: any): val is RootChannel => {
    return typeof val === "object" && "field" in val;
};

export const isStringOrNull = (val: any): val is string | null => {
    return typeof val === "string" || val === null;
};


export const isStringOrStrings = (val: any): val is string | string[] => {
    return typeof val === "string" || (Array.isArray(val) && val.every((v: any) => typeof v === "string"));
}