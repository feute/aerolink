<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import Navbar from '$lib/components/Navbar.svelte';

  onMount(() => {
    onAuthStateChanged(auth, async (user) => {
      let token;

      if (user) {
        token = await user.getIdTokenResult();
      }

      authStore.set({
        user,
        isLoading: false,
        isAdmin: token ? Boolean(token.claims.admin) : false,
      });
    });
  });
</script>

<Navbar />

<slot />
