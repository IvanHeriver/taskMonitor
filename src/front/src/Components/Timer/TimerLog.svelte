<script lang="ts">
  import { _ } from "svelte-i18n";
  import Duration from "../Duration/Duration.svelte";
  import DateView from "./DateView.svelte";
  import type { ITimerLog } from "../../types";
  import { createEventDispatcher, onMount } from "svelte";
  const eventDispatcher = createEventDispatcher();

  import { draggedDurationItem } from "../../stores";
  import { uuid } from "../../utils";

  export let timerLogs: Array<ITimerLog>;
  // function deleteHistoryItem(id) {
  //   // $project.timerHistory = $project.timerHistory.filter((t) => t.id !== id);
  // }
</script>

<svelte:window
  on:pointerup={() => {
    $draggedDurationItem = null;
  }}
/>

<div class="container">
  {#each timerLogs as t, i (t.id)}
    <div
      class="history-item"
      on:pointerdown={() => {
        $draggedDurationItem = {
          id: uuid(),
          duration: t.duration,
          date: t.endDateTime,
        };
      }}
    >
      <div class="handle"><span class="maticons">drag_indicator</span></div>
      <div class="start-date">
        <span>{$_("timer.start")}: </span><DateView date={t.startDateTime} />
      </div>
      <div class="end-date">
        <span>{$_("timer.end")}: </span><DateView date={t.endDateTime} />
      </div>
      <div class="duration">
        <Duration duration={t.duration} />
      </div>
      <div class="actions">
        <button
          class="icon danger"
          on:click={() => eventDispatcher("delete", t.id)}
        >
          <span class="maticons">delete_outline</span>
        </button>
      </div>
    </div>
  {/each}
</div>

<style>
  .container {
    width: 100%;
    min-width: fit-content;
    margin: 0 auto;
    user-select: none;
    cursor: grab;
  }
  .handle {
    display: flex;
    grid-area: drag;
    justify-content: center;
    align-items: center;
    color: var(--fg-xxlight);
  }
  .handle .maticons {
    font-size: 2rem;
  }
  .history-item {
    display: grid;
    grid-template-columns: 1rem max-content auto max-content;
    grid-template-areas:
      "drag start duration actions"
      "drag end duration actions";
    column-gap: 0.5rem;
    align-items: center;
    /* justify-items: center; */
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    margin-top: 0.25rem;
    padding-left: 0.25rem;
  }
  .history-item:first-child {
    margin-top: 0;
  }
  .start-date,
  .end-date {
    color: var(--fg-xlight);
    font-size: 0.8rem;
    display: grid;
    grid-template-columns: 50px auto;
  }
  .start-date {
    grid-area: start;
  }
  .end-date {
    grid-area: end;
  }
  .duration {
    display: flex;
    justify-content: flex-end;
    grid-area: duration;
  }
  .actions {
    grid-area: actions;
  }
</style>
