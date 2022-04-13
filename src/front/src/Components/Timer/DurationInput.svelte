<script lang="ts">
  import type { ITimerLog } from "../../types";
  import DurationSimpleInput from "./DurationSimpleInput.svelte";

  // import { project } from "../../stores";
  // import DateView from "./DateView.svelte";
  // import Duration from "./Duration.svelte";
  import TimerLogDurationInput from "./TimerLogDurationInput.svelte";
  export let duration: number;
  export let unit: "minutes" | "hours" | "days" = "hours";
  export let timerLogs: Array<ITimerLog>;

  const unitName = Math.random().toString().slice(2);
  const unitFactors = { minutes: 1, hours: 60, days: 60 * 8 };

  let importedSelected = [];
  let importedDuration = 0;
  let durationMemory = null;
  // $: durationUnit = duration / unitFactors[unit];

  // $: {
  //   if (importedSelected.length !== 0) {
  //     if (durationMemory === null) {
  //       durationMemory = duration;
  //     }
  //     duration = importedDuration;
  //   } else {
  //     if (durationMemory !== null) {
  //       duration = durationMemory;
  //       durationMemory = null;
  //     }
  //   }
  // }
  // function applySelected() {
  //   if (importedSelected.length !== 0) {
  //     duration = importedDuration;
  //     durationMemory = null;
  //     importedSelected = [];
  //   }
  // }

  // function handleChange() {
  //   duration = durationUnit * unitFactors[unit];
  // }
</script>

<div class="container">
  <div class="custom">
    <DurationSimpleInput bind:duration bind:unit />
    <!-- {#if unit === "minutes"}
      <input
        type="number"
        name="duration"
        id="duration-m"
        bind:value={durationUnit}
        on:change={handleChange}
      />
    {:else if unit === "hours"}
      <input
        type="number"
        name="duration"
        id="duration-h"
        bind:value={durationUnit}
        on:change={handleChange}
      />
    {:else}
      <input
        type="number"
        name="duration"
        id="duration-d"
        bind:value={durationUnit}
        on:change={handleChange}
      />
    {/if}
    <div class="unit">
      <input
        type="radio"
        name={unitName}
        id={`${unitName}_minutes`}
        value="minutes"
        bind:group={unit}
      />
      <label for={`${unitName}_minutes`}>Minutes</label>
      <input
        type="radio"
        name={unitName}
        id={`${unitName}_hours`}
        value="hours"
        bind:group={unit}
      />
      <label for={`${unitName}_hours`}>Hours</label>
      <input
        type="radio"
        name={unitName}
        id={`${unitName}_days`}
        value="days"
        bind:group={unit}
      />
      <label for={`${unitName}_days`}>Work days</label>
    </div> -->
  </div>
  <div class="import">
    <TimerLogDurationInput
      bind:duration={importedDuration}
      bind:selected={importedSelected}
      bind:timerLogs
      on:apply={(event) => {
        const newDuration = event.detail;
        if (newDuration !== 0) {
          duration = newDuration;
        }
      }}
      on:add={(event) => {
        const newDuration = event.detail;
        duration += newDuration;
      }}
    />
  </div>
</div>

<style>
  .custom {
    width: 100%;
  }
  .import {
    margin-top: 0.25rem;
    position: relative;
    height: 10rem;
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    /* overflow: auto; */
  }
</style>
