<script>
  import { init_i18n } from "./i18n";

  import Projects from "./Components/Projects.svelte";
  import Confirm from "./Components/Utils/Confirm.svelte";
  import Message from "./Components/Utils/Message.svelte";
  import Overlay from "./Components/Utils/Overlay.svelte";
  import DurationItem from "./Components/Duration/DurationItem.svelte";
  import { onMount } from "svelte";
  import {
    currentProjectId,
    projects,
    addMessage,
    processLoadedProject,
    draggedDurationItem,
  } from "./stores";
  import Header from "./Header.svelte";

  function basename(str) {
    let li = Math.max(str.lastIndexOf("/"), str.lastIndexOf("\\"));
    return new String(str).substring(li + 1);
  }

  onMount(async () => {
    await init_i18n();
    languagesLoaded = true;
    // const shouldUseDarkMode = true;
    window.electronAPI.onSetDarkMode(async (_, isDarkMode) => {
      darkMode = isDarkMode;
      document.documentElement.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light"
      );
    });
    window.electronAPI.shoudUseDarkMode();

    const currentAppVersion = await window.electronAPI.checkAndUpdateApp();
    window.electronAPI.onUpdateAvailable((e, args) => {});
    window.electronAPI.onUpdateDownloaded((e, args) => {});
    let session = await window.electronAPI.retrieveSession();
    console.log("RAW SESSION", session);
    let rawProjects = session.projects;
    for (let k = 0; k < rawProjects.length; k++) {
      if (rawProjects[k].filePath !== "") {
        console.log("NEEDS TO LOAD PROJECT " + rawProjects[k].filePath);
        console.log("OLD", rawProjects[k]);
        const response = await window.electronAPI.loadProject(
          rawProjects[k].filePath
        );
        console.log("NEW", response.project);
        rawProjects[k] = response.project;
        // return updatedProject
      }
    }
    // $projects = session.projects.map((p) => processLoadedProject(p));
    $projects = rawProjects.map((p) => processLoadedProject(p));
    $currentProjectId = session.currentProjectId;
    sessionRetrieved = true;

    document.addEventListener("pointermove", (e) => {
      mouseX = e.x;
      mouseY = e.y;
    });

    window.electronAPI.onExitRequired(async (_) => {
      const unsaved = $projects.map(
        (p) => p.filePath !== "" && p.state !== "saved"
      );
      console.log($projects);
      console.log(unsaved);
      if (unsaved.some((e) => e)) {
        const n_unsaved = unsaved.reduce((a, c) => a + c, 0);
        // const message = n_unsaved === 1 ? "Voulez vous sauvegarder le fichier suivant avant de quitter Tatimo?" : "Voulez vous sauvegarder les fichiers suivant avant de quitter Tatimo?"
        let message =
          n_unsaved === 1
            ? "Do you want to save the following file before exiting Tatimo?"
            : "Do you want to save the following files before exiting Tatimo?";
        let unsaved_project = $projects.filter((_, i) => unsaved[i]);

        let unsaved_files = unsaved_project
          .map((p) => basename(p.filePath))
          .reduce((a, fn) => `${a}\n${fn}`, "\n");
        const res = await window.electronAPI.askQuestion({
          message: message + unsaved_files,
          buttons: ["Oui", "Non", "Annuler"],
          // buttons: ["Yes", "No", "Cancel"],
          cancelID: 2,
        });
        if (res.response === 0) {
          console.log("SAVING");
          for (let k = 0; k < unsaved_project.length; k++) {
            const res = await window.electronAPI.saveProject(
              unsaved_project[k]
            );
            const index = $projects.findIndex(
              (p) => p.id === unsaved_project[k].id
            );
            $projects[index] = res.project;
          }
          unsaved_project.forEach((p) => {});
        }
        if (res.response === 1) {
          console.log("NOOOOOOT SAVING");
        }
        if (res.response !== 2) {
          setTimeout(() => {
            window.electronAPI.exit();
          }, 500);
        }
      } else {
        window.electronAPI.exit();
      }
    });
  });

  let mouseX, mouseY;

  let darkMode = true;
  let sessionRetrieved = false;
  let languagesLoaded = false;
</script>

{#if languagesLoaded}
  <Header />
  {#if sessionRetrieved}
    <Confirm />
    <Message />

    <Overlay />

    <Projects />
  {:else}
    <div class="loading">
      <div class="spinner" />
      Loading...
    </div>
  {/if}
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
    position: relative;
  }
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    --size: 10px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background-color: var(--fg-xstrong);
    transform: translate(0, 0);
    animation: spinner 2500ms infinite linear;
  }
  @keyframes spinner {
    0% {
      transform: translate(-100px, 0);
    }
    25% {
      transform: translate(0, -100px);
    }
    50% {
      transform: translate(100px, 0);
    }
    75% {
      transform: translate(0, 100px);
    }
    100% {
      transform: translate(-100px, 0);
    }
  }

  .durationItem {
    position: absolute;
    top: var(--y, 0);
    left: var(--x, 0);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }
</style>
