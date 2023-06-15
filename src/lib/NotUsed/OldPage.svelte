<script lang="ts">
    import ZoomCall from '$lib/NotUsed/FeatherPlot/ZoomCall.svelte'
    import RootChannel from '$lib/NotUsed/FeatherPlot/RootChannel.svelte'
    
    import type {
        Range, Domain, Transform, ColumnMetadata, ColumnsMetadata, 
        EncodingKey, EncodingVal,
    } from '../lib/FeatherPlot/types.ts'
        
    export let data

    $: meta = data?.meta
    $: embeddingColumns = Object.fromEntries(
        Object.entries(meta.column_metadata as unknown as Record<string, ColumnMetadata>)
            .filter((item:[string, ColumnMetadata], idx:number) => {
                let [key, val] = item
                console.log(idx, key ,val)
                return !(val?.is_sidecar)
            })
        ) as ColumnsMetadata

</script>

<div class="grid grid-cols-4">
    <div class="bg-sky-100">
    </div>
    <div class="col-span-2">
        <!-- <ZoomCall/>

        <RootChannel 
            columns={embeddingColumns}
            name="x"
            label="X-axis"
        />

        <RootChannel columns={embeddingColumns}
            name="y"
            label="Y-axis"
        />             -->



    </div>
    <div class="bg-sky-100">
        
    </div>
</div>