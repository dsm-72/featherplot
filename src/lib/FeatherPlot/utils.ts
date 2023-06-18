export const isObject = (val: any): val is object => {
    return val !== null && typeof val === 'object';
}

export const destroyWebGLInstances = (debug:boolean) => {
    // Get all canvas elements
    const canvasElements = document.getElementsByTagName('canvas');

    if (debug)
        console.debug(`Trying to destory WebGL instances of ${canvasElements.length} canvas elements`);

    // Loop through each canvas element
    for (let i = 0; i < canvasElements.length; i++) {
        const canvas = canvasElements[i];

        // Get the WebGL context for the canvas
        const context =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        // Check if a WebGL context exists for the canvas
        if (context) {
            // Call the loseContext method to release WebGL resources
            if (debug)
                console.debug(`Trying to lose WebGL context for canvas ${i}`,);            
            context.getExtension('WEBGL_lose_context').loseContext();
        }
    }
};