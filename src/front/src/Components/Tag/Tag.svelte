<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { ITag } from "../../types";
  import TagView from "./TagView.svelte";
  import TagEdit from "./TagEdit.svelte";
  import { createEventDispatcher } from "svelte";
  import { question, registerModification } from "../../stores";
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
          // registerModification()
          eventDispatcher("save", newTag);
          // tag = newTag;
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
        console.log(res);
        if (res.response === 0) {
          deleteTag(tag.id);
        }
        // $question = {
        //   title: `Delete tag '${tag.name}'?`,
        //   question: `Are you sure you want to delete the tag '${tag.name}'?`,
        //   answer(res) {
        //     if (res) {
        //       deleteTag(tag.id);
        //     }
        //   },
        // };
      }}
    />
  {/if}
</div>

<style>
  .container {
    padding: 0 0.25rem;
    padding-top: 0.25rem;
    min-width: 200px;
    user-select: none;
  }
  .container:first-child {
    padding-top: 0;
  }
</style>
