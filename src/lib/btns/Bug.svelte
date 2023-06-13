<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Bug from '$lib/icons/bug.svelte'
    export let value = false
    $: hasCls = !([undefined, null, ''].includes($$props.class))
</script>

<Ibtn 
    icon={Bug}
    active="debug" deactive="dont"    
    on:click on:debug 
    bind:state={value}    
    {...$$restProps}
/>