<svelte:head>
  <title>Book now</title>
</svelte:head>

<a href="/" sveltekit:prefetch>Go back</a>

<h1>Book now</h1>

<form>
  <div>
    <input type="radio" id="direction-from" name="direction" value="from" />
    <label for="direction-from">From SMA</label>

    <input type="radio" id="direction-to" name="direction" value="to" />
    <label for="direction-to">To SMA</label>
  </div>

  <div>
    <input type="radio" id="fare-type-one-way" name="fare-type" value="one-way" />
    <label for="fare-type-one-way">One way</label>

    <input type="radio" id="fare-type-round-trip" name="fare-type" value="round-trip" />
    <label for="fare-type-round-trip">Round trip</label>
  </div>

  <div>
    <select>
      <option value="">Select airport</option>
      <option value="aiq">Aeropuerto Internacional de Queretaro (AIQ)</option>
      <option value="bjx">Aeropuerto Internacaional del Bajio (BJX)</option>
      <option value="aicm">Aeropuerto Internacional de Ciudad de Mexico (AICM)</option>
    </select>
  </div>

  <div>
    <label for="address">Address</label>
    <input type="text" name="address" id="address" />
  </div>

  <button type="submit">Submit</button>
</form>
