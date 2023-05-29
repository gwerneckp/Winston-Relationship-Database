import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export type userData = {
	id?: string;
	username?: string;
	role?: string;
};

export const userStore: Writable<userData> = writable({});
