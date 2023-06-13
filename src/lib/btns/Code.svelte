<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Code from '$lib/icons/code-bracket.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Code}
    active="code" deactive="dont"    
    on:click on:code 
    bind:state={value}
    {...$$restProps}
/>