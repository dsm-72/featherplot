<script lang="ts">
    import { onDestroy } from 'svelte';
    import type {SvelteComponent} from 'svelte'
    import { plotStore } from './PlotStore.ts';
    import Slider from './Slider.svelte'
    import { createEventDispatcher } from 'svelte';
    import Page from '../../routes/+page.svelte';

    const dispatch = createEventDispatcher();
    let min = 10;
    let lower = $plotStore.maxPoints || 100
    $: max = $plotStore.totalPoints || 500
    
    $: if (lower) {
        plotStore.maxPoints = lower
        dispatch('change', { maxPoints: lower });
        // slider.lower = lower
        if (slider) slider.manuallySetBounds(min, max, lower)
    }

    let slider: SvelteComponent

    export let id: string = 'point-slider';
    export let label: string | null = 'Number of Points';
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
            bind:this={slider}
            {id} integer
            bind:lower={lower}
            {min} {max}
            on:click
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
