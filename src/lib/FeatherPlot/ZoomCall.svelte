<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { plotAPIArgs } from './plotAPIStore.ts';
  import Slider from '@smui/slider';


  const dispatch = createEventDispatcher();

  let minX = 0;
  let maxX = 100;
  let minY = 0;
  let maxY = 100;

  let valX = [minX, maxX]
  let valY = [minY, maxY]

  $: bbox = { x: [minX, maxX], y: [minY, maxY] }

  // Subscribe to the store
  plotAPIArgs.subscribe((value) => {
    [minX, maxX] = value.zoom_call.bbox.x;
    [minY, maxY] = value.zoom_call.bbox.y;
  });

  // Function to handle slider changes
  const handleSliderChange = (axis, values) => {
    plotAPIArgs.update((value) => {
      value.zoom_call.bbox[axis] = values;
      return value;
    });
    dispatch('change', { bbox });
  };
</script>

<div class="p-4 bg-white rounded shadow">
  <div class="flex items-center justify-between">
    <div class="w-1/2 pr-2">
      <Slider
        bind:start={valX[0]}
        bind:end={valX[1]}
        min={minX}
        max={maxX}
        on:change={() => handleSliderChange('x', [minX, maxX])}
      />
    </div>
    <div class="w-1/2 pl-2">
      <Slider
        bind:start={valY[0]}
        bind:end={valY[1]}
        min={minY}
        max={maxY}
        on:change={() => handleSliderChange('y', [minY, maxY])}
      />
    </div>
  </div>
</div>

<style>
  /* Add your Tailwind CSS styles here */
</style>
