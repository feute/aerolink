<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import Navbar from '$lib/components/Navbar.svelte';

  onMount(() => {
    onAuthStateChanged(auth, (user) => {
      authStore.set({
        user,
        isLoading: false,
      });
    });
  });
</script>

<Navbar />

<slot />
