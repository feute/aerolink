<script lang="ts">
  import dayjs from 'dayjs';
  import dayjsUTC from 'dayjs/plugin/utc.js';
  import dayjsTz from 'dayjs/plugin/timezone.js';
  import dayjsRelativeTime from 'dayjs/plugin/relativeTime.js';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { collection, getDocs, orderBy, query, limit, where } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import ReservationItem from '$lib/components/ReservationItem.svelte';
  import type { QueryConstraint } from 'firebase/firestore';

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

  let showUnconfirmed = false;

  async function getReservations() {
    let constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(20)];

    if (!showUnconfirmed) {
      constraints.push(where('paid', '==', true));
    }

    const q = query(collection(firestore, 'reservations'), ...constraints);
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
    const q = query(
      collection(firestore, 'reservations'),
      where('paid', '==', true),
      orderBy('pickupTime'),
      limit(10)
    );
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
                  showPaid
                  timestamp={dayjs.unix(reservation.pickupTime.seconds).tz(TIMEZONE).fromNow()}
                />
              {:else}
                <p class="text-sm font-semibold text-slate-500">No reservations.</p>
              {/each}
            </section>
          {/if}
        {:catch}
          <p class="text-slate-500">Couldn't load your reservations.</p>
        {/await}
      </section>
    {/if}
  </section>
  <section class="flex-grow rounded-lg md:order-1">
    {#if reservationsPromise}
      <h2 class="mb-4 text-2xl font-bold">Reservations</h2>
      <section class="mb-4">
        <span class="switch-unconfirmed-wrapper">
          <input
            type="checkbox"
            id="switch-unconfirmed"
            bind:checked={showUnconfirmed}
            on:change={() => (reservationsPromise = getReservations())}
            class="invisible absolute h-0 w-0"
          />
          <label for="switch-unconfirmed" class="switch-unconfirmed">
            {#if showUnconfirmed}
              <svg
                transition:fly={{ x: -6, duration: 100 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="h-4 w-4 flex-shrink-0"
                viewBox="0 0 16 16"
              >
                <path
                  d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"
                />
              </svg>
            {/if}
            <span> Show unconfirmed reservations </span>
          </label>
        </span>
      </section>
      {#await reservationsPromise}
        <p class="text-slate-500">Loading reservations.</p>
      {:then reservations}
        {#if reservations}
          <section class="flex flex-col space-y-2">
            {#each reservations as reservation (reservation.id)}
              <ReservationItem
                {reservation}
                showTotal
                showPaid
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

<style lang="postcss">
  .switch-unconfirmed {
    @apply inline-flex cursor-pointer items-center space-x-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-600 transition;
  }

  .switch-unconfirmed-wrapper input:checked + label {
    @apply border-green-300 bg-green-200 text-green-800;
  }
</style>
