<script lang="ts">
  // import type { tmTask } from "../../types";
  import Task from "./Task.svelte";
  import { project } from "../../stores";

  // const emptyTask: tmTask = {
  //   id: "",
  //   title: "",
  //   description: "",
  //   duration: 0,
  //   tags_id: [],
  //   date: new Date(),
  //   created: null,
  //   updated: null,
  // };

  let tasks = $project.tasks;
  $: {
    console.log($project);
    console.log(tasks);
  }
</script>

<div class="container">
  <div class="header">Tasks</div>
  <button> + New task </button>
  <!-- <Task task={emptyTask} mode={"new"} allTags={$project.tags} /> -->
  <!-- {#each tasks as task (task.id)} -->
  {#each $project.tasks as task (task.id)}
    <Task {task} mode={"view"} />
  {/each}
</div>

<style>
  .header {
    text-transform: uppercase;
    padding: 0 0.25rem;
    background-color: var(--bg-light);
  }
</style>
