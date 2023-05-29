<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { focusedPersonId } from '../focusedPerson';
	import { gql } from '@apollo/client';

	type Person = {
		id: string;
		name: string;
		grade: string;
		school: string;
		email: string;
		gotWith: {
			name: string;
		}[];
		dated: {
			name: string;
		}[];
		dating: {
			name: string;
		}[];
	};

	const GET_PERSON_QUERY = (name: string) => gql`
		query {
			people(where: { name: "${name}" }) {
				id
				name
				grade
				school
                email
				gotWith {
					name
				}
				dated {
					name
				}
				dating {
					name
				}
			}
		}
	`;

	let focused: string = 'none';
	let personData: Person;
	focusedPersonId.subscribe((value) => {
		focused = value;
		client
			.query({
				query: GET_PERSON_QUERY(focused)
			})
			.then((result) => {
				personData = result.data.people[0];
			});
		console.log(personData);
	});

	// $: personData = client
	// 	.query({
	// 		query: GET_PERSON_QUERY(focused)
	// 	})
	// 	.then((result) => {
	// 		return result.data.people[0];
	// 	});
	// let personData: Person;
	// client
	// 	.query({
	// 		query: GET_PERSON_QUERY(focused)
	// 	})
	// 	.then((result) => {
	// 		personData = result.data.people[0];
	// 	});
</script>

<div class="w-full h-full">
	{#if personData}
		<div class="p-4 bg-base-300 h-full">
			<h1 class="text-2xl font-bold mb-2">{personData.name}</h1>
			<p class="text-content">Grade: {personData.grade}</p>
			<p class="text-content">School: {personData.school}</p>
			<p class="text-content">Email: {personData.email}</p>
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Got With:</h2>
				{#each personData.gotWith as person}
					<p>{person.name}</p>
				{/each}
			</div>
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dated:</h2>
				{#each personData.dated as person}
					<p>{person.name}</p>
				{/each}
			</div>
			<div class="mt-4">
				<h2 class="text-lg font-bold mb-2">Dating:</h2>
				{#each personData.dating as person}
					<p>{person.name}</p>
				{/each}
			</div>
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>
