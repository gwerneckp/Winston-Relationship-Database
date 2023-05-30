<script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';

	let username: string;
	let password: string;

	let error: string;
	let success: string;

	const LOGIN_MUTATION = (username: string, password: string) => gql`
		mutation {
            signIn(username: "${username}", password: "${password}")
        }
	`;

	const handleSubmit = () => {
		success = '';
		error = '';
		client
			.mutate({
				mutation: LOGIN_MUTATION(username, password)
			})
			.then((result) => {
				if (result.data.signIn) {
					success = 'Access granted';
					document.cookie = `jwt=${result.data.signIn}; path=/`;
					window.location.href = '/';
				} else {
					error = 'Invalid credentials';
				}
			})
			.catch((err) => {
				error = 'Invalid credentials';
			});
	};
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="bg-base-300 p-8 max-w-3xl w-full rounded-2xl shadow">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<h1 class="text-3xl font-bold mb-4">Admin Login</h1>
			<div class="alert shadow-lg">
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="stroke-info flex-shrink-0 w-6 h-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span
						>New churchillweb update! Visit the old version <a
							class="underline"
							href="https://dev.churchillweb.uk">here</a
						>.
					</span>
				</div>
			</div>

			<!-- <h2 class="text-xl font-semibold mb-4">Why an access code?</h2>
			<p>
				This website is password-protected to ensure the security and privacy of the data it
				contains. We understand the importance of limiting access to the graph until we implement a
				more robust confidentiality system. Any information about yourself that you do not wish to
				have on the website will be promptly removed without further questions.
			</p> -->
			<div class="flex">
				<input
					type="text"
					bind:value={username}
					placeholder="Username"
					class="input input-bordered w-full"
				/>
			</div>
			<div class="flex">
				<input
					type="password"
					bind:value={password}
					placeholder="Password"
					class="input input-bordered w-full"
				/>
			</div>

			{#if error}
				<div class="alert alert-error shadow-lg">
					<div>
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
				</div>
			{/if}
			{#if success}
				<div class="alert alert-success shadow-lg">
					<div>
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
				</div>
			{/if}
			<p>
				By entering the application, you acknowledge to have read the disclaimer <a
					href="/disclaimer"
					class="underline">here</a
				>.
			</p>
			<button type="submit" on:click={handleSubmit} class="btn btn-accent w-full"> Submit </button>

			<p class="text-center">
				<a href="/access" class="underline">Normal Access</a>
			</p>
		</form>
	</div>
</div>
