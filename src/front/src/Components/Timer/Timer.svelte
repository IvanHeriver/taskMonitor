<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { timers, registerModification } from "../../stores";
  import type { IProject, ITimer, ITimerLog } from "../../types";
  import TimerLog from "./TimerLog.svelte";

  export let project: IProject;

  if (!(project.id in $timers)) {
    $timers[project.id] = {
      started: false,
      startDateTime: new Date(),
      startTime: 0,
      currentTime: 0,
      offsetTime: 0,
    };
  }
  let timer: ITimer = $timers[project.id];

  $: formattedTime = computeHMS(timer.currentTime);

  onMount(() => {
    window.requestAnimationFrame(timerLoop);
  });

  function startTimer() {
    window.requestAnimationFrame((t) => {
      timer.startDateTime = new Date();
      timer.startTime = t;
      timer.started = true;
    });
  }
  function timerLoop(t) {
    if (timer.started) {
      timer.currentTime = t - timer.startTime + timer.offsetTime;
    }
    window.requestAnimationFrame(timerLoop);
  }
  function pauseTimer() {
    timer.started = false;
    timer.offsetTime = timer.currentTime;
  }
  function resetTimer() {
    addTimerLog();
    if (timer.started) {
      timer.started = false;
      startTimer();
    }
    timer.currentTime = 0;
    timer.offsetTime = 0;
  }

  function addTimerLog() {
    const newTimerLog: ITimerLog = {
      id: Math.random().toString().slice(2),
      startDateTime: timer.startDateTime.toISOString(),
      endDateTime: new Date().toISOString(),
      duration: timer.currentTime / 1000 / 60,
      used: false,
    };
    registerModification(project.id, "new timer log", ["timerLogs", 0]);
    project.timerLogs = [newTimerLog, ...project.timerLogs];
  }

  function getLeadingZeros(value: number): { z: string; v: string } {
    let v = value.toString();
    let n = v.length;
    let z = "";
    if (n == 1) {
      z = "0";
    }
    return { z, v };
  }
  function computeHMS(time: number) {
    let s = Math.floor(time / 1000);
    let h = Math.floor(s / 60 / 60);
    s -= h * 60 * 60;
    let m = Math.floor(s / 60);
    s -= m * 60;
    return {
      h: getLeadingZeros(h),
      m: getLeadingZeros(m),
      s: getLeadingZeros(s),
    };
  }
</script>

<div class="container">
  <div class="header">
    <div class="title">
      <span class="maticons">timer</span><span>Timer</span>
    </div>
  </div>
  <div class="content">
    <div class="time">
      <div class="digits">
        <div class="h">
          <span class="zeros">
            {formattedTime.h.z}
          </span>
          <span class="value">
            {formattedTime.h.v}
          </span>
        </div>
        :
        <div class="m">
          <span class="zeros">
            {formattedTime.m.z}
          </span>
          <span class="value">
            {formattedTime.m.v}
          </span>
        </div>
        :
        <div class="s">
          <span class="zeros">
            {formattedTime.s.z}
          </span>
          <span class="value">
            {formattedTime.s.v}
          </span>
        </div>
        <div class="right">
          <button class="icon" on:click={() => addTimerLog()}>
            <span class="maticons">download</span>
          </button>
          <button class="icon" on:click={resetTimer}>
            <span class="maticons">restart_alt</span>
          </button>
        </div>
        <div class="left">
          {#if timer.started}
            <button class="icon playpause" on:click={pauseTimer}>
              <span class="maticons">pause</span>
            </button>
          {:else}
            <button class="icon playpause" on:click={startTimer}>
              <span class="maticons">play_arrow</span>
            </button>
          {/if}
        </div>
      </div>
    </div>
    <!-- <div class="controls">

    </div> -->
    <div class="history">
      <TimerLog
        bind:timerLogs={project.timerLogs}
        on:delete={(event) => {
          const timerLogId = event.detail;
          project.timerLogs = project.timerLogs.filter(
            (t) => t.id !== timerLogId
          );
        }}
      />
    </div>
  </div>
</div>

<style>
  button > .maticons {
    font-size: 28px;
  }
  /* button.disabled > * {
    color: var(--fg-xlight);
  } */
  .right {
    position: absolute;
    right: -0.5rem;
    top: 52%;
    transform: translate(100%, -50%);
  }
  .left {
    position: absolute;
    left: -0.5rem;
    top: 52%;
    transform: translate(-100%, -50%);
  }
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .playpause .maticons {
    font-size: 34px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: var(--bg-light);
  }
  .title {
    padding: 0 0.25rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title > .maticons {
    font-size: 16px;
    padding-right: 0.125rem;
  }
  /* .controls {
    display: flex;
    justify-content: center;
  } */
  .time {
    display: flex;
    justify-content: center;
    font-size: 2rem;
  }
  .digits {
    position: relative;
  }
  .digits > div {
    display: flex;
    justify-content: center;
  }
  /* .s {
    position: relative;
  } */
  .time > div {
    display: flex;
    justify-content: center;
  }
  .history {
    padding: 0.25rem;
    position: absolute;
    top: 6.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    border-top: 1px solid var(--fg-xxlight);
  }
</style>
