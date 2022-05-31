<script lang="ts">
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";

  import Menu from "./Components/Menu/Menu.svelte";
  import type { IMenuItem } from "./types";

  onMount(async () => {
    window.electronAPI.onResize((_, normal) => {
      isNormal = normal;
    });
    isNormal = await window.electronAPI.isNormal();
  });

  // const menuItems: Array<IMenuItem> = [
  //   {
  //     label: "File",
  //     type: "submenu",
  //     submenu: [
  //       {
  //         label: "Toggle Dark Mode",
  //         sublabel: "Dark is better!",
  //         click: () => {
  //           console.log("Toggle Dark Model!");
  //         },
  //       },
  //       { type: "separator" },
  //       {
  //         label: "Open",
  //         accelerator: "Ctrl+O",
  //         click: async () => {
  //           console.log("Open");
  //           // const response = await openProjectFromFile(window);
  //           // window.webContents.send("load-project", response);
  //         },
  //       },
  //       { type: "separator" },
  //       {
  //         label: "Save",
  //         accelerator: "Ctrl+S",
  //         click: () => console.log("Save"),
  //       },
  //       { type: "separator" },
  //       {
  //         label: "Exit",
  //         accelerator: "Alt+F4",
  //         role: "close",
  //       },
  //     ],
  //   },
  // ];
  let isNormal = false;
</script>

<div class="window-header">
  <div class="left">
    <button class="icon" on:click={() => window.electronAPI.openMainMenue()}>
      <img src="./ihdev_icon.svg" alt="app-logo" width="20" height="20" />
    </button>
    <!-- <div class="menu"><Menu main={true} {menuItems} /></div> -->
    <div class="menu" />
  </div>
  <div class="center">
    <span class="main">{`Tatimo `}</span>
    <span class="link">
      {` - `}
    </span>
    <span class="secondary">
      {$_("app_subtitle")}
    </span>
  </div>
  <div class="right">
    <div class="controls">
      <button on:click={() => window.electronAPI.minimize()} title="Minimize">
        <span class="icon-minimize" />
      </button>
      <button
        on:click={() => {
          if (isNormal) {
            window.electronAPI.maximize();
          } else {
            window.electronAPI.restore();
          }
        }}
        title={isNormal ? "Maximize" : "Restore"}
      >
        {#if isNormal}
          <span class="icon-maximize" />
        {:else}
          <!-- <span class="maticons">maximize</span> -->
          <span class="icon-restore" />
        {/if}
      </button>
      <button
        id="btn-close"
        on:click={() => window.electronAPI.close()}
        title="Close"
      >
        <span class="icon-close" />
      </button>
    </div>
  </div>
</div>

<style>
  .window-header {
    display: grid;
    grid-template-columns: max-content auto max-content;
    align-items: center;
    height: 28px;
    background-color: var(--bg-xlight);
    border-bottom: 1px solid var(--bg-xstrong);
    padding: 0;
    /* padding-left: 0.5rem; */
    user-select: none;
    -webkit-user-select: none;
  }
  .left {
    display: flex;
  }
  .right {
    justify-self: end;
  }
  .center {
    display: flex;
    justify-content: center;
    -webkit-app-region: drag;
  }
  .center .link {
    color: var(--fg-light);
    padding: 0 0.5rem;
  }
  .center .secondary {
    color: var(--fg-light);
  }
  .icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .menu {
    display: flex;
    align-items: stretch;
  }
  .controls {
    display: flex;
  }
  button {
    background-color: transparent;
    padding: 0 0.5rem;
    height: 27px;
    /* height: 100%; */
  }
  .controls button {
    padding: 0 1rem;
  }
  .controls button:hover {
    background-color: var(--bg-xxlight);
  }
  button:focus {
    outline: none;
  }
  .controls button#btn-close:hover {
    background-color: var(--danger);
  }
  /* .controls .maticons {
    font-size: 24px;
  } */
</style>
