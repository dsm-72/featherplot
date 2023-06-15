<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Bug from '../icons/bug.svelte'
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