<script lang="ts">
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
  import NewProject from "./NewProject.svelte";
  import { onMount } from "svelte";
  import type { IProject } from "../types";
  // export let tabsInfo;
  // let currentProject: tmProject = null;

  onMount(() => {
    window.electronAPI.onLoadProject((loadedProjectInfo) => {
      console.log("loadedProjectInfo", loadedProjectInfo);
      if (!loadedProjectInfo.success) {
        console.warn("The file was not loaded");
        return;
      }
      onLoadProject(loadedProjectInfo.project);
    });
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

  function onLoadProject(loadedProject: IProject) {
    loadedProject = processLoadedProject(loadedProject);
    const index = $projects.findIndex((p) => p.id === loadedProject.id);
    if (index === -1) {
      $projects = [...$projects, loadedProject];
    } else {
      if (loadedProject.filePath !== $projects[index].filePath) {
        loadedProject.id = Math.random().toString().slice(2);
        console.warn(
          "Duplicated IDs found with different filePath. The ID of the loaded project was changed"
        );
        $projects = [...$projects, loadedProject];
      } else {
        if ($projects[index].state === "unsaved") {
          $question = {
            title: "Overwrite unsaved project?",
            question:
              "This file is already loaded with unsaved modification. Do you want to proceed and overwrite the unsaved version?",
            answer: (res) => {
              if (res) {
                $projects[index] = loadedProject;
              }
            },
          };
        } else {
          $projects[index] = loadedProject;
        }
      }
    }
    $currentProjectId = loadedProject.id;
  }

  async function openExistingProject() {
    let response = await window.electronAPI.loadProject();
    console.log(response);
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

  // let currentProjectId = null;
  let newProject = false;
  let editProjectInfo = false;

  $: {
    if ($projects.length !== 0 && $currentProjectId === null) {
      $currentProjectId = $projects[0].id;
    }
    console.log($projects);
  }
</script>

{#if newProject}
  <NewProject
    on:done={(event) => {
      if (event.detail) {
        $currentProjectId = event.detail.id;
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
        title={p.filePath}
      >
        <span class="project-name">
          {p.name}
        </span>
        <span class="project-state">
          {p.state === "saved" ? "" : "*"}
        </span>
        <button
          class="icon close danger"
          on:click={() => {
            if (p.state === "unsaved") {
              $question = {
                title: "Save modification?",
                question: "Do you want to save the modification?",
                answer: async (response) => {
                  if (response) {
                    const res = await window.electronAPI.saveProject(p);
                    if (!res.canceled && res.success) {
                      closeProject(p.id);
                    } else {
                      console.warn("Project not saved ");
                    }
                  } else {
                    closeProject(p.id);
                  }
                },
              };
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
        <span class="maticons">add</span> <span>New Project</span>
      </button>
      <button class="open primary" on:click={openExistingProject}>
        <span class="maticons">file_open</span> <span>Open Project</span>
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
              <span>Create a new project</span>
            </button>
            <button class="primary" on:click={openExistingProject}>
              <span class="maticons">file_open</span>
              <span>Open an existing project</span>
            </button>
          </div>
          <div class="recent">
            <!-- <div class="label">Recently open files:</div>
            <div class="recent-files">...recent files...</div> -->
          </div>
        </div>
      </div>
    {/each}
    <!-- {#if $project !== null}
      <Project />
    {/if} -->
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

  button.close {
    margin-left: 0.5rem;
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
  /* button {
    border: none;
  } */
  .selected {
    background-color: var(--bg-light);
  }
</style>
