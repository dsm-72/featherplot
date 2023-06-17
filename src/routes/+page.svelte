<script lang="ts">
    import {onMount} from 'svelte'
    // import MinMaxSlider from '$lib/FeatherPlot/MinMaxSlider.svelte'
    // import Slider from '$lib/FeatherPlot/Slider.svelte'
    // import RangerSlider from '$lib/FeatherPlot/RangeSlider.svelte'
    import ZoomCall from '$lib/FeatherPlot/ZoomCall.svelte'
    import RootChannel from '$lib/FeatherPlot/RootChannel.svelte'
    // import ColorChannel from '$lib/FeatherPlot/ColorChannel.svelte'
    import MaxPointsSlider from '$lib/FeatherPlot/MaxPointsSlider.svelte'
    import AxesSelect from '$lib/FeatherPlot/AxesSelect.svelte'
    import AxisSelect from '$lib/FeatherPlot/AxisSelect.svelte'
    import ColorSelect from '$lib/FeatherPlot/ColorSelect.svelte'

    import type {
        Range, Domain, Transform, ColumnMetadata, ColumnsMetadata, 
        EncodingKey, EncodingVal,
    } from '../lib/FeatherPlot/types.ts'
        
    export let data

    $: meta = data?.meta

    import { plotStore } from '../lib/FeatherPlot/PlotStore.ts';
    import FeatherPlot from '$lib/FeatherPlot/FeatherPlot.svelte'
    // import ColorSelect from '$lib/FeatherPlot/ColorSelect.svelte';
    plotStore.LoadDeepscatter()
    let [debug, pause] = [plotStore.isDebug, plotStore.isPause]
    

    onMount(async() => {
        
        await meta
        
        plotStore.url = meta.tiles_dir
        plotStore.totalPoints = meta.n_points
        plotStore.embedding = meta.embedding
        plotStore.sidecars = meta.sidecars
        plotStore.columns = meta.columns_metadata

        
        plotStore.xField = meta.embedding[0] // 'x'
        plotStore.yField = meta.embedding[1] // 'y'
        plotStore.cField = meta.sidecars[0] // 'conditions'
    })

    const handleChange = async () => {
        console.log('change')
        await plotStore.updatePlot()
    }

</script>

<div class="grid grid-cols-4 h-screen justify-content-center">
    <div class="">
    </div>
    <div class="col-span-2">
        <FeatherPlot class="border-2 border-sky-400"/>
        <div class="bg-slate-100 p-4 max-h-92 overflow-scroll">
            <MaxPointsSlider on:change={handleChange} />
            <AxesSelect on:change={handleChange} />
            <ColorSelect on:change={handleChange} />
            <ZoomCall on:change={handleChange} />
            <!-- <MinMaxSlider/> -->
            <!-- <RangerSlider/> -->
            <!-- <Slider></Slider> -->
            <!-- <Slider range></Slider> -->

            <!-- <ZoomCall/>
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
            /> -->

                        
        </div>        
    </div>
    <div class="">
        
    </div>
</div>


