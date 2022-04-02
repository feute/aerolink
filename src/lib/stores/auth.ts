import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export type TAuthStore = {
  user?: User;
  isLoading: boolean;
};

const initialState = {
  isLoading: true,
};

export const authStore = writable<TAuthStore>(initialState);
