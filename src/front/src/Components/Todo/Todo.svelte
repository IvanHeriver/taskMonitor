<script lang="ts">
  import type { ITodo } from "../../types";
  import TodoView from "./TodoView.svelte";
  import TodoEdit from "./TodoEdit.svelte";
  import { createEventDispatcher } from "svelte";
  import { question } from "../../stores";
  const eventDispatcher = createEventDispatcher();

  export let todo: ITodo;
  export let mode: "edit" | "view";

  // function deleteTag(tag_id) {
  //
  // }
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
  .container {
    padding: 0 0.25rem;
    padding-top: 0.25rem;
    min-width: 200px;
    user-select: none;
  }
  .container:first-child {
    padding-top: 0;
  }
</style>
