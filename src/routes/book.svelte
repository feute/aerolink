<script lang="ts">
  import 'flatpickr/dist/flatpickr.css';
  import dayjs from 'dayjs';
  import dayjsUTC from 'dayjs/plugin/utc.js';
  import dayjsTz from 'dayjs/plugin/timezone.js';
  import Flatpickr from 'svelte-flatpickr';
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { signInAnonymously } from 'firebase/auth';
  import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
  import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
  } from 'firebase/firestore';
  import { authStore } from '$lib/stores/auth';
  import { auth, firestore, analytics } from '$lib/firebase';
  import type { Dayjs } from 'dayjs';
  import type { Options } from 'flatpickr/dist/types/options';

  const TIMEZONE = 'America/Mexico_City';

  let minDate: Dayjs;

  let error = '';
  let places: any;
  let loading = false;

  // Form inputs.
  let direction = 'from';
  let fareType = 'one-way';
  let selectedPlace: any = '';
  let address = '';
  let flightNumber = '';
  let luggage = 0;
  let passengers = 1;
  let firstName = '';
  let lastName = '';
  let phoneNumber = '';
  let email = $authStore.user ? $authStore.user.email : '';
  let pickupTime: Date;
  let returnTime: Date;

  let totalCost = tweened(0, {
    duration: 200,
    easing: cubicOut,
  });
  let pickupDateOptions: Partial<Options> = {
    enableTime: true,
    altInput: true,
    altFormat: 'F j, h:i K',
    // minDate: minDate.toDate(),
  };
  let returnDateOptions: Partial<Options> = {
    enableTime: true,
    altInput: true,
    altFormat: 'F j, h:i K',
    // minDate: minDate.add(1, 'hours').toDate(),
  };

  $: if (selectedPlace && fareType) {
    getTotalCost();
  }

  function localDate() {
    let mxnDate = dayjs().tz(TIMEZONE);
    let dateTime = dayjs()
      .set('date', mxnDate.get('date'))
      .set('year', mxnDate.get('year'))
      .set('month', mxnDate.get('month'))
      .set('day', mxnDate.get('day'))
      .set('hour', mxnDate.get('hour'))
      .set('minute', mxnDate.get('minute'))
      .toDate();

    return dateTime;
  }

  function transformToMexicoTimezone(date: Date) {
    let _date = dayjs(date);
    let newDate = dayjs(date)
      .tz(TIMEZONE)
      .set('date', _date.get('date'))
      .set('year', _date.get('year'))
      .set('month', _date.get('month'))
      .set('day', _date.get('day'))
      .set('hour', _date.get('hour'))
      .set('minute', _date.get('minute'));

    return newDate;
  }

  function getTotalCost() {
    if (!selectedPlace || !fareType) {
      totalCost.set(0);
    }

    if (fareType === 'round-trip') {
      totalCost.set(selectedPlace.price * 2);
    } else {
      totalCost.set(selectedPlace.price);
    }
  }

  async function getPlaces() {
    const q = query(collection(firestore, 'places'));

    const snapshot = await getDocs(q);

    let _places: any = [];

    snapshot.forEach((doc) => {
      _places.push({ id: doc.id, ...doc.data() });
    });

    return _places;
  }

  async function handleSubmit() {
    error = '';

    let _user = $authStore.user;

    if (!selectedPlace) {
      return;
    }

    loading = true;

    if (!_user) {
      try {
        const userCredential = await signInAnonymously(auth);
        _user = userCredential.user;

        if (analytics) {
          setUserId(analytics, _user.uid);
          setUserProperties(analytics, { anonymous: true });
        }
      } catch (err) {
        loading = false;
        return;
      }
    }

    let priceId = selectedPlace.oneWayPriceId;

    if (fareType === 'round-trip') {
      priceId = selectedPlace.roundTripPriceId;
    }

    let _minDate = dayjs(localDate()).add(5, 'hours').add(50, 'minutes');

    if (!pickupTime || _minDate.isAfter(pickupTime)) {
      error = 'You must set a new pickup time';
      minDate = dayjs(localDate()).add(6, 'hours');
      loading = false;
      return;
    }

    let _returnTime;

    if (fareType === 'round-trip') {
      if (!returnTime || _minDate.isAfter(returnTime)) {
        error = 'You must set a new return time';
        minDate = dayjs(localDate()).add(6, 'hours');
        loading = false;
        return;
      }

      _returnTime = transformToMexicoTimezone(returnTime).valueOf();
    }

    let _pickupTime = transformToMexicoTimezone(pickupTime).valueOf();

    try {
      const reservationRef = await addDoc(collection(firestore, 'reservations'), {
        userId: _user.uid,
        direction,
        fareType,
        priceId,
        placeId: selectedPlace.id,
        placeName: selectedPlace.name,
        placeIsAirport: selectedPlace.isAirport || true,
        passengers,
        luggage,
        totalCost: $totalCost,
        pickupTime: Timestamp.fromMillis(_pickupTime),
        returnTime: _returnTime ? Timestamp.fromMillis(_returnTime) : null,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(firestore, 'reservationsPrivate'), {
        userId: _user.uid,
        reservationId: reservationRef.id,
        address,
        flightNumber,
        phoneNumber,
        firstName,
        lastName,
        email,
        createdAt: serverTimestamp(),
      });

      if (analytics) {
        logEvent(analytics, 'generate_lead', {
          currency: 'USD',
          value: $totalCost,
        });
      }

      goto(`/reservations/${reservationRef.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    dayjs.extend(dayjsUTC);
    dayjs.extend(dayjsTz);

    dayjs.tz.setDefault('America/Mexico_City');

    minDate = dayjs(localDate()).add(6, 'hours');
    pickupTime = minDate.toDate();
    returnTime = minDate.add(1, 'hours').toDate();
    pickupDateOptions.minDate = minDate.toDate();
    returnDateOptions.minDate = minDate.add(1, 'hours').toDate();
    places = getPlaces();
  });
</script>

<svelte:head>
  <meta
    name="description"
    content="Traveling within a group? On your own? We offer safe and reliable airport and city-to-city
  transfers, as well as rides to touristic points of interest."
  />
  <title>Book now | Aerolink</title>
</svelte:head>

<section class="mx-auto mt-8 max-w-3xl px-3">
  <h1 class="text-center text-3xl font-extrabold md:text-4xl">Plan your trip</h1>

  <p class="mt-4 text-center text-base font-medium text-slate-600">
    Traveling within a group? On your own? We offer safe and reliable airport and city-to-city
    transfers, as well as rides to touristic points of interest. We've got options to fit your
    budget and travel plans.
  </p>

  <p class="mt-2 text-center text-base font-medium text-slate-600">
    Having no airport of its own, we understand that finding a way to get to San Miguel de Allende
    from one of the city's neighboring airports can be hectic. With Aerolink's non-stop service,
    you'll have the comfort and peace of mind of a guaranteed, safe and reliable ride.
  </p>
</section>

<div class="pattern-bg relative -z-10 -mt-20 h-72 border-b-2 border-slate-100">
  <div class="absolute inset-0 bg-gradient-to-b from-white via-transparent" />
</div>

<section class="mx-auto -mt-44 mb-4 max-w-xl px-2 md:mb-6">
  <main class="rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <h1 class="text-2xl font-bold">Book now</h1>

    <form on:submit|preventDefault={handleSubmit}>
      <section class="relative mt-5 flex items-stretch space-x-2 sm:space-x-4">
        <section class="direction-field-wrapper flex-1">
          <input
            type="radio"
            id="direction-from"
            name="direction"
            value="from"
            bind:group={direction}
            class="invisible h-0 w-0"
          />
          <label for="direction-from">
            <!-- Check icon-->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="check-icon absolute top-2 right-2 h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
              />
            </svg>
            <!-- Direction icon-->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="mb-2 h-6 w-6 md:h-8 md:w-8"
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
            Travel from SMA
          </label>
        </section>

        <section class="direction-field-wrapper flex-1">
          <input
            type="radio"
            id="direction-to"
            name="direction"
            value="to"
            bind:group={direction}
          />
          <label for="direction-to">
            <!-- Check icon-->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="check-icon absolute top-2 right-2 h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
              />
            </svg>
            <!-- Direction icon-->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="mb-2 h-6 w-6 md:h-8 md:w-8"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M9.636 2.5a.5.5 0 0 0-.5-.5H2.5A1.5 1.5 0 0 0 1 3.5v10A1.5 1.5 0 0 0 2.5 15h10a1.5 1.5 0 0 0 1.5-1.5V6.864a.5.5 0 0 0-1 0V13.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
              />
              <path
                fill-rule="evenodd"
                d="M5 10.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1H6.707l8.147-8.146a.5.5 0 0 0-.708-.708L6 9.293V5.5a.5.5 0 0 0-1 0v5z"
              />
            </svg>
            Travel to SMA
          </label>
        </section>
      </section>

      <section class="mt-3 flex space-x-2 rounded-lg bg-slate-100 p-1 sm:space-x-4">
        <section class="fare-type-field-wrapper flex-1">
          <input
            type="radio"
            id="fare-type-one-way"
            name="fare-type"
            value="one-way"
            bind:group={fareType}
          />
          <label for="fare-type-one-way">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="h-5 w-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M7.293.707A1 1 0 0 0 7 1.414V4H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h5v6h2v-6h3.532a1 1 0 0 0 .768-.36l1.933-2.32a.5.5 0 0 0 0-.64L13.3 4.36a1 1 0 0 0-.768-.36H9V1.414A1 1 0 0 0 7.293.707z"
              />
            </svg>
            <span>One way</span>
          </label>
        </section>

        <section class="fare-type-field-wrapper flex-1">
          <input
            type="radio"
            id="fare-type-round-trip"
            name="fare-type"
            value="round-trip"
            bind:group={fareType}
          />
          <label for="fare-type-round-trip">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="h-5 w-5"
              viewBox="0 0 16 16"
            >
              <path
                d="M7 16h2V6h5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.8 2.4A1 1 0 0 0 14 2H9v-.586a1 1 0 0 0-2 0V7H2a1 1 0 0 0-.8.4L.225 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4h5v5z"
              />
            </svg>
            <span>Round trip</span>
          </label>
        </section>
      </section>

      <section class="mt-3 sm:flex sm:space-x-4">
        <section class="w-full">
          <label for="place-select" class="mb-1 block">Select airport</label>
          <select required id="place-select" bind:value={selectedPlace}>
            {#await places}
              <option value="">Loading...</option>
            {:then result}
              <option value=""> Select airport </option>
              {#if result}
                {#each result as place (place.id)}
                  <option value={place}>
                    {place.name}
                    {#if place.code}
                      ({place.code})
                    {/if}
                  </option>
                {/each}
              {/if}
            {:catch}
              <option value="">Error</option>
            {/await}
          </select>
        </section>
        <section class="mt-3 w-full sm:mt-0">
          <label for="flight-number" class="mb-1 block">Flight number</label>
          <input
            type="text"
            name="flight-number"
            id="flight-number"
            bind:value={flightNumber}
            required
          />
        </section>
      </section>

      <section class="mt-3">
        <label for="address" class="mb-1 block">Address in SMA</label>
        <input type="text" name="address" id="address" bind:value={address} required />
      </section>

      <section class="mt-3 sm:flex sm:space-x-4">
        <section class="w-full">
          <label for="passengers" class="mb-1 block">Passengers</label>
          <input
            type="number"
            min="1"
            max="4"
            name="passengers"
            id="passengers"
            bind:value={passengers}
            required
          />
        </section>
        <section class="mt-3 w-full sm:mt-0">
          <label for="luggage" class="mb-1 block">Luggage</label>
          <input
            type="number"
            min="0"
            max="4"
            name="luggage"
            id="luggage"
            bind:value={luggage}
            required
          />
        </section>
      </section>

      <section class="mt-3 sm:flex sm:space-x-4">
        <section class="w-full">
          <label for="pickupTime" class="mb-1 block">Pickup time</label>
          <Flatpickr id="pickupTime" options={pickupDateOptions} bind:value={pickupTime} />
        </section>
        {#if fareType === 'round-trip'}
          <section class="mt-3 w-full sm:mt-0">
            <label for="returnTime" class="mb-1 block">Return time</label>
            <Flatpickr id="returnTime" options={returnDateOptions} bind:value={returnTime} />
          </section>
        {/if}
      </section>

      <div class="mt-4 flex items-center space-x-2">
        <h5 class="text-lg font-semibold text-slate-600">Personal information</h5>
        <hr class="grow border-slate-300" />
      </div>

      <section class="mt-3 sm:flex sm:space-x-4">
        <section class="w-full">
          <label for="first-name" class="mb-1 block">First name</label>
          <input type="text" name="first-name" id="first-name" bind:value={firstName} required />
        </section>
        <section class="mt-3 w-full sm:mt-0">
          <label for="last-name" class="mb-1 block">Last name</label>
          <input type="text" name="last-name" id="last-name" bind:value={lastName} required />
        </section>
      </section>

      <section class="mt-3 sm:flex sm:space-x-4">
        <section class="w-full">
          <label for="phone-number" class="mb-1 block">Phone number</label>
          <input
            type="tel"
            name="phone-number"
            id="phone-number"
            bind:value={phoneNumber}
            required
          />
        </section>
        <section class="mt-3 w-full sm:mt-0">
          <label for="email" class="mb-1 block">Email</label>
          <input type="email" name="email" id="email" bind:value={email} required />
        </section>
      </section>

      {#if selectedPlace}
        <p
          in:fly={{ y: 3, duration: 200 }}
          out:fly={{ y: 3, duration: 100 }}
          class="mt-4 font-semibold text-gray-600"
        >
          Total: ${Math.floor($totalCost)}
        </p>
      {/if}

      {#if error}
        <section
          class="my-4 rounded-md border border-red-200 bg-red-100 px-3 py-2 text-sm font-semibold text-red-800"
        >
          {error}
        </section>
      {/if}

      <section class="mt-3">
        <button type="submit" class="btn btn--primary px-5 py-2 text-base" disabled={loading}
          >Book now</button
        >
      </section>
    </form>
  </main>
</section>

<style lang="postcss">
  .pattern-bg {
    background-color: #ffffff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%2394A3B8' fill-opacity='0.17'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
