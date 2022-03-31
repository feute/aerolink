<script>
  export let label;
  export let value;
</script>

<section
  class="rounded-md border border-slate-300 px-5 py-3 shadow-sm transition-shadow hover:shadow"
>
  <h5 class="font-bold text-slate-500">{label}</h5>
  <p class="text-2xl font-semibold">{value}</p>
</section>
