<script lang="ts">
  import type { IMenuItem } from "../../types";
  import Menu from "./Menu.svelte";

  export let menuItem: IMenuItem;
  export let main: boolean = false;
  //   export let label: string = "";
  //   export let sublabel: string = "";
  //   export let accelerator: string = "";
  //   export let click: Function = () => {};
  //   export let role: string = "";
  //   export let type: "separator" | "normal" | "submenu" = "normal";
  //   export let submenu: Array<IMenuItem>;
  function handleClick() {
    console.log("CLICKED!");
    handleSubMenu(!subMenuOpen);
  }
  function handleSubMenu(open: boolean) {
    if (menuItem.type === "submenu") {
      subMenuOpen = open;
    }
  }
  let subMenuOpen = false;
</script>

<div
  class="container"
  class:separator={menuItem.type === "separator"}
  on:click={handleClick}
  on:mouseenter={() => !main && handleSubMenu(true)}
  on:mouseleave={() => !main && handleSubMenu(false)}
>
  {#if menuItem.type === "separator"}
    <div class="sep" />
  {:else}
    <div class="labels">
      <div class="label">{menuItem.label}</div>
      {#if "sublabel" in menuItem}
        <div class="sublabel">{menuItem.sublabel}</div>
      {/if}
    </div>
    <div class="right">
      {#if "accelerator" in menuItem}
        <div class="accelerator">{menuItem.accelerator}</div>
      {/if}
    </div>
    {#if subMenuOpen}
      <div class="submenu" class:main>
        <Menu main={false} menuItems={menuItem.submenu} />
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    position: relative;
    background-color: inherit;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
  }
  .container:not(.separator):hover,
  .container:not(.separator):focus {
    background-color: var(--bg-xxlight);
  }
  .submenu {
    background-color: var(--bg-xlight);
    position: absolute;
    z-index: 10;
  }
  .submenu.main {
    top: 100%;
    left: 0;
  }

  .label,
  .sublabel,
  .accelerator {
    white-space: nowrap;
  }
  .sublabel {
    font-size: 0.9rem;
    color: var(--fg-xlight);
  }
  .accelerator {
    color: var(--fg-xlight);
  }
</style>
