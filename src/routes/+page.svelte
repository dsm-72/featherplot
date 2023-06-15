<script lang="ts">
    import MinMaxSlider from '$lib/FeatherPlot/MinMaxSlider.svelte'
    import Slider from '$lib/FeatherPlot/Slider.svelte'
    import RangerSlider from '$lib/FeatherPlot/RangeSlider.svelte'
    import ZoomCall from '$lib/FeatherPlot/ZoomCall.svelte'
    import RootChannel from '$lib/FeatherPlot/RootChannel.svelte'
    import ColorChannel from '$lib/FeatherPlot/ColorChannel.svelte'
    import MaxPoints from '$lib/FeatherPlot/MaxPoints.svelte'

    import type {
        Range, Domain, Transform, ColumnMetadata, ColumnsMetadata, 
        EncodingKey, EncodingVal,
    } from '../lib/NotUsed/FeatherPlot/types.ts'
        
    export let data

    $: meta = data?.meta
    $: embeddingColumns = Object.fromEntries(
        Object.entries(meta.column_metadata as unknown as Record<string, ColumnMetadata>)
            .filter((item:[string, ColumnMetadata], idx:number) => {
                let [key, val] = item
                return !(val?.is_sidecar)
            })
        ) as ColumnsMetadata

</script>

<div class="grid grid-cols-4 h-screen place-content-center align-center">
    <div class="">
   
    </div>
    <div class="col-span-2">
        <div class="bg-slate-100 p-4 max-h-72 overflow-scroll">
            <MaxPoints/>
            <!-- <MinMaxSlider/> -->
            <!-- <RangerSlider/> -->
            <!-- <Slider></Slider> -->
            <!-- <Slider range></Slider> -->

            <ZoomCall/>
            <RootChannel 
                columns={embeddingColumns}
                name="x"
                label="X-axis"
            />
            <RootChannel 
                columns={embeddingColumns}
                name="y"
                label="Y-axis"
            />
            <ColorChannel 
                columns={embeddingColumns}
                name="color"
                label="Color"
            />
            
        </div>        
    </div>
    <div class="">
        
    </div>
</div>


