<script lang="ts">
  import TaskView from "./TaskView.svelte";
  import TaskEdit from "./TaskEdit.svelte";
  import type { tmTask } from "../../types";

  export let task: tmTask;
  export let mode: "edit" | "view";
</script>

{#if mode === "view"}
  <TaskView {task} mode={"big"} />
{:else}
  <!-- else content here -->
{/if}

<style>
</style>
