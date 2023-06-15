<script lang="ts">
    export let axis:string = 'c'
    export let value:string
    export let options:string[]    
</script>

<div class="form-control w-full">
    <label class="label" for="select-{axis.toLowerCase()}-axis">
        <span class="label-text">
            Select {axis.toUpperCase()}-Axis
            <span class="text-xs">({value})</span>
        </span>
    </label>
    
    <select 
        id="select-{axis.toLowerCase()}-axis" 
        class="select select-bordered select-accent" bind:value
        on:change
    >
        {#each options as opt}
            <option value={opt}>
                {opt}
            </option>
        {/each}
    </select>
</div>