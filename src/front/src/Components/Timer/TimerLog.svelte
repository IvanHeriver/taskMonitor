<script lang="ts">
  import { _ } from "svelte-i18n";
  import Duration from "../Duration/Duration.svelte";
  import DateView from "./DateView.svelte";
  import type { ITimerLog } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  import { draggedDurationItem } from "../../stores";
  import { uuid } from "../../utils";

  export let timerLogs: Array<ITimerLog>;
</script>

<svelte:window
  on:pointerup={() => {
    $draggedDurationItem = null;
  }}
/>

<div class="container">
  <ul>
    {#each timerLogs as t, i (t.id)}
      <li>
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
            <span>{$_("timer.start")}: </span><DateView
              date={t.startDateTime}
            />
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
      </li>
    {/each}
  </ul>
</div>

<style>
  .container {
    width: 100%;
    min-width: fit-content;
    margin: 0 auto;
    user-select: none;
    cursor: grab;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
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
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    padding: 0.125rem 0.25rem;
  }
  .history-item:hover {
    background-color: var(--bg-light);
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
