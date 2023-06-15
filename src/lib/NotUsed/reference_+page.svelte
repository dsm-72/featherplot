<script lang="ts">
    export let data;   
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import DeepScatter from '$lib/NomicAi/DeepScatter.svelte';
   
    $: meta = data.meta
    $: labels = data.labels
    let plot

    /**----------------------------------------------------------------------------------
    |** CONTROL NUMBER OF POINTS
    ----------------------------------------------------------------------------------**/
    import PointSlider from '$lib/PointSlider.svelte';
    let nPoints = 500

    /**----------------------------------------------------------------------------------
    |** CONTROL WHICH AXES TO PLOT
    ----------------------------------------------------------------------------------**/
    import AxisSelector from '$lib/AxisSelector.svelte';
    
    // NOTE: AxesNames might be user defined names like
    // t-SNE 1, t-SNE 2, t-SNE 3 or PHATE 1, PHATE 2, PHATE 3
    const AxesNames = ['EMB_1', 'EMB_2', 'EMB_3']

    // NOTE: Deepscatter *expects* at least fields x and y
    // AxesNames.map((name, i) => meta.embedding_columns[i])
    const AxesMap = {
        ['EMB_1']: 'x',
        ['EMB_2']: 'y',
        ['EMB_3']: 'z',
    }

    
    $: xAxis = AxesNames[0]
    $: yAxis = AxesNames[1]
    $: xAxisOptions = [...AxesNames]
    // NOTE: remove the current xAxis from the yAxisOptions so that
    // the user can not plot the same axis twice (e.g. x vs x)
    $: yAxisOptions = [...xAxisOptions.filter(x => x !== xAxis)]
    $: xField = AxesMap[xAxis]
    $: yField = AxesMap[yAxis]

    /**----------------------------------------------------------------------------------
    |** CONTROL WHICH SIDECAR VALUES TO COLORBY
    ----------------------------------------------------------------------------------**/
    import SidecarSelector from '$lib/SidecarSelector.svelte';
    let cField: string | null = null;
    $: cFieldOptions = meta.sidecar_columns


    $: cDomain = cField === null 
        ? null 
        : cField === 'category'
            ? [0, 14]
            : cField === 'boolean' 
                ? [0, 1]
                : [-5, 5]

    $: cRange = cField === 'category' 
        ? 'tab20' : "viridis"


    /**----------------------------------------------------------------------------------
    |** BUTTONS TO ASSIST WITH DEVELOPMENT
    ----------------------------------------------------------------------------------**/
    import Bug from '$lib/btns/Bug.svelte';
    import Code from '$lib/btns/Code.svelte';
    import Config from '$lib/btns/Config.svelte';
    import Delete from '$lib/btns/Delete.svelte';
    import Draw from '$lib/btns/Draw.svelte';
    import PlayPause from '$lib/btns/PlayPause.svelte';

    $: btnsInfo = [
        ['debug', debug],
        ['code', undefined],
        ['settings', undefined],
        ['destroy', null],
        ['draw', null],
        [pause ? 'play' : 'pause', null],
    ]


    const handleDelete = async () => {
        await plot.doDestory()
    }
    const handleDraw = async () => {
        await plot.doDraw()
    }


    /**----------------------------------------------------------------------------------
    |** VARIABLES EXTRACTED FROM DEEPSCATTER COMPONENT
    ----------------------------------------------------------------------------------**/
    let debug:boolean = true
    let pause:boolean = false

    // import {DEMO_TILES_DIR, MINI_TILES_DIR} from '$lib/constants'
    import {TILES_DIR} from '../lib/constants.js'
    let url = TILES_DIR

    let isReady = false
    let curExtents = null
    let curFields = null
    let curSchema = null
    let curSamples = null
    import type {
        DeepScatterReadyEvent, DeepScatterExtentEvent, DeepScatterSampleEvent,
        DeepScatterFieldsEvent, DeepScatterSchemaEvent
    } from '$lib/NomicAi/types'

    const handleExtents = (event:DeepScatterExtentEvent) => {
        let {detail:{extents}} = event
        console.log(extents)
        curExtents = extents
    }
    const handleReady = (event:DeepScatterReadyEvent) => {
        let {detail:{ready}} = event
        console.log(ready)
        isReady = ready
    }
    const handleSample = (event:DeepScatterSampleEvent) => {
        let {detail:{sample}} = event
        console.log(sample)
        curSamples = sample
    }
    const handleFields = (event:DeepScatterFieldsEvent) => {
        let {detail:{fields}} = event
        console.log(fields)
        curFields = fields
    }
    const handleSchema = (event:DeepScatterSchemaEvent) => {
        let {detail:{schema}} = event
        console.log(schema)
        curSchema = schema
        if (curSchema) {
            console.log(curSchema.metadata.entries())
            console.log(curSchema.metadata.get('extent'))
            console.log(curSchema.metadata.get('sidecars'))
            console.log(curSchema.metadata.get('total_points'))
        }
    }
    

   

