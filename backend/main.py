from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
)
import dotenv
import os

dotenv.load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["JWT_SECRET_KEY"] = os.getenv("SECRET_KEY")
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
userDB = mongo.db.users


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    name = request.json.get("name")
    password = request.json.get("password")

    existing_user = userDB.find_one({"email": email})
    if existing_user:
        return jsonify({"message": "name already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user = {"name": name, "password": hashed_password, "email": email}

    userDB.insert_one(user)

    return jsonify({"message": "Registration successful"}), 201


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    user = userDB.find_one({"email": email})

    if user and bcrypt.check_password_hash(user["password"], password):
        access_token = create_access_token(
            identity=email, expires_delta=60 * 60 * 24 * 7
        )
        return jsonify({"access_token": access_token}), 200

    return jsonify({"message": "Invalid name or password"}), 401


@app.route("/user", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = userDB.find_one({"email": current_user})
    name = user["name"]
    return (
        jsonify({"message": "You are accessing a protected page, {}!".format(name)}),
        200,
    )


if __name__ == "__main__":
    app.run()
