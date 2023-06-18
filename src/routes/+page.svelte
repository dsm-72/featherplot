<script lang="ts">
    import {onMount} from 'svelte'
    import ZoomCall from '$lib/FeatherPlot/ZoomCall.svelte'
    import MaxPointsSlider from '$lib/FeatherPlot/MaxPointsSlider.svelte'
    import AxesSelect from '$lib/FeatherPlot/AxesSelect.svelte'
    import ColorSelect from '$lib/FeatherPlot/ColorSelect.svelte'

    export let data

    $: meta = data?.meta

    import { plotStore } from '../lib/FeatherPlot/PlotStore.ts';
    import FeatherPlot from '$lib/FeatherPlot/FeatherPlot.svelte'
    plotStore.LoadDeepscatter()
    let [debug, pause] = [plotStore.isDebug, plotStore.isPause]
    import { base } from '$app/paths';

    onMount(async() => {
        
        await meta
        
        plotStore.url = `${base}${meta.tiles_dir}`
        plotStore.totalPoints = meta.n_points
        plotStore.embedding = meta.embedding
        plotStore.sidecars = meta.sidecars
        plotStore.columns = meta.columns_metadata

        
        plotStore.xField = meta.embedding[0] // 'x'
        plotStore.yField = meta.embedding[1] // 'y'
        plotStore.cField = meta.sidecars[0] // 'conditions'
    })

    let args
    // $: if(args) {        
    //     plotStore?.plot?.plotAPI({
    //         ...args,
    //     })
    // }

    const handleChange = async () => {
        // args = plotStore.args
        console.log('change')
        try {
            await plotStore.updatePlot()
        } catch (e) {
            console.error(e)
        }
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
        </div>        
    </div>
    <div class="">
        
    </div>
</div>


