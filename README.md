# FeatherPlot

This is a lightweight wrapper around [`deepscatter`][deepscatter] created by Benjamin Schmidt ([@bmschmidt](https://github.com/bmschmidt)). 

Of note is that there is a companion library in python [`featherplot`][featherplot-pypi].
If you look on [GitHub][featherplot-py], there is an [example notebook][featherplot-py-example] that demonstrates a pipeline for converting a Pandas DataFrame to the feather format using [`quadfeather`][quadfeather] as well as how to add sidecars (extra data).

As for this library, it has three main purposes:
1. assist with debugging the [`deepscatter`][deepscatter] library. (The [example notebooks][featherplot-csv-example] even found one with using `csv` data.).

2. assist with understanding the `plot.plotAPI({...args})` which are inspired by [vega-lite][vega-lite]. 

3. provide some utility functionality for interactivity with a `deepscatter` plot e.g. axes selectors, color selectors, number of point sliders, etc.

[vega-lite]: https://vega.github.io/vega-lite/docs/encoding.html
[bmschmidt]: https://github.com/bmschmidt
[quadfeather]: git+https://github.com/bmschmidt/quadfeather
[deepscatter]: https://github.com/nomic-ai/deepscatter/tree/main

[featherplot-py]: https://github.com/dsm-72/featherplot-py
[featherplot-pypi]: https://pypi.org/project/featherplot/
[featherplot-py-example]: https://github.com/dsm-72/featherplot-py/blob/main/examples/00_test.ipynb

[featherplot-csv-example]: (https://github.com/dsm-72/featherplot-svelte/blob/main/nbs/02_Generate_Named_Data.ipynb)


## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.


## Publishing

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
