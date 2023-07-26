import { Neo4jGraphQL, Neo4jGraphQLSubscriptionsSingleInstancePlugin } from '@neo4j/graphql';
import OMGPkg from '@neo4j/graphql-ogm';
const { OGM } = OMGPkg;
//import ConstraintDirective from 'graphql-constraint-directive';
import Neo4jGraphQLAuthJWTPluginPkg from '@neo4j/graphql-plugin-auth';
import { ApolloServer, gql } from 'apollo-server-svelte-kit';
import JWT, { type JwtPayload } from 'jsonwebtoken';
import neo4j from 'neo4j-driver';
const { Neo4jGraphQLAuthJWTPlugin } = Neo4jGraphQLAuthJWTPluginPkg;

const driver = neo4j.driver('bolt://neo4j:7687', neo4j.auth.basic('neo4j', 'churchill'));

const typeDefs = gql`
	type Person
		@auth(
			rules: [
				{ operations: [READ], roles: ["view"] }
				{ operations: [READ, CREATE, UPDATE, DELETE, CONNECT, DISCONNECT], roles: ["admin"] }
			]
		) {
		id: ID @id
		name: String! @unique #@constraint(minLength: 1, maxLength: 255)
		school: String #@constraint(minLength: 1, maxLength: 255)
		email: String #@constraint(format: "email", maxLength: 255)
		grade: String #@constraint(pattern: "^Y[0-9]{1,2}$")
		anonymous: Boolean
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
				{ operations: [READ, CREATE, UPDATE, DELETE, CONNECT, DISCONNECT], roles: ["admin"] }
			]
		) {
		id: ID @id
		username: String!
		password: String! @private
	}

	type Suggestion
		@auth(
			rules: [
				{ operations: [CREATE], roles: ["view"], allow: { user: { id: "$jwt.sub.id" } } }
				{ operations: [READ, CREATE, UPDATE, DELETE, CONNECT, DISCONNECT], roles: ["admin"] }
			]
		) {
		id: ID @id
		message: String!
		date: DateTime! @timestamp(operations: [CREATE])
		dealtWith: Boolean! @default(value: false)
	}

	type Query {
		people: [Person]
		users: [User]
		suggestions: [Suggestion]
		searchPeople(name: String!): [Person]
			@cypher(
				statement: "CALL db.index.fulltext.queryNodes('personNames', $name) YIELD node RETURN node"
			)
	}

	type Mutation {
		signIn(username: String!, password: String!): String!
		access(code: String!): String!
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
			{ req }: { req: any }
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
				'secret',
				{
					expiresIn: '3d'
				}
			);

			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 3); // Add 3 days to the current date

			req.cookies.set('jwt', token, {
				httpOnly: false,
				expires: expirationDate
			});

			return token;
		},

		access: async (_root: any, { code }: { code: string }, { req }: { req: any }) => {
			if (!code) {
				throw new Error(`No token provided!`);
			}

			if (code !== 'secret') {
				throw new Error(`Invalid token!`);
			}

			const token = JWT.sign(
				{
					sub: {
						id: 'guest',
						username: 'guest',
						role: 'view'
					}
				},
				'secret',
				{
					expiresIn: '3d'
				}
			);

			const expirationDate = new Date();
			expirationDate.setDate(expirationDate.getDate() + 3); // Add 3 days to the current date

			req.cookies.set('jwt', token, {
				httpOnly: false,
				expires: expirationDate
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
		subscriptions: new Neo4jGraphQLSubscriptionsSingleInstancePlugin(),
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
export const GET = server.handleRequest;
export const OPTIONS = server.handleRequest;
