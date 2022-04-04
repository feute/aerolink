<script lang="ts">
  export let reservation;
  export let showTotal = false;
  export let timestamp = null;

  function getDirectionText(str: string) {
    if (str === 'to') {
      return 'To SMA';
    } else if (str === 'from') {
      return 'From SMA';
    }
  }

  function getFareTypeText(str: string) {
    if (str === 'one-way') {
      return 'One way';
    } else if (str === 'round-trip') {
      return 'Round trip';
    }
  }
</script>

<a
  href={`/reservations/${reservation.id}`}
  class="group rounded-md border border-slate-200 px-3 py-2 shadow-sm transition hover:shadow md:flex md:items-center md:justify-between md:px-4 md:py-3"
>
  <section class="flex grow flex-col">
    <p class="text-sm font-semibold text-slate-700">ID: {reservation.id}</p>
    <section class="mt-1 flex flex-wrap items-center">
      {#if timestamp}
        <span class="mr-2 text-xs text-slate-500">
          {timestamp}
        </span>
      {/if}
      <span
        class="mr-2 rounded-full border border-indigo-200 bg-indigo-50 py-1 px-2 text-xs font-semibold text-indigo-600"
      >
        {getDirectionText(reservation.direction)}
      </span>
      <span
        class="mr-2 rounded-full border border-slate-200 bg-slate-50 py-1 px-2 text-xs font-semibold text-slate-600"
      >
        {getFareTypeText(reservation.fareType)}
      </span>
      {#if showTotal && reservation.totalCost}
        <span
          class="mr-2 rounded-full border border-green-200 bg-green-50 py-1 px-2 text-xs font-semibold text-green-600"
        >
          ${reservation.totalCost}
        </span>
      {/if}
    </section>
  </section>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    class="hidden h-5 w-5 flex-shrink-0 text-slate-400 md:group-hover:block"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
</a>
