<script lang="ts">
  import TaskLargeView from "./TaskLargeView.svelte";
  import TaskSmallView from "./TaskSmallView.svelte";
  import TaskEdit from "./TaskEdit.svelte";
  import type { ITag, ITask, ITimerLog } from "../../types";
  import { question } from "../../stores";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let task: ITask;
  export let tags: Array<ITag>;
  export let timerLogs: Array<ITimerLog>;

  // export let mode: "edit" | "large-view" | "small-view";

  let lastMode: "edit" | "large-view" | "small-view" =
    task.mode === "edit" ? "large-view" : task.mode;
  function changeMode(newMode) {
    lastMode = task.mode === "edit" ? "large-view" : task.mode;
    task.mode = newMode;
  }

  function deleteTask(task_id) {
    eventDispatcher("delete", task_id);
  }
</script>

<div class="task">
  {#if task.mode === "large-view"}
    <TaskLargeView
      {task}
      bind:tags
      on:collapse={() => changeMode("small-view")}
      on:edit={() => changeMode("edit")}
      on:delete={() => {
        $question = {
          title: `Delete task '${task.title}'?`,
          question: `Are you sure you want to delete the task '${task.title}'?`,
          answer(res) {
            if (res) deleteTask(task.id);
          },
        };
      }}
    />
  {:else if task.mode === "small-view"}
    <TaskSmallView
      {task}
      bind:tags
      on:expand={() => changeMode("large-view")}
      on:edit={() => changeMode("edit")}
      on:delete={() => {
        $question = {
          title: `Delete task '${task.title}'?`,
          question: `Are you sure you want to delete the task '${task.title}'?`,
          answer(res) {
            if (res) deleteTask(task.id);
          },
        };
      }}
    />
  {:else if task.mode === "edit"}
    <TaskEdit
      {task}
      bind:tags
      bind:timerLogs
      on:cancel={() => {
        changeMode(lastMode);
        eventDispatcher("cancel");
      }}
      on:save={(event) => {
        const newTask = event.detail;
        eventDispatcher("save", newTask);
      }}
    />
  {/if}
</div>

<style>
  .task {
    padding-top: 0.25rem;
    min-width: fit-content;
  }
  .task:first-child {
    padding-top: 0;
  }
</style>
