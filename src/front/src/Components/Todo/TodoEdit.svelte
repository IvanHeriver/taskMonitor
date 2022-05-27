<script lang="ts">
  import type { ITodo } from "../../types";
  import { createEventDispatcher, onMount } from "svelte";
  import { uuid } from "../../utils";
  const eventDispatcher = createEventDispatcher();

  export let todo: ITodo;

  function save() {
    if (text === undefined || text === "") return;
    const newTodo: ITodo = {
      id,
      text,
      done,
    };
    eventDispatcher("save", newTodo);
  }

  let id = uuid();
  let text;
  let done = false;
  let isNew = true;
  if (todo !== null) {
    id = todo.id;
    text = todo.text;
    done = todo.done;
    isNew = false;
  }
  onMount(() => {
    mainInputElement.focus();
  });

  let mainInputElement;
</script>

<div class="container">
  <div class="content">
    <input
      type="text"
      placeholder="What should be done..."
      bind:value={text}
      bind:this={mainInputElement}
      on:keyup={(e) => e.key === "Enter" && save()}
    />
  </div>
  <div class="actions">
    <button class="primary" on:click={() => save()}>
      <span class="maticons">done</span>
      <span>{isNew ? "Create New Todo" : "Save Todo"}</span>
    </button>
    <button class="secondary" on:click={() => eventDispatcher("cancel")}>
      <span class="maticons">close</span>
      <span>Cancel</span>
    </button>
  </div>
</div>

<style>
  .container {
    outline: 1px solid var(--bg-xxlight);
    outline-offset: -1px;
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 100%;
    row-gap: 0.5rem;
  }
  .container:focus-within {
    outline-color: var(--fg-xstrong);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .actions > button {
    margin-left: 0.5rem;
  }
  input {
    width: 100%;
  }
</style>
