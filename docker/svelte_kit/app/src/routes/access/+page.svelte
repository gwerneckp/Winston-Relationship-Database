<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';

	let code: string = '';
	let error: string;
	let success: string;

	const ACCESS_MUTATION = (code: string) => gql`
		mutation {
            access(code: "${code}")
        }
	`;

	const handleSubmit = () => {
		success = '';
		error = '';
		if (!code) return;
		client
			.mutate({
				mutation: ACCESS_MUTATION(code)
			})
			.then((result) => {
				if (result.data.access) {
					success = 'Access granted';
					document.cookie = `jwt=${result.data.access}; path=/`;
					window.location.href = '/';
				} else {
					error = 'Invalid access code';
				}
			})
			.catch((err) => {
				error = 'Invalid access code';
			});
	};
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="bg-base-300 p-8 max-w-3xl w-full rounded-2xl shadow">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<h1 class="text-3xl font-bold mb-4">Access Website</h1>
			<div class="alert shadow-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="stroke-info shrink-0 w-6 h-6"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span
					>New churchillweb update! Visit the old version <a class='underline' href="https://old.churchillweb.uk"
						>here</a
					>.
				</span>
			</div>

			<h2 class="text-xl font-semibold mb-4">Why an access code?</h2>
			<p>
				This website is password-protected to ensure the security and privacy of the data it
				contains. We understand the importance of limiting access to the graph until we implement a
				more robust confidentiality system. Any information about yourself that you do not wish to
				have on the website will be promptly removed without further questions.
			</p>
			<p>
				However, it's worth noting that since there are multiple contributors, there is a
				possibility that the information will be added back. Until we develop a foolproof system to
				prevent this, the website will remain password-protected.
			</p>
			<div class="flex">
				<input
					type="text"
					bind:value={code}
					placeholder="Access Code"
					class="input input-bordered w-full shadow-lg"
				/>
			</div>
			{#if error}
				<div class="alert alert-error shadow-lg">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{error}</span>
				</div>
			{/if}
			{#if success}
				<div class="alert alert-success shadow-lg">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current flex-shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{success}</span>
				</div>
			{/if}
			<p>
				By entering the application, you acknowledge to have read the disclaimer <a
					href="/disclaimer"
					class="underline">here</a
				>.
			</p>
			{#if code.length >= 1}
				<button type="submit" on:click={handleSubmit} class="btn btn-accent w-full">
					Submit
				</button>
			{:else}
				<button type="submit" on:click={handleSubmit} class="btn btn-accent btn-disabled w-full">
					Submit
				</button>
			{/if}

			<p class="text-center">
				<a href="/login" class="underline">Admin Login</a>
			</p>
		</form>
	</div>
</div>
