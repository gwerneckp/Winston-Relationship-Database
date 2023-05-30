import neo4j
from uuid import uuid4

driver = neo4j.GraphDatabase.driver(
    "bolt://localhost:7687", auth=("neo4j", "xxxxxxxx"))

# execute query match all


def execute_query(query, **kwargs):
    with driver.session() as session:
        result = session.run(query, kwargs)
        return list(result)

def escape_quotes(string):
    return string.replace("'", "\\'")

for person in execute_query("MATCH (p:Person) RETURN p.name"):
    result = execute_query(
        f"MATCH (p:Person) WHERE p.name = '{escape_quotes(person['p.name'])}' SET p.id = $id RETURN p.id", id=str(uuid4()))
    print(f"Set id for {person['p.name']} to {result[0]['p.id']}")
