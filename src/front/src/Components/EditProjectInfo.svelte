<script lang="ts">
  import { registerModification } from "../stores";
  import type { IProject } from "../types";
  import { createEventDispatcher, onMount } from "svelte";
  const eventDispatcher = createEventDispatcher();

  onMount(() => {
    name = project.name;
    description = project.description;
    projectNameInputElement.focus();
  });

  export let project: IProject;

  function saveProjectInfo() {
    project.name = name;
    project.description = description;
    registerModification(project.id, "edit project name", ["name"]);
    registerModification(project.id, "edit project description", [
      "description",
    ]);
    eventDispatcher("done");
  }
  let name = "";
  let description = "";
  let projectNameInputElement;
</script>

<div class="disabling-overlay" />
<div class="outside">
  <div class="inside">
    <!-- <form on:submit|preventDefault={createNewProject}> -->
    <div class="title">Edit project information</div>
    <label for="name">Project name:</label>
    <input
      type="text"
      name="name"
      id="name"
      bind:value={name}
      placeholder="Write the project name here"
      maxlength="20"
      on:keyup={(event) => {
        if (event.key === "Enter") {
          saveProjectInfo();
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
      style="resize: none"
    />
    <div class="actions">
      <button
        id="cancel"
        on:click={() => {
          eventDispatcher("done");
        }}>Cancel</button
      >
      <button id="create" on:click={saveProjectInfo}>Save</button>
    </div>
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

  /* #description {
    height: 5rem;
    word-wrap: break-word;
  } */
</style>
