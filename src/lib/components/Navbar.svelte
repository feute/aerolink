<script lang="ts">
  import logo from '$lib/assets/logo.png';
  import { fly } from 'svelte/transition';
  import { authStore } from '$lib/stores/auth';

  let showMenu = false;
</script>

<!-- This example requires Tailwind CSS v2.0+ -->
<div class="relative bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">
    <div
      class="flex items-center justify-between border-b-2 border-slate-100 py-6 md:justify-start md:space-x-10"
    >
      <div class="flex justify-start lg:w-0 lg:flex-1">
        <a href="/">
          <span class="sr-only">Aerolink</span>
          <img class="h-8 w-auto sm:h-10" src={logo} alt="Logo" />
        </a>
        <nav class="ml-2 flex items-center lg:ml-10">
          {#if $authStore.isAdmin}
            <a
              href="/reservations"
              class="ml-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Reservations
            </a>
          {/if}
          <a
            href="/faqs"
            class="ml-3 hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700 md:inline"
          >
            FAQs
          </a>
          <a
            href="/terms"
            class="ml-3 hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700 md:inline"
          >
            Terms and Conditions
          </a>
        </nav>
      </div>
      <div class="-my-2 -mr-2 md:hidden">
        <button
          type="button"
          on:click={() => (showMenu = true)}
          class="inline-flex items-center justify-center rounded-md bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-expanded="false"
        >
          <span class="sr-only">Open menu</span>
          <!-- Heroicon name: outline/menu -->
          <svg
            class="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
        {#if $authStore.user}
          <a
            href="/profile"
            class="flex items-center justify-center space-x-1 rounded-full bg-slate-50 py-2 px-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:shadow hover:ring-slate-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="h-4 w-4"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              />
            </svg>
            <span>
              {#if $authStore.user.isAnonymous}
                Guest
              {:else if $authStore.user.displayName}
                {$authStore.user.displayName.split(' ')[0]}
              {/if}
            </span>
          </a>
        {:else}
          <a
            href="/register"
            class="rounded-md px-3 py-2 whitespace-nowrap text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            Register
          </a>
          <a href="/login" class="btn btn--primary ml-6">Sign in</a>
        {/if}
      </div>
    </div>
  </div>

  <!--
    Mobile menu, show/hide based on mobile menu state.

    Entering: "duration-200 ease-out"
      From: "opacity-0 scale-95"
      To: "opacity-100 scale-100"
    Leaving: "duration-100 ease-in"
      From: "opacity-100 scale-100"
      To: "opacity-0 scale-95"
  -->
  {#if showMenu}
    <div
      transition:fly={{ y: 10, duration: 100 }}
      class="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden"
    >
      <div
        class="divide-y-2 divide-slate-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="px-5 pt-5 pb-6">
          <div class="flex items-center justify-between">
            <div>
              <img class="h-8 w-auto" src={logo} alt="Logo" />
            </div>
            <div class="-mr-2">
              <button
                type="button"
                on:click={() => (showMenu = false)}
                class="inline-flex items-center justify-center rounded-md bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span class="sr-only">Close menu</span>
                <!-- Heroicon name: outline/x -->
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6">
            <nav class="grid gap-y-8">
              <a
                href="/reservations"
                class="ml-3 rounded-md px-1 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700"
              >
                Reservations &rarr;
              </a>
            </nav>
          </div>
        </div>
        <div class="space-y-6 py-6 px-5">
          <div class="grid grid-cols-2 gap-y-1 gap-x-8">
            <a
              href="/faqs"
              class="ml-3 rounded-md px-1 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700"
            >
              FAQs
            </a>
            <a
              href="/terms"
              class="col-span-2 ml-3 rounded-md px-1 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-700"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
        <div class="space-y-6 py-6 px-5">
          {#if $authStore.user}
            <div>
              <p class="text-center text-base font-semibold text-slate-700">
                Signed in as
                {#if $authStore.user.isAnonymous}
                  guest
                {:else}
                  {$authStore.user.displayName}
                {/if}
              </p>

              <a
                href="/profile"
                class="btn mt-4 block  rounded-md border border-indigo-300 bg-indigo-100 px-3 py-2 text-center text-indigo-700 shadow-sm"
              >
                Go to profile &rarr;
              </a>
            </div>
          {:else}
            <div class="grid grid-cols-2 gap-y-4 gap-x-8" />
            <div>
              <a
                href="/register"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Register
              </a>
              <p class="mt-6 text-center text-base font-medium text-slate-500">
                Existing user?
                <a href="/login" class="text-indigo-600 hover:text-indigo-500"> Sign in &rarr; </a>
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>
