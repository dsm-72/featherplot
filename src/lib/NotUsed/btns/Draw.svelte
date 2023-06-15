<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Draw from '../icons/pencil-square.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Draw}
    active="draw" deactive="dont"    
    on:click on:draw 
    bind:state={value}
    {...$$restProps}
/>