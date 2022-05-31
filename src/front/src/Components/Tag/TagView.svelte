<script lang="ts">
  import type { ITag } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let tag: ITag;
  let color = `hsl(${tag.color.h}, ${tag.color.s}%, ${tag.color.l}%)`;
</script>

<div class="container" style={`--color: ${color}`}>
  <div class="color" />
  <div class="name">
    {tag.name}
  </div>
  <div class="description">{tag.description}</div>
  <div class="actions">
    <button class="icon" on:click={() => eventDispatcher("edit")}>
      <span class="maticons">mode_edit</span>
    </button>
    <button class="icon danger" on:click={() => eventDispatcher("delete")}>
      <span class="maticons">delete_outline</span>
    </button>
  </div>
</div>

<style>
  .container {
    outline: 1px solid var(--bg-light);

    outline-offset: -1px;
    background-color: var(--bg-strong);
    display: grid;
    grid-template-columns: 0.5rem max-content minmax(0, auto) max-content;
    column-gap: 0.25rem;
    align-items: center;
    background-color: var(--bg);
  }
  .color {
    height: 100%;
    background-color: var(--color);
  }
  .name {
    text-transform: uppercase;
    padding-left: 0.25rem;
  }
  .description {
    padding: 0 0.5rem;
    font-size: 0.8rem;
    /* font-weight: 200; */
    color: var(--fg-xlight);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .actions {
    display: flex;
    align-items: center;
    justify-self: end;
    padding: 0.25rem 0;
  }
</style>
