<script lang="ts">
	import Graph from './Graph.svelte';
	import { focusedUserId } from '../focusedStore';

	let focused: string = 'none';
	focusedUserId.subscribe((value) => {
		focused = value;
	});
</script>

<Graph />
<div>
	{focused}
</div>
