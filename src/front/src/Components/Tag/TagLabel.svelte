<script lang="ts">
  import type { ITag } from "../../types";

  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let tag: ITag;
  export let mode: "small" | "large" = "large";
  export let selectable: boolean = false;
  export let selected: boolean = false;

  $: color = `hsl(${tag.color.h}, ${tag.color.s}%, ${tag.color.l}%)`;
  let style;
  $: {
    if (mode === "large") {
      style = `--color: ${color}; --text-bg: var(--bg); --size: 1.5rem`;
    } else {
      style = `--color: ${color}; --text-bg: ${color}; --size: 0.5rem`;
    }
  }
</script>

<button
  class="container"
  class:selectable
  class:selected
  {style}
  title={`${tag.name}${tag.description !== "" ? ` - ${tag.description}` : ""}`}
  on:click={() => {
    if (selectable) {
      selected = !selected;
      eventDispatcher("change", selected);
    }
  }}
>
  <div class="color" />
  <div class="text">
    {#if mode === "large"}
      {tag.name}
    {/if}
  </div>
</button>

<style>
  .container {
    all: unset;
    outline: 1px solid var(--bg-xlight);
    outline-offset: -1px;
    display: flex;
    margin: 1px;
  }
  .container.selectable {
    border: 2px solid transparent;
    cursor: pointer;
  }

  .container.selectable:hover,
  .container.selectable:focus {
    outline-color: var(--fg-xstrong);
  }

  .container.selectable.selected {
    /* outline-color: var(--fg-strong); */
    border-color: var(--fg-strong);
  }

  .color {
    width: 0.5rem;
    background-color: var(--color);
  }
  .text {
    padding: 0.25rem 0.5rem;
    min-height: var(--size);
    min-width: var(--size);
    font-weight: 500;
    font-size: 0.8rem;
  }
</style>
