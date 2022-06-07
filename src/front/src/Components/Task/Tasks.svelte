<script lang="ts">
  import { _ } from "svelte-i18n";
  import Section from "../Section.svelte";
  import Task from "./Task.svelte";
  import NewTask from "./NewTask.svelte";

  import { registerModification } from "../../stores";

  export let project;

  $: headerActions = [
    {
      icon_code: "add",
      text: $_("tasks.add_task"),
      action: () => {
        project.ui.newTaskOpen = true;
      },
      primary: true,
    },
    {
      icon_code: "expand_less",
      text: $_("tasks.collapse_all"),
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
      text: $_("tasks.expand_all"),
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
    title={$_("tasks.tasks")}
    actions={headerActions}
  >
    <ul>
      {#if project.ui.newTaskOpen}
        <li>
          <NewTask
            task={null}
            bind:tags={project.tags}
            bind:timerLogs={project.timerLogs}
            on:cancel={() => {
              project.ui.newTaskOpen = false;
            }}
            on:save={(event) => {
              const newTask = event.detail;
              project.tasks = [newTask, ...project.tasks];
              project.ui.newTaskOpen = false;
              registerModification(project.id, "new task", ["tasks"]);
            }}
          />
        </li>
      {/if}
      {#each project.tasks as task, i (task.id)}
        <li>
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
        </li>
      {/each}
    </ul>
  </Section>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
</style>
