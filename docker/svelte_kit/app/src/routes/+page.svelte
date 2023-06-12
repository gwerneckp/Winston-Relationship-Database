<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import Role from '$lib/components/auth/Role.svelte';
	import Graph from '../lib/components/graph/Graph.svelte';
	import FocusedUser from '../lib/components/graph/context_menu/FocusedUser.svelte';
	import { userStore } from '$lib/stores/userStore';
</script>

<Auth>
	<div class="text-3xl font-bold flex justify-center lg:p-6 p-6 lg:m-3 bg-base-200">
		<div>
			<p>Welcome to the Churchillweb Database</p>
			<Role>
				<p slot="admin" class="text-2xl font-normal flex justify-center">
					Hello&nbsp<span class="font-bold">{$userStore.username}</span>, You are logged in as
					an&nbsp<span class="font-bold">{$userStore.role}</span>.
				</p>
			</Role>
		</div>
	</div>

	<div class="lg:flex h-full">
		<div class="lg:w-2/3 h-2/3 lg:h-full w-full lg:pl-3 lg:pr-1.5">
			<Graph />
		</div>
		<div class="lg:w-1/3 w-full h-full lg:pl-1.5 lg:pr-3">
			<FocusedUser />
		</div>
	</div>

	
</Auth>
