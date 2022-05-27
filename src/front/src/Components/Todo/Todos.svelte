<script lang="ts">
  import { _ } from "svelte-i18n";
  import Section from "../Section.svelte";
  import { registerModification } from "../../stores";

  import type { IProject } from "../../types";
  import Todo from "./Todo.svelte";

  export let project: IProject;

  let modes = {};
  $: {
    project.todos.forEach((todo) => {
      if (!(todo.id in modes)) {
        modes[todo.id] = "view";
      }
    });
  }

  const headerActions = [
    {
      icon_code: "add",
      text: $_("todos.add_something_todo"),
      action: () => (project.ui.newTodoOpen = true),
    },
    {
      icon_code: "sort",
      text: $_("todos.sort_by_status"),
      action: () => {
        project.todos = [
          ...project.todos.sort((a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)),
        ];
      },
    },
  ];
</script>

<div class="container">
  <Section
    icon_code="checklist"
    title={$_("todos.todos")}
    actions={headerActions}
  >
    {#if project.ui.newTodoOpen}
      <Todo
        todo={null}
        mode="edit"
        on:new={(event) => {
          const newTodo = event.detail;
          if (newTodo) {
            project.todos = [newTodo, ...project.todos];
            registerModification(project.id, "new todo", ["todos", 0]);
          }
          project.ui.newTodoOpen = false;
        }}
      />
    {/if}
    {#each project.todos as todo, i (todo.id)}
      <Todo
        bind:todo
        bind:mode={modes[todo.id]}
        on:save={(event) => {
          const newTodo = event.detail;
          project.todos = project.todos.map((t) => {
            if (t.id !== todo.id) return t;
            return newTodo;
          });
          registerModification(project.id, "modify todo", ["todos", i]);
        }}
        on:delete={(event) => {
          const id = event.detail;
          project.todos = project.todos.filter((t) => t.id !== id);
          registerModification(project.id, "delete todo", ["todos"]);
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
