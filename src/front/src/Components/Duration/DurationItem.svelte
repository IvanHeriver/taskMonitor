<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  const eventDispatcher = createEventDispatcher();
  import type { IDurationItem } from "../../types";
  import DateView from "../Timer/DateView.svelte";
  import Duration from "./Duration.svelte";
  import DurationSimpleInput from "./DurationSimpleInput.svelte";
  export let durationItem: IDurationItem;

  let editMode = false;
  let duration = durationItem.duration;
</script>

<div class="container">
  {#if editMode}
    <DurationSimpleInput bind:duration />
    <div class="actions">
      <button
        class="icon"
        on:click={() => {
          editMode = false;
          durationItem.duration = duration;
        }}><span class="maticons">done</span></button
      >
      <button
        class="icon"
        on:click={() => {
          editMode = false;
        }}><span class="maticons">close</span></button
      >
    </div>
  {:else}
    <div class="date"><DateView date={durationItem.date} /></div>
    <div class="duration"><Duration duration={durationItem.duration} /></div>
    <div class="actions">
      <button class="icon" on:click={() => (editMode = true)}
        ><span class="maticons">edit</span></button
      >
      <button
        class="icon danger"
        on:click={async () => {
          const res = await window.electronAPI.askQuestion({
            message: `Are you sure you want to delete this duration?`,
            buttons: ["Yes", "Cancel"],
            cancelID: 1,
          });
          console.log(res);
          if (res.response === 0) {
            eventDispatcher("delete");
          }
        }}><span class="maticons">delete_outline</span></button
      >
    </div>
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    outline: 1px solid var(--bg-xlight);
    padding: 0.125rem 0.25rem;
    background-color: var(--bg-light);
  }
  .date {
    font-size: 0.8rem;
    color: var(--fg-light);
  }
  .actions {
    display: flex;
    padding-left: 0.5rem;
  }
</style>
