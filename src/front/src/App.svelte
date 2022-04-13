<script>
  import Projects from "./Components/Projects.svelte";
  import Confirm from "./Components/Utils/Confirm.svelte";
  import { onMount } from "svelte";
  import { currentProjectId, projects } from "./stores";

  onMount(async () => {
    const shouldUseDarkMode = true;
    document.documentElement.setAttribute(
      "data-theme",
      shouldUseDarkMode ? "dark" : "light"
    );
    let session = await window.electronAPI.retrieveSession();
    console.log(session);
    $projects = session.projects;
    $currentProjectId = session.currentProjectId;
    sessionRetrieved = true;
  });

  let sessionRetrieved = false;
</script>

<Confirm />

{#if sessionRetrieved}
  <Projects />
{:else}
  <div>Loading previous session...</div>
{/if}

<style>
</style>
