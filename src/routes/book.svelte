<script lang="ts">
  import { onMount } from 'svelte';
  import { addDoc, collection, getDocs, query, serverTimestamp } from 'firebase/firestore';
  import { firestore } from '$lib/firebase';

  let places: any;

  // Form inputs.
  let direction = 'from';
  let fareType = 'one-way';
  let placeId = '';
  let address = '';

  async function getPlaces() {
    const q = query(collection(firestore, 'places'));

    const snapshot = await getDocs(q);

    let _places: any = [];

    snapshot.forEach((doc) => {
      _places.push({ id: doc.id, ...doc.data() });
    });

    console.log(_places);

    return _places;
  }

  async function handleSubmit() {
    await addDoc(collection(firestore, 'reservations'), {
      direction,
      fareType,
      placeId,
      address,
      createdAt: serverTimestamp(),
    });

    alert('Saved');
  }

  onMount(() => {
    places = getPlaces();
  });
</script>

<svelte:head>
  <title>Book now</title>
</svelte:head>

<a href="/" sveltekit:prefetch>Go back</a>

<h1>Book now</h1>

<form on:submit|preventDefault={handleSubmit}>
  <div>
    <input type="radio" id="direction-from" name="direction" value="from" bind:group={direction} />
    <label for="direction-from">From SMA</label>

    <input type="radio" id="direction-to" name="direction" value="to" bind:group={direction} />
    <label for="direction-to">To SMA</label>
  </div>

  <div>
    <input
      type="radio"
      id="fare-type-one-way"
      name="fare-type"
      value="one-way"
      bind:group={fareType}
    />
    <label for="fare-type-one-way">One way</label>

    <input
      type="radio"
      id="fare-type-round-trip"
      name="fare-type"
      value="round-trip"
      bind:group={fareType}
    />
    <label for="fare-type-round-trip">Round trip</label>
  </div>

  <div>
    <select required value={placeId}>
      {#await places}
        <option value="">Loading...</option>
      {:then result}
        <option value="">Select airport</option>
        {#if result}
          {#each result as place (place.id)}
            <option value={place.id}>
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
  </div>

  <div>
    <label for="address">Address</label>
    <input type="text" name="address" id="address" bind:value={address} required />
  </div>

  <button type="submit">Submit</button>
</form>
