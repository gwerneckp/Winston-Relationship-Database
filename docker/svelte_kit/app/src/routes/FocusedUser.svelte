<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { focusedPersonId } from '../focusedPerson';
	import { gql } from '@apollo/client';
	import Role from '$lib/components/Role.svelte';
	import type { Person } from '$lib/types/person';
	import PersonAdmin from './PersonAdmin.svelte';
	import PersonView from './PersonView.svelte';

	const GET_PERSON_QUERY = (id: string) => gql`
		query {
			people(where: { id: "${id}" }) {
				id
				name
				grade
				school
                email
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
</script>

<div class="w-full h-full">
	<Role>
		<PersonAdmin slot="admin" {personData} />
		<PersonView slot="view" {personData} />
	</Role>
</div>
