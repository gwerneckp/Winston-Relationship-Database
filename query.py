from neo4j import GraphDatabase

# Define the Neo4j driver
uri = "bolt://localhost:7687"
user = "neo4j"
password = "changethispasswd"
driver = GraphDatabase.driver(uri, auth=(user, password))

# Define a function to retrieve all "Person" nodes
def get_people(tx):
    result = tx.run("MATCH (p:Person) RETURN p")
    return [record["p"]["name"] for record in result]

# Retrieve all "Person" nodes from Neo4j and print their names to the console
with driver.session() as session:
    tx = session.begin_transaction()
    people = get_people(tx)
    print("People:")
    for person in people:
        print(person)

# Close the Neo4j driver
driver.close()
