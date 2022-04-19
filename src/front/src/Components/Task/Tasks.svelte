<script lang="ts">
  import Task from "./Task.svelte";
  import NewTask from "./NewTask.svelte";

  import { registerModification } from "../../stores";

  export let project;
</script>

<div class="container">
  <div class="header">
    <div class="title">
      <span class="maticons">assignment_turned_in</span><span>Tasks</span>
    </div>
    <div class="actions">
      <button
        on:click={() => {
          project.ui.newTaskOpen = true;
        }}
      >
        <span class="maticons">add</span><span>Add task</span>
      </button>
      <button
        on:click={() => {
          project.tasks = project.tasks.map((t) => {
            if (t.mode === "edit") return t;
            t.mode = "small-view";
            return t;
          });
        }}
      >
        <span class="maticons">expand_less</span><span>Collapse all</span>
      </button>
      <button
        on:click={() => {
          project.tasks = project.tasks.map((t) => {
            if (t.mode === "edit") return t;
            t.mode = "large-view";
            return t;
          });
        }}
      >
        <span class="maticons">expand_more</span><span>Expand all</span>
      </button>
    </div>
  </div>

  <div class="tasks">
    {#if project.ui.newTaskOpen}
      <NewTask
        task={null}
        bind:tags={project.tags}
        bind:timerLogs={project.timerLogs}
        on:cancel={() => {
          project.ui.newTaskOpen = false;
        }}
        on:save={(event) => {
          const newTask = event.detail;
          project.tasks = [newTask, ...project.tasks];
          project.ui.newTaskOpen = false;
          registerModification(project.id, "new task", ["tasks"]);
        }}
      />
    {/if}
    {#each project.tasks as task, i (task.id)}
      <Task
        bind:task
        bind:tags={project.tags}
        bind:timerLogs={project.timerLogs}
        on:save={(e) => {
          const newTask = e.detail;
          project.tasks = project.tasks.map((t, i) => {
            if (t.id !== newTask.id) return t;
            registerModification(project.id, "modify task", ["tasks", i]);
            return newTask;
          });
        }}
        on:delete={(e) => {
          const task_id = e.detail;
          project.tasks = project.tasks.filter((t) => t.id !== task_id);
          registerModification(project.id, "delete task", ["tasks"]);
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
  .tasks {
    padding: 0.25rem;
    position: absolute;
    top: 1.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: var(--bg-light);
    /* height:  */
  }
  .header * {
    white-space: nowrap;
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
    /* font-weight: 200; */
    background-color: transparent;
  }
  .actions > button:hover {
    color: var(--fg-xstrong);
  }
  .actions > button:focus {
    outline: 1px solid var(--fg-xstrong);
    outline-offset: -1px;
  }
  .actions > button > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    line-height: 1;
  }
</style>
