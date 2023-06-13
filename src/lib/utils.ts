export const csvStringToRows = (csvString: string, header?: boolean) => {
    const rows = csvString.split('\n')
    return header ? rows.slice(1) : rows;
}

export const parseColumnCSV = (csvString: string, n?: number) => {
    const rows = csvStringToRows(csvString, true)
    return n ? rows.slice(0, n) : rows;
}



export type GlobResults = Record<string, ()=>Promise<unknown>>

export const LoadGlobsOneByOne = async (globs: GlobResults) => {
    let results = []
    for (const path in globs) {
        let data = await globs[path]()
        results.push(data)
    }
    return results
}

export const LoadGlobsAllAtOnces = async (globs: GlobResults) => {
    let results = await Promise.all(Object.values(globs).map(fn=>fn()))
    return results
}
