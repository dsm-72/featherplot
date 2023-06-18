<script lang="ts">	
	import '../app.css';
	import {onMount} from 'svelte';
	import { base } from '$app/paths';

	let version = '0.0.2'
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl btn-disabled" href="/">
			FeatherPlot
		</a>
		<span class="btn btn-ghost normal-case font-extralight text-base btn-disabled">
			(DeepScatter)
			<div class="badge badge-secondary badge-outline">v{version}</div>
		</span>
	</div>	
</div>

<div class="container mx-auto">	
		<slot/>
</div>