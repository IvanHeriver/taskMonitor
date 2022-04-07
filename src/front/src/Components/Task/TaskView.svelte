<script lang="ts">
  // import { quintOut } from "svelte/easing";
  import { flip } from "svelte/animate";
  import { crossfade } from "svelte/transition";

  import type { tmTask } from "../../types";
  import Tag from "../Tag/TagLabel.svelte";
  import { project } from "../../stores";

  import Duration from "../Timer/Duration.svelte";

  export let task: tmTask;
  export let mode: "small" | "big";

  const [send, receive] = crossfade({ duration: 1000 });
</script>

{#if mode === "big"}
  {#each [{ id: 0 }] as item (item.id)}
    <div
      class="container-big"
      in:receive={{ key: item.id }}
      out:send={{ key: item.id }}
      animate:flip
    >
      <div class="title">{task.title}</div>
      <div class="date">{task.date.toLocaleDateString()}</div>
      <div class="desc">{task.description}</div>
      <div class="created">
        {`Created: ${task.created?.toLocaleDateString()} ${task.created?.toLocaleTimeString()}`}
      </div>
      <div class="updated">
        {`Modified: ${task.updated?.toLocaleDateString()} ${task.updated?.toLocaleTimeString()}`}
      </div>
      <button
        on:click={() => {
          mode = "small";
        }}
      >
        --> Small view</button
      >
    </div>
  {/each}
{:else}
  {#each [{ id: 0 }] as item (item.id)}
    <div
      class="container-small"
      in:receive={{ key: item.id }}
      out:send={{ key: item.id }}
      animate:flip
    >
      <div class="title">{task.title}</div>
      <div class="date">{task.date.toLocaleDateString()}</div>
      <button
        on:click={() => {
          mode = "big";
        }}>--> Big view</button
      >
    </div>
  {/each}
{/if}

{#if false}
  <div class={`container  ${mode}`}>
    <div class="title">{task.title}</div>
    <div class="date">{task.date.toLocaleDateString()}</div>
    <div class="duration">
      <Duration duration={task.duration} {mode} />
    </div>
    <div class="tags">
      {#each task.tags_id as tag_id}
        <Tag tag={$project.tags.find((t) => t.id === tag_id)} {mode} />
      {/each}
    </div>
    {#if mode === "big"}
      <div class="desc">{task.description}</div>
      <div class="created">
        {`Created: ${task.created?.toLocaleDateString()} ${task.created?.toLocaleTimeString()}`}
      </div>
      <div class="updated">
        {`Modified: ${task.updated?.toLocaleDateString()} ${task.updated?.toLocaleTimeString()}`}
      </div>
    {/if}
    <div class="actions">
      <button
        class="icon"
        on:click={() => (mode = mode === "big" ? "small" : "big")}
      >
        <span class="maticons">
          {mode === "big" ? "expand_less" : "expand_more"}
        </span>
      </button>
      <!-- <button on:click={() => (mode = "edit")}>
      <span class="maticons">mode_edit</span>
    </button> -->
      <!-- <button>
      <span class="maticons">delete</span>
    </button> -->
    </div>
  </div>
  <!-- content here -->
{/if}

<style>
  .container {
    display: grid;
  }
  .container.big {
    grid-template-areas:
      "title actions"
      "date duration"
      "desc desc"
      "tags tags"
      "created updated";
  }
  .actions {
    grid-area: actions;
  }
  .created {
    grid-area: created;
  }
  .updated {
    grid-area: updated;
  }
  .desc {
    grid-area: desc;
  }
  .title {
    grid-area: title;
  }
  .tags {
    grid-area: tags;
  }
  .duration {
    grid-area: duration;
  }
  .date {
    grid-area: date;
  }
</style>
