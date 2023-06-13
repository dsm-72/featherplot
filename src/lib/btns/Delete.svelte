<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Delete from '$lib/icons/delete.svelte'
</script>

<Ibtn 
    icon={Delete}
    active="delete" deactive="dont"    
    on:click on:delete 
/>