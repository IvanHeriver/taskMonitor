<script lang="ts">
  import type { ITag } from "../../types";
  import { createEventDispatcher, onMount } from "svelte";
  import { hslToHex, hexToHsl } from "./colors";
  const eventDispatcher = createEventDispatcher();

  export let tag: ITag;

  function save() {
    const newTag: ITag = {
      id,
      name,
      description,
      color: hexToHsl(color),
    };
    eventDispatcher("save", newTag);
  }

  let id = Math.random().toString().slice(2);
  let name = "",
    description = "",
    color = "#808080";
  let isDark = false;
  if (tag !== null) {
    id = tag.id;
    name = tag.name;
    description = tag.description;
    color = hslToHex(tag.color);
  }

  $: {
    isDark = hexToHsl(color).l < 50;
  }

  onMount(() => {
    nameInputElement.focus();
  });

  let nameInputElement;
</script>

<div
  class="container"
  style={`--color: ${color}; --fg-color: ${isDark ? "white" : "black"}`}
>
  <div class="top">
    <div class="name">
      <label for="name">Name:</label>
      <input
        type="text"
        name="name"
        id="name"
        bind:value={name}
        placeholder="Name"
        bind:this={nameInputElement}
      />
    </div>
    <div class="color">
      <label for="color">Color:</label>
      <input type="color" name="color" id="color" bind:value={color} />
    </div>
  </div>
  <div class="description">
    <label for="desc">Description:</label>
    <input
      type="text"
      name="desc"
      id="desc"
      bind:value={description}
      placeholder="Description"
    />
  </div>
  <div class="actions">
    <button class="primary" on:click={() => save()}>
      <span class="maticons">done</span>
      <span>Save</span>
    </button>
    <button class="secondary" on:click={() => eventDispatcher("cancel")}>
      <span class="maticons">close</span>
      <span>Cancel</span>
    </button>
  </div>
</div>

<style>
  .container {
    outline: 1px solid var(--color);

    outline-offset: -1px;
    /* background-color: var(--bg-strong); */
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 100%;
    row-gap: 0.5rem;
  }
  .top {
    /* display: flex; */
    /* justify-content: space-between; */
    /* align-items: center; */
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    /* background-color: var(--bg); */
    /* padding: 0.5rem; */
  }
  /* .description {
    padding: 0.5rem;
  } */
  .actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  input {
    width: 100%;
  }
  .name,
  .color,
  .description {
    display: flex;
    /* justify-content: stretch; */
    align-items: center;
  }
  /* .color {
    position: relative;
    overflow: hidden;
    height: 1.5rem;
    width: 100%;
  }
  input[type="color"] {
    position: absolute;
    top: -2rem;
    left: -2rem;
    height: 6rem;
    width: 200%;
  }
  .color > label {
    position: absolute;
    color: var(--fg-color);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  } */
  label {
    font-weight: 100;
    font-size: 0.8;
    color: var(--fg-light);
    padding-right: 0.5rem;
  }
</style>
