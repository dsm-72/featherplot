<script lang="ts">	
	import '../app.css';
	import {onMount} from 'svelte';

	import { base } from '$app/paths';
	import JellyContainer from '$lib/JellyContainer.svelte';
	
	let darkTheme: boolean;
	import IconButton from '@smui/icon-button';

	$: modeLabel = `switch to ${darkTheme ? 'light' : 'dark'} mode`;

  	// This icon represents the mode to which the user can switch.
  	$: modeIcon = darkTheme ? 'light_mode' : 'dark_mode';

	const toggleMode = () => (darkTheme = !darkTheme);


	onMount(() => {
    	darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
		darkTheme = false
  	});

	import TopAppBar, {Row, Section, Title, AutoAdjust,} from '@smui/top-app-bar'
	import Button from '@smui/button';
	import Chip, { Set, Text } from '@smui/chips';

	let version = '0.0.1'

</script>

<svelte:head>
	{#if darkTheme === undefined}
	<!-- SMUI Styles -->
	<link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
	<link rel="stylesheet" href="/smui-dark.css" media="screen and (prefers-color-scheme: dark)"/>

	{:else if darkTheme}
  	<link rel="stylesheet" href="/smui.css" media="print" />
  	<link rel="stylesheet" href="/smui-dark.css" media="screen" />
  	
	{:else}
  	<link rel="stylesheet" href="/smui.css" />
  	{/if}
	
	<!-- Material Icons -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
	<!-- Roboto -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"/>
	<!-- Roboto Mono -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono"/>
</svelte:head>

<TopAppBar
	variant="static"
	dense={true}
	color={'secondary'}
>
	<Row>
    <Section>
		<Button disabled>
			<span class="normal-case text-xl">
				FeatherPlot
			</span>
		</Button>		
		<span class="normal-case  text-sky-300">
			(DeepScatter)			
		</span>
		<Chip chip class="ml-2 text-sky-300 text-sm" ripple={false} touch={false}>			
			<Text class="text-sm">
				v{version}
			</Text>			
		</Chip>
	</Section>
	<Section align="end" toolbar>
		<IconButton
			aria-label="{modeLabel}"
			class="material-icons"
			on:click="{toggleMode}"
			title="{modeLabel}"
		>
			{modeIcon}
      	</IconButton>
	</Section>
	</Row>
</TopAppBar>

<slot>

</slot>
