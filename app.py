from flask import Flask, jsonify, request
from interactive import AppAPI

app = Flask(__name__)

api = AppAPI()


@app.route('/')
def index():
    return "Welcome to the Churchill Database"


@app.route('/create_person', methods=['POST'])
def create_person():
    data = request.json
    api.create_person(**data)
    from interactive import AppAPI
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
    formatted_result = [{"person1": record["p1"]["name"],
                         "relationship": record["type(r)"], "person2": record["p2"]["name"]} for record in result]
    return jsonify({"info": formatted_result})


if __name__ == '__main__':
    app.run(debug=True)
