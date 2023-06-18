<script lang='ts'>
    /**
    NOTE: Shameless initial copy-paste from
    https://github.com/fouita/svelte-tw-slider/blob/master/src/Slider.svelte
    then lots of refractors to improve it.
    */

    import { onMount } from 'svelte/internal';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let min:number = -2;
    export let max:number = 2;

    export let lower = -1;
    export let upper = 1;

    export let minLabel: boolean = true
    export let maxLabel: boolean = true
    export let minMaxLabels: boolean = true

    export let minRange = 0

    export let color:string = 'bg-sky-500';
    
    export let tooltip:boolean= false;
    export let tooltipAlways:boolean= false;
    export let tooltipNever:boolean=false;

    let tooltipMin = false;
    let tooltipMax = false;
    

    let width: number;
    let pointer: HTMLElement | null = null;
    let container: HTMLElement
    let pointerMin: HTMLElement
    let pointerMax: HTMLElement
    let progressBar: HTMLElement
    $: nodeOffsetLeft = container?.offsetLeft
    $: activePointer = pointer === pointerMin ? 0 : 1

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

    const isNewMaxValLessThanLower = (val:number) => {
        // guard for max < min
        return (activePointer === 1 && val - minRange < lower)
    }
    const isNewMinValGreaterThanUpper = (val:number) => {        
        // guard for min > max
        return (activePointer === 0 && val + minRange > upper) 
    }
    
    function movePointer(event:MouseEvent | TouchEvent) {        
        if (pointer === null) return false;
        let clientX = getInteractiveEventWidth(event)        
        // calculate percentage
        let diff = clientX - nodeOffsetLeft; 
        let prec = (diff / width) * 100;     
        const val = percToVal(prec) 
        updateValue(val);
    }

    function updateValue(val:number) {
        if (isNewMaxValLessThanLower(val)) return
        if (isNewMinValGreaterThanUpper(val)) return        
        switch (activePointer) {
            case 0:
                updateMin(val)
                break;
            case 1:
                updateMax(val)
                break;
            default:
                break;
        }
    }

    const updateMin = (val:number) => {
        tooltipMin = true
        lower = forceLims(val)
        dispatch('change', [lower, upper])
    }
    const updateMax = (val:number) => {
        tooltipMax = true
        upper = forceLims(val)        
        dispatch('change', [lower, upper])
    }


    const squashMax = (val:number) => Math.min(max, val)
    const upliftMin = (val:number) => Math.max(min, val)
    const forceLims = (val:number) => squashMax(upliftMin(val))    
    const valToPerc = (val:number) => ((val - min) / (max - min)) * 100;
    const percToVal = (perc:number) => ((perc / 100) * (max - min)) + min;


    $: perMin = valToPerc(lower)// - valToPerc(min)
    $: perMax = valToPerc(upper)// - valToPerc(min)
    $: perDif = perMax - perMin
    $: if (pointerMin) pointerMin.style.left = `${perMin}%`
    $: if (pointerMax) pointerMax.style.left = `${perMax}%`

    $: if (progressBar) {
        progressBar.style.width = `${perDif}%`;
        progressBar.style.left = `${perMin}%`;
    }

    $: if (tooltip == true) {
        tooltipMin = true;
        tooltipMax = true;
    }
        
    function mouseUp() {
      pointer = null;
      tooltipMin = false
      tooltipMax = false;
    }
  
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

<div class="{$$props.class} ">
    <div bind:clientWidth={width} class='py-1 relative min-w-full select-none'  bind:this={container}>
        <div  class='h-1 -mt-px bg-gray-300 rounded-full'>
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
                {#if (tooltipMin || tooltipAlways)  && !tooltipNever}
                <div class='relative -mt-2 w-1 pointer-events-none' use:floatingContentMin>
                    {Math.round(lower * 100) / 100}
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
                {#if (tooltipMax || tooltipAlways) && !tooltipNever}
                <div class='relative -mt-2 w-1 pointer-events-none' use:floatingContentMax>
                    {Math.round(upper * 100) / 100}
                </div>
                {/if}
            </div>

            {#if minMaxLabels}
                {#if minLabel}
                <div class='absolute text-gray-800 -ml-1 bottom-0 left-0 -mb-6'>
                    {min}
                </div>
                {/if}
                {#if maxLabel}
                <div class='absolute text-gray-800 -mr-1 bottom-0 right-0 -mb-6'>
                    {max}
                </div>
                {/if}
            {/if}

        </div>
    </div>
</div>

