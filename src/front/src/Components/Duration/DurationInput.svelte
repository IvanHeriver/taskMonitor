<script lang="ts">
  import { uuid } from "../../utils";
  import type { IDurationItem, ITimerLog } from "../../types";
  import DurationSimpleInput from "./DurationSimpleInput.svelte";
  import { draggedDurationItem } from "../../stores";

  import DateView from "../Timer/DateView.svelte";
  import Duration from "./Duration.svelte";
  import DurationItem from "./DurationItem.svelte";

  export let durationItems: Array<IDurationItem>;
  export let timerLogs: Array<ITimerLog>;

  let importDurationOpened = false;
  let newDuration = 0;
  let highlightDurationInput = false;
</script>

<div class="container">
  <div class="new-duration">
    <label for="new-duration-input-widget">Add a duration:</label>
    <div class="simple" id="new-duration-input-widget">
      <DurationSimpleInput bind:duration={newDuration} />
      <div class="new-duration-actions">
        <button
          on:click={() => (importDurationOpened = !importDurationOpened)}
          class="secondary"
        >
          <span class="maticons">
            {importDurationOpened ? "expand_less" : "expand_more"}
          </span>
          <span> Import </span>
        </button>
        <button
          on:click={() => {
            const durationDate = new Date().toISOString();
            durationItems = [
              { id: uuid(), date: durationDate, duration: newDuration },
              ...durationItems,
            ];
          }}
          class="primary"
        >
          <span class="maticons">done</span>
          <span> Add </span>
        </button>
      </div>
    </div>
    {#if importDurationOpened}
      <div class="import">
        {#each timerLogs as timerLog}
          <div class="timer-log">
            <div class="left">
              <div class="date"><DateView date={timerLog.endDateTime} /></div>
              <div class="duration">
                <Duration duration={timerLog.duration} />
              </div>
            </div>

            <button
              on:click={() => {
                newDuration = timerLog.duration;
              }}
            >
              <span class="maticons">upload</span>
              <span> Use this duration </span>
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  <!-- {/if} -->
  <div
    class="existing-durations"
    class:target={$draggedDurationItem !== null}
    on:pointerup={() => {
      console.log("UP HERE");
      if ($draggedDurationItem !== null) {
        durationItems = [$draggedDurationItem, ...durationItems];
      }
    }}
  >
    <div class="label">
      Durations: <p>(You can drag and drop durations from the timer panel)</p>
    </div>
    {#each durationItems as durationItem, i (durationItem.id)}
      <DurationItem
        bind:durationItem
        on:delete={() => {
          durationItems = [
            ...durationItems.slice(0, i),
            ...durationItems.slice(i + 1),
          ];
        }}
      />
    {:else}
      <p>There's no duration for this task</p>
    {/each}
  </div>
</div>

<style>
  label,
  div.label {
    color: var(--fg-xlight);
    font-size: 0.9rem;
    display: flex;
  }
  div.label p {
    padding-left: 0.5rem;
    margin: 0;
  }
  .existing-durations {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    max-height: 10rem;
    overflow-y: auto;
    outline: 1px solid var(--bg-xlight);
    min-height: 5rem;
  }
  .existing-durations.target {
    background-color: var(--bg-light);
  }
  .existing-durations.target:hover {
    background-color: var(--bg-xlight);
  }
  .existing-durations p {
    font-size: 0.9rem;
    color: var(--fg-xlight);
    font-style: italic;
    margin: auto;
  }
  .container {
    /* margin-top: 0.25rem; */
    /* position: relative; */
    /* min-height: 10rem; */
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    /* padding: 0.25rem; */
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .new-duration {
    outline: 1px solid var(--bg-light);
    /* margin: 0.5rem; */
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .new-duration .simple {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .new-duration-actions {
    padding-top: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .new-duration .import {
    position: relative;
    /* margin: 0.25rem 0; */
    background-color: var(--bg);
    outline: 1px solid var(--bg-light);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    max-height: 7rem;
    overflow-y: auto;
  }

  .timer-log {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--bg-light);
    outline: 1px solid var(--bg-xlight);
  }
  .timer-log .left {
    display: flex;
    align-items: center;
  }
  .timer-log .date {
    color: var(--fg-light);
    font-size: 0.8rem;
  }
  .timer-log button {
    padding: 0 0.25rem;
    background-color: transparent;
  }
  button {
    padding: 0 0.25rem;
    display: flex;
    align-items: center;
  }
  button .maticons {
    font-size: 0.9rem;
    padding: 0.25rem 0.25rem 0 0.25rem;
  }
</style>
