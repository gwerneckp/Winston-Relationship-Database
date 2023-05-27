<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';
	import { onMount } from 'svelte';

	const GET_PEOPLE = gql`
		query {
			people {
				name
				grade
			}
		}
	`;

	let people: any = [];

	onMount(async () => {
		const { data } = await client.query({ query: GET_PEOPLE });
		people = data.people;
	});
</script>

{#each people as person}
	<li>{person.name} - {person.grade}</li>
{/each}
