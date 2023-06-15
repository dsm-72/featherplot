/* NOTE: defaults are found here:
** https://github.com/nomic-ai/deepscatter/blob/main/src/defaults.ts#L8
** However, they are not exported to a level were we can import them, so we redefine them here.
*/
export const defaultBackgroundOptions = {
    color: '#fff',
    opacity: [0.2, 1],
    size: [0.66, 1],
    mouseover: false,
};

export const defaultAPICall = {
    zoomBalance: 0.35,
    // One second transitions
    duration: 1000,
    // Not many points.
    maxPoints: 1000,
    // Encoding defaults are handled by the Aesthetic class.
    encoding: {},
    pointSize: 1, // base size before aes modifications.
    alpha: 40, // Default screen saturation target.
    backgroundOptions: defaultBackgroundOptions,
    zoomAlign: 'center',
} as const;
