<script lang="ts">
	import type { Person } from '$lib/types/person';
	import Id from '../Id.svelte';
	import SearchPerson from '../SearchPerson.svelte';
	import RemoveRelationship from './RemoveRelationship.svelte';
	export let focusedPerson: Person;

	let searchResult: Person[] = [];
	let addRelationshipType: string;
	function addRelationshipHandler(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		throw new Error('Function not implemented.');
	}
</script>

<!-- UI for admin -->
{#if focusedPerson}
	<div class="bg-base-200 p-4">
		<h1 class="text-2xl font-bold">Admin Dashboard</h1>
	</div>
	<div class="px-4 pt-4 bg-base-300 h-full">
		<h1 class="font-bold flex items-center">
			<input
				type="text"
				class="input input-md text-lg focus:outline-none mr-2"
				bind:value={focusedPerson.name}
			/>
			<Id id={focusedPerson.id} />
		</h1>
		<div class="p-3" />
		<p class="text-content flex items-center">
			<span class="w-20">Grade:</span>
			<input
				type="text"
				class="input input-sm focus:outline-none"
				bind:value={focusedPerson.grade}
			/>
		</p>
		<div class="p-1" />

		<p class="text-content flex items-center">
			<span class="w-20">School:</span>
			<input
				type="text"
				class="input input-sm focus:outline-none"
				bind:value={focusedPerson.school}
			/>
		</p>
		<div class="p-1" />

		<p class="text-content flex items-center">
			<span class="w-20">Email:</span>
			<input
				type="text"
				class="input input-sm focus:outline-none"
				bind:value={focusedPerson.email}
			/>
		</p>
		<div class="p-3" />

		<p class="text-content flex items-center">
			<span class="mr-3">Anonymous:</span>
			<input type="checkbox" class="checkbox" />
			<!-- <input type="checkbox" class="checkbox" bind:checked={personData.anonymous} /> -->
		</p>

		<div class="p-3" />
		<button class="w-full btn btn-outline btn-accent btn-sm">Update info</button>

		{#each Object.entries(focusedPerson) as [key, value]}
			<!-- this might break if i add another array property to the user (that isn't a relationship) but yolo -->
			{#if Array.isArray(value) && value.length > 0}
				<div class="mt-4">
					<h2 class="text-lg font-bold mb-2">
						{key[0].toUpperCase() +
							key.slice(1, key.length).replace(/[A-Z]/g, (letter) => ` ${letter}`)}:
					</h2>
					{#each value as person}
						<RemoveRelationship
							person1Id={focusedPerson.id}
							person2Id={person.id}
							person2Name={person.name}
							relationship={key}
						/>
					{/each}
				</div>
			{/if}
		{/each}

		<div class="mt-4">
			<h2 class="text-xl font-bold mb-2">Add Relationship</h2>

			<select
				bind:value={addRelationshipType}
				required
				class="select select-bordered select-sm w-full"
			>
				<option value="" disabled>Select Relationship</option>
				<option value="GOT WITH" selected>Got With</option>
				<option value="DATED">Dated</option>
				<option value="DATING">Dating</option>
			</select>
			<div class="pt-3" />
			<SearchPerson bind:searchResult />
			<div class="pt-3" />

			<button class="btn btn-sm w-full" on:click={addRelationshipHandler}>Add Relationship</button>
		</div>
	</div>
{:else}
	<p>Loading...</p>
{/if}
