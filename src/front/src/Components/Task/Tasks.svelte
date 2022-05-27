<script lang="ts">
  import Section from "../Section.svelte";
  import Task from "./Task.svelte";
  import NewTask from "./NewTask.svelte";

  import { registerModification } from "../../stores";

  export let project;

  const headerActions = [
    {
      icon_code: "add",
      text: "Add task",
      action: () => {
        project.ui.newTaskOpen = true;
      },
    },
    {
      icon_code: "expand_less",
      text: "Collapse all",
      action: () => {
        project.tasks = project.tasks.map((t) => {
          if (t.mode === "edit") return t;
          t.mode = "small-view";
          return t;
        });
      },
    },
    {
      icon_code: "expand_more",
      text: "Expand all",
      action: () => {
        project.tasks = project.tasks.map((t) => {
          if (t.mode === "edit") return t;
          t.mode = "large-view";
          return t;
        });
      },
    },
  ];
</script>

<div class="container">
  <Section
    icon_code="assignment_turned_in"
    title="Tasks"
    actions={headerActions}
  >
    {#if project.ui.newTaskOpen}
      <NewTask
        task={null}
        bind:tags={project.tags}
        bind:timerLogs={project.timerLogs}
        on:cancel={() => {
          project.ui.newTaskOpen = false;
        }}
        on:save={(event) => {
          const newTask = event.detail;
          console.log("newTask", newTask);
          project.tasks = [newTask, ...project.tasks];
          project.ui.newTaskOpen = false;
          registerModification(project.id, "new task", ["tasks"]);
        }}
      />
    {/if}
    {#each project.tasks as task, i (task.id)}
      <Task
        bind:task
        bind:tags={project.tags}
        bind:timerLogs={project.timerLogs}
        on:save={(e) => {
          const newTask = e.detail;
          project.tasks = project.tasks.map((t, i) => {
            if (t.id !== newTask.id) return t;
            registerModification(project.id, "modify task", ["tasks", i]);
            return newTask;
          });
        }}
        on:delete={(e) => {
          const task_id = e.detail;
          project.tasks = project.tasks.filter((t) => t.id !== task_id);
          registerModification(project.id, "delete task", ["tasks"]);
        }}
      />
    {/each}
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
</style>
