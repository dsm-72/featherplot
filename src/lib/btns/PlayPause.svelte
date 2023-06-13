<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Play from '$lib/icons/play.svelte'
    import Pause from '$lib/icons/pause.svelte'
    export let value = false
</script>

<Ibtn 
    icon={Play} toggleIcon={Pause}
    active="play" deactive="pause"
    toggle={true}
    on:click on:play on:pause 
    bind:state={value}
    {...$$restProps}
/>