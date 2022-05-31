<script lang="ts">
  import { _ } from "svelte-i18n";
  // import sectionResizer from "@ivanheriver/section-resizer";
  // import Stats from "./Stats/Stats.svelte";
  // import Tasks from "./Task/Tasks.svelte";
  // import Tags from "./Tag/Tags.svelte";
  // import Timer from "./Timer/Timer.svelte";
  // import Todos from "./Todo/Todos.svelte";
  // import { onMount } from "svelte";
  import ProjectHeader from "./ProjectHeader.svelte";
  import ProjectSection from "./ProjectSection.svelte";
  import type { IProjectLayout } from "../types";
  // import { project } from "../stores";
  export let project;

  // let mainElement, mainElementResizer;
  // let secondaryElement, secondaryElementResizer;
  // let terciaryElement, terciaryElementResizer;
  // let utilsElement, utilsElementResizer;

  // let elements, elementResizers;

  let projectLayout: IProjectLayout = {
    orientation: "vertical",
    elements: [
      {
        orientation: "horizontal",
        elements: [
          { element: "tasks" },
          {
            orientation: "vertical",
            elements: [
              { element: "timer" },
              { element: "todos" },
              { element: "tags" },
            ],
            size: 500,
          },
        ],
      },
      { element: "stats", size: 200 },
    ],
  };

  //   $: {
  // projectLayout = {
  //     orientation: "vertical",
  //     elements: []
  //   };
  //   let elements = []
  //   if (project.ui.taskPanelOpen || project.ui.timerPanelOpen || project.ui.todoPanelOpen || project.ui.tagPanelOpen) {
  //     let upperLayout: IProjectLayout = {
  //       orientation: "horizontal",
  //       elements: []
  //     }
  //     let upperElements = []
  //     if (project.ui.taskPanelOpen) {
  //       upperElements = [...upperElements, {element: "tasks"}]
  //     }
  //     if (project.ui.timerPanelOpen || project.ui.todoPanelOpen || project.ui.tagPanelOpen) {
  //       if (project.ui.timerPanelOpen)
  //     }
  //     elements = [...elements, upperLayout]
  //   }
  //   }

  // $: {
  //   if (mainElement) {
  //     mainElementResizer = sectionResizer(mainElement, {
  //       mode: "horizontal",
  //     });
  //     mainElementResizer.configure({ min: 200 });
  //     // mainElementResizer.resize([{ index: 0, size: 400 }]);
  //   }
  // }
  // $: {
  //   if (secondaryElement) {
  //     secondaryElementResizer = sectionResizer(secondaryElement, {
  //       mode: "vertical",
  //     });
  //     secondaryElementResizer.resize([{ index: 0, size: 100 }]);
  //   }
  // }
  // $: {
  //   if (terciaryElement) {
  //     terciaryElementResizer = sectionResizer(terciaryElement, {
  //       mode: "horizontal",
  //     });
  //   }
  // }
  // $: {
  //   if (utilsElement) {
  //     utilsElementResizer = sectionResizer(utilsElement, {
  //       mode: "vertical",
  //     });
  //   }
  // }
</script>

<div class="project">
  <ProjectHeader bind:project />
  <div class="content">
    <div class="sidebar">
      <button
        class="icon"
        class:selected={project.ui.taskPanelOpen}
        on:click={() => (project.ui.taskPanelOpen = !project.ui.taskPanelOpen)}
        title={$_("tooltips.toggle_task_panel")}
      >
        <span class="maticons">assignment_turned_in</span>
      </button>
      <button
        class="icon"
        class:selected={project.ui.tagPanelOpen}
        on:click={() => (project.ui.tagPanelOpen = !project.ui.tagPanelOpen)}
        title={$_("tooltips.toggle_tag_panel")}
        ><span class="maticons">local_offer</span></button
      >
      <button
        class="icon"
        class:selected={project.ui.timerPanelOpen}
        on:click={() =>
          (project.ui.timerPanelOpen = !project.ui.timerPanelOpen)}
        title={$_("tooltips.toggle_timer_panel")}
        ><span class="maticons">timer</span></button
      >
      <button
        class="icon"
        class:selected={project.ui.todoPanelOpen}
        on:click={() => (project.ui.todoPanelOpen = !project.ui.todoPanelOpen)}
        title={$_("tooltips.toggle_todo_panel")}
        ><span class="maticons">checklist</span></button
      >
      <button
        class="icon"
        class:selected={project.ui.statPanelOpen}
        on:click={() => (project.ui.statPanelOpen = !project.ui.statPanelOpen)}
        title={$_("tooltips.toggle_stat_panel")}
        ><span class="maticons">bar_chart</span></button
      >
    </div>
    <ProjectSection bind:project bind:layout={projectLayout} />
    <!-- <div class="main" bind:this={mainElement}>
      {#if project.ui.taskPanelOpen}
        <div><Tasks bind:project /></div>
      {/if}
      {#if project.ui.tagPanelOpen || project.ui.timerPanelOpen || project.ui.statPanelOpen || project.ui.todoPanelOpen}
        <div class="secondary" bind:this={secondaryElement}>
          {#if project.ui.statPanelOpen}
            <div><Stats bind:project /></div>
          {/if}
          {#if project.ui.tagPanelOpen || project.ui.timerPanelOpen || project.ui.todoPanelOpen}
            <div class="tags-utils" bind:this={terciaryElement}>
              {#if project.ui.tagPanelOpen}
                <div><Tags bind:project /></div>
              {/if}
              {#if project.ui.timerPanelOpen || project.ui.todoPanelOpen}
                <div class="utils" bind:this={utilsElement}>
                  {#if project.ui.timerPanelOpen}
                    <div><Timer bind:project /></div>
                  {/if}
                  {#if project.ui.todoPanelOpen}
                    <div>
                      <Todos bind:project />
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div> -->
  </div>
</div>

<style>
  .project {
    background-color: var(--bg-light);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    --header-size: 3.5rem;
  }
  /* .stats {
    display: flex;
    justify-content: center;
    align-items: center;
  } */
  .content {
    display: grid;
    grid-template-columns: 50px auto;
    background-color: var(--bg);
    height: calc(100% - var(--header-size));
  }
  /* .main > div {
    overflow: auto;
  } */
  .sidebar {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--fg-xxlight);
    background-color: var(--bg-light);
    padding: 0.5rem;
  }

  button {
    padding: 0.25rem 0;
    color: var(--fg-xxlight);
  }
  .selected {
    color: var(--fg);
  }
  button:hover {
    color: var(--fg-xstrong);
  }
  .selected:focus {
    outline: 1px solid var(--fg-xstrong);
    outline-offset: -1px;
  }
</style>
