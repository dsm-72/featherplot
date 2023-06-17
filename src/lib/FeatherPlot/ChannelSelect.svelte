<script lang="ts">
    import type { Transform, Range, Domain, ColumnsMetadata } from "./types.ts";
    
    import { onMount, createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let id: string ='channel'
    export let field: EncodingKey | undefined = undefined
    export let label = 'Channel'
    export let columns: ColumnsMetadata | undefined = undefined
    export let transform: Transform = 'literal'    
    export let hideDomain: boolean = false
    export let hideRange: boolean = false
    let transformChoices: Transform[] = ['literal', 'linear', 'log', 'sqrt']

    export let range:  Range  | undefined = undefined
    export let domain: Domain | undefined = undefined
    $: hasRange = !(
        (range === null) || (range === undefined) || 
        (Array.isArray(range) && (range as Array<string|number>).every(x=>!x))        
    )

    $: hasDomain = !(
        (domain === null) || (domain === undefined) || 
        (Array.isArray(domain) && (domain as Array<string|number>).every(x=>!x))        
    )


    const handleChips = (chip:Transform) => { 
        transform = chip
        dispatch('chips', {chip})
        handleChange()
    }

    const handleSelect = (e:any) => {        
        dispatch('select', {field})
        handleChange()
    }

    const handleChange = () => {
        dispatch('change', {field, transform, range, domain})
    }

    const getColumnName = (name:string) => {
        if (!columns) return name
        let col = columns[name]
        if (!col) return name
        return col?.human ? col?.human : name
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
                class="select select-bordered min-w-full" on:change={handleSelect}
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
                        {#if hasDomain & !hideDomain}
                        <span class="text-slate-600 font-base px-4 label-text-alt">
                        Domain: [{domain?.map((e) => e.toFixed(2)).join(', ')}]
                        </span>
                        {/if}

                        {#if hasRange & !hideRange}
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
                        on:click={()=>{handleChips(chip)}}
                    >
                        {chip}
                    </button>
                {/each}            
            </div>
        </div>
    
    </div>
</div>


        
        
    