<script lang="ts">
  import type { ITodo } from "../../types";
  import TodoView from "./TodoView.svelte";
  import TodoEdit from "./TodoEdit.svelte";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let todo: ITodo;
  export let mode: "edit" | "view";
</script>

<div class="container">
  {#if mode === "edit"}
    <TodoEdit
      {todo}
      on:cancel={() => {
        if (todo === null) {
          eventDispatcher("new");
        } else {
          mode = "view";
        }
      }}
      on:save={(event) => {
        const newTodo = event.detail;
        if (todo === null) {
          eventDispatcher("new", newTodo);
        } else {
          eventDispatcher("save", newTodo);
          mode = "view";
        }
      }}
    />
  {:else}
    <TodoView
      bind:todo
      on:edit={() => (mode = "edit")}
      on:delete={() => {
        eventDispatcher("delete", todo.id);
      }}
    />
  {/if}
</div>

<style>
</style>
