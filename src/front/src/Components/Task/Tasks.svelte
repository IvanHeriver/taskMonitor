<script lang="ts">
  import type { tmProject, tmTask } from "../../types";
  import Task from "./Task.svelte";
  export let project: tmProject;
  const emptyTask: tmTask = {
    id: "",
    title: "",
    description: "",
    duration: 0,
    tags_id: [],
    date: new Date(),
    created: null,
    updated: null,
  };
</script>

<div class="container">
  <div class="header">Tasks</div>
  <!-- <button> + New task </button> -->
  <Task task={emptyTask} mode={"big"} allTags={project.tags} />
  {#each project.tasks as task}
    <Task {task} mode={"small"} allTags={project.tags} />
  {/each}
</div>

<style>
  .header {
    text-transform: uppercase;
    padding: 0 0.25rem;
    background-color: var(--background-light-color);
  }
</style>
