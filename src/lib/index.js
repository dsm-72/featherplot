// Reexport your entry components here

import AxesSelect from "./FeatherPlot/AxesSelect.svelte";
import AxisSelect from "./FeatherPlot/AxisSelect.svelte";
import ChannelSelect from "./FeatherPlot/ChannelSelect.svelte";
import ColorSelect from "./FeatherPlot/ColorSelect.svelte";
import FeatherPlot from "./FeatherPlot/FeatherPlot.svelte";
import MaxPointsSlider from "./FeatherPlot/MaxPointsSlider.svelte";
import RangeSlider from "./FeatherPlot/RangeSlider.svelte";
import Slider from "./FeatherPlot/Slider.svelte";
import ZoomCall from "./FeatherPlot/ZoomCall.svelte";

import {plotStore} from "./FeatherPlot/PlotStore.ts";


export {
    AxesSelect,
    AxisSelect,
    ChannelSelect,
    ColorSelect,
    FeatherPlot,
    MaxPointsSlider,
    RangeSlider,
    Slider,
    ZoomCall,
    plotStore
}