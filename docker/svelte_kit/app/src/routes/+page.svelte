<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import Graph from './Graph.svelte';
	import User from './User.svelte';
</script>

<Auth>
	<div class="flex h-full">
		<div class="w-2/3 h-full">
			<Graph />
		</div>
		<div class="w-1/3 h-full">
			<User />
		</div>
	</div>
</Auth>
