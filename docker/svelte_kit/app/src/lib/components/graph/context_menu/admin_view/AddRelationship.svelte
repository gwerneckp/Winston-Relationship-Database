<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';
	import SearchPerson from '$lib/components/graph/context_menu/SearchPerson.svelte';

	import type { Person } from '$lib/types/person';

	function camelize(str: string) {
		return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr: string) => chr.toUpperCase());
	}

	export let person1Id: string;

	let addRelationshipType: string = '';
	let searchResult: Person[] = [];

	const ADD_RELATIONSHIP_MUTATION = (relationship: string, id1: string, id2: string) => gql`
		mutation {
			updatePeople(
				where: { OR: [{ id: "${id1}" }] }
				connect: { ${relationship}: { where: { node: { id: "${id2}" } } } }
			) {
				info {
					relationshipsCreated
				}
			}
		}
	`;

	function addRelationshipHandler(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		let person2Id = searchResult[0].id;
		let relationship = camelize(addRelationshipType);
		client
			.mutate({
				mutation: ADD_RELATIONSHIP_MUTATION(relationship, person1Id, person2Id)
			})
			.then((result) => {
				dispatchEvent(
					new CustomEvent('data_change', {
						detail: {
							relationshipAdded:
								result.data.updatePeople.info.relationshipsCreated > 0
						}
					})
				);
			});
	}
</script>

<div class="mt-4">
	<h2 class="text-xl font-bold mb-2">Add Relationship</h2>

	<select bind:value={addRelationshipType} required class="select select-bordered select-sm w-full">
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
