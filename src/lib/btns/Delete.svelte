<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Delete from '$lib/icons/delete.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Delete}
    active="delete" deactive="dont"    
    on:click on:delete 
    bind:state={value}
    {...$$restProps}
/>