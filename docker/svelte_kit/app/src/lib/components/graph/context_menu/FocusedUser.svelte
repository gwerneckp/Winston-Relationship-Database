<script lang="ts">
	import { client } from '$lib/apolloClient';
	import Role from '$lib/components/auth/Role.svelte';
	import PersonView from '$lib/components/graph/context_menu/user_view/PersonView.svelte';
	import PersonAdmin from '$lib/components/graph/context_menu/admin_view/PersonAdmin.svelte';
	import { focusedPersonId } from '$lib/stores/focusedStore';
	import type { Person } from '$lib/types/person';
	import { gql } from '@apollo/client';
	import NoContext from './NoContext.svelte';

	const GET_PERSON_QUERY = (id: string) => gql`
		query {
			people(where: { id: "${id}" }) {
				id
				name
				grade
				school
                email
				anonymous
				gotWith {
					name
					id
				}
				dated {
					name
					id
				}
				dating {
					name
					id
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
	});

	addEventListener('data_change', (event: any) => {
		client
			.query({
				query: GET_PERSON_QUERY(focused)
			})
			.then((result) => {
				personData = result.data.people[0];
			});
	});
</script>

<div class="w-full h-full rounded-xl">
	{#if personData}
	<Role>
		<PersonAdmin slot="admin" focusedPerson={personData} />
		<PersonView slot="view" focusedPerson={personData} />
	</Role>
	{:else}
	<NoContext />
	{/if}
</div>
