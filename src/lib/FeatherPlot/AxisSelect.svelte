<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { plotStore } from './PlotStore.ts';

    import type {
        Range, Domain, Transform, ColumnsMetadata, 
        EncodingKey, EncodingVal, ChannelBase,
    } from './types.ts'

    const dispatch = createEventDispatcher();

    export let x: boolean = false
    export let y: boolean = false
    
    $: y = !x
    $: id = `${x ? 'X' : 'Y' }-channel`
    $: label = `${x ? 'X' : 'Y' }-Axis`

    $: xField = $plotStore.xField
    $: yField = $plotStore.yField


    let encoding: ChannelBase | undefined, embnames: string[], 
        colnames: string[], columns:ColumnsMetadata, 
        channel:ChannelBase | undefined//, field: string | undefined

    // let range: Range | undefined, domain: Domain | undefined
    let range  = channel?.range ? channel?.range : undefined;
    let domain = channel?.domain ? channel?.domain : undefined;
    let field = encoding?.field ? encoding?.field : undefined;

    $: {
        encoding = plotStore.getColumnAsEncoding((x ? xField : yField))
        
        embnames = ($plotStore.embedding) ? $plotStore.embedding : []
        colnames = [...embnames].filter(column => column !== (x ? yField : xField));
        
        columns = plotStore.getColumnsMetadata(colnames)
        channel = x ? plotStore.x : plotStore.y
        
        if (x && field) {
            plotStore.xField = field
            encoding = plotStore.getColumnAsEncoding((x ? xField : yField))
            channel = x ? plotStore.x : plotStore.y

        } else if (x && plotStore.xField && !field) {
            field = plotStore.xField

        } else if (y && plotStore.yField && !field) {
            field = plotStore.yField

        } else if (y && field) {
            plotStore.yField = field
            encoding = plotStore.getColumnAsEncoding((x ? xField : yField))
            channel = x ? plotStore.x : plotStore.y
        }        


        range  = channel?.range ? channel?.range : undefined;
        domain = channel?.domain ? channel?.domain : undefined;        
    }


    
    let transform: Transform = channel?.transform ? channel?.transform : 'literal'
    let transformChoices: Transform[] = ['literal', 'linear', 'log', 'sqrt']

    $: update = {
        ...channel,
        field,  transform,
        range, domain,
    } as EncodingVal


    $: hasRange = !(
        (range === null) || (range === undefined) || 
        (Array.isArray(range) && (range as Array<string|number>).every(x=>!x))        
    )

    $: hasDomain = !(
        (domain === null) || (domain === undefined) || 
        (Array.isArray(domain) && (domain as Array<string|number>).every(x=>!x))        
    )
    

    
    // Function to handle changes
    const handleChange = () => {                    
        plotStore.setEncoding(x ? 'x' : 'y', update);
        dispatch('change', { channel:update, transform });        
        
    };

    const updateTransform = (chip:Transform) => {
        transform = chip
        handleChange()
    }

    const getColumnName = (name:string) => {
        if (!columns) return name
        
        let col = columns[name]
        if (!col) return name

        return columns[name]?.human ? columns[name]?.human : name
    }

    const isSelected = (name:string) => {
        if (!columns) return false
        let col = columns[name]
        if (!col) return false
        return (col.field == field)
    }


</script>

<div class="w-full {$$props.class}">
    <div class="grid grid-cols-1 justify-center place-items-center gap-2">

        <div class="form-control  w-full">
            <label for="{id}" class="label text-slate-700 text-sm font-bold">
                <span class="label-text">{label}</span>
            </label>

            <select 
                bind:value={field}
                class="select select-bordered min-w-full" on:change={handleChange}
            >
                {#if columns}
                    {#each Object.keys(columns) as name (name)}
                        <option value={name} selected="{isSelected(name)}">
                            {getColumnName(name)}
                        </option>
                    {/each}
                {/if}
            </select>

            {#if hasRange || hasDomain}
                <label for="{id}" class="label">
                    <div class="flex">
                        {#if hasDomain}
                        <span class="text-slate-600 font-base px-4 label-text-alt">
                        Domain: [{domain?.map((e) => e.toFixed(2)).join(', ')}]
                        </span>
                        {/if}
                        {#if hasRange}
                        <span class="text-slate-600 font-base px-4 label-text-alt">
                            Range: [{range?.map((e) => e.toFixed(2)).join(', ')}]
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
                        on:click={()=>{updateTransform(chip)}}
                    >
                        {chip}
                    </button>
                {/each}            
            </div>
        </div>
    
    </div>
</div>


        
        
    