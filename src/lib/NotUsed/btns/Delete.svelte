<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Delete from '../icons/delete.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Delete}
    active="delete" deactive="dont"    
    on:click on:delete 
    bind:state={value}
    {...$$restProps}
/>