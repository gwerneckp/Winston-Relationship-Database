<script lang="ts">
	import type { Person } from '$lib/types/person';
	import AddRelationship from '$lib/components/graph/context_menu/admin_view/AddRelationship.svelte';
	import RemoveRelationship from '$lib/components/graph/context_menu/admin_view/RemoveRelationship.svelte';
	import UpdatedInfo from '$lib/components/graph/context_menu/admin_view/UpdatedInfo.svelte';
	export let focusedPerson: Person;
</script>

<!-- UI for admin -->
<div class="bg-base-200">
	<h1 class="text-2xl font-bold p-4">Edit Person Information</h1>
</div>
<div class="px-4 pt-4 bg-base-300 h-full">
	<UpdatedInfo person={focusedPerson} />
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
