<script lang="ts">
	import SearchPerson from '$lib/components/graph/context_menu/SearchPerson.svelte';
	import { focusedPersonId } from '$lib/stores/focusedStore';
	import type { Person } from '$lib/types/person';

	let searchResult: Person[] = [];
	let suggestion: string;

	function handleSearch() {
		focusedPersonId.set(searchResult[0].id);
	}
	function handleSuggestion() {
		return 1;
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

		{#if suggestion}
			<button on:click={handleSearch} class="btn btn-block btn-accent">Add suggestion</button>
		{:else}
			<button tabindex="-1" aria-disabled="true" class="btn btn-block btn-disabled"
				>Add suggestion</button
			>
		{/if}
	</div>
</div>
