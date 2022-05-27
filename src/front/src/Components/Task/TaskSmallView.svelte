<script lang="ts">
  import type { ITag, ITask } from "../../types";
  import Tag from "../Tag/TagLabel.svelte";
  // import { project } from "../../stores";
  import Duration from "../Duration/Duration.svelte";
  import { createEventDispatcher } from "svelte";
  export let task: ITask;
  export let tags: Array<ITag>;

  const eventDispatcher = createEventDispatcher();
</script>

<div class="container">
  <div class="title">{task.title}</div>
  <div class="date">{new Date(task.date).toLocaleDateString()}</div>
  <div class="duration">
    <Duration duration={task.duration.reduce((td, d) => td + d.duration, 0)} />
  </div>
  <div class="tags">
    {#each task.tags_id as tag_id}
      <Tag tag={tags.find((t) => t.id === tag_id)} mode="small" />
    {/each}
  </div>
  <div class="actions">
    <button class="icon" on:click={() => eventDispatcher("expand")}>
      <span class="maticons">expand_more</span>
    </button>
    <button class="icon" on:click={() => eventDispatcher("edit")}>
      <!-- <span class="maticons">mode_edit</span> -->
      <span class="maticons">create</span>
    </button>
    <button class="icon danger" on:click={() => eventDispatcher("delete")}>
      <span class="maticons">delete_outline</span>
    </button>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: minmax(50px, 1fr) 8ch minmax(100px, 120px) 100px max-content;
    column-gap: 0.5rem;
    align-items: center;
    padding: 0.25rem;
    background-color: var(--bg);
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    border-left: 0.5rem solid var(--bg-light);
  }
  .tags {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  .actions {
    display: flex;
  }
  .title {
    /* text-transform: uppercase; */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: 600;
    color: var(--fg-strong);
  }
  .date {
    /* font-weight: 200; */
    font-size: 0.8rem;
  }
</style>
