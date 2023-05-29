import { Neo4jGraphQL } from '@neo4j/graphql';
import { OGM } from '@neo4j/graphql-ogm';
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth';
import { ApolloServer, gql } from 'apollo-server-svelte-kit';
import JWT, { type JwtPayload } from 'jsonwebtoken';

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
		id: ID @id
		name: String! @unique
		school: String
		grade: String
		gotWith: [Person!]!
			@relationship(type: "GOT_WITH", direction: OUT, queryDirection: UNDIRECTED_ONLY)
		dated: [Person!]! @relationship(type: "DATED", direction: OUT, queryDirection: UNDIRECTED_ONLY)
		dating: [Person!]!
			@relationship(type: "DATING", direction: OUT, queryDirection: UNDIRECTED_ONLY)
	}

	type User
		@auth(
			rules: [
				{ operations: [READ], roles: ["view"] }
				{ operations: [READ, UPDATE], allow: { id: "$jwt.sub.id" } }
				{ operations: [READ, CREATE, UPDATE, DELETE], roles: ["admin"] }
			]
		) {
		id: ID @id
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
		const jwtRaw = req.cookies.get('jwt') || req.request.headers.get('X-auth-token');
		let jwt: JwtPayload | string | null;
		try {
			jwt = JWT.verify(jwtRaw, 'secret');
		} catch (error) {
			jwt = null;
		}
		return {
			driver: driver,
			req: req,
			jwt: jwt
		};
	}
});

await server.start();

export const POST = server.handleRequest;
