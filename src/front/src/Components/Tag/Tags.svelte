<script lang="ts">
  import type { IProject } from "../../types";
  import Tag from "./Tag.svelte";
  import { registerModification } from "../../stores";

  export let project: IProject;
  let modes = {};
  $: {
    project.tags.forEach((tag) => {
      if (!(tag.id in modes)) {
        modes[tag.id] = "view";
      }
    });
  }
</script>

<div class="container">
  <div class="header">
    <div class="title">
      <span class="maticons">local_offer</span><span>Tags</span>
    </div>
    <div class="content">
      <div class="actions">
        <button on:click={() => (project.ui.newTagOpen = true)}>
          <span class="maticons">add</span><span>Add tag</span>
        </button>
      </div>
    </div>
  </div>
  <div class="tags">
    {#if project.ui.newTagOpen}
      <Tag
        tag={null}
        mode="edit"
        on:new={(event) => {
          if (event.detail) {
            const newTag = event.detail;
            project.tags = [newTag, ...project.tags];
            registerModification(project.id, "new tag", ["tags", 0]);
          }
          project.ui.newTagOpen = false;
          registerModification(project.id, "ui", ["ui", "newTagOpen"]);
        }}
      />
    {/if}
    {#each project.tags as tag (tag.id)}
      <Tag
        bind:tag
        bind:mode={modes[tag.id]}
        on:delete={(event) => {
          const tagId = event.detail;
          project.tasks = project.tasks.map((t) => {
            t.tags_id = t.tags_id.filter((i) => i !== tagId);
            return t;
          });
          project.tags = project.tags.filter((t) => t.id !== tagId);
          registerModification(project.id, "delete tag", ["tags"]);
        }}
        on:save={(event) => {
          const newTag = event.detail;
          project.tags = project.tags.map((t, i) => {
            if (t.id !== newTag.id) return t;
            registerModification(project.id, "modify tag", ["tags", i]);
            return newTag;
          });
        }}
      />
    {/each}
  </div>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: var(--bg-light);
    overflow: auto;
  }
  .title {
    padding: 0 0.25rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title > .maticons {
    font-size: 16px;
    padding-right: 0.125rem;
  }
  .actions {
    display: flex;
  }
  .actions > button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 200;
    background-color: transparent;
  }
  .actions > button > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    line-height: 1;
  }
  .tags {
    padding: 0.25rem;
    position: absolute;
    top: 1.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
