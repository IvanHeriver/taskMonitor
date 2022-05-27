<script lang="ts">
  import Section from "../Section.svelte";
  import type { IProject } from "../../types";

  export let project: IProject;
  console.log(project);
  const headerActions = [];
</script>

<div class="container">
  <Section icon_code="bar_chart" title="Statistics" actions={headerActions}>
    <p>(Not available yet...)</p>
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
