<script lang="ts">
  import { projects, project } from "../stores";
  import type { tmProject } from "../types";
  import Project from "./Project.svelte";
  import NewProject from "./NewProject.svelte";
  import { onMount } from "svelte";
  // export let tabsInfo;
  // let currentProject: tmProject = null;

  function createNewProject() {
    newProject = true;
  }

  onMount(() => {
    if ($projects.length !== 0 && $project === null) {
      $project = $projects[0];
    }
  });
  let newProject = false;
</script>

{#if newProject}
  <NewProject
    on:done={(event) => {
      console.log(event.detail);
      if (event.detail) {
        $project = event.detail;
      }
      newProject = false;
    }}
  />
{/if}

<div class="projects">
  <div class="header">
    {#each $projects as p}
      <button
        class="title"
        class:selected={$project === p}
        on:click={() => {
          $project = p;
        }}
      >
        {p.state === "saved" ? p.name : `${p.name}*`}
      </button>
    {/each}
    <button on:click={createNewProject}>+ New Project</button>
  </div>
  <div class="content">
    {#if $project !== null}
      <Project />
    {/if}
  </div>
</div>

<style>
  .projects {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: min-content auto;
  }
  .header {
    display: flex;
  }
  .content {
    position: relative;
  }
  button {
    border: none;
  }
  .selected {
    background-color: var(--bg-light);
  }
</style>
