<script script lang="ts">
	import { client } from '$lib/apolloClient';
	import { gql } from '@apollo/client';
	import { DataSet, Network } from 'vis-network/standalone';
	import type { Edge, Node } from 'vis-network/standalone';
	import { focusedPersonId } from '../focusedPerson';

	type Person = {
		name: string;
		id: string;
		gotWith: {
			name: string;
			id: string;
		}[];
		dated: {
			name: string;
			id: string;
		}[];
		dating: {
			name: string;
			id: string;
		}[];
	};

	// Split label into multiple lines for better readability
	function splitLabel(label: string, maxLen: number = 20) {
		let result = '';
		let splitLabel = label.replace('-', ' ').split(' ');
		let thisLineCount = 0;
		for (let i = 0; i < splitLabel.length; i++) {
			let split = splitLabel[i];
			if (thisLineCount + split.length > maxLen) {
				result += '\n';
				thisLineCount = 0;
			}
			result += split + ' ';
			thisLineCount += split.length + 1;
		}
		return result.trim();
	}

	const GET_PEOPLE_QUERY = gql`
		query {
			people(
				where: {
					OR: [
						{ gotWithAggregate: { count_GTE: 1 } }
						{ datedAggregate: { count_GTE: 1 } }
						{ datingAggregate: { count_GTE: 1 } }
					]
				}
			) {
				name
				id
				gotWith {
					name
					id
				}
				dated {
					name
					id
				}
				dating {
					name
					id
				}
			}
		}
	`;

	let nodes: Node[] = [];
	let edges: Edge[] = [];

	client.query({ query: GET_PEOPLE_QUERY }).then((result: any) => {
		const data = result.data;
		const people = data.people;

		// Set colors
		const colors = ['#d9f99d', '#fde68a', '#fdba74', '#fecaca', '#fca5a5'];

		// Create nodes
		nodes = people.map((person: Person) => ({
			id: person.id,
			label: splitLabel(person.name),
			// number of connections
			color:
				colors[
					Math.min(
						person.gotWith.length + person.dated.length + person.dating.length,
						colors.length - 1
					)
				]
		}));

		// Create edges
		edges = people.reduce((result: Edge[], person: Person) => {
			const gotWithEdges = person.gotWith.map((gotWithPerson) => ({
				from: person.id,
				to: gotWithPerson.id,
				arrows: 'to;from',
				color: '#fecdd3'
			}));
			const datedEdges = person.dated.map((datedPerson) => ({
				from: person.id,
				to: datedPerson.id,
				arrows: 'to;from',
				color: '#ddd6fe'
			}));
			const datingEdges = person.dating.map((datingPerson) => ({
				from: person.id,
				to: datingPerson.id,
				arrows: 'to;from',
				color: '#5eead4'
			}));

			return [...result, ...gotWithEdges, ...datedEdges, ...datingEdges];
		}, []);

		const uniqueNodes = new Set();
		edges.forEach((edge: Edge) => {
			// Order alphabetically from and to
			if (edge.from && edge.to) {
				const from = edge.from < edge.to ? edge.from : edge.to;
				const to = edge.from < edge.to ? edge.to : edge.from;

				edge.from = from;
				edge.to = to;
				uniqueNodes.add(edge);
			}
		});

		const container = document.getElementById('network');

		const networkData = {
			nodes: new DataSet(nodes),
			edges: new DataSet(edges)
		};

		const options = {
			nodes: {
				shape: 'circle',
				size: 25,
				font: {
					size: 10
				},
				borderWidth: 2,
				borderWidthSelected: 4,
				scaling: {
					customScalingFunction: (min: number, max: number, total: number, value: number) => {
						return value / total;
					},
					min: 25,
					max: 50,
					label: {
						enabled: true
					}
				}
			},
			edges: {
				font: {
					size: 10,
					align: 'top'
				},
				smooth: {
					enabled: true,
					type: 'continuous',
					roundness: 0.5
				},
				arrows: {
					to: {
						enabled: true,
						scaleFactor: 0.5
					},
					middle: {
						enabled: true,
						scaleFactor: 0.5,
						type: 'bar'
					}
				}
			},
			interaction: {
				hover: true,
				selectable: true,
				selectConnectedEdges: false
			},
			physics: {
				enabled: true,
				barnesHut: {
					avoidOverlap: 0.1
				},
				solver: 'barnesHut'
			}
		};

		if (container === null) {
			throw new Error('Container is null');
		}

		const network = new Network(container, networkData, options);

		// If a person is focused, highlight their connections
		network.on('selectNode', (params) => {
			const nodeId = params.nodes[0];
			// const node = networkData.nodes.get(nodeId);

			// Get all edges connected to this node
			const connectedEdges = networkData.edges.get({
				filter: (edge: Edge) => edge.from === nodeId || edge.to === nodeId
			});

			// Get all nodes connected to this node
			const connectedNodes = connectedEdges.reduce((result: Node[], edge: Edge) => {
				const connectedNode = edge.from === nodeId ? edge.to : edge.from;
				const node = networkData.nodes.get(connectedNode || '');
				if (node) {
					return [...result, node];
				}
				return result;
			}, []);

			// Highlight all connected nodes and edges
			// networkData.nodes.update(
			// 	connectedNodes.map((node: Node) => ({
			// 		id: node.id,
			// 		color: '#F2F2F2'
			// 	}))
			// );

			// networkData.edges.update(
			// 	connectedEdges.map((edge: Edge) => ({
			// 		id: edge.id,
			// 		color: 'white'
			// 	}))
			// );

			focusedPersonId.set(nodeId);
		});
	});
</script>

<div class="h-full w-full" id="network" />
