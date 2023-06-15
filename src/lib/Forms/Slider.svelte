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

    export let min:number = 0;
    export let max:number = 100;
    export let value:[number, number] = [25, 64];

    export let color:string = 'bg-sky-500';
    
    export let tooltip:boolean= false;

    let tooltipMin = false;
    let tooltipMax = false;
    
    let pointer: HTMLElement | null = null;
    let container: HTMLElement
    let pointerMin: HTMLElement
    let pointerMax: HTMLElement
    let progressBar: HTMLElement
    // let nodeOffsetLeft:number
    $: nodeOffsetLeft = container?.offsetLeft

    
  
    function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
        return (event instanceof MouseEvent)       
    }
    function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
        return (event instanceof TouchEvent)       
    }
    function getInteractiveEventWidth(event: MouseEvent | TouchEvent) {
        if (isMouseEvent(event)) return event.clientX        
        if (isTouchEvent(event)) return event.touches[0].clientX;
        return 0
    }

    function updateValue(val:number) {
        let which = pointer === pointerMin ? 0 : 1
        let other = which === 0 ? 1 : 0
        if (which === 0 && val > value[1]) {which = 1; return}
        if (which === 1 && val < value[0]) {which = 0; return}
        
        tooltipMin = which === 0
        tooltipMax = which === 1
        
        value[which] = val
        dispatch('change', value)
    }

    function movePointer(event:MouseEvent | TouchEvent) {        
        if (pointer === null) return false;
        let clientX = getInteractiveEventWidth(event)

        // calculate percentage
        let diff = clientX - nodeOffsetLeft; 
        let prec = (diff * 100) / width;     

        const val = calcPerc(prec)
        const adj = val + min
        updateValue(adj);
    }
    
    
  
    // function setOffsetLeft(node:HTMLElement) {
    //   nodeOffsetLeft = node.offsetLeft;
    // }
    // function setPointerMin(node:HTMLElement) {
    //   pointerMin = node;
    // }
    // function setRightPointer(node:HTMLElement) {
    //   pointerMax = node;
    // }
    // function setProgressBar(node:HTMLElement) {
    //   progressBar = node;
    // }
  
    function mouseUp() {
      pointer = null;
      tooltipMin = false
      tooltipMax = false;
    }
  
    function updatePointerStyle(pointer:HTMLElement, val:number) {        
        let per = calcAdjustedPerc(forceLims(val))
        pointer.style.left = `${per}%`
        return per
    }

    const squashMax = (val:number) => Math.min(max, val)
    const upliftMin = (val:number) => Math.max(min, val)
    const forceLims = (perc:number) => squashMax(upliftMin(perc))
    const calcPerc = (perc:number) => (forceLims(perc) * (max - min)) / 100
    const calcAdjustedPerc = (val:number) => ((val - min) * 100) / (max - min)

    $: if (progressBar && pointerMin) {
      if (Array.isArray(value)) {
        value[0] = forceLims(value[0])
        value[1] = forceLims(value[1])
        let perMin = updatePointerStyle(pointerMin, value[0])
        let perMax = updatePointerStyle(pointerMax, value[1])
        progressBar.style.width = `${perMax - perMin}%`;
        progressBar.style.left = `${perMin}%`;
      }
    }
  
    $: if (tooltip == true) {
        tooltipMin = true;
        tooltipMax = true;
    }
  
    let width: number;
    
    import { offset, flip, shift } from "svelte-floating-ui/dom";
    import { createFloatingActions } from "svelte-floating-ui";

    const [ floatingRefMin, floatingContentMin ] = createFloatingActions({
        strategy: "absolute",
        placement: "top",
        middleware: [
            // offset(), flip(), shift(),
        ]
    });

    const [ floatingRefMax, floatingContentMax ] = createFloatingActions({
        strategy: "absolute",
        placement: "top",
        middleware: [
            // offset(), flip(), shift(),
        ]
    });
</script>
  
<svelte:window
    on:mousemove={movePointer}
    on:touchmove={movePointer}
    on:mouseup={mouseUp}
    on:touchend={mouseUp} 
/>


<div class={$$props.class}>
    <div class='py-1 relative min-w-full select-none' bind:this={container}>
        <div bind:clientWidth={width} class='h-1 -mt-px bg-gray-300 rounded-full'>
            
            <div class='absolute h-1 rounded-full {color} w-0 pointer-events-none' bind:this={progressBar}/>

            <div
                class='absolute h-4 -mt-1 flex items-center justify-center w-4
                rounded-full bg-white shadow border border-gray-300 -ml-2 top-0
                cursor-pointerMin'
                unselectable='on'
                bind:this={pointerMin}

                on:touchstart={() => (pointer = pointerMin)}
                on:mousedown={() =>  (pointer = pointerMin)}

                on:mouseenter={() => (tooltipMin = tooltip)}
                on:mouseleave={() => (tooltipMin = false)}
                use:floatingRefMin
            >
                {#if tooltipMin}
                <div class='relative -mt-2 w-1 pointer-events-none' use:floatingContentMin>
                    {value[0]}                
                </div>
                {/if}
            </div>

            <div
                class='absolute h-4 -mt-1 flex items-center justify-center w-4
                rounded-full bg-white shadow border border-gray-300 -ml-2 top-0
                cursor-pointerMin'
                unselectable='on'
                bind:this={pointerMax}

                on:touchstart={() => (pointer = pointerMax)}
                on:mousedown={() =>  (pointer = pointerMax)}

                on:mouseenter={() => (tooltipMax = tooltip)}
                on:mouseleave={() => (tooltipMax = false)}
                use:floatingRefMax
            >
                {#if tooltipMax}
                <div class='relative -mt-2 w-1 pointer-events-none' use:floatingContentMax>
                    {value[1]}
                </div>
                {/if}
            </div>


            <div class='absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6'>
                {min}
            </div>

            <div class='absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6'>
                {max}
            </div>

        </div>
    </div>
</div>