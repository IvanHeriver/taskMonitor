<script lang="ts">
  interface IbarChartItem {
    date: Date;
    value: number;
    color: string;
  }
  export let items: Array<IbarChartItem>;

  $: {
    let timeRange = [];
    let timeMin: Date;
    let timeMax: Date;
    items.forEach((i) => {
      if (!timeMin && !timeMax) {
        timeMin = i.date;
        timeMax = i.date;
        // timeMax.setDate(timeMax.getDate() + 1)
      } else {
        if (timeMin > i.date) {
          timeMin = i.date;
        }
        if (timeMax > i.date) {
          timeMax = i.date;
        }
      }
      timeRange;
    });
  }
</script>
