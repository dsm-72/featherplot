<script lang="ts">
    import Slider from '@smui/slider';
    export let id: string = 'range-slider'
    export let label:string = 'Range Slider'

    export let min = -2;
    export let max = 2;
    export let lower = 0;
    export let upper = 0;
    export let step = 0.01
</script>
<div>       
    <div class="grid grid-cols-12 justify-center place-items-center	gap-2">
      <div class="col-span-12 justify-self-start">
        <label  for="{id}"  class="text-gray-700 text-sm font-bold">
          {label}
      </label>
      </div>
      <div class="col-span-2 font-bold text-sm px-2">
          {lower}
      </div>
      <Slider
        id="{id}"
        range        
        bind:start={lower} bind:end={upper}
        {min} {max} {step}
        on:change
        on:click
        input$aria-label="{label}"
        class="grow col-span-8 w-full"
      />
      <div class="col-span-2 font-bold text-sm px-2">
          {upper}
      </div>
    </div>        
  </div>