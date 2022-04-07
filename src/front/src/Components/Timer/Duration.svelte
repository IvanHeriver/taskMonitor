<script lang="ts">
  export let duration: number;
  export let mode: "big" | "small" = "big";
  function getValueUnit(
    value: number,
    unit: "m" | "h" | "d",
    mode: "big" | "small" = "big"
  ) {
    const units = {
      m: ["minute", "minutes", "m"],
      h: ["hour", "hours", "h"],
      d: ["work day", "work days", "d"],
    };
    if (mode === "big") {
      const u = units[unit][value === 1 ? 0 : 1];
      //   return value !== 0 ? ` ${value} ${u}` : "";
      return { value: value !== 0 ? value.toString() : "", unit: u };
    } else {
      const u = units[unit][2];
      const v =
        unit === "d" ? value.toString() : value.toString().padStart(2, "0");
      //   return `${v}${u}`;
      return { value: v, unit: u };
    }
  }

  const workDayDuration = 8 * 60;
  let d, h, m;
  $: {
    let minutes = duration;
    const workDays = Math.floor(minutes / workDayDuration);
    minutes -= workDays * workDayDuration;
    const hours = Math.floor(minutes / 60);
    minutes -= hours * 60;

    d = getValueUnit(workDays, "d", mode);
    h = getValueUnit(hours, "h", mode);
    m = getValueUnit(minutes, "m", mode);
  }
</script>

<div class={`container ${mode}`}>
  {#if d.value !== ""}
    <span class="value">{d.value}</span>
    <span class="unit">{d.unit}</span>
  {/if}
  {#if h.value !== ""}
    <span class="value">{h.value}</span>
    <span class="unit">{h.unit}</span>
  {/if}
  {#if m.value !== ""}
    <span class="value">{m.value}</span>
    <span class="unit">{m.unit}</span>
  {/if}
</div>

<style>
  .container {
    display: flex;
  }
  .value {
    font-weight: 800;
  }
  .unit,
  .value {
    padding: 0 0.125rem;
  }
  .container.small > .value {
    padding: 0;
  }
</style>
