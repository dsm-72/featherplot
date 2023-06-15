<script lang='ts'>
    /**
    NOTE: Shameless initial copy-paste from
    https://github.com/fouita/svelte-tw-slider/blob/master/src/Slider.svelte
    then lots of refractors to improve it.
    */

    // import Tooltip from '@fouita/tooltip';
    import { onMount } from 'svelte/internal';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let cls = '';
    export { cls as class };

    export let min = 0;
    export let max = 100;
    export let value = [25, 64];

    export let color = 'indigo-600';
    export let tooltip = false;
  
    
  
    let current_pointer = null;
  
    function setValue(val) {
        if (Array.isArray(value)) {
            value[current_pointer == leftPointer ? 0 : 1] = val;
        } else {
            value = val;
        }
        dispatch('change', value)
    }
  
    function movePointer(e) {
      if (!current_pointer) return false;
      let cx = e.clientX || e.touches[0].clientX;
      let diff = cx - nodeOffsetLeft; // calculate percentage
      let per = (diff * 100) / width;
      per = per < 0 ? 0 : per > 100 ? 100 : per;
      setValue(parseInt((per * (max - min)) / 100) + min);
    }
  
    let nodeOffsetLeft = null;
    let leftPointer = null;
    let rightPointer = null;
    let progress_bar = null;
  
    let display_tooltip1 = false;
    let display_tooltip2 = false;
  
    function setOffsetLeft(node:HTMLElement) {
      nodeOffsetLeft = node.offsetLeft;
      console.log(offWidth, node.offsetLeft)
    }
  
    function setLeftPointer(node:HTMLElement) {
      leftPointer = node;
    }
  
    function setRightPointer(node:HTMLElement) {
      rightPointer = node;
    }
  

    function progressBar(node:HTMLElement) {
      progress_bar = node;
    }
  
    function mouseUp() {
      current_pointer = null;
      display_tooltip1 = tooltip == 'hover' ? false : tooltip;
      display_tooltip2 = display_tooltip1;
    }
  
    $: if (progress_bar && leftPointer) {
      if (Array.isArray(value)) {
        value[0] = value[0] > min ? value[0] : min;
        value[1] = value[1] < max ? value[1] : max;
  
        let per1 = ((value[0] - min) * 100) / (max - min);
        leftPointer.style.left = `${per1}%`;
        let per2 = ((value[1] - min) * 100) / (max - min);
        rightPointer.style.left = `${per2}%`;
  
        progress_bar.style.width = `${per2 - per1}%`;
        progress_bar.style.left = `${per1}%`;
      } else {
        value = value > min ? value : min;
        value = value < max ? value : max;
        let per = ((value - min) * 100) / (max - min);
        leftPointer.style.left = `${per}%`;
        progress_bar.style.width = `${per}%`;
      }
    }
  
  
    $: if (tooltip == true) {
      display_tooltip1 = true;
      display_tooltip2 = true;
    }
  
    let width: number;
    let offWidth: number;
</script>
  
<svelte:window
    on:mousemove={movePointer}
    on:touchmove={movePointer}
    on:mouseup={mouseUp}
    on:touchend={mouseUp} 
/>


<div class={$$props.class}>
    <div class='py-1 relative min-w-full' use:setOffsetLeft>
        <div bind:clientWidth={width} class='h-1 -mt-px bg-gray-300 rounded-full' >
        <div class='absolute h-1 rounded-full bg-{color} w-0' use:progressBar/>        
        <div
            class='absolute h-4 -mt-1 flex items-center justify-center w-4
            rounded-full bg-white shadow border border-gray-300 -ml-2 top-0
            cursor-leftPointer'          
            unselectable='on'          
            use:setLeftPointer
            on:touchstart={() => (current_pointer = leftPointer)}
            on:mousedown={() => (current_pointer = leftPointer)}
            on:mouseenter={() => (display_tooltip1 = tooltip || tooltip == 'hover')}
            on:mouseleave={() => (display_tooltip1 = (!!tooltip && !!current_pointer) || (tooltip == 'hover' ? false : tooltip))}
        >
          <div class='relative -mt-2 w-1'>
            ttip 1
            <!-- <Tooltip
              text={(Array.isArray(indLabel) && indLabel[0]) || indLabel}
              show={display_tooltip1} /> -->
          </div>
        </div>

        {#if Array.isArray(value)}
          <div
            key='k7'
            class='absolute h-4 -mt-1 flex items-center justify-center w-4
            rounded-full bg-white shadow border border-gray-300 -ml-2 top-0
            cursor-leftPointer'
            unselectable='on'
            onselectstart='return false;'
            use:setRightPointer
            on:touchstart={() => (current_pointer = rightPointer)}
            on:mousedown={() => (current_pointer = rightPointer)}
            on:mouseenter={() => (display_tooltip2 = tooltip || tooltip == 'hover')}
            on:mouseleave={() => (display_tooltip2 = (!!tooltip && !!current_pointer) || (tooltip == 'hover' ? false : tooltip))}>
            
            <div class='relative -mt-2 w-1'>
                ttip 2              
            </div>

          </div>
        {/if}

        <div class='absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6'>
            {min}
        </div>

        <div class='absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6'>
            {max}
        </div>
      </div>
    </div>
  
  </div>