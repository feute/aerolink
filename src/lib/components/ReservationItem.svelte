<script>
  export let reservation;
</script>

<a
  href={`/reservations/${reservation.id}`}
  class="group rounded-md border border-slate-200 px-3 py-2 shadow-sm transition hover:shadow md:flex md:justify-between md:px-4 md:py-3"
>
  <p class="text-sm font-medium">ID: {reservation.id}</p>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    class="hidden h-5 w-5 text-slate-400 md:group-hover:block"
    viewBox="0 0 16 16"
  >
    <path
      fill-rule="evenodd"
      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
    />
  </svg>
</a>
