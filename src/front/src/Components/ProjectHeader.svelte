<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { IProject } from "../types";
  import Duration from "./Duration/Duration.svelte";
  import DurationSimpleInput from "./Duration/DurationSimpleInput.svelte";
  import EditProjectInfo from "./EditProjectInfo.svelte";

  export let project: IProject;

  $: spent = project.tasks.reduce(
    (a, t) => a + t.duration.reduce((b, d) => b + d.duration, 0),
    0
  );
  $: remaining = project.stats.allocatedDuration - spent;

  $: {
    console.log(
      "project.stats.allocatedDuration",
      project.stats.allocatedDuration
    );
    console.log("remaining", remaining);
  }
  let editAllocated = false;
  let editProjectInfo = false;
</script>

{#if editProjectInfo}
  <EditProjectInfo
    bind:project
    on:done={(_) => {
      editProjectInfo = false;
    }}
  />
{/if}
<div class="container">
  <div class="info">
    <div class="name" title={project.description}>
      {project.name}
    </div>
    {#if editProjectInfo}
      <button
        class="btn icon"
        on:click={() => {
          editProjectInfo = false;
        }}
      >
        <span class="maticons">save</span>
        <span class="text">{$_("save")}</span>
      </button>
    {:else}
      <button
        class="btn icon"
        on:click={() => {
          editProjectInfo = true;
        }}
      >
        <span class="maticons">edit</span>
        <span class="text">{$_("edit")}</span>
      </button>
    {/if}
    <!-- <div class="desc">{project.description}</div> -->
  </div>
  <div class="stats">
    <div class="allocated">
      <div class="alloc">
        {#if !editAllocated}
          <div class="label">{$_("time_allocated")}:</div>
        {/if}
        <div class="duration">
          {#if editAllocated}
            <DurationSimpleInput
              bind:duration={project.stats.allocatedDuration}
              autofocus={true}
            />
          {:else}
            <Duration bind:duration={project.stats.allocatedDuration} />
          {/if}
        </div>
      </div>
      {#if editAllocated}
        <button
          class="btn icon"
          on:click={() => {
            editAllocated = false;
          }}
        >
          <span class="maticons">save</span>
          <span class="text">{$_("save")}</span>
        </button>
      {:else}
        <button
          class="btn icon"
          on:click={() => {
            editAllocated = true;
          }}
        >
          <span class="maticons">edit</span>
          <span class="text">{$_("edit")}</span>
        </button>
      {/if}
    </div>
    <div class="spent">
      <div>{$_("time_spent")}:</div>
      <Duration bind:duration={spent} />
    </div>
    <div class="remaining">
      <div>{$_("time_remaining")}:</div>
      <Duration bind:duration={remaining} />
    </div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: minmax(min-content, 25%) auto;
    border-bottom: 1px solid var(--fg-xxlight);
    height: var(--header-size);
    overflow: hidden;
  }
  .stats {
    /* display: flex; */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    user-select: none;
  }
  .stats > * {
    padding: 0 1rem;
    border-right: 1px solid var(--bg-xlight);
  }
  .stats > *:first-child {
    border-left: 1px solid var(--bg-xlight);
  }
  .spent,
  .remaining {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .info {
    padding: 0.25rem 1rem;
    /* overflow: auto; */
    /* height: var(--header-size); */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .name {
    font-weight: 600;
    width: 100%;
    color: var(--fg-strong);
    font-size: 1.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .allocated {
    display: flex;
    justify-content: space-between;
  }
  .alloc {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .btn {
    margin-left: 1rem;
  }
  .maticons {
    font-size: 1.5rem;
  }
  .text {
    padding: 0 0.25rem;
  }
</style>
