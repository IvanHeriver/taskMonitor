<script lang="ts">
  interface ItitleBarAction {
    icon_code: string;
    text: string;
    action: Function;
  }
  export let icon_code: string;
  export let title: string;
  export let actions: Array<ItitleBarAction>;
</script>

<div class="container">
  <div class="header">
    <div class="title">
      <span class="maticons">{icon_code}</span><span>{title}</span>
    </div>
    <div class="actions">
      {#each actions as action}
        <button
          on:click={() => {
            action.action();
          }}
        >
          <span class="maticons">{action.icon_code}</span><span
            >{action.text}</span
          >
        </button>
      {/each}
    </div>
  </div>

  <div class="content">
    <slot />
  </div>
</div>

<style>
  .container {
    position: relative;
    height: 100%;
    overflow: hidden;
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
  .header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    background-color: var(--bg-light);
    /* height:  */
  }
  .header * {
    white-space: nowrap;
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
</style>
