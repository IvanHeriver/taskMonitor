<script lang="ts">
  import sectionResizer from "@ivanheriver/section-resizer";
  import Tasks from "./Task/Tasks.svelte";
  import Tags from "./Tag/Tags.svelte";
  import Timer from "./Timer/Timer.svelte";
  import { onMount } from "svelte";
  import { project } from "../stores";
  // export let project;

  onMount(() => {
    // projectElementResizer = sectionResizer(projectElement, {
    //   mode: "vertical",
    // });
    // projectElementResizer.configure([{ index: 0, min: 25, max: 300 }]);
    // projectElementResizer.resize([{ index: 1, size: 10000 }]);
    mainElementResizer = sectionResizer(mainElement, {
      mode: "horizontal",
    });
    mainElementResizer.configure({ min: 200 });
    mainElementResizer.resize([{ index: 0, size: 800 }]);
  });

  let taskPanel = true;
  let tagPanel = true;
  let timerPanel = true;

  // let projectElement, projectElementResizer;
  let mainElement, mainElementResizer;
</script>

<!-- <div class="project" bind:this={projectElement}> -->
<div class="project">
  <div class="info">
    <div class="name">
      {$project.name}
    </div>
    <div class="desc">{$project.description}</div>
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
        <div><Tasks /></div>
      {/if}
      {#if tagPanel}
        <div><Tags /></div>
      {/if}
      {#if timerPanel}
        <div><Timer /></div>
      {/if}
    </div>
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
    --header-size: 75px;
  }
  .content {
    display: grid;
    grid-template-columns: 50px auto;
    background-color: var(--bg);
    height: calc(100% - var(--header-size));
  }
  .main > div {
    overflow: auto;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--fg-xxlight);
    background-color: var(--bg-light);
  }
  .info {
    padding: 1rem;
    overflow: auto;
    height: var(--header-size);
    border-bottom: 1px solid var(--fg-xxlight);
  }
  .name {
    font-weight: 900;
  }
  .selected {
    background-color: var(--bg-xxlight);
  }
  .selected:hover,
  .selected:focus {
    background-color: var(--bg-xlight);
  }
</style>
