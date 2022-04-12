<script>
  export let label;
  export let value;
</script>

<section>
  <h5 class="text-sm font-semibold text-slate-500">{label}</h5>
  <p class="truncate font-bold text-slate-900" title={value}>{value}</p>
</section>
