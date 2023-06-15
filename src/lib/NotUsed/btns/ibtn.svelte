<script lang="ts">

    import type {ComponentType, SvelteComponentTyped} from 'svelte'

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    export let icon: ComponentType
    export let toggleIcon: ComponentType | null = null

    export let toggle = false
    export let deactive = 'off'
    export let active = 'on'
    
    export let state = false

    const click = () => {
        state = !state
        let str = state ? active : deactive
        str = toggle ? str : active
        dispatch(str)
    }

    $: action = toggle 
        ? (state ? active : deactive)
        : active
    
    $: comp = toggle 
        ? (state ? icon : toggleIcon)
        : icon

    
    const cls = `text-primary font-semibold
    p-1 border rounded-lg
    bg-transparent  border-secondary
    hover:text-white hover:bg-secondary`
    
    $: hasCls = !([undefined, null, ''].includes($$props.class))
</script>

<button 
    on:click 
    on:click={click}
    {...$$restProps}
    class="{cls}"
>
    <svelte:component 
        this={comp}
        {...$$restProps}
        class="{hasCls ?  $$props.class : ''}"
    />
</button>