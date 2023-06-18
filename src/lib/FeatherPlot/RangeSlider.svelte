<script lang="ts">
    import Slider from './Slider.svelte'
    export let id: string = 'range-slider'
    export let label:string | null = 'Range Slider'

    export let min = -2;
    export let max = 2;
    export let lower = -1;
    export let upper = 1;
    export let step = 0.01
</script>


<div class="{$$props.class} select-none point-event-none">
  <div class="grid grid-cols-12 justify-center place-items-center	gap-2 select-none point-event-none">
    <div class="col-span-12 justify-self-start select-none point-event-none" class:hidden={label === null}>
      <label for="{id}" class="text-gray-700 text-sm font-bold select-none point-event-none">
        {label}
      </label>
    </div>

    <div class="col-span-2 font-bold text-sm px-2 pointer-events-none select-none">
      {Math.round(lower * 100) / 100} / {min}          
    </div>

    <Slider
      id="{id}"    
      range bind:lower bind:upper
      {min} {max} {step}
      on:change
      on:click
      input$aria-label="{label}"
      class="grow col-span-8 w-full"
      minMaxLabels={false}
      tooltipNever={true}
    />
    
    <div class="col-span-2 font-bold text-sm px-2 pointer-events-none select-none">
      {Math.round(upper * 100) / 100} / {max}
    </div>
  </div>        
</div>