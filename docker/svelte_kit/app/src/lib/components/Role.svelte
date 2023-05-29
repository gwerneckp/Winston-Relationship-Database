<script lang="ts">
	import { userStore } from '$lib/stores/userStore';
</script>

<!-- two slots, one if role is view, the other if role is admin -->
{#if $userStore.role === 'view'}
	<slot name="view" />
{:else if $userStore.role === 'admin'}
	<slot name="admin" />
{/if}

