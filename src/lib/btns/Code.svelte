<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Code from '$lib/icons/code-bracket.svelte'
</script>

<Ibtn 
    icon={Code}
    active="code" deactive="dont"    
    on:click on:code 
/>