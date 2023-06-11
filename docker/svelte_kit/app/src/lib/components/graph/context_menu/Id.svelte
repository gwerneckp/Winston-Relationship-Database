<script lang="ts">
	import { fade } from 'svelte/transition';

	export let id: string;
	let copied = false;

	// copy to clipboard
	function copyToClipboard() {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(id).then(() => {
				copied = true;
				setTimeout(() => {
					copied = false;
				}, 1000);
			});
		} else {
			// Fallback for unsupported browsers
			const textarea = document.createElement('textarea');
			textarea.value = id;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand('copy');
			document.body.removeChild(textarea);

			copied = true;
			setTimeout(() => {
				copied = false;
			}, 1000);
		}
	}
</script>

<div class="indicator">
	{#if copied}
		<span transition:fade class="indicator-item indicator-center badge badge-accent"
			>Copied!</span
		>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p class="text-sm text-gray-600 cursor-pointer" on:click={copyToClipboard}>#{id}</p>
</div>
