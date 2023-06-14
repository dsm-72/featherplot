export const DATASET_DIR = `/datasets`

export const DEMO_DIR = `${DATASET_DIR}/demo`
export const DEMO_TILES_DIR = `${DEMO_DIR}/tiles`
export const DEMO_META_FILE = `${DEMO_DIR}/meta.yml`
export const DEMO_LABELS_FILE = `${DEMO_DIR}/labels.csv`

export const MINI_DIR = `${DATASET_DIR}/mini`
export const MINI_TILES_DIR = `${MINI_DIR}/tiles`
export const MINI_META_FILE = `${MINI_DIR}/meta.yml`
export const MINI_LABELS_FILE = `${MINI_DIR}/labels.csv`



export const NAMED_DIR = `${DATASET_DIR}/named`
export const NAMED_TILES_DIR = `${NAMED_DIR}/tiles`
export const NAMED_META_FILE = `${NAMED_DIR}/meta.yml`
export const NAMED_LABELS_FILE = `${NAMED_DIR}/labels.csv`



const which: 'demo' | 'mini' | 'named' = 'mini'

export const TILES_DIR = String(which) === 'demo' 
    ? DEMO_TILES_DIR 
    : which === 'mini' 
        ? MINI_TILES_DIR 
        : NAMED_TILES_DIR

export const META_FILE = String(which) === 'demo' 
    ? DEMO_META_FILE 
    : which === 'mini' 
        ? MINI_META_FILE 
        : NAMED_META_FILE

export const LABELS_FILE = String(which) === 'demo' 
    ? DEMO_LABELS_FILE 
    : which === 'mini' 
        ? MINI_LABELS_FILE 
        : NAMED_LABELS_FILE