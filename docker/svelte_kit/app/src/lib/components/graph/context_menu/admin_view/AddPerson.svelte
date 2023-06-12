<script lang="ts">
	import { gql } from '@apollo/client';
	import { client } from '$lib/apolloClient';
	import { fade } from 'svelte/transition';
	import { focusedPersonId } from '$lib/stores/focusedStore';

	const nameRegex = /^[A-Z][A-zÀ-ú]* ([A-ZÀ-Ú]+( |\-|))+$/;

	let name: string;

	const CREATE_PERSON_MUTATION = (name: string) => gql`
		mutation {
			createPeople(input: { name: "${name}" }) {
				people {
					id
				}
			}
		}
	`;

	let success: string;
	let error: string;

	function createHandler() {
		client
			.mutate({
				mutation: CREATE_PERSON_MUTATION(name)
			})
			.then((result) => {
				if (result.data.createPeople.people[0].id) {
					success = `Successfully added person ${name}.`;
					error = '';

                    focusedPersonId.set(result.data.createPeople.people[0].id);
					setTimeout(() => {
						success = '';
					}, 3000);
				} else {
					success = '';
					error = JSON.stringify(result);

					setTimeout(() => {
						error = `Error adding person ${name}.`;
					}, 3000);
				}
			});
	}
</script>

<div>
	<div class="py-1" />
	<input
		bind:value={name}
		type="text"
		placeholder="Name SURNAME"
		class="input input-bordered input-sm w-full"
	/>

	<div class="py-1" />
	{#if success}
		<div transition:fade={{ duration: 100 }} class="py-3">
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
		</div>
	{:else if error}
		<div class="py-2">
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
	{#if name && name.match(nameRegex)}
		<button on:click={createHandler} class="btn btn-block btn-accent">Add {name}</button>
	{:else}
		<button tabindex="-1" aria-disabled="true" class="btn btn-block btn-disabled">Add Person</button
		>
	{/if}
</div>
