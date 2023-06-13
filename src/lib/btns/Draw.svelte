<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Draw from '$lib/icons/pencil-square.svelte'
</script>

<Ibtn 
    icon={Draw}
    active="draw" deactive="dont"    
    on:click on:draw 
/>