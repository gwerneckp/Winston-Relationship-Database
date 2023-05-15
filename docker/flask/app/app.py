from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, redirect, render_template, request
from flask_jwt_extended import (JWTManager, create_access_token,
                                get_jwt_identity, jwt_required,
                                set_access_cookies, unset_jwt_cookies)
from neo4j_utils import NeoHandler

app = Flask(__name__,
            static_folder="./static",
            template_folder="./templates")
app.config['JWT_SECRET_KEY'] = 'X#h9#3mD$mE641nl77re'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

jwt = JWTManager(app)


def requires_edit_permission(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user:
            if current_user.get('permissions') != 'edit':
                return jsonify({'message': 'Insufficient permissions'}), 403

        return func(*args, **kwargs)
    return decorated_function


def requires_view_permission(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        current_user = get_jwt_identity()
        if current_user:
            if current_user.get('permissions') not in ['view', 'edit']:
                return jsonify({'message': 'Insufficient permissions'}), 403

        return func(*args, **kwargs)
    return decorated_function


api = NeoHandler('neo4j://neo4j:7687', 'neo4j', 'xxxxxxxx')


@app.route('/access', methods=['POST'])
def access():
    code = request.json.get('code', None)

    if code == 'church_churchill':
        access_token = create_access_token(identity={
            'user': 'guest',
            'permissions': 'view'
        })

        resp = jsonify({'access_token': access_token})
        set_access_cookies(resp, access_token)

        return resp, 200

    return jsonify({'message': 'Invalid code'}), 401


@app.route('/auth', methods=['POST'])
def authenticate():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    query = 'MATCH (u:User {username: $username, password: $password}) RETURN u'
    result = api.execute_query(query, username=username, password=password)
    if result:
        access_token = create_access_token(identity={
            'user': username,
            'permissions': 'edit'
        })

        resp = jsonify({'access_token': access_token})
        set_access_cookies(resp, access_token)

        return resp, 200

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/logout')
def logout():
    resp = redirect('/')
    unset_jwt_cookies(resp)

    return resp


@app.route('/')
@app.route('/index')
@jwt_required(optional=True)
def index():
    jwt = get_jwt_identity()
    if jwt:
        if jwt['permissions'] == 'edit':
            return render_template('index.html')
        if jwt['permissions'] == 'view':
            return render_template('view.html')

    return render_template('access_code.html')


@app.route('/disclaimer')
def disclaimer():
    return render_template('disclaimer.html')


@app.route('/create_person', methods=['POST'])
@jwt_required()
@requires_edit_permission
def create_person():
    data = request.json
    api.create_person(**data)
    return jsonify({"message": "Person created"}), 201


@app.route('/create_relationship', methods=['POST'])
@jwt_required()
@requires_edit_permission
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


@app.route('/delete_relationship', methods=['POST'])
@jwt_required()
@requires_edit_permission
def delete_relationship():
    data = request.json
    p1 = data["p1"]
    relationship = data["relationship"]
    p2 = data["p2"]
    try:
        if api.delete_relationship(p1, relationship, p2):
            return jsonify({"status": 201, "message": "Relationship deleted"}), 201
        return jsonify({'status': 400, 'message': 'Trying to delete relationship with inexistent node'}), 400

    except Exception as e:
        return jsonify({"status": 400, "message": str(e)}), 400


@app.route('/search', methods=['GET'])
@jwt_required(optional=True)
@requires_view_permission
def search_person():
    name = request.args.get('name', '')
    result = api.search(name)
    return jsonify({"persons": result})


@app.route('/get_person_info', methods=['GET'])
@jwt_required(optional=True)
@requires_view_permission
def get_person_info():
    name = request.args.get('name', '')
    try:
        result = api.get_person_info(name)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": 400, "message": str(e)}), 400


@app.route('/graph_data', methods=['GET'])
@jwt_required(optional=True)
@requires_view_permission
def graph_data():
    def splitLabel(label: str, maxLen: int = 20):
        result: str = ''
        splitLabel = label.replace('-', ' ').split(' ')
        thisLineCount = 0
        for split in splitLabel:
            if thisLineCount + len(split) > maxLen:
                result += '\n'
                thisLineCount = 0
            result += split + ' '
            thisLineCount += len(split) + 1
        return result

    query = '''
    MATCH (p1)-[r]->(p2)
    WHERE type(r) IN ['GOT_WITH', 'DATED', 'DATING']
    RETURN p1.name AS p1, type(r) AS relationship, p2.name AS p2
    '''
    results = api.execute_query(query)
    nodes = []
    edges = []

    if results is not None:
        for record in results:
            p1 = splitLabel(record["p1"])
            p2 = splitLabel(record["p2"])
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


@app.route('/suggestion', methods=['POST'])
@jwt_required(optional=True)
@requires_view_permission
def suggestion():
    message = request.json.get('message', None)
    user_agent = request.headers.get('User-Agent')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    if suggestion:
        cypherquery = 'CREATE (s:Suggestion {message: $message, user_agent: $user_agent, timestamp: $timestamp})'

        api.execute_query(cypherquery, message=message,
                          ip=ip, user_agent=user_agent, timestamp=timestamp)

        return jsonify({"status": 201, "message": "Suggestion created"}), 201

    return jsonify({"status": 400, "message": "No message provided"}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
