<script lang="ts">
  export let duration: number;
  export let unit: "minutes" | "hours" | "days" = "hours";

  const unitName = Math.random().toString().slice(2);
  const unitFactors = { minutes: 1, hours: 60, days: 60 * 8 };

  $: durationUnit = duration / unitFactors[unit];

  function handleChange() {
    duration = durationUnit * unitFactors[unit];
  }
  function round() {
    durationUnit = Math.round(durationUnit);
    handleChange();
  }
</script>

<div class="container">
  {#if unit === "minutes"}
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
  </div>
  <div class="actions">
    <button class="small" on:click={round}>
      <span>Round</span>
    </button>
  </div>
</div>

<style>
  .container {
    display: flex;
  }
  input[type="number"] {
    width: 100%;
    min-width: 4rem;
    margin-right: 0.5rem;
  }
  .unit {
    display: flex;
  }
  label {
    white-space: nowrap;
  }
  .actions {
    margin-left: 0.5rem;
  }
</style>
