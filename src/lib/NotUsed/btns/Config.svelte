<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Cog from '../icons/cog.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Cog}
    active="config" deactive="dont"    
    on:click on:config 
    bind:state={value}
    {...$$restProps}
/>