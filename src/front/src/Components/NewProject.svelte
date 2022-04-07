<script lang="ts">
  import { projects } from "../stores";
  import type { tmProject } from "../types";
  import { createEventDispatcher, onMount } from "svelte";
  const eventDispatcher = createEventDispatcher();
  function createNewProject() {
    projects.update((prevProjects: Array<tmProject>): Array<tmProject> => {
      newProject = {
        id: id,
        name: name,
        description: description,
        filePath: null,
        state: "unsaved",
        tasks: [],
        tags: [],
        timer: null,
        created: new Date(),
        updated: new Date(),
      };
      return [...prevProjects, newProject];
    });
    eventDispatcher("done", newProject);
  }
  onMount(() => {
    projectNameInputElement.focus();
  });
  const id: string = Math.random().toString().slice(2);
  let newProject: tmProject;
  // let name = `Untitled-${id}`;
  let name = "";
  let description = "";
  let projectNameInputElement;
</script>

<div class="disabling-overlay" />
<div class="outside">
  <div class="inside">
    <!-- <form on:submit|preventDefault={createNewProject}> -->
    <div class="title">Create a new project</div>
    <label for="name">Project name:</label>
    <input
      type="text"
      name="name"
      id="name"
      bind:value={name}
      placeholder="Write the project name here"
      on:keyup={(event) => {
        if (event.key === "Enter") {
          createNewProject();
        }
      }}
      bind:this={projectNameInputElement}
    />
    <label for="description">Project description:</label>
    <textarea
      rows="5"
      cols="33"
      name="description"
      id="description"
      bind:value={description}
      placeholder="Write a project description here"
    />
    <div class="actions">
      <button
        id="cancel"
        on:click={() => {
          eventDispatcher("done");
        }}>Cancel</button
      >
      <button id="create" on:click={createNewProject}>Create project</button>
    </div>
    <!-- </form> -->
  </div>
</div>

<style>
  .outside {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
  }
  .inside {
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    width: 400px;
    padding: 1rem;
  }
  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .actions {
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
  }
</style>
