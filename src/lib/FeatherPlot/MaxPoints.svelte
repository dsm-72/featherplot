<script lang="ts">    
    import { onMount, createEventDispatcher } from 'svelte';
    
    import { plotArgs } from './PlotArgsStore.ts';
    import type {BBox, ZoomCall} from './types.ts'
    import {defaultBBox} from './defaults.ts'

    import Slider from './Slider.svelte'

    const dispatch = createEventDispatcher();

    onMount(() => {
        if ($plotArgs?.max_points) {
            lower = $plotArgs.max_points
        }
    })

    const handleSliderChange = () => {
        plotArgs.updateMaxPoints(lower)
        dispatch('change', { maxPoints: lower });
    };

    export let id: string = 'point-slider'
    export let label:string | null = 'Number of Points'
    export let min = 10;
    export let max = 1000;
    // number of points
    export let lower = 500;
</script>

<div class="{$$props.class} select-none pointer-events-none">
    <div class="grid grid-cols-12 justify-center place-items-center gap-2 select-none">

        <div class="col-span-12 justify-self-start select-none pointer-events-none" class:hidden={label === null}>
            <label for="{id}" class="text-gray-700 text-sm font-bold select-none pointer-events-none">
                {label}: {lower}
            </label>
        </div>

        <div class="col-span-2 font-bold text-sm px-2 pointer-events-none select-none">
            {min}          
        </div>
    
        <Slider            
            {id} integer
            bind:lower
            {min} {max}
            on:change={handleSliderChange} on:click
            input$aria-label="{label}"
            class="grow col-span-8 w-full pointer-events-auto"
            minMaxLabels={false}
            tooltipNever={true}
        />

        <div class="col-span-2 font-bold text-sm px-2 pointer-events-none select-none">
            {max}
        </div>
    </div>        
</div>