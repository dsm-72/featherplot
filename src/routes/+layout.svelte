<script lang="ts">	
	import '../app.css';
	import { base } from '$app/paths';
	import JellyContainer from '$lib/JellyContainer.svelte';
</script>
<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl btn-disabled" href="/">
			FeatherPlot
		</a>
		<span class="btn btn-ghost normal-case font-extralight text-base btn-disabled">
			(DeepScatter)
			<div class="badge badge-secondary badge-outline">v0.0.1</div>
		</span>
	</div>	
</div>

<div class="container mx-auto">	
	<!-- <JellyContainer>		 -->
		<slot/>
	<!-- </JellyContainer> -->
</div>