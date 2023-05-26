import { ApolloServer, gql } from 'apollo-server-svelte-kit';
// import { ApolloServer } from '@apollo/server';
import { Neo4jGraphQL } from '@neo4j/graphql';
// import { OGM } from '@neo4j/graphql-ogm';
import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'xxxxxxxx'));

const typeDefs = gql`
	type Person {
		name: String!
		school: String
		grade: String
		gotWith: [Person!]! @relationship(type: "GOT_WITH", direction: OUT)
		dated: [Person!]! @relationship(type: "DATED", direction: OUT)
		dating: [Person!]! @relationship(type: "DATED", direction: OUT)
	}

	type Query {
		people: [Person]
	}
`;

const neoSchema = new Neo4jGraphQL({
	typeDefs,
	driver
});

const server = new ApolloServer({
	schema: await neoSchema.getSchema(),
	context: ({ req }) => {
		return {
			driver,
			req
		};
	}
});

// server.graphqlPath = '/graphql';
await server.start();


export const GET = server.handleRequest;
export const POST = server.handleRequest;