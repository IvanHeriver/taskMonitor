<script lang="ts">
  import { _ } from "svelte-i18n";
  // type unit = "days" | "hours" | "minutes" | "auto" | "seconds";
  export let duration: number;
  export let showSeconds: boolean = true;
  export let small: boolean = false;
  // export let unit: unit = "auto";

  // const units: Array<unit> = ["auto", "seconds", "minutes", "hours", "days"];

  // let unit_index = units.findIndex((u) => u === unit);

  // $: seconds = duration * 60;
  // $: minutes = duration;
  // $: hours = duration / 60;
  // $: days = duration / 60 / 8;
  // $: best = "days";
  let mode: "days" | "hours";
  let sign;
  $: {
    duration = Math.round(duration * 60) / 60;
    sign = Math.sign(duration);
    duration = Math.abs(duration);
  }
  $: {
    // console.log("*************");
    // console.log(sign);
    // console.log(duration);
    // console.log(duration / 60 / 8);
    // console.log(duration / 60 / 8 > 3);
    if (duration / 60 / 8 > 3) {
      mode = "days";
    } else {
      mode = "hours";
    }
    // console.log(mode);
  }
  let d, h, m, s;
  $: {
    s = duration * 60;
    h = Math.floor(s / 60 / 60);
    s -= h * 60 * 60;
    m = Math.floor(s / 60);
    s -= m * 60;
    d = duration / 60 / 8;
    s = Math.round(s);
  }
</script>

<div class="container" class:small>
  <span class="maticons">timer</span>
  {#if sign === -1}
    -
  {/if}
  {#if mode === "days"}
    <span class="value">{d.toFixed(2)}</span>
    <span class="unit text light">{$_("duration.work_days")}</span>
  {:else}
    <span class="value">{h.toString().padStart(2, "0")}</span>
    <span class="unit">:</span>
    <span class="value">{m.toString().padStart(2, "0")}</span>
    {#if showSeconds}
      <span class="unit light">:</span>
      <span class="value light">{s.toString().padStart(2, "0")}</span>
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    /* cursor: pointer; */
    font-size: 1rem;
  }
  .small {
    font-size: 0.9rem;
    /* color: var(--fg-xlight); */
  }
  .unit,
  .value {
    padding: 0 1px;
  }
  .value {
    font-weight: 800;
  }
  .container.small .value {
    font-weight: normal;
  }
  .text {
    font-size: 0.8em;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 0.25rem;
  }
  .light {
    color: var(--fg-xlight);
  }
  .container.small .light {
    color: var(--fg-xxlight);
  }
  .maticons {
    font-size: 16px;
    padding-right: 0.125rem;
  }
</style>
