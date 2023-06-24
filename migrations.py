import datetime
import json
from uuid import uuid4

import neo4j

driver = neo4j.GraphDatabase.driver(
    "bolt://localhost:7687", auth=("neo4j", "churchill"))

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

    # set boolean property anonymous to false
    result2 = execute_query(
        f"MATCH (p:Person) WHERE p.name = '{escape_quotes(person['p.name'])}' SET p.anonymous = false RETURN p.anonymous")
    print(
        f"Set anonymous for {person['p.name']} to {result2[0]['p.anonymous']}")

for user in execute_query('MATCH (u:User) RETURN u.username'):
    result = execute_query(
        f"MATCH (u:User) WHERE u.username = '{escape_quotes(user['u.username'])}' SET u.id = $id RETURN u.id", id=str(uuid4()))
    print(f"Set id for {user['u.username']} to {result[0]['u.id']}")


for suggestion in execute_query('MATCH (s:Suggestion) RETURN s'):
    suggestion_data = suggestion['s']._properties
    suggestion_message = escape_quotes(suggestion_data['message'])
    suggestion_date = datetime.datetime.utcnow().isoformat(
        timespec='microseconds') + '000Z'
    suggestion_id = str(uuid4())
    suggestion_dealt_with = False

    execute_query(
        f"""
        MATCH (s:Suggestion) WHERE s.message = '{suggestion_message}' DELETE s
        CREATE (s1:Suggestion {{message: '{suggestion_message}', date: '{suggestion_date}', id: '{suggestion_id}', dealtWith: {suggestion_dealt_with}}})
        """
    )

    print(
        f"Created suggestion with id {suggestion_id} and message {suggestion_message}")
