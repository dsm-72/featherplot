<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  
  import { plotArgs } from './PlotArgsStore.ts';
  import type {ZoomBox} from './PlotArgsStore.ts'

  import Slider from '@smui/slider';
  import RangeSlider from './RangeSlider.svelte'
  import Button, { Label, Icon } from '@smui/button';
  import MenuSurface from '@smui/menu-surface'
  
  const dispatch = createEventDispatcher();

  let {x: [lowerX, upperX], y: [lowerY, upperY]} = $plotArgs.zoom_call.bbox

  export let minX = -2;
  export let maxX = 2;
  export let minY = -2;
  export let maxY = 2;

  export let step = 0.01

  $: bbox = { x: [lowerX, upperX], y: [lowerY, upperY] };


  // Function to handle slider changes
  const handleSliderChange = () => {
    plotArgs.updateZoomCall(bbox as ZoomBox)
    dispatch('change', { bbox });
  };

  let surface: MenuSurface;

  let open:boolean = false;
  const toggleSurface = () => {
    // open = !open
    open = true;
    surface.setOpen(open)
  }
</script>
  <Button on:click={toggleSurface}>
    <Icon class="material-icons">pageview</Icon>
    <Label>Zoom</Label>
  </Button>

  <MenuSurface bind:this={surface} anchorCorner="BOTTOM_LEFT" class="w-full px-2">
      <RangeSlider
        label="ZoomBox x"        
        on:change={handleSliderChange}        
        bind:lower={lowerX}
        bind:upper={upperX}
        {step} min={minX} max={maxX}
      />
      <RangeSlider
        label="ZoomBox y"        
        on:change={handleSliderChange}
        bind:lower={lowerY}
        bind:upper={upperY}
        {step} min={minY} max={maxY}
        
        
      />      
  </MenuSurface>
