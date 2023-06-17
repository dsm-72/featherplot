<script lang="ts">
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { plotStore } from './PlotStore.ts';
    

    let id = $plotStore.id;
    let autofit = $plotStore.autofit
    
    let width = $plotStore.width
    let height = $plotStore.height

    let autofitWidth = $plotStore.autofitWidth;
    let autofitHeight = $plotStore.autofitHeight;
    $: w = $plotStore.w
    $: h = $plotStore.h
    const resize = () => {      
      plotStore.autofitWidth = autofitWidth
      plotStore.autofitHeight = autofitHeight
    }

    
    onMount(async () => {
      if(plotStore.browser) {
        if (!plotStore.Deepscatter) 
          await plotStore.LoadDeepscatter();

        // console.log(plotStore.args)
        // console.log(plotStore.width, plotStore.height)
        plotStore.initializePlot();
      }
    });

    

</script>
<svelte:window on:resize={resize} />

<div
    class="flex justify-content-center {$$props.class}"
    bind:clientWidth={autofitWidth} bind:clientHeight={autofitHeight}
>
    <div class={$$props.class} style:width="{w}px" style:height="{h}px">
        <div {id} class="w-full" />
    </div>
</div>