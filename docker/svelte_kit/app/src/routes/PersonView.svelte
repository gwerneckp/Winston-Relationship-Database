<script lang="ts">
	import type { Person } from '$lib/types/person';
	export let personData: Person;
</script>

<!-- UI for admin -->
{#if personData}
	<div class="p-4 bg-base-300 h-full">
		<h1 class="text-2xl font-bold mb-2">{personData.name}</h1>
		<p class="text-content">Grade: {personData.grade}</p>
		<p class="text-content">School: {personData.school}</p>
		<p class="text-content">Email: {personData.email}</p>
		{#if personData.gotWith.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Got With:</h2>
				{#each personData.gotWith as person}
					<p>{person.name}</p>
				{/each}
			</div>
		{/if}
		{#if personData.dated.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dated:</h2>
				{#each personData.dated as person}
					<p>{person.name}</p>
				{/each}
			</div>
		{/if}
		{#if personData.dating.length > 0}
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dating:</h2>
				{#each personData.dating as person}
					<p>{person.name}</p>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<p>Loading...</p>
{/if}
