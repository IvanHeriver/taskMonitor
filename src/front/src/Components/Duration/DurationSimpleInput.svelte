<script lang="ts">
  import { onMount } from "svelte";
  import { uuid } from "../../utils";

  export let duration: number;
  export let autofocus: boolean = false;

  const id = uuid();

  let d, h, m, s;
  function updateDHMS() {
    s = duration * 60;
    d = Math.floor(s / 60 / 60 / 8);
    s -= d * 60 * 60 * 8;
    h = Math.floor(s / 60 / 60);
    s -= h * 60 * 60;
    m = Math.floor(s / 60);
    s -= m * 60;
    s = Math.round(s);
  }
  function updateDuration() {
    if (d === 0 && h === -1) {
      h = 0;
    } else if (d === 0 && h === 0 && m === -1) {
      m = 0;
    }
    let newDuration = s / 60 + m + h * 60 + d * 60 * 8;
    console.log(newDuration);
    if (newDuration <= 0) {
      duration = 0;
      d = 0;
      h = 0;
      m = 0;
      s = 0;
    } else {
      duration = newDuration;
    }
    duration = newDuration < 0 ? 0 : newDuration;
  }
  onMount(() => {
    if (autofocus) {
      firstElement.focus();
    }
  });
  $: {
    duration;
    updateDHMS();
  }
  let firstElement;
</script>

<div class="container">
  <label for={`days_${id}`}>Work days</label>
  <span />
  <label for={`hours_${id}`}>Hours</label>
  <span />
  <label for={`minutes_${id}`}>Minutes</label>
  <span />
  <label for={`seconds_${id}`}>Seconds</label>
  <input
    type="number"
    name="days"
    id={`days_${id}`}
    min="0"
    step="1"
    bind:value={d}
    on:input={updateDuration}
    bind:this={firstElement}
  />
  <span class="text" />
  <input
    type="number"
    name="hours"
    id={`hours_${id}`}
    min="-1"
    step="1"
    max="8"
    bind:value={h}
    on:input={updateDuration}
  />
  <span class="unit">:</span>
  <input
    type="number"
    name="minutes"
    id={`minutes_${id}`}
    min="-1"
    step="1"
    max="60"
    bind:value={m}
    on:input={updateDuration}
  />
  <span class="unit light">:</span>
  <input
    type="number"
    class="light"
    name="seconds"
    id={`seconds_${id}`}
    min="-1"
    step="1"
    max="60"
    bind:value={s}
    on:input={updateDuration}
  />
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: 1fr max-content 1fr max-content 1fr max-content 1fr;
    column-gap: 0.25rem;
  }

  input[type="number"] {
    width: 100%;
    min-width: 4rem;
  }
  .unit {
    display: flex;
  }
  .text {
    white-space: nowrap;
    font-size: 0.9rem;
  }
  label {
    white-space: nowrap;
    font-size: 0.8rem;
    color: var(--fg-xlight);
  }
</style>
