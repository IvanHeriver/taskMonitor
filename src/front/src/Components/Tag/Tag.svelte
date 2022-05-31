<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ITag } from "../../types";
  import TagView from "./TagView.svelte";
  import TagEdit from "./TagEdit.svelte";
  import { createEventDispatcher } from "svelte";
  const eventDispatcher = createEventDispatcher();

  export let tag: ITag;
  export let mode: "edit" | "view";

  function deleteTag(tag_id) {
    eventDispatcher("delete", tag_id);
  }
</script>

<div class="container">
  {#if mode === "edit"}
    <TagEdit
      {tag}
      on:cancel={() => {
        if (tag === null) {
          eventDispatcher("new");
        } else {
          mode = "view";
        }
      }}
      on:save={(event) => {
        const newTag = event.detail;
        if (tag === null) {
          eventDispatcher("new", newTag);
        } else {
          eventDispatcher("save", newTag);
          mode = "view";
        }
      }}
    />
  {:else}
    <TagView
      {tag}
      on:edit={() => (mode = "edit")}
      on:delete={async () => {
        const res = await window.electronAPI.askQuestion({
          message: $_("messages.delete_tag"),
          buttons: [$_("yes"), $_("cancel")],
          cancelID: 1,
        });
        if (res.response === 0) {
          deleteTag(tag.id);
        }
      }}
    />
  {/if}
</div>

<style>
</style>
