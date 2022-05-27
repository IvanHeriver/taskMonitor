<script lang="ts">
  import type { ITag, ITask, ITimerLog } from "../../types";
  import DurationInput from "../Duration/DurationInput.svelte";
  import Duration from "../Duration/Duration.svelte";
  import TagsInput from "../Tag/TagsInput.svelte";

  import { createEventDispatcher, onMount } from "svelte";
  import { uuid } from "../../utils";
  export let task: ITask = null;
  export let tags: Array<ITag>;
  export let timerLogs: Array<ITimerLog>;

  const eventDispatcher = createEventDispatcher();

  let currentDate = new Date().toISOString().slice(0, 10);
  let id = uuid();
  let title = "";
  let date = currentDate;
  let duration = [];
  // let duration_unit: "minutes" | "hours" | "days" = "hours";
  let description = "";
  let tags_id = [];
  let isNew = true;
  //   let date_created = new Date().toISOString()
  // let date_create
  if (task !== null) {
    id = task.id;
    title = task.title;
    date = new Date(task.date).toISOString().slice(0, 10);
    duration = task.duration;
    description = task.description;
    tags_id = task.tags_id;
    isNew = false;
  }

  function save() {
    if (title === undefined || title === "") return;

    let created = new Date().toISOString();
    let updated = new Date().toISOString();
    if (task !== null) {
      created = task.created;
    }
    const newTask: ITask = {
      id,
      title,
      date: new Date(date).toISOString(),
      duration: duration,
      description,
      tags_id,
      created,
      updated,
      mode: "large-view",
    };
    eventDispatcher("save", newTask);
  }
  let titleInputElement;
  onMount(() => {
    titleInputElement.focus();
  });
</script>

<div class="container">
  <!-- <div class="header"> -->
  <div class="title-date">
    <div class="title">
      <label for="title">Title: </label>
      <input
        type="text"
        name="title"
        id="title"
        bind:value={title}
        placeholder="Title"
        bind:this={titleInputElement}
        on:keyup={(e) => {
          e.key === "Enter" && save();
        }}
      />
    </div>

    <div class="date">
      <label for="date">Date:</label>
      <input type="date" name="date" id="date" bind:value={date} />
    </div>
  </div>
  <div class="duration">
    <!-- <label for="duration">{`Duration (${duration_unit}): `} </label> -->
    <label for="duration"
      ><span>Duration:</span><Duration
        duration={duration.reduce((td, d) => td + d.duration, 0)}
      />
    </label>
    <DurationInput bind:durationItems={duration} bind:timerLogs />
  </div>
  <div class="desc">
    <label for="description">Description: </label>
    <textarea
      name="description"
      id="description"
      cols="30"
      rows="3"
      style="resize: none;"
      bind:value={description}
    />
  </div>

  <div class="tags">
    <label for="tags">Tags: </label>
    <TagsInput bind:tags_id bind:tags />
  </div>
  <!-- </div> -->
  <div class="actions">
    <button class="primary" on:click={() => save()}>
      <!-- <span class="maticons">save</span> -->

      <span class="maticons">done</span>
      <span>{isNew ? "Create New Task" : "Save Task"}</span>
    </button>
    <button
      class="secondary"
      on:click={() => {
        // task.mode = "large-view";
        eventDispatcher("cancel");
      }}
    >
      <span class="maticons">close</span>
      <span>Cancel</span>
    </button>
  </div>
</div>

<style>
  .container {
    padding: 0.5rem;
    background-color: var(--bg-strong);
    /* outline: 1px solid var(--fg-xstrong); */
    outline: 1px solid var(--bg-xxlight);
    outline-offset: -1px;
    display: grid;
    grid-template-columns: 100%;
    row-gap: 0.5rem;
  }
  .container:focus-within {
    outline-color: var(--fg-xstrong);
  }
  .title-date {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .title {
    font-weight: 600;
    width: 100%;
    display: flex;
    align-items: center;
  }
  .date {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .duration {
    width: 100%;
  }
  label {
    font-weight: 200;
    font-size: 0.8;
    color: var(--fg-light);
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  input {
    width: 100%;
  }
  textarea {
    width: 100%;
  }
  /* .desc {
    color: var(--fg-light);
    font-weight: 200;
  } */
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  .actions > button {
    margin-left: 0.5rem;
  }
</style>
