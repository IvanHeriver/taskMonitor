<script lang="ts">
  import type { ITag, ITask } from "../../types";
  import Tag from "../Tag/TagLabel.svelte";
  // import { project } from "../../stores";
  import Duration from "../Timer/Duration.svelte";
  import { createEventDispatcher } from "svelte";
  export let task: ITask;
  export let tags: Array<ITag>;

  const eventDispatcher = createEventDispatcher();
</script>

<div class="container">
  <div class="header">
    <div class="title">{task.title}</div>
    <div class="actions">
      <button class="icon" on:click={() => eventDispatcher("collapse")}>
        <span class="maticons">expand_less</span>
      </button>
      <button class="icon" on:click={() => eventDispatcher("edit")}>
        <span class="maticons">mode_edit</span>
      </button>
      <button class="icon danger" on:click={() => eventDispatcher("delete")}>
        <span class="maticons">delete_outline</span>
      </button>
    </div>
  </div>
  <div class="content">
    <div class="time">
      <div class="date">{new Date(task.date).toLocaleDateString()}</div>
      <div class="duration">
        <Duration duration={task.duration} unit="auto" />
      </div>
    </div>
    <div class="desc">{task.description}</div>

    <div class="tags">
      {#each task.tags_id as tag_id}
        <Tag tag={tags.find((t) => t.id === tag_id)} mode="large" />
      {/each}
    </div>
    <div class="info">
      <div class="created">
        <span>Created:</span>
        <span class="date-info">
          {`${new Date(task.created).toLocaleDateString()} ${new Date(
            task.created
          ).toLocaleTimeString()}`}
        </span>
      </div>
      <div class="updated">
        <span>Modified:</span>
        <span class="date-info">
          {`${new Date(task.updated).toLocaleDateString()} ${new Date(
            task.updated
          ).toLocaleTimeString()}`}
        </span>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    /* padding: 0.5rem; */
    background-color: var(--bg-light);
  }
  .header,
  .time,
  .info {
    display: flex;
    justify-content: space-between;
  }
  .header {
    padding: 0.25rem;
    background-color: var(--bg);
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
  }
  .content {
    padding: 0.5rem;
  }
  .actions {
    display: flex;
  }
  /* .actions > button > span {
    font-size: 20px;
  } */
  .title {
    text-transform: uppercase;
    font-weight: 600;
  }
  .desc,
  .info {
    color: var(--fg-light);
    font-weight: 200;
  }
  .desc {
    padding-top: 0.25rem;
  }
  .tags {
    padding: 0.25rem 0;
    display: flex;
    flex-wrap: wrap;
  }
  .info {
    /* padding-top: 0.25rem; */
    font-size: 0.9rem;
  }
  .date-info {
    font-weight: 400;
  }
</style>
