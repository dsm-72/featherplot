<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { plotArgs } from './PlotArgsStore.ts';
    import TextField from '@smui/textfield';
    import Slider from '@smui/slider';
    import Chip, { Set, Text } from '@smui/chips';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field'

    import Button, { Label, Icon } from '@smui/button';
    import MenuSurface, { Anchor } from '@smui/menu-surface';
    import Select, { Option } from '@smui/select';


    import type {
        Range, Domain, Transform, ColumnsMetadata, 
        EncodingKey, EncodingVal,
    } from './types.ts'


    const dispatch = createEventDispatcher();

    export let name: EncodingKey = 'x'
    export let label:string = 'Axis'
    export let columns: ColumnsMetadata

    let surface: MenuSurface
    $: selectActive = (Array.isArray(columns) && columns.length) as boolean


    $: channelValues = $plotArgs.encoding?.[name]
   
    // let field:string = '';
    let field:string = channelValues?.field ? channelValues?.field : '';


    let transform:Transform = 'literal'
    let transformChoices: Transform[] = ['literal', 'log', 'sqrt', 'linear']
    let transformSurface: MenuSurface;

    let isConstant = false
    let constantChoices = ['boolean', 'number']
    let constant:string | null = null
    let constantSurface: MenuSurface;
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



    export let lowerRange: number  | null;
    export let upperRange: number  |  null
    export let lowerDomain: number | null;
    export let upperDomain: number | null;
    $: calculatedRange = [lowerRange, upperRange]
    $: calculatedDomain = [lowerDomain, upperDomain]
    
    // export let range: Range   | null = null
    // export let domain: Domain | null = null

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
        plotArgs.updateEncodingKey(name, channel)
        dispatch('change', { channel });
    };

    
</script>

<Button on:click={() => surface.setOpen(true)}  class="text-left inline-flex">
    <Icon class="material-icons">line_axis</Icon>
    <Label>{label}</Label>
</Button>

<MenuSurface bind:this={surface} fullWidth>
    <div class="flex flex-col w-full">
        <!-- name = arrow format e.g. 'x' -->
        <!-- text = human friendly e.g. 't-SNE 1 -->
        <!-- <Option value={null}/> -->
        <Select 
            class=""  variant="filled"
            disabled={selectActive}
            {label} key={(column) => `${column ? column.name : ''}`}
            on:change={handleChange}
        >            
            {#if columns}
                {#each Object.keys(columns) as name (name)}
                    <Option value={name}>{columns[name].text}</Option>
                {/each}
            {/if}
        </Select>

        <div class="flex flex-col bg-stone-100">
            <label for="transform-chips" class="text-zinc-600 font-base  px-4">
                    <Label>Transform</Label>               
              </label>
            <!-- <Button ripple={false} class="text-left inline-flex w-full">
                <Icon class="material-icons">transform</Icon>
                <Label>Transform</Label>
            </Button>             -->
            <!-- on:click={() => transformSurface.setOpen(true)} -->
            <!-- <MenuSurface bind:this={transformSurface} fullWidth class="w-full px-2"> -->
                <Set id="transform-chips" chips={transformChoices} let:chip choice bind:selected={transform}
                    on:click={()=> {
                        if (transform===null) {
                            transform = transformChoices[0]
                        }
                        handleChange()
                    }}
                    on:change={handleChange}
                >
                    <Chip {chip}>
                        <Text>{chip}</Text>
                    </Chip>
                </Set>
            <!-- </MenuSurface> -->

        </div>
        
        {#if hasRange || hasDomain}
            <div class="flex bg-stone-100">
                {#if hasDomain}
                <span class="text-zinc-600 font-base  px-4">
                    <Label>Domain</Label>: [{_domain}]
                </span>
                {/if}
                {#if hasRange}
                <span class="text-zinc-600 font-base  px-4">
                    <Label>Range</Label>: [{_range}]
                </span>
                {/if}
            </div>
        {/if}
    </div>
    
</MenuSurface>

    
    

<!-- <FormField>
    <Checkbox bind:checked={isConstant} on:click={() => {
        if (isConstant) constantSurface.setOpen(true)
    }}/>
    <span slot="label">constant?</span>                
</FormField>
{#if isConstant}        
    <Set chips={constantChoices} let:chip choice bind:selected={constant}>
        <Chip {chip}>
            <Text>{chip}</Text>
        </Chip>
    </Set>        
{/if}       -->

