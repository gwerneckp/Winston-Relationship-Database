from flask import Flask, jsonify, request, render_template
from SchoolAPI import AppAPI

app = Flask(__name__)

api = AppAPI('neo4j://localhost:7687', 'neo4j', 'xxxxxxxx')


# define template route


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
    api.relationship(p1, relationship, p2)
    return jsonify({"message": "Relationship created"}), 201


@app.route('/search', methods=['GET'])
def search_person():
    name = request.args.get('name', '')
    result = api.search(name)
    return jsonify({"persons": result})


@app.route('/get_person_info', methods=['GET'])
def get_person_info():
    name = request.args.get('name', '')
    result = api.get_person_info(name)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
