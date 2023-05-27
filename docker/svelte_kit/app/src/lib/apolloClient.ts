import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';

// Create an HTTP link
const httpLink: ApolloLink = createHttpLink({
	uri: '/graphql', // Your server's GraphQL endpoint
	credentials: 'include' // Include cookies in requests
});

// Create the Apollo Client instance
export const client = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache()
});
