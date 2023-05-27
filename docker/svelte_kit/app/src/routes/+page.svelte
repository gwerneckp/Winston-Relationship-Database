<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql, useQuery } from '@apollo/client';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const GET_PEOPLE = gql`
		query {
			people{
				name
				grade
			}
		}
	`;

	// Create a writable Svelte store for the people data
	let people: any = [];

	onMount(async () => {
		const { data } = await client.query({ query: GET_PEOPLE });
		people = data.people;
	});
</script>


{#each people as person}
	<li>{person.name} - {person.grade}</li>
{/each}
