<script lang="ts">
  import sectionResizer from "@ivanheriver/section-resizer";
  import Tasks from "./Task/Tasks.svelte";
  import Tags from "./Tags.svelte";
  import Timer from "./Timer.svelte";
  import { onMount } from "svelte";
  export let project;

  onMount(() => {
    projectElementResizer = sectionResizer(projectElement, {
      mode: "vertical",
    });
    projectElementResizer.configure([{ index: 0, min: 25, max: 300 }]);
    projectElementResizer.resize([{ index: 1, size: 10000 }]);
    mainElementResizer = sectionResizer(mainElement, {
      mode: "horizontal",
    });
    mainElementResizer.configure({ min: 200 });
  });
  let taskPanel = true;
  let tagPanel = true;
  let timerPanel = true;

  let projectElement, projectElementResizer;
  let mainElement, mainElementResizer;
</script>

<div class="project" bind:this={projectElement}>
  <div class="info">
    <div class="name">
      {project.name}
    </div>
    <div class="desc">{project.description}</div>
  </div>
  <div class="content">
    <div class="sidebar">
      <button
        class:selected={taskPanel}
        on:click={() => (taskPanel = !taskPanel)}>task</button
      >
      <button class:selected={tagPanel} on:click={() => (tagPanel = !tagPanel)}
        >tag</button
      >
      <button
        class:selected={timerPanel}
        on:click={() => (timerPanel = !timerPanel)}>timer</button
      >
    </div>
    <div class="main" bind:this={mainElement}>
      {#if taskPanel}
        <Tasks {project} />
      {/if}
      {#if tagPanel}
        <Tags />
      {/if}
      {#if timerPanel}
        <Timer />
      {/if}
    </div>
  </div>
</div>

<style>
  .project {
    background-color: var(--btn-background-selected);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .content {
    display: grid;
    grid-template-columns: 50px auto;
    background-color: var(--background-color);
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--outline-color);
    background-color: var(--btn-background-selected);
  }
  .info {
    padding: 1rem;
    overflow: auto;
  }
  .name {
    font-weight: 900;
  }
  .selected {
    background-color: var(--btn-background-selected);
  }
  .selected:hover,
  .selected:focus {
    background-color: var(--btn-background-highlight);
  }
</style>
