<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ITag, ITask } from "../../types";
  import Tag from "../Tag/TagLabel.svelte";
  // import { project } from "../../stores";
  import Duration from "../Duration/Duration.svelte";
  import { createEventDispatcher } from "svelte";
  import DateView from "../Timer/DateView.svelte";
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
      <span class="label"> {$_("tasks.date")}: </span>
      <div class="date">{new Date(task.date).toLocaleDateString()}</div>
    </div>
    <div class="duration">
      <div class="total-duration">
        <span class="label"> {$_("tasks.total_duration")}:</span>
        <Duration
          duration={task.duration.reduce((td, d) => td + d.duration, 0)}
        />
      </div>

      <div class="all-durations">
        {#each task.duration as durationItem}
          <div class="duration-item">
            <DateView date={durationItem.date} />
            <Duration duration={durationItem.duration} small={true} />
          </div>
        {/each}
      </div>
    </div>
    {#if task.description !== ""}
      <div class="desc">
        <span class="label"> {$_("tasks.description")}:</span>
        <span class="description">
          {task.description}
        </span>
      </div>
    {/if}

    {#if task.tags_id.length > 0}
      <div class="tags">
        <span class="label"> {$_("tasks.tags")}:</span>
        <div class="tag-list">
          {#each task.tags_id as tag_id}
            <Tag tag={tags.find((t) => t.id === tag_id)} mode="large" />
          {/each}
        </div>
      </div>
    {/if}

    <div class="info">
      <div class="created">
        <span>{$_("tasks.created")}:</span>
        <span class="date-info">
          {`${new Date(task.created).toLocaleDateString()} ${new Date(
            task.created
          ).toLocaleTimeString()}`}
        </span>
      </div>
      <div class="updated">
        <span>{$_("tasks.modified")}:</span>
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
    background-color: var(--bg-light);
  }
  .header,
  .info {
    display: flex;
    justify-content: space-between;
  }
  .header {
    padding: 0.25rem;
    background-color: var(--bg);
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    border-left: 0.5rem solid var(--bg-light);
  }
  .content {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .actions {
    display: flex;
  }
  .title {
    color: var(--fg-strong);
    font-weight: 600;
  }
  .info {
    font-size: 0.8rem;
    color: var(--fg-xlight);
  }
  .label {
    color: var(--fg-xlight);
  }

  .time {
    display: flex;
    gap: 0.5rem;
  }

  .duration {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .total-duration {
    display: flex;
    gap: 0.5rem;
  }
  .all-durations {
    display: flex;
    /* flex-wrap: wrap; */
    flex-direction: column;
    column-gap: 1rem;
    /* padding-left: 1rem; */
  }
  .duration-item {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: var(--fg);
  }

  .desc {
    display: flex;
    flex-direction: column;
  }
  .desc .description {
    color: var(--fg);
  }

  .tags {
    padding: 0.25rem 0;
    display: flex;
    flex-direction: column;
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
  }
</style>
