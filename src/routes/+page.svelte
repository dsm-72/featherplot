<script lang="ts">
    export let data;   
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import DeepScatter from '$lib/NomicAi/DeepScatter.svelte';
   
    $: meta = data.meta
    $: labels = data.labels
    let plot

    import Bug from '$lib/btns/Bug.svelte';
    import Code from '$lib/btns/Code.svelte';
    import Config from '$lib/btns/Config.svelte';
    import Delete from '$lib/btns/Delete.svelte';
    import Draw from '$lib/btns/Draw.svelte';
    import PlayPause from '$lib/btns/PlayPause.svelte';


    let debug:boolean = true
    let pause:boolean = false

    import {DEMO_TILES_DIR} from '$lib/constants'
    let url = DEMO_TILES_DIR

    let ready = false
    let extents = null
    let fields = null
    import type {
        DeepScatterReadyEvent, DeepScatterExtentEvent, DeepScatterSampleEvent,
        DeepScatterFieldsEvent
    } from '$lib/NomicAi/types'
    const handleExtents = (event:DeepScatterExtentEvent) => {
        let {detail:{extents}} = event
        console.log(extents)
    }
    const handleReady = (event:DeepScatterReadyEvent) => {
        let {detail:{ready}} = event
        console.log(ready)
    }
    const handleSample = (event:DeepScatterSampleEvent) => {
        let {detail:{sample}} = event
        console.log(sample)
    }
    const handleFields = (event:DeepScatterFieldsEvent) => {
        let {detail:{fields}} = event
        console.log(fields)
    }
    const handleDelete = async () => {
        await plot.doDestory()
    }
    const handleDraw = async () => {
        await plot.doDraw()
    }

</script>
<div class="grid grid-cols-5 place-items-center">
    <div class="bg-sky-100 h-16">
    </div>
    <div class="col-span-3">
        <DeepScatter 
            {url} {debug} {pause}
            zoomBalance={0.75}
            maxPoints={20000}            
            autofit={true}
            bind:this={plot}
            bind:ready={ready}
            on:ready={handleReady}
            on:fields={handleFields}
            on:sample={handleSample}
            on:extents={handleExtents}
        />
    </div>
    <div class="">
        <div>
            <Bug bind:value={debug} class="{debug ? 'stroke-accent' : 'stroke-secondary'}"/>
            <Code/>
            <Config/>
            <Delete on:delete={handleDelete}/>
            <Draw on:draw={handleDraw}/>
            <PlayPause bind:value={pause} class="{pause ? 'stroke-accent' : 'stroke-secondary'}"/>
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
