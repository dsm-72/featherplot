<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    interface DeepScatterReadyEvent {
        ready: boolean
    }
    $: dispatch('ready', {ready} as DeepScatterReadyEvent)
    
    type Extent = [number, number]
    type Extents = {
        x: Extent
        y: Extent
        z: Extent
    }
    const emptyExtents = {x: null, y: null, z: null}

    interface DeepScatterExtentEvent {
        extents: Extents
    }

    $: dispatch('extents', {extents} as DeepScatterExtentEvent)
    $: dispatch('fields', {fields})
    
    
    let Deepscatter = null
    type DeepScatter = typeof Deepscatter    
    // import Deepscatter from 'deepscatter';
    // import Deepscatter from 'deepscatter?client';
    onMount(async () => {        
        const Scatterplot = await import('deepscatter');
        if (debug) console.debug(Scatterplot)
        Deepscatter = Scatterplot.default;
    });
    

    // NOTE: required props
    export let url: string


    // NOTE: props with defaults
    export let htmlID = 'deepscatter'
    export let backgroundColor = '#fff'
    export let width = 600;
    export let height = 400;
    export let nPoints = 1000;
    
    export let xField = 'x';
    export let yField = 'y';    
    export let xTransform = 'literal';
    export let yTransform = 'literal';


    interface DeepScatterColorSpecifcation {
        field?: string;
        range?: string;
        domain?: [number, number];
        transform?: string;
        datamap?: Record<string, number>[];
        reference?: string;
    }

    export let cField = 'z';
    export let cRange = 'viridis'
    export let cSpec: DeepScatterColorSpecifcation

    
    export let pointSize = 5
    export let alpha = 25
    export let zoomBalance = .75

    // NOTE: for redrawing
    const duration = 1
    export let debug = true

    


    // For trying to autofit the plot to the container    
    export let autofit = true
    let autofitWidth = width
    let autofitHeight = height
    $: w = autofit ? autofitWidth : width
    $: h = autofit ? autofitHeight : height

    // For trying to debounce the redrawing
    export let delayPlotAPI = 500;
    export let delayDestory = 250;
    let plotting = false

    let timer:ReturnType<typeof setTimeout>;
    const debouncePlotAPI = (opts:any) => {
        if (plotting) return
        if (debug) console.debug('debouncePlotAPI', {plotting, ready})
        // NOTE: this can result in the following warning: 
        //       There are too many active WebGL contexts on this page, 
        //       the oldest context will be lost.
		clearTimeout(timer);
        plotting = true
        timer = setTimeout(async () => {
            // console.log('setTime', debouncing, ready)
            // ready = false;           
            plot.plotAPI({ duration, ...opts})
                .then(() => ready = true)
                .then(() => {
                    let cmap = cSpec?.datamap || null
                    if (cmap !== null) {
                        addIdentifierColumn(cSpec.field, cmap, cSpec?.reference)
                        // plot?.add_identifier_column(cSpec.field, cmap, cSpec?.reference)
                    }
                })
                .then( () => window.plot = plot)
                .then( () => plotting = false) 
                // .then(() => plot._zoom.initialize_zoom())
                // .then( () => destroyWebGLInstances())          
		}, delayPlotAPI);
	}

    let dimer:ReturnType<typeof setTimeout>;
    let destorying = false
    const debounceDestroy = async () => {
        if (destorying) return
        // NOTE: this can result in the following warning: 
        //       There are too many active WebGL contexts on this page, 
        //       the oldest context will be lost.
        clearTimeout(dimer);
        destorying = true
        return new Promise((resolve) => {
            dimer = setTimeout(async () => {
                if (debug) console.log('debounceDestroy timeout');
                destroy().then(() => {
                    resolve()
                    destorying = false
                    destroyWebGLInstances()
                })  
            }, delayDestory);
        });
    };

    const destroy = async () => {
        if (plot !== null) {
            plot.destroy()
            if (debug) console.log('destroyed', plot)
            ready = false;
        }
        return Promise.resolve();
    }

    
    // let plot: DeepScatter | null = null
    let plot: any | null = null
    let ready: boolean = false
    
    $: if (browser && Deepscatter !== null) {
        // To handle redraws, we need to destroy the plot and recreate it   
        debounceDestroy().then(() => {
            // NOTE: tis gets called a bunch since it is reactive on plot and 
            // plot.destory() changes it
            plot = new Deepscatter(`#${htmlID}`, w, h)
            debouncePlotAPI({...options})
        })
    }

    // NOTE: internal props
    $: extents = (ready ? plot?._root?.extent : emptyExtents) as Extents
    $: xExtent = extents?.x || null
    $: yExtent = extents?.y || null
    $: zExtent = extents?.z || null

    $: fields = (ready ? plot?._root?.table?.schema?.fields : []) as string[]


    // NOTE: I no longer need this since options is already reactive
    // NOTE: reactive updates
    // $: if (ready) {
    //     // console.debug('Options changed going to debouncePlotAPI')
    //     debouncePlotAPI({...options,})
    // }



    // NOTE: single update better than many updates
    // $: if (ready) {
    //     console.log('backgroundColor change')
    //     debounce({duration, background_color: backgroundColor})
    // }

    // $: if (ready) {
    //     console.log('backgroundColor change')
    //     debounce({duration, background_color: backgroundColor})
    // }

    // NOTE: encoding API based roughly on Vega Lite: 
    //       https://vega.github.io/vega-lite/docs/encoding.html
    $: defaultColors = {
        field: cField,
        range: cRange,
        domain: [0, .001],
    }
    $: encoding = {
        x: {
            field: xField,
            transform: xTransform
        },
        y: {
            field: yField,
            transform: yTransform
        },
        color: (cSpec === null) ? defaultColors : cSpec
    }

    // NOTE: default options
    $: options = {
        alpha,
        source_url: url,
        max_points: nPoints,
        point_size: pointSize,
        zoom_balance: zoomBalance,
        background_color: backgroundColor,
        encoding,
        duration
    }  

    type Points = Record<string, number | string>[]
    interface DeepScatterSampleEvent {
        points: Points
    }
    export const samplePoints = (n:number) => {
        if (ready && plot) {
            let points = plot?.sample(n)
            dispatch('sample', {points} as DeepScatterSampleEvent)
        }
    }
    export const reZoom = () => {
        if (ready && plot) {
            plot?._zoom.initialize_zoom();
        }
    }

    export const addIdentifierColumn = async (field:string, datamap:Record<string, number>[], reference:string) => {
        if (debug) console.debug('addIdentifierColumn', {field, datamap, reference, plot, ready})
        if (plot) {
            // await plot?.add_identifier_column(field, datamap, reference)
            plot?.add_identifier_column(field, datamap, reference)
        }
    }


    const destroyWebGLInstances = () => {
        // Get all canvas elements
        const canvasElements = document.getElementsByTagName('canvas');
        if (debug) console.debug(`Trying to destory WebGL instances of ${canvasElements.length} canvas elements`)

        // Loop through each canvas element
        for (let i = 0; i < canvasElements.length; i++) {
            const canvas = canvasElements[i];

            // Get the WebGL context for the canvas
            const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            // Check if a WebGL context exists for the canvas
            if (context) {                
                // Call the loseContext method to release WebGL resources
                if (debug) console.debug(`Trying to lose WebGL context for canvas ${i}`)
                context.getExtension('WEBGL_lose_context').loseContext();
            }
        }
    };

</script>
<div 
    class="flex justify-content-center {$$props.class}"
    bind:clientWidth={autofitWidth} 
    bind:clientHeight={autofitHeight} 
>
    <div
        class="{$$props.class}"
        style:width="{w}px"
        style:height="{h}px"
    >
        <div id="{htmlID}" class="w-full"></div>
    </div>
</div>

