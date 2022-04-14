<script lang="ts">
  // import { project } from "../../stores";
  import Duration from "./Duration.svelte";
  import DateView from "./DateView.svelte";
  import type { ITimerLog } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let timerLogs: Array<ITimerLog>;
  // function deleteHistoryItem(id) {
  //   // $project.timerHistory = $project.timerHistory.filter((t) => t.id !== id);
  // }
</script>

<div class="container">
  {#each timerLogs as t, i (t.id)}
    <div class="history-item">
      <div class="start-date">
        <span>Start: </span><DateView date={t.startDateTime} />
      </div>
      <div class="end-date">
        <span>End: </span><DateView date={t.endDateTime} />
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
  }
  .history-item {
    display: grid;
    grid-template-columns: max-content auto max-content;
    grid-template-areas:
      "start duration actions"
      "end duration actions";
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
    font-weight: 200;
    font-size: 0.8rem;
    /* display: flex;
    align-items: center; */
    display: grid;
    grid-template-columns: 25px auto;
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
