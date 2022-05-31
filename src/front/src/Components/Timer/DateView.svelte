<script lang="ts">
  export let date: string;
</script>

<div class="container">
  <div class="date">{new Date(date).toLocaleDateString()}</div>
  <div class="time">{new Date(date).toLocaleTimeString()}</div>
</div>

<style>
  .container {
    display: flex;
    /* padding: 0 0.5rem; */
    padding-right: 0.5rem;
  }
  .date {
    margin-right: 0.5rem;
  }
</style>
