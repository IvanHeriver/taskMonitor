<script lang="ts">
  import type { tmTag, tmTask } from "../../types";
  import Tags from "./Tags.svelte";
  import Duration from "./Duration.svelte";
  export let allTags: Array<tmTag>;
  export let task: tmTask;
  export let mode: "edit" | "small" | "big" = "big";
</script>

<div class={`container ${mode}`} tabindex="0">
  {#if mode === "big"}
    <div class="title">{task.title}</div>
    <div class="date">{task.date.toLocaleDateString()}</div>
    <div class="duration">
      <Duration duration={task.duration} mode="normal" />
    </div>
    <div class="desc">{task.description}</div>
    <div class="tags">
      <Tags {allTags} tagsIds={task.tags_id} mode="big" />
    </div>
    <div class="created">
      {`Created: ${task.created?.toLocaleDateString()} ${task.created?.toLocaleTimeString()}`}
    </div>
    <div class="updated">
      {`Modified: ${task.updated?.toLocaleDateString()} ${task.updated?.toLocaleTimeString()}`}
    </div>
  {:else if mode === "small"}
    <div class="title">{task.title}</div>
    <div class="date">{task.date.toLocaleDateString()}</div>
    <div class="duration">
      <Duration duration={task.duration} mode="small" />
    </div>
    <div class="tags">
      <Tags {allTags} tagsIds={task.tags_id} mode="small" />
    </div>
  {:else}
    <!-- else content here -->
  {/if}
</div>

<style>
  .container:focus {
    outline: 1px solid var(--outline-highlight-color);
    outline-offset: -1px;
  }
  .container {
    display: grid;
    gap: 0.125rem;
    margin: 0.125rem;
    padding: 0.25rem;
    background-color: var(--btn-background-selected);
    overflow-x: auto;
  }
  .container.big {
    grid-template-areas:
      "title title"
      "date duration"
      "desc desc"
      "tags tags"
      "created updated";
  }
  .container.small {
    grid-template-areas: "date duration title  tags";
    column-gap: 0.5rem;
    grid-template-columns: 10ch 10ch auto max-content;
  }
  .title {
    grid-area: title;
    font-weight: 600;
    justify-self: start;
  }
  .date {
    grid-area: date;
  }
  .duration {
    grid-area: duration;
  }
  .big > .duration {
    justify-self: end;
  }
  .desc {
    grid-area: desc;
    font-weight: 100;
  }
  .tags {
    grid-area: tags;
  }
  .container.big > .tags {
    justify-self: start;
  }
  .created {
    grid-area: created;
  }
  .updated {
    grid-area: updated;
    justify-self: end;
  }

  .created,
  .updated {
    /* margin-top: 0.5rem; */
    font-size: 0.7rem;
    font-weight: 100;
  }
</style>
