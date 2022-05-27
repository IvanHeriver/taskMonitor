<script lang="ts">
  import type { ITodo } from "../../types";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let todo: ITodo;
</script>

<button
  class="container"
  on:click={() => {
    todo.done = !todo.done;
  }}
>
  <div class="text" class:done={todo.done}>
    {todo.text}
  </div>

  <div class="actions">
    <button class="icon" on:click={() => eventDispatcher("edit")}>
      <span class="maticons">mode_edit</span>
    </button>
    <button class="icon danger" on:click={() => eventDispatcher("delete")}>
      <span class="maticons">delete_outline</span>
    </button>
  </div>
</button>

<style>
  .container {
    outline: 1px solid var(--bg-light);
    outline-offset: -1px;
    display: flex;
    width: 100%;
    gap: 0.25rem;

    background-color: var(--bg);

    padding: 0 0.25rem;
    margin: 0;
  }
  .container:hover,
  .container:focus {
    background-color: transparent;
    outline-color: var(--fg-xstrong);
  }

  .actions {
    display: flex;
    align-items: center;
    justify-self: end;
    padding: 0.25rem 0;
  }

  .text {
    width: 100%;
    text-align: left;
  }

  .text.done {
    text-decoration: line-through;
    font-style: italic;
    color: var(--fg-xlight);
  }
</style>
