<script lang="ts">
  type unit = "days" | "hours" | "minutes" | "auto" | "seconds";
  export let duration: number;
  export let unit: unit = "auto";

  const units: Array<unit> = ["auto", "seconds", "minutes", "hours", "days"];

  let unit_index = units.findIndex((u) => u === unit);

  $: seconds = duration * 60;
  $: minutes = duration;
  $: hours = duration / 60;
  $: days = duration / 60 / 8;

  $: best = "days";
  $: {
    if (Math.abs(days) < 1) {
      if (Math.abs(hours) < 1) {
        if (Math.abs(minutes) < 1) {
          best = "seconds";
        } else {
          best = "minutes";
        }
      } else {
        best = "hours";
      }
    }
    // console.log("best", best);
    // console.log("seconds", seconds);
    // console.log("minutes", minutes);
    // console.log("hours", hours);
    // console.log("days", days);
  }
</script>

<div
  class="container"
  on:click={() => {
    unit_index++;
    if (unit_index >= units.length) unit_index = 0;
    unit = units[unit_index];
  }}
  title={`Click to change the time unit`}
>
  {#if unit === "seconds" || (unit === "auto" && best === "seconds")}
    <span class="value">{seconds.toFixed(2)}</span>
    <span class="unit">seconds</span>
  {:else if unit === "minutes" || (unit === "auto" && best === "minutes")}
    <span class="value">{minutes.toFixed(2)}</span>
    <span class="unit">minutes</span>
  {:else if unit === "hours" || (unit === "auto" && best === "hours")}
    <span class="value">{hours.toFixed(2)}</span>
    <span class="unit">hours</span>
  {:else if unit === "days" || (unit === "auto" && best === "days")}
    <span class="value">{days.toFixed(2)}</span>
    <span class="unit">work days</span>
  {/if}
</div>

<style>
  .container {
    display: flex;
    cursor: pointer;
  }
  .unit,
  .value {
    padding: 0 0.125rem;
  }
  .value {
    font-weight: 800;
  }
</style>
