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
    $: cField = plotStore.cField as EncodingKey
    

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
        cField = plotStore.cField as EncodingKey
        sidecars = ($plotStore.sidecars) ? $plotStore.sidecars : []
        cColumns = plotStore.getColumnsMetadata(sidecars)
        

        if (cSelect !== plotStore.cField) {
            plotStore.cField = cSelect
            cEncoding = plotStore.getColumnAsEncoding(cSelect)
            cChannel = plotStore.color
        } else if (plotStore.cField !== cSelect) {
            cSelect = plotStore.cField
        }

        cRange  = cChannel?.range  ? cChannel?.range  : undefined;
        cDomain = cChannel?.domain ? cChannel?.domain : undefined; 

    }

    const handleCChange = ({detail:{field, transform, range, domain}}: any) => {        
        cField = field
        cTransform = transform
        cRange = range
        cDomain = domain

        let update = {
            ...cChannel, field,  transform, range, domain
        } as EncodingVal
        if (!range) {
            if (update === null) {
                update = {} as EncodingVal
            }
        }
        plotStore.setEncoding('color', update)
        dispatch('change', {cChannel: update})
    }
</script>
<div class="grid md:grid-cols-2 gap-2 md:gap-4">
    <ChannelSelect 
        class='w-full col-span-2'
        field={cSelect}
        id="{idTemplate('c')}"
        label="{labelTemplate('c')}"
        columns={cColumns}
        transform={cTransform}
        range={cRange}
        domain={cDomain}
        on:change={handleCChange}
    />    
</div>
