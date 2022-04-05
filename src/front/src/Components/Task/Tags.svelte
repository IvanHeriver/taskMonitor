<script lang="ts">
  import type { tmTag } from "../../types";

  export let allTags: Array<tmTag>;
  export let tagsIds: Array<string>;
  export let mode: "small" | "big";
  let tags = tagsIds.map((id) => allTags.find((tag) => tag.id === id));
  let colors = tags.map((tag) => (tag.color.l > 50 ? "black" : "white"));
</script>

<div class="container">
  {#each tags as tag, i}
    <div
      class="tag"
      title={mode === "big" ? tag.description : tag.name}
      style={`--tag-color: hsl(${tag.color.h}, ${tag.color.s}%, ${tag.color.l}%); color: ${colors[i]}`}
    >
      {#if mode === "big"}
        {tag.name}
      {/if}
    </div>
  {/each}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .tag {
    --tag-size: 1.25rem;
    height: var(--tag-size);
    /* color: white; */
    font-size: 0.9rem;
    font-weight: 400;
    padding: 0 0.5rem;
    display: inline-block;
    background-color: var(--tag-color, grey);
    position: relative;
    transform: translateX(var(--tag-size) / 2);
    /* margin: var(--tag-size); */
    margin: 0.125rem calc(var(--tag-size) / 2);
    display: flex;
    align-items: center;
  }
  .tag::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    left: calc(var(--tag-size) * -1);
    width: var(--tag-size);
    border-top: calc(var(--tag-size) / 2) solid transparent;
    border-bottom: calc(var(--tag-size) / 2) solid transparent;

    border-right: calc(var(--tag-size) / 2) solid var(--tag-color, grey);
  }
</style>
