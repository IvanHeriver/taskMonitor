<script lang="ts">
  import TagLabel from "../Tag/TagLabel.svelte";
  import type { ITag } from "../../types";

  export let tags_id: Array<string>;
  export let tags: Array<ITag>;

  $: selected = tags.map((t) => tags_id.includes(t.id));
</script>

<div class="container">
  {#each tags as tag, i (tag.id)}
    <TagLabel
      {tag}
      selectable={true}
      bind:selected={selected[i]}
      on:change={(e) => {
        if (e.detail) {
          if (!tags_id.includes(tag.id)) {
            tags_id = [...tags_id, tag.id];
          }
        } else {
          if (tags_id.includes(tag.id)) {
            tags_id = tags_id.filter((t) => t !== tag.id);
          }
        }
      }}
    />
  {/each}
</div>

<style>
  .container {
    width: 100%;
    max-height: 6rem;
    outline: 1px solid var(--bg-xlight);
    background-color: var(--bg-light);
    outline-offset: -1px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0.25rem;
  }
</style>
