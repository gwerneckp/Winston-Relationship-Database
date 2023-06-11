<script lang="ts">
	import { gql } from '@apollo/client';
	import { client } from '$lib/apolloClient';
	import type { Person } from '$lib/types/person';

	let search = '';
	export let searchResult: Person[] = [];

	const SEARCH_PERSON_QUERY = (name: string) => gql`
        query {
            searchPeople(name: "${name}") {
                id
                name
            }
        }
    `;

	async function fetchData() {
		try {
			if (search.length < 1) {
				searchResult = [];
				return;
			}
			const result = await client.query({
				query: SEARCH_PERSON_QUERY(search)
			});
			searchResult = result.data.searchPeople;
		} catch (error) {
			console.error(error);
		}
	}

	function handleInputChange(event: any) {
		search = event.target.value;
		fetchData();
	}
</script>

<input
	class="input input-bordered input-sm w-full"
	list="people-search"
	type="text"
	bind:value={search}
	required
	on:input={handleInputChange}
/>
<datalist id="people-search">
	{#each searchResult as person}
		<option value={person.name} data-id={person.id}/>
	{/each}
</datalist>
