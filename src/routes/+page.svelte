<script lang="ts">
    export let data;   
    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    // import DeepScatter from '$lib/NomicAi/DeepScatter.svelte';
   
    $: meta = data.meta
    $: labels = data.labels
    let plot

    import Code from '$lib/btns/Code.svelte';
    import Config from '$lib/btns/Config.svelte';
    import Delete from '$lib/btns/Delete.svelte';
    import Draw from '$lib/btns/Draw.svelte';
    import PlayPause from '$lib/btns/PlayPause.svelte';
</script>
<div class="grid grid-cols-5 place-items-center">
    <div class="bg-sky-100 h-16">
    </div>
    <div class="col-span-3 bg-sky-200 h-16">
    </div>
    <div class="">
        <Code/>
        <Config/>
        <Delete/>
        <Draw/>
        <PlayPause/>
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
