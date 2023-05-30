<script lang="ts">
	import type { Person } from '$lib/types/person';
	import SearchPerson from './SearchPerson.svelte';
	export let personData: Person;
	let searchResult: Person[] = [];
</script>

<!-- UI for admin -->
{#if personData}
	<div class="bg-base-200 p-4">
		<h1 class="text-2xl font-bold">Admin Dashboard</h1>
	</div>
	<div class="px-4 pt-4 bg-base-300 h-full">
		<h1 class="font-bold flex items-center">
			<input
				type="text"
				class="input input-md text-lg focus:outline-none mr-2"
				bind:value={personData.name}
			/>
			<span class="text-xs text-gray-600">#{personData.id}</span>
		</h1>
		<div class="p-3" />
		<p class="text-content flex items-center">
			<span class="w-20">Grade:</span>
			<input type="text" class="input input-sm focus:outline-none" bind:value={personData.grade} />
		</p>
		<div class="p-1" />

		<p class="text-content flex items-center">
			<span class="w-20">School:</span>
			<input type="text" class="input input-sm focus:outline-none" bind:value={personData.school} />
		</p>
		<div class="p-1" />

		<p class="text-content flex items-center">
			<span class="w-20">Email:</span>
			<input type="text" class="input input-sm focus:outline-none" bind:value={personData.email} />
		</p>
		<div class="p-3" />

		<p class="text-content flex items-center">
			<span class="mr-3">Anonymous:</span>
			<input type="checkbox" class="checkbox" />
			<!-- <input type="checkbox" class="checkbox" bind:checked={personData.anonymous} /> -->
		</p>

		<div class="p-3" />
		<button class="w-full btn btn-outline btn-accent btn-sm">Update info</button>
		<!-- <button class="w-full btn btn-sm">Update info</button> -->

		{#if personData.gotWith.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Got With:</h2>
				{#each personData.gotWith as person}
					<div class="flex">
						<div class="w-1/2">
							<p>{person.name}</p>
							<p class="text-sm text-gray-600">#{person.id}</p>
						</div>
						<div class="w-1/2">
							<button data-id={person.id} class="btn btn-outline btn-error btn-sm">Remove</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		{#if personData.dated.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dated:</h2>
				{#each personData.dated as person}
					<div class="flex">
						<div class="w-1/2">
							<p>{person.name}</p>
							<p class="text-sm text-gray-600">#{person.id}</p>
						</div>
						<div class="w-1/2">
							<button data-id={person.id} class="btn btn-outline btn-error btn-sm">Remove</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		{#if personData.dating.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dating:</h2>
				{#each personData.dating as person}
					<div class="flex">
						<div class="w-1/2">
							<p>{person.name}</p>
							<p class="text-sm text-gray-600">#{person.id}</p>
						</div>
						<div class="w-1/2">
							<button data-id={person.id} class="btn btn-outline btn-error btn-sm">Remove</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-4">
			<h2 class="text-xl font-bold mb-2">Add Relationship</h2>

			<select id="relationship" required class="select select-bordered select-sm w-full">
				<option value="" disabled>Select Relationship</option>
				<option value="GOT_WITH" selected>Got With</option>
				<option value="DATED">Dated</option>
				<option value="DATING">Dating</option>
			</select>
			<div class="pt-3" />
			<SearchPerson bind:searchResult />
			<div>
				{#each searchResult as person}
					<p>{person.name} - {person.id}</p>
				{/each}
			</div>

			<div class="pt-3" />

			<button class="btn btn-sm w-full">Add Relationship</button>
		</div>
	</div>
{:else}
	<p>Loading...</p>
{/if}
