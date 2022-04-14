<script lang="ts">
  import { onMount } from "svelte";

  import { message } from "../../stores";

  $: {
    if ($message !== null) {
      setTimeout(() => {
        $message = null;
      }, $message.duration);
    }
  }

  let containerElement;
</script>

{#if $message !== null}
  <div class="container" class:error={$message.type === "error"}>
    <div class="title">
      {$message.title}
    </div>
    <div class="message">
      {$message.message}
    </div>
  </div>
{/if}

<style>
  .container {
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 400px;
    /* height: 100px; */

    z-index: 200;
    background-color: var(--bg-overlay);
    filter: drop-shadow(0.25rem 0.25rem 0.25rem var(--bg-overlay));
    padding: 0.5rem;
  }
  .title {
    font-weight: 800;
  }
  .error {
    background-color: var(--bg-error);
  }
</style>
