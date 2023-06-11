<script lang="ts">
	import type { Person } from '$lib/types/person';
	import Id from '../Id.svelte';
	import AddRelationship from '$lib/components/graph/context_menu/admin_view/AddRelationship.svelte';
	import RemoveRelationship from '$lib/components/graph/context_menu/admin_view/RemoveRelationship.svelte';
	export let focusedPerson: Person;
</script>

<!-- UI for admin -->
{#if focusedPerson}
	<div class="bg-base-200">
		<h1 class="text-2xl font-bold p-4">Admin Dashboard</h1>
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

		<AddRelationship person1Id={focusedPerson.id} />
	</div>
{:else}
	<p>Loading...</p>
{/if}
