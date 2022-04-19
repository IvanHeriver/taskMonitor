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
  <!-- <input
      type="checkbox"
      name="tododone"
      id={`tododone-${todo.id}`}
      bind:checked={todo.done}
    />
    <label for={`tododone-${todo.id}`} /> -->
  <div class="text" class:done={todo.done}>
    {todo.text}
  </div>

  <!-- </div> -->
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
    /* background-color: var(--bg-strong); */

    /* display: grid; */
    /* grid-template-columns: auto max-content; */
    /* column-gap: 0.25rem; */
    /* justify-items: start; */
    /* align-items: center; */
    display: flex;
    width: 100%;
    gap: 0.25rem;

    background-color: var(--bg);
    /* user-select: none; */

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
    /* display: flex;
    justify-content: flex-start;
    align-items: center; */
  }

  .text.done {
    text-decoration: line-through;
    font-style: italic;
    color: var(--fg-xlight);
  }
</style>
