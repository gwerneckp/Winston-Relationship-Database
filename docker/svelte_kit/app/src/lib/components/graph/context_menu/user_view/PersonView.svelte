<script lang="ts">
	import type { Person } from '$lib/types/person';
	export let focusedPerson: Person;
</script>

<!-- UI for admin -->
{#if focusedPerson}
	<div class="bg-base-200 p-4">
		<h1 class="text-2xl font-bold">Person Information</h1>
	</div>
	<div class="p-4 bg-base-300 h-full">
		<h1 class="text-2xl font-bold mb-2">{focusedPerson.name}</h1>
		<p class="text-content">Grade: {focusedPerson.grade}</p>
		<p class="text-content">School: {focusedPerson.school}</p>
		<p class="text-content">Email: {focusedPerson.email}</p>
		{#each Object.entries(focusedPerson) as [key, value]}
			<!-- this might break if i add another array property to the user (that isn't a relationship) but yolo -->
			{#if Array.isArray(value) && value.length > 0}
				<div class="mt-4">
					<h2 class="text-lg font-bold mb-2">
						{key[0].toUpperCase() +
							key.slice(1, key.length).replace(/[A-Z]/g, (letter) => ` ${letter}`)}:
					</h2>
					{#each value as person}
						<li>{person.name}</li>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
{:else}
	<p>Loading...</p>
{/if}
