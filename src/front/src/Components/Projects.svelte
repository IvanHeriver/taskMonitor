<script lang="ts">
  import { projects, currentProjectId, question, saveSession } from "../stores";
  // import type { tmProject } from "../types";
  import Project from "./Project.svelte";
  import NewProject from "./NewProject.svelte";
  import { onMount } from "svelte";
  // export let tabsInfo;
  // let currentProject: tmProject = null;

  onMount(() => {
    window.electronAPI.onLoadProject((loadedProject) => {
      if (!loadedProject.success) {
        console.error("Cannot open file!");
        return;
      }
      const index = $projects.findIndex(
        (p) => p.id === loadedProject.project.id
      );
      if (index === -1) {
        $projects = [...$projects, loadedProject.project];
      } else {
        if (loadedProject.project.filePath !== $projects[index].filePath) {
          loadedProject.project.id = Math.random().toString().slice(2);
          console.warn(
            "Duplicated IDs found with different filePath. The ID of the loaded project was changed"
          );
          $projects = [...$projects, loadedProject.project];
        } else {
          if ($projects[index].state === "unsaved") {
            $question = {
              title: "Overwrite unsaved project?",
              question:
                "This file is already loaded with unsaved modification. Do you want to proceed and overwrite the unsaved version?",
              answer: (res) => {
                if (res) {
                  $projects[index] = loadedProject.project;
                }
              },
            };
          } else {
            $projects[index] = loadedProject.project;
          }
        }
      }
      $currentProjectId = loadedProject.project.id;
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
    <button class="new" on:click={createNewProject}>
      <span class="maticons">add</span> <span>New Project</span></button
    >
  </div>
  <div class="content">
    {#each $projects as p (p.id)}
      {#if p.id === $currentProjectId}
        <Project bind:project={p} />
      {/if}
    {:else}
      <div class="no-project">No project</div>
    {/each}
    <!-- {#if $project !== null}
      <Project />
    {/if} -->
  </div>
</div>

<style>
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
  /* button {
    border: none;
  } */
  .selected {
    background-color: var(--bg-light);
  }
</style>
