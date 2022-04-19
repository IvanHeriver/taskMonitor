<script lang="ts">
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
</script>

<div class="container">
  <div class="header">
    <div class="title">
      <span class="maticons">checklist</span><span>Todos</span>
    </div>
    <div class="actions">
      <button
        on:click={() => {
          project.ui.newTodoOpen = true;
        }}
      >
        <span class="maticons">add</span><span>Add todo</span>
      </button>
      <button
        on:click={() => {
          console.log("sort");
          project.todos = [
            ...project.todos.sort(
              (a, b) => (a.done ? 1 : 0) - (b.done ? 1 : 0)
            ),
          ];
        }}
      >
        <span class="maticons">sort</span><span>Sort by status</span>
      </button>
    </div>
  </div>
  <div class="content">
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
  </div>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: var(--bg-light);
  }
  .title {
    padding: 0 0.25rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title > .maticons {
    font-size: 16px;
    padding-right: 0.125rem;
  }
  .actions {
    display: flex;
  }
  .actions > button {
    display: flex;
    justify-content: center;
    align-items: center;
    /* font-weight: 200; */
    background-color: transparent;
  }
  .actions > button:hover {
    color: var(--fg-xstrong);
  }
  .actions > button:focus {
    outline: 1px solid var(--fg-xstrong);
    outline-offset: -1px;
  }
  .actions > button > span {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    line-height: 1;
  }

  .content {
    padding: 0.25rem;
    position: absolute;
    top: 1.5rem;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
</style>
