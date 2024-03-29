<script lang="ts">
  import { _ } from "svelte-i18n";
  import {
    projects,
    currentProjectId,
    question,
    saveSession,
    registerModification,
    processLoadedProject,
  } from "../stores";
  // import type { tmProject } from "../types";
  import Project from "./Project.svelte";
  import EditProjectInfo from "./EditProjectInfo.svelte";
  import { onMount } from "svelte";
  import type { IProject } from "../types";
  import { uuid } from "../utils";
  // export let tabsInfo;
  // let currentProject: tmProject = null;

  onMount(() => {
    // window.electronAPI.onLoadProject((loadedProjectInfo) => {
    //   if (!loadedProjectInfo.success) {
    //     console.warn("The file was not loaded");
    //     return;
    //   }
    //   onLoadProject(loadedProjectInfo.project);
    // });
    window.electronAPI.onSaveProject(async () => {
      const currentProject = $projects.find((p) => p.id === $currentProjectId);
      if (currentProject) {
        const response = await window.electronAPI.saveProject(currentProject);
        const index = $projects.findIndex((p) => p.id === $currentProjectId);

        if (!response.canceled) {
          $projects[index] = response.project;
          saveSession();
        }
      }
    });
  });

  async function onLoadProject(loadedProject: IProject) {
    loadedProject = processLoadedProject(loadedProject);
    const index = $projects.findIndex((p) => p.id === loadedProject.id);
    if (index === -1) {
      $projects = [...$projects, loadedProject];
    } else {
      if (loadedProject.filePath !== $projects[index].filePath) {
        loadedProject.id = uuid();
        console.warn(
          "Duplicated IDs found with different filePath. The ID of the loaded project was changed"
        );
        $projects = [...$projects, loadedProject];
      } else {
        if ($projects[index].state === "unsaved") {
          const res = await window.electronAPI.askQuestion({
            message: $_("messages.on_load_unsaved_loaded_project"),
            buttons: [$_("yes"), $_("cancel")],
            cancelID: 1,
          });
          if (res.response === 0) {
            $projects[index] = loadedProject;
          }
        } else {
          $projects[index] = loadedProject;
        }
      }
    }
    $currentProjectId = loadedProject.id;
  }

  async function openExistingProject() {
    let response = await window.electronAPI.loadProject();
  }
  function createNewProject() {
    newProject = true;
  }

  function closeProject(projectId) {
    if ($currentProjectId === projectId) {
      const index = $projects.findIndex((proj) => proj.id === projectId);
      if ($projects.length > 1) {
        if (index >= $projects.length - 1) {
          $currentProjectId = $projects[index - 1].id;
        } else {
          $currentProjectId = $projects[index + 1].id;
        }
      } else {
        $currentProjectId = null;
      }
    }
    $projects = $projects.filter((proj) => proj.id !== projectId);
    saveSession();
  }

  let newProject = false;
  let editProjectInfo = false;

  $: {
    if ($projects.length !== 0 && $currentProjectId === null) {
      $currentProjectId = $projects[0].id;
    }
  }

  function createHoverText(p) {
    if (p.filePath === "") {
      return $_("temp_file");
    }
    if (p.state === "saved") {
      return `${p.filePath} - ${$_("saved")}`;
    }
    return `${p.filePath} - ${$_("unsaved")}`;
  }
</script>

{#if newProject}
  <!-- <NewProject
    on:done={(event) => {
      if (event.detail) {
        $currentProjectId = event.detail.id;
      }
      newProject = false;
    }}
  /> -->
  <EditProjectInfo
    project={undefined}
    on:done={(event) => {
      if (event.detail) {
        const newProject = event.detail;
        $projects = [...$projects, newProject];
        $currentProjectId = newProject.id;
      }
      newProject = false;
    }}
  />
{/if}

<div class="projects">
  <div class="header">
    {#each $projects as p (p.id)}
      <button
        class="title"
        class:selected={p.id === $currentProjectId}
        on:click={() => {
          $currentProjectId = p.id;
        }}
        title={createHoverText(p)}
      >
        <span class="project-name">
          {p.name}
        </span>
        <span class="project-state">
          {#if p.filePath !== ""}
            {#if p.state === "saved"}
              <span class="icon-saved_file" />
            {:else}
              <span class="icon-unsaved_file" />
            {/if}
          {:else}
            <span class="icon-temp_file" />
          {/if}
          <!-- {p.state === "saved" ? "" : "*"} -->
        </span>
        <button
          class="icon close danger"
          on:click={async () => {
            if (p.state === "unsaved") {
              const res = await window.electronAPI.askQuestion({
                message: $_("messages.on_close_unsaved_project"),
                buttons: [$_("yes"), $_("no"), $_("cancel")],
                cancelID: 1,
              });
              if (res.response === 0) {
                const res = await window.electronAPI.saveProject(p);
                if (!res.canceled && res.success) {
                  closeProject(p.id);
                } else {
                  console.warn("Project not saved ");
                }
              } else if (res.response === 1) {
                closeProject(p.id);
              }
            } else {
              closeProject(p.id);
            }
          }}
        >
          <span class="maticons">close</span>
        </button>
      </button>
    {/each}
    {#if $projects.length !== 0}
      <button class="new primary" on:click={createNewProject}>
        <span class="maticons">add</span> <span>{$_("new_project")}</span>
      </button>
      <button class="open primary" on:click={openExistingProject}>
        <span class="maticons">file_open</span>
        <span>{$_("open_project")}</span>
      </button>
    {/if}
  </div>

  <div class="content">
    {#each $projects as p (p.id)}
      {#if p.id === $currentProjectId}
        <Project bind:project={p} />
      {/if}
    {:else}
      <div class="no-project">
        <div class="no-project-content">
          <div class="actions">
            <button class="primary" on:click={createNewProject}>
              <span class="maticons">add</span>
              <span>{$_("create_new_project")}</span>
            </button>
            <button class="primary" on:click={openExistingProject}>
              <span class="maticons">file_open</span>
              <span>{$_("open_existing_project")}</span>
            </button>
          </div>
          <!-- <div class="recent">
            <div class="label">Recently open files:</div>
            <div class="recent-files">...recent files...</div>
          </div> -->
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .no-project {
    position: absolute;
    top: 28px;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 10rem;
  }
  .no-project-content {
    display: grid;
    grid-template-columns: 100%;
    row-gap: 1rem;
  }
  .actions {
    display: grid;
    grid-template-columns: 100%;
    row-gap: 1rem;
  }

  button.title {
    position: relative;
    padding-right: 1.5rem;
  }
  button.title:hover > button.close {
    display: flex;
  }

  button.title:hover > .project-state {
    display: none;
  }

  button.close {
    /* margin-left: 0.5rem; */
    position: absolute;
    inset: 0 0 0 auto;
    display: none;
    align-items: center;
  }
  button.close > span {
    font-size: 1.2rem;
  }
  button.new > span.maticons {
    font-size: 1.2rem;
  }
  .projects {
    width: 100vw;
    height: calc(100vh - 28px);
    display: grid;
    grid-template-rows: min-content auto;
  }
  .header {
    display: flex;
  }
  .content {
    position: relative;
  }
  .selected {
    background-color: var(--bg-light);
  }

  .project-state {
    font-size: 1rem;
    position: absolute;
    inset: 0 0 0 auto;
    display: flex;
    align-items: center;
  }
  .icon-saved_file {
    color: var(--green);
  }
  .icon-unsaved_file {
    color: var(--red);
  }
  .icon-temp_file {
    color: var(--orange);
  }
</style>
