<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Code from '../icons/code-bracket.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Code}
    active="code" deactive="dont"    
    on:click on:code 
    bind:state={value}
    {...$$restProps}
/>