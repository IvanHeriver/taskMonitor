<script lang="ts">
  import { onMount } from "svelte";

  import { question } from "../../stores";
  // onMount(() => {
  //   validateBtnElement.focus();
  // });
  let validateBtnElement;

  $: {
    // $question
    if (validateBtnElement) {
      validateBtnElement.focus();
    }
  }
</script>

{#if $question !== null}
  <div class="outside">
    <div class="inside">
      {#if $question.title !== null}
        <div class="header">{$question.title}</div>
      {/if}
      <div class="content">
        <div class="question">{$question.question}</div>
        <div class="actions">
          <button
            on:click={() => {
              $question.answer(true);
              $question = null;
            }}
            bind:this={validateBtnElement}
          >
            <span class="maticons">done</span>
          </button>
          <button
            on:click={() => {
              $question.answer(false);
              $question = null;
            }}
          >
            <span class="maticons">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .actions {
    padding-top: 1rem;
    display: flex;
    justify-content: space-between;
  }
  .outside {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 101;
    background-color: var(--bg-overlay);
  }
  .inside {
    display: flex;
    flex-direction: column;
    background-color: var(--bg);
    width: 400px;
    /* padding: 1rem; */
    filter: drop-shadow(1rem 1rem 1rem var(--bg-overlay));
  }
  .header {
    padding: 0.5rem;
    background-color: var(--bg-strong);
    text-transform: uppercase;
  }
  .content {
    padding: 0.5rem;
  }
  button {
    padding: 0.125rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
