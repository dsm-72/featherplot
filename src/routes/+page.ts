/** @type {import('./$types').PageLoad} */

import {DEMO_META_FILE, DEMO_LABELS_FILE} from '../lib/constants'
import {parseColumnCSV, LoadGlobsOneByOne } from '../lib/utils'

import yaml from "js-yaml";

export async function load({fetch}) {

    const meta_raw = await fetch(DEMO_META_FILE).then(r => r.text())
    const meta = yaml.load(meta_raw)
    
    const labels = fetch(DEMO_LABELS_FILE).then(r => r.text())
                        .then(csv => parseColumnCSV(csv))

    return {labels, meta}
}