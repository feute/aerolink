<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { doc, getDoc } from 'firebase/firestore';
  import { firestore } from '$lib/firebase';
  import ReservationStat from '$lib/components/ReservationStat.svelte';

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

  async function getReservation() {
    const docRef = doc(firestore, 'reservations', $page.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Reservation not found.');
    }
  }

  let reservationPromise;

  onMount(() => {
    reservationPromise = getReservation();
  });
</script>

<svelte:head>
  <title>Reservation ID: {$page.params.id} | Aerolink</title>
</svelte:head>

<section class="my-8 mx-auto max-w-7xl px-3">
  <h1 class="text-xl font-bold text-slate-900">
    Reservation ID:
    <span class="text-slate-600">{$page.params.id}</span>
  </h1>

  {#await reservationPromise}
    Loading...
  {:then reservation}
    {#if reservation}
      <section class="mt-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
        <ReservationStat
          label="Direction"
          value={getDirectionText(String(reservation.direction))}
        />
        <ReservationStat label="Fare type" value={getFareTypeText(String(reservation.fareType))} />
        <ReservationStat label="Passengers" value={reservation.passengers} />
        <ReservationStat label="Luggage" value={reservation.luggage} />
      </section>
    {/if}
  {:catch}
    <section
      class="mt-6 px-4 py-2 flex items-center space-x-3 rounded-md bg-orange-200 text-orange-800 text-sm font-semibold"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        class="w-5 h-5"
        viewBox="0 0 16 16"
      >
        <path
          d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
        />
      </svg>
      <span>Reservation not found.</span>
    </section>
  {/await}
</section>
