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

export const CELL_DIR = `${DATASET_DIR}/cell`
export const CELL_TILES_DIR = `${CELL_DIR}/tiles`
export const CELL_META_FILE = `${CELL_DIR}/meta.yml`
export const CELL_LABELS_FILE = `${CELL_DIR}/labels.csv`

export const SEO_DIR = `${DATASET_DIR}/SEO`
export const SEO_TILES_DIR = `${SEO_DIR}/tiles`
export const SEO_META_FILE = `${SEO_DIR}/meta.yml`
export const SEO_LABELS_FILE = `${SEO_DIR}/labels.csv`

export const FEATHER_DIR = `${DATASET_DIR}/featherplot`
export const FEATHER_TILES_DIR = `${FEATHER_DIR}/tiles`
export const FEATHER_META_FILE = `${FEATHER_DIR}/meta.yml`
export const FEATHER_LABELS_FILE = `${FEATHER_DIR}/labels.csv`

const which: 'demo' | 'mini' | 'named' | 'cell' | 'seo' | 'featherplot' = 'featherplot'

export const TILES_DIR = String(which) === 'demo' 
    ? DEMO_TILES_DIR 
    : (String(which) === 'mini')
        ? MINI_TILES_DIR 
        : (String(which) === 'named')
            ? NAMED_TILES_DIR
            : (String(which) === 'cell')
                ? CELL_TILES_DIR
                : (String(which) === 'featherplot')
                    ? FEATHER_TILES_DIR
                    : SEO_TILES_DIR

export const META_FILE = String(which) === 'demo' 
    ? DEMO_META_FILE 
    : (String(which) === 'mini')
        ? MINI_META_FILE 
        : (String(which) === 'named')
            ? NAMED_META_FILE
            : (String(which) === 'cell')
                ? CELL_META_FILE
                : (String(which) === 'featherplot')
                    ? FEATHER_META_FILE                
                    : SEO_META_FILE

export const LABELS_FILE = String(which) === 'demo' 
    ? DEMO_LABELS_FILE 
    : (String(which) === 'mini')
        ? MINI_LABELS_FILE 
        : (String(which) === 'named')
            ? NAMED_LABELS_FILE
            : (String(which) === 'cell')
                ? CELL_LABELS_FILE
                : (String(which) === 'featherplot')
                    ? FEATHER_LABELS_FILE                
                    : SEO_LABELS_FILE