from flask import Flask, jsonify, render_template, request

from neo4j_utils import NeoHandler

app = Flask(__name__,
            static_folder="./static",
            template_folder="./templates")

api = NeoHandler('neo4j://localhost:7687', 'neo4j', 'xxxxxxxx')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/create_person', methods=['POST'])
def create_person():
    data = request.json
    api.create_person(**data)
    return jsonify({"message": "Person created"}), 201


@app.route('/create_relationship', methods=['POST'])
def create_relationship():
    data = request.json
    p1 = data["p1"]
    relationship = data["relationship"]
    p2 = data["p2"]
    try:
        if api.relationship(p1, relationship, p2):
            return jsonify({"status": 201, "message": "Relationship created"}), 201
        return jsonify({'status': 400, 'message': 'Trying to create relationship with inexistent node'}), 400
    except Exception as e:
        return jsonify({"status": 400, "message": str(e)}), 400


@app.route('/search', methods=['GET'])
def search_person():
    name = request.args.get('name', '')
    result = api.search(name)
    return jsonify({"persons": result})


@app.route('/get_person_info', methods=['GET'])
def get_person_info():
    name = request.args.get('name', '')
    try:
        result = api.get_person_info(name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": 400, "message": str(e)}), 400


@app.route('/graph_data', methods=['GET'])
def graph_data():
    query = '''
    MATCH (p1)-[r]->(p2)
    RETURN p1.name AS p1, type(r) AS relationship, p2.name AS p2
    '''
    results = api.execute_query(query)
    nodes = []
    edges = []

    if results is not None:
        for record in results:
            p1 = record["p1"]
            p2 = record["p2"]
            relationship = record["relationship"]

            if p1 not in nodes:
                nodes.append(p1)

            if p2 not in nodes:
                nodes.append(p2)

        # Direction is bi-directional
        # How to make the arrows bi-directional?

            edges.append(
                {"from": p1, "to": p2, "label": relationship, "arrows": "to;from"})

    return jsonify({"nodes": nodes, "edges": edges})


if __name__ == '__main__':
    app.run(debug=True)
