<script lang="ts">
  import { _ } from "svelte-i18n";
  import { uuid } from "../utils";
  import { projects, saveSession, message, overlay } from "../stores";
  import type { IProject } from "../types";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  const eventDispatcher = createEventDispatcher();
  function createNewProject() {
    if (name === "") return;
    if (/[~`!#$%\^&*+=\-\[\]\\'();,/{}|\\":<>\?]/g.test(name)) {
      $message = {
        title: $_("messages.invalid_character"),
        message: $_("messages.forbidden_characters"),
        duration: 5000,
        type: "error",
      };
      return;
    }
    projects.update((prevProjects: Array<IProject>): Array<IProject> => {
      newProject = {
        version: 1,
        id: id,
        name: name,
        description: description,
        filePath: "",
        state: "unsaved",
        tasks: [],
        tags: [],
        timerLogs: [],
        todos: [],
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        stats: {
          allocatedDuration: null,
        },
        ui: {
          newTagOpen: false,
          newTaskOpen: false,
          newTodoOpen: false,
          taskPanelOpen: true,
          tagPanelOpen: true,
          timerPanelOpen: true,
          statPanelOpen: false,
          todoPanelOpen: true,
        },
      };
      return [...prevProjects, newProject];
    });
    saveSession();
    eventDispatcher("done", newProject);
  }
  onMount(() => {
    projectNameInputElement.focus();
    $overlay = true;
  });
  onDestroy(() => {
    $overlay = false;
  });

  const id: string = uuid();
  let newProject: IProject;
  // let name = `Untitled-${id}`;
  let name = "";
  let description = "";
  let projectNameInputElement;
</script>

<!-- <div class="disabling-overlay" /> -->
<div class="outside">
  <div class="inside">
    <!-- <form on:submit|preventDefault={createNewProject}> -->
    <div class="title">{$_("create_project")}</div>
    <label for="name">{$_("project_name")}:</label>
    <input
      type="text"
      name="name"
      id="name"
      bind:value={name}
      placeholder={$_("write_project_name_here")}
      maxlength="20"
      on:keyup={(event) => {
        if (event.key === "Enter") {
          createNewProject();
        }
      }}
      bind:this={projectNameInputElement}
    />
    <label for="description">{$_("project_description")}:</label>
    <textarea
      rows="3"
      cols="33"
      name="description"
      id="description"
      bind:value={description}
      placeholder={$_("write_project_description_here")}
      style="resize: none"
    />
    <!-- <input
      type="text"
      name="description"
      id="description"
      bind:value={description}
      placeholder="Write a project description here"
    /> -->
    <div class="actions">
      <button
        class="secondary"
        id="cancel"
        on:click={() => {
          eventDispatcher("done");
        }}>{$_("cancel")}</button
      >
      <button class="primary" id="create" on:click={createNewProject}
        >{$_("create_project")}</button
      >
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
    gap: 0.5rem;
    background-color: var(--bg);
    width: 400px;
    padding: 1rem;
  }
  .title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .actions {
    padding-top: 0.5rem;
    display: flex;
    justify-content: space-between;
  }
</style>
