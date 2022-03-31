<script>
  import Projects from "./Components/Projects.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    const shouldUseDarkMode = true;
    document.documentElement.setAttribute(
      "data-theme",
      shouldUseDarkMode ? "dark" : "light"
    );
  });
</script>

<Projects />

<style>
</style>
