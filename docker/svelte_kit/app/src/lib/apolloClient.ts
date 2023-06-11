import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloCache, ApolloClient, ApolloLink, createHttpLink } from '@apollo/client';

export class VoidCache extends ApolloCache<NormalizedCacheObject> {
	read(options: any) {
		return null;
	}
	write(options: any) {
		return undefined;
	}
	diff(options: any) {
		return {};
	}
	watch(watch: any) {
		return () => void 0;
	}
	async reset() {
		return;
	}
	evict(options: any): boolean {
		return false;
	}
	restore(data: NormalizedCacheObject): VoidCache {
		return this;
	}
	extract(optimistic?: boolean | undefined): NormalizedCacheObject {
		return {};
	}
	removeOptimistic(id: any) {
		return;
	}
	performTransaction(update: any, optimisticId: any) {
		return;
	}
	transformDocument(document: any) {
		return document;
	}
	transformForLink(document: any) {
		return document;
	}
	identify(object: any) {
		return undefined;
	}
	gc(): any[] {
		return [];
	}
	modify(options: any) {
		return false;
	}
	readQuery(options: any, optimistic?: any) {
		return null;
	}
	readFragment(options: any, optimistic?: any) {
		return null;
	}
	writeQuery(opts: any) {
		return undefined;
	}
	writeFragment(opts: any) {
		return undefined;
	}
	updateQuery(options: any, update: any) {
		return null;
	}
	updateFragment(options: any, update: any) {
		return null;
	}
}

// Create an HTTP link
const httpLink: ApolloLink = createHttpLink({
	uri: '/graphql', // Your server's GraphQL endpoint
	credentials: 'include' // Include cookies in requests
});

// Create the Apollo Client instance
export const client = new ApolloClient({
	link: httpLink,
	cache: new VoidCache()
});
