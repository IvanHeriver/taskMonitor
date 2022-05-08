<script lang="ts">
  import type { IMenuItem } from "../../types";
  import MenuItem from "./MenuItem.svelte";

  // export let type: "vertical" | "horizontal" = "vertical";
  export let main: boolean = false;
  export let menuItems: Array<IMenuItem>;
</script>

<div
  class="container"
  class:main
  on:focus={() => console.log("Focus")}
  on:blur={() => {
    console.log("Blur");
  }}
>
  {#each menuItems as menuItem}
    <MenuItem {menuItem} {main} />
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
  }
  .main {
    flex-direction: row;
  }
</style>
