<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
  import { firestore } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import ReservationStat from '$lib/components/ReservationStat.svelte';
  import type { User } from 'firebase/auth';
  import type { Unsubscribe } from 'firebase/firestore';

  let user: User;
  let loading = true;
  let loadingCheckout = false;
  let reservationData: any;
  let reservationUnsubscribe: any;
  let paymentSession: any;
  let paymentSessionUnsubscribe: Unsubscribe;

  authStore.subscribe((value) => {
    user = value.user;
  });

  $: if (paymentSession) {
    if (paymentSession.url) {
      window.location.assign(String(paymentSession.url));
    }
  }

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

  function getReservation() {
    reservationUnsubscribe = onSnapshot(doc(firestore, 'reservations', $page.params.id), (doc) => {
      reservationData = { id: doc.id, ...doc.data() };
      loading = false;
    });
  }

  async function createCheckoutSession() {
    if (!reservationData || !reservationData) {
      return;
    }

    loadingCheckout = true;
    const docRef = await addDoc(collection(firestore, 'customers', user.uid, 'checkout_sessions'), {
      mode: 'payment',
      price: reservationData.priceId, // One-time price created in Stripe
      success_url: window.location.href,
      cancel_url: window.location.href,
      billing_address_collection: 'auto',
      metadata: {
        userId: user.uid,
        placeId: reservationData?.placeId,
        reservationId: reservationData?.id,
      },
      createdAt: serverTimestamp(),
    });

    paymentSessionUnsubscribe = onSnapshot(
      doc(firestore, 'customers', user.uid, 'checkout_sessions', docRef.id),
      (doc) => {
        const data = doc.data();

        if (!data || data.error) {
          loadingCheckout = false;
        }

        paymentSession = data;
      }
    );
  }

  onMount(() => {
    getReservation();
  });

  onDestroy(() => {
    if (paymentSessionUnsubscribe) {
      paymentSessionUnsubscribe();
    }

    if (reservationUnsubscribe) {
      reservationUnsubscribe();
    }
  });
</script>

<svelte:head>
  <title>Reservation ID: {$page.params.id} | Aerolink</title>
</svelte:head>

<section class="my-6 mx-auto max-w-xl px-2 md:my-8">
  <main class="rounded-lg border border-slate-200 px-6 py-5 shadow-sm">
    <h2 class="text-center text-3xl font-bold">Reservation</h2>
    <p class="text-center text-sm font-medium tracking-wider text-slate-600">
      ID:
      <span class="text-slate-600">{$page.params.id}</span>
    </p>

    {#if loading}
      Loading...
    {:else if reservationData}
      <section class="mt-8">
        {#if !reservationData.paid}
          <section
            class="mb-6 px-4 py-2 flex items-center space-x-3 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="w-5 h-5"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
              />
            </svg>
            <p>The payment has not been confirmed yet.</p>
          </section>
        {:else}
          <section
            class="mb-6 px-4 py-2 flex space-x-3 rounded-md bg-green-100 text-green-700 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="mt-1 w-5 h-5 flex-shrink-0"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
              />
            </svg>
            <section class="flex flex-col">
              <p class="font-semibold">Reservation confirmed.</p>
              <p>
                You will receive a confirmation email and a WhatsApp message with all the contact
                information corresponding to the driver: name, photo, phone number and car info.
              </p>
            </section>
          </section>
        {/if}
        <section class="gap-4 grid grid-cols-2 sm:grid-cols-3">
          <ReservationStat
            label="Direction"
            value={getDirectionText(String(reservationData.direction))}
          />
          <div class="col-span-2">
            <ReservationStat label="Airport" value={reservationData.placeName} />
          </div>
          <div>
            <ReservationStat
              label="Fare type"
              value={getFareTypeText(String(reservationData.fareType))}
            />
          </div>
          <div><ReservationStat label="Passengers" value={reservationData.passengers} /></div>
          <div><ReservationStat label="Luggage" value={reservationData.luggage} /></div>
          <div><ReservationStat label="Cost" value={`$${reservationData.totalCost}`} /></div>
        </section>

        {#if !reservationData.paid}
          <section class="mt-8 sm:mt-10">
            <section class="mt-2 flex flex-col items-center">
              <button
                type="button"
                class="btn btn--primary flex items-center"
                disabled={loadingCheckout}
                on:click={createCheckoutSession}
              >
                Pay with Stripe
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="ml-2 h-4 w-4"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                  />
                  <path
                    fill-rule="evenodd"
                    d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                  />
                </svg>
              </button>
            </section>
          </section>
        {/if}
      </section>
    {:else}
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
    {/if}
  </main>
</section>
