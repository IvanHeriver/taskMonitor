<script>
  import { overlay } from "../../stores";
</script>

{#if $overlay}
  <div class="overlay" />
{/if}

<style>
  .overlay {
    position: absolute;
    top: 28px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-overlay);
    z-index: 100;
  }
</style>
