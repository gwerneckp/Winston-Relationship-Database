from neo4j import GraphDatabase


class AppAPI:
    def __init__(self):
        # Define the Neo4j driver
        uri = "bolt://localhost:7687"
        user = "neo4j"
        password = "xxxxxxxx"

        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.cx = self.driver.session()

    def create_person(self, **kwargs):
        if 'name' not in kwargs:
            print("Name argument is missing")
            return

        cypher_properties = ", ".join(
            [f"{k}: '${k}'" for k in kwargs.keys()])

        self.cx.run(f"CREATE (:Person {{{cypher_properties}}})", **kwargs)

    def relationship(self, p1, relationship, p2):
        valid_relationships = ['FRIENDS_WITH',
                               'DONT_LIKE', 'GOT_WITH', 'DATED', 'DATING']

        if relationship not in valid_relationships:
            return

        self.cx.run(
            f"MATCH (p1:Person {{name: '{p1}'}}), (p2:Person {{name: '{p2}'}}) MERGE (p1)<-[:{relationship}]->(p2)")

    def get_person_info(self, name):
        # return relationships with other people
        result = self.cx.run(
            f"MATCH (p1:Person {{name: '{name}'}})-[r]->(p2:Person) RETURN p1, type(r), p2")

        return [record for record in result]

    def search(self, name):
        result = self.cx.run(
            f"MATCH (p:Person) WHERE toLower(p.name) CONTAINS toLower('{name}') RETURN p")
        return [record["p"]["name"] for record in result]
