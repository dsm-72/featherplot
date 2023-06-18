<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  import { plotStore } from './PlotStore.ts';
  import type {BBox, ZoomCall} from './types.ts'
  import RangeSlider from './RangeSlider.svelte'
  import {defaultBBox} from './defaults.ts'

  const dispatch = createEventDispatcher();

  
  let {x: [lowerX, upperX], y: [lowerY, upperY]} = defaultBBox

  onMount(() => {
    if ($plotStore.zoom?.bbox) {
      lowerX = $plotStore.zoom.bbox.x[0]
      upperX = $plotStore.zoom.bbox.x[1]
      lowerY = $plotStore.zoom.bbox.y[0]
      upperY = $plotStore.zoom.bbox.y[1]
    }
  })

  export let minX = -2;
  export let maxX = 2;
  export let minY = -2;
  export let maxY = 2;

  export let step = 0.01

  $: bbox = { x: [lowerX, upperX], y: [lowerY, upperY] };
  $: zoom = {bbox} as ZoomCall
  // Function to handle slider changes
  const handleSliderChange = () => {
    plotStore.zoom = zoom
    dispatch('change', { bbox });
  };

  export let id = 'zoom-box-sliders'

</script>

<div class="col-span-12 justify-self-start select-none point-event-none">
  <label  for={id}  class="text-gray-700 text-sm font-bold">
    Zoom Box
  </label>
</div>

<div {id} class="select-none point-event-none">
  <div class="inline-flex w-full place-items-center justify-center place-content-center align-middle gap-2">
    <div class="inline-flex align-middle pl-4">
      x:
    </div>
    <RangeSlider
      class="w-full"
      label={null}
      on:change={handleSliderChange}        
      bind:lower={lowerX}
      bind:upper={upperX}
      {step} min={minX} max={maxX}
    />
  </div>
  
  <div class="inline-flex w-full place-items-center justify-center place-content-center align-middle gap-2">
    <div class="inline-flex align-middle pl-4">
      y:
    </div>
    <RangeSlider
      class="w-full"
      label={null}
      on:change={handleSliderChange}
      bind:lower={lowerY}
      bind:upper={upperY}
      {step} min={minY} max={maxY}
    />
  </div>
</div>
