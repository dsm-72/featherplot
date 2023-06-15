/** @type {import('./$types').PageLoad} */

import {TILES_DIR, META_FILE, LABELS_FILE} from '../lib/constants'
import {parseColumnCSV, LoadGlobsOneByOne } from '../lib/utils'

import type {
    Range, Domain, Transform, ColumnsMetadata, 
    EncodingKey, EncodingVal, Metadata
} from '../lib/FeatherPlot/types.ts'

import yaml from "js-yaml";


export async function load({fetch}) {

    const meta_raw = await fetch(META_FILE).then(r => r.text())
    const meta = yaml.load(meta_raw) as Metadata
    
    const labels = fetch(LABELS_FILE).then(r => r.text())
                        .then(csv => parseColumnCSV(csv))

    return {labels, meta}
}