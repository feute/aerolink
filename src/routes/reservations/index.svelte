<script lang="ts">
  import dayjs from 'dayjs';
  import dayjsUTC from 'dayjs/plugin/utc.js';
  import dayjsTz from 'dayjs/plugin/timezone.js';
  import dayjsRelativeTime from 'dayjs/plugin/relativeTime.js';
  import { onMount } from 'svelte';
  import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import ReservationItem from '$lib/components/ReservationItem.svelte';
  import type { User } from 'firebase/auth';

  const TIMEZONE = 'America/Mexico_City';

  onMount(() => {
    dayjs.extend(dayjsUTC);
    dayjs.extend(dayjsTz);
    dayjs.extend(dayjsRelativeTime);
    dayjs.tz.setDefault(TIMEZONE);
  });

  // Redirect back to home if unauthenticated.
  $: if (!$authStore.isLoading && !$authStore.user) {
    goto('/');
  }

  // Redirect back to home if user is not admin.
  $: if ($authStore.user && !$authStore.isAdmin) {
    goto('/');
  }

  async function getAdminStatus(user: User) {
    const token = await user.getIdTokenResult();

    return Boolean(token.claims.admin);
  }

  async function getReservations() {
    const q = query(collection(firestore, 'reservations'), orderBy('createdAt', 'desc'), limit(10));
    const snap = await getDocs(q);

    let _reservations: any[] = [];

    snap.forEach((doc) => {
      _reservations.push({ id: doc.id, ...doc.data() });
    });

    return _reservations;
  }

  let reservationsPromise;

  $: if (!reservationsPromise && !$authStore.isLoading && $authStore.user) {
    reservationsPromise = getReservations();
  }

  async function getNextRides() {
    const q = query(collection(firestore, 'reservations'), orderBy('pickupTime'), limit(10));
    const snap = await getDocs(q);

    let _reservations: any[] = [];

    snap.forEach((doc) => {
      _reservations.push({ id: doc.id, ...doc.data() });
    });

    return _reservations;
  }

  let nextRidesPromise;

  $: if (!nextRidesPromise && !$authStore.isLoading && $authStore.user) {
    nextRidesPromise = getNextRides();
  }
</script>

<svelte:head>
  <title>Reservations | Aerolink</title>
</svelte:head>

<section class="my-8 mx-auto flex max-w-7xl flex-col space-y-3 px-3 md:flex-row md:space-y-0">
  <section class="md:order-2 md:ml-8 md:w-2/5">
    {#if nextRidesPromise}
      <section class="rounded-lg border border-slate-200 px-5 py-4 shadow-sm">
        <h5 class="mb-4 text-xl font-bold">Next rides</h5>
        {#await nextRidesPromise}
          <p class="text-slate-500">Loading...</p>
        {:then reservations}
          {#if reservations}
            <section class="flex flex-col space-y-2">
              {#each reservations as reservation (reservation.id)}
                <ReservationItem
                  {reservation}
                  showTotal
                  timestamp={dayjs.unix(reservation.pickupTime.seconds).tz(TIMEZONE).fromNow()}
                />
              {:else}
                <p class="text-sm font-semibold text-slate-500">No reservations.</p>
              {/each}
            </section>
          {/if}
        {:catch error}
          <p>{error}</p>
          <p class="text-slate-500">Couldn't load your reservations.</p>
        {/await}
      </section>
    {/if}
  </section>
  <section class="flex-grow rounded-lg md:order-1">
    {#if reservationsPromise}
      <h2 class="mb-4 text-2xl font-bold">Reservations</h2>
      {#await reservationsPromise}
        <p class="text-slate-500">Loading reservations.</p>
      {:then reservations}
        {#if reservations}
          <section class="flex flex-col space-y-2">
            {#each reservations as reservation (reservation.id)}
              <ReservationItem
                {reservation}
                showTotal
                timestamp={dayjs.unix(reservation.createdAt.seconds).tz(TIMEZONE).fromNow()}
              />
            {:else}
              <p class="text-sm font-semibold text-slate-500">No reservations.</p>
            {/each}
          </section>
        {/if}
      {:catch}
        <p class="text-slate-500">Couldn't load your reservations.</p>
      {/await}
    {/if}
  </section>
</section>
