<script>
  import Projects from "./Components/Projects.svelte";
  import Confirm from "./Components/Utils/Confirm.svelte";
  import Message from "./Components/Utils/Message.svelte";
  import Overlay from "./Components/Utils/Overlay.svelte";
  import DurationItem from "./Components/Duration/DurationItem.svelte";
  import { onMount } from "svelte";
  import {
    currentProjectId,
    projects,
    message,
    processLoadedProject,
    draggedDurationItem,
  } from "./stores";
  import Header from "./Header.svelte";

  onMount(async () => {
    // const shouldUseDarkMode = true;
    window.electronAPI.onSetDarkMode(async (_, isDarkMode) => {
      darkMode = isDarkMode;
      console.log("isDarkMode", isDarkMode);
      // console.log(await window.electronAPI.toggleDarkMode(darkMode));
      document.documentElement.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light"
      );
    });
    window.electronAPI.shoudUseDarkMode();
    const currentAppVersion = await window.electronAPI.checkAndUpdateApp();
    console.log("currentAppVersion", currentAppVersion);
    window.electronAPI.onUpdateAvailable((e, args) => {
      console.log("onUpdateAvailable", e);
      console.log("onUpdateAvailable", args);
    });
    window.electronAPI.onUpdateDownloaded((e, args) => {
      console.log("onUpdateDownloaded", e);
      console.log("onUpdateDownloaded", args);
    });
    // document.documentElement.setAttribute(
    //   "data-theme",
    //   darkMode ? "dark" : "light"
    // );
    let session = await window.electronAPI.retrieveSession();
    console.log(session);
    $projects = session.projects.map((p) => processLoadedProject(p));
    $currentProjectId = session.currentProjectId;
    sessionRetrieved = true;

    document.addEventListener("pointermove", (e) => {
      mouseX = e.x;
      mouseY = e.y;
    });
  });

  let mouseX, mouseY;

  let darkMode = true;
  let sessionRetrieved = false;
</script>

<Header />

<Confirm />
<Message />

<Overlay />

{#if sessionRetrieved}
  <Projects />
{:else}
  <div class="loading">Loading previous session...</div>
{/if}

{#if $draggedDurationItem}
  <div class="durationItem" style={`--x: ${mouseX}px; --y: ${mouseY}px`}>
    <DurationItem durationItem={$draggedDurationItem} editable={false} />
  </div>
{/if}
<svelte:body class:grabbing={$draggedDurationItem !== null} />

<style>
  .loading {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 28px);
  }

  .durationItem {
    position: absolute;
    top: var(--y, 0);
    left: var(--x, 0);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
