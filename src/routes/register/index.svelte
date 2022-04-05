<script lang="ts">
  import { logEvent, setUserId } from 'firebase/analytics';
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { auth, analytics } from '$lib/firebase';
  import { authStore } from '$lib/stores/auth';

  let loading = true;
  let errorCode = '';
  let email = '';
  let fullName = '';
  let password = '';

  authStore.subscribe((state) => {
    if (!state.isLoading) {
      if (state.user) {
        goto('/');
      } else {
        loading = false;
      }
    }
  });

  function getAuthErrorMessage(code: string) {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Email already in use.';
      case 'auth/invalid-email':
        return 'Invalid email';
      case 'auth/weak-password':
        return 'Weak password.';
    }
  }

  async function handleSubmit() {
    errorCode = '';
    loading = true;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdTokenResult();

      if (analytics) {
        setUserId(analytics, userCredential.user.uid);
        logEvent(analytics, 'sign_up', {
          method: 'Email',
        });
      }

      authStore.set({
        isLoading: false,
        isAdmin: Boolean(token.claims.admin),
        user: {
          ...userCredential.user,
          displayName: fullName,
        },
      });
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
    } catch (err) {
      console.log(err);
      errorCode = err.code;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Register | Aerolink</title>
</svelte:head>

<section class="mx-auto my-8 mb-4 max-w-md px-2 md:mb-6">
  <main class="rounded-md border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <h1 class="mb-4 text-2xl font-bold text-slate-800">Create an account</h1>

    {#if errorCode}
      <section
        class="my-4 flex items-center space-x-2 rounded-md border border-red-200 bg-red-100 px-3 py-2 text-sm font-semibold text-red-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="h-5 w-5"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
          />
        </svg>
        <span>{getAuthErrorMessage(errorCode)}</span>
      </section>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <section>
        <label for="full-name" class="mb-1 block text-slate-700">Full name</label>
        <input
          type="text"
          name="full-name"
          id="full-name"
          placeholder="Full name"
          required
          bind:value={fullName}
          disabled={loading}
        />
      </section>
      <section class="mt-3">
        <label for="email" class="mb-1 block text-slate-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          required
          bind:value={email}
          disabled={loading}
        />
      </section>
      <section class="mt-3">
        <label for="password" class="mb-1 block text-slate-700">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          required
          bind:value={password}
          disabled={loading}
        />
      </section>
      <section class="mt-4">
        <button type="submit" class="btn btn--primary" disabled={loading}>Register</button>
      </section>
    </form>
  </main>
</section>
