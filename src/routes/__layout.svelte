<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { onAuthStateChanged } from 'firebase/auth';
  import { setUserId, setUserProperties } from 'firebase/analytics';
  import { auth, analytics } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

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

      if (analytics) {
        setUserId(analytics, user ? user.uid : '');
        if (user && user.isAnonymous) {
          setUserProperties(analytics, { anonymous: true });
        }
      }
    });
  });
</script>

<section class="flex min-h-screen flex-col">
  <Navbar />

  <section class="grow">
    <slot />
  </section>

  <Footer />
</section>
