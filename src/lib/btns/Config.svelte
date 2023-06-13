<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Cog from '$lib/icons/cog.svelte'
</script>

<Ibtn 
    icon={Cog}
    active="config" deactive="dont"    
    on:click on:config 
/>