def create_person(**kwargs):
    if 'name' not in kwargs:
        print("Name argument is missing")
        return

    cypher_properties = ", ".join(
        [f"{k}: '${v}'" for k, v in kwargs.items()])
    
    # "CREATE (:Person {name: $name})", name=name)
    query = f"CREATE (:Person {cypher_properties})"

    return query


d = {
    'name': 'John',
    'age': 20,
    'grade': 10
}
print(create_person(**d))
