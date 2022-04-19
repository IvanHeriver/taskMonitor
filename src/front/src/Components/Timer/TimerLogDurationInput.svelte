<script lang="ts">
  import Duration from "./Duration.svelte";
  import DateView from "./DateView.svelte";
  import type { ITimerLog } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let duration: number;
  export let selected: Array<ITimerLog>;
  export let timerLogs: Array<ITimerLog>;

  const id = Math.random().toString().slice(2);

  function handleSelectionChange(target, currentId) {
    if (selected.find((s) => s.id === currentId)) {
      selected = selected.filter((s) => s.id !== currentId);
    } else {
      selected = [...selected, timerLogs.find((h) => h.id === currentId)];
    }
    duration = selected.map((s) => s.duration).reduce((a, c) => a + c, 0);
  }

  function applySelected() {
    eventDispatcher("apply", duration);
  }
  function addSelected() {
    eventDispatcher("add", duration);
  }
</script>

<div class="container">
  <div class="header">
    <div class="label">Select timer records to use their duration:</div>
    <div class="actions">
      <button on:click={applySelected}>
        <span class="maticons">arrow_upward</span><span>Apply</span>
      </button>
      <button on:click={addSelected}>
        <span class="maticons">add</span><span>Add</span>
      </button>
    </div>
  </div>

  <div class="records">
    {#each timerLogs as t (t.id)}
      <div class="history-item">
        <input
          type="checkbox"
          name={t.id}
          id={`${id}${t.id}`}
          on:change={(e) => handleSelectionChange(e.target, t.id)}
        />
        <label for={`${id}${t.id}`} />

        <div class="start-date">
          <DateView date={t.startDateTime} />
        </div>
        <div class="end-date">
          <DateView date={t.endDateTime} />
        </div>
        <div class="duration">
          <Duration duration={t.duration} />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .container {
    width: 100%;
    min-width: fit-content;
    user-select: none;
  }

  .header {
    height: 1.5rem;
    padding: 0 0.25rem;
    padding-top: 1px;
    /* font-weight: 200; */
    background-color: var(--bg-light);
  }
  .records {
    position: absolute;
    top: 1.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;

    padding: 0.5rem;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }
  .label {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .actions {
    display: flex;
  }
  .actions > button {
    display: flex;
    justify-content: center;
    align-items: center;
    /* font-weight: 200; */
    background-color: transparent;
  }
  .actions > button:hover {
    color: var(--fg-xstrong);
  }
  .actions > button:focus {
    outline: 1px solid var(--fg-xstrong);
    outline-offset: -1px;
  }
  .actions > button > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    line-height: 1;
  }

  .history-item {
    display: grid;

    justify-items: center;
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    margin-top: 0.25rem;

    padding-right: 0.125rem;
    grid-template-columns: 2rem 1fr 1fr 1fr;
  }
  .history-item:first-child {
    margin-top: 0;
  }
  .start-date,
  .end-date {
    /* font-weight: 200; */
    font-size: 0.8rem;
    display: flex;
    align-items: center;
  }
  .duration {
    display: flex;
    justify-content: flex-end;
  }
</style>
