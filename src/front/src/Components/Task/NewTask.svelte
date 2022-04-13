<script lang="ts">
  import TaskEdit from "./TaskEdit.svelte";
  import type { ITag, ITask, ITimerLog } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let task: ITask;
  export let tags: Array<ITag>;
  export let timerLogs: Array<ITimerLog>;
</script>

<TaskEdit
  {task}
  bind:tags
  bind:timerLogs
  on:cancel={() => eventDispatcher("cancel")}
  on:save={(e) => eventDispatcher("save", e.detail)}
/>
