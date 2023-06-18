// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

// NOTE: I did this from https://www.okupter.com/blog/deploy-sveltekit-website-to-github-pages
const isProduction = process.env.NODE_ENV === 'production'
const basePath = isProduction ? '/featherplot-svelte' : ''

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			strict: false
		}),
	},

	// Comment the paths if wants to run in dev mode.
	paths: {
		base: basePath,
		assets: basePath
  	},
};

export default config;
