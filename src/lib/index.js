// Reexport your entry components here
import Bug from './btns/Bug.svelte';
import Code from './btns/Code.svelte';
import Config from './btns/Config.svelte';
import Delete from './btns/Delete.svelte';
import Draw from './btns/Draw.svelte';
import PlayPause from './btns/PlayPause.svelte';
export {Bug, Code, Config, Delete, Draw, PlayPause}

import DeepScatter from './NomicAi/DeepScatter.svelte';
export const FeatherPlot = DeepScatter

import SidecarSelector from './SidecarSelector.svelte';
import PointSlider from './PointSlider.svelte';
import AxisSelector from './AxisSelector.svelte';

export {
    SidecarSelector, PointSlider, AxisSelector
}

import type {
    DeepScatterReadyEvent, DeepScatterExtentEvent, DeepScatterSampleEvent,
    DeepScatterFieldsEvent, DeepScatterSchemaEvent
} from './NomicAi/types'

export {
    DeepScatterReadyEvent, DeepScatterExtentEvent, DeepScatterSampleEvent,
    DeepScatterFieldsEvent, DeepScatterSchemaEvent
}


