<script lang="ts">
  import { _ } from "svelte-i18n";
  import Section from "../Section.svelte";
  import type { IProject } from "../../types";

  export let project: IProject;
  console.log(project);
  const headerActions = [];
</script>

<div class="container">
  <Section
    icon_code="bar_chart"
    title={$_("statistics.statistics")}
    actions={headerActions}
  >
    <p>({$_("not_available_yet")}...)</p>
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
