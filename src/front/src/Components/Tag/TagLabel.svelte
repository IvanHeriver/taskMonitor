<script lang="ts">
  import type { ITag } from "../../types";

  export let tag: ITag;
  export let mode: "small" | "large" = "large";

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

<div
  class="container"
  {style}
  title={`${tag.name}${tag.description !== "" ? ` - ${tag.description}` : ""}`}
>
  <div class="color" />
  <div class="text">
    {#if mode === "large"}
      {tag.name}
    {/if}
  </div>
</div>

<style>
  .container {
    outline: 1px solid var(--color);
    outline-offset: -1px;
    display: flex;
    align-items: stretch;
    margin-bottom: 0.125rem;
    margin-left: 0.25rem;
  }
  .container:first-child {
    margin-left: 0;
  }

  .color {
    width: 1rem;
    background-color: var(--color);
  }
  .text {
    padding: 0 0.25rem;
    /* transform: translateY(-0.125rem); */
    /* line-height: 1.3; */
    min-height: var(--size);
    min-width: var(--size);
  }
</style>
