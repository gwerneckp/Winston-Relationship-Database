<script>
	import '../app.css';
	import { page } from '$app/stores';
</script>

{#if !$page.data}
	<div class="justify-center align-middle flex h-full">
		<span class="loading loading-spinner loading-lg" />
	</div>
{:else}
	<slot />
{/if}
