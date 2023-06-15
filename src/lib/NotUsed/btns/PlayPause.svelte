<script lang="ts">
    import Ibtn from '../btns/ibtn.svelte'
    import Play from '../icons/play.svelte'
    import Pause from '../icons/pause.svelte'
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