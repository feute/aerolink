import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export type TAuthStore = {
  user?: User;
  isLoading: boolean;
  isAdmin: boolean;
};

const initialState = {
  isLoading: true,
  isAdmin: false,
};

export const authStore = writable<TAuthStore>(initialState);
