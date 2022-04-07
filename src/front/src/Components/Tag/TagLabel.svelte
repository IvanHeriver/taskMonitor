<script lang="ts">
  import type { tmTag } from "../../types";

  export let tag: tmTag;
  export let mode: "small" | "big" = "big";
</script>

<div class="container">
  {tag.name}
</div>
