<script lang="ts">
	import Auth from '$lib/components/auth/Auth.svelte';
	import Graph from '../lib/components/graph/Graph.svelte';
	import FocusedUser from '../lib/components/graph/context_menu/FocusedUser.svelte';
</script>

<Auth>
	<div class="lg:flex h-full">
		<div class="lg:w-2/3 h-2/3 lg:h-full w-full">
			<Graph />
		</div>
		<div class="lg:w-1/3 w-full h-full">
			<FocusedUser />
		</div>
	</div>
</Auth>
