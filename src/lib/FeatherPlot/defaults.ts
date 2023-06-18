import type {
  ZoomCall, BBox,
} from './types.ts';


export const defaultBBox = {
    x: [0.00, 0.00],
    y: [0.00, 0.00],
} as BBox

export const defaultZoomCall = {
    bbox: defaultBBox
} as ZoomCall

export const defaultBackgroundOptions = {
    color: '#fff',
    opacity: [0.2, 1],
    size: [0.66, 1],
    mouseover: false,
};

export const defaultAPICall = {
    zoom_balance: 0.35,
    // One second transitions
    duration: 1000,
    // Not many points.
    max_points: 1000,
    // Encoding defaults are handled by the Aesthetic class.
    encoding: {},
    point_size: 1, // base size before aes modifications.
    alpha: 40, // Default screen saturation target.
    background_options: defaultBackgroundOptions,
    zoom_align: 'center',
} as const;

