<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';
	import Id from '$lib/components/graph/context_menu/Id.svelte';
	import { onMount } from 'svelte';
	import { compute_rest_props } from 'svelte/internal';

	export let person1Id: string;
	export let person2Id: string;
	export let person2Name: string;
	export let relationship: string;

	const REMOVE_RELATIONSHIP_MUTATION = (
		person1Id: string,
		person2Id: string,
		relationship: string
	) => gql`
			mutation {
				updatePeople(
					where: {
						OR: [
							{ id: "${person1Id}" }
							{ id: "${person2Id}" }
						]
					}
					disconnect: {
						${relationship}: {
							where: {
								node: {
									OR: [
										{ id: "${person1Id}" }
										{ id: "${person2Id}" }
									]
								}
							}
						}
					}
				) {
					info {
						relationshipsDeleted
					}
				}
			}
		`;

	function removeRelationshipHandler(
		event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		console.log(person1Id, person2Id, relationship);
		client
			.mutate({ mutation: REMOVE_RELATIONSHIP_MUTATION(person1Id, person2Id, relationship) })
			.then((result) => {
				const data_change = new CustomEvent('data_change', {
					detail: {
						relationshipsDeleted: result.data.updatePeople.info.relationshipsDeleted
					}
				});
				dispatchEvent(data_change);
			});
	}

	onMount(() => {
		console.log(person1Id);
		console.log(person2Id);
		console.log(relationship);
	});
</script>

<div class="flex">
	<div class="w-3/5">
		<p>{person2Name}</p>
		<!-- <p class="text-sm text-gray-600">#{person1Id}</p> -->
		<Id id={person2Id} />
	</div>
	<div class="w-2/5">
		<button on:click={removeRelationshipHandler} class="btn btn-outline btn-error btn-sm"
			>Remove</button
		>
	</div>
</div>
