<script lang="ts">
	import SearchPerson from '$lib/components/graph/context_menu/SearchPerson.svelte';
	import { fade } from 'svelte/transition';
	import { gql } from '@apollo/client';
	import { client } from '$lib/apolloClient';
	import { userStore } from '$lib/stores/userStore';
	import { focusedPersonId } from '$lib/stores/focusedStore';
	import type { Person } from '$lib/types/person';

	let searchResult: Person[] = [];
	let suggestion: string;

	function handleSearch() {
		focusedPersonId.set(searchResult[0].id);
	}

	let suggestionSuccess: string;
	let suggestionError: string;

	const CREATE_SUGGEST_MUTATION = (suggestion: string) => gql`
		mutation {
			createSuggestions(
				input: {
					message: "${suggestion}"
				}
			) {
                info{
                    nodesCreated
                }
			}	
		}
	`;

	function handleSuggestion() {
		client
			.mutate({
				mutation: CREATE_SUGGEST_MUTATION(suggestion)
			})
			.then((result) => {
				if (result.data.createSuggestions.info.nodesCreated >= 1) {
					suggestion = '';

					suggestionSuccess = 'Suggestion added!';
					suggestionError = '';

					setTimeout(() => {
						suggestionSuccess = '';
					}, 3000);
				} else {
					suggestionSuccess = '';
					suggestionError = 'Suggestion not added!';

					setTimeout(() => {
						suggestionError = '';
					}, 3000);
				}
			});
	}
</script>

<!-- UI for admin -->
<div class="bg-base-200">
	<h1 class="text-2xl font-bold p-4">Context Menu</h1>
</div>
<div class="bg-base-300 h-full px-4 pt-4">
	<h2 class="text-xl font-bold">Disclaimer</h2>
	<p>
		Disclaimer: By using this website, you acknowledge and accept the disclaimer located
		<a class="underline" href="/disclaimer">here</a>.
	</p>

	<div class="py-3" />

	<h2 class="text-xl font-bold">Search Person</h2>
	<!-- <p>Search for a person to access their information.</p> -->
	<div class="py-1" />

	<!-- Search for a person -->
	<SearchPerson bind:searchResult />

	<div class="py-1" />
	{#if searchResult[0]}
		<button on:click={handleSearch} class="btn btn-block btn-accent"
			>Go to {searchResult[0].name}</button
		>
	{:else}
		<button tabindex="-1" aria-disabled="true" class="btn btn-block btn-disabled">No Results</button
		>
	{/if}

	<div class="py-3" />

	<div>
		<h2 class="text-xl font-bold">Add Suggestion</h2>
		<div class="py-1" />

		<textarea class="input input-bordered input-sm w-full h-24" bind:value={suggestion} />

		<div class="py-1" />
		{#if suggestionSuccess}
			<div transition:fade={{ duration: 100 }} class="py-2">
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
					<span>{suggestionSuccess}</span>
				</div>
			</div>{:else if suggestionError}
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
					<span>{suggestionError}</span>
				</div>
			</div>
		{/if}

		{#if suggestion}
			<button on:click={handleSuggestion} class="btn btn-block btn-accent">Add suggestion</button>
		{:else}
			<button tabindex="-1" aria-disabled="true" class="btn btn-block btn-disabled"
				>Add suggestion</button
			>
		{/if}
	</div>

	<div class="py-3" />

	<div>
		<h2 class="text-xl font-bold">Admin Access</h2>
		<div class="py-1" />
		<p>Do you have administrator credentials? Login <a class="underline" href="/login">here</a>.</p>
	</div>
</div>
