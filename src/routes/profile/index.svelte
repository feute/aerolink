<script lang="ts">
  import { collection, getDocs, query, limit, orderBy, where } from 'firebase/firestore';
  import { goto } from '$app/navigation';
  import { firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import { signOut } from 'firebase/auth';
  import { auth } from '$lib/firebase';
  import ReservationItem from '$lib/components/ReservationItem.svelte';

  // Redirect back to home if unauthenticated.
  $: if (!$authStore.isLoading && !$authStore.user) {
    goto('/');
  }

  async function getReservations(userId: string) {
    const q = query(
      collection(firestore, 'reservations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);

    let _reservations: any[] = [];

    snap.forEach((doc) => {
      _reservations.push({ id: doc.id, ...doc.data() });
    });

    return _reservations;
  }

  let reservationsPromise: any;

  $: if (!reservationsPromise && !$authStore.isLoading && $authStore.user) {
    reservationsPromise = getReservations($authStore.user.uid);
  }
</script>

<svelte:head>
  <title>Profile | Aerolink</title>
</svelte:head>

{#if $authStore.isLoading}
  Loading
{:else if $authStore.user}
  <section class="my-8 px-3 max-w-7xl mx-auto flex flex-col md:flex-row space-y-3 md:space-y-0">
    <section class="md:ml-8 md:order-2 md:w-1/3">
      <section class="px-5 py-4 border border-slate-200 shadow-sm rounded-lg">
        <h5 class="text-xl font-bold">
          Signed in as
          {#if $authStore.user.isAnonymous}
            guest
          {:else}
            {$authStore.user.displayName}
          {/if}
        </h5>
        <section class="mt-4">
          <button
            type="button"
            on:click={() => signOut(auth)}
            class="btn bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-sm"
          >
            Sign out
          </button>
        </section>
      </section>
    </section>
    <section class="md:order-1 flex-grow rounded-lg">
      <h2 class="text-2xl font-bold mb-4">Reservations</h2>
      {#if reservationsPromise}
        {#await reservationsPromise}
          <p class="text-slate-500">Loading reservations.</p>
        {:then reservations}
          {#if reservations}
            <section class="flex flex-col space-y-2">
              {#each reservations as reservation (reservation.id)}
                <ReservationItem {reservation} />
              {/each}
            </section>
          {/if}
        {:catch}
          <p class="text-slate-500">Couldn't load your reservations.</p>
        {/await}
      {/if}
    </section>
  </section>
{/if}
