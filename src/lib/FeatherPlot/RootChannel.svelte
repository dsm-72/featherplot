<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { plotStore } from './PlotStore.ts';

    import type {
        Range, Domain, Transform, ColumnsMetadata, 
        EncodingKey, EncodingVal,
    } from './types.ts'

    const dispatch = createEventDispatcher();

    export let name: EncodingKey = 'x'
    export let label:string = 'Axis'
    export let columns: ColumnsMetadata
    
    $: selectActive = (Array.isArray(columns) && columns.length) as boolean

    $: channelValues = plotStore.getColumnAsEncoding(name)
   
    // let field:string = '';
    let field:string = channelValues?.field ? channelValues?.field : '';


    let transform:Transform = 'literal'
    let transformChoices: Transform[] = ['literal', 'linear', 'log', 'sqrt']
    

    let isConstant = false
    let constantChoices = ['boolean', 'number']
    let constant:string | null = null
    
    $: _constant = !isConstant 
        ? undefined
        : (constant === 'boolean') 
            ? true
            : 'number'

    
    $: channel = {
        field, transform,
        range:_range, domain:_domain,
        constant: _constant,
    } as EncodingVal

    export let lowerRange: number  | null = null;
    export let upperRange: number  | null = null;
    export let lowerDomain: number | null = null;
    export let upperDomain: number | null = null;
    $: calculatedRange = [lowerRange, upperRange]
    $: calculatedDomain = [lowerDomain, upperDomain]
    
    export let range: Range   | null = channelValues?.range ? channelValues?.range : null;
    export let domain: Domain | null = channelValues?.domain ? channelValues?.domain : null;

    $: _range = (range === null) ? calculatedRange : range
    $: _domain = (domain === null) ? calculatedDomain : domain

    $: hasRange = !(
        (_range === null) || (_range === undefined) || 
        (Array.isArray(_range) && (_range as Array<string|number>).every(x=>!x))        
    )

    $: hasDomain = !(
        (_domain === null) || (_domain === undefined) || 
        (Array.isArray(_domain) && (_domain as Array<string|number>).every(x=>!x))        
    )
    
    // Function to handle changes
    const handleChange = () => {    
        // plotStore.setEncoding(name, channel);
        dispatch('change', { channel });
    };

    export let id = 'root-channel'
</script>

<div class="w-full {$$props.class}">
    <div class="grid grid-cols-1 justify-center place-items-center gap-2">

        <div class="form-control  w-full">
            <label for="{id}" class="label text-slate-700 text-sm font-bold"  class:hidden={label === null}>
                <!-- line_axis -->
                <span class="label-text">{label}</span>
            </label>                     
            <select class="select select-bordered min-w-full" on:change={handleChange}>
                {#if columns}
                    {#each Object.keys(columns) as name (name)}
                        <option value={name} selected>
                            {(columns[name]?.human) ? columns[name]?.human : name}
                        </option>
                    {/each}
                {/if}
            </select>

            {#if hasRange || hasDomain}
                <label for="{id}" class="label">
                    <div class="flex">
                        {#if hasDomain}
                        <span class="text-slate-600 font-base px-4 label-text-alt">
                        Domain: [{_domain}]
                        </span>
                        {/if}
                        {#if hasRange}
                        <span class="text-slate-600 font-base px-4 label-text-alt">
                            Range: [{_range}]
                        </span>
                        {/if}
                    </div>
                </label>
            {/if}    
        </div>            

        <div class="form-control w-full">
            <label for="transform-chips" class="text-slate-700 font-base">
                Transform
            </label>
            <div id="transform-chips flex gap-2">                    
                {#each transformChoices as chip}
                    <button 
                        class="mr-2 badge join-item badge-lg"
                        class:badge-accent={chip === transform}
                        on:click={()=>{transform=chip; handleChange()}}
                    >
                        {chip}
                    </button>
                {/each}            
            </div>
        </div>
    
    </div>
</div>


        
        
    