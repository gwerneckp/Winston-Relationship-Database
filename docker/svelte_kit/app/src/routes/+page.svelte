<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import Graph from '../lib/components/graph/Graph.svelte';
	import FocusedUser from '../lib/components/graph/context_menu/FocusedUser.svelte';
</script>

<Auth>
	<p class='text-3xl font-bold flex justify-center p-7'>Welcome to the Churchillweb Database</p>
	<div class="lg:flex h-full">
		<div class="lg:w-2/3 h-2/3 lg:h-full w-full p-3">
			<Graph />
		</div>
		<div class="lg:w-1/3 w-full h-full p-3">
			<FocusedUser />
		</div>
	</div>
</Auth>
