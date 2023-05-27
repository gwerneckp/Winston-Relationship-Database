import { Neo4jGraphQL } from '@neo4j/graphql';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer, gql } from 'apollo-server-svelte-kit';
import JWT from 'jsonwebtoken';

import neo4j from 'neo4j-driver';

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'xxxxxxxx'));

const typeDefs = gql`
	type Person
		@auth(
			rules: [
				{ operations: [READ], roles: ["view"] }
				{ operations: [READ, CREATE, UPDATE, DELETE], roles: ["admin"] }
			]
		) {
		name: String!
		school: String
		grade: String
		gotWith: [Person!]! @relationship(type: "GOT_WITH", direction: OUT)
		dated: [Person!]! @relationship(type: "DATED", direction: OUT)
		dating: [Person!]! @relationship(type: "DATED", direction: OUT)
	}

	type User
		@auth(
			rules: [
				{ operations: [READ], roles: ["view"] }
				{ operations: [READ, UPDATE ], allow: { id: "$jwt.sub.id" } }
				{ operations: [READ, CREATE, UPDATE, DELETE], roles: ["admin"] }
			]
		) {
		id: ID @readonly
		username: String!
		password: String! @private
	}

	type Query {
		people: [Person]
		users: [User]
	}

	type Mutation {
		signIn(username: String!, password: String!): String!
	}
`;

const ogm = new OGM({
	typeDefs,
	driver
});

ogm.init();

const User = ogm.model('User');

const resolvers = {
	Mutation: {
		signIn: async (
			_root: any,
			{ username, password }: { username: string; password: string },
			{ req }: { req: any; jwt: any; auth: any }
		) => {
			const [user] = await User.find({ where: { username } });

			if (!user) {
				throw new Error(`Username or password is incorrect!`);
			}

			const correctPassword = password === user.password;

			if (!correctPassword) {
				throw new Error(`Username or password is incorrect!`);
			}

			const token = JWT.sign(
				{
					sub: {
						id: user.id,
						username: user.username,
						role: 'admin'
					}
				},
				'secret'
			);

			req.cookies.set('jwt', token, {
				httpOnly: true
			});

			return token;
		}
	}
};

const neoSchema = new Neo4jGraphQL({
	typeDefs: typeDefs,
	driver: driver,
	resolvers: resolvers,
	plugins: {
		auth: new Neo4jGraphQLAuthJWTPlugin({
			secret: 'secret',
			rolesPath: 'sub.role'
		})
	}
});

const server = new ApolloServer({
	schema: await neoSchema.getSchema(),
	context: ({ req }) => {
		return {
			driver: driver,
			req: req,
			jwt: JWT.decode(req.cookies.get('jwt'))
		};
	}
});

await server.start();

export const POST = server.handleRequest;
