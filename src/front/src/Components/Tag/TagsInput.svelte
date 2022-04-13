<script lang="ts">
  import { onMount } from "svelte";

  // import { project } from "../../stores";
  import TagLabel from "../Tag/TagLabel.svelte";
  import sectionResizer from "@ivanheriver/section-resizer";
  import type { ITag } from "../../types";

  export let tags_id: Array<string>;
  export let tags: Array<ITag>;

  $: available_tags_id = tags
    .filter((t) => !tags_id.includes(t.id))
    .map((t) => t.id);
  function addTag(tag_id) {
    tags_id = [...tags_id, tag_id];
  }
  function removeTag(tag_id) {
    tags_id = tags_id.filter((id) => id !== tag_id);
  }
  onMount(() => {
    containerResiser = sectionResizer(containerElement);
    // containerResiser.resize([{ index: 0, size: 300 }]);
  });

  let containerElement, containerResiser;
</script>

<div class="container" bind:this={containerElement}>
  <div class="selected">
    <label for="tags-selected">Selected tags:</label>
    <div class="tags" id="tags-selected">
      {#each tags_id as tag_id (tag_id)}
        <button
          class="tag"
          on:click={() => removeTag(tag_id)}
          on:keyup={(e) => e.key === "Enter" && removeTag(tag_id)}
        >
          <TagLabel tag={tags.find((t) => t.id === tag_id)} />
        </button>
      {/each}
    </div>
  </div>
  <div class="available">
    <label for="tags-available">Available tags:</label>
    <div class="tags" id="tags-available">
      <!-- {#each $project.tags as tag (tag.id)} -->
      {#each available_tags_id as tag_id (tag_id)}
        <!-- {#if !isTagWithinSelected(tag.id)} -->
        <button
          class="tag"
          on:click={() => addTag(tag_id)}
          on:keyup={(e) => e.key === "Enter" && addTag(tag_id)}
        >
          <TagLabel tag={tags.find((t) => t.id === tag_id)} />
        </button>
        <!-- {/if} -->
      {/each}
    </div>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 6rem;
    outline: 1px solid var(--bg-xlight);
    background-color: var(--bg-light);
    outline-offset: -1px;
  }
  .container > div {
    padding: 0 0.5rem;
    overflow: auto;
  }
  label {
    font-weight: 100;
    font-size: 0.8;
    color: var(--fg-light);
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
  }
  .tag {
    cursor: pointer;
    padding: 0.125rem 0;
    padding-left: 0.25rem;
    background-color: transparent;
  }
  .tag:first-child {
    padding-left: 0;
  }
</style>
