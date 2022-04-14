<script>
  import Projects from "./Components/Projects.svelte";
  import Confirm from "./Components/Utils/Confirm.svelte";
  import Message from "./Components/Utils/Message.svelte";
  import Overlay from "./Components/Utils/Overlay.svelte";
  import { onMount } from "svelte";
  import { currentProjectId, projects, message } from "./stores";
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
    // document.documentElement.setAttribute(
    //   "data-theme",
    //   darkMode ? "dark" : "light"
    // );
    let session = await window.electronAPI.retrieveSession();
    console.log(session);
    $projects = session.projects;
    $currentProjectId = session.currentProjectId;
    sessionRetrieved = true;
  });

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
  <div>Loading previous session...</div>
{/if}
