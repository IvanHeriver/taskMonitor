<script lang="ts">
  // import { fade } from "svelte/transition";
  import type { tmTag, tmTask } from "../../types";
  import { project } from "../../stores";
  // import Tags from "./Tags.svelte";
  import Tag from "../Tag/TagLabel.svelte";

  import Duration from "../Timer/Duration.svelte";
  // export let allTags: Array<tmTag>;
  export let task: tmTask;
  export let mode: "new" | "edit" | "small" | "big";
  $: isBig = mode === "big";
  $: isNew = mode === "new";

  let date = task.date.toISOString().slice(0, 10);
  let time = task.date.toISOString().slice(11, 19);
</script>

<div class={`container  ${mode}`}>
  {#if mode === "big" || mode === "small"}
    <div class="title">{task.title}</div>
    <div class="date">{task.date.toLocaleDateString()}</div>
    <div class="duration">
      <Duration duration={task.duration} mode={isBig ? "normal" : "small"} />
    </div>
    <div class="tags">
      <!-- <Tags {allTags} tagsIds={task.tags_id} mode={isBig ? "big" : "small"} /> -->
    </div>
    {#if isBig}
      <div class="desc">{task.description}</div>
      <div class="created">
        {`Created: ${task.created?.toLocaleDateString()} ${task.created?.toLocaleTimeString()}`}
      </div>
      <div class="updated">
        {`Modified: ${task.updated?.toLocaleDateString()} ${task.updated?.toLocaleTimeString()}`}
      </div>
    {/if}
    <div class="actions">
      <button on:click={() => (mode = isBig ? "small" : "big")}>
        <span class="maticons">
          {isBig ? "expand_less" : "expand_more"}
        </span>
      </button>
      <button on:click={() => (mode = "edit")}>
        <span class="maticons">mode_edit</span>
      </button>
      <button>
        <span class="maticons">delete</span>
      </button>
    </div>
  {:else}
    <label style="grid-area: title-label" for="title">Title:</label>
    <input
      type="text"
      style="grid-area: title-input"
      name="title"
      id="title"
      placeholder="Task title"
      bind:value={task.title}
    />
    <label style="grid-area: desc-label" for="desc">Description:</label>
    <textarea
      style="grid-area: desc-input"
      name="desc"
      id="desc"
      cols="30"
      rows="3"
      bind:value={task.description}
      placeholder="Task description"
    />
    <label for="datetime" style="grid-area: datetime-label"
      >Date and time:
    </label>
    <div id="datetime" style="grid-area: datetime-input">
      <input
        type="date"
        name="date"
        id="date"
        placeholder="Task date"
        bind:value={date}
      />
      <input
        type="time"
        name="time"
        id="time"
        placeholder="Task Time"
        bind:value={time}
      />
    </div>
    <label for="duration">Duration (min): </label>
    <input
      type="number"
      name="duration"
      id="duration"
      bind:value={task.duration}
    />
    <label for="tags-input" style="grid-area: tags-label">Tags:</label>
    <div id="tags-input" style="grid-area: tags-input">Tags input</div>
    <div class="actions">
      <button on:click={() => (mode = "big")}>
        <span class="maticons"> check </span>
        <span>{mode === "new" ? "Create task" : "Save"}</span>
      </button>
      {#if mode === "edit"}
        <button on:click={() => (mode = "big")}>
          <span class="maticons">close</span>
          <span>Cancel</span>
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 0.25rem;
    background-color: transparent;
    padding: 0;
  }
  button:hover > * {
    color: var(--fg-xtrong);
  }
  button:last-child {
    margin: 0;
  }
  .container:focus {
    outline: 1px solid var(--fg-xtrong);
    outline-offset: -1px;
  }
  .container {
    display: grid;
    gap: 0.125rem;
    margin: 0.125rem;
    padding: 0.25rem;
    background-color: var(--bg-light);
    overflow-x: auto;
  }
  .container.big {
    grid-template-areas:
      "title title actions"
      "date duration duration"
      "desc desc desc"
      "tags tags tags"
      "created . updated";
    gap: 0.25rem;
    /* grid-template-rows: 2rem 2rem auto auto auto; */
  }
  .container.small {
    grid-template-areas: "date duration title  tags actions";
    column-gap: 0.5rem;
    grid-template-columns: 10ch 10ch auto max-content max-content;
  }
  .container.new,
  .container.edit {
    grid-template-areas:
      "title-label title-input"
      "desc-label desc-input"
      "datetime-label datetime-input"
      "duration-label duration-input"
      "tags-label tags-input"
      ". actions";
    grid-template-columns: max-content auto;
    column-gap: 0.5rem;
  }
  #datetime {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.125rem;
  }
  .title {
    grid-area: title;
    font-weight: 600;
    justify-self: start;
    text-transform: uppercase;
  }
  .date {
    grid-area: date;
  }
  .duration {
    grid-area: duration;
  }
  .big > .duration {
    justify-self: end;
  }
  .desc {
    grid-area: desc;
    font-weight: 100;
  }
  .tags {
    grid-area: tags;
  }
  .container.big > .tags {
    justify-self: start;
  }
  .created {
    grid-area: created;
  }
  .updated {
    grid-area: updated;
    justify-self: end;
  }
  .actions {
    grid-area: actions;
    display: flex;
    align-items: center;
    justify-self: end;
  }
  .created,
  .updated {
    /* margin-top: 0.5rem; */
    font-size: 0.8rem;
    font-weight: 100;
  }
</style>
