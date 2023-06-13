<script lang="ts">
    import Ibtn from '$lib/btns/ibtn.svelte'
    import Play from '$lib/icons/play.svelte'
    import Pause from '$lib/icons/pause.svelte'
</script>

<Ibtn 
    icon={Play} toggleIcon={Pause}
    active="play" deactive="pause"
    toggle={true}
    on:click on:play on:pause 
/>