<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { plotStore } from './PlotStore.ts';

    import type {
        Range, Domain, Transform, ColumnsMetadata, 
        EncodingKey, EncodingVal, ChannelBase,
    } from './types.ts'
    import ChannelSelect from './ChannelSelect.svelte';

    const dispatch = createEventDispatcher();

    const idTemplate = (n:string) => `${n}-axis-select`
    const labelTemplate = (n:string) => `${n.toLocaleUpperCase()}-Axis`
    
    let cField: EncodingKey | undefined = undefined    
    

    let cEncoding: ChannelBase | undefined, cColumns: ColumnsMetadata, cChannel: ChannelBase | undefined
    let cSelect = cEncoding?.field ? cEncoding?.field : undefined;
    let cRange  = cChannel?.range  ? cChannel?.range  : 'viridis';
    let cDomain = cChannel?.domain ? cChannel?.domain : undefined;
    let cTransform: Transform = cChannel?.transform ? cChannel?.transform : 'literal'

    $: if (cField && !cSelect) {
        cSelect = cField
    }

  
    let sidecars: string[] | undefined = ($plotStore.sidecars) ? $plotStore.sidecars : []
    $: {
        sidecars = ($plotStore.sidecars) ? $plotStore.sidecars : []
        cColumns = plotStore.getColumnsMetadata(sidecars)
    }


    $: if ($plotStore) {        
        cField = plotStore.cField as EncodingKey
        
        cChannel = plotStore.getColumnAsEncoding(cField);
        cChannel = plotStore.color
        cRange  = cChannel?.range  ? cChannel?.range  : 'viridis';
        cDomain = cChannel?.domain ? cChannel?.domain : undefined; 
        // console.log(cChannel, cRange, cDomain)

    }

    const handleCChange = ({detail:{field, transform}}: any) => {        
        cField = field
        cSelect = field
        cTransform = transform
        cRange = 'viridis'
        // cDomain = domain
        plotStore.cField = field
        cChannel = plotStore.getColumnAsEncoding(cField);

        let update = {
            ...cChannel, field,  transform, 
            range: 'viridis', 
            //range, domain
        } as EncodingVal

        plotStore.setEncoding('color', update)
        dispatch('change', {cChannel: update})
    }
</script>
<div class="grid md:grid-cols-2 gap-2 md:gap-4">
    <ChannelSelect 
        class='w-full col-span-2'
        bind:field={cSelect}
        id="{idTemplate('c')}"
        label="{labelTemplate('c')}"
        columns={cColumns}
        bind:transform={cTransform}
        bind:range={cRange}
        bind:domain={cDomain}
        on:change={handleCChange}
    />    
</div>
