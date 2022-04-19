<script lang="ts">
  // type unit = "days" | "hours" | "minutes" | "auto" | "seconds";
  export let duration: number;
  export let showSeconds: boolean = true;
  // export let unit: unit = "auto";

  // const units: Array<unit> = ["auto", "seconds", "minutes", "hours", "days"];

  // let unit_index = units.findIndex((u) => u === unit);

  // $: seconds = duration * 60;
  // $: minutes = duration;
  // $: hours = duration / 60;
  // $: days = duration / 60 / 8;
  // $: best = "days";
  let mode: "days" | "hours";
  $: {
    if (Math.abs(duration / 60 / 8) > 3) {
      mode = "days";
    }
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

<div class="container">
  <span class="maticons">timer</span>
  {#if mode === "days"}
    <span class="value">{d.toFixed(2)}</span>
    <span class="unit text light">work days</span>
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
  }
  .unit,
  .value {
    padding: 0 1px;
  }
  .value {
    font-weight: 800;
  }
  .text {
    font-size: 0.8rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .light {
    color: var(--fg-light);
  }
  .maticons {
    font-size: 16px;
    padding-right: 0.125rem;
  }
</style>
