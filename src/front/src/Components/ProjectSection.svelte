<script lang="ts">
  import { onMount } from "svelte";
  import type { IProject } from "../types";
  import sectionResizer from "@ivanheriver/section-resizer";
  import Stats from "./Stats/Stats.svelte";
  import Tasks from "./Task/Tasks.svelte";
  import Tags from "./Tag/Tags.svelte";
  import Timer from "./Timer/Timer.svelte";
  import Todos from "./Todo/Todos.svelte";
  import ProjectSection from "./ProjectSection.svelte";
  import type { IProjectLayout } from "../types";
  export let project: IProject;
  export let layout: IProjectLayout;

  let resizer, element;

  onMount(() => {
    resizer = sectionResizer(element, {
      mode: layout.orientation,
    });
    layout.elements.forEach((e, i) => {
      if (e.minSize !== undefined) {
        console.log(e.minSize);
        resizer.configure({ index: i, min: e.minSize });
      }
      if (e.size !== undefined) {
        resizer.resize([{ index: i, size: e.size }]);
      }
    });
  });
</script>

<div class="section" bind:this={element}>
  {#each layout.elements as element}
    {#if element.element !== undefined}
      {#if element.element === "tasks"}
        {#if project.ui.taskPanelOpen}
          <Tasks bind:project />
        {/if}
      {:else if element.element === "stats"}
        {#if project.ui.statPanelOpen}
          <Stats bind:project />
        {/if}
      {:else if element.element === "tags"}
        {#if project.ui.tagPanelOpen}
          <Tags bind:project />
        {/if}
      {:else if element.element === "timer"}
        {#if project.ui.timerPanelOpen}
          <Timer bind:project />
        {/if}
      {:else if element.element === "todos"}
        {#if project.ui.todoPanelOpen}
          <Todos bind:project />
        {/if}
      {:else}
        <div />
      {/if}
    {:else}
      <ProjectSection bind:project layout={element} />
    {/if}
  {/each}
</div>

<style>
</style>
