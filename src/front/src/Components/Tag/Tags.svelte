<script lang="ts">
  import Section from "../Section.svelte";
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

  const headerActions = [
    {
      icon_code: "add",
      text: "Add tag",
      action: () => (project.ui.newTagOpen = true),
    },
  ];
</script>

<div class="container">
  <Section icon_code="local_offer" title="Tags" actions={headerActions}>
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
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
