<script lang="ts">
  import { messages } from "../../stores";
</script>

<div class="container">
  {#each $messages as message}
    <div class="message" data-type={message.type}>
      <button
        class="icon"
        on:click={() => {
          $messages = $messages.filter((m) => m.id !== message.id);
        }}><span class="maticons">close</span></button
      >
      <div class="title">{message.title}</div>
      <div class="details">{message.message}</div>
    </div>
  {/each}
</div>

<style>
  .container {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 400px;
    z-index: 200;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .title {
    font-weight: 800;
  }
  .message {
    position: relative;
    background-color: var(--bg-overlay);
    filter: drop-shadow(0.25rem 0.25rem 0.25rem var(--bg-overlay));
    padding: 0.5rem;
  }
  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
  .message[data-type="info"] {
    background-color: var(--bg-info);
  }
  .message[data-type="warning"] {
    background-color: var(--bg-warning);
  }
  .message[data-type="error"] {
    background-color: var(--bg-error);
  }
</style>
