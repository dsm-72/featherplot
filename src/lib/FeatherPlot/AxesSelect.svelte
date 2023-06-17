<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import { plotStore } from './PlotStore.ts';

    import type {
        Range, Domain, Transform, ColumnsMetadata, 
        EncodingKey, EncodingVal, ChannelBase,
    } from './types.ts'
    // import AxesSelect from './AxesSelect.svelte';
    import ChannelSelect from './ChannelSelect.svelte';

    const dispatch = createEventDispatcher();

    const idTemplate = (n:string) => `${n}-axis-select`
    const labelTemplate = (n:string) => `${n.toLocaleUpperCase()}-Axis`

    let xField: EncodingKey | undefined = undefined
    let yField: EncodingKey | undefined = undefined
    $: xField = plotStore.xField
    $: yField = plotStore.yField
  
    let embnames: string[], xColNames: string[], yColNames: string[]        

    let xEncoding: ChannelBase | undefined, xColumns: ColumnsMetadata, xChannel: ChannelBase | undefined
    let xSelect = xEncoding?.field ? xEncoding?.field : undefined;
    let xRange  = xChannel?.range  ? xChannel?.range  : undefined;
    let xDomain = xChannel?.domain ? xChannel?.domain : undefined;
    let xTransform: Transform = xChannel?.transform ? xChannel?.transform : 'literal'

    let yEncoding: ChannelBase | undefined, yColumns: ColumnsMetadata, yChannel: ChannelBase | undefined
    let ySelect = yEncoding?.field ? yEncoding?.field : undefined;
    let yRange  = yChannel?.range  ? yChannel?.range  : undefined;
    let yDomain = yChannel?.domain ? yChannel?.domain : undefined;
    let yTransform: Transform = yChannel?.transform ? yChannel?.transform : 'literal'

    $: {

        // embnames = ($plotStore.embedding) ? $plotStore.embedding : []

        // xColNames = [...embnames].filter(column => column !== (yField));
        // yColNames = [...embnames].filter(column => column !== (xField));

        // xColumns = plotStore.getColumnsMetadata(xColNames)
        // yColumns = plotStore.getColumnsMetadata(yColNames)

        // xEncoding = plotStore.getColumnAsEncoding(xField)
        // yEncoding = plotStore.getColumnAsEncoding(yField)
                
        // xChannel = plotStore.x
        // yChannel = plotStore.y
        
        // if (xSelect) {
        //     plotStore.xField = xSelect
        //     xEncoding = plotStore.getColumnAsEncoding(xField)
        //     xChannel = plotStore.x

        // } else if (plotStore.xField && !xSelect) {
        //     xSelect = plotStore.xField

        // } 
        
        // if (ySelect) {
        //     plotStore.yField = ySelect
        //     yEncoding = plotStore.getColumnAsEncoding(yField)
        //     yChannel = plotStore.y         

        // } else if (plotStore.yField && !ySelect) {
        //     ySelect = plotStore.yField

        // } 

        // xRange  = xChannel?.range  ? xChannel?.range  : undefined;
        // xDomain = xChannel?.domain ? xChannel?.domain : undefined;  
        // yRange  = yChannel?.range  ? yChannel?.range  : undefined;
        // yDomain = yChannel?.domain ? yChannel?.domain : undefined; 
    }

    // $: update = {
    //     ...channel,
    //     field,  transform,
    //     range, domain,
    // } as EncodingVal    

    $: if (xField && !xSelect) {
        xSelect = xField
    }
    $: if (yField && !ySelect) {
        ySelect = yField
    }

    $: {
        xField = plotStore.xField
        yField = plotStore.yField
        embnames = ($plotStore.embedding) ? $plotStore.embedding : []
        xColNames = [...embnames].filter(column => column !== (ySelect));
        yColNames = [...embnames].filter(column => column !== (xSelect));
        xColumns = plotStore.getColumnsMetadata(xColNames)
        yColumns = plotStore.getColumnsMetadata(yColNames)

        if (xSelect !== plotStore.xField) {
            plotStore.xField = xSelect
            xEncoding = plotStore.getColumnAsEncoding(xSelect)
            xChannel = plotStore.x
        } else if (plotStore.xField !== xSelect) {
            xSelect = plotStore.xField
        }

        if (ySelect !== plotStore.yField) {
            plotStore.yField = ySelect
            yEncoding = plotStore.getColumnAsEncoding(ySelect)
            yChannel = plotStore.y         
        } else if (plotStore.yField !== ySelect) {
            ySelect = plotStore.yField
        }

        xRange  = xChannel?.range  ? xChannel?.range  : undefined;
        xDomain = xChannel?.domain ? xChannel?.domain : undefined;  
        yRange  = yChannel?.range  ? yChannel?.range  : undefined;
        yDomain = yChannel?.domain ? yChannel?.domain : undefined; 

    }

    const handleXChange = ({detail:{field, transform, range, domain}}: any) => {
        xField = field
        xTransform = transform
        xRange = range
        xDomain = domain
        // dispatch('change', {xSelect, ySelect})
        let update = {
            ...xChannel, field,  transform, range, domain
        } as EncodingVal
        plotStore.setEncoding('x', update)
        dispatch('change', {channel: update, which:'x'})

    }
    const handleYChange = ({detail:{field, transform, range, domain}}) => {        
        yField = field
        yTransform = transform
        yRange = range
        yDomain = domain

        // dispatch('change', {xSelect, ySelect})
        let update = {
            ...yChannel, field,  transform, range, domain
        } as EncodingVal
        plotStore.setEncoding('y', update)
        dispatch('change', {channel: update, which:'y'})
    }
</script>

<div class="grid md:grid-cols-2 gap-2 md:gap-4">
    <ChannelSelect         
        bind:field={xSelect}
        id="{idTemplate('x')}"
        label="{labelTemplate('x')}"
        columns={xColumns}
        transform={xTransform}
        range={xRange}
        domain={xDomain}
        on:change={handleXChange}
    />

    <ChannelSelect 
        bind:field={ySelect}
        id="{idTemplate('y')}"
        label="{labelTemplate('y')}"
        columns={yColumns}
        transform={yTransform}
        range={yRange}
        domain={yDomain}
        on:change={handleYChange}
    />
    <!-- <AxisSelect 
        y on:change={yChange}
    /> -->
    <!-- <RootChannel 
        columns={xColumns}
        name="x"
        label="X-axis"
        on:change={xChange}
    />
    <RootChannel 
        columns={yColumns}
        name="y"
        label="Y-axis"
        on:change={yChange}
    /> -->
</div>