</script>
<div class="grid grid-cols-4 place-items-top justify-items-center px-8 gap-2">
    <div class="prose w-full">
        <h1>
            Dataset:
        </h1>
        <ul class="overflow-x-scroll">
            {#each Object.keys(meta) as key}
            <li>
                <span class="font-bold">
                    {key}:
                </span>
                {meta[key]}
            </li>
            {/each}                
        </ul>
    </div>
    <div class="col-span-2">        
        <div class="border-2 border-primary">
            <DeepScatter             
                {url} {debug} {pause}
                zoomBalance={0.75}
                maxPoints={nPoints}
                autofit={true}
                bind:this={plot}
                bind:ready={isReady}
                on:ready={handleReady}
                on:fields={handleFields}
                on:sample={handleSample}
                on:schema={handleSchema}
                on:extents={handleExtents}
                {xField} {yField}
                xRange={[-1, 1]}
                xDomain={[-1, 1]}
                pointSize={5}           
                {cField} {cRange} {cDomain}
            />
        </div>        
        <div class="mt-8 card w-full bg-base-200 shadow-xl card-bordered">
            <div class="card-body ">
                <h2 class="card-title">
                    DeepScatter Options
                </h2>
                <div>
                    <PointSlider
                        maxPoints={meta.n_points}
                        bind:numPoints={nPoints}
                    />
                    <span class="text-xs italic">
                        Note: maximum number of points comes from the dataset metadata ({meta.n_points}).
                    </span><br>
                    <span class="text-xs italic">
                        Total points from <span class='kbd'>plot._iroot.schema()</span>
                        {curSchema?.metadata.get('total_points')}. Additionally, <span class="kbd">plot?._root?.table?.schema?.fields</span> is not always responsive.
                    </span>
                </div>
                <div class="inline-flex w-full gap-2">
                    <AxisSelector
                        axis="x" options={xAxisOptions} class=""
                        bind:value="{xAxis}" on:change="{() => yAxis = yAxisOptions[0]}"
                    />
                    <AxisSelector axis="y" options={yAxisOptions} bind:value="{yAxis}" />
                </div>
                <div class="w-full">
                    <SidecarSelector 
                        axis="c" options={cFieldOptions} bind:value={cField}                
                    />
                    <span class="text-xs italic">
                        range: {cRange}
                    </span>
                    <span class="text-xs italic">
                        domain: {cDomain}
                    </span>
                </div>
            </div>
          </div>

        
        
    </div>
    <div class="inline-flex flex-col w-full place-items-center">
        <div class="flex flex-wrap flex-row gap-2">
            <div class="tooltip tooltip-secondary " data-tip="toggle debug">
                <Bug bind:value={debug} class="{debug ? 'stroke-accent' : 'stroke-secondary'}"/>
            </div>            
            <Code/>
            <Config/>
            <div class="tooltip tooltip-error" data-tip="destroy">
                <Delete on:delete={handleDelete}/>
            </div>            
            <div class="tooltip tooltip-success" data-tip="force draw">
                <Draw on:draw={handleDraw}/>
            </div>
            <div class="tooltip tooltip-info tooltip-top" data-tip="{pause ? 'responsive' : 'unresponsive'}">
                <PlayPause bind:value={pause} class="{pause ? 'stroke-accent' : 'stroke-secondary'}"/>
            </div>
        </div> 
        <div class="prose">
            <ul>
                {#each btnsInfo as [btn, val]}
                <li>
                    <span class="text-sm font-bold">
                        {btn} {val === null || val === undefined ? '' : ':'}
                    </span>
                    {#if val !== undefined}
                    <span class="text-xs">
                        {val === null ? 'click to activate' : val}
                    </span>
                    {/if}
                </li>                
            {/each}
            </ul>
            
        </div>
    </div>
</div>

<!-- <DeepScatter
    url={DIR_POINT_TILES}
    {backgroundColor}
    nPoints={numCells}
    xField={AxesMap[xAxis]} yField={AxesMap[yAxis]}
    on:ready={({detail:{ready}}) => {
        ready = ready
    }}
    on:extents={({detail:{extents}}) => {
        extents = extents
    }}
    cSpec={expressionColors}
    bind:this={plot}
>
</DeepScatter>
 -->
