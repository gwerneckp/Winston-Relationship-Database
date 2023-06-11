<script lang="ts">
	import { gql } from '@apollo/client';
	import { client } from '$lib/apolloClient';
	import type { Person } from '$lib/types/person';
	import Id from '../Id.svelte';
	import { fade } from 'svelte/transition';

	export let person: Person;

	const updatePerson = (person: Person) => gql`
        mutation {
            updatePeople(
                where: { id: "${person.id}" }
                update: {
                    name: "${person.name}"
                    grade: "${person.grade}"
                    school: "${person.school}"
                    email: "${person.email}"
                    anonymous: ${person.anonymous}
                }
            ) {
                people {
                    id
                }
            }
        }`;

	let success: string;
	let error: string;

	const updateInfo = () => {
        if (person.name.match(/^[A-zÀ-ú ]*$/) === null) {
            error = 'Name can only contain letters and spaces';
            return;
        }

        if (person.grade.match(/^Y[0-9]*$/) === null) {
            error = 'Grade must be in the format Y<number>';
            return;
        }

        if (person.school.match(/^[A-zÀ-ú ]*$/) === null) {
            error = 'School can only contain letters and spaces';
            return;
        }

        if (person.email.match(/^[A-zÀ-ú0-9@.]*$/) === null) {
            error = 'Email can only contain letters, numbers, @, and .';
            return;
        }

		client
			.mutate({
				mutation: updatePerson(person)
			})
			.then((result) => {
				if (result.data.updatePeople.people.length > 0) {
					success = 'Successfully updated info';
					error = '';

					setTimeout(() => {
						success = '';
					}, 3000);
				} else {
					success = '';
					error = 'Error updating info';
				}
			});
	};
</script>

<h1 class="font-bold flex items-center">
	<input
		type="text"
		class="input input-md text-lg focus:outline-none mr-2"
		bind:value={person.name}
	/>
	<Id id={person.id} />
</h1>
<div class="p-3" />

<p class="text-content flex items-center">
	<span class="w-20">Grade:</span>
	<input
		pattern="Y[0-9]*"
		type="text"
		class="input input-sm focus:outline-none"
		bind:value={person.grade}
	/>
</p>
<div class="p-1" />

<p class="text-content flex items-center">
	<span class="w-20">School:</span>
	<input type="text" class="input input-sm focus:outline-none" bind:value={person.school} />
</p>
<div class="p-1" />

<p class="text-content flex items-center">
	<span class="w-20">Email:</span>
	<input type="text" class="input input-sm focus:outline-none" bind:value={person.email} />
</p>
<div class="p-3" />

<p class="text-content flex items-center">
	<span class="mr-3">Anonymous:</span>
	<input type="checkbox" class="checkbox" bind:checked={person.anonymous} />
</p>

<div class="p-3" />
<button class="w-full btn btn-outline btn-accent btn-sm" on:click={updateInfo}>Update info</button>
{#if success}
	<div transition:fade="{{ duration: 100 }}" class="py-5">
		<div class="alert alert-success p-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{success}</span>
		</div>
	</div>{:else if error}
	<div class="py-5">
		<div class="alert alert-error p-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{error}</span>
		</div>
	</div>
{/if}
